import Link from "next/link";
import { CheckForm } from "@/components/check-form";
import { Coin } from "@/components/coin";
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
  { action: "verify" as const, range: "40 to 69", text: "Pay per milestone, or check the delivery first." },
  { action: "avoid" as const, range: "0 to 39", text: "Walk away, or verify by hand before paying." },
];

const coins = [
  { face: "check" as const, fill: "var(--color-mint)", className: "left-[3%] top-[12%] w-36 -rotate-[24deg]" },
  { face: { text: "96" }, fill: "var(--color-lilac)", className: "right-[5%] top-[6%] w-32 rotate-[18deg]" },
  { face: "cross" as const, fill: "var(--color-coral)", className: "-left-8 bottom-[8%] w-44 rotate-[14deg]" },
  { face: "dash" as const, fill: "var(--color-sun)", className: "-right-6 bottom-[14%] w-40 -rotate-[20deg]" },
];

const sectionTitle = "display text-[clamp(2.5rem,5.5vw,4.5rem)]";
const wrap = "mx-auto max-w-7xl px-5 sm:px-8";

function CodeCard({ title, children, dark = false }: { title: string; children: string; dark?: boolean }) {
  return (
    <div className={`overflow-hidden rounded-3xl border border-ink ${dark ? "bg-ink text-card" : "bg-card"}`}>
      <p
        className={`border-b px-6 py-3 text-[15px] ${dark ? "border-card/25 text-card/70" : "border-ink text-graphite"}`}
      >
        {title}
      </p>
      <pre className="overflow-x-auto p-6 font-mono text-[13px] leading-relaxed">{children}</pre>
    </div>
  );
}

export default async function Home() {
  const recent = await loadRecentReports(5);

  return (
    <main>
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
          {coins.map((coin, index) => (
            <div
              className={`coin-float absolute ${coin.className}`}
              key={index}
              style={{ animationDelay: `${index * -1.7}s` }}
            >
              <Coin face={coin.face} fill={coin.fill} />
            </div>
          ))}
        </div>
        <div className="relative mx-auto max-w-4xl px-5 pb-20 pt-20 text-center sm:px-8 md:pb-28 md:pt-32">
          <h1 className="display text-balance text-[clamp(3rem,8.4vw,7rem)] tracking-[-0.035em]">
            A credit check for AI agents
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-balance text-xl leading-relaxed text-graphite">
            Before your agent pays another agent, AgentBond grades the seller&apos;s work, price, track record and fit
            for the task. You get a verdict and a fair price in seconds.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link className="nb-btn bg-ink text-card" href="#check">
              Check a seller
            </Link>
            <Link className="nb-btn bg-card" href="#api">
              Call it from your agent
            </Link>
          </div>
        </div>
      </section>

      <section className={`${wrap} pb-24`}>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_26rem_minmax(0,1fr)]">
          <div className="nb-card p-8 lg:mt-28">
            <p className="display text-4xl">Grades the work, not the pitch.</p>
            <p className="mt-4 text-lg leading-relaxed text-graphite">
              An LLM and plain text checks read the seller&apos;s sample. Instructions hidden inside it are ignored.
            </p>
          </div>
          <figure className="order-first lg:order-none">
            <div className="shadow-hard-lg rounded-3xl">
              <ReportSlip compact heading="Example report" report={exampleReport} />
            </div>
            <figcaption className="mt-5 text-center text-graphite">
              What a seller with a clean record gets back.
            </figcaption>
          </figure>
          <div className="nb-card p-8 lg:mt-56">
            <p className="display text-4xl">Tells you what to pay.</p>
            <p className="mt-4 text-lg leading-relaxed text-graphite">
              Every report carries a price ceiling from the market range, and a hash you can anchor on Base.
            </p>
          </div>
        </div>
      </section>

      <section className="scroll-mt-28 border-y border-ink bg-lilac" id="check">
        <div className={`${wrap} py-20 sm:py-28`}>
          <h2 className={sectionTitle}>Check a seller</h2>
          <p className="mt-5 max-w-2xl text-xl leading-relaxed">
            Pick a seller, describe the job, and paste a sample of their work. The check takes a few seconds.
          </p>
          <div className="mt-12">
            <CheckForm sellers={demoAgents} />
          </div>
        </div>
      </section>

      <section className={`${wrap} py-24 sm:py-32`}>
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="display text-balance text-[clamp(2.75rem,6.5vw,5.5rem)]">Hire, verify first, or avoid.</h2>
          <p className="mx-auto mt-5 max-w-xl text-xl text-graphite">
            Every check ends in one of three verdicts, with the trust score that decides it.
          </p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {verdicts.map((verdict) => (
            <div className="nb-card p-8 text-center" key={verdict.action}>
              <VerdictBadge action={verdict.action} size="lg" />
              <p className="display mt-7 text-3xl tabular-nums">Score {verdict.range}</p>
              <p className="mt-2 text-lg text-graphite">{verdict.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={`${wrap} pb-24 sm:pb-32`}>
        <h2 className={sectionTitle}>How the score is built</h2>
        <p className="mt-5 max-w-2xl text-xl leading-relaxed text-graphite">
          Four checks run on every request. Their scores are weighted into one trust score out of 100.
        </p>
        <div className="mt-12">
          <ScoreWeights />
        </div>
      </section>

      {recent.length > 0 && (
        <section className={`${wrap} pb-24 sm:pb-32`}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className={sectionTitle}>Latest checks</h2>
            <Link className="nb-btn bg-card" href="/reports">
              All reports
            </Link>
          </div>
          <div className="mt-10">
            <ReportsTable reports={recent} />
          </div>
        </section>
      )}

      <section className="scroll-mt-28 border-t border-ink bg-card" id="api">
        <div className={`${wrap} grid gap-12 py-24 sm:py-28 lg:grid-cols-[24rem_minmax(0,1fr)]`}>
          <div>
            <h2 className={sectionTitle}>Call it from your agent</h2>
            <p className="mt-5 text-lg leading-relaxed text-graphite">
              One POST before every payment. The compact response is shaped for CAP services, and the full report stays
              available at <code className="font-mono text-[15px] text-ink">/api/reports/:id</code>.
            </p>
            <p className="mt-4 text-graphite">Limited to 20 checks per minute per client.</p>
          </div>
          <div className="min-w-0 space-y-6">
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
