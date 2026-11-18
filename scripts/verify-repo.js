#!/usr/bin/env node
'use strict';
/*
 * Submission gate: verifies the Kiro artifacts, docs and deployment wiring
 * required for Kiroween 2026. Dependency-free; safe to run in CI or on Stop.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const failures = [];
const passes = [];
const check = (ok, label, detail) => (ok ? passes : failures).push(detail ? `${label}: ${detail}` : label);
const exists = rel => fs.existsSync(path.join(root, rel));
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');

const required = [
  'index.html', 'README.md', 'LICENSE', '.nojekyll', '.gitignore',
  '.kiro/steering/product.md', '.kiro/steering/tech.md', '.kiro/steering/structure.md',
  '.kiro/steering/visual-identity.md', '.kiro/steering/data-sources.md',
  '.kiro/steering/security-privacy.md', '.kiro/steering/kiroween-submission.md',
  '.kiro/specs/spectre-scan/requirements.md', '.kiro/specs/spectre-scan/design.md',
  '.kiro/specs/spectre-scan/tasks.md',
  '.kiro/specs/haunted-mode/requirements.md', '.kiro/specs/haunted-mode/design.md',
  '.kiro/specs/haunted-mode/tasks.md',
  '.kiro/agents/onchain-guardian.md',
  'docs/KIRO_USAGE.md', 'docs/KIRO_SESSION_GUIDE.md', 'docs/DEMO_SCRIPT.md',
  'docs/DEPLOYMENT.md', 'docs/SUBMISSION_CHECKLIST.md', 'docs/DATA_SOURCES.md',
  'scripts/check-app.js', 'scripts/verify-repo.js',
  '.github/workflows/pages.yml'
];
for (const rel of required) check(exists(rel), 'file exists', rel);

const hooksDir = path.join(root, '.kiro/hooks');
const hookFiles = fs.existsSync(hooksDir) ? fs.readdirSync(hooksDir).filter(f => f.endsWith('.json')) : [];
check(hookFiles.length >= 2, 'hook count', `${hookFiles.length} hook files`);
let commandHooks = 0, agentHooks = 0;
for (const name of hookFiles) {
  try {
    const cfg = JSON.parse(fs.readFileSync(path.join(hooksDir, name), 'utf8'));
    check(cfg.version === 'v1', `${name} version`, String(cfg.version));
    check(Array.isArray(cfg.hooks) && cfg.hooks.length > 0, `${name} hooks array`);
    for (const h of cfg.hooks || []) {
      check(Boolean(h.name && h.trigger && h.action && h.action.type), `${name} hook shape`, h.name || '?');
      if (h.action && h.action.type === 'command') {
        commandHooks++;
        check(typeof h.action.command === 'string' && h.action.command.length > 0, `${name} command`, h.name);
      }
      if (h.action && h.action.type === 'agent') {
        agentHooks++;
        check(typeof h.action.prompt === 'string' && h.action.prompt.length > 20, `${name} agent prompt`, h.name);
      }
    }
  } catch (err) {
    check(false, `${name} parses`, err.message);
  }
}
check(commandHooks >= 1, 'at least one command hook');
check(agentHooks >= 1, 'at least one agent hook');

if (exists('.kiro/agents/onchain-guardian.md')) {
  const agent = read('.kiro/agents/onchain-guardian.md');
  check(/^---[\s\S]*?^name:\s*onchain-guardian/m.test(agent), 'agent name front matter');
  check(/^tools:\s*\[/m.test(agent), 'agent tools declared');
  check(/^permissions:/m.test(agent), 'agent permissions declared');
}

const gi = exists('.gitignore') ? read('.gitignore') : '';
const kiroIgnored = gi.split(/\r?\n/).some(line => /^\s*[^#!].*\.kiro/.test(line));
check(!kiroIgnored, '.kiro is not gitignored');

const license = exists('LICENSE') ? read('LICENSE') : '';
check(/MIT License/i.test(license), 'MIT license text');

const workflow = exists('.github/workflows/pages.yml') ? read('.github/workflows/pages.yml') : '';
check(/actions\/deploy-pages@/.test(workflow), 'Pages deploy action');
check(/upload-pages-artifact@/.test(workflow), 'Pages artifact upload');

const readme = exists('README.md') ? read('README.md') : '';
check(readme.length > 1200, 'README substantive', `${readme.length} chars`);
check(!/\bTODO\b/.test(readme), 'README has no TODO markers');
check(/Kiroween/i.test(readme), 'README references Kiroween');
check(/\.kiro\//.test(readme), 'README references .kiro');
check(/license|MIT/i.test(readme), 'README references the license');

const links = [...readme.matchAll(/\]\((?!https?:|#)([^)\s]+)\)/g)].map(m => m[1]);
for (const link of links) {
  if (/^mailto:/.test(link)) continue;
  check(exists(link), 'README link target', link);
}

const app = exists('index.html') ? fs.readFileSync(path.join(root, 'index.html'), 'utf8') : '';
check(/Kiroween 2026/.test(app), 'app shows Kiroween badge');

for (const p of passes) console.log('PASS  ' + p);
for (const f of failures) console.log('FAIL  ' + f);
console.log(`\n${failures.length ? 'FAILED' : 'OK'} — ${passes.length} checks passed, ${failures.length} failed`);
if (failures.length) process.exit(1);
