# Demo video script (target 2:45, hard limit 3:00)

Upload to YouTube as **Public**. Title: `SpectreScan — Kiroween 2026 (Costume Contest)`.
No copyrighted music, no third-party logos, no notifications.

## Pre-flight (10 minutes before recording)

- Open the **deployed** URL (GitHub Pages), not localhost — the URL bar is part of the proof.
- Browser: 1440×900 (or 1920×1080), zoom 100–110 %, bookmarks bar hidden, one tab only.
- System notifications off; phone silenced; close Slack/Discord.
- Run one throwaway scan first so RPC/DNS is warm, then reload for a clean state.
- Confirm the live feed is running (`Live · block …`).
- Record at 1080p 30/60 fps with OBS; enable cursor highlight; test the mic level.
- Have this script on a second screen; do not read robotically.

## Shot list and narration

### 0:00–0:12 — Cold open

**Screen:** the app landing page, radar sweep, live status pill, block ticker.

**Narration:**
"Every day, people sign transactions against contracts nobody has read, and send funds to wallets
nobody has checked. The evidence is public — it is just scattered across a dozen APIs."

### 0:12–0:22 — What it is

**Screen:** scroll the scan card and badges (Live public data, No keys, Client-side).

**Narration:**
"This is SpectreScan: a client-side threat scanner for eighteen networks — sixteen EVM chains,
Solana and Bitcoin. One HTML file, no backend, no API key required."

### 0:22–0:52 — EVM scan and evidence

**Screen:** click the **USDC** quick chip on Ethereum → **Scan**. Let the progress steps run.

**Narration:**
"Paste a token. SpectreScan verifies the address locally, then fans out to public RPC, GoPlus and
DexScreener in parallel."

**Screen:** the report hero — score, verdict, confidence, source count.

**Narration:**
"Seven out of one hundred: low risk, high confidence, three of three sources answered. Every point is
a finding with a category and a weight — contract safety, ownership, liquidity, market."

**Screen:** hover the category bars, open the sources panel, click **Raw evidence**.

**Narration:**
"And the receipts: which source answered, how fast, and the raw JSON behind the score. Missing
sources are named, never invented."

### 0:52–1:12 — Contract depth

**Screen:** click **WETH** → Scan; scroll to the bytecode/detail tabs.

**Narration:**
"For contracts it goes deeper: bytecode selectors, owner powers, proxy slots, holder concentration.
No black box — the evidence drawer is one click away."

### 1:12–1:32 — Solana

**Screen:** network picker → **Solana**; click **BONK** → Scan.

**Narration:**
"Same cockpit, different chain. Solana uses its own RPC, GoPlus Solana and DexScreener. Note the
labels: slots, not blocks; fees, not gas."

### 1:32–1:52 — Bitcoin

**Screen:** network picker → **Bitcoin**; click **Genesis** → Scan. Scroll the address cards.

**Narration:**
"Bitcoin is a different animal. SpectreScan verifies base58check and bech32m checksums in the page,
reads lifetime stats from Esplora, and samples twenty-five transactions for behaviour — fan-in,
fan-out, dust, CoinJoin-like patterns. This is Satoshi's genesis address: fifty-seven Bitcoin,
eighty-three thousand UTXOs, zero risk signals."

### 1:52–2:08 — Live network pulse

**Screen:** scroll to the live feed; show items and the chart; change the filter.

**Narration:**
"While you read, the feed samples new blocks: failed transactions, contract calls, large transfers.
On Bitcoin it streams blocks and whale moves over ten BTC, with a block-size chart."

### 2:08–2:22 — Haunted mode

**Screen:** click the ghost icon in the top bar. Let the palette shift.

**Narration:**
"And because it is Kiroween, the cockpit wears a costume: Haunted mode. Pumpkin and ectoplasm, still
readable, still honest — the risk colours never change."

### 2:22–2:42 — Built with Kiro

**Screen:** cut to the Kiro IDE: `.kiro/specs/spectre-scan/` requirements/design/tasks, then
`.kiro/steering/`, then a hook JSON, then run `node scripts/check-app.js` in the terminal.

**Narration:**
"The build was spec-driven in Kiro: EARS requirements, a design, and a task plan. Steering files pin
the security contract, data sources and visual identity. Hooks compile-check the single file on every
save and run a submission gate before the agent stops."

### 2:42–2:50 — Close

**Screen:** back to the report, then the repository URL and license.

**Narration:**
"SpectreScan — evidence, not verdicts. Open source, MIT licensed, live on GitHub Pages. Built for
Kiroween 2026."

## Capture checklist

- [ ] URL bar visible on the first shot and after each scan
- [ ] Score, confidence and source count readable at 1080p
- [ ] No localhost, no dev tools covering the UI (except the deliberate Kiro terminal shot)
- [ ] Runtime ≤ 3:00 exactly; trim pauses, never speed up the UI to the point of unreadability
- [ ] Audio normalized, no clipping, no music
- [ ] YouTube visibility **Public**, not Unlisted
- [ ] Description includes the live URL, repo URL and "Built with Kiro for Kiroween 2026"

## If something fails live

- If a source times out, let the UI say so — it is part of the product's honesty — then rescan once.
- If a scan fails entirely, use **Load sample report** but state on camera that it is sample data;
  do not present it as live.
- Do not edit the recording to hide failures; a visible recovery is stronger than a fake perfect run.
