# Kiro session guide

How to open this repository in Kiro and continue the work with the same specs, steering, hooks and
gates that produced it. Every step is reproducible from a clean clone.

## 0. Prerequisites

- Kiro installed ([kiro.dev/downloads](https://kiro.dev/downloads/)).
- Node.js 18+ on `PATH` (only for the two gate scripts; the app itself has no toolchain).
- A clone of this repository.

## 1. Open the workspace

1. In Kiro, **File → Open Folder** and choose the repository root (the folder containing `index.html`
   and `.kiro/`).
2. Accept the workspace trust prompt.
3. Open the integrated terminal and confirm the gates run:

```bash
node scripts/check-app.js
node scripts/verify-repo.js
```

Both should end in `OK`. `check-app.js` prints a pass/fail count and the app size; `verify-repo.js`
prints one line per artifact check.

4. Click the agent name in the chat input bar to open the agent picker. You should see
   **onchain-guardian** alongside the built-in agents. Select it when you want a security review;
   switch back to the default agent for feature work.

## 2. Read the specs first

Open the Specs view and select `spectre-scan`.

- `requirements.md` — the EARS requirements.
- `design.md` — architecture, chain registry, adapters, scoring, failure handling.
- `tasks.md` — the ledger. Ticked sections are shipped. The unticked follow-ups at the bottom are the
  backlog; pick from there rather than inventing scope.

For the Kiroween skin, open `haunted-mode` and read its three files the same way.

If the Specs view is not visible, open the files directly under `.kiro/specs/`. They are plain
Markdown and the agent reads them like any other file.

## 3. How the context loads

You do not need to paste the rules into chat. On each request Kiro loads:

- `product.md`, `tech.md`, `structure.md`, `security-privacy.md` — always.
- `visual-identity.md` and `data-sources.md` — when `index.html` is in play.
- `kiroween-submission.md` and `testing.md` — only when you reference them or open them.

To confirm what is loaded, open the steering panel and check each file's inclusion mode. If you add a
new steering file, set `inclusion: always` only if violating it should block every change; otherwise
prefer `fileMatch` with a pattern or `manual`.

## 4. Prompts that work in this repo

Feature work — point at the spec and the task:

```text
Implement the next unticked item in .kiro/specs/spectre-scan/tasks.md.
Read design.md and the data-sources steering first. Keep the single-file and CSP rules.
When done, run node scripts/check-app.js and report the summary line.
```

Adding a network:

```text
Add <CHAIN> to the EVM registry in index.html. Follow the chain registry table in
.kiro/specs/spectre-scan/design.md, use a public RPC that sends CORS headers, add it to
docs/DATA_SOURCES.md and .kiro/steering/data-sources.md, and update the network count in README.md.
Run the gates.
```

Changing scoring:

```text
Propose a scoring change for <target>. Update requirements.md and design.md first, show the
before/after weights and the band impact, then implement only if I approve.
```

Security review:

```text
Switch to onchain-guardian. Review the working tree diff for CSP, XSS and data-source regressions.
Run the gate and give me a ship/fix verdict with file:line findings.
```

Debugging a feed:

```text
The live feed for <chain> shows no events. Reproduce with the design's adapter notes, check the
response shape against data-sources.md, and fix the ingestion without loosening the CSP.
```

## 5. Working with hooks

The three hooks are committed, so they are active as soon as the workspace is trusted.

- **Save `index.html`** → `validate-app` runs `node scripts/check-app.js`. A failure appears in the
  hooks output with the failing check name.
- **Save `index.html`** → `csp-review` asks the agent to re-audit security and data sources.
- **Stop the agent** → `repo-gate` asks for confirmation, then runs both gates.

To add a hook yourself, open the Agent Hooks panel and choose **Ask Kiro to create a hook**, or create
a JSON file under `.kiro/hooks/` using the same shape as the existing three:

```json
{
  "version": "v1",
  "hooks": [
    {
      "name": "Example",
      "description": "What it enforces",
      "trigger": "PostFileSave",
      "matcher": "index\\.html$",
      "action": { "type": "command", "command": "node scripts/check-app.js" },
      "timeout": 45,
      "enabled": true
    }
  ]
}
```

Triggers are PascalCase (`PostFileSave`, `PostToolUse`, `Stop`, `UserPromptSubmit`). A command action
runs a shell command; an agent action runs a prompt with the workspace tools. Prefer command actions
for deterministic gates and agent actions for judgement calls.

If a hook blocks a save you believe is correct, fix the underlying check rather than disabling the
hook; `verify-repo.js` asserts the hook files are valid, so a malformed edit fails the Stop gate too.

## 6. The review agent

`.kiro/agents/onchain-guardian.md` is a project-local agent:

- it may read files and run `node scripts/*`, `git status`, `git diff*`, `ls *`
- it cannot write, so its output is a report, not an edit
- its prompt preloads the security, tech and data-source steering

Use it before committing any change that touches network code, HTML insertion or the CSP. For normal
feature work, the default agent has the same steering and is the better choice.

## 7. Verify like CI

The GitHub Actions workflow runs exactly these two commands before deploying:

```bash
node scripts/check-app.js
node scripts/verify-repo.js
```

If both pass locally, the deploy job will build. The workflow stages only `index.html`, `.nojekyll`
and `LICENSE` into `_site`, so anything the page needs at runtime must be inside `index.html`.

## 8. Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Save hook reports a syntax error | Inline script does not compile | Read the reported line in `index.html`; the VM compiles the same script the browser will |
| Save hook reports CSP failures | A directive was removed or an external asset added | Restore the CSP string from `tech.md`; remove the external reference |
| Stop gate fails on a README link | A doc was renamed | Fix the relative link in `README.md` or add the missing file |
| Agent ignores the house rules | Wrong agent or a steering file was set to `manual` | Switch to the default or onchain-guardian agent; check inclusion modes |
| Feed empty for one chain | Endpoint CORS or response shape changed | Compare with `data-sources.md`, test the endpoint in the browser network tab |
| App blank after an edit | Runtime error not caught by compile | Open DevTools console, check the first error, then re-run the gate |
