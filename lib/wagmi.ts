import { QueryClient } from "@tanstack/react-query";
import { createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const queryClient = new QueryClient();

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [injected()],
  ssr: true,
  transports: {
    [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || undefined),
  },
});
