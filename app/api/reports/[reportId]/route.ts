import { getReportStore } from "@/lib/data/reports-store";

export async function GET(_: Request, context: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await context.params;
  const report = await getReportStore().get(reportId);
  if (!report) {
    return Response.json({ error: "Report not found" }, { status: 404 });
  }
  return Response.json({ report });
}
