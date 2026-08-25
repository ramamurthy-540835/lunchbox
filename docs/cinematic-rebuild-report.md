# LunchBox cinematic rebuild

## Phase 0 — removed interstitials and booking dead space

Built on `feature/cinematic-rebuild`.

- Removed the homepage lunch-story modal, backdrop, sound toggle, skip control, six-dot row, numbered captions, and cyan sparkle treatment.
- Routed the homepage order call-to-action directly to `/book`.
- Made meal-card additions direct and opened the order bag without an interstitial.
- Removed booking-path progress/status labels and the `Choose the days.` caption that rendered under the primary button.
- Removed emoji food artwork from the homepage and legacy booking entry screen, replacing it with CSS-only shapes.
- Reduced the legacy `/book` vertical dead-space margins.

### Phase 0 verification

- `npx tsc --noEmit` — passed.
- `git diff --check` — passed.
- Source scan for the removed story controls and booking emoji artwork in `app/page.tsx`, `app/book/`, and `components/book/` — no matches.

Phase 1 artwork has not started. No performance trace or art-component count is claimed yet.
