# api-apimgmt-db

API management database workspace for Lexvora Consulting APIs & Databases.

## Shared database, prefixed tables

This is one MySQL database (the Hostinger instance in
[`../../lxc-api/DB_CONNECTION.md`](../../lxc-api/DB_CONNECTION.md)) shared by
two separate codebases:

- `lxc-api` — the API service itself. Its tables are prefixed `api_*`.
- `lxc-apim` — the API management / showcase layer (different code, same DB).
  Its tables are prefixed `apim_*`.

Use this folder for:

- JWT/admin seed data (`apim_*`)
- API users and roles (`apim_*`)
- Tokens, sessions, and auth audit notes (`apim_*`)
- API gateway, catalog, and management metadata (`apim_*`)
- Any `api_*` tables `lxc-api` itself needs
- Future database migrations for both prefixes

Status:
- [ ] Define schema (`api_*` and `apim_*`)
- [ ] Add migrations
- [ ] Add seed data
- [ ] Connect API auth layer
