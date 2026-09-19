import { describe, expect, it } from "vitest";
import { parseRiskCheckRequest, ValidationError } from "@/lib/validation/risk-check";

const base = { sellerAgentId: "good-research-bot", taskType: "research", proposedPriceUsdc: 3 };

describe("parseRiskCheckRequest", () => {
  it("accepts a minimal request and defaults optional text fields", () => {
    expect(parseRiskCheckRequest(base)).toEqual({
      ...base,
      sampleTask: "",
      sampleOutput: "",
      capOrderId: undefined,
    });
  });

  it.each([
    ["a non-object body", null],
    ["an array body", []],
    ["a missing seller id", { ...base, sellerAgentId: "  " }],
    ["an unknown task type", { ...base, taskType: "poetry" }],
    ["a negative price", { ...base, proposedPriceUsdc: -1 }],
    ["a string price", { ...base, proposedPriceUsdc: "3" }],
    ["a non-string sample output", { ...base, sampleOutput: 42 }],
  ])("rejects %s", (_, body) => {
    expect(() => parseRiskCheckRequest(body)).toThrow(ValidationError);
  });
});
