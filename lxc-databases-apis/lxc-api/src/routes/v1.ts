import {Router} from 'express';
import {authRouter} from './auth.js';
import {doctorsRouter} from './doctors.js';
import {profilesRouter} from './profiles.js';
import {weatherRouter} from './weather.js';

export const v1Router = Router();

v1Router.get('/health', (_req, res) => {
  res.json({ok: true, version: 'v1'});
});

v1Router.use('/auth', authRouter);
v1Router.use('/users', profilesRouter);
v1Router.use('/profiles', profilesRouter);
v1Router.use('/doctors', doctorsRouter);
v1Router.use('/weather', weatherRouter);
