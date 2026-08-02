#!/usr/bin/env node
// Creates (or updates the password of) a default admin apim_user with the
// 'admin' role. Run `npm run db:seed` first so the admin role exists.
// This does real work (password hashing, conditional inserts) — that's why
// it's app code in lxc-apim, not a plain .sql file in lxc-databases.
//
// TEMPORARY DEV BACKDOOR: with no env vars set, this creates/keeps a known
// admin/admin@1234 login. That's intentional for now (2026-08-02, early
// development, no auth API or public deployment yet) but MUST be replaced
// or removed before lxc-apim is exposed anywhere real — either by running
// this once with SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD set to real values, or
// by deleting the row before going live.
//
// Usage:
//   npm run db:seed:admin                                          # backdoor admin/admin@1234
//   SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD=... npm run db:seed:admin
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const DEV_BACKDOOR_EMAIL = 'admin';
const DEV_BACKDOOR_PASSWORD = 'admin@1234';

async function main() {
  const usingBackdoorDefaults = !process.env.SEED_ADMIN_EMAIL && !process.env.SEED_ADMIN_PASSWORD;
  const email = process.env.SEED_ADMIN_EMAIL ?? DEV_BACKDOOR_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD ?? DEV_BACKDOOR_PASSWORD;

  if (usingBackdoorDefaults) {
    console.warn(`⚠ Using temporary dev backdoor admin credentials (${DEV_BACKDOOR_EMAIL}/${DEV_BACKDOOR_PASSWORD}) — replace before any real deployment.`);
  }

  const conn = await mysql.createConnection({
    host: requireEnv('MYSQL_HOST'),
    port: Number(process.env.MYSQL_PORT ?? 3306),
    database: requireEnv('MYSQL_DATABASE'),
    user: requireEnv('MYSQL_USER'),
    password: requireEnv('MYSQL_PASSWORD'),
  });

  const passwordHash = await bcrypt.hash(password, 10);

  await conn.query(
    `INSERT INTO apim_users (email, password_hash, display_name, is_active)
     VALUES (?, ?, 'Admin', 1)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
    [email, passwordHash],
  );

  const [[user]] = await conn.query('SELECT id FROM apim_users WHERE email = ?', [email]);
  const [[role]] = await conn.query("SELECT id FROM apim_roles WHERE slug = 'admin'");

  if (!role) {
    throw new Error("apim_roles has no 'admin' row yet — run `npm run db:seed` first.");
  }

  await conn.query('INSERT IGNORE INTO apim_user_roles (user_id, role_id) VALUES (?, ?)', [
    user.id,
    role.id,
  ]);

  console.log(`Seeded admin user: ${email}`);
  await conn.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
