import Link from "next/link";
import { formatUsdc, timeAgo, verdictLabel, verdictTone } from "@/lib/format";
import type { RiskReport } from "@/lib/types/report";

export function ReportsTable({ reports }: { reports: RiskReport[] }) {
  return (
    <div className="nb-card overflow-x-auto">
      <table className="w-full min-w-[42rem] text-left text-sm">
        <thead className="bg-ink text-card">
          <tr>
            <th className="px-4 py-3.5 font-semibold">Seller</th>
            <th className="px-4 py-3.5 font-semibold">Task</th>
            <th className="px-4 py-3.5 text-right font-semibold">Quote</th>
            <th className="px-4 py-3.5 text-right font-semibold">Score</th>
            <th className="px-4 py-3.5 font-semibold">Verdict</th>
            <th className="px-4 py-3.5 font-semibold">On Base</th>
            <th className="px-4 py-3.5 text-right font-semibold">Checked</th>
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-ink">
          {reports.map((report) => (
            <tr className="transition-colors hover:bg-lilac/25" key={report.reportId}>
              <td className="px-4 py-3">
                <Link
                  className="font-bold underline decoration-2 underline-offset-4 hover:no-underline"
                  href={`/reports/${report.reportId}`}
                >
                  {report.sellerAgentName}
                </Link>
              </td>
              <td className="px-4 py-3 text-graphite">{report.taskType.replace("_", " ")}</td>
              <td className="whitespace-nowrap px-4 py-3 text-right font-mono tabular-nums">
                {formatUsdc(report.proposedPriceUsdc ?? 0)}
              </td>
              <td className="px-4 py-3 text-right font-mono font-semibold tabular-nums">{report.trustScore}</td>
              <td className="px-4 py-3">
                <span
                  className={`whitespace-nowrap rounded-full border-2 border-ink px-2.5 py-0.5 text-xs font-bold ${verdictTone[report.recommendedAction]}`}
                >
                  {verdictLabel[report.recommendedAction]}
                </span>
              </td>
              <td className="px-4 py-3 text-graphite">{report.anchor ? "Anchored" : "Not yet"}</td>
              <td className="whitespace-nowrap px-4 py-3 text-right text-graphite">
                <time dateTime={report.createdAt}>{timeAgo(report.createdAt)}</time>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
