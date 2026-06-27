export function AgentCallGraph() {
  return (
    <div className="rounded-2xl border border-white/15 bg-black p-5 text-white shadow-2xl shadow-black/20">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold">A2A call graph</p>
        <span className="rounded-full bg-[#00d4a4] px-2 py-1 text-xs font-semibold text-black">live flow</span>
      </div>
      <div className="font-mono text-sm leading-7 text-zinc-300">
        <p>BuyerAgent</p>
        <p className="pl-4 text-[#00d4a4]">-&gt; AgentBond</p>
        <p className="pl-8">-&gt; OutputQualityChecker</p>
        <p className="pl-8">-&gt; PricingBenchmarkChecker</p>
        <p className="pl-8">-&gt; ReputationChecker</p>
        <p className="pl-8">-&gt; TaskFitChecker</p>
        <p className="pl-4 text-[#00d4a4]">&lt;- RiskReport JSON</p>
      </div>
    </div>
  );
}
