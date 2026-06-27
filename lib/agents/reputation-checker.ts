import { calculateReputationScore } from "@/lib/scoring/reputation-score";
import type { SellerAgent } from "@/lib/types/agent";
import type { CheckerResult } from "@/lib/types/checker";

export function runReputationChecker(agent: SellerAgent): CheckerResult {
  const score = calculateReputationScore(agent);
  const riskFlags = [];
  if (agent.uniqueBuyers <= 1) riskFlags.push("low_buyer_diversity");
  if (agent.suspiciousActivity) riskFlags.push("suspicious_activity");
  if (agent.failedJobs > agent.completedJobs / 2) riskFlags.push("high_failure_rate");

  return {
    checkerName: "ReputationChecker",
    score,
    riskFlags,
    notes:
      score >= 80
        ? ["Healthy completion rate, rating, and buyer diversity."]
        : score >= 50
          ? ["Reputation is mixed and should be verified before higher-value payments."]
          : ["Reputation signals show elevated risk for buyer agents."],
  };
}
