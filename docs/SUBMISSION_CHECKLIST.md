# Kiroween 2026 submission checklist

Everything the Devpost form and the official rules require, in the order you will need it.
Submission window: **October 30 – December 4, 2026, 2:00 PM PT**. Do not submit at the last hour;
Pages deploys and YouTube processing both take time.

## Eligibility note — read first

The rules require the project to be created during the submission period. This app has lineage from
earlier work; the README discloses that lineage under **Lineage and the Kiroween rule**. Before
submitting, either:

- confirm with the organizers that the Kiroween Edition (specs, steering, hooks, Haunted mode,
  documentation and deployment built for this event) qualifies as the submitted project, or
- do not submit it.

Disclosure is not a substitute for eligibility. Keep the README section intact either way.

## 1. Repository

- [ ] Repository is **public** on GitHub (not GitLab or Bitbucket).
- [ ] `.kiro/` is committed at the repository root and **not** ignored.
- [ ] `LICENSE` (MIT) exists at the root and is detectable — GitHub shows "MIT license" in the About
      panel. If it does not, use **About → Edit → License** and select MIT.
- [ ] Repository description mentions Kiroween and the category.
- [ ] Default branch is `main` and contains the final state.
- [ ] No secrets, keys or personal data in the history.

Verify locally before pushing:

```bash
node scripts/check-app.js
node scripts/verify-repo.js
git status
```

## 2. Deployed app

- [ ] GitHub Pages is enabled with **Source: GitHub Actions**.
- [ ] `https://<user>.github.io/<repo>/` loads over HTTPS and shows the Kiroween badge.
- [ ] A scan works on the deployed URL (USDC on Ethereum, BONK on Solana, a Bitcoin address).
- [ ] The live feed produces events on at least one EVM chain.
- [ ] Haunted mode toggles and persists after reload.
- [ ] The URL works in a private window with no caches or extensions.

See [DEPLOYMENT.md](DEPLOYMENT.md) for the exact settings and troubleshooting.

## 3. Demo video

- [ ] **Public** YouTube video (unlisted does not meet "publicly available").
- [ ] **Under 3 minutes.** Target 2:45.
- [ ] Shows the app working on its target device (desktop browser) — not slides.
- [ ] No copyrighted music, no third-party trademarks, no logos you do not own.
- [ ] Narration explains what it is, what it does, and what Kiro contributed.
- [ ] Link is pasted into Devpost and plays in a logged-out browser.

Use [DEMO_SCRIPT.md](DEMO_SCRIPT.md) for the shot list, narration and pre-flight.

## 4. Text description

Paste-ready, about 190 words:

> SpectreScan is a zero-backend on-chain threat scanner. Paste an EVM address, a Solana mint or a
> Bitcoin address and get a transparent risk report built from live public data: honeypot behaviour,
> owner powers, liquidity, bytecode hazards, wallet reputation, Bitcoin address type and transaction
> behaviour. It covers 18 networks, needs no account, no API key and no server, and ships as a single
> HTML file with a strict Content-Security-Policy.
>
> Every finding carries a category, severity, points and the evidence behind it. Confidence is the
> weighted share of expected sources that answered, so missing data lowers confidence instead of
> producing a confident-looking score. Source status, latency and raw JSON are shown in the report.
>
> The Kiroween Edition adds Haunted mode, a pumpkin-and-ectoplasm skin that persists, respects reduced
> motion and never changes risk semantics.
>
> Built with Kiro: two spec-driven feature sets (the scanner and Haunted mode), seven steering files
> that encode the CSP, endpoint map and visual system, three hooks (compile check, security review,
> submission gate) and a narrow review agent. The repository includes the specs, hooks and gate
> scripts so the workflow can be audited and re-run.

## 5. "Built with Kiro" write-up

Devpost asks how Kiro was used. Answer with specifics, not adjectives:

- **Specs:** `.kiro/specs/spectre-scan` and `.kiro/specs/haunted-mode`; requirements in EARS, design
  with the chain registry and adapters, tasks as the ledger.
- **Steering:** seven files; always-on product/tech/structure/security, file-matched visual identity
  and data sources, manual submission and testing contracts.
- **Hooks:** `validate-app` (PostFileSave, compile + CSP gate), `csp-review` (PostFileSave, agent
  audit), `repo-gate` (Stop, confirmation + full submission gate).
- **Custom agent:** `onchain-guardian`, read-only reviewer with limited shell permissions.
- **Honesty:** MCP servers, property-based testing and Powers were not used; say so.

Point judges at [KIRO_USAGE.md](KIRO_USAGE.md) for the long version.

## 6. Devpost fields

| Field | What to enter | Status |
| --- | --- | --- |
| Project name | SpectreScan — Kiroween Edition | |
| Category | **Costume Contest** | |
| Tagline | On-chain threat intelligence with a Haunted mode | |
| GitHub URL | `https://github.com/<user>/<repo>` | placeholder |
| Live app URL | `https://<user>.github.io/<repo>/` | placeholder |
| Video URL | `https://youtu.be/<id>` | placeholder |
| Built with | Kiro IDE (specs, steering, hooks, custom agent) | |
| Try it out | Live URL | |

## 7. Bonus prizes (optional)

- **Best Demo** — the demo script is written for it; keep the pacing tight and show the receipts
  (source status, raw JSON), not just the score.
- **Social Blitz** — if you post, use the event hashtag and link the deployed app. Do not post
  screenshots containing third-party trademarks.

## 8. Final pass

- [ ] Re-run both gates on the exact commit you submit.
- [ ] Open the live URL from a phone and from a private desktop window.
- [ ] Confirm the video is public and under 3:00.
- [ ] Confirm the repository About panel shows the license, description and Pages link.
- [ ] Submit on Devpost, then reopen the submission and check every link.
- [ ] Keep the submission confirmation email.
