<h1 id="lxc-databases-apis" align="center">🧩 LXC-DBs-APIs Workspace</h1>

<p align="center">
  <a href="https://lexvoraconsulting.com" target="_blank"><strong>lexvoraconsulting.com</strong></a>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/status-active-brightgreen" alt="Status">
    <img src="https://img.shields.io/badge/scope-APIs%20%2B%20Databases-111827" alt="Scope">
    <img src="https://img.shields.io/badge/Node.js-20.x-339933" alt="Node.js">
    <img src="https://img.shields.io/badge/Deploy-Hostinger-4B5563" alt="Hostinger">
</p>

---

<h2 id="workspace-overview">✨ Workspace Overview</h2>

<p align="center">
  <strong>One workspace. One API surface. One database direction.</strong>
</p>

<p align="center">Lexvora Consulting APIs & Databases</p>

<table>
  <tr>
    <td align="center"><strong>LXC-API</strong><br/>The APIs themselves (weather today, future endpoints)</td>
    <td align="center"><strong>LXC-APIM</strong><br/>API management &amp; showcase layer on top of LXC-API</td>
    <td align="center"><strong>LXC-Databases</strong><br/>Database planning, migrations, and domain data</td>
    <td align="center"><strong>Hostinger</strong><br/>Current hosting and deployment platform</td>
  </tr>
</table>

### Workspace Map

```text
lxc-databases-apis/
├── README.md
├── lxc-api/
│   ├── README.md
│   ├── package.json
│   ├── src/
│   ├── scripts/
│   └── publish/
├── lxc-apim/
│   └── README.md
└── lxc-databases/
    ├── README.md
    ├── api-apimgmt-db/
    └── health-db/
```

### Current Intent

- `lxc-api` is the actual API service that serves requests (weather today, future endpoints).
- `lxc-apim` is a separate service — API management and a showcase of the APIs LXC builds
  (users, roles, tokens/JWT, API catalog). It is its own codebase, not shared code with `lxc-api`.
- `lxc-api` and `lxc-apim` **share one MySQL database** rather than each getting its own —
  tables are separated by prefix instead: `api_*` for `lxc-api`, `apim_*` for `lxc-apim`.
  See [`lxc-databases/api-apimgmt-db`](./lxc-databases/api-apimgmt-db/) for that shared schema.
- `lxc-databases` is the database workspace.
- `api-apimgmt-db` is for auth, JWT, users, roles, and API-control data (the shared
  `api_*`/`apim_*` tables above).
- `health-db` is for patient, health, and record data — kept separate from the
  api/apim domain.

### Key Files

```text
lxc-api/README.md              # API project notes and deployment context
lxc-api/DB_CONNECTION.md       # MySQL connection workflow (shared by lxc-api + lxc-apim)
lxc-api/scripts/mysql-connect.sh
lxc-apim/README.md             # API management / showcase workspace notes
lxc-databases/README.md        # Database workspace overview
lxc-databases/api-apimgmt-db/README.md
lxc-databases/health-db/README.md
```

### Working Rules

1. Keep API-management data separate from health-domain data unless there is a
   clear reason to merge.
2. Keep production secrets out of git.
3. Use the workspace TODO as the source of truth for what is done, in progress,
   and still pending.
4. Prefer small, additive changes that do not break the existing API runtime.
5. Update both the root README and the workspace README when the structure changes.

---

## Task Tracker

### Completed

- [x] Create top-level `lxc-databases-apis/`
- [x] Move API code into `lxc-api/`
- [x] Move database docs into `lxc-databases/`
- [x] Split the database workspace into `api-apimgmt-db/` and `health-db/`
- [x] Add MySQL connection docs and helper script
- [x] Remove compatibility symlinks from the old paths
- [x] Confirm database provider: MySQL (Hostinger) — see `lxc-databases/README.md`
- [x] Create `lxc-apim/` as its own service folder, separate codebase from `lxc-api`

### In Progress

- [ ] Add JWT/admin API management layer (`lxc-apim`)
- [ ] Scaffold `lxc-apim` service code (currently docs-only)

### Next

- [ ] Add shared database connection module
- [ ] Add schema/migration layout under `api-apimgmt-db` (`api_*` / `apim_*` prefixed tables)
- [ ] Add schema/migration layout under `health-db`
- [ ] Replace temporary placeholder docs with real schema docs
- [ ] Build the API catalog/showcase surface in `lxc-apim`

### Decision

- Database provider: **MySQL**, the existing Hostinger instance already used by
  `lxc-api` (see `lxc-api/DB_CONNECTION.md`). Not MongoDB Atlas or Supabase.
- `lxc-api` and `lxc-apim` are separate codebases that share that one MySQL
  database, split by table prefix (`api_*`, `apim_*`) instead of separate
  databases.
- `lxc-api` keeps the shared database connection module for now.
- `api-apimgmt-db` holds the API-management/auth data (`api_*`/`apim_*` tables).
- `health-db` holds health-domain storage and future schema work, kept separate
  from the api/apim domain.

---

## Notes

- `lxc-api` is the API service itself. `lxc-apim` is a separate, newer folder
  for API management and showcasing the APIs LXC builds — different code from
  `lxc-api`, sharing only the database.
- The workspace is intentionally documentation-heavy right now so the next
  implementation steps stay easy to follow.
- When the database model is finalized, this README should be updated first so
  the folder contract stays clear.
- This README is the live task tracker for the workspace. Do not create a
  separate `TODO.md` for this area.
