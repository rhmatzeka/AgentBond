import { QueryClient } from "@tanstack/react-query";
import { http, createConfig } from "wagmi";
import { baseSepolia } from "@/lib/web3/base-sepolia";

export const queryClient = new QueryClient();

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || "https://sepolia.base.org"),
  },
});
