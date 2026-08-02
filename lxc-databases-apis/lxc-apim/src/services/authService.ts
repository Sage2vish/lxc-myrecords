import bcrypt from 'bcrypt';
import {pool} from '../config/db.js';

export type AuthUser = {
  email: string;
  displayName: string | null;
};

export type LoginResult =
  | {ok: true; user: AuthUser; degraded: boolean; mustChangePassword: boolean}
  | {ok: false; reason: 'invalid_credentials' | 'db_unavailable'};

const DEV_ADMIN_EMAIL = 'admin';
const DEV_ADMIN_PASSWORD = 'admin@1234';

type UserRow = {
  id: number;
  email: string;
  password_hash: string;
  display_name: string | null;
  is_active: number;
};

/**
 * Verifies credentials against apim_users. If the DB itself is unreachable
 * (not just "no matching row"), the literal admin/admin@1234 pair still
 * logs in — a deliberate, explicitly-requested break-glass path so
 * health-check/diagnostics stay reachable during a database outage. That
 * fallback never applies to superadmin or any other account — only the
 * exact hardcoded admin default, and only when the DB call itself fails.
 */
export async function verifyLogin(email: string, password: string): Promise<LoginResult> {
  try {
    const [rows] = await pool.query('SELECT id, email, password_hash, display_name, is_active FROM apim_users WHERE email = ?', [
      email,
    ]);
    const user = (rows as UserRow[])[0];

    if (!user || user.is_active !== 1) {
      return {ok: false, reason: 'invalid_credentials'};
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return {ok: false, reason: 'invalid_credentials'};
    }

    const mustChangePassword = user.email === DEV_ADMIN_EMAIL && password === DEV_ADMIN_PASSWORD;

    return {
      ok: true,
      user: {email: user.email, displayName: user.display_name},
      degraded: false,
      mustChangePassword,
    };
  } catch (error) {
    if (email === DEV_ADMIN_EMAIL && password === DEV_ADMIN_PASSWORD) {
      return {
        ok: true,
        user: {email: DEV_ADMIN_EMAIL, displayName: 'Admin (degraded — DB unavailable)'},
        degraded: true,
        mustChangePassword: false,
      };
    }

    return {ok: false, reason: 'db_unavailable'};
  }
}

/**
 * Changes admin's password and auto-disables superadmin in the same step —
 * once the real admin has a real password, the fixed-password recovery
 * account is no longer needed by default. A DBA can re-enable it later by
 * flipping apim_users.is_active back to 1 directly in MySQL.
 */
export async function changeAdminPassword(newPassword: string): Promise<void> {
  const passwordHash = await bcrypt.hash(newPassword, 10);

  await pool.query('UPDATE apim_users SET password_hash = ? WHERE email = ?', [passwordHash, DEV_ADMIN_EMAIL]);
  await pool.query('UPDATE apim_users SET is_active = 0 WHERE email = ?', ['superadmin']);
}
