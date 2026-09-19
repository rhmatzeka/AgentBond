import { handleRiskReportRequest } from "@/lib/api/risk-report-handler";

export async function POST(request: Request) {
  return handleRiskReportRequest(request, (report) => ({ report }));
}
