# How Kiro was used to build SpectreScan

This document maps every Kiro capability in this repository to the artifact that implements it and to
the product decision it actually produced. It is written to be auditable: every claim points at a file
you can open, and every hook runs a command you can run yourself.

## Summary

| Capability | Artifact | What it did in this build |
| --- | --- | --- |
| Spec-driven development | `.kiro/specs/spectre-scan/`, `.kiro/specs/haunted-mode/` | Fixed the 18-network scope, evidence model, scoring caps, failure behaviour and Haunted mode contract before implementation |
| Steering | `.kiro/steering/` (7 files) | Kept the CSP, endpoint map, palette and single-file rule in context on every edit; the gates assert the same rules |
| Agent hooks | `.kiro/hooks/validate-app.json`, `csp-review.json`, `repo-gate.json` | Compile-check on save, security re-audit on save, full submission gate on Stop |
| Custom agent | `.kiro/agents/onchain-guardian.md` | Narrow, read-mostly reviewer with the security steering preloaded |
| Verification loop | `scripts/check-app.js`, `scripts/verify-repo.js` | The same two commands behind the hooks, runnable by hand and in CI |

## Method

The work followed the loop Kiro is designed around:

1. **Write the requirement down** before touching `index.html`. Scope changes — adding Solana, adding
   Bitcoin, adding Haunted mode — each became a spec update first.
2. **Design against the constraints** in steering. The single-file and CSP rules eliminate whole
   classes of solutions before any code is written.
3. **Implement in small passes**, then run the gates.
4. **Record what shipped** in `tasks.md` so the next session starts from the plan, not from memory.

The heavy editing in this repository was done in an agentic editor session that consumed the same
artifacts. The hooks and CI run the same commands that were used to verify each pass
(`node scripts/check-app.js`, `node scripts/verify-repo.js`), so the result does not depend on which
agent typed the code. The Kiro session guide shows how to continue the work inside Kiro itself.

## 1. Spec-driven development

Two specs cover the product and the costume.

**`.kiro/specs/spectre-scan/`**

- `requirements.md` uses EARS phrasing ("When a user submits a target, the system shall…") across eight
  areas: intake and validation, evidence collection, scoring, report, live feed, security, accessibility
  and the Kiroween submission contract.
- `design.md` contains the ASCII architecture, the chain registry (16 EVM chains + Solana + Bitcoin),
  the adapter split (EVM / Solana / Bitcoin), the weighted scoring model, the render path, the feed
  scheduler, preferences, failure handling, testing and deployment.
- `tasks.md` is the build ledger. Sections 1–7 are checked off; follow-ups are deliberately left
  unticked.

What the spec actually changed:

- **Solana transaction shape.** The design records that `getBlock` with `transactionDetails: 'accounts'`
  returns `transaction.accountKeys` at the top level, while `'json'` nests keys under
  `transaction.message`. That detail is why the live feed ingests events instead of showing an empty
  list. The fix is in `index.html` (`ingestSolanaBlock`, the `tx.transaction.message || tx.transaction`
  guard).
- **Confidence is coverage, not vibes.** Requirement 3 states that confidence is the weighted share of
  expected sources that answered, and that missing sources are named. This is why a scan with two of
  three sources reports lower confidence rather than a confident-looking score.
- **Bitcoin is labelled sample-based.** Design §Bitcoin adapter caps the behaviour sample at 25
  transactions and requires the UI to say so, because there is no Bitcoin reputation source. The
  requirements forbid inventing one.

**`.kiro/specs/haunted-mode/`**

The Kiroween category is Costume Contest, so the costume needed its own spec rather than a CSS
afterthought. Requirements fix the toggle paths (top bar and Settings), persistence, `aria-pressed`,
reduced-motion behaviour, print behaviour, and the rule that risk colours never change. The design
maps the token remap, the fog layer and the keyframe, and lists the testing matrix. This is what kept
Haunted mode a skin rather than a second theme with divergent semantics.

## 2. Steering

Seven steering files, each with YAML front matter controlling when it loads:

| File | Inclusion | Purpose |
| --- | --- | --- |
| `product.md` | always | What SpectreScan is, who it is for, Kiroween positioning, non-goals, voice |
| `tech.md` | always | Single-file rule, the exact CSP string, data-source summary, perf budget, definition of done |
| `structure.md` | always | Repo layout, where a change belongs, code/git/doc conventions |
| `visual-identity.md` | fileMatch `index.html` | Palette tokens (including Haunted values), typography, layout, motion, accessibility |
| `data-sources.md` | fileMatch `index.html` | Endpoint map, timeouts, fallback order, CORS rule, rate-limit hygiene, BigInt money |
| `security-privacy.md` | always | CSP invariants, `esc()` before HTML insertion, no secrets, privacy, input validation |
| `kiroween-submission.md` | manual | The submission contract and the honesty guardrails |
| `testing.md` | manual | The gates, the live scan matrix, feed checks, deploy smoke test |

The always-on split is deliberate. `tech.md` and `security-privacy.md` are short and load on every
turn because violating either is a release blocker. The long reference material (`data-sources.md`,
`testing.md`) loads only when editing the app or when explicitly pulled in, which keeps the context
window focused.

Concrete examples of steering doing work:

- The CSP string in `tech.md` is copied verbatim into `scripts/check-app.js` as the expected value.
  A steering rule and a CI gate cannot drift apart.
- `data-sources.md` states "CORS or it does not ship" and lists the exact endpoints. The Bitcoin
  adapter's Blockstream → mempool.space fallback order comes from that file, not from improvisation.
- `visual-identity.md` defines Haunted mode as a token remap over the existing variables and forbids
  changing risk colours. The implementation is therefore ~40 lines of CSS plus a persisted boolean,
  not a fork of the stylesheet.
- `security-privacy.md` states that remote strings pass through `esc()` before HTML insertion. The
  custom agent and the save hook both check it.

## 3. Agent hooks

Hooks are JSON files under `.kiro/hooks/`. All three use schema `version: "v1"`.

**`validate-app.json` — PostFileSave**

- Matcher: `index\.html$`
- Action: command `node scripts/check-app.js`
- Timeout: 45 s

This compiles the inline script in a VM (compile only, never execute), verifies the CSP contains every
required directive, rejects external scripts/styles/fonts/iframes, and checks the single-file budget.
It catches the most common regression in this project: a syntax error or a stray CDN tag in a 300 KB
file that is otherwise easy to edit blind.

**`csp-review.json` — PostFileSave**

- Matcher: `index\.html$`
- Action: agent prompt

The agent re-reads the security and data-source steering, traces new remote values to the DOM, confirms
new endpoints are documented in both `data-sources.md` and `docs/DATA_SOURCES.md`, and confirms user
input is validated before it reaches a URL. It reports findings; it does not restyle the app.

**`repo-gate.json` — Stop**

- Action: command `node scripts/check-app.js && node scripts/verify-repo.js`
- Timeout: 120 s
- Confirmation prompt: "Run the Kiroween submission gate now?" with run/skip options

The Stop hook is the submission contract. `verify-repo.js` asserts that the required Kiro artifacts,
docs, license, `.nojekyll`, Pages workflow and hook shapes all exist, that `.kiro` is not gitignored,
that README links resolve, and that the app still carries the Kiroween badge. It is the difference
between "the demo worked once" and "the repository is submittable".

## 4. Custom agent

`.kiro/agents/onchain-guardian.md` defines a narrow reviewer:

- tools limited to `read` and `shell`
- shell permissions limited to `node scripts/*`, `git status`, `git diff*`, `ls *`
- security, tech and data-source steering preloaded as its contract

Select it from the agent picker in the chat pane when reviewing a change to `index.html`. Its job is
to run the gate, read the diff, and return a ship/fix verdict with file-level findings. Keeping the
tool surface small is the point: a reviewer that cannot rewrite the file is easier to trust.

## 5. What was not used, and why

Honesty is part of the submission contract in `.kiro/steering/kiroween-submission.md`. These
capabilities were not used in this build:

- **MCP servers.** The app talks to public HTTP APIs from the browser, not from the agent. An MCP
  server would add a moving part without changing the product.
- **Property-based testing.** The correctness surface is rendering and network failure handling; the
  gates cover syntax, CSP and artifact completeness. A PBT suite would be a good follow-up for the
  scoring functions (caps, band boundaries, monotonicity).
- **Powers.** No third-party power was installed. The two gates are project-local scripts so judges
  can run them without installing anything.
- **CLI, Web and Crew.** The work ran in the IDE/editor context. The repo is CLI-friendly (two Node
  scripts, no dependencies) but no cloud session or multi-agent crew was used.

Stating this plainly is better than claiming depth that the repository cannot demonstrate.

## 6. Where to look

| Question | File |
| --- | --- |
| What is the product supposed to do? | `.kiro/specs/spectre-scan/requirements.md` |
| How is it built? | `.kiro/specs/spectre-scan/design.md` |
| What is done? | `.kiro/specs/spectre-scan/tasks.md` |
| What are the rules? | `.kiro/steering/tech.md`, `security-privacy.md`, `data-sources.md` |
| What runs on save? | `.kiro/hooks/*.json` |
| How do I continue in Kiro? | `docs/KIRO_SESSION_GUIDE.md` |
| What does the submission require? | `docs/SUBMISSION_CHECKLIST.md` |
