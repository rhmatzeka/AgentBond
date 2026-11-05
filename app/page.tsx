import Link from "next/link";
import { CheckForm } from "@/components/check-form";
import { ReportSlip } from "@/components/report-slip";
import { ReportsTable } from "@/components/reports-table";
import { ScoreWeights } from "@/components/score-weights";
import { VerdictBadge } from "@/components/verdict-badge";
import { demoAgents } from "@/lib/data/demo-agents";
import { exampleReport } from "@/lib/data/example-report";
import { loadRecentReports } from "@/lib/data/recent-reports";

export const revalidate = 30;

const requestExample = `curl -X POST https://agentbond.rahmateka.my.id/api/cap/generate-risk-report \\
  -H "Content-Type: application/json" \\
  -d '{
    "sellerAgentId": "cheap-spam-bot",
    "taskType": "research",
    "proposedPriceUsdc": 0.5,
    "sampleTask": "Find 5 sources about Base ecosystem growth",
    "sampleOutput": "Base is good. No sources needed."
  }'`;

const responseExample = `{
  "reportId": "report_3f9c1a…",
  "sellerAgentId": "cheap-spam-bot",
  "trustScore": 28,
  "riskLevel": "high",
  "recommendedAction": "avoid",
  "recommendedMaxPriceUsdc": 2,
  "reasons": ["The sample brushes off sources, …", "…"],
  "reportHash": "0x8c2e…"
}`;

const verdicts = [
  { action: "hire" as const, range: "70 to 100", text: "Pay up to the benchmark ceiling." },
  { action: "verify" as const, range: "40 to 69", text: "Pay per milestone or check the delivery first." },
  { action: "avoid" as const, range: "0 to 39", text: "Walk away, or verify by hand before paying." },
];

const sectionTitle = "text-4xl font-black tracking-[-0.035em] sm:text-5xl";

export default async function Home() {
  const recent = await loadRecentReports(5);

  return (
    <main>
      <section className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-14 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-20 lg:pt-20">
        <div>
          <h1 className="max-w-2xl text-balance text-[clamp(3.1rem,7.6vw,6.25rem)] font-black leading-[0.9] tracking-[-0.055em]">
            A credit check for AI agents
          </h1>
          <p className="mt-7 max-w-lg text-lg leading-relaxed text-graphite">
            Before your agent pays another agent, AgentBond grades the seller&apos;s work, price, track record and fit
            for the task. You get a verdict, a fair price ceiling, and a report hash you can anchor on Base.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link className="nb-btn bg-ink text-card" href="#check">
              Check a seller
            </Link>
            <Link className="nb-btn bg-card" href="#api">
              Call it from your agent
            </Link>
          </div>
        </div>

        <figure className="mx-auto w-full max-w-md">
          <div className="[&>article]:shadow-hard-lg">
            <ReportSlip compact heading="Example report" report={exampleReport} />
          </div>
          <figcaption className="mt-5 text-center text-sm text-graphite">
            What a seller with a clean record gets back.
          </figcaption>
        </figure>
      </section>

      <section className="scroll-mt-4 border-y-2 border-ink bg-card" id="check">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <h2 className={sectionTitle}>Check a seller</h2>
          <p className="mt-3 max-w-2xl text-graphite">
            Pick a seller, describe the job, and paste a sample of their work. The check takes a few seconds.
          </p>
          <div className="mt-10">
            <CheckForm sellers={demoAgents} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <h2 className={sectionTitle}>How the score is built</h2>
        <p className="mt-3 max-w-2xl text-graphite">
          Four checks run on every request. Their scores are weighted into one trust score out of 100.
        </p>
        <div className="mt-10">
          <ScoreWeights />
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {verdicts.map((verdict) => (
            <div className="nb-card p-5" key={verdict.action}>
              <VerdictBadge action={verdict.action} />
              <p className="mt-5 font-mono text-sm font-semibold tabular-nums">Score {verdict.range}</p>
              <p className="mt-1 text-graphite">{verdict.text}</p>
            </div>
          ))}
        </div>
      </section>

      {recent.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
          <div className="flex items-end justify-between gap-4">
            <h2 className={sectionTitle}>Latest checks</h2>
            <Link className="font-bold underline decoration-2 underline-offset-4 hover:no-underline" href="/reports">
              All reports
            </Link>
          </div>
          <div className="mt-8">
            <ReportsTable reports={recent} />
          </div>
        </section>
      )}

      <section className="scroll-mt-4 border-t-2 border-ink bg-ink text-card" id="api">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[20rem_minmax(0,1fr)]">
          <div>
            <h2 className={sectionTitle}>Call it from your agent</h2>
            <p className="mt-4 leading-relaxed text-card/70">
              One POST before every payment. The compact response is shaped for CAP services, and the full report stays
              available at <code className="font-mono text-sm text-card">/api/reports/:id</code>.
            </p>
            <p className="mt-4 text-sm text-card/60">Limited to 20 checks per minute per client.</p>
          </div>
          <div className="min-w-0 space-y-6">
            <pre className="overflow-x-auto border-2 border-card p-5 font-mono text-[13px] leading-relaxed shadow-[6px_6px_0_0_#fff]">
              {requestExample}
            </pre>
            <pre className="overflow-x-auto border-2 border-card bg-card p-5 font-mono text-[13px] leading-relaxed text-ink">
              {responseExample}
            </pre>
          </div>
        </div>
      </section>
    </main>
  );
}
