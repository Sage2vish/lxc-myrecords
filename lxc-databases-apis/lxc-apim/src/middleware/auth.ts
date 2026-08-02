import type {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import {env} from '../config/env.js';

const SESSION_COOKIE = 'lxc_apim_session';

export type SessionPayload = {
  email: string;
  displayName: string | null;
  degraded: boolean;
  mustChangePassword: boolean;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      session?: SessionPayload;
    }
  }
}

export function issueSessionCookie(res: Response, session: SessionPayload) {
  const token = jwt.sign(session, env.jwt.secret, {expiresIn: env.jwt.expiresIn as jwt.SignOptions['expiresIn']});
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 12 * 60 * 60 * 1000,
  });
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(SESSION_COOKIE);
}

function readSession(req: Request): SessionPayload | undefined {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) {
    return undefined;
  }

  try {
    return jwt.verify(token, env.jwt.secret) as SessionPayload;
  } catch {
    return undefined;
  }
}

export function attachSession(req: Request, _res: Response, next: NextFunction) {
  req.session = readSession(req);
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session) {
    res.redirect('/login');
    return;
  }
  next();
}

export function requireNoAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session) {
    res.redirect('/dashboard');
    return;
  }
  next();
}
