# AgentBond Hackathon Plan

## 1. One-Line Summary

AgentBond is a trust and risk scoring agent for the CROO agent economy. Before one AI agent hires another AI agent, AgentBond checks whether the seller agent is trustworthy, fairly priced, and safe to use.

## 2. Simple Explanation

CROO is like a marketplace for AI agents. Each agent can sell a service, get called by other agents, and receive payment.

The problem is simple: if there are many agents selling services, how does a buyer know which agent is good, fake, overpriced, or risky?

AgentBond solves this by acting like a credit score system for AI agents.

Before a buyer agent pays a seller agent, it asks AgentBond:

```text
Is this agent safe to hire?
Is the price fair?
Is the output quality good?
Are there suspicious signals?
```

AgentBond checks multiple signals and returns:

```text
Trust Score: 82/100
Risk Level: Low
Recommended Max Price: 3 USDC
Recommendation: Hire, but do not overpay.
```

## 3. Project Name Options

Recommended name:

```text
AgentBond
```

Alternative names:

```text
TrustRail
AgentScore
CAPScore
AgentGuard
RiskRail
```

Recommended tagline:

```text
The trust layer for agent-to-agent commerce.
```

Simpler tagline:

```text
Before agents pay each other, they ask AgentBond.
```

## 4. Why This Fits CROO

CROO wants AI agents to become paid, callable services. That means agents need:

```text
identity
pricing
payments
discovery
trust
quality checks
safe agent-to-agent transactions
```

AgentBond focuses on the trust part.

If CROO becomes an agent marketplace, AgentBond becomes useful because every buyer agent needs to know which seller agent is safe to hire.

## 5. Tracks

Primary track:

```text
Data & Verification Agents
```

Secondary track:

```text
Developer Tooling Agents
```

Alternative secondary track:

```text
Open - Any A2A Agents
```

## 6. Core User Story

```text
As a buyer agent,
I want to check a seller agent before hiring it,
so that I do not waste USDC on low-quality, fake, risky, or overpriced agents.
```

## 7. Main Demo Story

There are four agents:

```text
1. Buyer Agent
2. GoodResearchBot
3. CheapSpamBot
4. AgentBond
```

The Buyer Agent wants to hire a research agent.

Instead of choosing blindly, the Buyer Agent calls AgentBond first.

AgentBond checks GoodResearchBot and CheapSpamBot.

AgentBond says:

```text
GoodResearchBot:
Trust Score: 88/100
Risk: Low
Recommended Max Price: 3 USDC
Recommendation: Hire

CheapSpamBot:
Trust Score: 34/100
Risk: High
Recommended Max Price: 0.5 USDC
Recommendation: Avoid
```

The Buyer Agent chooses GoodResearchBot.

The demo should show that the buyer agent did not manually inspect everything. AgentBond did the checks and returned a recommendation.

## 8. What A2A Means In This Project

A2A means agent-to-agent.

In this project:

```text
Buyer Agent asks AgentBond.
AgentBond asks specialist checker agents.
AgentBond combines the results.
Buyer Agent uses the recommendation.
```

Example:

```text
Buyer Agent
  -> calls AgentBond
AgentBond
  -> calls Output Quality Checker
  -> calls Pricing Benchmark Checker
  -> calls Reputation Checker
AgentBond
  -> returns final risk report
Buyer Agent
  -> decides whether to hire seller agent
```

## 9. MVP Scope

Build the smallest version that proves the idea.

MVP must include:

```text
1. AgentBond main agent
2. At least 2 specialist checker agents
3. Simple web dashboard
4. Mock or real seller agent profiles
5. Trust score calculation
6. Risk report output
7. CAP/CROO integration for callable paid agent service
8. Base transaction reference or on-chain report hash
9. README and demo video
```

Do not overbuild.

Avoid building a full marketplace, full reputation system, or complex dispute system during the hackathon.

## 10. Specialist Agents

### 10.1 AgentBond Main Agent

Purpose:

```text
Main risk scoring and recommendation agent.
```

Input:

```json
{
  "seller_agent_id": "good-research-bot",
  "task_type": "research",
  "proposed_price_usdc": 5,
  "sample_task": "Find 5 sources about Base ecosystem growth",
  "sample_output": "..."
}
```

Output:

```json
{
  "seller_agent_id": "good-research-bot",
  "trust_score": 88,
  "risk_level": "low",
  "recommended_action": "hire",
  "recommended_max_price_usdc": 3,
  "payment_recommendation": "pay after delivery or use milestone payment",
  "reasons": [
    "output quality is strong",
    "price is slightly above benchmark",
    "no suspicious signals found"
  ],
  "checks": {
    "output_quality_score": 91,
    "pricing_score": 70,
    "reputation_score": 85
  }
}
```

### 10.2 Output Quality Checker Agent

Purpose:

```text
Checks whether the seller agent's sample output is useful, complete, and matches the task.
```

Checks:

```text
format compliance
task completeness
source quality
hallucination risk
clarity
```

Output:

```json
{
  "quality_score": 91,
  "format_passed": true,
  "hallucination_risk": "low",
  "notes": [
    "answer follows requested format",
    "sources are relevant",
    "no obvious hallucination detected"
  ]
}
```

### 10.3 Pricing Benchmark Agent

Purpose:

```text
Checks whether the proposed price is fair for the task type.
```

Output:

```json
{
  "price_fairness": "expensive",
  "recommended_min_usdc": 2,
  "recommended_max_usdc": 3,
  "notes": [
    "similar research tasks usually cost 2-3 USDC",
    "5 USDC is above the suggested range"
  ]
}
```

### 10.4 Reputation Checker Agent

Purpose:

```text
Checks simple reputation signals for the seller agent.
```

For MVP, reputation data can be mock data, demo data, or data from previous test orders.

Signals:

```text
completed jobs
failed jobs
unique buyers
repeat buyers
average rating
refund count
suspicious self-trade flag
```

Output:

```json
{
  "reputation_score": 85,
  "completed_jobs": 12,
  "failed_jobs": 1,
  "unique_buyers": 6,
  "suspicious_activity": false,
  "notes": [
    "healthy buyer diversity",
    "low failure rate"
  ]
}
```

## 11. Trust Score Formula

Keep the formula simple and explainable.

Recommended MVP formula:

```text
trust_score =
  40% output_quality_score
  30% reputation_score
  20% pricing_score
  10% task_fit_score
```

Risk level:

```text
0-39: High Risk
40-69: Medium Risk
70-100: Low Risk
```

Recommended action:

```text
0-39: Avoid
40-69: Hire only with verification or milestone payment
70-100: Hire
```

## 12. Scoring Rubric

The score must be explainable and stable during the demo. Do not make the final score feel random or fully hidden inside an LLM call.

### 12.1 Output Quality Score

For MVP, the Output Quality Checker can use an LLM plus a fixed rubric.

Rubric:

```text
task_completeness: 30 points
format_compliance: 20 points
source_or_evidence_quality: 20 points
clarity: 15 points
hallucination_risk: 15 points
```

Example scoring:

```text
90-100: complete, clear, well sourced, follows format
70-89: useful but missing minor detail
40-69: partially useful but incomplete or weak evidence
0-39: low quality, irrelevant, spammy, or likely hallucinated
```

### 12.2 Pricing Score

Use a simple benchmark table per task type.

Example benchmark:

```text
research: 2-3 USDC
summary: 0.5-1 USDC
code_review: 3-5 USDC
data_extraction: 1-2 USDC
```

Pricing score rule:

```text
100: price is inside benchmark range
80: price is up to 25% above max benchmark
60: price is 25-75% above max benchmark
40: price is more than 75% above max benchmark
30: price is suspiciously cheap and quality is low
```

### 12.3 Reputation Score

For MVP, reputation can come from demo data or previous test orders.

Formula:

```text
reputation_score =
  40% completion_rate
  25% average_rating_normalized
  20% buyer_diversity
  15% suspicious_activity_penalty
```

Rules:

```text
completion_rate = completed_jobs / max(completed_jobs + failed_jobs, 1)
average_rating_normalized = average_rating / 5
buyer_diversity improves when unique_buyers is higher than 1
suspicious_activity_penalty is low if suspicious self-trade is detected
```

### 12.4 Task Fit Score

Task fit checks whether the seller agent is suitable for the requested task type.

For MVP:

```text
100: seller specializes in the requested task type
75: seller has completed similar tasks
50: seller is general purpose but not specialized
25: seller has no relevant history
0: seller is clearly mismatched
```

### 12.5 Final Score Behavior

The final report must always include reasons, not just a number.

Example:

```text
Trust Score: 68/100
Risk: Medium
Reason: Good output quality, but price is above benchmark and seller has limited buyer diversity.
```

## 13. System Architecture

Keep the architecture simple enough to finish during the hackathon.

Frontend:

```text
Next.js dashboard
Risk check form
Demo agents page
Report viewer
Wallet connection
Base transaction display
```

Backend:

```text
Next.js API routes or a small Node.js server
/api/risk-check
/api/report/:id
/api/demo-agents
/api/register-report-hash
/api/cap/generate-risk-report
```

Agent layer:

```text
AgentBond Orchestrator
Output Quality Checker
Pricing Benchmark Checker
Reputation Checker
```

Data layer:

```text
demo-agents.json
in-memory or local JSON risk reports
CAP order references
Base transaction hashes
```

Web3 layer:

```text
AgentBondReportRegistry smart contract on Base Sepolia
Report hash registration through viem or wagmi
ReportRegistered event for proof and demo history
```

Architecture flow:

```text
Buyer Agent or User
  -> calls AgentBond through dashboard or CAP
AgentBond Backend
  -> runs Output Quality Checker
  -> runs Pricing Benchmark Checker
  -> runs Reputation Checker
AgentBond Backend
  -> calculates trust score
  -> returns machine-readable risk report
Frontend
  -> hashes report JSON
  -> registers report hash on Base
Dashboard
  -> shows report, CAP order id, report hash, and Base transaction hash
```

Important implementation decision:

```text
For the MVP, specialist agents can be implemented as separate functions or modules as long as the code and demo clearly show AgentBond delegating work to them.
```

Do not hide all logic inside one generic scoring function. The project must look and behave like an agent-to-agent risk checking flow.

## 14. Implementation Decisions

Use these decisions as the default build direction. Do not keep debating stack choices during the hackathon.

Final stack:

```text
Frontend framework: Next.js
Backend/API: Next.js API routes
Language: TypeScript
Styling: Tailwind CSS
Wallet/web3 frontend: wagmi
Contract calls: viem through wagmi where possible
Smart contract framework: Hardhat
Network: Base Sepolia
Data storage for MVP: local JSON, in-memory data, or simple file-based mock data
LLM integration: OpenAI-compatible API, with deterministic fallback for demo agents
```

Why this stack:

```text
Next.js keeps frontend and API routes in one app, which is faster for a hackathon.
wagmi is a familiar wallet and contract interaction layer for React apps.
Hardhat is straightforward for writing, testing, and deploying the simple Base registry contract.
Local JSON data keeps the MVP simple and avoids database setup time.
```

Avoid adding extra infrastructure unless needed:

```text
No separate backend server unless Next.js API routes become a blocker.
No database unless local JSON becomes too limiting.
No complex indexing service unless event history becomes important for the demo.
```

## 15. Recommended Repository Structure

Use a structure that keeps product UI, API routes, agent logic, scoring logic, demo data, and smart contracts separated.

Recommended structure:

```text
agentbond/
  app/
    page.tsx
    layout.tsx
    globals.css
    demo/
      page.tsx
    risk-check/
      page.tsx
    reports/
      [reportId]/
        page.tsx
    api/
      risk-check/
        route.ts
      reports/
        [reportId]/
          route.ts
      demo-agents/
        route.ts
      register-report-hash/
        route.ts
      cap/
        generate-risk-report/
          route.ts

  components/
    app-shell.tsx
    landing-hero.tsx
    wallet-connect-button.tsx
    demo-agent-card.tsx
    risk-check-form.tsx
    trust-score-card.tsx
    risk-level-badge.tsx
    checker-breakdown.tsx
    report-proof-card.tsx
    agent-call-graph.tsx

  lib/
    agents/
      agentbond-orchestrator.ts
      output-quality-checker.ts
      pricing-benchmark-checker.ts
      reputation-checker.ts
      task-fit-checker.ts
    scoring/
      trust-score.ts
      pricing-score.ts
      reputation-score.ts
      output-quality-score.ts
      task-fit-score.ts
    cap/
      schema.ts
      client.ts
      mock-cap.ts
    web3/
      chains.ts
      contract.ts
      report-hash.ts
    data/
      demo-agents.ts
      pricing-benchmarks.ts
      reports-store.ts
    types/
      agent.ts
      report.ts
      checker.ts
      cap.ts
    utils/
      env.ts
      ids.ts
      format.ts

  contracts/
    contracts/
      AgentBondReportRegistry.sol
    scripts/
      deploy.ts
    test/
      AgentBondReportRegistry.ts
    hardhat.config.ts

  test/
    scoring/
      trust-score.test.ts
      pricing-score.test.ts
      reputation-score.test.ts
    api/
      risk-check.test.ts
    fixtures/
      demo-requests.ts

  public/
    screenshots/

  docs/
    architecture.md
    demo-script.md
    cap-integration.md

  .env.example
  package.json
  README.md
```

Maintenance rules:

```text
Keep API routes thin. They should validate input, call lib functions, and return JSON.
Keep scoring formulas in lib/scoring so they can be tested without React or API code.
Keep checker agents in lib/agents so AgentBond orchestration is clear.
Keep demo data in lib/data so the UI and API use the same source.
Keep CAP-specific code in lib/cap so fallback/mock CAP does not leak everywhere.
Keep web3 hashing and contract config in lib/web3 so UI components stay simple.
Keep shared TypeScript types in lib/types so API, UI, and tests use the same shapes.
```

File responsibility guide:

```text
app/api/risk-check/route.ts: main dashboard risk check endpoint
app/api/cap/generate-risk-report/route.ts: CAP-compatible callable endpoint
lib/agents/agentbond-orchestrator.ts: calls checker agents and builds final report
lib/scoring/trust-score.ts: final weighted scoring formula
lib/web3/report-hash.ts: stable JSON hashing for report proofs
contracts/contracts/AgentBondReportRegistry.sol: Base Sepolia report hash registry
test/scoring/*.test.ts: fast automated tests for scoring behavior
```

## 16. Data Model

Use simple JSON-compatible objects.

### 16.1 SellerAgent

```json
{
  "id": "good-research-bot",
  "name": "GoodResearchBot",
  "task_types": ["research", "summary"],
  "completed_jobs": 18,
  "failed_jobs": 1,
  "unique_buyers": 8,
  "repeat_buyers": 3,
  "average_rating": 4.7,
  "refund_count": 0,
  "suspicious_activity": false,
  "default_price_usdc": 3
}
```

### 16.2 RiskCheckRequest

```json
{
  "seller_agent_id": "good-research-bot",
  "task_type": "research",
  "proposed_price_usdc": 5,
  "sample_task": "Find 5 sources about Base ecosystem growth",
  "sample_output": "...",
  "cap_order_id": "optional-cap-order-id"
}
```

### 16.3 CheckerResult

```json
{
  "checker_name": "OutputQualityChecker",
  "score": 91,
  "risk_flags": [],
  "notes": [
    "answer follows requested format",
    "sources are relevant"
  ]
}
```

### 16.4 RiskReport

```json
{
  "report_id": "report_001",
  "seller_agent_id": "good-research-bot",
  "task_type": "research",
  "trust_score": 88,
  "risk_level": "low",
  "recommended_action": "hire",
  "recommended_max_price_usdc": 3,
  "payment_recommendation": "pay after delivery or use milestone payment",
  "reasons": [
    "output quality is strong",
    "price is slightly above benchmark",
    "no suspicious signals found"
  ],
  "checks": {
    "output_quality_score": 91,
    "pricing_score": 70,
    "reputation_score": 85,
    "task_fit_score": 90
  },
  "cap_order_id": "cap_order_123",
  "report_hash": "0x...",
  "base_transaction_hash": "0x...",
  "created_at": "2026-06-27T00:00:00.000Z"
}
```

## 17. Base/Web3 Plan

The project should use Base as the web3 network layer.

Main goals:

```text
1. Use Base wallet connection in the web app.
2. Show USDC-based payment intent for AgentBond report.
3. Store or reference a hash of the risk report on Base.
4. Show transaction hash in the dashboard.
5. Connect this with CROO/CAP order references where possible.
```

Recommended Base flow:

```text
User connects wallet on Base.
User requests an AgentBond risk report.
The request creates a paid agent call through CROO/CAP.
AgentBond generates a report.
Frontend hashes the report JSON.
Hash is submitted to a simple Base smart contract.
Dashboard shows:
- report result
- CROO/CAP order id
- Base transaction hash
- report hash
```

Why store only the hash:

```text
The full report can be large and may contain private data.
The hash proves that the report existed and was not changed later.
```

## 18. Simple Smart Contract On Base

Contract name:

```text
AgentBondReportRegistry
```

Purpose:

```text
Store hashes of generated AgentBond reports.
```

Minimal functions:

```solidity
function registerReport(
    bytes32 reportHash,
    string calldata sellerAgentId,
    uint256 trustScore,
    string calldata riskLevel
) external;
```

Recommended validation:

```solidity
require(reportHash != bytes32(0), "Invalid report hash");
require(trustScore <= 100, "Invalid trust score");
```

Event:

```solidity
event ReportRegistered(
    address indexed requester,
    bytes32 indexed reportHash,
    string sellerAgentId,
    uint256 trustScore,
    string riskLevel,
    uint256 timestamp
);
```

Use Base Sepolia for hackathon testing unless mainnet is required.

Contract behavior for MVP:

```text
The contract does not store the full private report.
The contract emits an event that proves a report hash was registered.
The dashboard uses the transaction hash as proof for the demo.
Duplicate report hashes can be allowed for MVP, but unique hashes are better if time allows.
```

## 19. Frontend Pages

### 19.1 Landing Page

Show:

```text
AgentBond
The trust layer for agent-to-agent commerce.
Before agents pay each other, they ask AgentBond.
```

Buttons:

```text
Run Demo
View Reports
Connect Wallet
```

### 19.2 Risk Check Page

Form fields:

```text
Seller Agent ID
Task Type
Proposed Price in USDC
Sample Task
Sample Output
```

Button:

```text
Run AgentBond Check
```

### 19.3 Report Page

Show:

```text
Trust Score
Risk Level
Recommended Action
Recommended Max Price
Payment Recommendation
Reasons
Sub-agent checks
CROO/CAP order references
Base transaction hash
Report hash
```

### 19.4 Demo Agents Page

Show demo seller agents:

```text
GoodResearchBot
CheapSpamBot
OverpricedBot
NewUnknownBot
```

Each demo agent should have clear fake/demo data for scoring.

## 20. Backend/API Plan

Suggested API endpoints:

```text
POST /api/risk-check
GET /api/report/:id
GET /api/demo-agents
POST /api/register-report-hash
```

Risk check flow:

```text
1. Receive seller agent data.
2. Call Output Quality Checker.
3. Call Pricing Benchmark Agent.
4. Call Reputation Checker.
5. Calculate trust score.
6. Generate report JSON.
7. Return report to frontend.
8. Optionally register report hash on Base.
```

## 21. CROO/CAP Integration Plan

Required hackathon goal:

```text
AgentBond must be listed on CROO Agent Store and callable through CAP.
```

CAP integration checklist:

```text
1. Read CROO CAP SDK quickstart.
2. Create AgentBond service endpoint.
3. Define AgentBond service schema.
4. Set price for risk report, for example 0.1 or 0.5 USDC.
5. Make the agent callable through CAP.
6. Return structured JSON report.
7. Capture CAP order id in logs/dashboard.
8. List AgentBond on CROO Agent Store.
9. Run multiple real test orders.
10. Include CAP SDK methods used in README.
```

### 21.1 CAP Service Schema

Service name:

```text
generateRiskReport
```

Suggested price:

```text
0.1 USDC for demo pricing
0.5 USDC if the hackathon expects a more realistic paid agent service
```

Input schema:

```json
{
  "seller_agent_id": "string",
  "task_type": "string",
  "proposed_price_usdc": "number",
  "sample_task": "string",
  "sample_output": "string"
}
```

Output schema:

```json
{
  "report_id": "string",
  "seller_agent_id": "string",
  "trust_score": "number",
  "risk_level": "low | medium | high",
  "recommended_action": "hire | verify | avoid",
  "recommended_max_price_usdc": "number",
  "reasons": ["string"],
  "report_hash": "string"
}
```

CAP demo proof should show:

```text
CAP order id
AgentBond service name
Input request
Structured JSON response
Timestamp or logs
```

### 21.2 CAP Order Lifecycle

Target lifecycle:

```text
1. Buyer requests generateRiskReport through CAP.
2. CAP creates a paid order for AgentBond.
3. AgentBond receives the request payload.
4. AgentBond runs specialist checker agents.
5. AgentBond returns structured risk report JSON.
6. Backend stores CAP order id with the generated report.
7. Dashboard displays CAP order id beside the report.
```

### 21.3 CAP Fallback Plan

If CAP integration takes longer than expected, keep the project credible with a clear fallback.

Fallback levels:

```text
Level 1: Full CAP integration with real order ids.
Level 2: CAP-callable endpoint works, but Agent Store listing is pending.
Level 3: CAP-ready endpoint and schema are implemented, with mock CAP order references clearly labeled as demo data.
```

Do not pretend mock CAP orders are real. If using fallback data, label it clearly in README and demo.

Minimum acceptable fallback:

```text
/api/cap/generate-risk-report accepts the final CAP input schema.
The response matches the final CAP output schema.
The README explains how this endpoint maps to CAP.
The dashboard has a visible CAP order reference field.
```

Target for judging:

```text
At least 10 real CAP orders during the hackathon.
At least 3 unique counterparty agents if possible.
At least 5 unique buyer wallets if team/friends can help test.
```

## 22. Demo Data

Create demo seller agents:

### GoodResearchBot

```json
{
  "completed_jobs": 18,
  "failed_jobs": 1,
  "unique_buyers": 8,
  "average_rating": 4.7,
  "proposed_price_usdc": 3,
  "sample_output_quality": "high"
}
```

Expected result:

```text
Trust Score: 85-95
Risk: Low
Recommendation: Hire
```

### CheapSpamBot

```json
{
  "completed_jobs": 9,
  "failed_jobs": 5,
  "unique_buyers": 1,
  "average_rating": 2.1,
  "proposed_price_usdc": 0.5,
  "sample_output_quality": "low"
}
```

Expected result:

```text
Trust Score: 20-40
Risk: High
Recommendation: Avoid
```

### OverpricedBot

```json
{
  "completed_jobs": 12,
  "failed_jobs": 2,
  "unique_buyers": 5,
  "average_rating": 4.0,
  "proposed_price_usdc": 10,
  "sample_output_quality": "medium"
}
```

Expected result:

```text
Trust Score: 55-70
Risk: Medium
Recommendation: Hire only if price is reduced
```

## 23. Exact Demo Flow

The demo should be repeatable and easy for judges to follow.

Step-by-step demo:

```text
1. Open AgentBond dashboard.
2. Connect wallet on Base Sepolia.
3. Open Demo Agents page.
4. Select GoodResearchBot.
5. Run AgentBond risk check.
6. Show AgentBond calling Quality, Pricing, and Reputation checker agents.
7. Show GoodResearchBot report with high trust score.
8. Show CAP order id or CAP-callable service proof.
9. Register report hash on Base.
10. Show Base transaction hash and report hash.
11. Repeat with CheapSpamBot.
12. Show low trust score and Avoid recommendation.
13. Explain that buyer agents can use this report before spending USDC.
```

The most important visual moment:

```text
GoodResearchBot gets Hire.
CheapSpamBot gets Avoid.
Both reports show checker-agent reasoning, CAP reference, and Base proof.
```

## 24. Demo Video Script

Keep demo video under 5 minutes.

### 0:00-0:30 Problem

Say:

```text
CROO lets agents hire and pay each other. But when there are many paid agents, how does a buyer agent know which seller agent is safe, fair, and high quality? AgentBond solves this by scoring agent risk before payment.
```

### 0:30-1:15 Product

Show landing page and explain:

```text
AgentBond is the trust layer for agent-to-agent commerce. Before agents pay each other, they ask AgentBond.
```

### 1:15-2:30 First Check

Run GoodResearchBot check.

Show:

```text
Trust Score: high
Risk: low
Recommended action: hire
Base transaction hash
CROO/CAP order id
```

### 2:30-3:30 Second Check

Run CheapSpamBot check.

Show:

```text
Trust Score: low
Risk: high
Recommended action: avoid
Reasons for the warning
```

### 3:30-4:15 A2A Explanation

Show agent call graph:

```text
Buyer Agent -> AgentBond -> Quality Checker
                       -> Pricing Checker
                       -> Reputation Checker
```

### 4:15-5:00 Closing

Say:

```text
AgentBond helps CROO become a safer agent marketplace by giving agents a way to evaluate trust, price, and risk before spending USDC.
```

## 25. README Structure

README should include:

```text
1. Project title
2. Short description
3. Problem
4. Solution
5. Why CROO/CAP
6. Architecture diagram
7. A2A flow
8. Base/web3 flow
9. Smart contract address
10. CAP integration notes
11. Setup instructions
12. Environment variables
13. How to run locally
14. How to run demo
15. Demo video link
16. License
```

Also include a short proof section:

```text
CAP service name:
CAP order ids:
Base Sepolia contract address:
Example Base transaction hash:
Example report hash:
Demo agents used:
```

## 26. Suggested Tech Stack

Frontend:

```text
Next.js
TypeScript
Tailwind CSS
wagmi
viem for Base contract calls through wagmi
```

Backend:

```text
Next.js API routes
OpenAI-compatible LLM API for checks
CROO CAP SDK
```

Smart contract:

```text
Solidity
Base Sepolia
Hardhat
```

Data:

```text
Demo JSON data for seller agents
Optional local database or simple file-based mock data
```

## 27. Environment Variables

Create a `.env.example` file for documentation. Do not commit real private keys, API keys, or wallet secrets.

Example `.env.example`:

```bash
# App
NEXT_PUBLIC_APP_NAME=AgentBond
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Base Sepolia
NEXT_PUBLIC_BASE_CHAIN_ID=84532
NEXT_PUBLIC_AGENTBOND_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# Deployment wallet
# Never put a real private key in .env.example.
PRIVATE_KEY=replace_with_your_deployer_private_key

# LLM provider
LLM_API_KEY=replace_with_your_llm_api_key
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-4o-mini

# CROO/CAP
CAP_API_KEY=replace_with_your_cap_api_key
CAP_SERVICE_ID=replace_with_your_cap_service_id
CAP_AGENT_ID=replace_with_your_cap_agent_id
CAP_ENV=sandbox

# Demo mode
USE_DEMO_DATA=true
USE_MOCK_CAP=false
```

Security rules:

```text
Commit .env.example only.
Do not commit .env.local.
Do not paste private keys into README, screenshots, or demo video.
Use a fresh hackathon wallet for Base Sepolia deployment.
If a private key is ever exposed, rotate it immediately.
```

Expected local setup:

```text
1. Copy .env.example to .env.local.
2. Fill in real values locally.
3. Run the Next.js app.
4. Deploy the Hardhat contract to Base Sepolia.
5. Paste the deployed contract address into NEXT_PUBLIC_AGENTBOND_CONTRACT_ADDRESS.
```

## 28. Testing Plan

The project should have manual tests for demo confidence and optional automated tests for maintainability.

### 28.1 Manual Demo Tests

Run these before recording the demo video.

```text
GoodResearchBot returns Low Risk and Hire.
CheapSpamBot returns High Risk and Avoid.
OverpricedBot returns Medium Risk or price warning.
Risk report includes checker-agent breakdown.
Risk report includes reasons, recommended max price, and payment recommendation.
Report hash is generated from the report JSON.
Base Sepolia transaction hash appears after registering report hash.
CAP endpoint returns the same structured report shape as the dashboard endpoint.
README setup instructions work from a fresh clone.
```

### 28.2 Optional Automated Tests

Automated tests are optional, but they are valuable because they keep the scoring logic stable while the UI changes.

Recommended tools:

```text
Vitest for TypeScript unit tests
Hardhat test runner for smart contract tests
Optional React Testing Library only if there is enough time
```

Recommended automated tests:

```text
trust-score.test.ts:
- calculates weighted score correctly
- clamps score between 0 and 100
- maps 0-39 to High Risk
- maps 40-69 to Medium Risk
- maps 70-100 to Low Risk

pricing-score.test.ts:
- gives high score for price inside benchmark
- lowers score when price is above benchmark
- flags suspiciously cheap price when quality is low

reputation-score.test.ts:
- rewards high completion rate
- penalizes low buyer diversity
- penalizes suspicious activity

risk-check.test.ts:
- GoodResearchBot returns expected Low Risk report shape
- CheapSpamBot returns expected High Risk report shape
- response includes checks, reasons, report_id, and seller_agent_id

AgentBondReportRegistry.ts:
- registers a valid report hash
- emits ReportRegistered event
- rejects empty report hash
- rejects trust score above 100
```

Minimum automated test set if time is short:

```text
1. trust-score.test.ts
2. pricing-score.test.ts
3. AgentBondReportRegistry.ts
```

Do not block the hackathon submission on full test coverage. Prioritize tests around scoring and smart contract behavior because those are easiest to break silently.

## 29. Critical Path For Hackathon

If time is limited, build in this order.

Critical path:

```text
1. Create demo agents JSON.
2. Build risk scoring API.
3. Implement three checker agents as separate modules.
4. Return stable structured RiskReport JSON.
5. Build report UI.
6. Add wallet connection.
7. Deploy Base Sepolia report registry.
8. Register report hash and show transaction hash.
9. Add CAP-callable endpoint and service schema.
10. Record demo video and write README proof section.
```

If only 24 hours remain:

```text
Must finish:
- Risk check API
- GoodResearchBot and CheapSpamBot demo
- Report UI
- Checker-agent reasoning
- CAP-ready endpoint or real CAP order
- Base transaction hash
- README and video

Cut:
- Advanced styling
- Historical analytics
- Real database
- More than 3 demo agents
- Complex smart contract features
```

## 30. Build Milestones

### Milestone 1: Project Setup

```text
Create repo
Set up frontend
Set up backend/API
Set up wallet connect
Create demo data
```

### Milestone 2: AgentBond Core Logic

```text
Build risk check API
Build quality checker
Build pricing checker
Build reputation checker
Build scoring formula
Return structured report
```

### Milestone 3: Frontend UI

```text
Landing page
Risk check form
Report page
Demo agents page
Agent call graph display
```

### Milestone 4: Base Integration

```text
Write report registry contract
Deploy to Base Sepolia
Add register report hash function
Show transaction hash in UI
```

### Milestone 5: CROO/CAP Integration

```text
Read CAP docs
Make AgentBond callable
Set USDC price
List on CROO Agent Store
Run test CAP orders
Log order ids
Show order ids in UI or README
```

### Milestone 6: Polish and Submission

```text
Write README
Record demo video
Add screenshots
Add license
Test setup instructions
Submit BUIDL on DoraHacks
```

## 31. Features To Cut If Time Is Short

Cut these if needed:

```text
Full agent marketplace
Complex dispute system
Real-time monitoring
Advanced sybil detection
Complex ML model
Historical analytics dashboard
Multi-chain support
```

Keep these no matter what:

```text
AgentBond risk report
A2A-style sub-agent checks
CROO/CAP callable service
Base report hash or transaction reference
Clear demo with good vs bad seller agent
README and demo video
```

## 32. Risks And Fixes

### Risk: Not enough real CROO data

Fix:

```text
Use demo data plus real CAP order ids from test calls. Explain that AgentBond can use richer marketplace data as CROO grows.
```

### Risk: Looks like a simple scoring app

Fix:

```text
Show the agent-to-agent flow clearly. AgentBond should call checker agents, not just calculate everything silently.
```

### Risk: Too hard to integrate CAP

Fix:

```text
Keep the AgentBond service schema simple. One paid endpoint: generateRiskReport.
```

### Risk: Judges do not understand why it matters

Fix:

```text
Use the Fiverr/Upwork analogy. CROO is a marketplace for agents. Marketplaces need trust scores.
```

### Risk: Looks fake because reputation data is synthetic

Fix:

```text
Clearly label demo reputation data as synthetic. Combine it with real CAP order ids where possible. Explain that the same interface can consume real CROO marketplace history as it becomes available.
```

### Risk: LLM scoring feels non-deterministic

Fix:

```text
Use fixed scoring rubrics and display the scoring breakdown. The LLM can help judge quality, but the final report must show explainable components.
```

### Risk: Base integration feels unnecessary

Fix:

```text
Explain that only the report hash is stored on-chain as a tamper-evident proof. The full report stays off-chain for privacy and cost reasons.
```

## 33. Security, Privacy, And Trust Assumptions

Important notes:

```text
AgentBond gives recommendations, not guarantees.
The trust score should help buyer agents make better decisions, but it should not be treated as absolute truth.
Full risk reports should stay off-chain because they may contain private task details or seller information.
Only report hashes should be stored on Base.
Demo reputation data can be synthetic, but real CAP order ids should be used whenever possible.
High-value transactions should still use additional verification or milestone payments.
```

Do not claim that AgentBond prevents all fraud. The stronger claim is:

```text
AgentBond reduces blind trust in agent-to-agent commerce by giving buyer agents an explainable pre-payment risk report.
```

## 34. Judge Appeal

Why this fits the hackathon:

```text
It is directly useful for CROO because paid agent marketplaces need trust and risk checks.
It demonstrates A2A composability because a buyer agent calls AgentBond, and AgentBond delegates to specialist checker agents.
It uses CAP because AgentBond itself is a paid callable agent service.
It uses Base because risk report proofs are anchored as hashes on-chain.
It is small enough to demo but extensible into real marketplace infrastructure.
```

What makes it stronger than a simple dashboard:

```text
The output is machine-readable for other agents.
The risk report can be called before payment.
The checker agents produce explainable sub-scores.
The CAP order id proves the agent service was called.
The Base hash proves the report existed and was not changed later.
```

## 35. Final Deliverables Checklist

Final submission should include:

```text
Live demo URL
GitHub repository
README with setup instructions
Demo video under 5 minutes
AgentBond CAP service name
CAP order ids or CAP-callable endpoint proof
Base Sepolia contract address
Example Base transaction hash
Example report hash
Screenshots of GoodResearchBot and CheapSpamBot reports
Clear explanation of synthetic vs real data
```

## 36. Winning Angle

The strongest story:

```text
CROO is building the marketplace for paid AI agents. But commerce needs trust. AgentBond gives every buyer agent a way to check risk before spending USDC. It is not just an agent; it is infrastructure for safer agent-to-agent commerce.
```

## 37. Final Submission Pitch

Use this pitch in the DoraHacks description:

```text
AgentBond is the trust layer for agent-to-agent commerce on CROO. Before one agent hires another, it calls AgentBond to evaluate the seller agent's output quality, pricing, reputation, and risk. AgentBond returns a trust score, risk level, recommended max price, and payment recommendation. The system demonstrates real A2A composability by using specialist checker agents and records report proofs on Base.
```

## 38. Final Team Summary

Share this with the team:

```text
We are building AgentBond, a risk scoring agent for the CROO agent marketplace.

CROO lets AI agents sell services and pay each other. The problem is that buyer agents need to know which seller agents are trustworthy, fairly priced, and safe to use.

AgentBond solves this by acting like a credit score for AI agents. Before a buyer agent pays a seller agent, it calls AgentBond. AgentBond checks output quality, price fairness, reputation, and suspicious signals. Then it returns a trust score, risk level, recommended max price, and whether the buyer should hire or avoid that seller agent.

The demo will show a buyer agent checking multiple seller agents. AgentBond will recommend a good agent and warn against a bad or overpriced agent. We will integrate CROO/CAP for paid callable agent service and use Base to store a proof hash of the generated risk report.

The project fits CROO because agent marketplaces need trust, ratings, pricing checks, and safer payments. AgentBond is the trust layer for agent-to-agent commerce.
```
