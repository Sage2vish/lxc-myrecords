import path from 'node:path';
import {fileURLToPath} from 'node:url';
import express from 'express';
import cors from 'cors';
import {v1Router} from './routes/v1.js';
import {showcaseRouter} from './routes/showcase.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.set('view engine', 'ejs');
  app.set('views', path.join(rootDir, 'views'));
  app.use(express.static(path.join(rootDir, 'public')));

  app.use('/', showcaseRouter);
  app.use('/v1', v1Router);

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const message = err instanceof Error ? err.message : 'Unexpected server error';
    res.status(500).json({error: message});
  });

  return app;
}
