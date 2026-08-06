import { Router } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';

import { prisma } from '../../lib/prisma.js';
import { requireAuthentication, requireRole } from '../auth/auth.middleware.js';

export const peopleRouter = Router();

const createPersonSchema = z.object({
  email: z.string().trim().email(),
  name: z.string().trim().min(2).max(150),
  password: z.string().min(12).max(128),
  role: z.enum(['ADMIN', 'TEACHER', 'STUDENT', 'GUARDIAN']),
  specialty: z.string().trim().min(2).max(120).optional(),
}).superRefine((data, context) => {
  if (data.role === 'TEACHER' && !data.specialty) context.addIssue({ code: 'custom', message: 'Especialidade é obrigatória para Professor.', path: ['specialty'] });
});

peopleRouter.get('/', requireAuthentication, requireRole('ADMIN'), async (request, response, next) => {
  try {
    const role = typeof request.query.role === 'string' ? request.query.role : undefined;
    const search = typeof request.query.search === 'string' ? request.query.search.trim() : undefined;
    const users = await prisma.user.findMany({
      where: { ...(role && ['ADMIN', 'TEACHER', 'STUDENT', 'GUARDIAN'].includes(role) ? { role: role as 'ADMIN' | 'TEACHER' | 'STUDENT' | 'GUARDIAN' } : {}), ...(search ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }] } : {}) },
      select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
      orderBy: { name: 'asc' },
      take: 200,
    });
    response.status(200).json({ people: users });
  } catch (error) {
    next(error);
  }
});

peopleRouter.post('/', requireAuthentication, requireRole('ADMIN'), async (request, response, next) => {
  try {
    const data = createPersonSchema.parse(request.body);
    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
        ...(data.role === 'TEACHER' ? { teacher: { create: { specialty: data.specialty! } } } : data.role === 'STUDENT' ? { student: { create: {} } } : data.role === 'GUARDIAN' ? { guardian: { create: {} } } : {}),
      },
      select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
    });
    response.status(201).json({ person: user });
  } catch (error) {
    next(error);
  }
});
