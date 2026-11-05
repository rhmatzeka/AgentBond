import { getReportStore } from "@/lib/data/reports-store";

const MAX_LIMIT = 100;

export async function GET(request: Request) {
  const requested = Number(new URL(request.url).searchParams.get("limit") ?? 20);
  const limit = Number.isInteger(requested) && requested > 0 ? Math.min(requested, MAX_LIMIT) : 20;
  return Response.json({ reports: await getReportStore().list(limit) });
}
