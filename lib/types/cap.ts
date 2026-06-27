import type { RiskCheckRequest, RiskReport } from "./report";

export type CapRiskReportRequest = RiskCheckRequest;

export type CapRiskReportResponse = Pick<
  RiskReport,
  | "reportId"
  | "sellerAgentId"
  | "trustScore"
  | "riskLevel"
  | "recommendedAction"
  | "recommendedMaxPriceUsdc"
  | "reasons"
  | "reportHash"
>;
