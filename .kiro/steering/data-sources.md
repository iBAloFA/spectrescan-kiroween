---
inclusion: fileMatch
fileMatchPattern: "index.html"
---

# Data sources and network contract

The app is only as good as its evidence. Treat every endpoint as untrusted, slow and rate-limited.

## Endpoint map

| Source | Endpoint(s) | Used for | Timeout |
| --- | --- | --- | --- |
| PublicNode EVM RPC | `https://<chain>-rpc.publicnode.com` | `eth_getBalance`, `eth_getCode`, `eth_getStorageAt`, `eth_call`, `eth_blockNumber`, `eth_getBlockByNumber` | 10–14 s |
| GoPlus EVM | `https://api.gopluslabs.io/api/v1/token_security/{chainId}` | token flags, holders, LP lock, taxes | 11 s |
| GoPlus Solana | GoPlus Solana token endpoints | mint/freeze authority, transfer fees | 11 s |
| DexScreener | `https://api.dexscreener.com/latest/dex/tokens/{address}` | pairs, liquidity, volume, price | 10 s |
| Etherscan V2 | `https://api.etherscan.io/v2/api` | sampled wallet txs (optional key) | 12 s |
| Solana RPC | `https://solana-rpc.publicnode.com` | slot, account info, blocks, token supply | 10–20 s |
| Blockstream Esplora | `https://blockstream.info/api` | address stats, txs, tip height, blocks | 10–18 s |
| mempool.space | `https://mempool.space/api` | fallback for Esplora routes | 10–18 s |

Exact call sites live in `gatherContext`, `gatherSolanaContext`, `gatherBitcoinContext` and the feed
functions in `index.html`. Keep `docs/DATA_SOURCES.md` as the human-readable mirror.

## Hard rules

1. **CORS or it does not ship.** Verify `Access-Control-Allow-Origin` from a browser, not curl.
2. **Timeout everything.** Use the shared JSON helper with an explicit timeout; abort on expiry.
3. **Partial success is a feature.** Return what answered, list what did not, lower confidence.
   Never fabricate a missing value.
4. **No secrets.** Only the optional Etherscan key is user-supplied; it stays in `localStorage` and
   is sent only to Etherscan.
5. **Chain-aware parsing.** Do not assume EVM shapes for Solana or Bitcoin. Solana `getBlock` with
   `transactionDetails: 'accounts'` returns `accountKeys` on `transaction`, while `json` nests it
   under `transaction.message` — handle both.
6. **Rate-limit hygiene.** One scan fans out to at most a handful of calls; feeds poll on a cadence
   (EVM 7–11 s, Solana 14 s, Bitcoin 30 s) and only sample a few blocks per tick. Do not add
   unbounded loop calls or per-address polling.
7. **BigInt for money.** Use `BigInt`/`formatUnits` for wei, lamports and sats; never float math on
   raw balances. USD estimates use DexScreener prices and are labelled approximate.
8. **Bitcoin fallback order.** Try Blockstream first, then mempool.space, stop at the first success;
   record which base answered.

## Source labels in the UI

Every report lists sources with status and latency. When a source is skipped, render the reason
(e.g. "no contract", "no key", "not applicable on Bitcoin"). The confidence model in
`computeConfidence()` weights RPC, GoPlus, DexScreener and explorer evidence; do not silently
change the weights without updating the Help panel and the spec.

## Legal/ethical

Read-only public data only. No scraping behind auth, no deanonymisation claims, no sanctions
assertions. Always show the "heuristic signals, not financial advice" disclaimer.
