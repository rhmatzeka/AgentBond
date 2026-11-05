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
        className="nb-btn bg-card px-3.5 py-2 font-mono text-[13px] font-medium"
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
      className="nb-btn bg-ink px-4 py-2 text-sm text-card"
      disabled={!connector || isPending}
      onClick={() => connector && connect({ connector })}
      title={connector ? undefined : "Install a browser wallet such as MetaMask or Rabby"}
      type="button"
    >
      {isPending ? "Connecting…" : "Connect wallet"}
    </button>
  );
}
