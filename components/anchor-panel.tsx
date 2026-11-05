"use client";

import { useState } from "react";
import { BaseError, UserRejectedRequestError } from "viem";
import { useAccount, useConnect, useSwitchChain, useWriteContract } from "wagmi";
import { shortHex } from "@/lib/format";
import type { ReportAnchor, RiskReport } from "@/lib/types/report";
import {
  agentBondReportRegistryAbi,
  explorerTxUrl,
  isRegistryConfigured,
  registryChain,
  reportRegistryAddress,
} from "@/lib/web3/contract";

type Phase = "idle" | "signing" | "verifying";

function errorMessage(error: unknown) {
  if (error instanceof BaseError) {
    if (error.walk((cause) => cause instanceof UserRejectedRequestError)) return "Signature cancelled in the wallet.";
    if (error.message.includes("Report already registered")) return "This report hash is already registered on Base.";
    return error.shortMessage;
  }
  return error instanceof Error ? error.message : "Anchoring failed.";
}

export function AnchorPanel({ report, onAnchored }: { report: RiskReport; onAnchored?: (report: RiskReport) => void }) {
  const [anchor, setAnchor] = useState<ReportAnchor | undefined>(report.anchor);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const { isConnected, chainId } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();

  if (anchor) {
    return (
      <div className="mt-5 border-t border-dashed border-rule pt-4 text-sm">
        <p className="font-medium text-hire">Anchored on {registryChain.name}</p>
        <p className="mt-1 text-ink-soft">
          Block {anchor.blockNumber.toLocaleString("en-US")}, registered by{" "}
          <code className="font-mono text-[13px] text-ink">{shortHex(anchor.requester)}</code>.{" "}
          <a
            className="text-pen underline-offset-2 hover:underline"
            href={explorerTxUrl(anchor.txHash)}
            rel="noreferrer"
            target="_blank"
          >
            View transaction
          </a>
        </p>
      </div>
    );
  }

  if (!isRegistryConfigured) {
    return (
      <p className="mt-5 border-t border-dashed border-rule pt-4 text-sm text-ink-soft">
        On-chain anchoring turns on once the registry contract is deployed.
      </p>
    );
  }

  async function anchorReport() {
    setError(null);
    try {
      setPhase("signing");
      const txHash = await writeContractAsync({
        address: reportRegistryAddress,
        abi: agentBondReportRegistryAbi,
        functionName: "registerReport",
        args: [report.reportHash, report.sellerAgentId, BigInt(report.trustScore), report.riskLevel],
        chainId: registryChain.id,
      });
      setPhase("verifying");
      const response = await fetch(`/api/reports/${report.reportId}/anchor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txHash }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "The server could not verify the transaction.");
      setAnchor(payload.report.anchor);
      onAnchored?.(payload.report);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setPhase("idle");
    }
  }

  const connector = connectors[0];
  const onWrongChain = isConnected && chainId !== registryChain.id;
  let action: { label: string; run: () => void; disabled?: boolean };
  if (!isConnected) {
    action = {
      label: isConnecting ? "Connecting…" : "Connect wallet to anchor",
      run: () => connector && connect({ connector }),
      disabled: !connector || isConnecting,
    };
  } else if (onWrongChain) {
    action = {
      label: isSwitching ? "Switching…" : `Switch to ${registryChain.name}`,
      run: () => switchChain({ chainId: registryChain.id }),
      disabled: isSwitching,
    };
  } else {
    action = {
      label:
        phase === "signing"
          ? "Confirm in your wallet…"
          : phase === "verifying"
            ? "Verifying on Base…"
            : "Anchor report on Base",
      run: anchorReport,
      disabled: phase !== "idle",
    };
  }

  return (
    <div className="mt-5 border-t border-dashed border-rule pt-4">
      <p className="text-sm text-ink-soft">
        Anchoring writes this hash to the AgentBond registry on {registryChain.name}, so anyone can prove the report
        existed and was not edited later.
      </p>
      <button
        className="mt-3 w-full rounded-md border border-ink/80 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-ink hover:text-sheet disabled:pointer-events-none disabled:opacity-50"
        disabled={action.disabled}
        onClick={action.run}
        type="button"
      >
        {action.label}
      </button>
      {error && (
        <p className="mt-2 text-sm text-avoid" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
