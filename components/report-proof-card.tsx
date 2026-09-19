"use client";

import { useAccount, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import type { RiskReport } from "@/lib/types/report";
import {
  agentBondReportRegistryAbi,
  explorerTxUrl,
  isRegistryConfigured,
  registryChain,
  reportRegistryAddress,
} from "@/lib/web3/contract";

export function ReportProofCard({ report }: { report: RiskReport }) {
  const { isConnected, chainId } = useAccount();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const { writeContract, data: txHash, isPending: isSigning, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash });

  const onWrongChain = isConnected && chainId !== registryChain.id;
  const busy = isSwitching || isSigning || isConfirming;

  function handleClick() {
    if (onWrongChain) {
      switchChain({ chainId: registryChain.id });
      return;
    }
    writeContract({
      address: reportRegistryAddress,
      abi: agentBondReportRegistryAbi,
      functionName: "registerReport",
      args: [report.reportHash, report.sellerAgentId, BigInt(report.trustScore), report.riskLevel],
      chainId: registryChain.id,
    });
  }

  let label = "Anchor report hash on Base";
  if (!isRegistryConfigured) label = "Set contract address to enable";
  else if (!isConnected) label = "Connect wallet to register";
  else if (isSwitching) label = "Switching network...";
  else if (onWrongChain) label = `Switch to ${registryChain.name}`;
  else if (isSigning) label = "Confirm in wallet...";
  else if (isConfirming) label = "Confirming on Base...";
  else if (isConfirmed) label = "Registered on Base";

  return (
    <div className="space-y-3 rounded-xl border border-white/5 bg-black/30 p-4">
      <h5 className="font-mono text-[10px] uppercase tracking-wider text-brand-green">Proof of trust anchoring</h5>
      <div className="space-y-1.5 break-all font-mono text-[10px] leading-normal text-zinc-400">
        <p>CAP ID: {report.capOrderId}</p>
        <p>Hash: {report.reportHash}</p>
        <p>Registry: {reportRegistryAddress}</p>
        {txHash && (
          <p>
            Registry tx:{" "}
            <a className="text-emerald-400 underline" href={explorerTxUrl(txHash)} rel="noreferrer" target="_blank">
              {txHash}
            </a>
          </p>
        )}
      </div>
      <button
        className="w-full rounded-full border border-white/10 bg-white/5 py-2 font-mono text-[11px] text-white transition hover:border-white/20 disabled:opacity-40"
        disabled={!isRegistryConfigured || !isConnected || busy || isConfirmed}
        onClick={handleClick}
        type="button"
      >
        {label}
      </button>
      {error && <p className="font-mono text-[10px] text-red-500">{error.message.split("\n")[0]}</p>}
    </div>
  );
}
