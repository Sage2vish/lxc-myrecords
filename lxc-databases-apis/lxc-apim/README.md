<h1 id="lxc-apim" align="center">🗂️ lxc-apim</h1>

<p align="center">
  <a href="https://lexvoraconsulting.com" target="_blank"><strong>lexvoraconsulting.com</strong></a>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/status-in%20development-yellow" alt="Status">
    <img src="https://img.shields.io/badge/scope-API%20Management-4B5563" alt="Scope">
    <img src="https://img.shields.io/badge/Database-MySQL%20(shared)-4479A1" alt="MySQL">
    <img src="https://img.shields.io/badge/Code-scaffolded-brightgreen" alt="Code status">
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

## 🖥️ Showcase UI theme

The showcase/catalog UI matches the brand theme from the `lexvoraconsulting_web`
site (sibling repo, not inside this monorepo): dark navy + gold header
(`#061421` / `#b88445` / `#d2a15f`), cream body (`#f7f3ed`), Georgia serif for
hero headings, Montserrat uppercase eyebrow labels, gold-gradient buttons, and
the `.service-card` pattern already used on that site's `our-products.html`.

## 🛠️ Stack

Mirrors `lxc-api`'s Express/TypeScript setup — its own separate codebase, not
shared code:

`express` · `typescript` · `tsx` · `mysql2` · `jsonwebtoken` · `bcrypt` ·
`zod` · `cors` · `ejs` · `swagger-ui-express`

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

### Phase 4 — Showcase UI 🟡
- [x] EJS catalog landing page (`views/catalog.ejs` + `public/css/theme.css`),
      reads live from `apim_products`, gracefully shows a "not connected /
      empty" state instead of crashing when the DB isn't reachable or seeded
- [ ] Admin login + panel views (depends on Phase 2 auth API)

Run it locally against the **real remote Hostinger database** with:

```bash
../../Executable/macos_apimapp_run.sh
```

Choose option 1 (Run/Test Local — Dev APIM, Remote DB). First run prompts for
the real MySQL password (hidden input, saved only to the gitignored local
`.env`) and offers to run `db:migrate`/`db:seed` on the spot, then opens
`http://localhost:3100` in your browser automatically. Run this yourself in a
terminal — don't route the password prompt through an AI assistant.

### Phase 5 — Swagger / docs
- [ ] `lxc-apim`'s own `src/config/openapi.ts`
- [ ] `/docs` multi-spec Swagger UI, `urls` list generated from `apim_products`

### Phase 6 — Deployment
- [ ] Hostinger packaging script (mirrors `macos_healthapi_package.sh`)
- [ ] `apim.lexvoraconsulting.com` Node.js App + env vars on Hostinger
- [ ] End-to-end deploy verification

> Full plan and rationale tracked in this session's todo list; this section
> is the durable copy so a new session can pick up where this left off.
