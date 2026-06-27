import { getDemoAgent } from "@/lib/data/demo-agents";
import { calculateRecommendedMaxPrice } from "@/lib/scoring/pricing-score";
import { calculateTrustScore, getRecommendedAction, getRiskLevel } from "@/lib/scoring/trust-score";
import type { RiskCheckRequest, RiskReport } from "@/lib/types/report";
import { createId } from "@/lib/utils/ids";
import { hashReport } from "@/lib/web3/report-hash";
import { runOutputQualityChecker } from "./output-quality-checker";
import { runPricingBenchmarkChecker } from "./pricing-benchmark-checker";
import { runReputationChecker } from "./reputation-checker";
import { runTaskFitChecker } from "./task-fit-checker";

export function generateRiskReport(request: RiskCheckRequest): RiskReport {
  const agent = getDemoAgent(request.sellerAgentId);
  if (!agent) {
    throw new Error(`Unknown seller agent: ${request.sellerAgentId}`);
  }

  const outputQuality = runOutputQualityChecker(agent, request.sampleOutput || agent.sampleOutput);
  const pricing = runPricingBenchmarkChecker({
    taskType: request.taskType,
    proposedPriceUsdc: request.proposedPriceUsdc,
    outputQualityScore: outputQuality.score,
  });
  const reputation = runReputationChecker(agent);
  const taskFit = runTaskFitChecker(agent, request.taskType);

  const checks = {
    outputQualityScore: outputQuality.score,
    pricingScore: pricing.score,
    reputationScore: reputation.score,
    taskFitScore: taskFit.score,
  };
  const trustScore = calculateTrustScore(checks);
  const riskLevel = getRiskLevel(trustScore);
  const recommendedAction = getRecommendedAction(trustScore);
  const recommendedMaxPriceUsdc = calculateRecommendedMaxPrice(request.taskType);
  const reasons = [outputQuality.notes[0], pricing.notes[0], reputation.notes[0], taskFit.notes[0]];

  const reportWithoutHash = {
    reportId: createId("report"),
    sellerAgentId: agent.id,
    sellerAgentName: agent.name,
    taskType: request.taskType,
    trustScore,
    riskLevel,
    recommendedAction,
    recommendedMaxPriceUsdc,
    paymentRecommendation:
      riskLevel === "low"
        ? "Hire, but do not overpay above the recommended max price."
        : riskLevel === "medium"
          ? "Use milestone payment or verify delivery before full payment."
          : "Avoid this seller or require strong manual verification before payment.",
    reasons,
    checkerResults: [outputQuality, pricing, reputation, taskFit],
    checks,
    capOrderId: request.capOrderId || createId("cap_demo_order"),
    createdAt: new Date().toISOString(),
  };

  return {
    ...reportWithoutHash,
    reportHash: hashReport(reportWithoutHash),
  };
}
