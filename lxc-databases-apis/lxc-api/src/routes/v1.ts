import {Router} from 'express';
import {doctorsRouter} from './doctors.js';
import {weatherRouter} from './weather.js';

export const v1Router = Router();

v1Router.get('/health', (_req, res) => {
  res.json({ok: true, version: 'v1'});
});

v1Router.use('/doctors', doctorsRouter);
v1Router.use('/weather', weatherRouter);
