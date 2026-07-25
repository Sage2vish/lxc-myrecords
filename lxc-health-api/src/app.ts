import express from 'express';
import swaggerUi from 'swagger-ui-express';
import {openApiSpec} from './config/openapi.js';
import {v1Router} from './routes/v1.js';

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
  app.get('/openapi.json', (_req, res) => {
    res.json(openApiSpec);
  });

  app.use('/v1', v1Router);

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const message = err instanceof Error ? err.message : 'Unexpected server error';
    res.status(500).json({error: message});
  });

  return app;
}
