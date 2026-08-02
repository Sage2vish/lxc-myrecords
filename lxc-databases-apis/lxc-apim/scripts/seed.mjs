#!/usr/bin/env node
// Applies lxc-databases/api-apimgmt-db/seeds/*.sql in filename order.
// Pure data (idempotent upserts) — re-runnable, unlike migrations there is
// no applied-tracking table.
import mysql from 'mysql2/promise';
import {readdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedsDir = path.join(__dirname, '..', '..', 'lxc-databases', 'api-apimgmt-db', 'seeds');

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

async function main() {
  const conn = await mysql.createConnection({
    host: requireEnv('MYSQL_HOST'),
    port: Number(process.env.MYSQL_PORT ?? 3306),
    database: requireEnv('MYSQL_DATABASE'),
    user: requireEnv('MYSQL_USER'),
    password: requireEnv('MYSQL_PASSWORD'),
    multipleStatements: true,
  });

  const files = (await readdir(seedsDir)).filter((file) => file.endsWith('.sql')).sort();

  for (const file of files) {
    const sql = await readFile(path.join(seedsDir, file), 'utf8');
    console.log(`seed ${file}`);
    await conn.query(sql);
  }

  console.log('Seed data applied.');
  await conn.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
