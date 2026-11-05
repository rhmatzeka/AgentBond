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

export type ReportAnchor = {
  txHash: `0x${string}`;
  requester: `0x${string}`;
  blockNumber: number;
  anchoredAt: string;
};

export type RiskReport = {
  reportId: string;
  sellerAgentId: string;
  sellerAgentName: string;
  taskType: TaskType;
  sampleTask: string;
  proposedPriceUsdc: number;
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
  /** Order reference passed in by the caller (e.g. a CAP order). Never invented. */
  capOrderId: string | null;
  /** sha256 over every field above, see lib/web3/report-hash.ts. */
  reportHash: `0x${string}`;
  /** Set once the hash is verified on the Base Sepolia registry. Not part of the hash. */
  anchor?: ReportAnchor;
  createdAt: string;
};
