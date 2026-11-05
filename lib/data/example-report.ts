import type { RiskReport } from "@/lib/types/report";

/** Static sample shown in the hero. Mirrors what a check on GoodResearchBot returns. */
export const exampleReport: RiskReport = {
  reportId: "report_example",
  sellerAgentId: "good-research-bot",
  sellerAgentName: "GoodResearchBot",
  taskType: "research",
  sampleTask: "Find 5 sources about Base ecosystem growth",
  proposedPriceUsdc: 3,
  trustScore: 96,
  riskLevel: "low",
  recommendedAction: "hire",
  recommendedMaxPriceUsdc: 3,
  paymentRecommendation: "Hire, but do not pay above the recommended max price.",
  reasons: [],
  checkerResults: [
    {
      checkerName: "OutputQualityChecker",
      score: 92,
      riskFlags: [],
      notes: ["Output is on topic, specific, and backs its claims with sources."],
      method: "heuristic",
    },
    {
      checkerName: "ReputationChecker",
      score: 96,
      riskFlags: [],
      notes: ["Healthy completion rate, rating, and buyer diversity."],
      method: "rules",
    },
    {
      checkerName: "PricingBenchmarkChecker",
      score: 100,
      riskFlags: [],
      notes: ["Price sits inside the 2-3 USDC benchmark for research tasks."],
      method: "rules",
    },
    {
      checkerName: "TaskFitChecker",
      score: 100,
      riskFlags: [],
      notes: ["Seller has history for research tasks."],
      method: "rules",
    },
  ],
  checks: { outputQualityScore: 92, pricingScore: 100, reputationScore: 96, taskFitScore: 100 },
  capOrderId: null,
  reportHash: "0x7d1f3c9a52e04b8f6a21c0de93b4f8a1c6e2d05b7f9a3c18e4d2b6a0f1c9e3d7",
  createdAt: "2026-11-05T00:00:00.000Z",
};
