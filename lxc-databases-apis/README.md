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
    <td align="center"><strong>LXC-APIM</strong><br/>General API management and backend services</td>
    <td align="center"><strong>LXC-Databases</strong><br/>Database planning, migrations, and domain data</td>
    <td align="center"><strong>Hostinger</strong><br/>Current hosting and deployment platform</td>
  </tr>
</table>

### Workspace Map

```text
lxc-databases-apis/
├── README.md
├── lxc-apim/
│   ├── README.md
│   ├── package.json
│   ├── src/
│   ├── scripts/
│   └── publish/
└── lxc-databases/
    ├── README.md
    ├── api-apimgmt-db/
    └── health-db/
```

### Current Intent

- `lxc-apim` is the general API and API-management workspace.
- `lxc-databases` is the database workspace.
- `api-apimgmt-db` is for auth, JWT, users, roles, and API-control data.
- `health-db` is for patient, health, and record data.
- The API and database pieces can converge later if a shared module is the best fit.

### Key Files

```text
lxc-apim/README.md             # API project notes and deployment context
lxc-apim/DB_CONNECTION.md      # MySQL connection workflow
lxc-apim/scripts/mysql-connect.sh
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
- [x] Move API code into `lxc-apim/`
- [x] Move database docs into `lxc-databases/`
- [x] Split the database workspace into `api-apimgmt-db/` and `health-db/`
- [x] Add MySQL connection docs and helper script
- [x] Remove compatibility symlinks from the old paths

### In Progress

- [ ] Add JWT/admin API management layer

### Next

- [ ] Add shared database connection module
- [ ] Add schema/migration layout under `api-apimgmt-db`
- [ ] Add schema/migration layout under `health-db`
- [ ] Replace temporary placeholder docs with real schema docs

### Decision

- `lxc-apim` keeps the shared database connection module for now.
- `api-apimgmt-db` holds API-management/auth data.
- `health-db` holds health-domain storage and future schema work.

---

## Notes

- `lxc-apim` is the renamed API folder formerly known as `lxc-api`.
- The workspace is intentionally documentation-heavy right now so the next
  implementation steps stay easy to follow.
- When the database model is finalized, this README should be updated first so
  the folder contract stays clear.
- This README is the live task tracker for the workspace. Do not create a
  separate `TODO.md` for this area.
