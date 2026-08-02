import path from 'node:path';
import {fileURLToPath} from 'node:url';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {v1Router} from './routes/v1.js';
import {authRouter} from './routes/auth.js';
import {dashboardRouter} from './routes/dashboard.js';
import {catalogRouter} from './routes/catalog.js';
import {usersRouter} from './routes/users.js';
import {attachSession} from './middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({extended: false}));
  app.use(cookieParser());

  app.set('view engine', 'ejs');
  app.set('views', path.join(rootDir, 'views'));
  app.use(express.static(path.join(rootDir, 'public')));

  app.use(attachSession);

  app.use('/v1', v1Router);
  app.use(authRouter);
  app.use(dashboardRouter);
  app.use(catalogRouter);
  app.use(usersRouter);

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const message = err instanceof Error ? err.message : 'Unexpected server error';
    res.status(500).json({error: message});
  });

  return app;
}
