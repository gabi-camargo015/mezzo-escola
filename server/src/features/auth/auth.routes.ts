import { createHash } from 'node:crypto';

import bcrypt from 'bcrypt';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import { env } from '../../config/env.js';
import { prisma } from '../../lib/prisma.js';
import { createAccessToken, createRefreshToken, verifyRefreshToken } from './tokens.js';

const credentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
});

const bootstrapAdministratorSchema = z.object({
  email: z.string().trim().email(),
  name: z.string().trim().min(2).max(150),
  password: z.string().min(12).max(128),
});

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

const refreshCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: env.NODE_ENV === 'production',
  path: '/api/auth',
};

export const authRouter = Router();

/**
 * Initializes the first administrator in a new installation. This endpoint is
 * intentionally unavailable after an administrator exists and requires the
 * private token configured only in the hosting environment.
 */
authRouter.post('/bootstrap-admin', async (request, response, next) => {
  try {
    const bootstrapToken = process.env.INIT_ADMIN_TOKEN;
    if (!bootstrapToken || request.header('x-mezzo-bootstrap-token') !== bootstrapToken) {
      response.status(404).json({ message: 'Recurso não encontrado.' });
      return;
    }

    const existingAdministrator = await prisma.user.findFirst({ where: { role: 'ADMIN' }, select: { id: true } });
    if (existingAdministrator) {
      response.status(409).json({ message: 'O administrador inicial já foi criado.' });
      return;
    }

    const input = bootstrapAdministratorSchema.parse(request.body);
    const existingUser = await prisma.user.findUnique({ where: { email: input.email } });
    if (existingUser) {
      response.status(409).json({ message: 'Já existe uma conta com este e-mail.' });
      return;
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await prisma.user.create({ data: { name: input.name, email: input.email, passwordHash, role: 'ADMIN' } });
    response.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/login', async (request, response, next) => {
  try {
    const credentials = credentialsSchema.parse(request.body);
    const user = await prisma.user.findUnique({ where: { email: credentials.email } });

    if (!user || !user.active || !(await bcrypt.compare(credentials.password, user.passwordHash))) {
      response.status(401).json({ message: 'E-mail ou senha inválidos.' });
      return;
    }

    const refreshToken = createRefreshToken(user.id);
    const decodedRefreshToken = jwt.decode(refreshToken);
    if (!decodedRefreshToken || typeof decodedRefreshToken === 'string' || !decodedRefreshToken.exp) throw new Error('Token de renovação inválido.');
    const expiresAt = new Date(decodedRefreshToken.exp * 1000);

    await prisma.refreshToken.create({ data: { userId: user.id, tokenHash: hashToken(refreshToken), expiresAt } });

    response.cookie('mezzo_refresh_token', refreshToken, { ...refreshCookieOptions, expires: expiresAt });
    response.status(200).json({
      accessToken: createAccessToken({ sub: user.id, email: user.email, role: user.role }),
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/refresh', async (request, response, _next) => {
  try {
    const refreshToken = request.cookies.mezzo_refresh_token as string | undefined;
    if (!refreshToken) {
      response.status(401).json({ message: 'Sessão não encontrada.' });
      return;
    }

    const payload = verifyRefreshToken(refreshToken);
    if (payload.type !== 'refresh') throw new Error('Tipo de token inválido.');

    const persistedToken = await prisma.refreshToken.findUnique({
      where: { tokenHash: hashToken(refreshToken) },
      include: { user: true },
    });
    if (!persistedToken || persistedToken.revokedAt || persistedToken.expiresAt <= new Date() || !persistedToken.user.active) {
      response.clearCookie('mezzo_refresh_token', refreshCookieOptions);
      response.status(401).json({ message: 'Sessão expirada. Entre novamente.' });
      return;
    }

    const nextRefreshToken = createRefreshToken(persistedToken.user.id);
    const decodedNextToken = jwt.decode(nextRefreshToken);
    if (!decodedNextToken || typeof decodedNextToken === 'string' || !decodedNextToken.exp) throw new Error('Token de renovação inválido.');
    const expiresAt = new Date(decodedNextToken.exp * 1000);
    await prisma.$transaction([
      prisma.refreshToken.update({ where: { id: persistedToken.id }, data: { revokedAt: new Date() } }),
      prisma.refreshToken.create({ data: { userId: persistedToken.user.id, tokenHash: hashToken(nextRefreshToken), expiresAt } }),
    ]);

    response.cookie('mezzo_refresh_token', nextRefreshToken, { ...refreshCookieOptions, expires: expiresAt });
    response.status(200).json({ accessToken: createAccessToken({ sub: persistedToken.user.id, email: persistedToken.user.email, role: persistedToken.user.role }) });
  } catch (error) {
    response.clearCookie('mezzo_refresh_token', refreshCookieOptions);
    response.status(401).json({ message: 'Sessão inválida. Entre novamente.' });
  }
});

authRouter.post('/logout', async (request, response, next) => {
  try {
    const refreshToken = request.cookies.mezzo_refresh_token as string | undefined;
    if (refreshToken) {
      await prisma.refreshToken.updateMany({ where: { tokenHash: hashToken(refreshToken), revokedAt: null }, data: { revokedAt: new Date() } });
    }
    response.clearCookie('mezzo_refresh_token', refreshCookieOptions);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});
