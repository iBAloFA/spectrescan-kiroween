---
inclusion: fileMatch
fileMatchPattern: "index.html"
---

# Visual identity: the spectral cockpit

SpectreScan looks like an instrument panel left running in an abandoned observatory. Dense, calm,
dark, deliberate. The Halloween edition adds a second skin, not a second product.

## Palette

| Token | Default | Haunted mode |
| --- | --- | --- |
| `--violet` | `#8b5cf6` | `#f97316` |
| `--violet-2` | `#a78bfa` | `#fdba74` |
| `--cyan` | `#22d3ee` | `#a3e635` |
| `--indigo` | `#6366f1` | `#7c3aed` |
| background | navy-black `#060a12` | aubergine-black `#0b0714` |

Risk semantics are fixed and must not be themed away: green = low, amber = elevated, red = high.
Findings, severity chips and the score ring keep their meaning in both skins.

## Type

- Sans for UI, monospace for addresses, hashes, signatures and raw JSON.
- Uppercase micro-labels with letter-spacing for section eyebrows and KPI captions.
- Numeric KPIs use tabular alignment where possible; never animate digits when motion is reduced.

## Layout

- Two columns above 1080 px (main 1fr + 386 px rail), single column below.
- Cards: 16 px radius, 1 px hairline border, deep shadow, subtle gradient. No glassmorphism blur on
  text surfaces; the top bar alone may blur.
- The radar sweep and grid backdrop are ambient, masked, and must never reduce text contrast.

## Motion

- Transitions 160–240 ms with `cubic-bezier(.22,.61,.36,1)`.
- Respect `body.no-motion` (user preference) and `prefers-reduced-motion`.
- Haunted mode adds a slow fog drift (`fogDrift`, 26 s) that is disabled by `no-motion`.

## Haunted mode (Kiroween)

- Toggle: ghost icon button `#hauntBtn` in the top bar and a switch in Settings.
- Implementation: `body.haunted` overrides CSS variables and a handful of gradients; no DOM
  cloning, no separate stylesheet, no images.
- Persisted as `settings.haunted` in `localStorage` through the existing `Store`.
- `aria-pressed` on the button reflects state; the toast announces the change.
- The skin must never alter score colors or hide evidence.

## Accessibility

- Contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text and UI borders on the dark background.
- Visible focus rings everywhere (`:focus-visible`), skip link first in tab order.
- All icon-only buttons have `aria-label` and `title`.
- Live regions: scan progress, banners, feed status. Do not move focus unexpectedly.
- Charts have textual summaries; color is never the only carrier of meaning.

## Copy

- Short, declarative, technical. "Evidence, not verdicts" is the house line.
- Halloween flourishes are allowed in Haunted mode copy ("the spectres are awake") but never inside
  evidence, scores or legal disclaimers.
