import {Router} from 'express';
import {requireAuth} from '../middleware/auth.js';

export const dashboardRouter = Router();

dashboardRouter.get('/', requireAuth, (_req, res) => {
  res.redirect('/dashboard');
});

dashboardRouter.get('/dashboard', requireAuth, (req, res) => {
  res.render('dashboard', {session: req.session});
});
