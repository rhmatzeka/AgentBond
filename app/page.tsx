"use client";

import { useState, useTransition } from "react";
import { AgentCallGraph } from "@/components/agent-call-graph";
import { CheckerBreakdown } from "@/components/checker-breakdown";
import { DemoAgentCard } from "@/components/demo-agent-card";
import { ReportProofCard } from "@/components/report-proof-card";
import { RiskLevelBadge } from "@/components/risk-level-badge";
import { WalletConnectButton } from "@/components/wallet-connect-button";
import { demoAgents } from "@/lib/data/demo-agents";
import type { SellerAgent, TaskType } from "@/lib/types/agent";
import type { RiskReport } from "@/lib/types/report";

const defaultAgent = demoAgents[0];

export default function Home() {
  const [selectedAgent, setSelectedAgent] = useState<SellerAgent>(defaultAgent);
  const [taskType, setTaskType] = useState<TaskType>(defaultAgent.taskTypes[0]);
  const [price, setPrice] = useState(defaultAgent.defaultPriceUsdc);
  const [sampleOutput, setSampleOutput] = useState(defaultAgent.sampleOutput);
  const [report, setReport] = useState<RiskReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
    });
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="relative overflow-hidden border-b border-black/10 bg-[linear-gradient(135deg,#87a8c8_0%,#f5e9d8_55%,#ffffff_100%)]">
        <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_20%_20%,white_0,transparent_28%),radial-gradient(circle_at_80%_10%,#00d4a4_0,transparent_18%)]" />
        <header className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black font-mono text-sm text-white">AB</div>
            <div>
              <p className="font-semibold tracking-tight">AgentBond</p>
              <p className="text-xs text-zinc-700">Trust layer for A2A commerce</p>
            </div>
          </div>
          <WalletConnectButton />
        </header>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 pb-20 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28 lg:pt-20">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-semibold text-zinc-700 backdrop-blur">
              CROO/CAP-ready risk scoring agent
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-black md:text-7xl">
              Before agents pay each other, they ask AgentBond.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-700">
              AgentBond checks seller agent quality, price fairness, reputation, and task fit before a buyer agent spends USDC. Reports are machine-readable and hashable on Base.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white" onClick={runRiskCheck}>
                Run AgentBond Check
              </button>
              <a className="rounded-full border border-black/10 bg-white/70 px-5 py-3 text-center text-sm font-medium text-black" href="#demo">
                View demo agents
              </a>
            </div>
          </div>
          <AgentCallGraph />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[0.9fr_1.1fr]" id="demo">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">Demo agents</p>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Pick a seller agent to inspect.</h2>
          <p className="mt-4 leading-7 text-zinc-600">
            The demo contrasts a reliable agent, a spammy cheap agent, and an overpriced agent so judges can see the trust layer clearly.
          </p>
          <div className="mt-6 grid gap-3">
            {demoAgents.map((agent) => (
              <DemoAgentCard agent={agent} key={agent.id} onSelect={selectAgent} selected={agent.id === selectedAgent.id} />
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 md:p-7">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Risk check request</h2>
            <span className="rounded-full bg-[#00d4a4] px-3 py-1 text-xs font-semibold text-black">JSON output</span>
          </div>
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium">
              Seller Agent ID
              <input className="rounded-xl border border-zinc-200 bg-white px-4 py-3 font-mono text-sm" readOnly value={selectedAgent.id} />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                Task Type
                <select className="rounded-xl border border-zinc-200 bg-white px-4 py-3" onChange={(event) => setTaskType(event.target.value as TaskType)} value={taskType}>
                  {selectedAgent.taskTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Proposed Price USDC
                <input className="rounded-xl border border-zinc-200 bg-white px-4 py-3" min="0" onChange={(event) => setPrice(Number(event.target.value))} type="number" value={price} />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-medium">
              Sample Output
              <textarea className="min-h-36 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm leading-6" onChange={(event) => setSampleOutput(event.target.value)} value={sampleOutput} />
            </label>
            <button className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white disabled:bg-zinc-300" disabled={isPending} onClick={runRiskCheck}>
              {isPending ? "Running checker agents" : "Run AgentBond Check"}
            </button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          {report && (
            <div className="mt-8 space-y-5">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-white p-5">
                  <p className="text-sm text-zinc-500">Trust Score</p>
                  <p className="mt-2 text-4xl font-semibold tracking-tight">{report.trustScore}</p>
                </div>
                <div className="rounded-2xl bg-white p-5">
                  <p className="mb-3 text-sm text-zinc-500">Risk Level</p>
                  <RiskLevelBadge level={report.riskLevel} />
                </div>
                <div className="rounded-2xl bg-white p-5">
                  <p className="text-sm text-zinc-500">Max Price</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight">{report.recommendedMaxPriceUsdc} USDC</p>
                </div>
              </div>
              <div className="rounded-2xl bg-white p-5">
                <h3 className="mb-3 text-lg font-semibold">Recommendation</h3>
                <p className="capitalize text-zinc-700">{report.recommendedAction}: {report.paymentRecommendation}</p>
              </div>
              <CheckerBreakdown results={report.checkerResults} />
              <ReportProofCard report={report} />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
