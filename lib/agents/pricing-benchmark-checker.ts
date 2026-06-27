import { calculatePricingScore, calculateRecommendedMaxPrice } from "@/lib/scoring/pricing-score";
import type { TaskType } from "@/lib/types/agent";
import type { CheckerResult } from "@/lib/types/checker";

export function runPricingBenchmarkChecker(params: {
  taskType: TaskType;
  proposedPriceUsdc: number;
  outputQualityScore: number;
}): CheckerResult {
  const score = calculatePricingScore(params);
  const max = calculateRecommendedMaxPrice(params.taskType);
  return {
    checkerName: "PricingBenchmarkChecker",
    score,
    riskFlags: score < 60 ? ["price_outside_benchmark"] : [],
    notes:
      params.proposedPriceUsdc <= max
        ? [`Price is within or below the benchmark for ${params.taskType} tasks.`]
        : [`Proposed price is above the recommended max of ${max} USDC.`],
  };
}
