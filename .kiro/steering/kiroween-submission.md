---
inclusion: manual
---

# Kiroween 2026 submission contract

Use this file when preparing the submission, recording the demo or checking eligibility.
Reference it in chat as `#kiroween-submission`.

## Facts (as of 2026-11-18)

- Event: Kiroween 2026, Halloween-themed hackathon by Kiro (kiro.dev), hosted on Devpost.
- Submission window: **2026-10-30 → 2026-12-04 14:00 PT**. Only new projects started during the
  window are eligible; Kiroween 2025 projects are excluded.
- Category chosen: **Costume Contest** (haunting, polished UI) — the haunted-mode skin and spectral
  cockpit are the costume.
- Bonus prizes in reach: Best Demo (automatic), Social Blitz (`#KiroweenHackathon26`), Bonus Blog.
- Judging: potential impact, technological implementation (depth of Kiro use), design,
  innovation, presentation.

## Mandatory submission items

1. Public **GitHub** repo (not GitLab/Bitbucket), open-source license visible in the About section.
2. `/.kiro` at repo root, committed, **not** gitignored: specs, steering, hooks visible to judges.
3. Working app URL (GitHub Pages or equivalent), no login.
4. Text description: features, functionality, how it works.
5. Public **YouTube** demo, < 3 minutes, shows the app working end to end, no unlicensed music or
   third-party trademarks.
6. Write-up on Kiro usage covering (where applicable): IDE/CLI/Web/Crew, custom agents, hooks,
   spec-driven development, steering, MCP, property-based testing, Kiro powers. Be specific and
   honest about what was and was not used.

## Repo checklist

- [ ] `LICENSE` at root (MIT) and detected by GitHub
- [ ] `README.md` with demo URL, features, run instructions, Kiro summary
- [ ] `.kiro/specs/spectre-scan/{requirements,design,tasks}.md`
- [ ] `.kiro/specs/haunted-mode/{requirements,design,tasks}.md`
- [ ] `.kiro/steering/*.md` (product, tech, structure, visual identity, data sources, security)
- [ ] `.kiro/hooks/*.json` (validate app, repo gate, CSP review)
- [ ] `.github/workflows/pages.yml` and a green deploy
- [ ] `docs/KIRO_USAGE.md`, `docs/DEMO_SCRIPT.md`, `docs/SUBMISSION_CHECKLIST.md`
- [ ] `node scripts/check-app.js` and `node scripts/verify-repo.js` pass
- [ ] No secrets in history; `.gitignore` does not exclude `.kiro`

## Demo rules

- Record the **deployed** app, not localhost, so the URL bar is visible.
- Show: EVM scan → report → Solana scan → Bitcoin auto-switch → live feed → haunted mode.
- Keep narration about the problem and the evidence, not a feature list.
- 1440×900 or 1080p, browser zoom 100–110 %, cursor highlight on, system notifications off.
- Upload to YouTube as **Public**, title it with the project name and "Kiroween 2026".

## Honesty guardrails

- Only claim Kiro features that were actually used and that exist in this repo.
- If a capability was not used (e.g. MCP, PBT), say so and explain the trade-off; judges reward
  clarity over inflated claims.
- Do not submit code started before 2026-10-30. If an earlier prototype exists, treat this repo as
  the new build and be ready to explain what was rebuilt.
