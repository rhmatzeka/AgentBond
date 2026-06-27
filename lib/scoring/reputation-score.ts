import type { SellerAgent } from "@/lib/types/agent";
import { clampScore } from "./trust-score";

export function calculateReputationScore(agent: SellerAgent) {
  const totalJobs = Math.max(agent.completedJobs + agent.failedJobs, 1);
  const completionRate = agent.completedJobs / totalJobs;
  const rating = agent.averageRating / 5;
  const buyerDiversity = Math.min(agent.uniqueBuyers / 5, 1);
  const suspicious = agent.suspiciousActivity ? 0.15 : 1;

  return clampScore(
    completionRate * 40 + rating * 25 + buyerDiversity * 20 + suspicious * 15 - agent.refundCount * 3,
  );
}
