import { pricingBenchmarks } from "@/lib/data/pricing-benchmarks";
import type { TaskType } from "@/lib/types/agent";
import type { RiskLevel } from "@/lib/types/report";

/** Price ceiling for the buyer: the full benchmark for low risk, its floor for high risk. */
export function calculateRecommendedMaxPrice(taskType: TaskType, riskLevel: RiskLevel) {
  const { min, max } = pricingBenchmarks[taskType];
  const ceiling = { low: max, medium: (min + max) / 2, high: min }[riskLevel];
  return Math.round(ceiling * 100) / 100;
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
