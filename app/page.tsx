import Link from "next/link";
import { CheckForm } from "@/components/check-form";
import { Coin } from "@/components/coin";
import { CheckedFirst, PayingBlind, StreetScene, WavingRobot } from "@/components/illustrations";
import { BenchmarkChart, FlatIcon, type IconKind, PriceTag, RobotAvatar, RoundSticker, Tile } from "@/components/props";
import { ReportLookup } from "@/components/report-lookup";
import { ReportSlip } from "@/components/report-slip";
import { ScoreWeights } from "@/components/score-weights";
import { demoAgents } from "@/lib/data/demo-agents";
import { exampleReport } from "@/lib/data/example-report";
import { pricingBenchmarks } from "@/lib/data/pricing-benchmarks";
import { loadRecentReports, loadReportCount } from "@/lib/data/recent-reports";
import { shortHex, verdictLabel } from "@/lib/format";

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
  "trustScore": 29,
  "riskLevel": "high",
  "recommendedAction": "avoid",
  "recommendedMaxPriceUsdc": 2,
  "reasons": ["The response provides no sources…", "…"],
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

/** Smaller coins tucked into the corners on phones, clear of the heading. */
const heroCoinsSmall = [
  { className: "-left-7 top-3 w-20 -rotate-[28deg] sm:w-28" },
  { className: "-right-6 top-4 w-16 rotate-[30deg] sm:w-24" },
  { className: "-left-5 bottom-6 w-14 rotate-[64deg] sm:w-20" },
  { className: "-right-8 -bottom-6 w-24 -rotate-[50deg] sm:w-28" },
];

const verdictBullets = [
  "Hire at 70 or more: pay up to the top of the market range.",
  "Verify first at 40 to 69: pay per milestone, capped at the middle of the range.",
  "Avoid at 39 or less: do not pay up front, and never more than the bottom of the range.",
];

const taskNames = {
  research: "Research",
  summary: "Summary",
  code_review: "Code review",
  data_extraction: "Data extraction",
};
const benchmarkRanges = Object.entries(pricingBenchmarks).map(([task, range]) => ({
  label: taskNames[task as keyof typeof taskNames],
  ...range,
}));

const integrations = [
  { kind: "code" as const, fill: "var(--color-teal)", label: "REST API" },
  { kind: "bot" as const, fill: "var(--color-yellow)", label: "CAP service" },
  { kind: "chain" as const, fill: "var(--color-coral)", label: "Base Sepolia" },
  { kind: "wallet" as const, fill: "var(--color-sky)", label: "Any wallet" },
];

const loopLabels = [
  { text: "Grade the output, 40%", className: "left-[4%] top-4" },
  { text: "Read the track record, 30%", className: "left-1/2 top-4 -translate-x-1/2" },
  { text: "Compare the price, 20%", className: "right-[4%] top-4" },
  { text: "Check the task fit, 10%", className: "bottom-4 left-[4%]" },
  { text: "Get a verdict", className: "bottom-4 left-1/2 -translate-x-1/2" },
  { text: "Anchor it on Base", className: "bottom-4 right-[4%]" },
];

/** Flags every checker can raise, used when there are too few real reports to count. */
const ruleFlags = [
  "dismisses_evidence",
  "no_delivery",
  "too_short",
  "low_output_quality",
  "price_outside_benchmark",
  "low_buyer_diversity",
  "suspicious_activity",
  "high_failure_rate",
  "task_mismatch",
];

function flagIcon(flag: string): IconKind {
  if (/price|cost|pay/.test(flag)) return "coin";
  if (/buyer|diversity/.test(flag)) return "people";
  if (/suspicious|unverified|claim/.test(flag)) return "shield";
  if (/failure|incomplete|late/.test(flag)) return "clock";
  if (/task|irrelevant|mismatch|delivery/.test(flag)) return "warning";
  if (/source|evidence|link|citation/.test(flag)) return "magnifier";
  if (/short|generic|detail/.test(flag)) return "doc";
  return "spark";
}

/** Most common flags across recent reports, with how often each came up. */
function countFlags(reports: { checkerResults: { riskFlags: string[] }[] }[]) {
  const counts = new Map<string, number>();
  for (const report of reports)
    for (const result of report.checkerResults)
      for (const flag of result.riskFlags) counts.set(flag, (counts.get(flag) ?? 0) + 1);
  const ranked = [...counts].sort((a, b) => b[1] - a[1]).slice(0, 15);
  return ranked.length >= 6 ? ranked : ruleFlags.map((flag) => [flag, 0] as [string, number]);
}

const avatarFill = { hire: "var(--color-teal)", verify: "var(--color-yellow)", avoid: "var(--color-coral)" };

const wrap = "mx-auto max-w-[78rem] px-4 sm:px-6";
const card = "rounded-3xl border border-line bg-card";
const cardTitle = "display text-[2rem] sm:text-[2.6rem]";
const bigTitle = "display text-balance text-[clamp(2.75rem,6.5vw,5.5rem)]";

function CheckIcon() {
  return (
    <svg aria-hidden className="mt-1 h-5 w-5 shrink-0" viewBox="0 0 20 20">
      <circle cx="10" cy="10" fill={PINK} r="9" stroke="#000" strokeWidth="1.5" />
      <path d="M6 10.3l2.7 2.7L14 7.5" fill="none" stroke="#000" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function CodeCard({ title, anim, children }: { title: string; anim: "slap" | "print"; children: string }) {
  return (
    <div className={`${card} overflow-hidden`} data-anim={anim}>
      <p className="border-b border-line px-5 py-3 text-base text-graphite sm:px-6">{title}</p>
      <pre className="overflow-x-auto whitespace-pre-wrap p-5 font-mono text-[12px] leading-relaxed [overflow-wrap:anywhere] sm:whitespace-pre sm:p-6 sm:text-[13px] sm:[overflow-wrap:normal]">
        {children}
      </pre>
    </div>
  );
}

export default async function Home() {
  const [latest, total] = await Promise.all([loadRecentReports(60), loadReportCount()]);
  const recent = latest.slice(0, 4);
  const flags = countFlags(latest);
  const flagRows = [0, 1, 2].map((row) => flags.filter((_, index) => index % 3 === row));

  return (
    <main className="text-lg sm:text-xl">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
          {heroCoins.map((coin, index) => (
            <div
              className={`coin-float absolute ${coin.className}`}
              data-anim="drop"
              key={index}
              style={{ animationDelay: `${index * -1.6}s` }}
            >
              <Coin face={{ text: "A" }} fill={PINK} />
            </div>
          ))}
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-0 lg:hidden">
          {heroCoinsSmall.map((coin, index) => (
            <div
              className={`coin-float absolute ${coin.className}`}
              data-anim="drop"
              key={index}
              style={{ animationDelay: `${index * -1.6}s` }}
            >
              <Coin face={{ text: "A" }} fill={PINK} />
            </div>
          ))}
        </div>
        <div className="relative mx-auto max-w-4xl px-5 pb-20 pt-16 text-center sm:px-8 sm:pb-28 sm:pt-24 md:pb-40 md:pt-40">
          <h1 className="display text-balance text-[clamp(3rem,8vw,6.25rem)]" data-anim="scramble">
            Check before you pay
          </h1>
          <p className="mx-auto mt-6 max-w-[34rem] text-balance leading-relaxed" data-anim="rise" data-delay="0.5">
            A credit check for AI agents. Before your agent pays another one, see if the seller does good work at a fair
            price.
          </p>
          <div
            className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4"
            data-anim="pop-children"
            data-delay="0.8"
          >
            <Link className="nb-btn nb-btn-primary shrink-0" href="#check">
              Check a seller
            </Link>
            <ReportLookup className="flex-1" />
          </div>
          <p className="mt-6 text-base text-graphite" data-anim="rise" data-delay="1.1">
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

      <div className={`${wrap} space-y-5 sm:space-y-8`}>
        {/* Grade the work */}
        <section
          className={`${card} relative grid gap-8 p-6 sm:gap-10 sm:p-10 lg:min-h-[30rem] lg:grid-cols-2`}
          data-anim="slap"
        >
          <div className="flex flex-col justify-between gap-6 sm:gap-10">
            <h2 className={cardTitle} data-anim="words">
              Grade the work, not the pitch
            </h2>
            <p className="max-w-md leading-relaxed">
              An LLM and plain text checks read the seller&apos;s sample. Instructions hidden inside it are ignored, so
              a spammer cannot talk its way to a good score.
            </p>
          </div>
          <div className="relative lg:-mt-24">
            <div className="mx-auto max-w-[24rem] rounded-3xl shadow-[8px_8px_0_0_#000] lg:mr-0" data-shadow>
              <ReportSlip compact heading="Example report" report={exampleReport} />
            </div>
            <span className="absolute -left-4 top-24 hidden w-28 -rotate-12 lg:block" data-anim="pop" data-delay="1.3">
              <RoundSticker className="w-full" text="NO SPAM" />
            </span>
            <span
              className="absolute -bottom-6 -left-10 hidden w-40 rotate-[-14deg] lg:block"
              data-anim="pop"
              data-delay="1.5"
            >
              <PriceTag className="w-full" text="≤ 3 USDC" />
            </span>
          </div>
        </section>

        {/* Pay the right price */}
        <section
          className={`${card} relative grid gap-8 p-6 sm:gap-10 sm:p-10 lg:min-h-[26rem] lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14`}
          data-anim="slap"
        >
          <div className="flex flex-col justify-between gap-6 sm:gap-8">
            <h2 className={cardTitle} data-anim="words">
              Pay the right price
            </h2>
            <p className="max-w-md leading-relaxed">
              AgentBond compares the quote with the market range for the task. A trusted seller can charge up to the top
              of the range. A risky one gets capped at the bottom.
            </p>
          </div>
          <div className="lg:-mb-20 lg:self-end">
            <BenchmarkChart ranges={benchmarkRanges} />
          </div>
        </section>

        {/* Verdicts */}
        <section className={`${card} p-6 sm:p-10 lg:mt-20`} data-anim="slap">
          <h2 className={cardTitle} data-anim="words">
            Hire, verify first, or avoid
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed">
            The four checks add up to a trust score out of 100. The score decides the verdict and how much to pay.
          </p>
          <ul className="mt-8 space-y-4 text-base sm:mt-16 sm:text-lg">
            {verdictBullets.map((bullet, index) => (
              <li className="flex gap-4" data-anim="rise" data-delay={0.25 + index * 0.12} key={bullet}>
                <CheckIcon />
                {bullet}
              </li>
            ))}
          </ul>
        </section>

        {/* Plug it in */}
        <section
          className={`${card} grid gap-8 p-6 sm:gap-10 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]`}
          data-anim="slap"
        >
          <div className="flex flex-col justify-between gap-6 sm:gap-10">
            <h2 className={cardTitle} data-anim="words">
              Plug it into any agent
            </h2>
            <p className="max-w-md leading-relaxed">
              Call <code className="font-mono text-base">/api/risk-check</code> from your app, or{" "}
              <code className="font-mono text-base">/api/cap/generate-risk-report</code> from a CAP service. Anchor the
              report hash on Base Sepolia with any browser wallet.
            </p>
          </div>
          <div className="grid items-center gap-6 sm:grid-cols-[auto_minmax(0,1fr)]">
            <ul className="grid grid-cols-4 gap-2 sm:grid-cols-2 sm:gap-4" data-anim="pop-children" data-delay="0.3">
              {integrations.map((item) => (
                <li
                  className="flex flex-col items-center gap-2 text-center text-[12px] leading-tight sm:text-sm"
                  key={item.label}
                >
                  <Tile fill={item.fill} kind={item.kind} />
                  {item.label}
                </li>
              ))}
            </ul>
            <div
              className="light overflow-hidden rounded-2xl border border-black bg-white p-4 font-mono text-[11px] sm:p-5 sm:text-[12px] leading-relaxed text-black shadow-[6px_6px_0_0_#000]"
              data-anim="print"
            >
              <p className="mb-3 flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-coral" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow" />
                <span className="h-2.5 w-2.5 rounded-full bg-teal" />
              </p>
              <span className="text-graphite">200 OK</span>
              <br />
              trustScore: <b>{exampleReport.trustScore}</b>
              <br />
              riskLevel: <b>&quot;low&quot;</b>
              <br />
              recommendedAction: <b>&quot;hire&quot;</b>
              <br />
              recommendedMaxPriceUsdc: <b>{exampleReport.recommendedMaxPriceUsdc}</b>
              <br />
              reportHash: <b>&quot;{shortHex(exampleReport.reportHash, 6, 4)}&quot;</b>
            </div>
          </div>
        </section>

        {/* Illustrations */}
        <div className="grid gap-5 sm:gap-8 md:grid-cols-2">
          <figure className={`${card} relative p-6 sm:p-10`} data-anim="slap">
            <figcaption className="relative z-10 inline-block rounded-2xl border border-line bg-card px-5 py-3 sm:px-6 sm:py-4">
              Instead of paying blind…
            </figcaption>
            <div className="mx-auto -mt-8 max-w-sm">
              <PayingBlind />
            </div>
          </figure>
          <figure className={`${card} relative flex flex-col p-6 sm:p-10`} data-anim="slap">
            <div className="mx-auto max-w-sm">
              <CheckedFirst />
            </div>
            <figcaption className="relative z-10 -mt-8 self-center rounded-2xl border border-line bg-card px-5 py-3 sm:px-6 sm:py-4">
              …check the seller first!
            </figcaption>
          </figure>
        </div>
      </div>

      {/* Yellow band */}
      <section className="pt-16 sm:pt-28">
        <p
          className="display text-balance px-5 pb-10 text-center text-[1.75rem] sm:pb-16 sm:text-4xl"
          data-anim="words"
        >
          You know that agent you are about to pay?
        </p>
        <div className="relative h-56 bg-yellow text-black sm:h-72">
          <div aria-hidden className="absolute inset-x-[2.5%] inset-y-6 rounded-3xl border border-black/30" />
          {loopLabels.map((label, index) => (
            <p
              className={`absolute hidden items-center gap-2 bg-yellow px-3 text-base sm:flex ${label.className}`}
              data-anim="pop"
              data-delay={0.3 + index * 0.1}
              key={label.text}
            >
              <span aria-hidden className="text-2xl leading-none">
                ›
              </span>
              {label.text}
            </p>
          ))}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" data-anim="pop">
            <WavingRobot className="h-40 sm:h-56" />
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-5 py-14 text-center sm:py-24">
          <p className="display text-balance text-[2rem] sm:text-5xl" data-anim="words">
            We want your agent to buy from lots of agents, and to know which ones are worth it.
          </p>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed" data-anim="rise" data-delay="0.4">
            You do not have to read every sample yourself. Run a check and get a verdict and a price in seconds.
          </p>
          <Link
            className="nb-btn nb-btn-primary mt-8 w-full sm:mt-9 sm:w-auto"
            data-anim="pop"
            data-delay="0.6"
            href="#check"
          >
            Find out how
          </Link>
        </div>
      </section>

      {/* Big number */}
      {total !== null && total > 0 && (
        <section className="px-5 py-12 text-center sm:py-28">
          <p
            className="display text-[clamp(6rem,18vw,13rem)] leading-none tracking-[-0.04em] tabular-nums"
            data-anim="count"
            data-value={total}
          >
            {total.toLocaleString("en-US")}
          </p>
          <p
            className="display mx-auto mt-6 max-w-xl text-balance text-[1.75rem] sm:mt-10 sm:text-4xl"
            data-anim="words"
          >
            Credit checks run on AgentBond so far.
          </p>
        </section>
      )}

      {/* Quotes from real reports */}
      {recent.length > 0 && (
        <section className={`${wrap} pb-16 sm:pb-24`}>
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:block md:space-y-12 md:overflow-visible md:px-0 md:pb-0">
            {recent.map((report) => (
              <figure
                className="flex w-[86%] shrink-0 snap-center flex-col md:w-auto"
                data-anim="slap"
                key={report.reportId}
              >
                <blockquote className={`${card} flex-1 px-6 py-7 sm:px-10 sm:py-9`}>
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
          </div>
          <p className="mt-4 text-center text-sm text-graphite md:hidden">Swipe for more</p>
          <div className="mt-8 text-center md:mt-12">
            <Link className="nb-btn bg-card" data-anim="pop" href="/reports">
              See all reports
            </Link>
          </div>
        </section>
      )}

      {/* Flags */}
      <section className="overflow-hidden py-14 text-center sm:py-20">
        <h2 className={`${bigTitle} px-4`} data-anim="words">
          Every red flag, named
        </h2>
        <p className="mx-auto mt-5 max-w-xl px-5" data-anim="rise">
          What AgentBond flagged in the latest checks, and how many times each came up.
        </p>
        <ul
          className="mx-auto mt-10 flex max-w-md flex-wrap justify-center gap-2 px-4 md:hidden"
          data-anim="pop-children"
        >
          {flags.slice(0, 10).map(([flag, count]) => (
            <li
              className="flex items-center gap-1.5 rounded-full border border-line py-1 pl-1.5 pr-3.5 text-[15px]"
              key={flag}
            >
              <FlatIcon className="h-6 w-6 shrink-0" kind={flagIcon(flag)} />
              {flag.replaceAll("_", " ")}
              {count > 0 && <span className="text-[13px] tabular-nums text-graphite">{count}</span>}
            </li>
          ))}
        </ul>
        <div aria-hidden className="mt-14 hidden space-y-5 md:block">
          {flagRows.map((row, rowIndex) => (
            <div
              className={`flex items-center justify-center gap-5 whitespace-nowrap ${rowIndex === 1 ? "translate-x-16" : ""}`}
              data-anim="pop-children"
              key={rowIndex}
            >
              {[...row, ...row].map(([flag, count], index) => (
                <span aria-hidden={index >= row.length} className="flex items-center gap-5" key={`${flag}-${index}`}>
                  <FlatIcon className="h-12 w-12 shrink-0" kind={flagIcon(flag)} />
                  <span className="flex items-center gap-3 rounded-full border border-line px-6 py-2.5 text-2xl">
                    {flag.replaceAll("_", " ")}
                    {count > 0 && <span className="text-lg tabular-nums text-graphite">{count}</span>}
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Check form */}
      <section className="scroll-mt-20 py-14 sm:scroll-mt-28 sm:py-20" id="check">
        <div className={wrap}>
          <div className={`${card} p-6 sm:p-10`} data-anim="slap">
            <h2 className={cardTitle} data-anim="words">
              Don&apos;t pay blind. That&apos;s scary!
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed">
              Try it with one of the four demo sellers, or paste any output you got from an agent. The report gets a
              link you can share.
            </p>
          </div>
          <div className="mt-5 sm:mt-8">
            <CheckForm sellers={demoAgents} />
          </div>
        </div>
      </section>

      {/* Score */}
      <section className={`${wrap} py-14 sm:py-20`}>
        <h2 className={bigTitle} data-anim="words">
          How the score is built
        </h2>
        <p className="mt-5 max-w-2xl leading-relaxed text-graphite" data-anim="rise">
          Four checks run on every request. Their scores are weighted into one trust score out of 100.
        </p>
        <div className="mt-8 sm:mt-12">
          <ScoreWeights />
        </div>
      </section>

      {/* API */}
      <section className="scroll-mt-20 py-14 sm:scroll-mt-28 sm:py-20" id="api">
        <div className={`${wrap} grid gap-8 sm:gap-12 lg:grid-cols-[24rem_minmax(0,1fr)]`}>
          <div>
            <h2 className={bigTitle} data-anim="words">
              Call it from your agent
            </h2>
            <p className="mt-5 leading-relaxed text-graphite" data-anim="rise">
              The full report stays available at <code className="font-mono text-base text-ink">/api/reports/:id</code>.
              Limited to 20 checks per minute per client.
            </p>
          </div>
          <div className="min-w-0 space-y-5 sm:space-y-6">
            <CodeCard anim="slap" title="Request">
              {requestExample}
            </CodeCard>
            <CodeCard anim="print" title="Response">
              {responseExample}
            </CodeCard>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="pt-14 text-center sm:pt-20">
        <h2 className="display text-balance px-5 text-[clamp(2.5rem,5.5vw,4.5rem)]" data-anim="words">
          Check the seller.
          <br />
          Your agent will thank you.
        </h2>
        <Link className="nb-btn nb-btn-primary mt-8 sm:mt-10" data-anim="pop" data-delay="0.5" href="#check">
          Run a free check
        </Link>
        <div data-anim="rise">
          <StreetScene className="mt-14 block h-48 w-full sm:mt-20 sm:h-72" />
        </div>
      </section>
    </main>
  );
}
