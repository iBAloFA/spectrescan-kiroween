# Implementation Plan — Haunted mode

- [x] 1.1 Add `haunted` to `DEFAULT_SETTINGS`, normalise it in `loadSettings()` and apply it in
      `applyPreferences()`; sync the top-bar button state. _Requirements: 1.1, 2.1, 2.2_
- [x] 1.2 Add the ghost toggle `#hauntBtn` to the top bar and wire the click handler with a toast.
      _Requirements: 1.1, 1.3_
- [x] 1.3 Add the Settings switch `#setHaunt`, include it in the toggle group and persist it on save.
      _Requirements: 1.2, 2.1_
- [x] 1.4 Add the `body.haunted` token remap, component overrides and fog layer with a reduced-motion
      escape hatch. _Requirements: 3.1, 3.2, 3.3, 4.1_
- [x] 1.5 Verify contrast, focus rings, score colours and reload persistence in the browser.
      _Requirements: 3.2, 4.2, 4.3_
- [x] 1.6 Document the skin in the footer, README and visual identity steering.
      _Requirements: 5.1, 5.2_
