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
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-full max-w-7xl -translate-x-1/2 opacity-35 [background-image:radial-gradient(circle_at_top,#14322c_0%,transparent_65%)]" />

      {/* Header */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00d4a4] font-mono text-sm font-semibold text-black">AB</div>
          <div>
            <h1 className="font-semibold tracking-tight text-white text-base">AgentBond</h1>
            <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-mono">trust protocol</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a href="/demo" className="text-sm font-medium text-zinc-400 hover:text-white transition">Docs</a>
          <WalletConnectButton />
        </div>
      </header>

      {/* Hero Display */}
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-8 text-center md:pt-24">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#00d4a4]/20 bg-[#00d4a4]/5 px-3 py-1 text-xs font-mono text-[#00d4a4] mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00d4a4] animate-ping" />
          Active Trust Verification Layer
        </div>
        <h2 className="mx-auto max-w-4xl text-5xl font-semibold leading-[1.05] tracking-[-0.03em] md:text-7xl">
          The intelligent trust system for agent-to-agent commerce.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-zinc-400 leading-relaxed">
          AgentBond calculates metrics and outputs machine-readable risk reports before your buyer agents spend USDC. Anchored and verifiable on Base Sepolia.
        </p>
      </section>

      {/* Grid Dashboard */}
      <section className="mx-auto max-w-7xl px-6 py-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        
        {/* Left Column: Selector & Info */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500">1. Select Seller Agent</h3>
              <span className="text-xs text-zinc-500 font-mono">4 Profiles Loaded</span>
            </div>
            <div className="grid gap-3">
              {demoAgents.map((agent) => {
                const isSelected = agent.id === selectedAgent.id;
                return (
                  <button
                    key={agent.id}
                    onClick={() => selectAgent(agent.id, agent.taskTypes[0], agent.defaultPriceUsdc, agent.sampleOutput)}
                    className={`group text-left p-5 rounded-2xl border transition-all duration-200 ${
                      isSelected
                        ? "border-[#00d4a4] bg-white/[0.03] shadow-[0_0_30px_rgba(0,212,164,0.05)]"
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

          {/* Call Graph Display */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5">
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-4">A2A Verification Topology</h4>
            <div className="font-mono text-xs text-zinc-400 space-y-2 leading-relaxed">
              <div className="flex items-center gap-2">
                <span className="text-[#00d4a4]">●</span> BuyerAgent
              </div>
              <div className="pl-4 border-l border-white/10 ml-1 py-1 space-y-2">
                <div>↳ <span className="text-white font-semibold">AgentBond Orchestrator</span> (paid service)</div>
                <div className="pl-4 border-l border-white/5 ml-1 space-y-1">
                  <div>↳ OutputQualityChecker</div>
                  <div>↳ PricingBenchmarkChecker</div>
                  <div>↳ ReputationChecker</div>
                  <div>↳ TaskFitChecker</div>
                </div>
                <div>↳ Generate risk scores & hash report proof</div>
                <div>↳ Emits report registration to Base registry</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Execution & Report */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 shadow-2xl">
            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-6">2. Configure Request Payload</h3>
            
            <div className="space-y-4">
              <div className="grid gap-2">
                <label className="text-xs font-mono text-zinc-400">Seller Agent ID</label>
                <input
                  type="text"
                  readOnly
                  value={selectedAgent.id}
                  className="w-full rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 font-mono text-sm text-zinc-300 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-xs font-mono text-zinc-400">Task Type</label>
                  <select
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value as TaskType)}
                    className="w-full rounded-xl border border-white/5 bg-black px-4 py-3 text-sm focus:outline-none focus:border-[#00d4a4]"
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
                    className="w-full rounded-xl border border-white/5 bg-black px-4 py-3 text-sm focus:outline-none focus:border-[#00d4a4]"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-xs font-mono text-zinc-400">Sample Output to Verify</label>
                <textarea
                  rows={4}
                  value={sampleOutput}
                  onChange={(e) => setSampleOutput(e.target.value)}
                  className="w-full rounded-xl border border-white/5 bg-black px-4 py-3 text-sm focus:outline-none focus:border-[#00d4a4]"
                />
              </div>

              <button
                onClick={runRiskCheck}
                disabled={isPending}
                className="w-full rounded-full bg-[#00d4a4] hover:bg-[#00b48a] text-black font-semibold py-3 text-sm transition disabled:bg-zinc-700 disabled:text-zinc-400"
              >
                {isPending ? "Evaluating Signatures..." : "Execute AgentBond Verification"}
              </button>
              {error && <p className="text-xs text-red-500 font-mono mt-2">{error}</p>}
            </div>
          </div>

          {/* Report Results */}
          {report && (
            <div className="rounded-3xl border border-[#00d4a4]/20 bg-gradient-to-b from-[#00d4a4]/5 to-transparent p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-[#00d4a4]">Verification Passed</h4>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{report.reportId}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-mono uppercase border ${
                  report.riskLevel === "low"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : report.riskLevel === "medium"
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                      : "border-red-500/30 bg-red-500/10 text-red-400"
                }`}>
                  {report.riskLevel} risk
                </span>
              </div>

              {/* Big Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/5 bg-white/[0.01] p-4 text-center">
                  <span className="text-[11px] font-mono text-zinc-500 uppercase">Trust Score</span>
                  <p className="text-4xl font-semibold tracking-tight text-white mt-1">{report.trustScore}</p>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.01] p-4 text-center">
                  <span className="text-[11px] font-mono text-zinc-500 uppercase">Max Recommended</span>
                  <p className="text-3xl font-semibold tracking-tight text-white mt-1.5">{report.recommendedMaxPriceUsdc} USDC</p>
                </div>
              </div>

              {/* Recommendation Description */}
              <div className="rounded-xl bg-white/[0.02] border border-white/5 p-4">
                <h5 className="text-xs font-mono uppercase text-zinc-400 mb-1.5">Action</h5>
                <p className="text-sm leading-relaxed text-zinc-300 capitalize">
                  <span className="text-white font-semibold">{report.recommendedAction}:</span> {report.paymentRecommendation}
                </p>
              </div>

              {/* Specialist Checklist */}
              <div className="space-y-2.5">
                <h5 className="text-xs font-mono uppercase text-zinc-500 tracking-wider">Sub-Agent Inspection Logs</h5>
                <div className="grid gap-2">
                  {report.checkerResults.map((checker) => (
                    <div key={checker.checkerName} className="rounded-xl border border-white/5 bg-white/[0.01] p-3 text-xs flex justify-between items-center gap-3">
                      <div>
                        <span className="font-semibold text-zinc-300">{checker.checkerName}</span>
                        <p className="text-[11px] text-zinc-500 mt-1">{checker.notes[0]}</p>
                      </div>
                      <span className="font-mono text-[#00d4a4]">{checker.score}/100</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Base Settlement Registry */}
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 space-y-4">
                <h5 className="text-xs font-mono uppercase text-[#00d4a4] tracking-wider">Proof of Trust anchoring</h5>
                <div className="space-y-2 font-mono text-[10px] text-zinc-400 break-all leading-normal">
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
                  className="w-full rounded-full border border-white/10 hover:border-white/20 bg-white/5 text-xs text-white py-2 transition font-mono disabled:opacity-40"
                >
                  {!isConnected
                    ? "Connect Wallet to Register"
                    : !hasContract
                      ? "Add Contract Address to Register"
                      : isTxPending
                        ? "Confirming Base Tx..."
                        : "Anchor report hash on Base"}
                </button>
                {txError && <p className="text-[11px] text-red-500 font-mono">{txError.message}</p>}
              </div>

            </div>
          )}
        </div>

      </section>
    </main>
  );
}
