import type { RecommendedAction, RiskLevel } from "@/lib/types/report";

export function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function calculateTrustScore(scores: {
  outputQualityScore: number;
  reputationScore: number;
  pricingScore: number;
  taskFitScore: number;
}) {
  return clampScore(
    scores.outputQualityScore * 0.4 +
      scores.reputationScore * 0.3 +
      scores.pricingScore * 0.2 +
      scores.taskFitScore * 0.1,
  );
}

export function getRiskLevel(score: number): RiskLevel {
  if (score <= 39) return "high";
  if (score <= 69) return "medium";
  return "low";
}

export function getRecommendedAction(score: number): RecommendedAction {
  if (score <= 39) return "avoid";
  if (score <= 69) return "verify";
  return "hire";
}
