"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { shortHex } from "@/lib/format";

const cell =
  "flex items-center whitespace-nowrap border-l border-line px-4 text-base transition-colors sm:px-8 sm:text-lg";

export function WalletConnectButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const connector = connectors[0];

  if (isConnected && address) {
    return (
      <button
        className={`${cell} font-mono text-[13px] hover:bg-card sm:text-[15px]`}
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
      className={`${cell} bg-pink text-black hover:bg-ink disabled:opacity-60`}
      disabled={!connector || isPending}
      onClick={() => connector && connect({ connector })}
      title={connector ? undefined : "Install a browser wallet such as MetaMask or Rabby"}
      type="button"
    >
      {isPending ? (
        "Connecting…"
      ) : (
        <>
          Connect<span className="hidden sm:inline">&nbsp;wallet</span>
        </>
      )}
    </button>
  );
}
