import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { AnchorPanel } from "@/components/anchor-panel";
import { ReportSlip } from "@/components/report-slip";
import { getReportStore } from "@/lib/data/reports-store";
import { verdictLabel } from "@/lib/format";
import { verifyReportHash } from "@/lib/web3/report-hash";

const loadReport = cache((reportId: string) => getReportStore().get(reportId));

type Props = { params: Promise<{ reportId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const report = await loadReport((await params).reportId);
  if (!report) return { title: "Report not found" };
  return {
    title: `${report.sellerAgentName} scored ${report.trustScore}`,
    description: `${verdictLabel[report.recommendedAction]}: ${report.paymentRecommendation}`,
  };
}

export default async function ReportPage({ params }: Props) {
  const report = await loadReport((await params).reportId);
  if (!report) notFound();

  const intact = verifyReportHash(report);
  const created = new Date(report.createdAt);

  return (
    <main className="mx-auto max-w-7xl px-5 pb-24 pt-12 sm:px-8">
      <Link className="nb-btn bg-card px-4 py-2 text-[15px]" href="/reports">
        All reports
      </Link>
      <h1 className="display mt-8 break-words text-[clamp(2.1rem,5.5vw,4.5rem)]">
        Risk report for {report.sellerAgentName}
      </h1>
      <p className="mt-3 text-lg text-graphite">
        Checked on{" "}
        <time dateTime={report.createdAt}>
          {created.toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short", timeZone: "UTC" })} UTC
        </time>
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,30rem)_minmax(0,1fr)] lg:gap-12">
        <ReportSlip report={report}>
          <AnchorPanel report={report} />
        </ReportSlip>

        <div className="space-y-6">
          <section className="nb-card p-8">
            <h2 className="display text-2xl">What was checked</h2>
            <p className="mt-3 text-lg leading-relaxed">
              {report.sampleTask ? (
                <>&ldquo;{report.sampleTask}&rdquo;</>
              ) : (
                "No task description was sent with this check."
              )}
            </p>
          </section>

          <section className="nb-card p-8">
            <h2 className="display text-2xl">Why this verdict</h2>
            <ul className="mt-4 space-y-3">
              {report.reasons.map((reason) => (
                <li className="flex gap-3 leading-relaxed text-graphite" key={reason}>
                  <span aria-hidden className="mt-1.5 h-3 w-3 shrink-0 rotate-45 border border-ink bg-lilac" />
                  {reason}
                </li>
              ))}
            </ul>
          </section>

          <section className={`nb-card p-8 ${intact ? "bg-mint" : "bg-coral"}`}>
            <h2 className="display text-2xl">Integrity</h2>
            <p className="mt-3 font-medium">
              {intact ? "The stored report matches its hash." : "The stored report does not match its hash."}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-graphite">
              The hash is a SHA-256 of every field in the report. Recomputing it from the{" "}
              <a
                className="font-medium text-ink underline decoration-2 underline-offset-2"
                href={`/api/reports/${report.reportId}`}
              >
                raw JSON
              </a>{" "}
              and comparing it with the value on Base proves nobody edited the verdict afterwards.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
