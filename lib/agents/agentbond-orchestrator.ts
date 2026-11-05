import { getDemoAgent } from "@/lib/data/demo-agents";
import { getDefaultQualityJudge, type QualityJudge } from "@/lib/llm/quality-judge";
import { calculateRecommendedMaxPrice } from "@/lib/scoring/pricing-score";
import { calculateTrustScore, getRecommendedAction, getRiskLevel } from "@/lib/scoring/trust-score";
import type { RiskCheckRequest, RiskLevel, RiskReport } from "@/lib/types/report";
import { hashReport } from "@/lib/web3/report-hash";
import { runOutputQualityChecker } from "./output-quality-checker";
import { runPricingBenchmarkChecker } from "./pricing-benchmark-checker";
import { runReputationChecker } from "./reputation-checker";
import { runTaskFitChecker } from "./task-fit-checker";

export class UnknownSellerAgentError extends Error {
  constructor(sellerAgentId: string) {
    super(`Unknown seller agent: ${sellerAgentId}`);
  }
}

const paymentRecommendations: Record<RiskLevel, string> = {
  low: "Hire, but do not pay above the recommended max price.",
  medium: "Pay per milestone, or verify the delivery before releasing the full amount.",
  high: "Avoid this seller, or verify the work by hand before any payment.",
};

const MAX_SAMPLE_TASK_CHARS = 500;

export async function generateRiskReport(
  request: RiskCheckRequest,
  deps: { judge?: QualityJudge | null } = {},
): Promise<RiskReport> {
  const agent = getDemoAgent(request.sellerAgentId);
  if (!agent) {
    throw new UnknownSellerAgentError(request.sellerAgentId);
  }

  const judge = deps.judge === undefined ? getDefaultQualityJudge() : deps.judge;
  const outputQuality = await runOutputQualityChecker(
    { taskType: request.taskType, task: request.sampleTask, output: request.sampleOutput.trim() || agent.sampleOutput },
    judge,
  );
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
  const checkerResults = [outputQuality, pricing, reputation, taskFit];

  const reportWithoutHash = {
    reportId: `report_${crypto.randomUUID().replaceAll("-", "").slice(0, 20)}`,
    sellerAgentId: agent.id,
    sellerAgentName: agent.name,
    taskType: request.taskType,
    sampleTask: request.sampleTask.slice(0, MAX_SAMPLE_TASK_CHARS),
    proposedPriceUsdc: request.proposedPriceUsdc,
    trustScore,
    riskLevel,
    recommendedAction: getRecommendedAction(trustScore),
    recommendedMaxPriceUsdc: calculateRecommendedMaxPrice(request.taskType, riskLevel),
    paymentRecommendation: paymentRecommendations[riskLevel],
    reasons: checkerResults.map((result) => result.notes[0]),
    checkerResults,
    checks,
    capOrderId: request.capOrderId ?? null,
    createdAt: new Date().toISOString(),
  };

  return { ...reportWithoutHash, reportHash: hashReport(reportWithoutHash) };
}
