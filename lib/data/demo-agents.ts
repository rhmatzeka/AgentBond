import type { SellerAgent } from "@/lib/types/agent";

export const demoAgents: SellerAgent[] = [
  {
    id: "good-research-bot",
    name: "GoodResearchBot",
    description: "Reliable research agent with strong source quality and repeat buyers.",
    taskTypes: ["research", "summary"],
    completedJobs: 18,
    failedJobs: 1,
    uniqueBuyers: 8,
    repeatBuyers: 3,
    averageRating: 4.7,
    refundCount: 0,
    suspiciousActivity: false,
    defaultPriceUsdc: 3,
    sampleOutputQuality: "high",
    sampleOutput:
      "Base ecosystem growth is driven by Coinbase distribution, low-cost L2 transactions, builder grants, and consumer apps. Sources: Base docs, Coinbase developer updates, L2Beat, DefiLlama, and ecosystem blog posts.",
  },
  {
    id: "cheap-spam-bot",
    name: "CheapSpamBot",
    description: "Very cheap seller with weak buyer diversity and low-quality generic answers.",
    taskTypes: ["research"],
    completedJobs: 9,
    failedJobs: 5,
    uniqueBuyers: 1,
    repeatBuyers: 0,
    averageRating: 2.1,
    refundCount: 3,
    suspiciousActivity: true,
    defaultPriceUsdc: 0.5,
    sampleOutputQuality: "low",
    sampleOutput: "Base is good. It grows because crypto is popular. Many users like it. No sources needed.",
  },
  {
    id: "overpriced-bot",
    name: "OverpricedBot",
    description: "Decent quality agent that frequently charges above the market benchmark.",
    taskTypes: ["research", "data_extraction"],
    completedJobs: 12,
    failedJobs: 2,
    uniqueBuyers: 5,
    repeatBuyers: 1,
    averageRating: 4.0,
    refundCount: 1,
    suspiciousActivity: false,
    defaultPriceUsdc: 10,
    sampleOutputQuality: "medium",
    sampleOutput:
      "Base growth appears linked to cheaper transactions and Coinbase onboarding. The answer is useful but lacks enough citations and concrete numbers.",
  },
  {
    id: "new-unknown-bot",
    name: "NewUnknownBot",
    description: "New seller with no suspicious activity but limited transaction history.",
    taskTypes: ["summary"],
    completedJobs: 1,
    failedJobs: 0,
    uniqueBuyers: 1,
    repeatBuyers: 0,
    averageRating: 4.0,
    refundCount: 0,
    suspiciousActivity: false,
    defaultPriceUsdc: 1,
    sampleOutputQuality: "unknown",
    sampleOutput: "I can summarize this topic, but I do not have much transaction history yet.",
  },
];

export function getDemoAgent(id: string) {
  return demoAgents.find((agent) => agent.id === id);
}
