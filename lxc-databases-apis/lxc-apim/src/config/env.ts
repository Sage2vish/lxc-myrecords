export const env = {
  port: Number(process.env.PORT ?? 3100),
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
