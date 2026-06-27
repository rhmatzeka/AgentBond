import type { TaskType } from "./agent";
import type { CheckerResult } from "./checker";

export type RiskLevel = "low" | "medium" | "high";
export type RecommendedAction = "hire" | "verify" | "avoid";

export type RiskCheckRequest = {
  sellerAgentId: string;
  taskType: TaskType;
  proposedPriceUsdc: number;
  sampleTask: string;
  sampleOutput: string;
  capOrderId?: string;
};

export type RiskReport = {
  reportId: string;
  sellerAgentId: string;
  sellerAgentName: string;
  taskType: TaskType;
  trustScore: number;
  riskLevel: RiskLevel;
  recommendedAction: RecommendedAction;
  recommendedMaxPriceUsdc: number;
  paymentRecommendation: string;
  reasons: string[];
  checkerResults: CheckerResult[];
  checks: {
    outputQualityScore: number;
    pricingScore: number;
    reputationScore: number;
    taskFitScore: number;
  };
  capOrderId: string;
  reportHash: `0x${string}`;
  baseTransactionHash?: `0x${string}`;
  createdAt: string;
};
