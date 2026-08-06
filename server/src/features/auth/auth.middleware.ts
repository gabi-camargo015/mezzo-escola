import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { verifyAccessToken, type AccessTokenPayload } from './tokens.js';

declare global {
  namespace Express {
    interface Request {
      auth?: AccessTokenPayload;
    }
  }
}

export function requireAuthentication(request: Request, response: Response, next: NextFunction): void {
  const authorization = request.header('authorization');
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : undefined;

  if (!token) {
    response.status(401).json({ message: 'Autenticação necessária.' });
    return;
  }

  try {
    request.auth = verifyAccessToken(token);
    next();
  } catch (error) {
    const message = error instanceof jwt.TokenExpiredError ? 'Sessão expirada. Entre novamente.' : 'Token de acesso inválido.';
    response.status(401).json({ message });
  }
}

export function requireRole(...roles: AccessTokenPayload['role'][]) {
  return (request: Request, response: Response, next: NextFunction): void => {
    if (!request.auth) {
      response.status(401).json({ message: 'Autenticação necessária.' });
      return;
    }

    if (!roles.includes(request.auth.role)) {
      response.status(403).json({ message: 'Você não tem permissão para esta operação.' });
      return;
    }

    next();
  };
}
