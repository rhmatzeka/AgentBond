import { pricingBenchmarks } from "@/lib/data/pricing-benchmarks";
import type { TaskType } from "@/lib/types/agent";

export function calculateRecommendedMaxPrice(taskType: TaskType) {
  return pricingBenchmarks[taskType].max;
}

export function calculatePricingScore(params: {
  taskType: TaskType;
  proposedPriceUsdc: number;
  outputQualityScore: number;
}) {
  const benchmark = pricingBenchmarks[params.taskType];
  const price = params.proposedPriceUsdc;

  if (price >= benchmark.min && price <= benchmark.max) return 100;
  if (price < benchmark.min && params.outputQualityScore < 50) return 30;
  if (price < benchmark.min) return 75;

  const overage = (price - benchmark.max) / benchmark.max;
  if (overage <= 0.25) return 80;
  if (overage <= 0.75) return 60;
  return 40;
}
