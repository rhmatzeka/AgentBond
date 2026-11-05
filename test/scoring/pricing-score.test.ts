import { describe, expect, it } from "vitest";
import { calculatePricingScore, calculateRecommendedMaxPrice } from "@/lib/scoring/pricing-score";

describe("pricing score", () => {
  it("gives high score for price inside benchmark", () => {
    expect(calculatePricingScore({ taskType: "research", proposedPriceUsdc: 3, outputQualityScore: 90 })).toBe(100);
  });

  it("lowers score when price is above benchmark", () => {
    expect(calculatePricingScore({ taskType: "research", proposedPriceUsdc: 5, outputQualityScore: 90 })).toBe(60);
  });

  it("flags suspiciously cheap price when quality is low", () => {
    expect(calculatePricingScore({ taskType: "research", proposedPriceUsdc: 0.5, outputQualityScore: 30 })).toBe(30);
  });
});

describe("recommended max price", () => {
  it("tightens the ceiling as risk rises", () => {
    expect(calculateRecommendedMaxPrice("code_review", "low")).toBe(5);
    expect(calculateRecommendedMaxPrice("code_review", "medium")).toBe(4);
    expect(calculateRecommendedMaxPrice("code_review", "high")).toBe(3);
    expect(calculateRecommendedMaxPrice("summary", "medium")).toBe(0.75);
  });
});
