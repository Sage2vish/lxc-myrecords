# lxc-apim

API Management workspace for Lexvora Consulting APIs & Databases.

This is **not** the API itself — `lxc-api` is the backend that serves requests
(weather today, future endpoints). `lxc-apim` is the management/showcase layer
on top of it:

- Lists and documents the APIs LXC builds (a catalog/showcase surface)
- Owns admin-facing concerns: API users, roles, tokens/JWT, access control
- Will eventually be the place operators go to see what APIs exist, who can
  call them, and how they're being used

## Relationship to `lxc-api`

`lxc-api` and `lxc-apim` are separate services but **share one MySQL database**
(the same Hostinger instance documented in
[`../lxc-api/DB_CONNECTION.md`](../lxc-api/DB_CONNECTION.md)) rather than each
getting its own database.

Table ownership is separated by prefix, not by database:

- `api_*` — tables owned by `lxc-api`
- `apim_*` — tables owned by `lxc-apim` (users, roles, tokens/JWT, API catalog
  entries, audit/access data)

Schema and migrations for these prefixed tables live under
[`../lxc-databases/api-apimgmt-db`](../lxc-databases/api-apimgmt-db/).

## Status

- [ ] Scaffold service (package.json, src/, build/start scripts — likely
      mirroring `lxc-api`'s Express/TypeScript setup)
- [ ] Define `apim_*` schema in `lxc-databases/api-apimgmt-db`
- [ ] Add JWT/admin auth layer
- [ ] Build the API catalog/showcase surface
- [ ] Wire up shared MySQL connection module (see `lxc-databases-apis` root
      README task tracker — "Add shared database connection module")

This folder is documentation-only right now; no code has been written yet.
