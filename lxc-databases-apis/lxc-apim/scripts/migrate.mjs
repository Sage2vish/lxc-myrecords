#!/usr/bin/env node
// Applies lxc-databases/api-apimgmt-db/migrations/*.sql in filename order,
// tracking what's applied in apim_schema_migrations. Idempotent — safe to
// re-run. The .sql files are pure data owned by the database workspace;
// this runner is app code and lives here in lxc-apim on purpose.
import mysql from 'mysql2/promise';
import {readdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, '..', '..', 'lxc-databases', 'api-apimgmt-db', 'migrations');

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

  await conn.query(`
    CREATE TABLE IF NOT EXISTS apim_schema_migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  const [appliedRows] = await conn.query('SELECT filename FROM apim_schema_migrations');
  const applied = new Set(appliedRows.map((row) => row.filename));

  const files = (await readdir(migrationsDir)).filter((file) => file.endsWith('.sql')).sort();

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`skip  ${file} (already applied)`);
      continue;
    }

    const sql = await readFile(path.join(migrationsDir, file), 'utf8');
    console.log(`apply ${file}`);
    await conn.query(sql);
    await conn.query('INSERT INTO apim_schema_migrations (filename) VALUES (?)', [file]);
  }

  console.log('Migrations up to date.');
  await conn.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
