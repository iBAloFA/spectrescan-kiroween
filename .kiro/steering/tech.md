---
inclusion: always
---

# Tech stack and constraints

## Runtime

- **One file:** `index.html` contains markup, CSS and the entire engine in a single inline
  `<script>`. Do not introduce a build step, bundler, framework or runtime dependency.
- **Browser-only:** modern evergreen browsers (Chrome/Edge 111+, Firefox 113+, Safari 16.4+).
  Uses `fetch`, `AbortController`, `BigInt`, `Intl`, CSS custom properties, `<dialog>`-style overlays
  implemented with divs.
- **No module imports.** The inline script is a single classic script; keep it that way so the page
  works from `file://` and any static host.

## Security contract (non-negotiable)

The document ships this CSP:

```
default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:;
connect-src https:; base-uri 'none'; form-action 'none'
```

Consequences:

- No external `<script src>`, stylesheets, fonts, iframes, workers or CDNs.
- Icons are inline `<symbol>`s; the favicon is a `data:` SVG.
- All network access is `fetch` over HTTPS to CORS-enabled public endpoints.
- Never add `innerHTML` with unescaped remote data; use `esc()` or DOM APIs.
- Never add analytics, telemetry, error reporting or third-party embeds.

## Data sources

| Family | Source | Purpose |
| --- | --- | --- |
| EVM | PublicNode JSON-RPC per chain | balances, code, storage, block feed |
| EVM | GoPlus Security API | token risk, honeypot flags, holder data |
| EVM | DexScreener API | pairs, liquidity, price, volume |
| EVM | Etherscan V2 (optional key) | sampled wallet transactions |
| Solana | PublicNode Solana RPC | slot, account info, block samples |
| Solana | GoPlus Solana endpoints | token risk |
| Solana | DexScreener | pairs and liquidity |
| Bitcoin | Blockstream Esplora, mempool.space fallback | address stats, txs, blocks |

Rules:

- Every endpoint must return `Access-Control-Allow-Origin`.
- Wrap every call in a timeout; surface missing sources in the report instead of failing silently.
- Do not add an endpoint that requires a secret embedded in the page. The optional Etherscan key is
  entered by the user and stored in `localStorage` only.
- Keep the source list in `docs/DATA_SOURCES.md` and in the Help panel in sync.

## Tooling (development only)

- Node 18+ is used **only** by `scripts/check-app.js` and `scripts/verify-repo.js`, which are run by
  Kiro hooks and CI. They must stay dependency-free.
- No package.json is required; do not add one unless a real build need appears.

## Performance budget

- `index.html` < 400 KB uncompressed (currently ~310 KB).
- First render without network < 300 ms on a mid-range laptop.
- Live feed: one poll per chain cadence (7–30 s), capped concurrency, hidden tab slowdown.

## Deployment

- Static hosting only. GitHub Pages workflow is in `.github/workflows/pages.yml`; it stages the
  single HTML file into `_site` plus `.nojekyll`.
- No environment variables, no secrets, no server runtime.

## Definition of done for code changes

1. `node scripts/check-app.js` passes.
2. `node scripts/verify-repo.js` passes.
3. The page loads with zero console errors and a live scan succeeds on at least one EVM chain,
   Solana and Bitcoin.
4. Any new user-visible string is escaped or static; any new endpoint is documented in
   `docs/DATA_SOURCES.md`.
