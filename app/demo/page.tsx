import type { Metadata } from "next";
import Link from "next/link";
import { demoAgents } from "@/lib/data/demo-agents";
import { formatUsdc } from "@/lib/format";
import { calculateReputationScore } from "@/lib/scoring/reputation-score";

export const metadata: Metadata = { title: "Demo sellers" };

export default function DemoPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 pt-10 sm:px-8">
      <h1 className="text-4xl font-black tracking-[-0.04em] sm:text-5xl">Demo sellers</h1>
      <p className="mt-2 max-w-2xl text-graphite">
        Four synthetic sellers, each built to show one risk pattern: a reliable specialist, a cheap spammer, a decent
        seller that overcharges, and a newcomer with no history.
      </p>

      <div className="mt-10 divide-y-2 divide-ink border-y-2 border-ink">
        {demoAgents.map((agent) => {
          const total = agent.completedJobs + agent.failedJobs;
          const stats = [
            ["Jobs done", `${agent.completedJobs} of ${total}`],
            ["Unique buyers", agent.uniqueBuyers],
            ["Rating", `${agent.averageRating} of 5`],
            ["Refunds", agent.refundCount],
            ["Reputation", calculateReputationScore(agent)],
          ] as const;
          return (
            <article className="grid gap-6 py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]" key={agent.id}>
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">{agent.name}</h2>
                <p className="mt-1 text-graphite">{agent.description}</p>
                <p className="mt-3 text-sm text-graphite">
                  Asks {formatUsdc(agent.defaultPriceUsdc)} for{" "}
                  {agent.taskTypes.map((type) => type.replace("_", " ")).join(" and ")} work.
                  {agent.suspiciousActivity && (
                    <span className="font-bold text-ink"> Flagged for suspicious activity.</span>
                  )}
                </p>
              </div>
              <dl className="grid grid-cols-3 gap-x-6 gap-y-4 sm:grid-cols-5">
                {stats.map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-sm text-graphite">{label}</dt>
                    <dd className="mt-0.5 font-mono text-xl font-semibold tabular-nums">{value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          );
        })}
      </div>

      <Link className="mt-10 nb-btn bg-ink text-card" href="/#check">
        Check one of them
      </Link>
    </main>
  );
}
