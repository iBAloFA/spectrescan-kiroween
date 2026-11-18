---
inclusion: manual
---

# Testing and verification playbook

Reference as `#testing`. Run before any commit that touches `index.html`.

## Automated gates

```bash
node scripts/check-app.js   # syntax, CSP, single-file invariants
node scripts/verify-repo.js # Kiro + submission artifacts
```

Both are dependency-free and run automatically via hooks on save and on Stop.

## Live scan matrix

Use the quick chips; they are chosen to exercise distinct code paths.

| Case | Input | Expectation |
| --- | --- | --- |
| EVM token | USDC `0xA0b8…eB48` on Ethereum | score near 0–10, 3/3 sources, GoPlus + DexScreener answered |
| EVM contract | WETH `0xC02a…6Cc2` | contract type, bytecode card visible |
| Solana token | BONK `DezXA…B263` | 3/3 sources, slot label, no EVM-specific cards |
| Bitcoin | Genesis `1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa` | P2PKH, lifetime stats, ~57 BTC, score 0 |
| Bitcoin bech32 | any `bc1q…` wallet | address type P2WPKH, sample stats |
| Auto-switch | paste a Solana/Bitcoin address while on Ethereum | network switches, toast explains |
| Invalid EVM | `0x123` | inline hint, scan blocked, no requests |
| Invalid base58 | `1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNb` | checksum error, not "invalid address" |
| Bitcoin testnet | `tb1q…` or version 0x6f | explicit testnet rejection |
| EVM address on Bitcoin | `0x…` | "switch to an EVM network" hint |

## Feed checks

- EVM: status becomes `Live · block …`, items appear within one cadence, pause/resume works,
  filters (all / whale / fail) behave.
- Solana: slot advances, failed-tx or whale items eventually appear; the empty state is acceptable
  but must read "Waiting for matching activity", not look broken.
- Bitcoin: five recent blocks backfilled, "New blocks" filter shows block items with no address
  row actions, whale ≥ 10 BTC when present, chart subtitle says "Block size".

## UI / accessibility

- Keyboard: tab to skip link → scan input → quick chips → scan; modals trap focus and close on Esc.
- Haunted mode: toggle from top bar and Settings, persists after reload, `aria-pressed` updates,
  reduced motion stops the fog drift, risk colours unchanged.
- 375 px width: no horizontal scroll; top bar wraps; results grid stacks.
- Print preview hides controls and shows the report.
- Zero console errors on load and after a scan.

## Deployment smoke test

After Pages deploy: open the public URL in a private window, run USDC + Genesis, confirm the feed
starts and the CSP still allows the documented endpoints. Test once on mobile Safari/Chrome.

## What not to do

- Do not test by editing remote API responses; if a source is down, the report must degrade on its
  own and say so.
- Do not hammer endpoints in a loop; the feeds are cadence-limited for a reason.
