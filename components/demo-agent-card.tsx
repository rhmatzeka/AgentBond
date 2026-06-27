"use client";

import type { SellerAgent, TaskType } from "@/lib/types/agent";

export function DemoAgentCard({
  agent,
  selected,
  onSelect,
}: {
  agent: SellerAgent;
  selected: boolean;
  onSelect: (agentId: string, taskType: TaskType, price: number, output: string) => void;
}) {
  return (
    <button
      className={`rounded-2xl border p-5 text-left transition ${
        selected ? "border-[#00d4a4] bg-white shadow-[0_12px_40px_rgba(0,212,164,0.14)]" : "border-zinc-200 bg-white hover:border-zinc-300"
      }`}
      onClick={() => onSelect(agent.id, agent.taskTypes[0], agent.defaultPriceUsdc, agent.sampleOutput)}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight">{agent.name}</h3>
        <span className="rounded-full bg-zinc-100 px-2 py-1 font-mono text-xs text-zinc-600">{agent.defaultPriceUsdc} USDC</span>
      </div>
      <p className="mb-4 text-sm leading-6 text-zinc-600">{agent.description}</p>
      <div className="flex flex-wrap gap-2 text-xs text-zinc-600">
        <span className="rounded-full border border-zinc-200 px-2 py-1">{agent.completedJobs} completed</span>
        <span className="rounded-full border border-zinc-200 px-2 py-1">{agent.uniqueBuyers} buyers</span>
        <span className="rounded-full border border-zinc-200 px-2 py-1">{agent.averageRating}/5</span>
      </div>
    </button>
  );
}
