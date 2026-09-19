"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ReportResult } from "@/components/report-result";
import { SellerAgentCard } from "@/components/seller-agent-card";
import { SiteHeader } from "@/components/site-header";
import { VerificationTopology } from "@/components/verification-topology";
import { demoAgents } from "@/lib/data/demo-agents";
import type { SellerAgent, TaskType } from "@/lib/types/agent";
import type { RiskReport } from "@/lib/types/report";
import { taskTypes } from "@/lib/validation/risk-check";

const defaultAgent = demoAgents[0];
const sampleTask = "Find 5 sources about Base ecosystem growth";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm focus:border-brand-green focus:outline-none";

export default function Home() {
  const [selectedAgent, setSelectedAgent] = useState<SellerAgent>(defaultAgent);
  const [taskType, setTaskType] = useState<TaskType>(defaultAgent.taskTypes[0]);
  const [price, setPrice] = useState(String(defaultAgent.defaultPriceUsdc));
  const [sampleOutput, setSampleOutput] = useState(defaultAgent.sampleOutput);
  const [report, setReport] = useState<RiskReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function selectAgent(agent: SellerAgent) {
    setSelectedAgent(agent);
    setTaskType(agent.taskTypes[0]);
    setPrice(String(agent.defaultPriceUsdc));
    setSampleOutput(agent.sampleOutput);
    setReport(null);
    setError(null);
  }

  function runRiskCheck() {
    const proposedPriceUsdc = Number(price);
    if (price.trim() === "" || !Number.isFinite(proposedPriceUsdc) || proposedPriceUsdc < 0) {
      setError("Enter a valid non-negative price");
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/risk-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sellerAgentId: selectedAgent.id,
            taskType,
            proposedPriceUsdc,
            sampleTask,
            sampleOutput,
          }),
        });
        const payload = await response.json();
        if (!response.ok) {
          setError(payload.error || "Risk check failed");
          return;
        }
        setReport(payload.report);
      } catch {
        setError("Failed to connect to scoring server");
      }
    });
  }

  return (
    <main className="bg-vibe-theme relative flex min-h-screen flex-col justify-between text-white">
      <div className="absolute left-1/2 top-0 -z-10 h-[400px] w-full max-w-7xl -translate-x-1/2 opacity-25 [background-image:radial-gradient(circle_at_top,#00d4a4_0%,transparent_60%)]" />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-between px-6">
        <SiteHeader />

        <section className="my-auto py-6 text-center md:py-10">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-brand-green/30 bg-brand-green/10 px-3.5 py-1 font-mono text-xs text-brand-green shadow-[0_0_15px_rgba(0,212,164,0.1)]">
            <span className="rounded-sm bg-brand-green px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-black">
              New
            </span>
            <span className="text-zinc-300">|</span>
            <span className="text-zinc-300">Trust layer for paid agent-to-agent transactions</span>
          </div>
          <h1 className="mx-auto max-w-4xl text-5xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-7xl">
            Before agents pay each other, they ask AgentBond
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-light leading-relaxed text-zinc-400 md:text-base">
            Score seller agents on output quality, pricing, reputation, and task fit before a buyer agent spends
            USDC, then anchor the report hash on Base Sepolia.
          </p>

          <div className="mx-auto mt-8 max-w-xl">
            <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-1.5 shadow-2xl backdrop-blur-md">
              <input
                aria-label="Selected seller agent"
                className="flex-1 bg-transparent px-5 py-3 font-mono text-sm text-zinc-300 focus:outline-none"
                readOnly
                type="text"
                value={selectedAgent.id}
              />
              <button
                className="flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-md transition hover:bg-zinc-200 disabled:opacity-60"
                disabled={isPending}
                onClick={runRiskCheck}
                type="button"
              >
                {isPending ? "Analyzing..." : "Verify now"}
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        <div className="h-8 md:h-12" />
      </div>

      <section className="mx-auto mt-auto w-full max-w-7xl scroll-mt-6 px-6" id="playground">
        <div className="overflow-hidden rounded-t-3xl border-x border-t border-white/10 bg-[#061216]/80 shadow-[0_0_100px_rgba(0,0,0,0.8)] backdrop-blur-lg">
          <div className="flex items-center gap-2 border-b border-white/10 bg-[#08191e]/50 px-6 py-4">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-brand-green font-mono text-[10px] font-bold text-black">
              ab
            </div>
            <span className="font-mono text-sm font-semibold tracking-wider text-white">agentbond playground</span>
          </div>

          <div className="grid divide-y divide-white/10 lg:grid-cols-[1.1fr_0.9fr] lg:divide-x lg:divide-y-0">
            <div className="space-y-6 p-6 md:p-8">
              <div>
                <h2 className="mb-4 font-mono text-sm uppercase tracking-widest text-zinc-500">Seller agents</h2>
                <div className="grid gap-3">
                  {demoAgents.map((agent) => (
                    <SellerAgentCard
                      agent={agent}
                      key={agent.id}
                      onSelect={selectAgent}
                      selected={agent.id === selectedAgent.id}
                    />
                  ))}
                </div>
              </div>
              <VerificationTopology />
            </div>

            <div className="space-y-6 p-6 md:p-8">
              <h2 className="font-mono text-xs uppercase tracking-widest text-zinc-500">Verification request</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <label className="grid gap-2">
                    <span className="font-mono text-xs text-zinc-400">Task type</span>
                    <select
                      className={inputClass}
                      onChange={(event) => setTaskType(event.target.value as TaskType)}
                      value={taskType}
                    >
                      {taskTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                          {selectedAgent.taskTypes.includes(type) ? "" : " (not a specialty)"}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2">
                    <span className="font-mono text-xs text-zinc-400">Proposed price (USDC)</span>
                    <input
                      className={inputClass}
                      min={0}
                      onChange={(event) => setPrice(event.target.value)}
                      step="0.1"
                      type="number"
                      value={price}
                    />
                  </label>
                </div>

                <label className="grid gap-2">
                  <span className="font-mono text-xs text-zinc-400">Sample output to verify</span>
                  <textarea
                    className={`${inputClass} leading-normal`}
                    onChange={(event) => setSampleOutput(event.target.value)}
                    rows={3}
                    value={sampleOutput}
                  />
                </label>

                <button
                  className="w-full rounded-full bg-brand-green py-3.5 text-sm font-semibold text-black shadow-[0_4px_20px_rgba(0,212,164,0.2)] transition hover:bg-brand-green-deep disabled:bg-zinc-700 disabled:text-zinc-400"
                  disabled={isPending}
                  onClick={runRiskCheck}
                  type="button"
                >
                  {isPending ? "Evaluating..." : "Run AgentBond verification"}
                </button>
                {error && (
                  <p className="font-mono text-xs text-red-500" role="alert">
                    {error}
                  </p>
                )}
              </div>

              {report && (
                <div className="space-y-2">
                  <ReportResult report={report} />
                  <Link
                    className="block text-right font-mono text-[11px] text-zinc-500 transition hover:text-white"
                    href={`/reports/${report.reportId}`}
                  >
                    Open shareable report →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
