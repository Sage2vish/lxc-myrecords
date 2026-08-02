import {Router} from 'express';
import {
  acceptConsent,
  acceptTerms,
  biometricLogin,
  deleteSession,
  emailLogin,
  listSessions,
  refreshToken as issueRefreshToken,
  registerDevice,
  registerUser,
  requestOtp,
  resetPassword,
  verifyOtp,
} from '../services/auth.js';

export const authRouter = Router();

authRouter.post('/register', (req, res) => {
  const {name = 'MyHealthHub User', email = '', phone, password = 'changeme'} = req.body ?? {};
  res.status(201).json(registerUser({name, email, phone, password}));
});

authRouter.post('/otp/request', (req, res) => {
  const {phone = ''} = req.body ?? {};
  res.json(requestOtp({phone}));
});

authRouter.post('/otp/verify', (req, res) => {
  const {phone = '', otp = ''} = req.body ?? {};
  res.json(verifyOtp({phone, otp}));
});

authRouter.post('/login', (req, res) => {
  const {email = '', password = ''} = req.body ?? {};
  res.json(emailLogin({email, password}));
});

authRouter.post('/token/refresh', (req, res) => {
  const {refreshToken = ''} = req.body ?? {};
  res.json(issueRefreshToken({refreshToken}));
});

authRouter.post('/logout', (req, res) => {
  const {sessionId = ''} = req.body ?? {};
  res.json(deleteSession(sessionId));
});

authRouter.get('/sessions', (_req, res) => {
  res.json({
    count: listSessions().length,
    items: listSessions(),
  });
});

authRouter.delete('/sessions/:sessionId', (req, res) => {
  res.json(deleteSession(req.params.sessionId));
});

authRouter.post('/password/reset', (req, res) => {
  const {email = ''} = req.body ?? {};
  res.json(resetPassword(email));
});

authRouter.post('/devices/register', (req, res) => {
  const {deviceId = ''} = req.body ?? {};
  res.json(registerDevice(deviceId));
});

authRouter.post('/biometric', (req, res) => {
  const {userId = 'usr_demo'} = req.body ?? {};
  res.json(biometricLogin(userId));
});

authRouter.post('/consent', (req, res) => {
  const {userId = 'usr_demo'} = req.body ?? {};
  res.json(acceptConsent(userId));
});

authRouter.post('/terms', (req, res) => {
  const {userId = 'usr_demo'} = req.body ?? {};
  res.json(acceptTerms(userId));
});
