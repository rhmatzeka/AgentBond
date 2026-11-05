import type { Metadata } from "next";
import Link from "next/link";
import { demoAgents } from "@/lib/data/demo-agents";
import { formatUsdc, scoreTone } from "@/lib/format";
import { calculateReputationScore } from "@/lib/scoring/reputation-score";

export const metadata: Metadata = { title: "Demo sellers" };

export default function DemoPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 pb-24 pt-12 sm:px-8">
      <h1 className="display text-[clamp(2.5rem,5.5vw,4.5rem)]">Demo sellers</h1>
      <p className="mt-4 max-w-2xl text-lg text-graphite">
        Four synthetic sellers, each built to show one risk pattern: a reliable specialist, a cheap spammer, a decent
        seller that overcharges, and a newcomer with no history.
      </p>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
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
            <article className="nb-card flex flex-col overflow-hidden" key={agent.id}>
              <div aria-hidden className={`h-4 border-b border-ink ${scoreTone(reputation)}`} />
              <div className="flex flex-1 flex-col p-6">
                <div className="flex-1">
                  <h2 className="display text-3xl">{agent.name}</h2>
                  <p className="mt-1 text-graphite">{agent.description}</p>
                  <p className="mt-3 text-sm text-graphite">
                    Asks {formatUsdc(agent.defaultPriceUsdc)} for{" "}
                    {agent.taskTypes.map((type) => type.replace("_", " ")).join(" and ")} work.
                    {agent.suspiciousActivity && (
                      <span className="font-medium text-ink"> Flagged for suspicious activity.</span>
                    )}
                  </p>
                </div>
                <dl className="mt-6 grid grid-cols-3 gap-x-4 gap-y-4 border-t border-ink pt-5 sm:grid-cols-5">
                  {stats.map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-xs text-graphite">{label}</dt>
                      <dd className="display mt-1 whitespace-nowrap text-xl tabular-nums">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          );
        })}
      </div>

      <Link className="mt-12 nb-btn bg-ink text-card" href="/#check">
        Check one of them
      </Link>
    </main>
  );
}
