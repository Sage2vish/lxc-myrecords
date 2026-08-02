<h1 id="api-apimgmt-db" align="center">🔐 api-apimgmt-db</h1>

<p align="center">
    <img src="https://img.shields.io/badge/status-planning-yellow" alt="Status">
    <img src="https://img.shields.io/badge/scope-Auth%20%2B%20API%20Management-4B5563" alt="Scope">
    <img src="https://img.shields.io/badge/Database-MySQL%20(shared)-4479A1" alt="MySQL">
</p>

---

API management database workspace for Lexvora Consulting APIs & Databases.

## 🔗 Shared database, prefixed tables

This is one MySQL database (the Hostinger instance in
[`../../lxc-api/DB_CONNECTION.md`](../../lxc-api/DB_CONNECTION.md)) shared by
two separate codebases:

| Codebase | Prefix | Role |
|---|---|---|
| [`lxc-api`](../../lxc-api/) | `api_*` | The API service itself |
| [`lxc-apim`](../../lxc-apim/) | `apim_*` | The API management / showcase layer (different code, same DB) |

## 📋 Use this folder for

| Concern | Prefix |
|---|---|
| JWT/admin seed data | `apim_*` |
| API users and roles | `apim_*` |
| Tokens, sessions, and auth audit notes | `apim_*` |
| API gateway, catalog, and management metadata | `apim_*` |
| Any tables `lxc-api` itself needs | `api_*` |
| Future database migrations | both |

## ✅ Status

- [ ] Define schema (`api_*` and `apim_*`)
- [ ] Add migrations
- [ ] Add seed data
- [ ] Connect API auth layer
