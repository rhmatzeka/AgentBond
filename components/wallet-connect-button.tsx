"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export function WalletConnectButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const connector = connectors[0];

  if (isConnected) {
    return (
      <button className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black" onClick={() => disconnect()}>
        {address?.slice(0, 6)}...{address?.slice(-4)}
      </button>
    );
  }

  return (
    <button
      className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:bg-zinc-300"
      disabled={!connector || isPending}
      onClick={() => connector && connect({ connector })}
    >
      {isPending ? "Connecting" : "Connect Wallet"}
    </button>
  );
}
