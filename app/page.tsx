"use client";
import { useState, useTransition } from "react";
import { WalletConnectButton } from "@/components/wallet-connect-button";
import { demoAgents } from "@/lib/data/demo-agents";
import type { SellerAgent, TaskType } from "@/lib/types/agent";
import type { RiskReport } from "@/lib/types/report";
import { useWriteContract, useAccount } from "wagmi";
import { agentBondReportRegistryAbi, reportRegistryAddress } from "@/lib/web3/contract";

const defaultAgent = demoAgents[0];

export default function Home() {
  const [selectedAgent, setSelectedAgent] = useState<SellerAgent>(defaultAgent);
  const [taskType, setTaskType] = useState<TaskType>(defaultAgent.taskTypes[0]);
  const [price, setPrice] = useState(defaultAgent.defaultPriceUsdc);
  const [sampleOutput, setSampleOutput] = useState(defaultAgent.sampleOutput);
  const [report, setReport] = useState<RiskReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const { writeContract, data: txHash, isPending: isTxPending, error: txError } = useWriteContract();
  const { isConnected } = useAccount();

  const hasContract = reportRegistryAddress !== "0x0000000000000000000000000000000000000000";

  function selectAgent(agentId: string, nextTaskType: TaskType, nextPrice: number, output: string) {
    const agent = demoAgents.find((item) => item.id === agentId);
    if (!agent) return;
    setSelectedAgent(agent);
    setTaskType(nextTaskType);
    setPrice(nextPrice);
    setSampleOutput(output);
    setReport(null);
    setError(null);
  }

  function runRiskCheck() {
    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/risk-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sellerAgentId: selectedAgent.id,
            taskType,
            proposedPriceUsdc: price,
            sampleTask: "Find 5 sources about Base ecosystem growth",
            sampleOutput,
          }),
        });
        const payload = await response.json();
        if (!response.ok) {
          setError(payload.error || "Risk check failed");
          return;
        }
        setReport(payload.report);
      } catch (err) {
        setError("Failed to connect to scoring server");
      }
    });
  }

  return (
    <main className="min-h-screen bg-vibe-theme dots-bg text-white relative flex flex-col justify-between">
      {/* Subtle top glow ring */}
      <div className="absolute top-0 left-1/2 -z-10 h-[400px] w-full max-w-7xl -translate-x-1/2 opacity-25 [background-image:radial-gradient(circle_at_top,#00d4a4_0%,transparent_60%)]" />

      {/* Hero Section Container */}
      <div className="flex-1 flex flex-col justify-between max-w-7xl mx-auto w-full px-6">
        {/* Header */}
        <header className="flex items-center justify-between py-5 w-full">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00d4a4] font-mono text-sm font-semibold text-black shadow-[0_0_15px_rgba(0,212,164,0.3)]">AB</div>
            <span className="font-semibold tracking-tight text-lg text-white">AgentBond AI</span>
          </div>
          
          {/* Centered Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#" className="hover:text-white transition">Resources</a>
            <a href="/demo" className="hover:text-white transition">Documentation</a>
            <a href="#" className="hover:text-white transition">Customers</a>
            <a href="#" className="hover:text-white transition">Blog</a>
            <a href="#" className="hover:text-white transition">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <WalletConnectButton />
          </div>
        </header>

        {/* Hero Content with reduced vertical padding to let panel peek out at the bottom */}
        <section className="text-center py-6 md:py-10 my-auto">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#00d4a4]/30 bg-[#00d4a4]/10 px-3.5 py-1 text-xs font-mono text-[#00d4a4] mb-5 shadow-[0_0_15px_rgba(0,212,164,0.1)]">
            <span className="font-semibold uppercase tracking-wider text-[10px] bg-[#00d4a4] text-black px-1.5 py-0.5 rounded-sm">NEW</span>
            <span className="text-zinc-300">|</span>
            <span className="text-zinc-300">Trust layer for paid agent-to-agent transactions ✨</span>
          </div>
          <h2 className="mx-auto max-w-4xl text-5xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-7xl">
            The intelligent trust system platform
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm md:text-base text-zinc-400 leading-relaxed font-light">
            Helping builder agents create secure, consistent payment checks before transactions.
            Generate scorecards, previews, and registered report proofs on Base Sepolia.
          </p>

          {/* Email/Action Bar */}
          <div className="mx-auto mt-8 max-w-xl">
            <div className="flex p-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md shadow-2xl focus-within:border-[#00d4a4]/40 transition">
              <input 
                type="text" 
                placeholder="Enter seller agent address or ID..." 
                value={selectedAgent.id}
                readOnly
                className="flex-1 bg-transparent px-5 py-3 text-sm text-zinc-300 placeholder-zinc-500 focus:outline-none font-mono"
              />
              <button 
                onClick={runRiskCheck}
                disabled={isPending}
                className="rounded-full bg-white hover:bg-zinc-200 text-black px-6 py-3 text-sm font-semibold transition whitespace-nowrap shadow-md flex items-center gap-2"
              >
                {isPending ? "Analyzing..." : "Verify now"}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* This spacing pushes the panel slightly into the viewport at the bottom of the landing page */}
        <div className="h-8 md:h-12" />
      </div>

      {/* Main Panel Area: Positions the header to peek out on viewport entry */}
      <section className="mx-auto max-w-7xl px-6 w-full mt-auto">
        <div className="rounded-t-3xl border-t border-x border-white/10 bg-[#061216]/80 backdrop-blur-lg shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden">
          
          {/* Panel Header/Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 px-6 py-4 bg-[#08191e]/50 gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-md bg-[#00d4a4] flex items-center justify-center font-mono text-[10px] font-bold text-black shadow-[0_0_10px_rgba(0,212,164,0.3)]">ab</div>
                <span className="font-mono text-sm text-white tracking-wider font-semibold">agentbond</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
                <span className="text-[#00d4a4] border-b-2 border-[#00d4a4] pb-4 pt-1 font-semibold text-zinc-200 cursor-pointer">Guide</span>
                <span className="pb-4 pt-1 hover:text-zinc-300 cursor-pointer">API Reference</span>
                <span className="pb-4 pt-1 hover:text-zinc-300 cursor-pointer">Changelog</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-black/40 border border-white/5 rounded-lg px-3 py-1.5 max-w-xs">
              <svg className="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Search or ask..." className="bg-transparent text-xs text-zinc-300 focus:outline-none placeholder-zinc-600" />
            </div>
          </div>

          {/* Panel Grid */}
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            
            {/* Left Section: Guides / Agent Select */}
            <div className="p-6 md:p-8 space-y-6">
              <div>
                <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-4">Quickstart Profiles</h3>
                <div className="grid gap-3">
                  {demoAgents.map((agent) => {
                    const isSelected = agent.id === selectedAgent.id;
                    return (
                      <button
                        key={agent.id}
                        onClick={() => selectAgent(agent.id, agent.taskTypes[0], agent.defaultPriceUsdc, agent.sampleOutput)}
                        className={`group text-left p-5 rounded-2xl border transition-all duration-200 ${
                          isSelected
                            ? "border-[#00d4a4] bg-white/[0.03] shadow-[0_0_20px_rgba(0,212,164,0.05)]"
                            : "border-white/5 bg-white/[0.01] hover:border-white/15 hover:bg-white/[0.02]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-semibold text-white tracking-tight">{agent.name}</h4>
                            <p className="text-xs text-zinc-400 mt-1 leading-normal">{agent.description}</p>
                          </div>
                          <span className="font-mono text-xs text-[#00d4a4] bg-[#00d4a4]/10 px-2 py-0.5 rounded">
                            {agent.defaultPriceUsdc} USDC
                          </span>
                        </div>
                        <div className="mt-4 flex gap-3 text-[11px] font-mono text-zinc-500">
                          <span>Jobs: {agent.completedJobs} / {agent.completedJobs + agent.failedJobs}</span>
                          <span>•</span>
                          <span>Buyers: {agent.uniqueBuyers}</span>
                          <span>•</span>
                          <span>Rating: {agent.averageRating}/5</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Topology */}
              <div className="rounded-xl border border-white/5 bg-white/[0.01] p-5">
                <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-4">A2A Verification Topology</h4>
                <div className="font-mono text-xs text-zinc-400 space-y-2 leading-relaxed">
                  <div className="flex items-center gap-2">
                    <span className="text-[#00d4a4]">●</span> BuyerAgent
                  </div>
                  <div className="pl-4 border-l border-white/10 ml-1 py-1 space-y-1.5">
                    <div>↳ <span className="text-white font-semibold">AgentBond Orchestrator</span> (paid service)</div>
                    <div className="pl-4 border-l border-white/5 ml-1 space-y-1">
                      <div>↳ OutputQualityChecker</div>
                      <div>↳ PricingBenchmarkChecker</div>
                      <div>↳ ReputationChecker</div>
                      <div>↳ TaskFitChecker</div>
                    </div>
                    <div>↳ Emits report registration to Base registry</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section: Request & Results */}
            <div className="p-6 md:p-8 space-y-6">
              <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Verification Playground</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-xs font-mono text-zinc-400">Task Type</label>
                    <select
                      value={taskType}
                      onChange={(e) => setTaskType(e.target.value as TaskType)}
                      className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm focus:outline-none focus:border-[#00d4a4]"
                    >
                      {selectedAgent.taskTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-xs font-mono text-zinc-400">Proposed Price (USDC)</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm focus:outline-none focus:border-[#00d4a4]"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <label className="text-xs font-mono text-zinc-400">Sample Output to Verify</label>
                  <textarea
                    rows={3}
                    value={sampleOutput}
                    onChange={(e) => setSampleOutput(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm focus:outline-none focus:border-[#00d4a4] leading-normal"
                  />
                </div>

                <button
                  onClick={runRiskCheck}
                  disabled={isPending}
                  className="w-full rounded-full bg-[#00d4a4] hover:bg-[#00b48a] text-black font-semibold py-3.5 text-sm transition disabled:bg-zinc-700 disabled:text-zinc-400 shadow-[0_4px_20px_rgba(0,212,164,0.2)]"
                >
                  {isPending ? "Evaluating Signatures..." : "Execute AgentBond Verification"}
                </button>
                {error && <p className="text-xs text-red-500 font-mono mt-2">{error}</p>}
              </div>

              {/* Live Report UI */}
              {report && (
                <div className="rounded-2xl border border-[#00d4a4]/20 bg-gradient-to-b from-[#00d4a4]/5 to-transparent p-5 space-y-5">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-widest text-[#00d4a4]">Verification Result</h4>
                      <p className="text-[9px] text-zinc-500 font-mono mt-0.5">{report.reportId}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono uppercase border ${
                      report.riskLevel === "low"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : report.riskLevel === "medium"
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                          : "border-red-500/30 bg-red-500/10 text-red-400"
                    }`}>
                      {report.riskLevel} risk
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="rounded-xl border border-white/5 bg-black/40 p-3">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">Trust Score</span>
                      <p className="text-3xl font-semibold text-white mt-0.5">{report.trustScore}</p>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-black/40 p-3">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">Max Recommended</span>
                      <p className="text-2xl font-semibold text-white mt-1">{report.recommendedMaxPriceUsdc} USDC</p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-black/30 border border-white/5 p-3 text-xs leading-relaxed text-zinc-300">
                    <span className="text-white font-semibold capitalize">{report.recommendedAction}:</span> {report.paymentRecommendation}
                  </div>

                  {/* Sub-agent inspection breakdown */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Sub-agent breakdown</span>
                    <div className="grid gap-1.5">
                      {report.checkerResults.map((checker) => (
                        <div key={checker.checkerName} className="rounded-lg border border-white/5 bg-black/20 p-2 text-xs flex justify-between items-center gap-3">
                          <div>
                            <span className="font-semibold text-zinc-300">{checker.checkerName}</span>
                            <p className="text-[10px] text-zinc-500 mt-0.5">{checker.notes[0]}</p>
                          </div>
                          <span className="font-mono text-[#00d4a4]">{checker.score}/100</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Proof Card */}
                  <div className="rounded-xl border border-white/5 bg-black/30 p-4 space-y-3">
                    <h5 className="text-[10px] font-mono uppercase text-[#00d4a4] tracking-wider">Proof of Trust anchoring</h5>
                    <div className="space-y-1.5 font-mono text-[9px] text-zinc-400 break-all leading-normal">
                      <p>CAP ID: {report.capOrderId}</p>
                      <p>Hash: {report.reportHash}</p>
                      <p>Registry: {reportRegistryAddress}</p>
                      {txHash && <p className="text-emerald-400">Registry Tx: {txHash}</p>}
                    </div>
                    <button
                      disabled={!hasContract || isTxPending || !isConnected}
                      onClick={() =>
                        writeContract({
                          address: reportRegistryAddress,
                          abi: agentBondReportRegistryAbi,
                          functionName: "registerReport",
                          args: [report.reportHash, report.sellerAgentId, BigInt(report.trustScore), report.riskLevel],
                        })
                      }
                      className="w-full rounded-full border border-white/10 hover:border-white/20 bg-white/5 text-[10px] text-white py-2 transition font-mono disabled:opacity-40"
                    >
                      {!isConnected
                        ? "Connect Wallet to Register"
                        : !hasContract
                          ? "Add Contract Address to Register"
                          : isTxPending
                            ? "Confirming Base Tx..."
                            : "Anchor report hash on Base"}
                    </button>
                    {txError && <p className="text-[10px] text-red-500 font-mono mt-1">{txError.message}</p>}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
