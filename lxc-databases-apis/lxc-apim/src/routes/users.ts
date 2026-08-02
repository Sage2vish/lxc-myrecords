import {Router} from 'express';
import bcrypt from 'bcrypt';
import {pool} from '../config/db.js';
import {requireAuth} from '../middleware/auth.js';

export const usersRouter = Router();

type RoleRow = {id: number; slug: string; name: string};

async function loadRoles(): Promise<RoleRow[]> {
  const [rows] = await pool.query('SELECT id, slug, name FROM apim_roles ORDER BY name');
  return rows as RoleRow[];
}

usersRouter.get('/users/new', requireAuth, async (req, res) => {
  if (req.session!.degraded) {
    res.status(503).render('create-user', {
      error: 'The database is unavailable right now — creating users needs a working DB connection.',
      roles: [],
      session: req.session,
    });
    return;
  }

  const roles = await loadRoles();
  res.render('create-user', {error: null, roles, session: req.session});
});

usersRouter.post('/users/new', requireAuth, async (req, res) => {
  if (req.session!.degraded) {
    res.status(503).render('create-user', {
      error: 'The database is unavailable right now — creating users needs a working DB connection.',
      roles: [],
      session: req.session,
    });
    return;
  }

  const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
  const displayName = typeof req.body?.displayName === 'string' ? req.body.displayName.trim() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const confirmPassword = typeof req.body?.confirmPassword === 'string' ? req.body.confirmPassword : '';
  const roleSlug = typeof req.body?.role === 'string' ? req.body.role : '';

  const roles = await loadRoles();

  if (!email || !password) {
    res.status(400).render('create-user', {error: 'Email and password are required.', roles, session: req.session});
    return;
  }

  if (password.length < 8) {
    res.status(400).render('create-user', {error: 'Password must be at least 8 characters.', roles, session: req.session});
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).render('create-user', {error: 'Passwords do not match.', roles, session: req.session});
    return;
  }

  const role = roles.find((r) => r.slug === roleSlug);
  if (!role) {
    res.status(400).render('create-user', {error: 'Choose a valid role.', roles, session: req.session});
    return;
  }

  const [existing] = await pool.query('SELECT id FROM apim_users WHERE email = ?', [email]);
  if ((existing as unknown[]).length > 0) {
    res.status(400).render('create-user', {error: `${email} already exists.`, roles, session: req.session});
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await pool.query(
    `INSERT INTO apim_users (email, password_hash, display_name, is_active) VALUES (?, ?, ?, 1)`,
    [email, passwordHash, displayName || null],
  );

  const [userRows] = await pool.query('SELECT id FROM apim_users WHERE email = ?', [email]);
  const newUser = (userRows as {id: number}[])[0];
  await pool.query('INSERT IGNORE INTO apim_user_roles (user_id, role_id) VALUES (?, ?)', [
    newUser.id,
    role.id,
  ]);

  res.render('create-user', {error: null, success: `Created ${email}.`, roles, session: req.session});
});
