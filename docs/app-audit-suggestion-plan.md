# Milkman App — Audit & Suggestion Plan

> **Audit date:** August 4, 2026
> **Scope:** Full app review — features, authentication, data flow, API security, UI behavior
> **Method (no code changed):** Static code review + `tsc --noEmit` + `next build` + running the production server (`next start`) and calling live APIs + read-only checks against the live MongoDB database.
> **Note:** This replaces/updates the older `docs/codebase-audit-flaws.md` (July 2, 2026) — several items there were already fixed (real JWT auth, real customer dashboard data, `pa` locale in schemas, vendor summary merging MilkEntry + PurchaseEntry, `getReferenceDate` using `Delivery`).

---

## ✅ Implementation Status (updated August 4, 2026)

The suggestion plan below has been **implemented**. Summary of what changed and how it was verified:

| # | Item | Status | How verified |
|---|------|--------|--------------|
| 1 | Customers can log in (PINs) | ✅ | `generate-pins.mjs` now loads `.env` (was `.env.local` only); ran it — 38 users got PINs (last 4 digits of phone). Live test: `9100000001`/`0001` → token |
| 2 | Customer pages scoped to logged-in user | ✅ | `history/billing/calendar/profile` pages now resolve the customer via `getCurrentUser` + `getCustomerByUserId` and pass the code |
| 3 | `/api/*` protected | ✅ | Middleware now covers `/api` (public: login/logout/health). Live tests: no-token → 401; customer on admin-only → 403; customer own calendar → 200, another's → 403 |
| 4 | Admin customer list shows real data | ✅ | `GET /api/customers` returns the enriched shape (name/phone/due/status/quantity) from `getCustomerListData()`; `_id` added to list items; user names normalized from `{en,hi,pa}` objects |
| 5 | Customer detail modal opens | ✅ | `setSelectedCustomer`/`setModalMode` re-enabled; detail modal loads via `fetchCustomer` thunk |
| 6 | Slice + thunk + type for every API feature | ✅ | New: `delivery`, `payment`, `purchase`, `milkEntry` slices/thunks/types (registered in `store/index.ts`); panels (`delivery-operations-panel`, `billing-management`, `purchase-management-panel`, `vendor-management-panel`) now dispatch thunks |
| 7 | Login page cleanup | ✅ | `debugger` + console.logs removed, credential pre-fill emptied, PIN strings localized (en/hi/pa) |
| 8 | Seed script fixed | ✅ | Admin phone → valid 10-digit `9876543210`, PIN hashes added for admin + customers; loads `.env` |
| 9 | Delivered days + add-ons in history | ✅ | `buildRecentDeliveries` joins `Delivery` docs (incl. `items` → addOnItems), guards legacy records; `/api/customers/[code]` returns current-month exceptions + `recentDeliveries` |
| 10 | Error/loading boundaries | ✅ | `error.tsx` + `loading.tsx` added for admin and customer route groups |
| 11 | Payments pagination | ✅ | `GET /api/payments` supports `limit` (default 100, max 500) + `from`/`to` date filters |
| 12 | Root page locale links | ✅ | Hardcoded `/en/...` links replaced with locale-relative hrefs |

**Validation:** `tsc --noEmit` ✅ (0 errors) · `next build` ✅ · runtime API tests ✅ (auth matrix above).

**Remaining data note (not a code bug):** 9 seeded MMK profiles in the live DB reference user accounts that no longer exist (users were deleted at some point), so those rows fall back to showing the customer code as the name until `npm run seed:demo` is re-run (the seed re-links `userId` and is now fully fixed). Older delivery records stored with the legacy `baseQuantity`/`quantityDelivered` schema are handled defensively in the code.

---

## 1. Bottom Line

The app **compiles and builds cleanly** (`tsc` ✅, `next build` ✅) and the **admin side works** (login ✅, dashboard ✅, deliveries marking API ✅). But there are **critical issues** that mean the product does not work as advertised for the **customer role**, the **admin customer list UI is broken**, and **all API endpoints are unauthenticated**.

| # | Severity | Issue | Feature affected |
|---|----------|-------|------------------|
| 1 | 🔴 Critical | Seeded **customers cannot log in** (no PIN hash in DB) | Customer login |
| 2 | 🔴 Critical | **Customer portal shows the wrong customer's data** (falls back to "default" customer instead of logged-in user) | Customer dashboard/history/billing/calendar/profile |
| 3 | 🔴 Critical | **Admin Customers list is broken** — raw profile fields rendered as if enriched (`name`, `phone`, `due`, `status` missing from `/api/customers`) | Admin → Customers |
| 4 | 🔴 Critical | **Clicking a customer opens an empty modal** — state setters commented out | Admin → Customer detail |
| 5 | 🔴 Critical | **All `/api/*` routes are unauthenticated** (middleware excludes `/api`); any customer's calendar/data can be fetched without a token | API security / privacy |
| 6 | 🟠 High | `debugger` statement + console.logs left in production login flow | Login page |
| 7 | 🟠 High | Login page **pre-fills credentials** (9876543210 / 1234) and has hardcoded English strings (not translated) | Login / i18n |
| 8 | 🟠 High | Seed script creates an **admin that can never log in** (11-digit phone `919876543210`, no PIN) — only the manual `hash-passwords`/`generate-pins` fixes made the current admin work | Onboarding/demo setup |
| 9 | 🟠 Medium | Customer "recent deliveries / add-ons" data is incomplete — delivered days and add-on items are never surfaced | Customer history & billing, admin detail modal |
| 10 | 🟠 Medium | `/` root page hardcodes `/en/...` links; no locale detection | Landing page |
| 11 | 🟠 Medium | No error/loading boundaries on server pages — a DB hiccup crashes the whole page | All pages |
| 12 | 🟡 Low | `GET /api/payments` returns all payments, no pagination | Billing API |
| 13 | 🟡 Low | Both `package-lock.json` and `pnpm-lock.yaml` present; `node_modules` absent — fresh clone cannot run without install | Setup |
| 14 | 🟡 Low | Dead/unused code: `customer-calendar-modal.tsx` (unused import commented out), `demo/milk_mobile 2.html`, `milk-components.png` | Cleanup |

---

## 2. Verified — What Works Properly

These were confirmed by running the app, not just reading code:

| Feature | How verified | Status |
|---------|--------------|--------|
| TypeScript compile | `npx tsc --noEmit` → exit 0, no errors | ✅ |
| Production build | `next build` → success, all routes emitted | ✅ |
| Server + DB health | `GET /api/health` → `{"ok":true,"db":"connected"}` | ✅ |
| Admin login | `POST /api/auth/login` with `9876543210`/`1234` → JWT, role `SUPER_ADMIN` | ✅ |
| Page route protection | Middleware redirects unauthenticated users on `/admin/*` & `/customer/*` | ✅ |
| Admin dashboard | Server-rendered KPI cards, route snapshot, attention list (uses enriched `data-service.ts`) | ✅ |
| Delivery marking API | `POST`/`DELETE /api/deliveries`, `PATCH /api/deliveries/[id]/status` logic is sound (upsert + exceptions sync) | ✅ |
| Payments/purchases/areas/products/vendors APIs | Routes exist and return data | ✅ |
| i18n coverage | en=523 keys, hi=530, pa=530 (12 empty keys in en.json) | ✅ (mostly) |
| `.env` security | `.env` is gitignored, not committed | ✅ |

---

## 3. Critical Issues (Evidence)

### 3.1 Customers cannot log in
- **Evidence:** Live DB check — the `SUPER_ADMIN` (`9876543210`) has a `pinHash`, but all seeded customer users (`9100000001`…) have **no `pinHash`**. Live API test: `POST /api/auth/login {phone:"9100000001", pin:"0001"}` → `{"error":"No PIN set for this account."}`
- **Cause:** `scripts/seed-demo.mjs` never sets `pinHash`. `scripts/generate-pins.mjs` exists but was never run for the customer set (or was run before they were seeded).
- **Impact:** Only the admin can use the app. The entire customer portal is unreachable.

### 3.2 Customer portal shows the wrong customer's data
- **Evidence:** `src/app/[locale]/(customer)/customer/history|billing|calendar|profile/page.tsx` call `getCustomerHistoryData()`, `getCustomerProfileData()`, `getCustomerCalendarData()` with **no customer code** — these fall back to `getDefaultCustomerCode()`, which returns the **first customer in the due-sorted list** (i.e., the highest-due customer), not the logged-in user. Only `customer/dashboard/page.tsx` correctly uses `getCustomerByUserId(user.id)`.
- **Impact:** Once any customer can log in, they would see another customer's bills, history, calendar, and address. Critical privacy/trust bug. The `/api/customers/[customerCode]/calendar` route also accepts any `customerCode` with no ownership check (see 3.5).

### 3.3 Admin Customers list is broken
- **Evidence:** Live API: `GET /api/customers` returns raw `CustomerProfile` docs — fields are `_id, userId, customerCode, addressLine1, addressLine2, areaCode, areaName, landmark, notes, deliveryInstruction, isActive` — **no `name`, `phone`, `due`, `status`, `quantity`**. But `src/components/customers/customer-list.tsx` renders `customer.name`, `customer.status`, `customer.due`, and `customer.areaName` directly from that payload.
- **Impact:** Customer names render blank, status badge shows "undefined", due amount shows ₹0. The list is effectively unusable.
- **Note:** The server-side `getCustomerListData()` in `src/lib/data-service.ts` DOES produce the enriched shape correctly — the mismatch is that the client list bypassed it in favor of the raw Redux-thunk fetch (`GetAllCustomer.tsx` → `fetchCustomers` → `GET /api/customers`).

### 3.4 Customer detail modal opens empty
- **Evidence:** `src/components/customers/customer-list.tsx`, `handleViewCustomer()`:
  ```tsx
  const handleViewCustomer = (customer, mode = 'view') => {
    // setSelectedCustomer(customer);   ← commented out
    // setModalMode(mode);              ← commented out
    setIsModalOpen(true);               // only this runs
  };
  ```
  `CustomerDetailModal` returns `null` when `customer` is `null`. Clicking any customer → blank modal, no detail, no edit, no schedule.
- **Impact:** Admin cannot view/edit/schedule any customer from the list.

### 3.5 All API endpoints are unauthenticated
- **Evidence:** `src/middleware.ts` matcher is `["/((?!api|_next/static|...).*)"]` — `/api` is excluded. Live test: `GET /api/customers/MMK001/calendar` returned a full month of another customer's calendar **with no token**. The same applies to `POST/PUT/DELETE` on customers, deliveries, payments, purchases.
- **Impact:** Anyone can read or modify any customer, delivery, payment, or purchase record. Combined with 3.2 this is a data-leak + data-integrity risk.

---

## 4. High / Medium Issues

### 4.1 Login page dev leftovers (High)
- `src/app/[locale]/(auth)/login/page.tsx` contains a bare **`debugger`** statement and `console.log("userlogin", result)`. The `debugger` halts the browser when DevTools is open and can throw in some bundlers; both should be removed.
- The form **pre-fills** `9876543210` / `1234`. Fine for demos, but shipping default credentials is a security smell — make the fields empty in production.

### 4.2 Login page hardcoded English (i18n)
- `"4-digit PIN"`, `"Enter your 4-digit PIN"`, `"Enter the 4-digit PIN provided by your milkman"`, and `aria-label`s are hardcoded English while the rest of the page uses `t()` — breaks the Hindi/Punjabi experience on the most important screen.

### 4.3 Seed data can't produce a working login (High)
- `scripts/seed-demo.mjs` upserts the admin with phone **`919876543210`** (12 chars) — the login route rejects any phone where `phone.length !== 10`, so a fresh seed yields an admin who can never log in. It also never sets PINs.
- The current working admin (`9876543210` / `1234`) only exists because of manual runs of `hash-passwords.mjs` + `generate-pins.mjs`. A fresh clone + seed → **no one can log in**.

### 4.4 Delivery/billing history is incomplete (Medium)
- `getCustomerDetailData()` builds `recentDeliveries` only from `DeliveryException` records (SKIPPED/PAUSED days). Delivered days come from the `Delivery` collection and never appear in the "Recent Delivery Log".
- `addOnItems` is always `[]` in the data-service layer — add-on products seeded into `delivery.items` are never surfaced, so "Recent billable add-ons" on the customer billing page is always empty.
- The admin customer detail modal fetches `/api/customers/[code]` which returns `exceptions` filtered to **from today onwards** (future only) — so "Active Pauses" will be empty and the schedule calendar logic (`getDayStatus`) is unreliable (always uses current month, matches by day-number prefix).

### 4.5 Landing page locale hardcoding (Medium)
- `src/app/page.tsx` (root `/`) hardcodes `/en/admin/dashboard`, `/en/customer/dashboard`, `/login`. A visitor landing on `/hi` or `/pa` still gets English links, and `/login` (no locale prefix) may not route as intended given `localePrefix: "always"`.

### 4.6 No error boundaries / empty-data guards (Medium)
- Most admin/customer pages are async server components that call `getBaseData()` (which queries 11 collections). If MongoDB is down or a collection is missing, the page throws with no fallback UI.

---

## 5. Suggested Fix Plan (no code applied — actions for the next session)

### Phase 0 — Immediate (must-do, ~half day)
1. **Make customers able to log in**
   - Run `npm run seed:demo` on a fresh DB, then `node scripts/generate-pins.mjs` to mint PINs for every user without one (it uses last-4-of-phone deterministically). Document the PIN list for the owner.
   - Or extend the seed script to set `pinHash` directly.
2. **Scope customer data to the logged-in user**
   - Thread the authenticated user's customer code into `getCustomerHistoryData` / `getCustomerProfileData` / `getCustomerCalendarData` / `getCustomerDetailData` on every customer page (the dashboard already shows the pattern via `getCustomerByUserId`).
   - Add an ownership check to `/api/customers/[customerCode]/calendar` (and `/quantity`).
3. **Protect the API layer**
   - Extend the middleware matcher to cover `/api` (except `/api/auth/login`, `/api/health`) and/or add a shared `requireAuth(role?)` helper used by every route handler.
4. **Fix the admin Customers list**
   - Make `GET /api/customers` return the enriched shape (reuse `getCustomerListData()`), or have `fetchCustomers` thunk call it — so `name`, `phone`, `due`, `status`, `quantity`, `areaName` are present.
   - Re-enable `setSelectedCustomer(customer)` / `setModalMode(mode)` in `handleViewCustomer` (and type the list items correctly).

### Phase 1 — High value (~1–2 days)
5. Remove `debugger`, stray `console.log`s, and default credential pre-fill from the login page; localize its remaining strings (`4-digit PIN`, etc.) in en/hi/pa.
6. Fix the seed script: admin phone must be a valid 10-digit number and seed should set PIN hashes so a fresh setup is immediately usable.
7. Surface delivered days + add-on items in `recentDeliveries` (join `Delivery` docs, map `items` into `addOnItems`), and fix the exceptions query used by the admin detail modal (current month, not future-only).
8. Add error boundaries / empty states for server pages (a small `error.tsx` + `loading.tsx` per route group).

### Phase 2 — Polish (~1 day)
9. Root `/` locale-aware redirect (e.g., `redirect('/en')` or `intl` routing) instead of hardcoded `/en/...` links.
10. Pagination/date filter for `GET /api/payments`.
11. Reconcile lockfiles (pick one package manager), delete dead files (`customer-calendar-modal.tsx` if truly unused, `demo/milk_mobile 2.html`, `milk-components.png`), and decide on `milkman-demo` vs parent-folder layout (repo root currently holds both the project files and the `milkman-demo` folder).
12. Write the updated FEATURES/README to match actual current behavior once fixed (README still describes the pre-JWT "NextAuth or custom auth" plan).

---

## 6. Feature-by-Feature Status Matrix

| Feature (from FEATURES.md) | Status | Notes |
|---|---|---|
| Admin login (mobile + PIN) | ✅ Works | `9876543210` / `1234` (DB state), flow is sound |
| Customer login | ❌ Broken | No PIN hashes seeded for customers |
| Admin dashboard (KPIs, quick actions, progress) | ✅ Works | Server-rendered |
| Customer management — list | ❌ Broken | Raw profile fields rendered; names/dues/status wrong |
| Customer management — view/edit/schedule modal | ❌ Broken | Modal opens empty (state commented out) |
| Customer create | ✅ API works | Form → POST /api/customers (enriched fields present) |
| Daily delivery marking (one-tap D/S/P, extra qty, bulk) | ✅ Works | Panel + API verified logically |
| Billing & payments (record payment, ledger, summary) | ✅ Works | API + server data OK |
| Vendor management | ✅ Works | CRUD + summary (MilkEntry + PurchaseEntry merged) |
| Purchases ledger | ✅ Works | Seed + API + UI wired |
| Products catalog | ✅ Works | |
| Areas management | ✅ Works | |
| Calendar (admin + customer) | ⚠️ Partial | Customer calendar = wrong-user bug (3.2); admin calendar OK |
| Reports / area insights | ⚠️ Partial | Server data OK; depends on correct delivery data |
| Customer dashboard | ✅ Works (server) | Uses logged-in user correctly — the only customer page that does |
| Customer history / billing / profile | ❌ Broken | Wrong-customer fallback (3.2) |
| Bilingual UI (en/hi/pa) | ⚠️ Partial | Messages ~complete; login page strings hardcoded English |
| Secure API access | ❌ Broken | All /api unauthenticated |

---

## 7. Appendix — How This Was Verified

- `npx tsc --noEmit` → 0 errors
- `npm ci && npm run build` → success (all pages/APIs emitted)
- `npx next start -p 3777` → live tests:
  - `GET /api/health` → `{"ok":true,"db":"connected"}`
  - `POST /api/auth/login` (admin `9876543210/1234`) → token ✅ ; (`…/3210`) → Invalid PIN ; (customer `9100000001/0001`) → "No PIN set" ❌
  - `GET /api/customers` → raw profile shape (missing name/phone/due/status) ❌
  - `GET /api/customers/MMK001/calendar` → data returned with no auth ❌
- Read-only DB inspection of `users` (PIN presence), collection counts, delivery/profile field shapes.
