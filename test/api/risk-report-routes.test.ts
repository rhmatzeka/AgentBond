import { describe, expect, it } from "vitest";
import { POST as capPost } from "@/app/api/cap/generate-risk-report/route";
import { GET as getReport } from "@/app/api/reports/[reportId]/route";
import { POST as riskCheckPost } from "@/app/api/risk-check/route";

function jsonRequest(body: unknown) {
  return new Request("http://localhost/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const validBody = {
  sellerAgentId: "good-research-bot",
  taskType: "research",
  proposedPriceUsdc: 3,
  sampleTask: "Find 5 sources about Base ecosystem growth",
  sampleOutput: "Sources: Base docs, L2Beat, DefiLlama.",
};

describe("risk report API routes", () => {
  it("creates a report and makes it retrievable by id", async () => {
    const response = await riskCheckPost(jsonRequest(validBody));
    expect(response.status).toBe(200);
    const { report } = await response.json();
    expect(report.sellerAgentId).toBe("good-research-bot");

    const lookup = await getReport(new Request("http://localhost"), {
      params: Promise.resolve({ reportId: report.reportId }),
    });
    expect(lookup.status).toBe(200);
  });

  it("returns the compact CAP response shape", async () => {
    const response = await capPost(jsonRequest({ ...validBody, capOrderId: "cap_order_123" }));
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(Object.keys(payload).sort()).toEqual(
      [
        "reasons",
        "recommendedAction",
        "recommendedMaxPriceUsdc",
        "reportHash",
        "reportId",
        "riskLevel",
        "sellerAgentId",
        "trustScore",
      ].sort(),
    );
  });

  it("rejects malformed JSON with 400", async () => {
    const response = await riskCheckPost(jsonRequest("{not json"));
    expect(response.status).toBe(400);
  });

  it("rejects an invalid task type with 400 instead of crashing", async () => {
    const response = await riskCheckPost(jsonRequest({ ...validBody, taskType: "poetry" }));
    expect(response.status).toBe(400);
    expect((await response.json()).error).toMatch(/taskType/);
  });

  it("returns 404 for an unknown seller agent", async () => {
    const response = await capPost(jsonRequest({ ...validBody, sellerAgentId: "ghost-bot" }));
    expect(response.status).toBe(404);
  });
});
