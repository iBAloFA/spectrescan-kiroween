# Design — SpectreScan core

## Overview

SpectreScan is a single-document application with four layers:

1. **Intake** — parse and validate the target, choose the family.
2. **Evidence adapters** — fan out to public APIs and normalise into a common context object.
3. **Scoring engine** — turn findings into category scores, a total, a verdict and confidence.
4. **Cockpit UI** — report, live feed, watchlist, history, settings, help, haunted skin.

Everything runs in the browser. The only server is whatever static host delivers `index.html`.

## Architecture

```
                +---------------------------- index.html ----------------------------+
                |  <style> tokens, layout, components, haunted skin                 |
 targetInput -> |  parseAddress() -> scanTarget()                                  |
                |      |                                                            |
                |      +--> gatherContext()        (EVM: RPC/GoPlus/Dex/Etherscan) |
                |      +--> gatherSolanaContext()  (Solana RPC/GoPlus/Dex)          |
                |      +--> gatherBitcoinContext() (Esplora/mempool)                |
                |                    |                                              |
                |                    v                                              |
                |              buildReport() / buildBitcoinReport()                 |
                |                 - findings[] (id, severity, cat, points, evidence)|
                |                 - scoreCategories(TOKEN/WALLET/BTC_CATEGORIES)    |
                |                 - computeConfidence(sources, weights)             |
                |                 - verdictFor(score), buildRecommendations()       |
                |                    |                                              |
                |                    v                                              |
                |              renderReport() -> hero, KPIs, category bars,         |
                |                 findings, chain cards, sources, raw JSON          |
                |                                                                   |
                |  Feed: startFeed() -> seedFeed()/seedSolanaFeed()/seedBitcoinFeed |
                |        -> pollNewBlocks()/pollSolanaSlots()/pollBitcoinBlocks()   |
                |        -> ingest* -> renderFeed() + drawChart()                   |
                +-------------------------------------------------------------------+
```

No framework, no virtual DOM. Rendering is template strings with `esc()` plus targeted DOM updates
for the feed and charts. State lives in one `S` object; preferences in `settings`; both persisted via
the `Store` wrapper over `localStorage` with an in-memory fallback.

## Chain registry

`CHAINS` is the single source of truth. Each entry declares:

- `id`, `family` (`evm` | `solana` | `bitcoin`), display names, native symbol, decimals, colour
- connectivity (`rpc[]`, `api[]`), explorer base, expected block time, whale threshold
- optional intel keys (`goplus`, `dex`) where the provider supports that chain

`CHAIN_ORDER` controls the picker. `isSolanaChain()` / `isBitcoinChain()` gate every family branch in
intake, scanning, feed, chart labels and detail cards. Adding a new EVM chain should only require a
registry entry (plus verifying CORS and label coverage); adding a new family requires a new adapter
and a report builder.

## Intake

`parseAddress(raw)` returns a discriminated result:

- EVM: `{ ok, address, checksum, mixed }` after EIP-55 verification (keccak from a local
  implementation); zero address rejected as a target.
- Solana: `{ ok, address, checksum:false, mixed:false }` after base58 validation.
- Bitcoin: `{ ok, address, checksum, btc:{ type, scriptType, testnet } }` after base58check or
  bech32/bech32m verification, with pure-JS SHA-256 and polymod.
- Failures carry a `reason` plus hints such as `bitcoinAddress: true` so the UI can offer a switch.

`scanTarget()` re-checks the shape and can auto-switch family (`setChain(..., { silent:true })`)
before dispatching to the right context adapter. `updateInputState()` mirrors the same logic for the
inline hint without network calls.

## Evidence adapters

All adapters return a context object with a common envelope:

```js
{
  family, type: 'wallet' | 'token', kind,
  address, chainId, chainName, native, blockNumber,
  contract?, token?, wallet?, bitcoin?, bytecode?,
  sources: [{ name, status: 'ok'|'error'|'skipped', latency, note? }],
  raw: { ... } // per-source payloads for the evidence drawer
}
```

### EVM (`gatherContext`)

- RPC: balance, code, implementation slot (`0x3608…bbc`), owner slot (`0x8da5…`), block number.
- GoPlus token security when the target has code; wallet-flag data when it does not.
- DexScreener pairs for the most liquid market; derived price/liquidity/volume.
- Bytecode scan for `selfdestruct`, `delegatecall`, mint/pause/blacklist selectors, proxy markers.
- Optional Etherscan sample of up to 200 transactions for behaviour and failure rate.

### Solana (`gatherSolanaContext`)

- `getAccountInfo` for owner/size/executable, parsed mint info when available.
- `getTokenSupply` for supply.
- GoPlus Solana security (mint/freeze authority, transfer fee, holder stats).
- DexScreener `solana` pairs.
- Slot number as `blockNumber`; report and feed labels switch to **slot**.

### Bitcoin (`gatherBitcoinContext`)

- Esplora `/address/{a}` → funded/spent totals, tx count, UTXOs, first/last seen.
- `/address/{a}/txs` → 25-transaction behaviour sample: counterparties, fan-in/out, dust output,
  CoinJoin-like patterns, largest movements.
- `/blocks/tip/height` for context.
- `btcFetch()` tries Blockstream then mempool.space, records latency, surfaces a clear error if both
  fail.
- No GoPlus/DexScreener/Etherscan: those sources are pushed as `skipped` with reasons.

## Scoring

Findings are the atomic unit: `{ id, cat, severity, title, detail, points, evidence, action }`.
Category definitions cap the contribution:

- Token (EVM/Solana): contract 40, ownership 25, liquidity 20, market 15.
- Wallet (EVM): reputation 70, activity 15, behaviour 15.
- Bitcoin: exposure 40, behaviour 35, activity 25.

`scoreCategories()` sums points per category and clamps to the cap (raw sum is kept for
transparency). Total = sum of category scores. `verdictFor()` maps 85/65/40/20 to Critical / High /
Elevated / Guarded / Low. `computeConfidence()` weights only the sources expected for that target
family: percentage of applicable weight that returned `ok`, with missing sources listed.
`buildRecommendations()` derives ordered actions from finding actions plus a score-based floor.

## Report

`buildReport()` dispatches to `buildBitcoinReport()` for family `bitcoin`; both share the verdict,
category and confidence helpers. The report carries a chain-specific `wallet`/`token` summary,
sources sorted by status, raw payloads and an explorer URL.

`renderReport()` composes:

- Hero: animated score ring, verdict, headline, confidence, target, chain, block/slot, actions
  (explorer, watch, copy summary, JSON, print, rescan).
- KPI strip and category bars.
- Findings list with severity, detail and evidence.
- Detail tabs: EVM token/contract cards vs Bitcoin address/activity cards vs Solana cards.
- Recent activity sample and the evidence/source panel with raw JSON.

Rendering is idempotent; a new scan replaces the subtree. All remote strings are escaped.

## Live feed

Common shape: `S.feed` holds items, series, sparks, counters and a monotonic `seq` used to discard
stale async results.

- EVM: `eth_blockNumber` poll, sample the last few blocks, ingest native transfers over the whale
  threshold, failed txs and contract calls; chart tx count/fees.
- Solana: `getSlot` poll, sample recent slots with `transactionDetails:'accounts'`, detect large
  balance deltas and failed txs; read `accountKeys` from `transaction.message` **or** directly from
  `transaction` (accounts encoding); chart fees with slot labels.
- Bitcoin: `/blocks` for the last five blocks, sample the newest block's txs, emit large transfers
  (≥ 10 BTC) and unconditional block items without address actions; chart block size (vB).

Cadence: 7–11 s EVM, 14 s Solana, 30 s Bitcoin; hidden tabs slow to 15/60 s. `renderFeed()` handles
items with and without addresses, filters (all/whale/fail or all/whale/block) and empty states.

## Preferences and local data

`settings` (`rpcOverrides`, `etherscanKey`, `autoFeed`, `reduceMotion`, `haunted`) and the watchlist
and history arrays persist via `Store`. Reset restores defaults but keeps watchlist/history. The
optional Etherscan key is validated as alphanumeric and used only for Etherscan calls.

## Security model

- Strict CSP (see steering) forbids remote code, styles, fonts and images.
- No secrets in the page; the app can be forked and hosted by anyone.
- All rendering escapes remote data; URLs are built from validated addresses and fixed bases.
- Dev scripts only compile the inline script (`vm.Script`), they never execute it.

## Failure handling

- Source timeout → source marked `error`, finding/confidence adjusted, banner explains.
- All sources down → error banner with retry and the sample report option.
- Feed failure → status shows the error and the next poll retries; stale items are kept.
- Invalid target → inline hint, no network, scan button remains usable.

## Testing

Automated: `scripts/check-app.js` (syntax via `vm.Script`, CSP and single-file invariants),
`scripts/verify-repo.js` (Kiro/submission artifacts). Manual matrix in
`.kiro/steering/testing.md`, including live EVM/Solana/Bitcoin scans and feed checks.

## Deployment

Static. `.github/workflows/pages.yml` stages `index.html` and `.nojekyll` into `_site` and deploys
with GitHub Pages. The app has no environment configuration.

## Kiro mapping

| Artifact | Role |
| --- | --- |
| `specs/spectre-scan/*` | behaviour contract and implementation tasks |
| `specs/haunted-mode/*` | Kiroween skin contract |
| `steering/product.md` | why/what, category, non-goals |
| `steering/tech.md` | single-file, CSP, sources, budgets |
| `steering/structure.md` | layout, conventions, git rules |
| `steering/visual-identity.md` | palette, motion, accessibility, haunted rules |
| `steering/data-sources.md` | endpoint contract and parsing rules |
| `steering/security-privacy.md` | invariants and threat model |
| `hooks/validate-app.json` | runs `check-app.js` on every save of `index.html` |
| `hooks/csp-review.json` | agent review of the security contract after edits |
| `hooks/repo-gate.json` | Stop-time full submission gate |
