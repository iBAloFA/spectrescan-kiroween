---
inclusion: always
---

# Product: SpectreScan

## What it is

SpectreScan is a zero-backend, client-side threat scanner for crypto addresses. Paste a wallet,
token, contract or Bitcoin address and get a transparent risk report built from live public data:
honeypot behaviour, owner powers, liquidity, bytecode hazards, wallet reputation, Bitcoin address
type and transaction behaviour.

It runs as one HTML file. There is no server, no account, no API key requirement and no build step.

## Why it exists

Most token "scanners" are opaque: a number appears, the user is told to trust it. SpectreScan shows
the evidence pipeline (which source answered, how fast), the exact weighted signals behind the
score, the raw JSON, and the confidence penalty when a source is missing. It is a cockpit, not an
oracle.

## Audience

- Traders and DeFi users checking a token or wallet before interacting
- Security researchers doing fast first-pass triage
- Builders who want an embeddable, auditable scanner without running infrastructure
- Hackathon judges who want to see real data, not mocks

## Kiroween 2026 positioning

- Category: **Costume Contest** — the product is a haunted house for on-chain data: a spectral
  cockpit with a radar sweep, ghost brand mark, and an optional **Haunted mode** skin (pumpkin and
  ectoplasm accents) for the Halloween build.
- The "costume" is functional, not decorative: the same evidence, scoring and feed stay readable
  and accessible in both skins.
- Submission must show Kiro usage: `/kiro/specs`, `/kiro/steering`, `/kiro/hooks` are part of the
  repo and must never be gitignored.

## Differentiators

1. **One file, real data.** 18 networks (16 EVM + Solana + Bitcoin) queried directly from the
   browser against CORS-enabled public endpoints.
2. **Transparent scoring.** Categorised weights, explicit findings, confidence derived from source
   coverage; raw evidence attached to every report.
3. **Checksums verified locally.** EIP-55 keccak checksum for EVM, base58 for Solana, base58check
   and bech32/bech32m for Bitcoin — implemented in the page, no library.
4. **Live network pulse.** Per-chain cadence, whale detection, failed-transaction sampling, block
   size chart; Bitcoin blocks and Solana slots are first-class.
5. **Zero supply chain.** No npm runtime dependencies, no CDN, CSP locks the page to inline code and
   HTTPS connections.

## Non-goals

- Custody, trading, signing or transaction execution
- KYC, attribution databases or sanctions screening (no public CORS source is wired in)
- Guaranteed verdicts: scores are heuristic and labelled as such
- Server-side caching, accounts or multi-user state

## Voice

Precise, calm, technical. No hype, no "AI magic" claims. Say what the data shows and what is
missing. The Halloween theme lives in the visuals and copy flourishes, never in the evidence.

## Success signals

- A first-time visitor can scan the quick-chip USDC token and understand the score in under 30 s.
- Every number on screen is traceable to a named source or marked as unavailable.
- The page works from a static host with no console errors.
- A judge can read `.kiro/` and see requirements → design → tasks, steering constraints, and hooks
  that run real checks.
