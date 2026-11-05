import { encodeAbiParameters, encodeEventTopics, type TransactionReceipt } from "viem";
import { describe, expect, it } from "vitest";
import { agentBondReportRegistryAbi } from "@/lib/web3/contract";
import { AnchorVerificationError, verifyAnchorTx } from "@/lib/web3/verify-anchor";

const registry = "0x1111111111111111111111111111111111111111";
const requester = "0x2222222222222222222222222222222222222222";
const reportHash = `0x${"ab".repeat(32)}` as const;
const txHash = `0x${"cd".repeat(32)}` as const;

function registeredLog(hash: `0x${string}`, address: string = registry) {
  return {
    address,
    topics: encodeEventTopics({
      abi: agentBondReportRegistryAbi,
      eventName: "ReportRegistered",
      args: { requester, reportHash: hash },
    }),
    data: encodeAbiParameters(
      [{ type: "string" }, { type: "uint256" }, { type: "string" }, { type: "uint256" }],
      ["good-research-bot", 88n, "low", 1_762_300_000n],
    ),
  };
}

function clientWith(receipt: Partial<TransactionReceipt>) {
  return {
    waitForTransactionReceipt: async () =>
      ({ status: "success", blockNumber: 42n, logs: [], ...receipt }) as TransactionReceipt,
  };
}

describe("verifyAnchorTx", () => {
  it("accepts a successful tx that registered this report hash", async () => {
    const anchor = await verifyAnchorTx({
      txHash,
      reportHash,
      registryAddress: registry,
      client: clientWith({ logs: [registeredLog(reportHash)] as never }),
    });
    expect(anchor).toEqual({
      txHash,
      requester,
      blockNumber: 42,
      anchoredAt: new Date(1_762_300_000 * 1000).toISOString(),
    });
  });

  it.each([
    ["a reverted tx", { status: "reverted" as const, logs: [registeredLog(reportHash)] }],
    ["a tx for another hash", { logs: [registeredLog(`0x${"ef".repeat(32)}`)] }],
    [
      "an event from another contract",
      { logs: [registeredLog(reportHash, "0x3333333333333333333333333333333333333333")] },
    ],
  ])("rejects %s", async (_, receipt) => {
    await expect(
      verifyAnchorTx({ txHash, reportHash, registryAddress: registry, client: clientWith(receipt as never) }),
    ).rejects.toThrow(AnchorVerificationError);
  });
});
