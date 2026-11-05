import { createPublicClient, http, isAddressEqual, parseEventLogs, type TransactionReceipt } from "viem";
import type { ReportAnchor } from "@/lib/types/report";
import { agentBondReportRegistryAbi, registryChain } from "./contract";

export class AnchorVerificationError extends Error {}

type ReceiptClient = {
  waitForTransactionReceipt(args: { hash: `0x${string}`; timeout?: number }): Promise<TransactionReceipt>;
};

/**
 * Confirms on-chain that `txHash` emitted ReportRegistered for `reportHash` from the
 * configured registry. The browser's word is never trusted for the anchor.
 */
export async function verifyAnchorTx(params: {
  txHash: `0x${string}`;
  reportHash: `0x${string}`;
  registryAddress: `0x${string}`;
  client?: ReceiptClient;
}): Promise<ReportAnchor> {
  const client = params.client ?? defaultClient();
  let receipt: TransactionReceipt;
  try {
    receipt = await client.waitForTransactionReceipt({ hash: params.txHash, timeout: 20_000 });
  } catch {
    throw new AnchorVerificationError("Transaction not found on Base Sepolia yet. Try again in a few seconds.");
  }
  if (receipt.status !== "success") {
    throw new AnchorVerificationError("Transaction reverted, so nothing was registered.");
  }

  const event = parseEventLogs({
    abi: agentBondReportRegistryAbi,
    logs: receipt.logs,
    eventName: "ReportRegistered",
  }).find((log) => isAddressEqual(log.address, params.registryAddress) && log.args.reportHash === params.reportHash);
  if (!event) {
    throw new AnchorVerificationError("Transaction did not register this report on the AgentBond registry.");
  }

  return {
    txHash: params.txHash,
    requester: event.args.requester,
    blockNumber: Number(receipt.blockNumber),
    anchoredAt: new Date(Number(event.args.timestamp) * 1000).toISOString(),
  };
}

function defaultClient(): ReceiptClient {
  return createPublicClient({ chain: registryChain, transport: http(process.env.BASE_SEPOLIA_RPC_URL || undefined) });
}
