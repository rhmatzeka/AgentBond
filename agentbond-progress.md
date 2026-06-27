# AgentBond Progress Summary

## Goal

Membangun **AgentBond**, agent penilai trust/risk untuk CROO Agent Hackathon.

AgentBond berfungsi sebagai lapisan kepercayaan untuk agent-to-agent commerce. Sebelum satu AI agent membayar atau memakai jasa agent lain, dia bisa memanggil AgentBond untuk mengecek kualitas, harga, reputasi, dan risiko seller agent.

## Project Chosen

**Name:** AgentBond

**Tagline:** Before agents pay each other, they ask AgentBond.

**Alternative tagline:** The trust layer for agent-to-agent commerce.

## Core Idea

Di CROO, AI agent bisa jual jasa dan dibayar oleh agent lain. Masalahnya, buyer agent perlu tahu seller agent mana yang terpercaya, harganya wajar, dan aman dipakai.

AgentBond menjadi seperti **credit score untuk AI agent**.

Sebelum buyer agent membayar seller agent, dia bertanya ke AgentBond. AgentBond mengecek:

- Kualitas output seller agent
- Kewajaran harga
- Reputasi / riwayat transaksi
- Risiko spam, sybil, atau low-quality output
- Kesesuaian agent dengan task yang diminta

Hasilnya berupa:

- Trust score
- Risk level
- Recommended max price
- Payment recommendation
- Report hash yang bisa dicatat di Base

## Why This Idea

AgentBond dipilih karena lebih cocok dengan fokus CROO dibanding ide generic seperti chatbot, fact-checker, atau research agent.

Alasannya:

- Sangat relevan dengan paid callable AI agents
- Natural untuk A2A composability
- Bisa dipakai oleh agent lain, bukan hanya manusia
- Membantu marketplace CROO menjadi lebih aman
- Mudah dijelaskan ke juri
- Bisa dibuat MVP dalam waktu hackathon

## Hackathon Fit

Target utama:

- Data & Verification Agents

Target tambahan:

- Developer Tooling Agents
- Open - Any A2A Agents

Judging criteria yang ditargetkan:

- Technical Execution: Agent callable, scoring engine, dashboard, Base contract
- A2A Composability: Buyer agent calls AgentBond, AgentBond calls checker agents
- Innovation: Trust layer untuk agent commerce
- Usability & Real Adoption: Bisa dipakai sebelum membayar seller agent
- Presentation: Demo jelas dengan risk report dan on-chain proof

## Planned MVP

MVP yang direncanakan:

- AgentBond main agent
- Minimal 2 specialist checker agents
- Demo seller agents
- Web dashboard
- Trust score calculation
- Risk report output
- Paid callable CROO/CAP service
- Base report hash registry
- README dan demo video

## Specialist Agents

Planned checker agents:

- Output Quality Checker Agent
- Pricing Benchmark Agent
- Reputation / Sybil Checker Agent
- Optional: Task Fit Checker Agent

## Trust Score Formula

Formula MVP:

```text
Trust Score =
40% output_quality_score +
30% reputation_score +
20% pricing_score +
10% task_fit_score
```

Risk level:

```text
0-39   = High Risk
40-69  = Medium Risk
70-100 = Low Risk
```

## Example Output

```text
Trust Score: 82/100
Risk Level: Low
Recommended Max Price: 3 USDC
Recommendation: Hire, but do not overpay.
```

## Demo Seller Agents

Planned demo agents:

- GoodResearchBot
- CheapSpamBot
- OverpricedBot
- NewUnknownBot

## Base / Web3 Role

AI logic berjalan off-chain.

Base dipakai sebagai proof layer:

- Menyimpan hash dari risk report
- Menampilkan transaction hash di UI
- Membuktikan report tidak dimanipulasi setelah dibuat

Smart contract planned:

```solidity
contract AgentBondReportRegistry {
    event ReportRegistered(
        address indexed requester,
        bytes32 indexed reportHash,
        string sellerAgentId,
        uint256 trustScore,
        string riskLevel,
        uint256 timestamp
    );

    function registerReport(
        bytes32 reportHash,
        string calldata sellerAgentId,
        uint256 trustScore,
        string calldata riskLevel
    ) external;
}
```

## CROO / CAP Role

CROO/CAP dipakai untuk:

- Menjadikan AgentBond sebagai paid callable agent
- Menerima payment/order dari buyer agent
- Menampilkan AgentBond di CROO Agent Store
- Membuktikan A2A paid commerce flow

Hal yang masih perlu dicek dari docs CROO/CAP:

- Cara list agent ke CROO Agent Store
- Cara membuat callable service
- Cara membaca order ID
- Cara USDC settlement bekerja
- SDK atau API yang tersedia

## A2A Flow

Planned flow:

```text
User / Buyer Agent
  -> wants to hire Seller Agent
  -> calls AgentBond via CROO/CAP
  -> AgentBond calls checker agents
  -> checker agents return scores
  -> AgentBond calculates trust score
  -> AgentBond returns recommendation
  -> report hash registered on Base
  -> Buyer Agent decides whether to pay Seller Agent
```

## Important URLs

CROO hackathon detail:

```text
https://dorahacks.io/hackathon/croo-hackathon/detail
```

DoraHacks BUIDL page:

```text
https://dorahacks.io/hackathon/croo-hackathon/buidl
```

CROO X:

```text
https://x.com/CROONetwork
```

## Notes From Research

- CROO hackathon focuses on paid callable AI agents.
- Strong emphasis on A2A composability.
- Submission requires GitHub/Gitlab/Bitbucket link and demo video.
- Prize pool observed: 10,200 USD.
- Deadline observed: 2026/07/12 09:00.
- DoraHacks BUIDL list showed inconsistent public fetch result: page tab showed BUIDLs, fetched content showed no BUIDLs.

## Existing Plan File

Full detailed plan already created at:

```text
/mnt/c/Users/matsg/planhackathon.md
```

## Next Steps

1. Review `planhackathon.md`.
2. Run the prepared Grill Me AI Hero prompt to stress-test AgentBond.
3. Refine scope based on critique.
4. Find and read CROO/CAP SDK documentation.
5. Start implementation with Next.js frontend, backend scoring API, demo seller agents, and Base smart contract.
6. Deploy `AgentBondReportRegistry` to Base Sepolia.
7. Integrate wallet connection and report hash registration.
8. Integrate CROO/CAP as paid callable service.
9. Generate demo orders and collect order IDs / tx hashes.
10. Record demo video and prepare DoraHacks submission.
