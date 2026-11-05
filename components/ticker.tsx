import { verdictLabel, verdictTone } from "@/lib/format";
import type { RiskReport } from "@/lib/types/report";

/** Black strip that scrolls the latest verdicts. Decorative: the table below carries the same data. */
export function Ticker({ reports }: { reports: RiskReport[] }) {
  const items = reports.map((report) => (
    <li className="flex items-center gap-3 whitespace-nowrap px-6" key={report.reportId}>
      <span aria-hidden className="h-2.5 w-2.5 rotate-45 bg-lilac" />
      <span className="font-semibold">{report.sellerAgentName}</span>
      <span className="font-mono tabular-nums opacity-70">{report.trustScore}/100</span>
      <span
        className={`rounded-full border-2 border-card px-2.5 py-0.5 text-xs font-bold text-ink ${verdictTone[report.recommendedAction]}`}
      >
        {verdictLabel[report.recommendedAction]}
      </span>
    </li>
  ));

  return (
    <div aria-hidden className="ticker overflow-hidden border-y-[3px] border-ink bg-ink py-3.5 text-card">
      <ul className="ticker-track flex w-max">
        {items}
        {items.map((item) => ({ ...item, key: `${item.key}-again` }))}
      </ul>
    </div>
  );
}
