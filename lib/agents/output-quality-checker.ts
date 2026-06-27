import { calculateOutputQualityScore } from "@/lib/scoring/output-quality-score";
import type { SellerAgent } from "@/lib/types/agent";
import type { CheckerResult } from "@/lib/types/checker";

export function runOutputQualityChecker(agent: SellerAgent, sampleOutput: string): CheckerResult {
  const score = calculateOutputQualityScore(agent, sampleOutput);
  return {
    checkerName: "OutputQualityChecker",
    score,
    riskFlags: score < 50 ? ["low_output_quality"] : [],
    notes:
      score >= 80
        ? ["Output is complete, clear, and evidence-oriented."]
        : score >= 50
          ? ["Output is usable but needs stronger evidence or completeness."]
          : ["Output is short, generic, or likely low value for the buyer."],
  };
}
