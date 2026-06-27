# AgentBond

AgentBond is the trust layer for agent-to-agent commerce on CROO. Before one agent hires another, it calls AgentBond to evaluate seller output quality, pricing, reputation, task fit, and risk.

The app returns a machine-readable risk report with a trust score, recommended action, CAP order reference, report hash, and optional Base Sepolia proof transaction.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- wagmi + viem
- Hardhat
- Vitest
- Base Sepolia

## Features

- Demo seller agents: `GoodResearchBot`, `CheapSpamBot`, `OverpricedBot`, `NewUnknownBot`
- AgentBond orchestrator with specialist checker modules
- Output quality, pricing, reputation, and task-fit scoring
- CAP-compatible endpoint at `POST /api/cap/generate-risk-report`
- Base Sepolia report hash registry contract
- Optional automated tests for scoring and orchestration

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Use `.env.example` as the template. Do not commit `.env.local` or real private keys.

Important values:

```bash
NEXT_PUBLIC_AGENTBOND_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
PRIVATE_KEY=replace_with_your_deployer_private_key
CAP_API_KEY=replace_with_your_cap_api_key
CAP_SERVICE_ID=replace_with_your_cap_service_id
```

## Commands

```bash
npm run dev
npm run lint
npm run test
npm run build
npm run hardhat:compile
npm run hardhat:test
```

Deploy the registry contract to Base Sepolia:

```bash
npm run deploy:base-sepolia
```

After deployment, put the deployed address into `NEXT_PUBLIC_AGENTBOND_CONTRACT_ADDRESS`.

## API

### Dashboard Risk Check

```text
POST /api/risk-check
```

Input:

```json
{
  "sellerAgentId": "good-research-bot",
  "taskType": "research",
  "proposedPriceUsdc": 3,
  "sampleTask": "Find 5 sources about Base ecosystem growth",
  "sampleOutput": "..."
}
```

### CAP-Compatible Service

```text
POST /api/cap/generate-risk-report
```

This endpoint returns a compact JSON response suitable for CAP service integration.

## Base Contract

Contract: `contracts/contracts/AgentBondReportRegistry.sol`

Function:

```solidity
function registerReport(
    bytes32 reportHash,
    string calldata sellerAgentId,
    uint256 trustScore,
    string calldata riskLevel
) external;
```

The contract stores no private report data. It emits `ReportRegistered` as tamper-evident proof that the report hash existed.

## Demo Flow

1. Open the dashboard.
2. Connect wallet on Base Sepolia.
3. Select `GoodResearchBot`.
4. Run AgentBond check.
5. Show low risk report and checker-agent reasoning.
6. Register the report hash on Base.
7. Repeat with `CheapSpamBot` to show high risk and avoid recommendation.

## Proof Section

Fill this before submission:

```text
CAP service name:
CAP order ids:
Base Sepolia contract address:
Example Base transaction hash:
Example report hash:
Demo video link:
```

## Security Notes

- AgentBond gives recommendations, not guarantees.
- Full reports stay off-chain.
- Only report hashes should be anchored on Base.
- Demo reputation data is synthetic unless explicitly replaced with real CROO/CAP data.
- Use a fresh hackathon wallet for deployment.
