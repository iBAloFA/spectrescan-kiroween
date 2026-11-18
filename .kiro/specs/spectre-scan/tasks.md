# Implementation Plan

All core tasks below are implemented in `index.html`. Tick a task only when the behaviour is
verifiable in the browser and `node scripts/check-app.js` passes.

## 1. Foundation

- [x] 1.1 Create the single-file shell with CSP, meta tags, data-URI favicon, skip link and SVG sprite.
      _Requirements: 6.1, 7.1_
- [x] 1.2 Implement the design tokens, card system, top bar, responsive grid and print stylesheet.
      _Requirements: 7.3_
- [x] 1.3 Add the storage wrapper (`Store`) with localStorage and in-memory fallback, plus settings,
      watchlist and history keys. _Requirements: 6.3, 4.4, 4.7_

## 2. Chain registry and intake

- [x] 2.1 Define `CHAINS`, `CHAIN_ORDER` and family helpers for 16 EVM chains, Solana and Bitcoin.
      _Requirements: 2.6, 8.2_
- [x] 2.2 Implement keccak-256 and EIP-55 checksum validation with mixed-case rejection.
      _Requirements: 1.1_
- [x] 2.3 Implement base58 and Solana address classification.
      _Requirements: 1.2_
- [x] 2.4 Implement pure-JS SHA-256, base58check and bech32/bech32m verification for P2PKH, P2SH,
      P2WPKH, P2WSH and P2TR; reject testnet. _Requirements: 1.3, 1.4_
- [x] 2.5 Detect txids and cross-family addresses and return corrective messages.
      _Requirements: 1.5, 1.6_
- [x] 2.6 Build the inline input hint state machine and paste extraction (first recognised address).
      _Requirements: 1.7, 1.8_
- [x] 2.7 Add quick chips (EVM, Solana, Bitcoin Genesis) and deep-link routing (`#scan=…`).
      _Requirements: 4.5_

## 3. Evidence pipeline

- [x] 3.1 Build the shared JSON fetch helper with timeout, abort and latency recording.
      _Requirements: 2.1, 2.7_
- [x] 3.2 Implement the EVM adapter: RPC state, ownership/implementation slots, GoPlus, DexScreener,
      optional Etherscan sample and bytecode selector scan. _Requirements: 2.3, 2.4_
- [x] 3.3 Implement the Solana adapter: account info, supply, GoPlus Solana, DexScreener, slot.
      _Requirements: 2.6_
- [x] 3.4 Implement the Bitcoin adapter: Esplora address stats, 25-tx sample, tip height and
      mempool.space fallback. _Requirements: 2.5_
- [x] 3.5 Record every source with status, latency and skip reason; never fabricate missing values.
      _Requirements: 2.2, 2.7_

## 4. Scoring and report

- [x] 4.1 Define token, wallet and Bitcoin category weights and verdict bands.
      _Requirements: 3.1, 3.5_
- [x] 4.2 Implement finding emission for contract, ownership, liquidity, market, reputation,
      behaviour and exposure signals. _Requirements: 3.4_
- [x] 4.3 Implement category scoring, confidence and recommendation generation.
      _Requirements: 3.2, 3.3, 3.5_
- [x] 4.4 Build the report hero, KPI strip, category bars and findings list.
      _Requirements: 4.1_
- [x] 4.5 Build EVM detail tabs (reputation, on-chain graph, bytecode) and Solana cards.
      _Requirements: 4.1_
- [x] 4.6 Build the Bitcoin detail cards (address state, sampled activity, recent transactions).
      _Requirements: 4.2_
- [x] 4.7 Add source/evidence panel with raw JSON, export, copy summary, print and rescan.
      _Requirements: 4.3, 3.7_
- [x] 4.8 Add watchlist, history, sample report and deep-link restoration.
      _Requirements: 4.4, 4.5, 4.6, 4.7_

## 5. Live feed

- [x] 5.1 Implement EVM seeding and polling with whale thresholds, failed txs, calls and block chart.
      _Requirements: 5.1, 5.3_
- [x] 5.2 Implement Solana slot polling and accounts-encoding parsing, with fee chart and slot labels.
      _Requirements: 5.5_
- [x] 5.3 Implement Bitcoin block backfill, block items, whale transfers and block-size chart.
      _Requirements: 5.4_
- [x] 5.4 Implement cadence, hidden-tab slowdown, pause, filters and stale-sequence protection.
      _Requirements: 5.2, 5.6_
- [x] 5.5 Handle feed items without addresses (Bitcoin blocks) without row actions.
      _Requirements: 5.4_
- [x] 5.6 Respect reduced motion in feed and charts. _Requirements: 5.7, 7.4_

## 6. Security, accessibility, docs

- [x] 6.1 Centralise escaping; audit every remote string insertion. _Requirements: 6.5_
- [x] 6.2 Keep CSP strict and remove all external asset dependencies. _Requirements: 6.1_
- [x] 6.3 Add keyboard navigation, focus states, labelled controls, live regions and mobile layout.
      _Requirements: 7.1, 7.2, 7.3_
- [x] 6.4 Write in-app Help for scoring, sources, limits, privacy and Bitcoin/Solana coverage.
      _Requirements: 3.6, 6.4_
- [x] 6.5 Add the sample report and all-source-failure degradation path. _Requirements: 6.6_

## 7. Kiro and Kiroween

- [x] 7.1 Write the product, tech, structure, visual, data-source, security and submission steering
      files. _Requirements: 8.3_
- [x] 7.2 Capture requirements, design and this task plan under `.kiro/specs/spectre-scan/`.
      _Requirements: 8.3_
- [x] 7.3 Add the Haunted mode spec and implement the skin, toggle, persistence and reduced-motion
      behaviour. _Requirements: 8.1_
- [x] 7.4 Add hooks that compile-check the app on save and run the full gate on Stop.
      _Requirements: 8.3_
- [x] 7.5 Add the GitHub Pages workflow, MIT license and submission docs.
      _Requirements: 8.2, 8.3_

## Follow-ups (outside this submission)

- [ ] Optional: extended-pubkey (xpub) derivation for Bitcoin cluster views.
- [ ] Optional: property-based tests once pure validators are extracted into a testable module.
- [ ] Optional: additional public reputation sources with CORS support.
