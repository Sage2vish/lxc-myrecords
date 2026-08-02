export const env = {
  port: Number(process.env.PORT ?? 3100),
  // 'local' | 'production' — controls whether the catalog shows localhost
  // links or the real seeded production URLs. The eventual "Build to
  // Publish" flow sets this to 'production' when packaging for Hostinger.
  apimEnv: process.env.APIM_ENV === 'production' ? 'production' : 'local',
  mysql: {
    host: process.env.MYSQL_HOST ?? '',
    port: Number(process.env.MYSQL_PORT ?? 3306),
    database: process.env.MYSQL_DATABASE ?? '',
    user: process.env.MYSQL_USER ?? '',
    password: process.env.MYSQL_PASSWORD ?? '',
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? '',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
  },
};

export function assertEnvConfig() {
  const missing: string[] = [];

  if (!env.mysql.host) missing.push('MYSQL_HOST');
  if (!env.mysql.database) missing.push('MYSQL_DATABASE');
  if (!env.mysql.user) missing.push('MYSQL_USER');
  if (!env.jwt.secret) missing.push('JWT_SECRET');

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
