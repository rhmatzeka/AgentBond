import { CopyButton } from "@/components/copy-button";
import { ScoreBar } from "@/components/score-bar";
import { VerdictBadge } from "@/components/verdict-badge";
import { checkerLabel, formatUsdc, riskLabel, shortHex } from "@/lib/format";
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
    <article aria-label={`${heading} for ${report.sellerAgentName}`} className="nb-card">
      <header className="flex items-center justify-between gap-4 border-b-2 border-ink px-5 py-3 sm:px-6">
        <p className="text-sm font-semibold">{heading}</p>
        <p className="font-mono text-xs text-graphite">{report.taskType.replace("_", " ")}</p>
      </header>

      <div className="px-5 pb-6 pt-5 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
          <div className="min-w-0">
            <h3 className="break-words text-2xl font-extrabold tracking-tight sm:text-[1.75rem]">
              {report.sellerAgentName}
            </h3>
            <p className="mt-0.5 text-sm text-graphite">Quoted {formatUsdc(report.proposedPriceUsdc)}</p>
          </div>
          <VerdictBadge action={report.recommendedAction} animate={animateVerdict} />
        </div>

        <div className="mt-6 flex items-end gap-4">
          <p className="font-mono text-[5.5rem] font-semibold leading-[0.8] tracking-[-0.06em] tabular-nums">
            {report.trustScore}
          </p>
          <p className="pb-1 text-sm leading-snug text-graphite">
            trust score out of 100
            <br />
            <span className="font-semibold text-ink">{riskLabel[report.riskLevel]}</span>
          </p>
        </div>
        <div className="mt-4">
          <ScoreBar score={report.trustScore} size="lg" />
        </div>

        <div className="mt-6 border-2 border-ink bg-paper px-4 py-3">
          {report.recommendedAction === "avoid" ? (
            <>
              <p className="font-bold">Do not pay up front</p>
              <p className="mt-0.5 text-sm text-graphite">
                {report.paymentRecommendation} If you go ahead anyway, cap it at{" "}
                {formatUsdc(report.recommendedMaxPriceUsdc)}.
              </p>
            </>
          ) : (
            <>
              <p className="font-bold">Pay at most {formatUsdc(report.recommendedMaxPriceUsdc)}</p>
              <p className="mt-0.5 text-sm text-graphite">{report.paymentRecommendation}</p>
            </>
          )}
        </div>

        <dl className="mt-6 space-y-4">
          {checks.map((result) => {
            const label = checkerLabel[result.checkerName];
            return (
              <div key={result.checkerName}>
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="font-bold">
                    {label?.name ?? result.checkerName}
                    {label && <span className="ml-2 font-mono text-xs font-normal text-ash">{label.weight}%</span>}
                  </dt>
                  <dd className="font-mono font-semibold tabular-nums">{result.score}</dd>
                </div>
                <dd className="mt-1.5">
                  <ScoreBar score={result.score} />
                </dd>
                {!compact && <dd className="mt-1.5 text-sm text-graphite">{result.notes[0]}</dd>}
                {!compact && result.riskFlags.length > 0 && (
                  <dd>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {result.riskFlags.map((flag) => (
                        <li className="border border-ink px-1.5 py-0.5 font-mono text-[11px]" key={flag}>
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
        <footer className="space-y-1.5 border-t-2 border-ink bg-paper px-5 py-4 text-sm text-graphite sm:px-6">
          <p className="flex flex-wrap items-center gap-x-2">
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
