import Link from "next/link";
import { ReportResult } from "@/components/report-result";
import { SiteHeader } from "@/components/site-header";
import { getReport } from "@/lib/data/reports-store";

export const dynamic = "force-dynamic";

export default async function ReportPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params;
  const report = getReport(reportId);

  return (
    <main className="bg-vibe-theme min-h-screen text-white">
      <div className="mx-auto max-w-3xl px-6 pb-16">
        <SiteHeader />
        <Link className="font-mono text-xs text-zinc-400 transition hover:text-white" href="/#playground">
          ← Back to playground
        </Link>

        {report ? (
          <div className="mt-6 space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight">Risk report for {report.sellerAgentName}</h1>
            <p className="font-mono text-xs text-zinc-500">
              {report.taskType} · created {new Date(report.createdAt).toUTCString()}
            </p>
            <ReportResult report={report} />
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            <h1 className="text-2xl font-semibold tracking-tight">Report not found</h1>
            <p className="mt-3 break-all text-sm leading-6 text-zinc-400">
              No report with ID <span className="font-mono">{reportId}</span>. Reports are kept in memory in this MVP,
              so they disappear when the server restarts. Run a new check from the playground.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
