#!/usr/bin/env node
// Creates the two bootstrap apim_users accounts (admin, superadmin) the
// first time this runs. Deliberately create-once: uses a SELECT-then-INSERT
// guard, so it never overwrites password_hash or is_active on repeat runs —
// this script is called on every dev startup (idempotent "is everything in
// place" check), and admin's password / superadmin's is_active are meant to
// change over time via the app itself (change-password flow, manual DB
// toggle), not get reset back to defaults every time you restart the dev
// server.
//
// TEMPORARY DEV BACKDOORS (2026-08-02, early development, no public
// deployment yet — explicitly requested, must be revisited before going
// live):
//   admin      / admin@1234        — normal login; also has a DB-down
//                                     code-level fallback (see
//                                     src/services/authService.ts) so
//                                     health-check/diagnostics stay
//                                     reachable even if MySQL is down.
//                                     Forced to change password on first
//                                     login while the DB is reachable.
//   superadmin / superadmin@#$1234 — fixed password, never changed by the
//                                     app. Auto-disabled
//                                     (apim_users.is_active = 0) the moment
//                                     admin's password changes away from the
//                                     default. Re-enable by flipping that
//                                     flag directly in MySQL.
//
// Usage:
//   npm run db:seed:admin   # creates both backdoors if they don't exist yet
//   SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD=... npm run db:seed:admin   # custom admin, first run only
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const DEV_ADMIN_EMAIL = 'admin';
const DEV_ADMIN_PASSWORD = 'admin@1234';
const SUPERADMIN_EMAIL = 'superadmin';
const SUPERADMIN_PASSWORD = 'superadmin@#$1234';

async function seedAccountIfMissing(conn, roleId, {email, password, displayName}) {
  const [existingRows] = await conn.query('SELECT id FROM apim_users WHERE email = ?', [email]);

  if (existingRows.length > 0) {
    console.log(`Already present: ${email} (left untouched)`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await conn.query(
    `INSERT INTO apim_users (email, password_hash, display_name, is_active)
     VALUES (?, ?, ?, 1)`,
    [email, passwordHash, displayName],
  );

  const [[user]] = await conn.query('SELECT id FROM apim_users WHERE email = ?', [email]);
  await conn.query('INSERT IGNORE INTO apim_user_roles (user_id, role_id) VALUES (?, ?)', [
    user.id,
    roleId,
  ]);

  console.log(`Created: ${email}`);
}

async function main() {
  const usingBackdoorAdmin = !process.env.SEED_ADMIN_EMAIL && !process.env.SEED_ADMIN_PASSWORD;
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? DEV_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? DEV_ADMIN_PASSWORD;

  if (usingBackdoorAdmin) {
    console.warn(
      `⚠ Using dev backdoor admin default if not already created (${DEV_ADMIN_EMAIL}/${DEV_ADMIN_PASSWORD}) — replace before any real deployment.`,
    );
  }

  const conn = await mysql.createConnection({
    host: requireEnv('MYSQL_HOST'),
    port: Number(process.env.MYSQL_PORT ?? 3306),
    database: requireEnv('MYSQL_DATABASE'),
    user: requireEnv('MYSQL_USER'),
    password: requireEnv('MYSQL_PASSWORD'),
  });

  const [[role]] = await conn.query("SELECT id FROM apim_roles WHERE slug = 'admin'");
  if (!role) {
    throw new Error("apim_roles has no 'admin' row yet — run `npm run db:seed` first.");
  }

  await seedAccountIfMissing(conn, role.id, {email: adminEmail, password: adminPassword, displayName: 'Admin'});
  await seedAccountIfMissing(conn, role.id, {email: SUPERADMIN_EMAIL, password: SUPERADMIN_PASSWORD, displayName: 'Super Admin'});

  await conn.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
