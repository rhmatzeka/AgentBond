import { describe, expect, it } from "vitest";
import { calculateTrustScore, clampScore, getRecommendedAction, getRiskLevel } from "@/lib/scoring/trust-score";

describe("trust score", () => {
  it("calculates the weighted trust score", () => {
    expect(
      calculateTrustScore({
        outputQualityScore: 90,
        reputationScore: 80,
        pricingScore: 70,
        taskFitScore: 100,
      }),
    ).toBe(84);
  });

  it("clamps scores between 0 and 100", () => {
    expect(clampScore(-20)).toBe(0);
    expect(clampScore(120)).toBe(100);
  });

  it("maps scores to risk levels and actions", () => {
    expect(getRiskLevel(34)).toBe("high");
    expect(getRiskLevel(55)).toBe("medium");
    expect(getRiskLevel(88)).toBe("low");
    expect(getRecommendedAction(34)).toBe("avoid");
    expect(getRecommendedAction(55)).toBe("verify");
    expect(getRecommendedAction(88)).toBe("hire");
  });
});
