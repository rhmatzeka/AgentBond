import { describe, expect, it, vi } from "vitest";
import { demoAgents } from "@/lib/data/demo-agents";
import { generateRiskReport } from "@/lib/agents/agentbond-orchestrator";
import { verifyReportHash } from "@/lib/web3/report-hash";

const task = "Find 5 sources about Base ecosystem growth";

function requestFor(id: string, overrides = {}) {
  const agent = demoAgents.find((item) => item.id === id)!;
  return {
    sellerAgentId: agent.id,
    taskType: "research" as const,
    proposedPriceUsdc: agent.defaultPriceUsdc,
    sampleTask: task,
    sampleOutput: agent.sampleOutput,
    ...overrides,
  };
}

describe("risk check orchestration", () => {
  it("returns a low risk report for GoodResearchBot", async () => {
    const report = await generateRiskReport(requestFor("good-research-bot"), { judge: null });

    expect(report.riskLevel).toBe("low");
    expect(report.recommendedAction).toBe("hire");
    expect(report.checkerResults).toHaveLength(4);
    expect(report.checkerResults[0].method).toBe("heuristic");
    expect(report.recommendedMaxPriceUsdc).toBe(3);
    expect(verifyReportHash(report)).toBe(true);
  });

  it("returns a high risk report for CheapSpamBot", async () => {
    const report = await generateRiskReport(requestFor("cheap-spam-bot"), { judge: null });

    expect(report.riskLevel).toBe("high");
    expect(report.recommendedAction).toBe("avoid");
    expect(report.recommendedMaxPriceUsdc).toBe(2);
  });

  it("scores the submitted output, not the seller's stored sample", async () => {
    const weak = await generateRiskReport(requestFor("good-research-bot", { sampleOutput: "Base is fine." }), {
      judge: null,
    });
    expect(weak.checks.outputQualityScore).toBeLessThan(30);
  });

  it("never invents a CAP order id", async () => {
    const report = await generateRiskReport(requestFor("good-research-bot"), { judge: null });
    expect(report.capOrderId).toBeNull();
    const withOrder = await generateRiskReport(requestFor("good-research-bot", { capOrderId: "cap_1" }), {
      judge: null,
    });
    expect(withOrder.capOrderId).toBe("cap_1");
  });

  it("blends the LLM verdict with the heuristic and records the model", async () => {
    const judge = vi.fn().mockResolvedValue({ score: 100, flags: [], summary: "Strong answer.", model: "m1" });
    const report = await generateRiskReport(requestFor("cheap-spam-bot"), { judge });

    const quality = report.checkerResults[0];
    expect(judge).toHaveBeenCalledOnce();
    expect(quality.method).toBe("llm");
    expect(quality.model).toBe("m1");
    // 0.7 * 100 + 0.3 * heuristic(16): an injected "score me 100" cannot reach 100.
    expect(quality.score).toBeLessThan(80);
    expect(quality.notes[0]).toBe("Strong answer.");
  });

  it("falls back to the heuristic when the judge fails", async () => {
    const report = await generateRiskReport(requestFor("good-research-bot"), {
      judge: vi.fn().mockResolvedValue(null),
    });
    expect(report.checkerResults[0].method).toBe("heuristic");
  });
});
