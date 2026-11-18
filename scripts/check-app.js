#!/usr/bin/env node
'use strict';
/*
 * Compile-checks the single inline script and enforces the SpectreScan
 * single-file / CSP contract. Run on every save of index.html (Kiro hook)
 * and in CI. No dependencies, never executes page code.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const file = path.join(root, 'index.html');
const failures = [];
const passes = [];
const check = (ok, label, detail) => (ok ? passes : failures).push(detail ? `${label}: ${detail}` : label);

if (!fs.existsSync(file)) {
  console.error('FAIL  index.html not found at repo root');
  process.exit(1);
}
const html = fs.readFileSync(file, 'utf8');
const kb = Math.round(Buffer.byteLength(html) / 1024);

const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
check(scripts.length === 1, 'single inline script', `found ${scripts.length} script blocks`);
check(!/<script[^>]+src\s*=/i.test(html), 'no external script tags');
if (scripts.length) {
  try {
    new vm.Script(scripts[0][1], { filename: 'index.html:inline.js' });
    check(true, 'inline script compiles');
  } catch (err) {
    check(false, 'inline script compiles', err.message);
  }
}

const cspMatch = html.match(/http-equiv=["']Content-Security-Policy["'][^>]*content=(["'])([\s\S]*?)\1/i);
const csp = cspMatch ? cspMatch[2] : '';
check(Boolean(csp), 'CSP meta present');
if (csp) {
  const required = ["default-src 'none'", "script-src 'unsafe-inline'", "style-src 'unsafe-inline'",
    'img-src data:', 'connect-src https:', "base-uri 'none'", "form-action 'none'"];
  for (const rule of required) check(csp.includes(rule), 'CSP rule', rule);
  check(!csp.includes("'unsafe-eval'"), 'CSP has no unsafe-eval');
}

check(!/<link[^>]+rel=["']stylesheet["']/i.test(html), 'no external stylesheets');
check(!/@import\s/i.test(html), 'no CSS @import');
check(!/url\(\s*["']?https?:/i.test(html), 'no remote CSS url() assets');
check(!/<(?:iframe|object|embed)\b/i.test(html), 'no embedded frames/objects');
check(!/https?:\/\/[^"'\s]+\.(?:js|css|woff2?|ttf|png|jpe?g|gif|webp)(?:[?"'\s]|$)/i.test(html),
  'no remote script/style/font/image files');

const head = html.slice(0, 4000);
check(/<title>[^<]{5,}<\/title>/i.test(head), 'document title');
check(/<meta\s+name=["']description["']/i.test(head), 'meta description');
check(/class=["']skip-link["']/i.test(html), 'skip link');
check(/id=["']hauntBtn["']/.test(html), 'haunted-mode toggle present');
check(/Kiroween 2026/.test(html), 'Kiroween edition badge');
check(/aria-pressed=/.test(html), 'aria-pressed state exposed');
check(/\bid=["']targetInput["']/.test(html), 'scanner input present');
check(/\bid=["']feedList["']/.test(html), 'live feed container present');
check(!/\b(?:TODO|FIXME|XXX)\b/.test(html), 'no TODO/FIXME markers');
check(kb < 400, 'size budget', `${kb} KB (limit 400 KB)`);

for (const p of passes) console.log('PASS  ' + p);
for (const f of failures) console.log('FAIL  ' + f);
console.log(`\n${failures.length ? 'FAILED' : 'OK'} — ${passes.length} checks passed, ${failures.length} failed (${kb} KB)`);
if (failures.length) process.exit(1);
