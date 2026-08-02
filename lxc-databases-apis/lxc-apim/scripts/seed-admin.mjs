#!/usr/bin/env node
// Creates (or updates the password of) a default admin apim_user with the
// 'admin' role. Run `npm run db:seed` first so the admin role exists.
// This does real work (password hashing, conditional inserts) — that's why
// it's app code in lxc-apim, not a plain .sql file in lxc-databases.
//
// Usage:
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

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@lexvoraconsulting.com';
  const password = requireEnv('SEED_ADMIN_PASSWORD');

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
