import type { SellerAgent } from "@/lib/types/agent";

export function SellerAgentCard({
  agent,
  selected,
  onSelect,
}: {
  agent: SellerAgent;
  selected: boolean;
  onSelect: (agent: SellerAgent) => void;
}) {
  return (
    <button
      aria-pressed={selected}
      className={`group rounded-2xl border p-5 text-left transition-all duration-200 ${
        selected
          ? "border-brand-green bg-white/[0.03] shadow-[0_0_20px_rgba(0,212,164,0.05)]"
          : "border-white/5 bg-white/[0.01] hover:border-white/15 hover:bg-white/[0.02]"
      }`}
      onClick={() => onSelect(agent)}
      type="button"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="font-semibold tracking-tight text-white">{agent.name}</h4>
          <p className="mt-1 text-xs leading-normal text-zinc-400">{agent.description}</p>
        </div>
        <span className="whitespace-nowrap rounded bg-brand-green/10 px-2 py-0.5 font-mono text-xs text-brand-green">
          {agent.defaultPriceUsdc} USDC
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-3 font-mono text-[11px] text-zinc-500">
        <span>
          Jobs: {agent.completedJobs} / {agent.completedJobs + agent.failedJobs}
        </span>
        <span>•</span>
        <span>Buyers: {agent.uniqueBuyers}</span>
        <span>•</span>
        <span>Rating: {agent.averageRating}/5</span>
      </div>
    </button>
  );
}
