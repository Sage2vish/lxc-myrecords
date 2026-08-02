import express from 'express';
import cors from 'cors';
import {v1Router} from './routes/v1.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/v1', v1Router);

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const message = err instanceof Error ? err.message : 'Unexpected server error';
    res.status(500).json({error: message});
  });

  return app;
}
