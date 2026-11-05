import type { Metadata } from "next";
import Link from "next/link";
import { demoAgents } from "@/lib/data/demo-agents";
import { formatUsdc, scoreTone } from "@/lib/format";
import { calculateReputationScore } from "@/lib/scoring/reputation-score";

export const metadata: Metadata = { title: "Demo sellers" };

export default function DemoPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-8 sm:pb-24 sm:pt-12">
      <h1 className="display text-[clamp(2.5rem,5.5vw,4.5rem)]" data-anim="scramble">
        Demo sellers
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-graphite" data-anim="rise" data-delay="0.4">
        Four synthetic sellers, each built to show one risk pattern: a reliable specialist, a cheap spammer, a decent
        seller that overcharges, and a newcomer with no history.
      </p>

      <div className="mt-8 grid gap-5 sm:mt-12 sm:gap-6 lg:grid-cols-2">
        {demoAgents.map((agent) => {
          const total = agent.completedJobs + agent.failedJobs;
          const reputation = calculateReputationScore(agent);
          const stats = [
            ["Jobs done", `${agent.completedJobs}/${total}`],
            ["Unique buyers", agent.uniqueBuyers],
            ["Rating", `${agent.averageRating}/5`],
            ["Refunds", agent.refundCount],
            ["Reputation", reputation],
          ] as const;
          return (
            <article className="nb-card flex flex-col overflow-hidden" data-anim="slap" key={agent.id}>
              <div aria-hidden className={`h-4 border-b border-line ${scoreTone(reputation)}`} />
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex-1">
                  <h2 className="display text-[1.75rem] sm:text-3xl">{agent.name}</h2>
                  <p className="mt-1 text-graphite">{agent.description}</p>
                  <p className="mt-3 text-sm text-graphite">
                    Asks {formatUsdc(agent.defaultPriceUsdc)} for{" "}
                    {agent.taskTypes.map((type) => type.replace("_", " ")).join(" and ")} work.
                    {agent.suspiciousActivity && (
                      <span className="font-medium text-ink"> Flagged for suspicious activity.</span>
                    )}
                  </p>
                </div>
                <dl className="mt-6 grid grid-cols-3 gap-x-3 gap-y-5 border-t border-line pt-5 sm:grid-cols-5">
                  {stats.map(([label, value]) => (
                    <div className="flex flex-col justify-end" key={label}>
                      <dt className="text-[13px] leading-tight text-graphite sm:text-sm">{label}</dt>
                      <dd className="display mt-1 whitespace-nowrap text-2xl tabular-nums">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          );
        })}
      </div>

      <Link className="mt-10 nb-btn nb-btn-primary w-full sm:mt-12 sm:w-auto" data-anim="pop" href="/#check">
        Check one of them
      </Link>
    </main>
  );
}
