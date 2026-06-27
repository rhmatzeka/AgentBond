import { saveReport } from "@/lib/data/reports-store";
import { generateRiskReport } from "@/lib/agents/agentbond-orchestrator";
import type { RiskCheckRequest } from "@/lib/types/report";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RiskCheckRequest;
    const report = saveReport(generateRiskReport(body));
    return Response.json({ report });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to generate risk report" },
      { status: 400 },
    );
  }
}
