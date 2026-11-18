---
inclusion: always
---

# Security and privacy invariants

SpectreScan is a security product; its own posture must be boring and strict.

## Content Security Policy

The meta CSP is the first line of defence and must stay in `index.html` unchanged unless a spec
explicitly justifies it:

```
default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:;
connect-src https:; base-uri 'none'; form-action 'none'
```

- `'unsafe-inline'` is a deliberate trade-off for the single-file architecture. Do not add
  `'unsafe-eval'`, remote origins, `'unsafe-inline'` to `script-src` for external code, or data
  connections.
- No `<script src>`, `<link rel="stylesheet">`, `@import`, web fonts, iframes or workers.
- The favicon is a data URI; any new image must be inline SVG or data URI.

## XSS and DOM safety

- Any remote string rendered into HTML goes through `esc()` (or is created with
  `textContent`). This includes addresses, labels, token names, block/tx ids, pool names and error
  messages.
- Do not build URLs from unvalidated input. Explorer links are constructed from a validated address
  and a fixed base.
- `innerHTML` is allowed only with templates whose interpolations are escaped or numeric.

## Secrets

- No embedded keys, tokens or credentials. The optional Etherscan key is user-entered, stored in
  `localStorage`, never logged, never sent anywhere except `api.etherscan.io`.
- Never add a proxy or server component to hide a key; that breaks the client-only promise.

## Privacy

- No analytics, cookies, fingerprinting, beacons or third-party embeds.
- Network requests go only to the documented public data sources, triggered by explicit user action
  or the visible live feed.
- Watchlist, history and settings live in `localStorage` only; clearing local data removes them.

## Input handling

- Validate and normalise addresses before any network call:
  - EVM: 40 hex chars; verify EIP-55 when mixed case; reject zero address as target.
  - Solana: base58 length and alphabet; reject EVM/Bitcoin shapes with a helpful message.
  - Bitcoin: base58check or bech32/bech32m with checksum; reject testnet and txids.
- Cap input length (80), trim, and never interpolate raw input into HTML.
- Paste extraction must only pick recognised address shapes.

## Supply chain

- Zero runtime dependencies is a security control. Do not add npm packages "for convenience".
- Dev scripts must be dependency-free Node and must not execute the page's code (compile with
  `vm.Script`, never run it in a privileged context).

## Reporting

Security issues: open a private advisory on GitHub or contact the maintainer listed in the repo.
Do not include exploit details in public issues.
