"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export function WalletConnectButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const connector = connectors[0];

  if (isConnected && address) {
    return (
      <button
        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-sm text-white transition hover:border-white/20"
        onClick={() => disconnect()}
        title="Disconnect wallet"
      >
        {address.slice(0, 6)}...{address.slice(-4)}
      </button>
    );
  }

  return (
    <button
      className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:bg-zinc-600 disabled:text-zinc-300"
      disabled={!connector || isPending}
      onClick={() => connector && connect({ connector })}
    >
      {isPending ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
