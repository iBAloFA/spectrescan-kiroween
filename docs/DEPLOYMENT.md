# Deployment

The app is a single static file. Any static host works; the repo ships a GitHub Pages workflow that
verifies the submission gates before publishing.

## Option A — GitHub Pages (recommended)

1. Create a **public** repository on GitHub named `spectrescan-kiroween` (no README, no license from
   GitHub — this repo already has both).
2. Push this folder:
   ```bash
   git init -b main
   git add .
   git commit -m "feat: SpectreScan Kiroween edition"
   git remote add origin https://github.com/<your-username>/spectrescan-kiroween.git
   git push -u origin main
   ```
3. In the repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. The push triggers `.github/workflows/pages.yml`:
   - `verify` runs `node scripts/check-app.js` and `node scripts/verify-repo.js`
   - `deploy` stages `index.html`, `.nojekyll` and `LICENSE` into `_site` and publishes
5. Watch **Actions**; when the `deploy` job is green, the URL is
   `https://<your-username>.github.io/spectrescan-kiroween/`.

### Verify the deployment

- Open the URL in a private window.
- The URL bar should show the Pages host, not localhost (required for the demo video).
- Run USDC on Ethereum, BONK on Solana and the Bitcoin Genesis address; confirm 3/3 sources on the
  EVM and Solana scans and a live feed status.
- Check DevTools → Console for zero errors and DevTools → Network for no blocked requests.

### Troubleshooting

| Symptom | Fix |
| --- | --- |
| 404 on the Pages URL | Settings → Pages → Source must be **GitHub Actions**, then re-run the workflow |
| Actions can't deploy | Settings → Actions → General → Workflow permissions: allow read/write; Pages needs `pages: write` and `id-token: write` (already in the workflow) |
| Assets 404 | Do not move `index.html` into a subfolder; Pages serves the repo root artifact |
| Stale page | Hard refresh; Pages caches briefly |

## Option B — drag-and-drop static hosts

- **Netlify:** drag the repo folder (or just `index.html` + `.nojekyll`) onto app.netlify.com/drop.
- **Cloudflare Pages:** connect the repo, no build command, output directory `/`.
- **Vercel:** import the repo as a static project, framework preset "Other".

All three serve the file as-is; no environment variables are needed.

## Custom domain (optional)

Add a `CNAME` file containing the domain at the repo root and configure DNS with your host. The
workflow copies only `index.html`, `.nojekyll` and `LICENSE` — add `CNAME` to the staging step if you
use one.

## Submission

Put the live URL in the Devpost submission and in `docs/SUBMISSION_CHECKLIST.md`. The URL must work
without login and without extra setup for judges.
