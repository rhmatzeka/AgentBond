import { listReports } from "@/lib/data/reports-store";

export async function GET() {
  return Response.json({ reports: listReports() });
}
