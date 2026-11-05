import { CaretRightIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { formatUsdc, timeAgo, verdictLabel, verdictTone } from "@/lib/format";
import type { RiskReport } from "@/lib/types/report";

export function ReportsTable({ reports }: { reports: RiskReport[] }) {
  return (
    <>
      <ReportsList reports={reports} />
      <ReportsGrid reports={reports} />
    </>
  );
}

/** Phones: one tappable row per report, score up front. */
function ReportsList({ reports }: { reports: RiskReport[] }) {
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-card md:hidden">
      {reports.map((report) => (
        <li key={report.reportId}>
          <Link
            className="flex items-center gap-4 px-4 py-4 transition-colors active:bg-mist"
            href={`/reports/${report.reportId}`}
          >
            <span className="display w-11 shrink-0 text-center text-3xl tabular-nums">{report.trustScore}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">{report.sellerAgentName}</span>
              <span className="mt-1 flex items-center gap-2 text-sm text-graphite">
                <span
                  className={`shrink-0 rounded-full border border-black px-2.5 py-px text-[12px] text-black ${verdictTone[report.recommendedAction]}`}
                >
                  {verdictLabel[report.recommendedAction]}
                </span>
                <span className="truncate">
                  {formatUsdc(report.proposedPriceUsdc ?? 0)},{" "}
                  <time dateTime={report.createdAt}>{timeAgo(report.createdAt)}</time>
                </span>
              </span>
            </span>
            <CaretRightIcon aria-hidden className="h-5 w-5 shrink-0 text-graphite" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Tablets and up: the full table. */
function ReportsGrid({ reports }: { reports: RiskReport[] }) {
  return (
    <div className="hidden overflow-x-auto rounded-3xl border border-line bg-card md:block">
      <table className="w-full min-w-[44rem] text-left text-base">
        <thead className="border-b border-line text-graphite">
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
        <tbody className="divide-y divide-line">
          {reports.map((report) => (
            <tr className="transition-colors hover:bg-mist" key={report.reportId}>
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
                  className={`whitespace-nowrap rounded-full border border-black px-3 py-0.5 text-[13px] text-black ${verdictTone[report.recommendedAction]}`}
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
