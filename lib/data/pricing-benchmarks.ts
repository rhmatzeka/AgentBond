import type { TaskType } from "@/lib/types/agent";

export const pricingBenchmarks: Record<TaskType, { min: number; max: number }> = {
  research: { min: 2, max: 3 },
  summary: { min: 0.5, max: 1 },
  code_review: { min: 3, max: 5 },
  data_extraction: { min: 1, max: 2 },
};
