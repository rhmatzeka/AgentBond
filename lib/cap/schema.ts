import type { CapRiskReportResponse } from "@/lib/types/cap";
import type { RiskReport } from "@/lib/types/report";

export function toCapRiskReportResponse(report: RiskReport): CapRiskReportResponse {
  return {
    reportId: report.reportId,
    sellerAgentId: report.sellerAgentId,
    trustScore: report.trustScore,
    riskLevel: report.riskLevel,
    recommendedAction: report.recommendedAction,
    recommendedMaxPriceUsdc: report.recommendedMaxPriceUsdc,
    reasons: report.reasons,
    reportHash: report.reportHash,
  };
}
