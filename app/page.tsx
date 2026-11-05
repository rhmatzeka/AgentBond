import Link from "next/link";
import { CheckForm } from "@/components/check-form";
import { ReportSlip } from "@/components/report-slip";
import { ReportsTable } from "@/components/reports-table";
import { ScoreWeights } from "@/components/score-weights";
import { VerdictStamp } from "@/components/verdict-stamp";
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

export default async function Home() {
  const recent = await loadRecentReports(5);

  return (
    <main>
      <section className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-14 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-20 lg:pt-16">
        <div>
          <h1 className="max-w-2xl text-balance text-[clamp(3rem,7.4vw,6rem)] font-bold leading-[0.95] tracking-[-0.03em] [font-stretch:82%]">
            A credit check for AI agents
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
            Before your agent pays another agent, AgentBond grades the seller&apos;s work, price, track record and fit
            for the task. You get a verdict, a fair price ceiling, and a report hash you can anchor on Base.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="rounded-md bg-pen px-5 py-3 font-semibold text-sheet transition-colors hover:bg-pen-deep"
              href="#check"
            >
              Check a seller
            </Link>
            <Link
              className="rounded-md border border-rule bg-sheet px-5 py-3 font-semibold transition-colors hover:border-ink-faint"
              href="#api"
            >
              Call it from your agent
            </Link>
          </div>
        </div>

        <figure className="mx-auto w-full max-w-md lg:rotate-[1.5deg]">
          <ReportSlip compact heading="Example report" report={exampleReport} />
          <figcaption className="mt-3 text-center text-sm text-ink-faint">
            What a seller with a clean record gets back.
          </figcaption>
        </figure>
      </section>

      <section className="scroll-mt-4 border-y border-rule/70 bg-[#e6eaef]" id="check">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <h2 className="text-3xl font-bold tracking-tight [font-stretch:85%] sm:text-4xl">Check a seller</h2>
          <p className="mt-2 max-w-2xl text-ink-soft">
            Pick a seller, describe the job, and paste a sample of their work. The check takes a few seconds.
          </p>
          <div className="mt-10">
            <CheckForm sellers={demoAgents} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <h2 className="text-3xl font-bold tracking-tight [font-stretch:85%] sm:text-4xl">How the score is built</h2>
        <p className="mt-2 max-w-2xl text-ink-soft">
          Four checks run on every request. Their scores are weighted into one trust score out of 100.
        </p>
        <div className="mt-10">
          <ScoreWeights />
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {verdicts.map((verdict) => (
            <div key={verdict.action}>
              <VerdictStamp action={verdict.action} />
              <p className="mt-4 font-semibold tabular-nums">Score {verdict.range}</p>
              <p className="mt-1 text-sm text-ink-soft">{verdict.text}</p>
            </div>
          ))}
        </div>
      </section>

      {recent.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-3xl font-bold tracking-tight [font-stretch:85%] sm:text-4xl">Latest checks</h2>
            <Link className="text-sm text-pen hover:underline" href="/reports">
              All reports
            </Link>
          </div>
          <div className="mt-6">
            <ReportsTable reports={recent} />
          </div>
        </section>
      )}

      <section className="scroll-mt-4 bg-ink text-sheet" id="api">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[20rem_minmax(0,1fr)]">
          <div>
            <h2 className="text-3xl font-bold tracking-tight [font-stretch:85%] sm:text-4xl">
              Call it from your agent
            </h2>
            <p className="mt-3 leading-relaxed text-sheet/70">
              One POST before every payment. The compact response is shaped for CAP services, and the full report stays
              available at <code className="font-mono text-sm text-sheet">/api/reports/:id</code>.
            </p>
            <p className="mt-4 text-sm text-sheet/60">Limited to 20 checks per minute per client.</p>
          </div>
          <div className="min-w-0 space-y-4">
            <pre className="overflow-x-auto rounded-lg bg-black/30 p-5 font-mono text-[13px] leading-relaxed text-sheet/90">
              {requestExample}
            </pre>
            <pre className="overflow-x-auto rounded-lg bg-black/30 p-5 font-mono text-[13px] leading-relaxed text-[#b9c6ff]">
              {responseExample}
            </pre>
          </div>
        </div>
      </section>
    </main>
  );
}
