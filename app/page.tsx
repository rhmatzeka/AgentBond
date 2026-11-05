import Link from "next/link";
import { CheckForm } from "@/components/check-form";
import { Coin } from "@/components/coin";
import { CheckedFirst, PayingBlind, StreetScene, WavingRobot } from "@/components/illustrations";
import { FlatIcon, type IconKind, PriceChart, PriceTag, RobotAvatar, RoundSticker, Tile } from "@/components/props";
import { ReportLookup } from "@/components/report-lookup";
import { ReportSlip } from "@/components/report-slip";
import { ScoreWeights } from "@/components/score-weights";
import { VerdictBadge } from "@/components/verdict-badge";
import { demoAgents } from "@/lib/data/demo-agents";
import { exampleReport } from "@/lib/data/example-report";
import { loadRecentReports, loadReportCount } from "@/lib/data/recent-reports";
import { verdictLabel } from "@/lib/format";

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
  "trustScore": 28,
  "recommendedAction": "avoid",
  "recommendedMaxPriceUsdc": 2,
  "reasons": ["The sample brushes off sources, …"],
  "reportHash": "0x8c2e…"
}`;

const PINK = "var(--color-pink)";

const heroCoins = [
  { className: "left-[3%] top-[8%] w-44 -rotate-[32deg]" },
  { className: "right-[6%] top-[4%] w-36 rotate-[24deg]" },
  { className: "-left-16 top-[44%] w-64 rotate-[70deg]" },
  { className: "-right-14 top-[40%] w-52 -rotate-[62deg]" },
  { className: "bottom-[-4.5rem] right-[30%] w-40 rotate-[78deg]" },
];

const verdictBullets = [
  { action: "hire" as const, text: "Hire when the score is 70 or more, and pay up to the market ceiling." },
  { action: "verify" as const, text: "Verify first between 40 and 69: pay per milestone or check the delivery." },
  { action: "avoid" as const, text: "Avoid below 40, or check the work by hand before any payment." },
];

const loopLabels = [
  { text: "Grade the work", className: "left-[4%] top-4" },
  { text: "Compare the price", className: "left-1/2 top-4 -translate-x-1/2" },
  { text: "Read the track record", className: "right-[4%] top-4" },
  { text: "Anchor on Base", className: "bottom-4 left-[4%]" },
  { text: "Pay with confidence", className: "bottom-4 left-1/2 -translate-x-1/2" },
  { text: "Check the next one", className: "bottom-4 right-[4%]" },
];

const flagRows: [IconKind, string][][] = [
  [
    ["magnifier", "dismisses evidence"],
    ["warning", "no delivery"],
    ["doc", "too short"],
    ["spark", "missing sources"],
    ["coin", "price outside benchmark"],
  ],
  [
    ["people", "low buyer diversity"],
    ["shield", "suspicious activity"],
    ["clock", "high failure rate"],
    ["magnifier", "irrelevant"],
    ["doc", "generic"],
  ],
  [
    ["warning", "task mismatch"],
    ["spark", "low output quality"],
    ["coin", "overpriced"],
    ["clock", "incomplete"],
    ["shield", "unverified claims"],
  ],
];

const avatarFill = { hire: "var(--color-teal)", verify: "var(--color-yellow)", avoid: "var(--color-coral)" };

const wrap = "mx-auto max-w-[78rem] px-4 sm:px-6";
const card = "rounded-3xl border border-line bg-card";
const cardTitle = "display text-4xl sm:text-[2.6rem]";
const bigTitle = "display text-balance text-[clamp(2.75rem,6.5vw,5.5rem)]";

function CheckIcon() {
  return (
    <svg aria-hidden className="mt-1 h-5 w-5 shrink-0" viewBox="0 0 20 20">
      <circle cx="10" cy="10" fill={PINK} r="9" stroke="#000" strokeWidth="1.5" />
      <path d="M6 10.3l2.7 2.7L14 7.5" fill="none" stroke="#000" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function CodeCard({ title, children }: { title: string; children: string }) {
  return (
    <div className={`${card} overflow-hidden`}>
      <p className="border-b border-line px-6 py-3 text-graphite">{title}</p>
      <pre className="overflow-x-auto p-6 font-mono text-[13px] leading-relaxed">{children}</pre>
    </div>
  );
}

export default async function Home() {
  const [recent, total] = await Promise.all([loadRecentReports(4), loadReportCount()]);

  return (
    <main className="text-xl">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
          {heroCoins.map((coin, index) => (
            <div
              className={`coin-float absolute ${coin.className}`}
              key={index}
              style={{ animationDelay: `${index * -1.6}s` }}
            >
              <Coin face={{ text: "A" }} fill={PINK} />
            </div>
          ))}
        </div>
        <div className="relative mx-auto max-w-4xl px-5 pb-28 pt-20 text-center sm:px-8 md:pb-40 md:pt-40">
          <h1 className="display text-balance text-[clamp(3.25rem,8vw,6.25rem)]">Check before you pay</h1>
          <p className="mx-auto mt-6 max-w-[34rem] text-balance leading-relaxed">
            A credit check for AI agents. Before your agent pays another one, see if the seller does good work at a fair
            price.
          </p>
          <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-4 sm:flex-row">
            <Link className="nb-btn nb-btn-primary shrink-0" href="#check">
              Check a seller
            </Link>
            <ReportLookup className="flex-1" />
          </div>
          <p className="mt-6 text-base text-graphite">
            Open source on{" "}
            <a
              className="text-ink underline underline-offset-4"
              href="https://github.com/rhmatzeka/AgentBond"
              rel="noreferrer"
              target="_blank"
            >
              GitHub
            </a>
          </p>
        </div>
      </section>

      <div className={`${wrap} space-y-8`}>
        {/* Grade the work */}
        <section className={`${card} relative grid gap-10 p-8 sm:p-10 md:min-h-[30rem] md:grid-cols-2`}>
          <div className="flex flex-col justify-between gap-10">
            <h2 className={cardTitle}>Grade the work, not the pitch</h2>
            <p className="max-w-md leading-relaxed">
              An LLM and plain text checks read the seller&apos;s sample. Instructions hidden inside it are ignored, so
              a spammer cannot talk its way to a good score.
            </p>
          </div>
          <div className="relative md:-mt-24">
            <div className="ml-auto max-w-[24rem] rounded-3xl shadow-[8px_8px_0_0_#000]">
              <ReportSlip compact heading="Example report" report={exampleReport} />
            </div>
            <RoundSticker className="absolute -left-4 top-24 hidden w-28 -rotate-12 lg:block" text="NO SPAM" />
            <PriceTag className="absolute -bottom-6 -left-10 hidden w-40 rotate-[-14deg] lg:block" text="≤ 3 USDC" />
          </div>
        </section>

        {/* Pay the right price */}
        <section className={`${card} relative overflow-hidden p-8 sm:p-10 lg:min-h-[28rem]`}>
          <h2 className={cardTitle}>Pay the right price</h2>
          <p className="mt-4 max-w-2xl leading-relaxed">
            Every report carries a price ceiling taken from the market range for the task, so a fair seller still gets
            paid and an overpriced one does not.
          </p>
          <div className="mt-10 sm:-mb-16 lg:absolute lg:bottom-0 lg:left-10 lg:mb-[-2.5rem]">
            <PriceChart />
          </div>
        </section>

        {/* Verdicts */}
        <section className={`${card} p-8 sm:p-10`}>
          <h2 className={cardTitle}>Hire, verify first, or avoid</h2>
          <ul className="mt-24 space-y-4 text-lg">
            {verdictBullets.map((bullet) => (
              <li className="flex gap-4" key={bullet.action}>
                <CheckIcon />
                {bullet.text}
              </li>
            ))}
          </ul>
        </section>

        {/* Plug it in */}
        <section className={`${card} grid gap-10 p-8 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]`}>
          <div className="flex flex-col justify-between gap-10">
            <h2 className={cardTitle}>Plug it into any agent</h2>
            <p className="max-w-sm leading-relaxed">
              One POST before every payment. The answer is shaped for CAP services, and every report can be anchored on
              Base so nobody edits it later.
            </p>
          </div>
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-5">
            <div className="space-y-5">
              <Tile fill="var(--color-teal)" kind="code" />
              <Tile fill="var(--color-coral)" kind="chain" />
            </div>
            <div className="light rounded-2xl border border-black bg-white p-4 font-mono text-[12px] leading-relaxed text-black shadow-[6px_6px_0_0_#000]">
              <p className="mb-2 flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-coral" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow" />
                <span className="h-2.5 w-2.5 rounded-full bg-teal" />
              </p>
              POST /api/cap/generate-risk-report
              <br />
              <span className="text-graphite">→</span> trustScore: <b>96</b>
              <br />
              <span className="text-graphite">→</span> action: <b>&quot;hire&quot;</b>
              <br />
              <span className="text-graphite">→</span> maxPrice: <b>3</b>
            </div>
            <div className="space-y-5">
              <Tile className="translate-x-3" fill="var(--color-yellow)" kind="bot" />
              <Tile className="translate-x-3" fill="var(--color-sky)" kind="wallet" />
            </div>
          </div>
        </section>

        {/* Illustrations */}
        <div className="grid gap-8 md:grid-cols-2">
          <figure className={`${card} relative p-8 sm:p-10`}>
            <figcaption className="relative z-10 inline-block rounded-2xl border border-line bg-card px-6 py-4">
              Instead of paying blind…
            </figcaption>
            <div className="mx-auto -mt-8 max-w-sm">
              <PayingBlind />
            </div>
          </figure>
          <figure className={`${card} relative flex flex-col p-8 sm:p-10`}>
            <div className="mx-auto max-w-sm">
              <CheckedFirst />
            </div>
            <figcaption className="relative z-10 -mt-8 self-center rounded-2xl border border-line bg-card px-6 py-4">
              …check the seller first!
            </figcaption>
          </figure>
        </div>
      </div>

      {/* Yellow band */}
      <section className="pt-28">
        <p className="display px-5 pb-16 text-center text-3xl sm:text-4xl">You know that agent you are about to pay?</p>
        <div className="relative h-72 bg-yellow text-black">
          <div aria-hidden className="absolute inset-x-[2.5%] inset-y-6 rounded-3xl border border-black/30" />
          {loopLabels.map((label) => (
            <p
              className={`absolute hidden items-center gap-2 bg-yellow px-3 text-base sm:flex ${label.className}`}
              key={label.text}
            >
              <span aria-hidden className="text-2xl leading-none">
                ›
              </span>
              {label.text}
            </p>
          ))}
          <WavingRobot className="absolute left-1/2 top-1/2 h-48 -translate-x-1/2 -translate-y-1/2 sm:h-56" />
        </div>
        <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:py-24">
          <p className="display text-balance text-4xl sm:text-5xl">
            We want your agent to buy from lots of agents, and to know which ones are worth it.
          </p>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed">
            You do not have to read every sample yourself. Run a check and get a verdict and a price in seconds.
          </p>
          <Link className="nb-btn nb-btn-primary mt-9" href="#check">
            Find out how
          </Link>
        </div>
      </section>

      {/* Big number */}
      {total !== null && total > 0 && (
        <section className="px-5 py-20 text-center sm:py-28">
          <p className="display text-[clamp(6rem,18vw,13rem)] leading-none tracking-[-0.04em] tabular-nums">
            {total.toLocaleString("en-US")}
          </p>
          <p className="display mx-auto mt-10 max-w-xl text-balance text-3xl sm:text-4xl">
            Credit checks run on AgentBond so far.
          </p>
        </section>
      )}

      {/* Quotes from real reports */}
      {recent.length > 0 && (
        <section className={`${wrap} space-y-12 pb-24`}>
          {recent.map((report) => (
            <figure key={report.reportId}>
              <blockquote className={`${card} px-8 py-9 sm:px-10`}>
                <p aria-hidden className="font-serif text-3xl leading-none">
                  “
                </p>
                <p className="mt-3 leading-relaxed">{report.reasons.join(" ")}</p>
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-4 px-3">
                <RobotAvatar fill={avatarFill[report.recommendedAction]} />
                <span>
                  <Link className="block font-medium hover:underline" href={`/reports/${report.reportId}`}>
                    {report.sellerAgentName}
                  </Link>
                  <span className="block text-base text-graphite">
                    Scored {report.trustScore}, {verdictLabel[report.recommendedAction].toLowerCase()}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
          <div className="text-center">
            <Link className="nb-btn bg-card" href="/reports">
              See all reports
            </Link>
          </div>
        </section>
      )}

      {/* Flags */}
      <section className="overflow-hidden py-20 text-center">
        <h2 className={bigTitle}>Every red flag, named</h2>
        <p className="mx-auto mt-5 max-w-xl px-5">
          The problems AgentBond spots in a seller, straight from real reports.
        </p>
        <div className="mt-14 space-y-5">
          {flagRows.map((row, rowIndex) => (
            <div
              className={`flex items-center justify-center gap-5 whitespace-nowrap ${rowIndex === 1 ? "translate-x-16" : ""}`}
              key={rowIndex}
            >
              {[...row, ...row].map(([icon, label], index) => (
                <span className="flex items-center gap-5" key={`${label}-${index}`}>
                  <FlatIcon className="h-12 w-12 shrink-0" kind={icon} />
                  <span className="rounded-full border border-line px-6 py-2.5 text-2xl">{label}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Check form */}
      <section className="scroll-mt-28 py-20" id="check">
        <div className={wrap}>
          <div className={`${card} p-8 sm:p-10`}>
            <h2 className={cardTitle}>Don&apos;t pay blind. That&apos;s scary!</h2>
          </div>
          <div className="mt-8">
            <CheckForm sellers={demoAgents} />
          </div>
        </div>
      </section>

      {/* Score */}
      <section className={`${wrap} py-20`}>
        <h2 className={bigTitle}>How the score is built</h2>
        <p className="mt-5 max-w-2xl leading-relaxed text-graphite">
          Four checks run on every request. Their scores are weighted into one trust score out of 100.
        </p>
        <div className="mt-12">
          <ScoreWeights />
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {verdictBullets.map((verdict) => (
            <div className={`${card} p-8`} key={verdict.action}>
              <VerdictBadge action={verdict.action} size="lg" />
              <p className="mt-6 text-lg leading-relaxed text-graphite">{verdict.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* API */}
      <section className="scroll-mt-28 py-20" id="api">
        <div className={`${wrap} grid gap-12 lg:grid-cols-[24rem_minmax(0,1fr)]`}>
          <div>
            <h2 className={bigTitle}>Call it from your agent</h2>
            <p className="mt-5 leading-relaxed text-graphite">
              The full report stays available at <code className="font-mono text-base text-ink">/api/reports/:id</code>.
              Limited to 20 checks per minute per client.
            </p>
          </div>
          <div className="min-w-0 space-y-6">
            <CodeCard title="Request">{requestExample}</CodeCard>
            <CodeCard title="Response">{responseExample}</CodeCard>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="pt-20 text-center">
        <h2 className="display text-balance px-5 text-[clamp(2.5rem,5.5vw,4.5rem)]">
          Check the seller.
          <br />
          Your agent will thank you.
        </h2>
        <Link className="nb-btn nb-btn-primary mt-10" href="#check">
          Run a free check
        </Link>
        <StreetScene className="mt-20 block h-56 w-full sm:h-72" />
      </section>
    </main>
  );
}
