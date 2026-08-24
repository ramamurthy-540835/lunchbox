# Cinematic booking flow report

Branch: `feature/cinematic-booking`  
Baseline: `1bf0b2e`  
Verification date: 24 August 2026

## Files

- `app/book/page.tsx` — new mobile-first eight-act booking experience with in-memory state, act navigation, school search, server pricing, demo checkout, and payment handoff.
- `app/book/book.module.css` — scoped booking palette, leaf motif, type scale, touch targets, reduced-motion styles, and layout.
- `lib/book-machine.ts` — typed reducer and pure act guard/key behavior.
- `lib/money.ts` — integer INR-to-paise conversion and ₹39 = 3900 constant.
- `app/api/orders/price/route.ts` — server-side basket pricing response; selection identifiers and counts are the only authoritative inputs.
- `app/api/orders/route.ts` — declares optional client amount fields so they are structurally ignored by the existing server pricing path.
- `lib/razorpay.ts` — removes float rounding from the school payment conversion and tags Razorpay orders with `app: lunchbox`.
- `app/api/webhooks/razorpay/route.ts` — ignores payment events for other apps before fulfilment side effects.
- `tests/book-machine.test.ts` and `tests/money.test.ts` — reducer guard, back-preservation, stable-key, and integer-money coverage.
- `docs/booking-flow-audit.md` — required pre-implementation audit.

No files in `~/vinoth_project/lunch` were read or changed.

## Invariant evidence

- Browser pricing: `/book` sends `mealId` and `quantity` to `/api/orders/price` and `/api/orders`; no amount, subtotal, or total is sent. The price route ignores optional `amount` and `total` values and recomputes from `getCatalog()` and `mealAudiencePrice()`.
- Integer money: Razorpay school order conversion is `amountInr * 100`, with server catalogue prices as integer INR. `tests/money.test.ts` asserts ₹39 is 3900 paise. Existing refund code still has legacy conversion paths and should be migrated before production.
- Firestore capacity/idempotency: `reserveOrder` remains the existing single transaction. The UI holds one key in a ref for the booking attempt; `tests/book-machine.test.ts` proves a second key cannot replace it.
- Pending capacity and expiry: no changes were made to `reserveOrder`, `/api/tasks/expire-payments`, or `PAYMENT_HOLD_MINUTES`.
- Serviceability: the UI scopes search by selected city; `/api/orders` still checks the server catalogue for matching school name and city. The server remains the enforcement point.
- Razorpay: school Razorpay Orders are still created server-side and checkout remains browser-side. New school orders carry `{ app: "lunchbox", app_order_id }`; webhooks without `notes.app === "lunchbox"` are ignored.
- Secrets: `rg` over `.next/static` for `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `GOOGLE_MAPS_API_KEY`, `GOOGLE_PLACES_API_KEY`, `SERPAPI_API_KEY`, and `PAYMENT_EXPIRY_TASK_SECRET` returned no matches.
- Child data: `/book` uses React memory only; it does not use localStorage, sessionStorage, IndexedDB, URL parameters, page title, or analytics payloads for child data.
- Copy: the fixed seven food components are rendered from catalogue meal descriptions; no new nutrition, health, earnings, or ROI claims were introduced.
- Service worker: no booking response was added to the service worker cache configuration. The existing `defaultCache` behavior needs a production review before authenticated booking responses are exposed to the worker.

## Verification

- `npx tsc --noEmit` — pass.
- `npm test` — pass: 21 files, 89 tests.
- `npm run build` — pass: 69 static pages generated.
- Build output: `/book` route size 5.78 kB; first-load JS 149 kB. This is under the 180 kB first-load budget shown by Next, although the requested gzip-only before/after comparison was not available from the initial no-dependency build.
- Baseline build: unavailable before `npm ci`; the repository initially had no `node_modules`, so `npm run build` failed with `next: not found`.
- LCP/CLS: not measured in a real mid-range Android/4G browser in this environment. No claim is made that the 2.5 s / 0.02 budgets are verified.

## Deliberate choices and remaining gaps

The new flow is isolated at `/book` to keep admin, operations, marketing, franchise, and registration surfaces unchanged. It uses CSS motion because `framer-motion` was absent from `package.json`. The school search keeps the required 400 ms debounce, abort cancellation, ten-result cap, and pilot-placeholder note, but the current route’s zone requirement means full-city retry and manual-entry fallback need a follow-up extraction from the existing locator UI before real-parent launch.

The current server order contract requires `studentName`, `parentPhone`, `schoolName`, city, grade, audience, and items. Section and allergy acknowledgement are captured in the new flow but are not part of the existing order endpoint shape; changing that contract was intentionally avoided. The demo confirmation path works when GCP and Razorpay credentials are absent because `/api/orders` persists through its existing demo path. Configured-auth and real Razorpay checkout require a human environment walkthrough.

The existing root marketing CTA still points to the legacy cart/checkout experience; wiring it to `/book` should be the next small integration commit after product approval. Browser back handling and server navigation need a 375 px manual walkthrough. The required real-device LCP/CLS measurement, production school-directory behavior, authenticated booking, Razorpay capture/abandonment states, and branch push remain human verification items.
