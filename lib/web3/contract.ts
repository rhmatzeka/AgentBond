import { isAddress, zeroAddress } from "viem";
import { baseSepolia } from "viem/chains";

export const agentBondReportRegistryAbi = [
  {
    type: "function",
    name: "registerReport",
    stateMutability: "nonpayable",
    inputs: [
      { name: "reportHash", type: "bytes32" },
      { name: "sellerAgentId", type: "string" },
      { name: "trustScore", type: "uint256" },
      { name: "riskLevel", type: "string" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "isRegistered",
    stateMutability: "view",
    inputs: [{ name: "reportHash", type: "bytes32" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "records",
    stateMutability: "view",
    inputs: [{ name: "", type: "bytes32" }],
    outputs: [
      { name: "requester", type: "address" },
      { name: "registeredAt", type: "uint64" },
      { name: "trustScore", type: "uint8" },
    ],
  },
  {
    type: "event",
    name: "ReportRegistered",
    inputs: [
      { name: "requester", type: "address", indexed: true },
      { name: "reportHash", type: "bytes32", indexed: true },
      { name: "sellerAgentId", type: "string", indexed: false },
      { name: "trustScore", type: "uint256", indexed: false },
      { name: "riskLevel", type: "string", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
] as const;

const configuredAddress = process.env.NEXT_PUBLIC_AGENTBOND_CONTRACT_ADDRESS;

export const reportRegistryAddress: `0x${string}` =
  configuredAddress && isAddress(configuredAddress) ? configuredAddress : zeroAddress;

export const isRegistryConfigured = reportRegistryAddress !== zeroAddress;

export const registryChain = baseSepolia;

const explorer = registryChain.blockExplorers.default.url;
export const explorerTxUrl = (txHash: string) => `${explorer}/tx/${txHash}`;
export const explorerAddressUrl = (address: string) => `${explorer}/address/${address}`;
