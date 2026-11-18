# Requirements — SpectreScan core

## Introduction

SpectreScan is a single-page, client-side threat scanner for crypto addresses across 16 EVM
networks, Solana and Bitcoin. This spec captures the behaviour that must survive refactors: address
intake, live evidence collection, transparent scoring, report presentation, the live network feed,
and the security/privacy envelope.

## Glossary

- **Target** — the address being scanned.
- **Family** — EVM, Solana or Bitcoin; determines parsing, RPC and report shape.
- **Evidence source** — a public API that contributes facts (RPC, GoPlus, DexScreener, explorer).
- **Confidence** — weighted share of expected evidence that answered for this target.
- **Report** — score, verdict, findings, category breakdown, wallet/token summary, sources, raw JSON.
- **Feed** — live sampled network activity (blocks/slots, large moves, failures).
- **Haunted mode** — optional Kiroween visual skin, specified separately.

## Requirement 1 — Address intake and validation

**User story:** As a visitor, I want to paste any supported address and be told immediately whether
it is valid and for which network, so I do not waste a scan on a typo or the wrong chain.

### Acceptance criteria

1. WHEN the input is a 40-hex EVM address, THE SYSTEM SHALL validate mixed-case EIP-55 checksums
   locally and reject invalid checksums with a corrective message.
2. WHEN the input is a base58 Solana address, THE SYSTEM SHALL validate length and alphabet and
   classify it as a wallet, mint or program candidate.
3. WHEN the input is a Bitcoin address, THE SYSTEM SHALL verify base58check (P2PKH/P2SH) or
   bech32/bech32m (P2WPKH/P2WSH/P2TR) checksums locally before any network call.
4. WHEN a Bitcoin testnet address is entered, THE SYSTEM SHALL reject it and state that only
   mainnet is supported.
5. WHEN a 64-hex transaction id is entered, THE SYSTEM SHALL explain that a receiving address is
   required.
6. WHEN an address is pasted or scanned while another network is selected, THE SYSTEM SHALL switch
   to the matching family automatically and inform the user.
7. WHEN input is invalid, THE SYSTEM SHALL show an inline, specific hint and SHALL NOT issue
   network requests.
8. THE SYSTEM SHALL trim input, cap length at 80 characters, and extract the first recognised
   address from pasted text.

## Requirement 2 — Evidence collection

**User story:** As an analyst, I want the scan to use live public data and tell me what is missing,
so the result is auditable and honest.

### Acceptance criteria

1. WHEN a scan starts, THE SYSTEM SHALL query the sources applicable to the target family, in
   parallel where independent, each with an explicit timeout.
2. WHEN a source fails or times out, THE SYSTEM SHALL continue with the remaining sources, record
   the failure reason, and lower confidence accordingly.
3. WHEN the target is a contract, THE SYSTEM SHALL read bytecode and selected storage slots to
   detect owner powers and proxy patterns.
4. WHEN the target is a token, THE SYSTEM SHALL query GoPlus and DexScreener and derive liquidity,
   holder concentration, tax, honeypot and mint/freeze signals where available.
5. WHEN the target is a Bitcoin address, THE SYSTEM SHALL read address stats, mempool stats and a
   transaction sample from Esplora, falling back to mempool.space once.
6. WHEN the target is a Solana address, THE SYSTEM SHALL use Solana RPC only (no `eth_*` calls) and
   handle both `message.accountKeys` and top-level `accountKeys` response shapes.
7. THE SYSTEM SHALL never fabricate a value for an unavailable source.

## Requirement 3 — Transparent scoring

**User story:** As a user, I want to see why an address is risky, not just a number, so I can judge
whether the warning applies to me.

### Acceptance criteria

1. WHEN evidence is complete, THE SYSTEM SHALL compute a 0–100 risk score as a weighted sum of
   category scores (contract, ownership, liquidity, market, reputation, activity/behaviour/exposure
   depending on family).
2. WHEN a family-specific cap applies (e.g. wallet vs token, Bitcoin), THE SYSTEM SHALL apply it
   and expose the cap in the methodology.
3. WHEN evidence is partial, THE SYSTEM SHALL compute confidence from the weighted share of
   expected sources that answered and display it with the source count.
4. WHEN signals cross thresholds, THE SYSTEM SHALL emit findings with id, severity, title, detail
   and evidence reference.
5. WHEN the score maps to a verdict band, THE SYSTEM SHALL use the fixed bands (85/65/40/20 for EVM
   and Bitcoin; family-specific labels for Solana) and keep band colours semantic.
6. THE SYSTEM SHALL show the category breakdown and the list of sources with status and latency.
7. THE SYSTEM SHALL attach the raw API responses to the report for export.

## Requirement 4 — Report experience

**User story:** As a user, I want to scan, read, keep and share a report quickly.

### Acceptance criteria

1. WHEN a scan completes, THE SYSTEM SHALL render score, verdict, headline, confidence, category
   bars, findings, KPI cards, chain-specific detail cards, recent activity, sources and raw JSON.
2. WHEN the target is Bitcoin, THE SYSTEM SHALL render address state, sampled activity and recent
   transactions instead of EVM contract cards.
3. WHEN the user requests export, THE SYSTEM SHALL provide JSON download, summary copy and print.
4. WHEN the user watches a target, THE SYSTEM SHALL persist it locally with chain and label and list
   it in the watchlist.
5. WHEN the user rescans or opens a deep link (`#scan=<chain>:<address>`), THE SYSTEM SHALL restore
   the correct chain and target.
6. WHEN a report is a sample, THE SYSTEM SHALL label it as sample data and block misleading actions.
7. THE SYSTEM SHALL keep the last 25 scans in local history with timestamps.

## Requirement 5 — Live feed

**User story:** As a user, I want to watch the network breathe while I read, so I can spot large
moves and failures in context.

### Acceptance criteria

1. WHEN the app is idle and auto-feed is on, THE SYSTEM SHALL seed recent blocks/slots for the
   selected chain and then poll on a cadence appropriate to the chain.
2. WHEN the tab is hidden, THE SYSTEM SHALL slow polling without stopping it entirely.
3. WHEN a sampled transaction exceeds the chain's whale threshold or fails, THE SYSTEM SHALL add an
   item with direction, amount/short signature and a timestamp.
4. WHEN the chain is Bitcoin, THE SYSTEM SHALL show new blocks (even without large transfers) as
   block items without address actions, and chart block size.
5. WHEN the chain is Solana, THE SYSTEM SHALL chart fees and label units as slots.
6. WHEN the user pauses, changes filter or changes chain, THE SYSTEM SHALL reflect that immediately
   and reset sampling safely.
7. WHEN reduced motion is enabled, THE SYSTEM SHALL stop non-essential animation.

## Requirement 6 — Security, privacy and resilience

### Acceptance criteria

1. THE SYSTEM SHALL ship and preserve the CSP documented in `.kiro/steering/security-privacy.md`.
2. THE SYSTEM SHALL make no network request before user action except the visible feed/probe.
3. THE SYSTEM SHALL store watchlist, history and settings only in `localStorage`.
4. THE SYSTEM SHALL send the optional Etherscan key only to Etherscan.
5. THE SYSTEM SHALL escape all remote strings before HTML insertion.
6. THE SYSTEM SHALL degrade gracefully when every source is unreachable and offer the sample report.
7. THE SYSTEM SHALL remain functional from a static host with no server component.

## Requirement 7 — Accessibility and responsiveness

### Acceptance criteria

1. THE SYSTEM SHALL provide a skip link, visible focus states, labelled icon buttons and live
   regions for progress and alerts.
2. THE SYSTEM SHALL support keyboard-only operation for scanner, tabs, feed controls and modals.
3. THE SYSTEM SHALL lay out in one column below 1080 px with no horizontal scroll at 375 px.
4. THE SYSTEM SHALL honour the reduce-motion preference.
5. THE SYSTEM SHALL not rely on colour alone for risk meaning.

## Requirement 8 — Kiroween edition

### Acceptance criteria

1. THE SYSTEM SHALL ship an optional Haunted mode (see `specs/haunted-mode`) without changing
   evidence, scoring or semantics.
2. THE SYSTEM SHALL identify itself as a Kiroween 2026 build in the footer and README.
3. THE SYSTEM SHALL keep `.kiro/` artifacts committed and referenced by documentation.
