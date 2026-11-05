import Link from "next/link";
import { CheckForm } from "@/components/check-form";
import { ReportSlip } from "@/components/report-slip";
import { ReportsTable } from "@/components/reports-table";
import { ScoreWeights } from "@/components/score-weights";
import { Ticker } from "@/components/ticker";
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

const sectionTitle = "display text-[clamp(2.2rem,4.6vw,3.6rem)]";
const wrap = "mx-auto max-w-7xl px-5 sm:px-8";

function CodeCard({ title, children, dark = false }: { title: string; children: string; dark?: boolean }) {
  return (
    <div
      className={`overflow-hidden rounded-[14px] border-[3px] border-card ${dark ? "shadow-[6px_6px_0_0_var(--color-lilac)]" : "bg-card text-ink shadow-[6px_6px_0_0_var(--color-mint)]"}`}
    >
      <p
        className={`flex items-center gap-2 border-b-[3px] border-card px-4 py-2 text-sm font-bold ${dark ? "" : "border-ink"}`}
      >
        <span aria-hidden className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-current" />
          <span className="h-2.5 w-2.5 rounded-full border-2 border-current" />
        </span>
        {title}
      </p>
      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed">{children}</pre>
    </div>
  );
}

export default async function Home() {
  const recent = await loadRecentReports(8);

  return (
    <main>
      <section
        className={`${wrap} grid grid-cols-[minmax(0,1fr)] items-center gap-14 pb-20 pt-14 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-16 lg:pb-24 lg:pt-20`}
      >
        <div>
          <h1 className="display max-w-3xl text-balance text-[clamp(2.75rem,6.2vw,5.4rem)]">
            A credit check for AI agents
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-graphite">
            Before your agent pays another agent, AgentBond grades the seller&apos;s work, price, track record and fit
            for the task. You get a verdict, a fair price ceiling, and a report hash you can anchor on Base.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link className="nb-btn bg-lilac px-6 py-3.5" href="#check">
              Check a seller
            </Link>
            <Link className="nb-btn bg-card px-6 py-3.5" href="#api">
              Call it from your agent
            </Link>
          </div>
          <ul className="mt-12 grid max-w-xl gap-3 text-sm sm:grid-cols-3">
            {[
              "Output graded by an LLM and text checks",
              "Price compared to the market range",
              "Hash anchored on Base",
            ].map((point) => (
              <li className="flex gap-2.5" key={point}>
                <svg aria-hidden className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 16 16">
                  <rect className="fill-mint stroke-ink" height="14" rx="4" strokeWidth="2" width="14" x="1" y="1" />
                  <path d="M4.5 8.5l2.2 2.2L11.5 5.5" fill="none" stroke="#000" strokeWidth="2" />
                </svg>
                <span className="text-graphite">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <figure className="mx-auto w-full max-w-md">
          <div className="relative">
            <div
              aria-hidden
              className="absolute inset-0 hidden translate-x-5 translate-y-3 rotate-[3.5deg] overflow-hidden rounded-[14px] border-[3px] border-ink bg-lilac sm:block"
            >
              <div className="hatch h-12 border-b-[3px] border-ink bg-butter" />
            </div>
            <div className="relative [&>article]:shadow-hard-lg">
              <ReportSlip compact heading="Example report" report={exampleReport} />
            </div>
          </div>
          <figcaption className="mt-8 text-center text-sm text-graphite">
            What a seller with a clean record gets back.
          </figcaption>
        </figure>
      </section>

      {recent.length > 0 && <Ticker reports={recent} />}

      <section className="scroll-mt-16 border-b-[3px] border-ink bg-lilac" id="check">
        <div className={`${wrap} py-16 sm:py-24`}>
          <h2 className={sectionTitle}>Check a seller</h2>
          <p className="mt-4 max-w-2xl text-lg text-graphite">
            Pick a seller, describe the job, and paste a sample of their work. The check takes a few seconds.
          </p>
          <div className="mt-12">
            <CheckForm sellers={demoAgents} />
          </div>
        </div>
      </section>

      <section className={`${wrap} py-20 sm:py-24`}>
        <h2 className={sectionTitle}>How the score is built</h2>
        <p className="mt-4 max-w-2xl text-lg text-graphite">
          Four checks run on every request. Their scores are weighted into one trust score out of 100.
        </p>
        <div className="mt-12">
          <ScoreWeights />
        </div>

        <h3 className="display mt-20 text-2xl sm:text-3xl">Three possible verdicts</h3>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {verdicts.map((verdict) => (
            <div className="nb-card p-6" key={verdict.action}>
              <VerdictBadge action={verdict.action} size="lg" />
              <p className="display mt-6 text-2xl tabular-nums">Score {verdict.range}</p>
              <p className="mt-1.5 text-graphite">{verdict.text}</p>
            </div>
          ))}
        </div>
      </section>

      {recent.length > 0 && (
        <section className={`${wrap} pb-24`}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className={sectionTitle}>Latest checks</h2>
            <Link className="nb-btn bg-card py-2 text-sm" href="/reports">
              All reports
            </Link>
          </div>
          <div className="mt-10">
            <ReportsTable reports={recent.slice(0, 5)} />
          </div>
        </section>
      )}

      <section className="scroll-mt-16 border-t-[3px] border-ink bg-ink text-card" id="api">
        <div className={`${wrap} grid gap-12 py-20 sm:py-24 lg:grid-cols-[22rem_minmax(0,1fr)]`}>
          <div>
            <h2 className={sectionTitle}>Call it from your agent</h2>
            <p className="mt-5 leading-relaxed text-card/75">
              One POST before every payment. The compact response is shaped for CAP services, and the full report stays
              available at <code className="font-mono text-sm text-card">/api/reports/:id</code>.
            </p>
            <p className="mt-4 text-sm text-card/60">Limited to 20 checks per minute per client.</p>
          </div>
          <div className="min-w-0 space-y-8">
            <CodeCard dark title="Request">
              {requestExample}
            </CodeCard>
            <CodeCard title="Response">{responseExample}</CodeCard>
          </div>
        </div>
      </section>
    </main>
  );
}
