# Plan: Full live-data store managed via the Admin panel

## Goal
Turn SmartPhone Hub from a hardcoded/localStorage demo into a real store where
you add/edit/delete products, view orders, manage customers, and issue coupons
**from the Admin dashboard** — backed by a database (Lovable Cloud). No code
editing needed to change store data once this is in place.

## Current state (verified)
- Products are hardcoded in `src/lib/products.ts` (a TS array).
- Cart / wishlist / coupons / user live in browser `localStorage` (`src/lib/store.ts`).
- Admin route (`src/routes/admin.tsx`) is read-only demo data, labelled "Demo · read-only · v2 will wire real data".
- No database, no auth, no `@/integrations/supabase/*` files, no migrations yet.
- Prices are in Zambian Kwacha (ZMW) via `src/lib/currency.ts`.
- Stripe (Lovable-managed) was selected earlier but not yet wired.

## Step 1 — Enable Lovable Cloud
Enable Cloud to provision database + auth + the generated Supabase integration
files (`@/integrations/supabase/client`, `auth-middleware`, `auth-attacher`,
`types`, `client.server`). Register the auth token attacher in `src/start.ts`.
This is a prerequisite for every following step.

## Step 2 — Database schema (one migration, with GRANTs + RLS)
Create tables in the `public` schema, each followed by GRANT + ENABLE RLS + POLICY:

- `categories` (id, name, slug) — for catalog grouping (optional, used by products).
- `products` (id, slug, name, brand, price numeric, old_price numeric, ram int,
  storage int, os text, rating numeric, reviews int, stock int, tags text[],
  color text, image text, specs jsonb, description text, created_at)
- `coupons` (id, code, kind ['percent'|'shipping'], value numeric, active bool,
  created_at) — admin-issued promotional coupons
- `orders` (id, user_id uuid null, email text, status text, subtotal, discount,
  shipping, tax, total numeric, created_at) — guest + registered checkout
- `order_items` (id, order_id fk, product_id, name, price, qty)
- `profiles` (id uuid = auth.users.id, full_name, phone, created_at) — extends auth user
- `user_roles` (id, user_id uuid, role app_role['admin','user']) + `has_role()` security definer
- `reviews` (id, product_id fk, user_id, rating, body, created_at)
- `wishlist` (id, user_id, product_id)
- `login_logs` / `audit_logs` (id, user_id, event, meta jsonb, created_at) — security monitoring

RLS policies: public read on `products`, `categories`, `reviews`(approved);
owner read/write on `orders`, `order_items`, `profiles`, `wishlist`, `reviews`;
admin full access gated by `has_role(auth.uid(),'admin')`.

Seed: insert the existing 12 products from `src/lib/products.ts` as literal
INSERT rows in the same migration, plus a couple of demo coupons. Seed an admin
role row for your account (we'll create the account in Step 5).

## Step 3 — Data-access server functions (`src/lib/*.functions.ts`)
Client-safe `.functions.ts` files (never `src/server/`, never module-scope secrets):
- `products.functions.ts` — `listProducts`, `getProduct` (public read, publishable client)
- `admin.functions.ts` — `createProduct`/`updateProduct`/`deleteProduct`, coupon +
  order + customer list/management (`.middleware([requireSupabaseAuth])` + `has_role('admin')` check)
- `orders.functions.ts` — `placeOrder` (auth or guest), `getMyOrders`
- `reviews.functions.ts`, `wishlist.functions.ts` — owner-scoped

## Step 4 — Rewire the UI to live data
- Shop / product / home / related: fetch via `listProducts`/`getProduct` instead of importing the array.
- Cart stays client-side; checkout calls `placeOrder` → saves a real order.
- Account page: real orders + wishlist from DB.
- Admin dashboard: replace demo data with DB queries (products table editable,
  add/edit/delete buttons; orders list with status updates; customers; coupons).
- Keep ZMW formatting (`formatPrice`) for all money.

## Step 5 — Auth + roles
- Sign up / login / password reset via Supabase Auth (email/password; Google via Lovable broker optional).
- `user_roles` table + `has_role()` gates `/admin` (route under `_authenticated/`,
  server fn verifies admin role). Your account gets the `admin` role so you can manage the store.
- Replace the localStorage `user` in `store.ts` with real session.

## Step 6 — Stripe checkout (Lovable-managed)
Wire the existing Stripe selection: checkout creates a real order + Stripe payment intent;
admin order list reflects payment status. (Implementation detail deferred unless you want it now.)

## What you'll be able to do after this
- **Add products** from Admin → Products → "Add product" (name, price, specs, stock, image), no code.
- **Edit/delete** products, manage stock.
- **View real orders** and update their status; see customers.
- **Create/disable coupons** from Admin → Coupons.
- **Security monitoring** tab shows real login/audit logs.

## Notes
- Local `store.ts` (cart, in-session wishlist) is kept for guest UX; orders persist to DB.
- This is a large change; we'll build it in the steps above and verify each (build + preview) before moving on.
