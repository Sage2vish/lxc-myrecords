import {Router} from 'express';
import {changeAdminPassword, verifyLogin} from '../services/authService.js';
import {clearSessionCookie, issueSessionCookie, requireAuth, requireNoAuth} from '../middleware/auth.js';

export const authRouter = Router();

authRouter.get('/login', requireNoAuth, (_req, res) => {
  res.render('login', {error: null});
});

authRouter.post('/login', requireNoAuth, async (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';

  const result = await verifyLogin(email, password);

  if (!result.ok) {
    const error =
      result.reason === 'db_unavailable'
        ? 'Unable to verify credentials — the database is unavailable right now.'
        : 'Incorrect email or password.';
    res.status(401).render('login', {error});
    return;
  }

  issueSessionCookie(res, {
    email: result.user.email,
    displayName: result.user.displayName,
    degraded: result.degraded,
    mustChangePassword: result.mustChangePassword,
  });

  if (result.mustChangePassword) {
    res.redirect('/change-password');
    return;
  }

  res.redirect('/dashboard');
});

authRouter.post('/logout', requireAuth, (_req, res) => {
  clearSessionCookie(res);
  res.redirect('/login');
});

authRouter.get('/change-password', requireAuth, (req, res) => {
  if (req.session!.email !== 'admin') {
    res
      .status(403)
      .render('change-password', {error: 'Only the admin account can change its password here.', canSubmit: false, session: req.session});
    return;
  }

  if (req.session!.degraded) {
    res.status(503).render('change-password', {
      error: 'The database is unavailable right now — password changes need a working DB connection.',
      canSubmit: false,
      session: req.session,
    });
    return;
  }

  res.render('change-password', {error: null, canSubmit: true, session: req.session});
});

authRouter.post('/change-password', requireAuth, async (req, res) => {
  if (req.session!.email !== 'admin' || req.session!.degraded) {
    res
      .status(403)
      .render('change-password', {error: 'This password cannot be changed here.', canSubmit: false, session: req.session});
    return;
  }

  const newPassword = typeof req.body?.newPassword === 'string' ? req.body.newPassword : '';
  const confirmPassword = typeof req.body?.confirmPassword === 'string' ? req.body.confirmPassword : '';

  if (newPassword.length < 8) {
    res
      .status(400)
      .render('change-password', {error: 'New password must be at least 8 characters.', canSubmit: true, session: req.session});
    return;
  }

  if (newPassword !== confirmPassword) {
    res.status(400).render('change-password', {error: 'Passwords do not match.', canSubmit: true, session: req.session});
    return;
  }

  await changeAdminPassword(newPassword);

  issueSessionCookie(res, {
    email: req.session!.email,
    displayName: req.session!.displayName,
    degraded: false,
    mustChangePassword: false,
  });

  res.redirect('/dashboard');
});
