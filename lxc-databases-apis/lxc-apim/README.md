<h1 id="lxc-apim" align="center">🗂️ lxc-apim</h1>

<p align="center">
  <a href="https://lexvoraconsulting.com" target="_blank"><strong>lexvoraconsulting.com</strong></a>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/status-active-brightgreen" alt="Status">
    <img src="https://img.shields.io/badge/scope-API%20Management-4B5563" alt="Scope">
    <img src="https://img.shields.io/badge/Database-MySQL%20(shared)-4479A1" alt="MySQL">
    <img src="https://img.shields.io/badge/Code-active-brightgreen" alt="Code status">
</p>

---

API management workspace for Lexvora Consulting APIs & Databases.

This is **not** the API itself — [`lxc-api`](../lxc-api/) is the backend that
serves requests (weather today, future endpoints). `lxc-apim` is a separate
codebase, the management/showcase layer on top of it.

<table>
  <tr>
    <td align="center"><strong>Catalog</strong><br/>Lists and documents the APIs LXC builds</td>
    <td align="center"><strong>Admin</strong><br/>Owns API users, roles, tokens/JWT, access control</td>
    <td align="center"><strong>Showcase</strong><br/>Where operators see what APIs exist, who can call them, and usage</td>
  </tr>
</table>

## 🔗 Relationship to `lxc-api`

`lxc-api` and `lxc-apim` are separate services with **different code**, but
they **share one MySQL database** — the same Hostinger instance documented in
[`../lxc-api/DB_CONNECTION.md`](../lxc-api/DB_CONNECTION.md) — instead of each
getting its own database.

Table ownership is separated by prefix, not by database:

| Prefix | Owner | Holds |
|---|---|---|
| `api_*` | `lxc-api` | The API service's own tables |
| `apim_*` | `lxc-apim` | Users, roles, tokens/JWT, API catalog entries, audit/access data |

Schema and migrations for these prefixed tables live under
[`../lxc-databases/api-apimgmt-db`](../lxc-databases/api-apimgmt-db/) — but
only as `.sql` files. The scripts that run them (`scripts/migrate.mjs`,
`scripts/seed.mjs`, `scripts/seed-admin.mjs`) are app code, so they live here
in `lxc-apim`, not in the database workspace:

```bash
npm run db:migrate      # applies ../lxc-databases/api-apimgmt-db/migrations/*.sql
npm run db:seed         # applies .../seeds/*.sql (roles, products)
npm run db:seed:admin   # bcrypt-hashes a password and creates the default admin user
```

## 🖥️ UI theme

`lxc-apim` now follows the Lexvora Consulting brand language more closely:
dark navy, gold accents, cream surfaces, and a left-side menu on desktop.
The shared layout tokens live in `public/css/theme.css`, and the existing
header/nav markup is reused rather than inventing a second component system.

## 🛠️ Stack

Mirrors `lxc-api`'s Express/TypeScript setup — its own separate codebase, not
shared code:

`express` · `typescript` · `tsx` · `mysql2` · `jsonwebtoken` · `bcrypt` ·
`zod` · `cors` · `cookie-parser` · `ejs` · `swagger-ui-express`

**Node version note:** pinned to **24.18.0**, not `lxc-api`'s 20.x — the
locally pinned toolchain at `frameworks/node/` only has 24.18.0 installed,
and `bcrypt` compiles a native binary tied to the Node ABI it's built under.
Deploying this to Hostinger must use a matching Node 24.x runtime (Hostinger
supports 18/20/22/24.x), or `bcrypt` needs a rebuild against whichever
version actually runs it.

## ✅ Task Tracker

This is the live status for building `lxc-apim`, updated as work lands.

### Phase 0 — Scaffold ✅
- [x] `package.json`, `tsconfig.json`, `.env.example`, `.gitignore`, `.nvmrc`
- [x] Install dependencies
- [x] `src/app.ts` + `src/server.ts` skeleton — builds clean, `/v1/health` verified

### Phase 1 — Database (`lxc-databases/api-apimgmt-db`) ✅
- [x] `apim_*` schema migrations (products, users, roles, tokens, audit_log) —
      `.sql` only, `lxc-databases/api-apimgmt-db/migrations/0001`–`0005`
- [x] Seed data as plain `.sql` — `.../seeds/0001`–`0002` (roles, products)
- [x] `mysql2`-based migration/seed runner scripts, plus the bcrypt-hashing
      admin-user seed script — all live in **`lxc-apim/scripts/`** (app
      code), not in the database workspace: `npm run db:migrate`,
      `npm run db:seed`, `npm run db:seed:admin`

> Not yet run against the live Hostinger database — needs the real
> `MYSQL_PASSWORD` and an explicit go-ahead before touching production data.

### Phase 2 — Auth API (product-aware)
- [ ] `POST /v1/auth/login` with product/audience scoping, JWT issuance
- [ ] JWT verification + role/authorization middleware

### Phase 3 — Admin/catalog API
- [ ] CRUD for `apim_products`, `apim_users`/roles, tokens
- [x] Surface Swagger endpoint list on catalog cards by reading `lxc-api` OpenAPI in local mode

### Phase 4 — Browser UI (login-gated) ✅
- [x] Pages: `/login`, `POST /logout`, `/dashboard` (landing after login),
      `/catalog` (its own page, separate from dashboard), `/change-password`
      (admin-only), `/users/new` (create additional accounts)
- [x] Session: JWT issued on login, stored in an httpOnly cookie (same auth
      core intended for the future `/v1/auth/login` API, different
      transport) — `src/middleware/auth.ts`
- [x] Root `/` redirects to `/dashboard` if logged in, else `/login`
- [x] Degraded-mode banner shown site-wide when logged in via the DB-down
      fallback (see below) — `/catalog`, `/change-password`, and
      `/users/new` all refuse to operate (503, clear message) while degraded
- [x] Desktop left-side menu and brand-matched Lexvora palette
- [x] Local catalog URLs mapped to `localhost:3000` and `localhost:3100`
- [x] Catalog page structured as a grouped API explorer with a full-height details rail
- [x] Group containers now wrap their endpoint rows as a single bordered stack
- [x] `catalog-toolbar`/filter sections are being normalized to the catalog layout and HTML5 structure

**Two bootstrap accounts** (`scripts/seed-admin.mjs`, create-once via
`INSERT IGNORE` — repeat runs do not overwrite `password_hash`/`is_active`,
so restarting the dev server does not undo a password change):

| Account | Password | DB-down fallback? | Notes |
|---|---|---|---|
| `admin` | `admin@1234` (default) | **Yes** — hardcoded literal check in `src/services/authService.ts`, works even if MySQL is unreachable | Forced to `/change-password` on first login while DB is reachable and still on the default password |
| `superadmin` | `superadmin@#$1234` (fixed, never changed by the app) | No — DB-row only | Auto-disabled (`apim_users.is_active = 0`) the moment admin's password changes away from default; re-enable by flipping that flag directly in MySQL |

> ⚠️ **Temporary dev backdoors**, explicitly requested (2026-08-02 — no
> public deployment yet). **Must be revisited before `lxc-apim` is exposed
> anywhere real** — especially the DB-down code-level bypass for `admin`,
> which doesn't depend on the database at all.

**Catalog (`/catalog`) is env-aware and spec-driven:** `APIM_ENV=local` (the
dev default) forces localhost URLs for the two local webapps
(`src/config/localUrls.ts`: `lxc-api` → `http://localhost:3000`,
`lxc-apim` → `http://localhost:3100`) instead of the DB-seeded production
URL. The catalog groups and endpoint cards are built from
`lxc-api/openapi.json` when that spec is reachable, so the UI reflects the
actual REST surface rather than a hardcoded list. The build/deploy flow is
what switches to `APIM_ENV=production`.

**Current catalog UI contract**
- Left side is the API catalog stack.
- Right side is the API details rail.
- Group borders must contain their endpoint rows.
- API-level filters sit below the group-level filters.
- Method chips use light tinted backgrounds, not solid blocks.
- The current goal is visual parity with the reference grouped Swagger-style layout, while still keeping the Lexvora APIM palette and local/prod URL switching behavior.
- New APIs should be added in `lxc-api` first, then surfaced in APIM through the OpenAPI-driven catalog.

Run it locally against the **real remote Hostinger database** with:

```bash
../../Executable/macos_apim_run.sh
```

Choose option 1 or 2 (First Time / Regular — identical logic, different
messaging) once `lxc-apim/.env` exists — both run with zero prompts,
checking/applying `db:migrate` + `db:seed` + `db:seed:admin` on every run
(idempotent, so cheap), best-effort start `lxc-api` too (skipped with a clear
message if `lxc-api/.env` isn't set up — it needs its own WeatherAPI.com
key), then run an explicit health check before opening `http://localhost:3100`
automatically. If `lxc-apim/.env` doesn't exist yet, use option 3 (Custom)
once to set the real MySQL password interactively (hidden input, saved only
to the gitignored local `.env`) — after that, options 1/2 need no further
input.

**Deferred from this pass** (still queued): product-aware JWT API auth,
role/authorization middleware for programmatic clients, the Swagger endpoint
list on catalog cards, and the multi-spec `/docs` implementation.

### Phase 5 — Swagger / docs
- [ ] `lxc-apim`'s own `src/config/openapi.ts`
- [ ] `/docs` multi-spec Swagger UI, `urls` list generated from `apim_products`

### Phase 6 — Deployment
- [ ] Hostinger packaging script (mirrors `macos_healthapi_package.sh`)
- [ ] `apim.lexvoraconsulting.com` Node.js App + env vars on Hostinger
- [ ] End-to-end deploy verification

> Full plan and rationale tracked in this session's todo list; this section
> is the durable copy so a new session can pick up where this left off.
