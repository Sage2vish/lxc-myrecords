# Database Connection

This note keeps the MySQL connection workflow in one place for `lxc-health-api`.

## Working Hostinger values

```text
Host: srv1878.hstgr.io
Port: 3306
Database: u450600831_lxc_hlthapi_db
Username: u450600831_lxc_hapi_admin
```

## Local workflow

Use one of these approaches:

1. SQL Tools desktop client
2. Hostinger phpMyAdmin
3. Terminal helper script

### Terminal helper

The repo includes [`scripts/mysql-connect.sh`](./scripts/mysql-connect.sh).
Set these environment variables first:

```bash
export MYSQL_HOST=srv1878.hstgr.io
export MYSQL_PORT=3306
export MYSQL_DATABASE=u450600831_lxc_hlthapi_db
export MYSQL_USER=u450600831_lxc_hapi_admin
```

Then run:

```bash
./scripts/mysql-connect.sh
```

## Rules

- Do not commit the database password.
- Use SQL scripts or migrations for schema changes later.
- Keep the website domain separate from the MySQL host.
- If Hostinger changes the DB host, update this file and the README together.
