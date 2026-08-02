<h1 id="lxc-apim" align="center">🗂️ lxc-apim</h1>

<p align="center">
  <a href="https://lexvoraconsulting.com" target="_blank"><strong>lexvoraconsulting.com</strong></a>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/status-planning-yellow" alt="Status">
    <img src="https://img.shields.io/badge/scope-API%20Management-4B5563" alt="Scope">
    <img src="https://img.shields.io/badge/Database-MySQL%20(shared)-4479A1" alt="MySQL">
    <img src="https://img.shields.io/badge/Code-not%20started-lightgrey" alt="Code status">
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
[`../lxc-databases/api-apimgmt-db`](../lxc-databases/api-apimgmt-db/).

## ✅ Status

- [ ] Scaffold service (`package.json`, `src/`, build/start scripts — likely
      mirroring `lxc-api`'s Express/TypeScript setup, but its own codebase)
- [ ] Define `apim_*` schema in `lxc-databases/api-apimgmt-db`
- [ ] Add JWT/admin auth layer
- [ ] Build the API catalog/showcase surface
- [ ] Wire up the shared MySQL connection module (see the
      `lxc-databases-apis` root README task tracker — "Add shared database
      connection module")

> This folder is documentation-only right now; no code has been written yet.
