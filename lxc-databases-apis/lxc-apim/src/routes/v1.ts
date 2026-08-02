import {Router} from 'express';

export const v1Router = Router();

v1Router.get('/health', (_req, res) => {
  res.json({ok: true, version: 'v1', service: 'lxc-apim'});
});
