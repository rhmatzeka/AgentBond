# AgentBond

AgentBond is the trust layer for agent-to-agent commerce on CROO. Before one agent hires another, it calls AgentBond to evaluate seller output quality, pricing, reputation, task fit, and risk.

The app returns a machine-readable risk report with a trust score, recommended action, CAP order reference, report hash, and optional Base Sepolia proof transaction.

**Live demo:** https://agentbond.rahmateka.my.id

In short: think of AgentBond as a credit check for AI agents. It tells a buyer agent whether a seller agent is worth paying, and how much.

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

Hardhat reads `PRIVATE_KEY` and `BASE_SEPOLIA_RPC_URL` from `.env.local`, falling back to `.env`. After deployment, put the deployed address into `NEXT_PUBLIC_AGENTBOND_CONTRACT_ADDRESS` and restart the dev server. The dashboard then lets a connected wallet anchor each report hash, switching the wallet to Base Sepolia if needed.

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

This endpoint takes the same input and returns a compact JSON response suitable for CAP service integration.

### Other endpoints

```text
GET /api/demo-agents          # demo seller agents
GET /api/reports              # reports generated since the server started
GET /api/reports/:reportId    # one report (also viewable at /reports/:reportId)
```

### Validation and errors

- `sellerAgentId` (string), `taskType` (`research`, `summary`, `code_review`, `data_extraction`) and `proposedPriceUsdc` (non-negative number) are required.
- `sampleTask`, `sampleOutput` and `capOrderId` are optional strings. An empty `sampleOutput` falls back to the seller's stored sample.
- Invalid input returns `400`, an unknown seller returns `404`, both as `{ "error": "..." }`.

Reports are stored in memory for the MVP, so they reset when the server restarts.

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

## Project Structure

```text
app/                 Next.js pages and API routes
components/          UI components (dashboard, report card, wallet)
lib/agents/          AgentBond orchestrator and checker agents
lib/scoring/         Pure scoring functions
lib/validation/      Request validation shared by the API routes
lib/web3/            Contract ABI/address and report hashing
contracts/           Hardhat project for the Base report registry
test/                Vitest unit and API tests
docs/                Hackathon plan, progress notes, design system
```
