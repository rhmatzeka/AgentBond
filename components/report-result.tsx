import { ReportProofCard } from "@/components/report-proof-card";
import { RiskLevelBadge } from "@/components/risk-level-badge";
import type { RiskReport } from "@/lib/types/report";

export function ReportResult({ report }: { report: RiskReport }) {
  return (
    <div className="space-y-5 rounded-2xl border border-brand-green/20 bg-gradient-to-b from-brand-green/5 to-transparent p-5">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div>
          <h4 className="font-mono text-xs uppercase tracking-widest text-brand-green">Verification Result</h4>
          <p className="mt-0.5 font-mono text-[10px] text-zinc-500">
            {report.sellerAgentName} · {report.reportId}
          </p>
        </div>
        <RiskLevelBadge level={report.riskLevel} />
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-xl border border-white/5 bg-black/40 p-3">
          <span className="font-mono text-[10px] uppercase text-zinc-500">Trust Score</span>
          <p className="mt-0.5 text-3xl font-semibold text-white">{report.trustScore}</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-black/40 p-3">
          <span className="font-mono text-[10px] uppercase text-zinc-500">Max Recommended</span>
          <p className="mt-1 text-2xl font-semibold text-white">{report.recommendedMaxPriceUsdc} USDC</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/5 bg-black/30 p-3 text-xs leading-relaxed text-zinc-300">
        <span className="font-semibold capitalize text-white">{report.recommendedAction}:</span>{" "}
        {report.paymentRecommendation}
      </div>

      <div className="space-y-1.5">
        <span className="font-mono text-[10px] uppercase text-zinc-500">Sub-agent breakdown</span>
        <div className="grid gap-1.5">
          {report.checkerResults.map((checker) => (
            <div
              className="flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-black/20 p-2 text-xs"
              key={checker.checkerName}
            >
              <div>
                <span className="font-semibold text-zinc-300">{checker.checkerName}</span>
                <p className="mt-0.5 text-[11px] text-zinc-500">{checker.notes[0]}</p>
                {checker.riskFlags.length > 0 && (
                  <p className="mt-1 font-mono text-[10px] text-amber-400">{checker.riskFlags.join(" · ")}</p>
                )}
              </div>
              <span className="font-mono text-brand-green">{checker.score}/100</span>
            </div>
          ))}
        </div>
      </div>

      <ReportProofCard report={report} />
    </div>
  );
}
