# Requirements — Haunted mode

## Introduction

A Kiroween 2026 visual skin that turns the spectral cockpit into a pumpkin-and-ectoplasm observatory
without altering any evidence, score or control. The costume must be removable, persistent and
accessible.

## Glossary

- **Haunted mode** — an optional body-level theme applied via `body.haunted`.
- **Default skin** — the existing violet/cyan spectral cockpit.
- **Reduce motion** — the existing accessibility preference that disables animation.

## Requirement 1 — Toggle

**User story:** As a visitor, I want to switch the Halloween look on and off, so I can enjoy the
theme without losing the default interface.

### Acceptance criteria

1. WHEN the user activates the ghost button in the top bar, THE SYSTEM SHALL toggle Haunted mode and
   update `aria-pressed` and the tooltip.
2. WHEN the user toggles the switch in Settings and saves, THE SYSTEM SHALL apply the same state.
3. WHEN Haunted mode changes, THE SYSTEM SHALL announce it with a short toast.

## Requirement 2 — Persistence

1. WHEN Haunted mode is enabled, THE SYSTEM SHALL persist it in `settings.haunted` via `Store`.
2. WHEN the page reloads, THE SYSTEM SHALL restore the saved state before first paint of the theme
   (class applied during init).
3. WHEN preferences are reset, Haunted mode SHALL return to off.

## Requirement 3 — Visual contract

1. THE SYSTEM SHALL implement Haunted mode with CSS variable overrides and a small set of
   component-specific gradient overrides; no images, extra stylesheets or DOM duplication.
2. THE SYSTEM SHALL keep risk colours semantic (green/amber/red) and all text readable.
3. THE SYSTEM SHALL add ambient fog only as a fixed, pointer-events-none layer behind content.

## Requirement 4 — Motion and accessibility

1. WHEN reduce motion is enabled, THE SYSTEM SHALL stop the fog drift.
2. THE SYSTEM SHALL NOT introduce flashing, strobing or timing-sensitive content.
3. THE SYSTEM SHALL keep focus rings, contrast and keyboard behaviour identical to the default skin.

## Requirement 5 — Documentation

1. THE SYSTEM SHALL identify the Kiroween edition in the footer and README.
2. THE SYSTEM SHALL document the skin in this spec and in
   `.kiro/steering/visual-identity.md`.
