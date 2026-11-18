# SpectreScan — Kiroween Edition

**A zero-backend threat scanner that hunts the spectres hiding in on-chain data.**

Paste a wallet, token, contract, Solana mint or Bitcoin address and get a transparent risk report
built from live public data: honeypots, owner powers, liquidity, bytecode hazards, wallet reputation,
Bitcoin address type and transaction behaviour. One HTML file, 18 networks, no account, no API key
required, no server.

Built for **Kiroween 2026** in the **Costume Contest** category: a spectral cockpit with an optional
Haunted mode skin.

---

## Live demo

- **App:** deploy with the included GitHub Pages workflow (see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md))
  and add the URL to the Devpost submission.
- **Video:** [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md) contains the shot list and narration for the
  required sub-3-minute YouTube demo.

Run locally in one command:

```bash
python -m http.server 8080
# open http://127.0.0.1:8080/
```

Opening `index.html` directly also works in most browsers; a local HTTP server avoids `file://`
CORS quirks.

## What it does

- **Validates before it queries.** EIP-55 keccak checksums for EVM, base58 for Solana, base58check
  and bech32/bech32m for Bitcoin (P2PKH, P2SH, P2WPKH, P2WSH, P2TR), all computed in the page.
  Testnet Bitcoin and transaction ids are rejected with a specific explanation.
- **Auto-detects the chain family.** Paste a `bc1…` address while Ethereum is selected and SpectreScan
  switches to Bitcoin, carefully. The same works for Solana.
- **Collects live evidence.** PublicNode RPC, GoPlus Security, DexScreener, optional Etherscan,
  Solana RPC, and Blockstream Esplora (mempool.space fallback).
- **Scores transparently.** Findings carry category, severity, points and evidence. Categories are
  capped and summed; confidence is the weighted share of expected sources that answered. Missing
  sources are named, never invented.
- **Shows the receipts.** Source status and latency, raw JSON, one-click export, print-ready report.
- **Watches the network.** A per-chain live feed samples new blocks/slots for whale moves, failed
  transactions, contract calls, and Bitcoin block updates, with tx/fee/block-size charts.
- **Keeps your data local.** Watchlist, history and settings live in `localStorage`. No analytics,
  no cookies, no telemetry, no custodial anything.
- **Wears a costume.** Haunted mode remaps the spectral palette to pumpkin and ectoplasm, persists the
  preference, respects reduced motion, and never changes risk semantics.

## Supported networks (18)

| Family | Networks |
| --- | --- |
| EVM | Ethereum, BNB Chain, Polygon, Base, Arbitrum One, Optimism, Avalanche C-Chain, Linea, Scroll, zkSync Era, Mantle, Celo, Gnosis, Polygon zkEVM, opBNB, Sonic |
| Solana | Mainnet-beta (wallets, mints, programs) |
| Bitcoin | Mainnet addresses (P2PKH, P2SH, P2WPKH, P2WSH, P2TR) |

## How scoring works

| Target | Categories (max points) |
| --- | --- |
| EVM token / contract | Contract safety 40 · Ownership & control 25 · Liquidity & holders 20 · Market & taxes 15 |
| EVM wallet | Reputation flags 70 · Account activity 15 · Transaction behaviour 15 |
| Bitcoin address | Counterparty exposure 40 · Transaction behaviour 35 · Account activity 25 |

Verdict bands: **85+ Critical**, **65+ High**, **40+ Elevated**, **20+ Guarded**, below 20 **Low**.
Bitcoin behaviour is sample-based (25 transactions) and labelled as such; the app has no
Bitcoin-specific reputation or sanctions source. The in-app Help panel documents the caps per family.
Scores are heuristic signals, not financial advice.

## Security posture

- Strict CSP: `default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; connect-src https:; base-uri 'none'; form-action 'none'`.
- Zero runtime dependencies, no CDN, no remote fonts, no iframes, no analytics.
- All remote strings escaped before HTML insertion (`esc()`), addresses validated before URL building.
- Optional Etherscan key is user-supplied, stored locally, sent only to Etherscan.
- Validation scripts only compile the inline script; they never execute page code.

See [.kiro/steering/security-privacy.md](.kiro/steering/security-privacy.md) for the full invariant list.

## Built with Kiro

The repository is structured for Kiro's spec-driven workflow:

- **Specs** — [.kiro/specs/spectre-scan](.kiro/specs/spectre-scan/requirements.md) captures
  requirements in EARS form, the architecture, and a task plan; [.kiro/specs/haunted-mode](.kiro/specs/haunted-mode/requirements.md)
  specifies the Kiroween skin.
- **Steering** — product, technology, structure, visual identity, data sources, security and the
  submission contract live in [.kiro/steering](.kiro/steering/product.md).
- **Hooks** — a save hook compile-checks `index.html`, an agent hook re-audits the CSP and data
  sources after edits, and a Stop hook runs the full submission gate
  ([.kiro/hooks](.kiro/hooks/validate-app.json)).
- **Custom agent** — `onchain-guardian` is a read-only reviewer with a limited shell allowlist
  ([.kiro/agents](.kiro/agents/onchain-guardian.md)).
- **Gates** — `node scripts/check-app.js` and `node scripts/verify-repo.js` run locally, in hooks and
  in CI.

Read [docs/KIRO_USAGE.md](docs/KIRO_USAGE.md) for the capability-by-capability write-up and
[docs/KIRO_SESSION_GUIDE.md](docs/KIRO_SESSION_GUIDE.md) to reproduce the workflow in Kiro.

## Repository map

```
index.html                     the product (HTML + CSS + engine)
.kiro/steering/                persistent agent context
.kiro/specs/spectre-scan/      requirements, design, tasks
.kiro/specs/haunted-mode/      Kiroween skin spec
.kiro/hooks/                   save, review and Stop hooks
.kiro/agents/                  onchain-guardian review agent
scripts/check-app.js           syntax + CSP + single-file gate
scripts/verify-repo.js         submission artifact gate
docs/                          Kiro usage, demo script, deployment, checklist, sources
.github/workflows/pages.yml    static GitHub Pages deploy
```

## Local checks

```bash
node scripts/check-app.js
node scripts/verify-repo.js
```

Node 18+ is only needed for these scripts; the app itself has no toolchain.

## Lineage and the Kiroween rule

Kiroween requires projects created during the submission window (October 30 – December 4, 2026).
SpectreScan's scanner engine predates the event. The Kiroween Edition was built during the window on
top of it: the Solana and Bitcoin adapters, Haunted mode, both specs, all steering files, the hooks,
the review agent, the gate scripts, the documentation and the deployment workflow.

That lineage is disclosed rather than hidden. Whether it satisfies the "new project" rule is for the
organizers to decide; [docs/SUBMISSION_CHECKLIST.md](docs/SUBMISSION_CHECKLIST.md) treats that
confirmation as a prerequisite for submitting.

## License

[MIT](LICENSE) © 2026 SpectreScan contributors.

Built for Kiroween 2026. Informational only — not financial, legal or investment advice.
