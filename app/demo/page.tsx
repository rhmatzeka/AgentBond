import Link from "next/link";
import { demoAgents } from "@/lib/data/demo-agents";

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 text-black">
      <div className="mx-auto max-w-6xl">
        <Link className="text-sm font-medium text-zinc-600" href="/">
          Back to dashboard
        </Link>
        <h1 className="mt-6 text-5xl font-semibold tracking-tight">Demo seller agents</h1>
        <p className="mt-4 max-w-2xl leading-7 text-zinc-600">
          Synthetic sellers used to prove good, bad, overpriced, and unknown risk profiles in the hackathon demo.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {demoAgents.map((agent) => (
            <article className="rounded-2xl border border-zinc-200 bg-white p-6" key={agent.id}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-semibold">{agent.name}</h2>
                <span className="rounded-full bg-zinc-100 px-3 py-1 font-mono text-xs">{agent.defaultPriceUsdc} USDC</span>
              </div>
              <p className="text-sm leading-6 text-zinc-600">{agent.description}</p>
              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-zinc-50 p-3">
                  <dt className="text-zinc-500">Completed</dt>
                  <dd className="font-semibold">{agent.completedJobs}</dd>
                </div>
                <div className="rounded-xl bg-zinc-50 p-3">
                  <dt className="text-zinc-500">Failed</dt>
                  <dd className="font-semibold">{agent.failedJobs}</dd>
                </div>
                <div className="rounded-xl bg-zinc-50 p-3">
                  <dt className="text-zinc-500">Unique buyers</dt>
                  <dd className="font-semibold">{agent.uniqueBuyers}</dd>
                </div>
                <div className="rounded-xl bg-zinc-50 p-3">
                  <dt className="text-zinc-500">Rating</dt>
                  <dd className="font-semibold">{agent.averageRating}/5</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
