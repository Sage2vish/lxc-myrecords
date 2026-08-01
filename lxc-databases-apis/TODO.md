# LXC-DBs-APIs TODO

Status tracker for the new top-level API/database workspace.

## Completed

- [x] Create top-level `lxc-databases-apis/`
- [x] Move API code into `lxc-databases-apis/lxc-api/`
- [x] Move database docs into `lxc-databases-apis/lxc-databases/`
- [x] Keep compatibility symlinks at the old paths during transition
- [x] Add MySQL connection docs and helper script

## In Progress

- [ ] Rename remaining docs from `lxc-health-api` to `lxc-api`
- [ ] Rename remaining docs from `lxc-health-db` to `lxc-databases`
- [ ] Update repository-level references to the new folder names
- [ ] Decide whether `lxc-api` should also hold DB access code or keep a shared DB module

## Next

- [ ] Add JWT/admin API management layer
- [ ] Add shared database connection module
- [ ] Add schema/migration layout under `lxc-databases`
- [ ] Remove compatibility symlinks after the transition is verified
