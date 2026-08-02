export type AuthSession = {
  sessionId: string;
  userId: string;
  product: 'myhealthhub';
  method: 'email' | 'otp' | 'google' | 'facebook' | 'biometric';
  createdAt: string;
  lastActiveAt: string;
};

export type AuthToken = {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresInSeconds: number;
};

export type AuthUser = {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  consentAccepted: boolean;
  termsAccepted: boolean;
};

type RegisterInput = {
  name: string;
  email: string;
  phone?: string;
  password: string;
};

type OtpRequestInput = {
  phone: string;
};

type OtpVerifyInput = {
  phone: string;
  otp: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type RefreshInput = {
  refreshToken: string;
};

type SessionRecord = AuthSession & {
  email: string;
};

const users: AuthUser[] = [];
const sessions: SessionRecord[] = [];

function nowIso() {
  return new Date().toISOString();
}

function toSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function makeToken(prefix: string, seed: string) {
  return `${prefix}_${Buffer.from(seed).toString('base64url')}`;
}

function issueTokens(seed: string): AuthToken {
  return {
    accessToken: makeToken('lxc_at', seed),
    refreshToken: makeToken('lxc_rt', seed),
    tokenType: 'Bearer',
    expiresInSeconds: 3600,
  };
}

export function registerUser(input: RegisterInput) {
  const user: AuthUser = {
    userId: `usr_${toSlug(input.email) || Date.now()}`,
    name: input.name,
    email: input.email,
    phone: input.phone,
    consentAccepted: false,
    termsAccepted: false,
  };

  users.push(user);

  return {
    user,
    tokens: issueTokens(`${input.email}:${input.password}`),
  };
}

export function requestOtp(input: OtpRequestInput) {
  return {
    phone: input.phone,
    otpReference: `otp_${toSlug(input.phone)}`,
    delivery: 'sms',
    expiresInSeconds: 300,
  };
}

export function verifyOtp(input: OtpVerifyInput) {
  const user = users[0] ?? {
    userId: 'usr_demo',
    name: 'MyHealthHub User',
    email: 'demo@lexvoraconsulting.com',
    phone: input.phone,
    consentAccepted: false,
    termsAccepted: false,
  };

  return {
    user,
    tokens: issueTokens(`${input.phone}:${input.otp}`),
  };
}

export function emailLogin(input: LoginInput) {
  const user = users.find((item) => item.email === input.email) ?? {
    userId: `usr_${toSlug(input.email) || 'demo'}`,
    name: 'MyHealthHub User',
    email: input.email,
    consentAccepted: true,
    termsAccepted: true,
  };

  const session: SessionRecord = {
    sessionId: `ses_${toSlug(input.email) || Date.now()}`,
    userId: user.userId,
    email: input.email,
    product: 'myhealthhub',
    method: 'email',
    createdAt: nowIso(),
    lastActiveAt: nowIso(),
  };

  sessions.push(session);

  return {
    user,
    session,
    tokens: issueTokens(`${input.email}:${input.password}`),
  };
}

export function refreshToken(input: RefreshInput) {
  return issueTokens(input.refreshToken);
}

export function logoutSession(sessionId: string) {
  const index = sessions.findIndex((item) => item.sessionId === sessionId);
  const removed = index >= 0 ? sessions.splice(index, 1)[0] : null;

  return {
    ok: true,
    sessionId,
    removed: Boolean(removed),
  };
}

export function listSessions() {
  return sessions.map(({email, ...session}) => session);
}

export function deleteSession(sessionId: string) {
  return logoutSession(sessionId);
}

export function resetPassword(email: string) {
  return {
    email,
    resetToken: `reset_${toSlug(email)}`,
    expiresInSeconds: 900,
  };
}

export function registerDevice(deviceId: string) {
  return {
    deviceId,
    registered: true,
    registeredAt: nowIso(),
  };
}

export function biometricLogin(userId: string) {
  const user = users.find((item) => item.userId === userId) ?? {
    userId,
    name: 'MyHealthHub User',
    email: `${userId}@example.com`,
    consentAccepted: true,
    termsAccepted: true,
  };

  return {
    user,
    tokens: issueTokens(userId),
  };
}

export function acceptConsent(userId: string) {
  return {
    userId,
    consentAccepted: true,
    acceptedAt: nowIso(),
  };
}

export function acceptTerms(userId: string) {
  return {
    userId,
    termsAccepted: true,
    acceptedAt: nowIso(),
  };
}
