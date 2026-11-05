import { pricingBenchmarks } from "@/lib/data/pricing-benchmarks";
import { calculatePricingScore } from "@/lib/scoring/pricing-score";
import type { TaskType } from "@/lib/types/agent";
import type { CheckerResult } from "@/lib/types/checker";

export function runPricingBenchmarkChecker(params: {
  taskType: TaskType;
  proposedPriceUsdc: number;
  outputQualityScore: number;
}): CheckerResult {
  const score = calculatePricingScore(params);
  const { min, max } = pricingBenchmarks[params.taskType];
  const price = params.proposedPriceUsdc;

  let note = `Price sits inside the ${min}-${max} USDC benchmark for ${params.taskType} tasks.`;
  if (price > max) note = `Price is above the ${max} USDC benchmark ceiling for ${params.taskType} tasks.`;
  else if (price < min && params.outputQualityScore < 50) {
    note = `Price is below the ${min} USDC floor and the output is weak, a common spam pattern.`;
  } else if (price < min) note = `Price is below the ${min} USDC benchmark floor, which is cheap but plausible.`;

  return {
    checkerName: "PricingBenchmarkChecker",
    score,
    riskFlags: score < 60 ? ["price_outside_benchmark"] : [],
    notes: [note],
    method: "rules",
  };
}
