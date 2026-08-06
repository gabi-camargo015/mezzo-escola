import jwt, { type SignOptions } from 'jsonwebtoken';

import { env } from '../../config/env.js';

export interface AccessTokenPayload {
  email: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'GUARDIAN';
  sub: string;
}

export function createAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'] });
}

export function createRefreshToken(userId: string): string {
  return jwt.sign({ sub: userId, type: 'refresh' }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'] });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): { sub: string; type: 'refresh' } {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { sub: string; type: 'refresh' };
}
