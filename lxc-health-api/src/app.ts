import express from 'express';
import {weatherRouter} from './routes/weather.js';

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ok: true});
  });

  app.use('/weather', weatherRouter);

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const message = err instanceof Error ? err.message : 'Unexpected server error';
    res.status(500).json({error: message});
  });

  return app;
}
