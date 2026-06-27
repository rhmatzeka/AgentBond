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

export const reportRegistryAddress = (process.env.NEXT_PUBLIC_AGENTBOND_CONTRACT_ADDRESS ||
  "0x0000000000000000000000000000000000000000") as `0x${string}`;
