# Data sources

SpectreScan talks directly from your browser to public, CORS-enabled APIs. Nothing is proxied, and
no request requires a key except the optional Etherscan integration you enable yourself.

## Endpoints

| Provider | Base | Used for | Notes |
| --- | --- | --- | --- |
| PublicNode | `https://<network>-rpc.publicnode.com` and official chain RPCs | balances, code, storage, blocks, `eth_call` | EVM networks; each chain lists a primary plus fallbacks in `CHAINS` |
| PublicNode Solana | `https://solana-rpc.publicnode.com` | `getSlot`, `getAccountInfo`, `getTokenSupply`, `getBlock` | `getBlock` uses `transactionDetails: 'accounts'` for the feed |
| GoPlus Security | `https://api.gopluslabs.io/api/v1` | token security, holder data, honeypot/tax flags, wallet risk flags | Solana supported via GoPlus Solana endpoints |
| DexScreener | `https://api.dexscreener.com/latest/dex` | pairs, liquidity, volume, price | Most-liquid pair is used for estimates |
| Etherscan V2 | `https://api.etherscan.io/v2/api` | sampled wallet transactions | Only when a user-supplied key is stored locally |
| Blockstream Esplora | `https://blockstream.info/api` | address stats, txs, tip height, blocks | Primary Bitcoin source |
| mempool.space | `https://mempool.space/api` | same Esplora routes | Fallback only |

## Covered networks

Ethereum, Base, BNB Chain, Polygon, Arbitrum One, Optimism, Avalanche C-Chain, Linea, Scroll,
zkSync Era, Mantle, Celo, Gnosis, Polygon zkEVM, opBNB, Sonic, Solana, Bitcoin mainnet.

GoPlus/DexScreener coverage varies by network; when a provider does not support a chain the report
marks it as skipped and confidence reflects that.

## Timeouts and fallbacks

- Every request is wrapped in an explicit timeout (10–20 s) with `AbortController`.
- RPC lists are tried in order until one answers.
- Bitcoin tries Blockstream then mempool.space and records which base responded.
- A failed source becomes an `error` entry with a reason; the scan continues with the rest.

## Rate limits and etiquette

- Scans issue a bounded fan-out; nothing paginates indefinitely.
- The live feed samples a few blocks per cadence (EVM 7–11 s, Solana 14 s, Bitcoin 30 s) and slows
  to 15/60 s when the tab is hidden.
- No background polling starts before the page is idle; pauses are honoured immediately.
- Please do not fork and multiply the request volume; use your own RPC overrides in Settings if you
  need higher limits.

## Privacy

- No API keys are embedded. The optional Etherscan key is entered by the user, stored in
  `localStorage`, and sent only to Etherscan.
- No analytics, telemetry or third-party embeds. Requests are made only by scanning or by the
  visible live feed.
- Loaded addresses are sent to the providers above — that is inherent to the scan. They are not sent
  anywhere else.

## Known gaps

- No Bitcoin reputation/sanctions provider with CORS support; Bitcoin behaviour is a 25-tx sample.
- No xpub derivation (address-level only).
- No token/DeFi analysis on Bitcoin by design.
- Solana token metadata depends on GoPlus/DexScreener coverage.
