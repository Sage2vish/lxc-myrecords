<h1 id="lxc-databases" align="center">🗄️ lxc-databases</h1>

<p align="center">
  <a href="https://lexvoraconsulting.com" target="_blank"><strong>lexvoraconsulting.com</strong></a>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/status-active-brightgreen" alt="Status">
    <img src="https://img.shields.io/badge/scope-Database%20Workspace-4B5563" alt="Scope">
    <img src="https://img.shields.io/badge/Database-MySQL-4479A1" alt="MySQL">
    <img src="https://img.shields.io/badge/Deploy-Hostinger-4B5563" alt="Hostinger">
</p>

---

Dedicated database workspace for the Lexvora Consulting APIs & Databases stack.

This folder is reserved for database-related design, schema planning,
integration notes, migrations, and deployment context. It is intended to be the
single place where we define how health data is stored, accessed, secured, and
evolved over time.

## 🧭 Current Structure

This workspace is split into two child areas:

| Folder | Purpose |
|---|---|
| [`api-apimgmt-db/`](./api-apimgmt-db/) | JWT, admin, API user, and API management data (`api_*`/`apim_*` tables) |
| [`health-db/`](./health-db/) | Patient, visit, record, and sync-oriented health data |

## 🎯 Purpose

The goal of this folder is to keep the data layer separate from the mobile and
API applications so database decisions stay easy to review and maintain.

Use this space for:

- Data model and schema notes
- Collection or table design
- Migration strategy
- Environment variable guidance
- Backup and recovery notes
- Security and access patterns
- Provider-specific implementation details
- API management and health-domain data should live in separate subfolders
  unless we intentionally merge them later

## 🏆 Database Provider — Decided

**MySQL**, on the existing Hostinger instance already documented in
[`../lxc-api/DB_CONNECTION.md`](../lxc-api/DB_CONNECTION.md). Not MongoDB Atlas,
not Supabase — that earlier options analysis is kept below for historical
context only.

- `lxc-api` and `lxc-apim` are separate codebases that **share this one MySQL
  database**. Tables are split by prefix instead of by database:
  - `api_*` — owned by `lxc-api`
  - `apim_*` — owned by `lxc-apim`
  - This prefixed schema lives under [`api-apimgmt-db/`](./api-apimgmt-db/).
- `health-db` uses the same MySQL platform, kept as its own domain (patient,
  visit, and record data) separate from the api/apim tables above.

<details>
<summary>Earlier MongoDB Atlas vs. Supabase analysis (superseded — MySQL was chosen)</summary>

### MongoDB Atlas

Best when the project needs flexible document storage and evolving health data
structures.

Good fit for:

- Patient profiles with nested data
- Medical records and attachments metadata
- Event-style health timelines
- Rapid schema iteration
- JSON-first API design

Typical strengths:

- Flexible document model
- Strong fit for app-centric and semi-structured data
- Easy to store deeply nested health objects
- Familiar pairing with Node.js APIs

### Supabase

Best when the project benefits from relational structure, auth integration, and
Postgres compatibility.

Good fit for:

- Structured patient and account data
- Appointment and scheduling records
- Reporting and analytics queries
- Strong relational constraints
- SQL-based business logic

Typical strengths:

- PostgreSQL foundation
- Row-level security support
- Built-in auth and storage options
- Strong SQL querying and reporting
- Good fit for normalized health data

</details>

## 🧩 Recommended Direction

For the current LXC-DBs-APIs ecosystem, tables are split by domain within the
same MySQL database:

| Domain | Folder | Prefix |
|---|---|---|
| Auth, users, sessions, API catalog, admin control — shared by `lxc-api` and `lxc-apim` | `api-apimgmt-db` | `api_*` / `apim_*` |
| Patient records, timelines, medical documents | `health-db` | (TBD) |

## 📁 Suggested Folder Structure

```text
lxc-databases/
├── README.md
├── api-apimgmt-db/
│   └── README.md
├── health-db/
│   ├── README.md
│   └── docs-images/
├── schema/
├── migrations/
├── seeds/
├── docs/
└── env.example
```

## ⚙️ Environment Notes

Keep secrets out of git. Same MySQL connection contract already used by
`lxc-api` (see [`../lxc-api/.env.example`](../lxc-api/.env.example)):

```bash
MYSQL_HOST=
MYSQL_PORT=
MYSQL_DATABASE=
MYSQL_USER=
MYSQL_PASSWORD=
```

`lxc-apim` will use the same values — it's the same database, just different
table prefixes.

## 📏 Working Rules

- Keep provider-specific scripts and notes inside this folder
- Avoid scattering schema decisions across app folders
- Document breaking changes before applying them
- Treat patient data as sensitive by default

## ➡️ Next Step

Database provider is confirmed (MySQL/Hostinger). Next: define the `api_*` /
`apim_*` schema in `api-apimgmt-db/` and the schema in `health-db/`, then add
migrations.
