#!/usr/bin/env node
// Seeds baseline reference data: apim_products (starting with lxc-api itself)
// and apim_roles. Idempotent — safe to re-run.
import mysql from 'mysql2/promise';

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const products = [
  {
    slug: 'lxc-api',
    name: 'LXC API',
    description: 'Core Lexvora API service (weather today, future endpoints).',
    base_url: 'https://apis.lexvoraconsulting.com',
    openapi_url: 'https://apis.lexvoraconsulting.com/openapi.json',
  },
  {
    slug: 'lxc-apim',
    name: 'LXC APIM',
    description: 'API management and showcase layer for Lexvora Consulting APIs.',
    base_url: 'https://apim.lexvoraconsulting.com',
    openapi_url: 'https://apim.lexvoraconsulting.com/openapi.json',
  },
];

const roles = [
  {slug: 'admin', name: 'Admin', description: 'Full access to manage products, users, and roles'},
  {slug: 'developer', name: 'Developer', description: 'Can view the catalog and manage own API tokens'},
];

async function main() {
  const conn = await mysql.createConnection({
    host: requireEnv('MYSQL_HOST'),
    port: Number(process.env.MYSQL_PORT ?? 3306),
    database: requireEnv('MYSQL_DATABASE'),
    user: requireEnv('MYSQL_USER'),
    password: requireEnv('MYSQL_PASSWORD'),
  });

  for (const product of products) {
    await conn.query(
      `INSERT INTO apim_products (slug, name, description, base_url, openapi_url, is_active)
       VALUES (?, ?, ?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         description = VALUES(description),
         base_url = VALUES(base_url),
         openapi_url = VALUES(openapi_url)`,
      [product.slug, product.name, product.description, product.base_url, product.openapi_url],
    );
    console.log(`seeded product: ${product.slug}`);
  }

  for (const role of roles) {
    await conn.query(
      `INSERT INTO apim_roles (slug, name, description)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description)`,
      [role.slug, role.name, role.description],
    );
    console.log(`seeded role: ${role.slug}`);
  }

  await conn.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
