import Link from "next/link";
import { formatUsdc, timeAgo, verdictLabel, verdictTone } from "@/lib/format";
import type { RiskReport } from "@/lib/types/report";

export function ReportsTable({ reports }: { reports: RiskReport[] }) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-ink bg-card">
      <table className="w-full min-w-[44rem] text-left text-[15px]">
        <thead className="border-b border-ink text-graphite">
          <tr>
            <th className="px-5 py-4.5 font-normal">Seller</th>
            <th className="px-5 py-4.5 font-normal">Task</th>
            <th className="px-5 py-4.5 text-right font-normal">Quote</th>
            <th className="px-5 py-4.5 text-right font-normal">Score</th>
            <th className="px-5 py-4.5 font-normal">Verdict</th>
            <th className="px-5 py-4.5 font-normal">On Base</th>
            <th className="px-5 py-4.5 text-right font-normal">Checked</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-mist">
          {reports.map((report) => (
            <tr className="transition-colors hover:bg-paper" key={report.reportId}>
              <td className="px-5 py-4">
                <Link className="font-medium underline-offset-4 hover:underline" href={`/reports/${report.reportId}`}>
                  {report.sellerAgentName}
                </Link>
              </td>
              <td className="px-5 py-4 text-graphite">{report.taskType.replace("_", " ")}</td>
              <td className="whitespace-nowrap px-5 py-4 text-right tabular-nums">
                {formatUsdc(report.proposedPriceUsdc ?? 0)}
              </td>
              <td className="px-5 py-4 text-right font-medium tabular-nums">{report.trustScore}</td>
              <td className="px-5 py-4">
                <span
                  className={`whitespace-nowrap rounded-full border border-ink px-3 py-0.5 text-[13px] ${verdictTone[report.recommendedAction]}`}
                >
                  {verdictLabel[report.recommendedAction]}
                </span>
              </td>
              <td className="px-5 py-4 text-graphite">{report.anchor ? "Anchored" : "Not yet"}</td>
              <td className="whitespace-nowrap px-5 py-4 text-right text-graphite">
                <time dateTime={report.createdAt}>{timeAgo(report.createdAt)}</time>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
