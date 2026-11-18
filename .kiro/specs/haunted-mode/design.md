# Design — Haunted mode

## Approach

The skin is a state on `<body>` (`haunted`) driven by one preference (`settings.haunted`). The default
theme is built on CSS custom properties, so the skin only needs to remap a handful of tokens and
override gradients that are hard-coded by component.

## Data flow

```
#hauntBtn click ─┐
                 ├─> settings.haunted = !settings.haunted
#setHaunt switch ┘        │
                          ├─> saveSettings() -> Store.set(LS.settings)
                          └─> applyPreferences()
                                   ├─ body.classList.toggle('haunted', …)
                                   ├─ #hauntBtn aria-pressed / title
                                   └─ toast()
init() -> applyPreferences() (restores saved state)
```

`loadSettings()` normalises `haunted` to a strict boolean so older saved settings cannot enable it
accidentally.

## Tokens

| Variable | Default | Haunted | Used by |
| --- | --- | --- | --- |
| `--violet` | `#8b5cf6` | `#f97316` | accents, links, focus, primary button base |
| `--violet-2` | `#a78bfa` | `#fdba74` | icons, brand gradient, hover text |
| `--cyan` | `#22d3ee` | `#a3e635` | secondary gradients, chart accents |
| `--pink` | `#ec4899` | `#f43f5e` | reserved accent |
| `--indigo` | `#6366f1` | `#7c3aed` | deep gradient stop |

Component overrides (all under `body.haunted`):

- background: aubergine-black base with orange and ectoplasm radial glows
- `.brand-title`, `.brand-mark`: pumpkin-to-ectoplasm gradients
- `.btn-primary` and hover: ember gradient with deep violet tail
- `.engine-pill`: pumpkin tint
- `.topbar`: darker aubergine glass
- `::selection`: warm ember highlight

Risk colours (`--ok`, `--warn`, `--bad`, `--crit`) are intentionally **not** remapped.

## Ambient layer

`body.haunted::after` is a fixed, full-viewport, pointer-events-none layer with two soft radial
glows animated by `fogDrift` (26 s alternate). `body.haunted.no-motion::after` disables the
animation. The layer sits at `z-index:0`; content (`.wrap`) is `z-index:1` and the top bar `z-index:80`,
so it can never intercept clicks or cover text.

## Toggle surfaces

1. Top bar ghost button `#hauntBtn` (`aria-pressed`, `title`, ghost icon from the shared sprite).
2. Settings → Live feed & motion → Haunted mode switch (`#setHaunt`), saved with the other settings.

Both paths converge on `applyPreferences()`, so there is a single source of truth.

## Accessibility

- The button is a real `<button>` with an accessible name; state is exposed via `aria-pressed`.
- The toast is announced through the existing live region wrapper.
- Contrast in Haunted mode was checked for body copy, muted labels and primary buttons against the
  aubergine background; the skin darkens rather than lightens surfaces.
- Reduced motion removes the only added animation.

## Print

Haunted mode is screen-only in effect: the print stylesheet already forces white surfaces and
hides backgrounds, and the fog layer is a fixed pseudo-element that is not printed.

## Testing

- Toggle via top bar and Settings, reload, confirm persistence.
- Reset preferences, confirm the skin turns off.
- Enable reduce motion while haunted, confirm fog drift stops.
- Verify USDC and Genesis reports keep the same scores and risk colours in both skins.
