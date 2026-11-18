---
inclusion: always
---

# Repository structure and conventions

## Layout

```
spectrescan-kiroween/
├── index.html                  # the entire product (HTML + CSS + engine)
├── README.md                   # pitch, features, Kiro usage summary, run/deploy
├── LICENSE                     # MIT (public, detectable on GitHub)
├── .nojekyll                   # serve assets as-is on GitHub Pages
├── .kiro/
│   ├── steering/               # persistent agent context (this directory)
│   ├── specs/
│   │   ├── spectre-scan/       # core product: requirements, design, tasks
│   │   └── haunted-mode/       # Kiroween skin: requirements, design, tasks
│   └── hooks/                  # event-driven checks (JSON, schema v1)
├── scripts/
│   ├── check-app.js            # syntax + CSP + single-file invariants
│   └── verify-repo.js          # submission gate (artifacts, hooks, docs)
├── docs/
│   ├── KIRO_USAGE.md           # how Kiro was used, capability by capability
│   ├── KIRO_SESSION_GUIDE.md   # reproducible prompts to drive Kiro end to end
│   ├── DEMO_SCRIPT.md          # <3 min video script and shot list
│   ├── DEPLOYMENT.md           # GitHub Pages setup and verification
│   ├── SUBMISSION_CHECKLIST.md # Devpost fields (incl. video/repo/deploy)
│   └── DATA_SOURCES.md         # endpoints, CORS, limits, privacy
├── .github/workflows/pages.yml # static deploy on push to main
└── .gitignore                  # node_modules, OS cruft; NEVER .kiro
```

## Where changes belong

- Product behaviour, markup, styles, scoring: `index.html` only.
- Engineering standards: `.kiro/steering/`.
- Planned behaviour: update the matching spec (requirements → design → tasks) **before** editing
  code; tick tasks as they land.
- New checks: `scripts/` plus a hook in `.kiro/hooks/` if the check should run automatically.
- Submission process: `docs/`.

## Code conventions inside index.html

- Plain ES2020+ classic script. Two-space indentation in JS; compact one-line CSS rules grouped by
  section comments.
- Naming: `UPPER_SNAKE` for constants, `camelCase` for functions/variables, `$id()` for lookups,
  `esc()` for any remote string inserted into HTML, `icon('name')` for inline SVG.
- State: one `S` object plus `settings`; persist through `Store` with keys from `LS`.
- No comments that restate the code. Keep the rare comment for a non-obvious invariant (e.g. the
  Solana `accounts` response shape).
- Do not reorder the SVG `<symbol>` sprite or rename existing icons; `icon()` references them.

## Git conventions

- Commit in small, coherent units with imperative subjects: `feat(feed): add Bitcoin block items`,
  `fix(solana): read accountKeys from accounts encoding`, `docs(kiro): document hook triggers`.
- Never commit secrets, API keys or personal data. `.kiro/` and `LICENSE` must stay tracked.
- Tag the submission: `v1.0-kiroween`.

## Documentation rules

- README is the judge-facing surface: demo URL, what it does, how it was built with Kiro.
- `docs/KIRO_USAGE.md` must reference real paths and triggers in this repo; do not invent logs.
- Keep image assets out of the app. README images are optional and must not be required for the
  app to run.
