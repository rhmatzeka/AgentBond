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
    <main className="mx-auto max-w-6xl px-5 pb-24 pt-10 sm:px-8">
      <Link className="text-sm font-bold underline decoration-2 underline-offset-4 hover:no-underline" href="/reports">
        All reports
      </Link>
      <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
        Risk report for {report.sellerAgentName}
      </h1>
      <p className="mt-2 text-graphite">
        Checked on{" "}
        <time dateTime={report.createdAt}>
          {created.toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short", timeZone: "UTC" })} UTC
        </time>
      </p>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,30rem)_minmax(0,1fr)]">
        <ReportSlip report={report}>
          <AnchorPanel report={report} />
        </ReportSlip>

        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-extrabold">What was checked</h2>
            <p className="mt-2 leading-relaxed text-graphite">
              {report.sampleTask ? (
                <>&ldquo;{report.sampleTask}&rdquo;</>
              ) : (
                "No task description was sent with this check."
              )}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold">Why this verdict</h2>
            <ul className="mt-3 space-y-2.5">
              {report.reasons.map((reason) => (
                <li className="border-l-4 border-ink pl-4 leading-relaxed text-graphite" key={reason}>
                  {reason}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-extrabold">Integrity</h2>
            <p className="mt-2 font-bold">
              {intact ? "The stored report matches its hash." : "The stored report does not match its hash."}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-graphite">
              The hash is a SHA-256 of every field in the report. Recomputing it from the{" "}
              <a
                className="font-semibold text-ink underline decoration-2 underline-offset-2"
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
