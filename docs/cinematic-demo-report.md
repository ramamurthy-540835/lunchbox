# LunchBox cinematic demo report

## Result

`/book` is now the default three-beat demo. The former eight-act booking journey is preserved at `/book/full`; setting `NEXT_PUBLIC_BOOKING_MODE=full` makes `/book` render that flow as well. No deployment was performed for this demo change.

## Files touched

- `app/book/page.tsx` — demo mode, three beats, day selection, server pricing, reset, and mode switch.
- `app/book/demo.module.css` — demo-only camera, stage, timing, tokens, responsive layout, and reduced-motion rules.
- `app/book/full/page.tsx` and `app/book/full/book.module.css` — preserved the previous eight-act flow and kept its history URLs under `/book/full`.
- `components/book/art/leaf.tsx` — layered inline SVG banana leaf with midrib, veins, and split.
- `components/book/art/tiffin.tsx` — inline SVG steel body, lid, hinge, latch, highlights, and printed label.
- `components/book/art/food.tsx` — individual inline SVG food groups with separate tonal treatment and shadows.
- `lib/book/demo-config.ts` — deterministic pilot context sourced from the catalogue.
- `lib/book/timeline.ts` — pure timings, easing, sequence duration, skip timing, and reduced-motion helper.
- `app/api/orders/price/route.ts` — additive `dayCount` input; server selects catalogue meals and computes total.
- `tests/cinematic-demo.test.ts` — duration, reduced-motion, emoji, and hardcoded-money source scans.

## Invariants

The demo sends only `{ audience: "school", dayCount }` to the pricing endpoint. The server selects the first N catalogue meals and computes the response. The browser renders `totalInr` from that response; there is no demo price literal. The order/capacity transaction and idempotency behavior were not changed.

The demo contains no child data in browser storage, URLs, or analytics. The displayed identity comes only from `lib/book/demo-config.ts` and is explicitly labelled as a pilot placeholder. The source scan confirms no emoji characters or hardcoded money values under `components/book/`. No secret is introduced into client code.

## Verification

- `npx tsc --noEmit` — pass.
- `npm test` — pass: 22 files, 92 tests.
- `npm run build` — pass: 70 static pages.
- `/book` route: 4.18 kB, 153 kB first-load JS.
- `/book/full` route: 175 B route entry, 149 kB first-load JS.
- `DEMO_SEQUENCE_DURATION`: 6250 ms, under the 9000 ms limit.
- Reduced motion returns `transform: none` and reveals food without transform animation.

## Not measured here

No browser performance trace, frame-drop capture, 375 px manual presentation run, landscape run, or offline-device run was performed in this environment. The demo uses CSS/Web Animations-compatible transitions because `framer-motion` is not a dependency. Fonts remain system fallbacks in this isolated demo; a local Baloo 2/Karla asset decision should be made before a stage presentation. The demo was not deployed, per the prompt.
