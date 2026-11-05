import { CopyButton } from "@/components/copy-button";
import { VerdictStamp } from "@/components/verdict-stamp";
import { checkerLabel, formatUsdc, riskLabel, shortHex, verdictColor } from "@/lib/format";
import type { RiskReport } from "@/lib/types/report";

const barColor = {
  hire: "bg-hire",
  verify: "bg-verify",
  avoid: "bg-avoid",
} as const;

function scoreTone(score: number) {
  if (score >= 70) return "bg-ink";
  if (score >= 40) return "bg-verify";
  return "bg-avoid";
}

export function ReportSlip({
  report,
  animateStamp = false,
  heading = "Risk report",
  compact = false,
  children,
}: {
  report: RiskReport;
  animateStamp?: boolean;
  heading?: string;
  /** Scores only, without notes, flags or the hash footer. */
  compact?: boolean;
  children?: React.ReactNode;
}) {
  const quality = report.checkerResults.find((result) => result.checkerName === "OutputQualityChecker");

  return (
    <article
      aria-label={`${heading} for ${report.sellerAgentName}`}
      className="slip relative rounded-b-lg px-6 pb-6 pt-8 sm:px-8"
    >
      <div className="absolute right-5 top-7 sm:right-8">
        <VerdictStamp action={report.recommendedAction} animate={animateStamp} />
      </div>

      <p className="text-sm text-ink-soft">{heading}</p>
      <h3 className="mt-1 pr-32 text-2xl font-semibold tracking-tight">{report.sellerAgentName}</h3>
      <p className="mt-1 text-sm text-ink-soft">
        {report.taskType.replace("_", " ")} task, quoted at {formatUsdc(report.proposedPriceUsdc)}
      </p>

      <div className="mt-7 flex items-end gap-4">
        <p
          className={`text-7xl font-bold leading-none tracking-[-0.05em] tabular-nums ${
            verdictColor[report.recommendedAction]
          }`}
        >
          {report.trustScore}
        </p>
        <p className="pb-1.5 text-sm leading-snug text-ink-soft">
          trust score
          <br />
          out of 100, {riskLabel[report.riskLevel].toLowerCase()}
        </p>
      </div>
      <div aria-hidden className="mt-3 h-1.5 overflow-hidden rounded-full bg-rule/60">
        <div
          className={`h-full rounded-full ${barColor[report.recommendedAction]}`}
          style={{ width: `${report.trustScore}%` }}
        />
      </div>

      <div className="mt-6 rounded-md bg-paper/70 px-4 py-3">
        {report.recommendedAction === "avoid" ? (
          <>
            <p className="font-semibold">Do not pay up front</p>
            <p className="mt-0.5 text-sm text-ink-soft">
              {report.paymentRecommendation} If you go ahead anyway, cap it at{" "}
              {formatUsdc(report.recommendedMaxPriceUsdc)}.
            </p>
          </>
        ) : (
          <>
            <p className="font-semibold">Pay at most {formatUsdc(report.recommendedMaxPriceUsdc)}</p>
            <p className="mt-0.5 text-sm text-ink-soft">{report.paymentRecommendation}</p>
          </>
        )}
      </div>

      <dl className="mt-6 divide-y divide-rule/70 border-y border-rule/70">
        {[...report.checkerResults]
          .sort((a, b) => (checkerLabel[b.checkerName]?.weight ?? 0) - (checkerLabel[a.checkerName]?.weight ?? 0))
          .map((result) => {
            const label = checkerLabel[result.checkerName];
            return (
              <div
                className={`grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 ${compact ? "py-2.5" : "py-3"}`}
                key={result.checkerName}
              >
                <dt className="flex items-baseline gap-2">
                  <span className="font-medium">{label?.name ?? result.checkerName}</span>
                  {label && <span className="text-xs text-ink-faint">weight {label.weight}%</span>}
                </dt>
                <dd className="text-right font-semibold tabular-nums">{result.score}</dd>
                <dd className="col-span-2">
                  <div aria-hidden className="h-1 overflow-hidden rounded-full bg-rule/50">
                    <div className={`h-full ${scoreTone(result.score)}`} style={{ width: `${result.score}%` }} />
                  </div>
                  {!compact && <p className="mt-1.5 text-sm text-ink-soft">{result.notes[0]}</p>}
                  {!compact && result.riskFlags.length > 0 && (
                    <ul className="mt-1.5 flex flex-wrap gap-1.5">
                      {result.riskFlags.map((flag) => (
                        <li className="rounded bg-avoid/8 px-1.5 py-0.5 text-xs text-avoid" key={flag}>
                          {flag.replaceAll("_", " ")}
                        </li>
                      ))}
                    </ul>
                  )}
                </dd>
              </div>
            );
          })}
      </dl>

      {!compact && (
        <div className="mt-5 space-y-1.5 text-sm text-ink-soft">
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
              {quality.method === "llm" ? (
                <span className="text-ink">{quality.model} plus text checks</span>
              ) : (
                <span className="text-ink">text checks only</span>
              )}
              {report.capOrderId && (
                <>
                  , order <code className="font-mono text-[13px] text-ink">{report.capOrderId}</code>
                </>
              )}
            </p>
          )}
        </div>
      )}

      {children}
    </article>
  );
}
