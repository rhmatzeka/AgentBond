import { generateRiskReport } from "@/lib/agents/agentbond-orchestrator";
import { toCapRiskReportResponse } from "@/lib/cap/schema";
import { saveReport } from "@/lib/data/reports-store";
import type { CapRiskReportRequest } from "@/lib/types/cap";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CapRiskReportRequest;
    const report = saveReport(generateRiskReport(body));
    return Response.json(toCapRiskReportResponse(report));
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "CAP risk report failed" },
      { status: 400 },
    );
  }
}
