const checkers = ["OutputQualityChecker", "PricingBenchmarkChecker", "ReputationChecker", "TaskFitChecker"];

export function VerificationTopology() {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.01] p-5">
      <h4 className="mb-4 font-mono text-xs uppercase tracking-widest text-zinc-500">A2A Verification Topology</h4>
      <div className="space-y-2 font-mono text-xs leading-relaxed text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="text-brand-green">●</span> BuyerAgent
        </div>
        <div className="ml-1 space-y-1.5 border-l border-white/10 py-1 pl-4">
          <div>
            ↳ <span className="font-semibold text-white">AgentBond Orchestrator</span> (paid service)
          </div>
          <div className="ml-1 space-y-1 border-l border-white/5 pl-4">
            {checkers.map((checker) => (
              <div key={checker}>↳ {checker}</div>
            ))}
          </div>
          <div>↳ Emits report registration to Base registry</div>
        </div>
      </div>
    </div>
  );
}
