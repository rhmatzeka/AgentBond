import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { demoAgents } from "@/lib/data/demo-agents";

export default function DemoPage() {
  return (
    <main className="bg-vibe-theme min-h-screen text-white">
      <div className="mx-auto max-w-6xl px-6 pb-16">
        <SiteHeader />
        <Link className="font-mono text-xs text-zinc-400 transition hover:text-white" href="/#playground">
          ← Back to playground
        </Link>
        <h1 className="mt-6 text-5xl font-semibold tracking-tight">Demo seller agents</h1>
        <p className="mt-4 max-w-2xl leading-7 text-zinc-400">
          Synthetic sellers used to prove good, bad, overpriced, and unknown risk profiles in the hackathon demo.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {demoAgents.map((agent) => (
            <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-6" key={agent.id}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">{agent.name}</h2>
                <span className="rounded-full bg-brand-green/10 px-3 py-1 font-mono text-xs text-brand-green">
                  {agent.defaultPriceUsdc} USDC
                </span>
              </div>
              <p className="text-sm leading-6 text-zinc-400">{agent.description}</p>
              <p className="mt-3 font-mono text-xs text-zinc-500">
                id: {agent.id} · tasks: {agent.taskTypes.join(", ")}
              </p>
              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Completed", agent.completedJobs],
                  ["Failed", agent.failedJobs],
                  ["Unique buyers", agent.uniqueBuyers],
                  ["Rating", `${agent.averageRating}/5`],
                ].map(([label, value]) => (
                  <div className="rounded-xl border border-white/5 bg-black/30 p-3" key={label}>
                    <dt className="text-zinc-500">{label}</dt>
                    <dd className="font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
