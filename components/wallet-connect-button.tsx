"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { shortHex } from "@/lib/format";

export function WalletConnectButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const connector = connectors[0];

  if (isConnected && address) {
    return (
      <button
        className="rounded-full border border-rule bg-sheet px-4 py-2 font-mono text-[13px] text-ink transition-colors hover:border-ink-faint"
        onClick={() => disconnect()}
        title="Disconnect wallet"
        type="button"
      >
        {shortHex(address)}
      </button>
    );
  }

  return (
    <button
      className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-sheet transition-colors hover:bg-pen-deep disabled:opacity-50"
      disabled={!connector || isPending}
      onClick={() => connector && connect({ connector })}
      title={connector ? undefined : "Install a browser wallet such as MetaMask or Rabby"}
      type="button"
    >
      {isPending ? "Connecting…" : "Connect wallet"}
    </button>
  );
}
