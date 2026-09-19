import { handleRiskReportRequest } from "@/lib/api/risk-report-handler";
import { toCapRiskReportResponse } from "@/lib/cap/schema";

export async function POST(request: Request) {
  return handleRiskReportRequest(request, toCapRiskReportResponse);
}
