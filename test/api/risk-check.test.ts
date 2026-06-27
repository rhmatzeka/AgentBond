import { describe, expect, it } from "vitest";
import { demoAgents } from "@/lib/data/demo-agents";
import { generateRiskReport } from "@/lib/agents/agentbond-orchestrator";

describe("risk check orchestration", () => {
  it("returns a low risk report for GoodResearchBot", () => {
    const agent = demoAgents.find((item) => item.id === "good-research-bot")!;
    const report = generateRiskReport({
      sellerAgentId: agent.id,
      taskType: "research",
      proposedPriceUsdc: agent.defaultPriceUsdc,
      sampleTask: "Find 5 sources about Base ecosystem growth",
      sampleOutput: agent.sampleOutput,
    });

    expect(report.riskLevel).toBe("low");
    expect(report.recommendedAction).toBe("hire");
    expect(report.checkerResults).toHaveLength(4);
    expect(report.reportHash).toMatch(/^0x/);
  });

  it("returns a high risk report for CheapSpamBot", () => {
    const agent = demoAgents.find((item) => item.id === "cheap-spam-bot")!;
    const report = generateRiskReport({
      sellerAgentId: agent.id,
      taskType: "research",
      proposedPriceUsdc: agent.defaultPriceUsdc,
      sampleTask: "Find 5 sources about Base ecosystem growth",
      sampleOutput: agent.sampleOutput,
    });

    expect(report.riskLevel).toBe("high");
    expect(report.recommendedAction).toBe("avoid");
  });
});
