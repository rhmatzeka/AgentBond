"use client";

import { useWriteContract } from "wagmi";
import { agentBondReportRegistryAbi, reportRegistryAddress } from "@/lib/web3/contract";
import type { RiskReport } from "@/lib/types/report";

export function ReportProofCard({ report }: { report: RiskReport }) {
  const { writeContract, data: txHash, isPending, error } = useWriteContract();
  const hasContract = reportRegistryAddress !== "0x0000000000000000000000000000000000000000";

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Proof layer</h3>
        <span className="rounded-full bg-zinc-100 px-2 py-1 font-mono text-xs text-zinc-600">Base Sepolia</span>
      </div>
      <div className="space-y-3 font-mono text-xs text-zinc-600">
        <p className="break-all">CAP order: {report.capOrderId}</p>
        <p className="break-all">Report hash: {report.reportHash}</p>
        <p className="break-all">Contract: {reportRegistryAddress}</p>
        {txHash && <p className="break-all text-emerald-700">Tx hash: {txHash}</p>}
      </div>
      <button
        className="mt-5 rounded-full bg-black px-4 py-2 text-sm font-medium text-white disabled:bg-zinc-300"
        disabled={!hasContract || isPending}
        onClick={() =>
          writeContract({
            address: reportRegistryAddress,
            abi: agentBondReportRegistryAbi,
            functionName: "registerReport",
            args: [report.reportHash, report.sellerAgentId, BigInt(report.trustScore), report.riskLevel],
          })
        }
      >
        {hasContract ? (isPending ? "Registering" : "Register hash on Base") : "Add contract address to enable"}
      </button>
      {error && <p className="mt-3 text-sm text-red-600">{error.message}</p>}
    </div>
  );
}
