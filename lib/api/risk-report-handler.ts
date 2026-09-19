import { generateRiskReport, UnknownSellerAgentError } from "@/lib/agents/agentbond-orchestrator";
import { saveReport } from "@/lib/data/reports-store";
import type { RiskReport } from "@/lib/types/report";
import { parseRiskCheckRequest, ValidationError } from "@/lib/validation/risk-check";

/**
 * Shared POST handler for the dashboard and CAP endpoints: parse and validate the
 * body, score the seller, persist the report, then shape the response.
 */
export async function handleRiskReportRequest<T>(request: Request, toResponse: (report: RiskReport) => T) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  try {
    const report = saveReport(generateRiskReport(parseRiskCheckRequest(body)));
    return Response.json(toResponse(report));
  } catch (error) {
    if (error instanceof ValidationError) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof UnknownSellerAgentError) {
      return Response.json({ error: error.message }, { status: 404 });
    }
    console.error("Risk report generation failed", error);
    return Response.json({ error: "Failed to generate risk report" }, { status: 500 });
  }
}
