import Link from "next/link";
import { formatUsdc, timeAgo, verdictColor, verdictLabel } from "@/lib/format";
import type { RiskReport } from "@/lib/types/report";

export function ReportsTable({ reports }: { reports: RiskReport[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-rule bg-sheet">
      <table className="w-full min-w-[40rem] text-left text-sm">
        <thead className="border-b border-rule text-ink-soft">
          <tr>
            <th className="px-4 py-3 font-medium">Seller</th>
            <th className="px-4 py-3 font-medium">Task</th>
            <th className="px-4 py-3 text-right font-medium">Quote</th>
            <th className="px-4 py-3 text-right font-medium">Score</th>
            <th className="px-4 py-3 font-medium">Verdict</th>
            <th className="px-4 py-3 font-medium">On Base</th>
            <th className="px-4 py-3 text-right font-medium">Checked</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-rule/70">
          {reports.map((report) => (
            <tr className="transition-colors hover:bg-paper/50" key={report.reportId}>
              <td className="px-4 py-3">
                <Link className="font-medium text-ink hover:text-pen" href={`/reports/${report.reportId}`}>
                  {report.sellerAgentName}
                </Link>
              </td>
              <td className="px-4 py-3 text-ink-soft">{report.taskType.replace("_", " ")}</td>
              <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums">
                {formatUsdc(report.proposedPriceUsdc ?? 0)}
              </td>
              <td className="px-4 py-3 text-right font-semibold tabular-nums">{report.trustScore}</td>
              <td className={`px-4 py-3 font-medium ${verdictColor[report.recommendedAction]}`}>
                {verdictLabel[report.recommendedAction]}
              </td>
              <td className="px-4 py-3 text-ink-soft">{report.anchor ? "Anchored" : "Not yet"}</td>
              <td className="px-4 py-3 text-right text-ink-soft">
                <time dateTime={report.createdAt}>{timeAgo(report.createdAt)}</time>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
