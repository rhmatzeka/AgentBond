import { CopyButton } from "@/components/copy-button";
import { ScoreBar } from "@/components/score-bar";
import { VerdictBadge } from "@/components/verdict-badge";
import { checkerLabel, formatUsdc, riskLabel, shortHex, verdictTone } from "@/lib/format";
import type { RiskReport } from "@/lib/types/report";

export function ReportSlip({
  report,
  animateVerdict = false,
  heading = "Risk report",
  compact = false,
  children,
}: {
  report: RiskReport;
  animateVerdict?: boolean;
  heading?: string;
  /** Scores only, without notes, flags or the hash footer. */
  compact?: boolean;
  children?: React.ReactNode;
}) {
  const quality = report.checkerResults.find((result) => result.checkerName === "OutputQualityChecker");
  const checks = [...report.checkerResults].sort(
    (a, b) => (checkerLabel[b.checkerName]?.weight ?? 0) - (checkerLabel[a.checkerName]?.weight ?? 0),
  );

  return (
    <article
      aria-label={`${heading} for ${report.sellerAgentName}`}
      className="overflow-hidden rounded-3xl border border-ink bg-card"
    >
      <header className="flex items-center justify-between gap-4 border-b border-ink px-6 py-3.5">
        <p className="text-[15px] font-medium">{heading}</p>
        <p className="rounded-full border border-ink px-3 py-0.5 text-[13px]">{report.taskType.replace("_", " ")}</p>
      </header>

      <div className="px-6 pb-7 pt-6">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
          <div className="min-w-0">
            <h3 className="display break-words text-[1.7rem]">{report.sellerAgentName}</h3>
            <p className="mt-1 text-[15px] text-graphite">Quoted {formatUsdc(report.proposedPriceUsdc)}</p>
          </div>
          <VerdictBadge action={report.recommendedAction} animate={animateVerdict} />
        </div>

        <div className="mt-6 flex items-end gap-4">
          <p className="display text-[6rem] leading-[0.78] tabular-nums tracking-[-0.05em]">{report.trustScore}</p>
          <p className="pb-1 text-[15px] leading-snug text-graphite">
            trust score
            <br />
            <span className="text-ink">{riskLabel[report.riskLevel]}</span>
          </p>
        </div>
        <div className="mt-5">
          <ScoreBar score={report.trustScore} size="lg" />
        </div>

        <div className={`mt-6 rounded-2xl border border-ink px-5 py-4 ${verdictTone[report.recommendedAction]}`}>
          {report.recommendedAction === "avoid" ? (
            <>
              <p className="text-lg font-medium">Do not pay up front</p>
              <p className="mt-0.5 text-[15px]">
                {report.paymentRecommendation} If you go ahead anyway, cap it at{" "}
                {formatUsdc(report.recommendedMaxPriceUsdc)}.
              </p>
            </>
          ) : (
            <>
              <p className="text-lg font-medium">Pay at most {formatUsdc(report.recommendedMaxPriceUsdc)}</p>
              <p className="mt-0.5 text-[15px]">{report.paymentRecommendation}</p>
            </>
          )}
        </div>

        <dl className="mt-7 space-y-5">
          {checks.map((result) => {
            const label = checkerLabel[result.checkerName];
            return (
              <div key={result.checkerName}>
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="font-medium">
                    {label?.name ?? result.checkerName}
                    {label && <span className="ml-2 text-sm text-ash">{label.weight}%</span>}
                  </dt>
                  <dd className="font-medium tabular-nums">{result.score}</dd>
                </div>
                <dd className="mt-2">
                  <ScoreBar score={result.score} />
                </dd>
                {!compact && <dd className="mt-2 text-[15px] text-graphite">{result.notes[0]}</dd>}
                {!compact && result.riskFlags.length > 0 && (
                  <dd>
                    <ul className="mt-2.5 flex flex-wrap gap-1.5">
                      {result.riskFlags.map((flag) => (
                        <li className="rounded-full border border-ink px-2.5 py-0.5 text-[13px]" key={flag}>
                          {flag.replaceAll("_", " ")}
                        </li>
                      ))}
                    </ul>
                  </dd>
                )}
              </div>
            );
          })}
        </dl>
      </div>

      {!compact && (
        <footer className="space-y-2 border-t border-ink bg-paper px-6 py-5 text-[15px] text-graphite">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            Report hash
            <code className="font-mono text-[13px] text-ink" title={report.reportHash}>
              {shortHex(report.reportHash, 10, 8)}
            </code>
            <CopyButton value={report.reportHash} />
          </p>
          {quality && (
            <p>
              Output graded by{" "}
              <span className="text-ink">
                {quality.method === "llm" ? `${quality.model} plus text checks` : "text checks only"}
              </span>
              {report.capOrderId && (
                <>
                  , order <code className="font-mono text-[13px] text-ink">{report.capOrderId}</code>
                </>
              )}
            </p>
          )}
          {children}
        </footer>
      )}
    </article>
  );
}
