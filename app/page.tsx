import Link from "next/link";
import { CheckForm } from "@/components/check-form";
import { Coin } from "@/components/coin";
import { CheckedFirst, PayingBlind, WavingRobot } from "@/components/illustrations";
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

const PINK = "var(--color-pink)";
const coins = [
  { face: "check" as const, className: "left-[2%] top-[14%] w-44 -rotate-[28deg]" },
  { face: { text: "96" }, className: "right-[4%] top-[6%] w-36 rotate-[20deg]" },
  { face: "cross" as const, className: "-left-12 top-[52%] w-56 rotate-[62deg]" },
  { face: "dash" as const, className: "-right-10 top-[48%] w-48 -rotate-[58deg]" },
];

const sectionTitle = "display text-[clamp(2.5rem,5.5vw,4.5rem)]";
const wrap = "mx-auto max-w-7xl px-4 sm:px-8";

const priceBullets = [
  "A price ceiling taken from the market range for the task.",
  "A verdict to hire, verify first, or avoid, with the reasons.",
  "A report hash you can anchor on Base so nobody edits it later.",
];

const loopLabels = [
  { text: "Grade the work", className: "left-[5%] top-5" },
  { text: "Compare the price", className: "left-1/2 top-5 -translate-x-1/2" },
  { text: "Read the track record", className: "right-[5%] top-5" },
  { text: "Anchor on Base", className: "bottom-5 left-[5%]" },
  { text: "Pay with confidence", className: "bottom-5 left-1/2 -translate-x-1/2" },
  { text: "Check the next one", className: "bottom-5 right-[5%]" },
];

function CodeCard({ title, children }: { title: string; children: string }) {
  return (
    <div className="nb-card overflow-hidden">
      <p className="border-b border-line px-6 py-3 text-graphite">{title}</p>
      <pre className="overflow-x-auto p-6 font-mono text-[13px] leading-relaxed">{children}</pre>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden className="mt-1 h-5 w-5 shrink-0" viewBox="0 0 20 20">
      <circle cx="10" cy="10" fill={PINK} r="9" stroke="#000" strokeWidth="1.5" />
      <path d="M6 10.3l2.7 2.7L14 7.5" fill="none" stroke="#000" strokeLinecap="round" strokeWidth="2" />
    </svg>
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
              <Coin face={coin.face} fill={PINK} />
            </div>
          ))}
        </div>
        <div className="relative mx-auto max-w-4xl px-5 pb-24 pt-20 text-center sm:px-8 md:pb-36 md:pt-36">
          <h1 className="display text-balance text-[clamp(3rem,8vw,6.5rem)]">A credit check for AI agents</h1>
          <p className="mx-auto mt-7 max-w-xl text-balance text-xl leading-relaxed">
            Before your agent pays another agent, AgentBond grades the seller&apos;s work, price and track record. You
            get a verdict and a fair price in seconds.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link className="nb-btn nb-btn-primary" href="#check">
              Check a seller
            </Link>
            <Link className="nb-btn bg-card" href="#api">
              Call it from your agent
            </Link>
          </div>
        </div>
      </section>

      <section className={`${wrap} space-y-8 pb-24`}>
        <div className="nb-card grid gap-10 p-8 sm:p-12 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-16">
          <div className="flex flex-col justify-between gap-8">
            <h2 className="display text-4xl sm:text-5xl">Grade the work, not the pitch</h2>
            <p className="max-w-md text-lg leading-relaxed">
              An LLM and plain text checks read the seller&apos;s sample. Instructions hidden inside it are ignored, so
              a spammer cannot talk its way to a good score.
            </p>
          </div>
          <figure className="lg:-mb-24 lg:-mt-28">
            <div className="rounded-3xl shadow-[8px_8px_0_0_var(--color-pink)]">
              <ReportSlip compact heading="Example report" report={exampleReport} />
            </div>
          </figure>
        </div>

        <div className="nb-card p-8 sm:p-12 lg:mt-20">
          <h2 className="display text-4xl sm:text-5xl">Pay the right price</h2>
          <ul className="mt-12 space-y-4 text-lg">
            {priceBullets.map((bullet) => (
              <li className="flex gap-4" key={bullet}>
                <CheckIcon />
                {bullet}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <figure className="nb-card relative p-8 sm:p-10">
            <figcaption className="relative z-10 inline-block rounded-2xl border border-line bg-card px-6 py-4 text-lg">
              Instead of paying blind…
            </figcaption>
            <div className="mx-auto -mt-6 max-w-sm">
              <PayingBlind />
            </div>
          </figure>
          <figure className="nb-card relative flex flex-col p-8 sm:p-10">
            <div className="mx-auto max-w-sm">
              <CheckedFirst />
            </div>
            <figcaption className="relative z-10 -mt-6 self-center rounded-2xl border border-line bg-card px-6 py-4 text-lg">
              …check the seller first!
            </figcaption>
          </figure>
        </div>
      </section>

      <section>
        <p className="display px-5 pb-14 text-center text-3xl sm:text-4xl">You know that agent you are about to pay?</p>
        <div className="relative h-64 bg-yellow text-black sm:h-72">
          <div aria-hidden className="absolute inset-x-[3%] inset-y-7 rounded-3xl border border-black/40" />
          {loopLabels.map((label) => (
            <p
              className={`absolute hidden items-center gap-2 bg-yellow px-3 text-[15px] sm:flex ${label.className}`}
              key={label.text}
            >
              <span aria-hidden>›</span>
              {label.text}
            </p>
          ))}
          <WavingRobot className="absolute left-1/2 top-1/2 h-44 -translate-x-1/2 -translate-y-1/2 sm:h-52" />
        </div>
        <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:py-24">
          <p className="display text-balance text-4xl sm:text-5xl">Check it before your agent sends a single cent.</p>
          <p className="mx-auto mt-5 max-w-xl text-xl leading-relaxed">
            No setup and no wallet needed to run a check. Anchoring the result on Base is optional.
          </p>
          <Link className="nb-btn nb-btn-primary mt-9" href="#check">
            Find out how
          </Link>
        </div>
      </section>

      <section className="scroll-mt-28 border-t border-line" id="check">
        <div className={`${wrap} py-24 sm:py-28`}>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className={sectionTitle}>Check a seller</h2>
            <p className="mt-5 text-xl leading-relaxed">
              Pick a seller, describe the job, and paste a sample of their work. The check takes a few seconds.
            </p>
          </div>
          <div className="mt-14">
            <CheckForm sellers={demoAgents} />
          </div>
        </div>
      </section>

      <section className={`${wrap} pb-24 sm:pb-32`}>
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="display text-balance text-[clamp(2.75rem,6.5vw,5.5rem)]">Hire, verify first, or avoid</h2>
          <p className="mx-auto mt-5 max-w-xl text-xl">
            Every check ends in one of three verdicts, with the trust score that decides it.
          </p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {verdicts.map((verdict) => (
            <div className="nb-card p-9 text-center" key={verdict.action}>
              <VerdictBadge action={verdict.action} size="lg" />
              <p className="display mt-8 text-4xl tabular-nums">Score {verdict.range}</p>
              <p className="mt-3 text-lg text-graphite">{verdict.text}</p>
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

      <section className="scroll-mt-28" id="api">
        <div className={`${wrap} grid gap-12 pb-24 sm:pb-32 lg:grid-cols-[24rem_minmax(0,1fr)]`}>
          <div>
            <h2 className={sectionTitle}>Call it from your agent</h2>
            <p className="mt-5 text-lg leading-relaxed text-graphite">
              One POST before every payment. The compact response is shaped for CAP services, and the full report stays
              available at <code className="font-mono text-[15px] text-ink">/api/reports/:id</code>.
            </p>
            <p className="mt-4 text-graphite">Limited to 20 checks per minute per client.</p>
          </div>
          <div className="min-w-0 space-y-6">
            <CodeCard title="Request">{requestExample}</CodeCard>
            <CodeCard title="Response">{responseExample}</CodeCard>
          </div>
        </div>
      </section>
    </main>
  );
}
