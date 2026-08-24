# LunchBox booking-flow audit

Audit baseline: branch `feature/cinematic-booking`, commit `1bf0b2e`, 24 August 2026.

## Current parent journey

- `/` is owned by `app/page.tsx`. It loads `/api/catalog`, shows a marketing/menu page, stores a cart in React state, then writes `{ cart, city, schoolId, gradeBand, audience }` to `sessionStorage` and redirects to `/checkout`.
- `/checkout` is owned by `app/checkout/page.tsx`. It restores that session payload, loads `/api/catalog`, presents city/school/grade plus parent/student fields, optionally uses `ParentAuth` and `StudentProfiles`, then submits to `/api/orders`.
- `/api/catalog` (`app/api/catalog/route.ts`) calls `lib/catalog.ts`; with no GCP credentials it serves the fallback catalogue in `lib/meals.ts`.
- `/api/schools/search` (`app/api/schools/search/route.ts`) is the school-locator search route. The existing checkout does not use it; it uses the catalogue school list instead.
- `/api/orders` (`app/api/orders/route.ts`) validates serviceability, reads the server catalogue, creates/reserves the order, and creates a Razorpay order when configured.
- `/api/payments/verify` (`app/api/payments/verify/route.ts`) verifies the checkout signature, fetches Razorpay payment status, and confirms captured payment.
- `/api/webhooks/razorpay` (`app/api/webhooks/razorpay/route.ts`) accepts signed Razorpay events, including shared franchise/payment events.
- `/api/tasks/expire-payments` (`app/api/tasks/expire-payments/route.ts`) releases expired pending reservations. It must retain `PAYMENT_HOLD_MINUTES` semantics.

Other routes are admin, operations, marketing, franchise, registration, or offline routes and are outside the parent booking path.

## Money and transaction audit

Today the browser computes a display subtotal in `app/checkout/page.tsx:83-87` using `mealAudiencePrice`, and renders it at lines 247 and 256. The browser also sends identifiers/counts plus `audience`, but `/api/orders` ignores any client amount field because `IncomingOrder` has no amount field. The authoritative order total is computed at `app/api/orders/route.ts:114` in `serverTotal`, from catalogue-derived `unitPrice` at lines 91-95. It is stored at line 133. Thus the order amount is server-originated, but the browser currently displays and submits a client-derived price and the payment adapter converts INR to paise with floating arithmetic.

The Firestore order and capacity transaction is `lib/firestore.ts:57-148`, `reserveOrder`. It reads idempotency, kitchen, capacity, holiday, and free-meal documents in one transaction, then creates the order and capacity updates together. The idempotency key is the `Idempotency-Key` header, stored in `order_idempotency/{key}` at lines 65 and 142-145. Pending-payment meals increment `pending_meals` at lines 123-125; capture moves them to confirmed at lines 164-189. Expiry remains in `expirePendingPayments` at lines 192-227.

## What 1bf0b2e added

The commit removed audience-specific bypasses so every meal-card add opens the existing six-step `lunch-story` overlay. It did not change the booking journey, routing, data persistence, payment, or accessibility structure. The overlay is a decorative timed scene over a marketing grid; it does not orchestrate city, school, student, menu, days, safety, review, or payment. It therefore reads as a story interruption rather than a cinematic booking flow and still leaves the actual conversion as a dense form.

## Reuse and reshaping

- Reuse: `lib/meals.ts` catalogue types and fallback data, `lib/catalog.ts`, `lib/school-locator` search service and route, `ParentAuth`, Firebase client setup, Razorpay loader/checkout integration, and server order transaction.
- Reshape: `app/checkout/page.tsx` into an in-memory reducer-driven `/book` flow; school autocomplete should be extracted from the locator behavior rather than duplicated; existing global CSS should gain scoped booking tokens and act styles.
- Delete from the booking path: the `sessionStorage` checkout payload, browser subtotal, audience/free-meal controls, full home-page cart handoff, and the timed marketing `lunch-story` as the parent booking mechanism. The unrelated marketing/admin/registration routes remain untouched.

## Dependencies and baseline

`framer-motion` is not present in `package.json`. The implementation uses CSS transitions/Web Animations only and does not add the dependency.

`npm run build` could not produce a bundle baseline in the audit environment because `node_modules` was absent and the command failed with `sh: 1: next: not found`. Therefore a numeric production bundle baseline is unavailable until dependencies are installed; this is explicitly reported rather than invented.

## Required follow-up risks

The existing payment adapter (`lib/razorpay.ts:35-43`) sends `Math.round(amountInr * 100)` and notes only `{ app_order_id }`; it needs integer paise input and `{ app: 'lunchbox', app_order_id }`. The webhook currently has no `notes.app` filter for payment events. Existing Firestore confirmation/refund paths also convert stored INR with floating multiplication and need an integer-paise representation or exact integer conversion without changing endpoint shapes. The audit implementation must add tests for these invariants.
