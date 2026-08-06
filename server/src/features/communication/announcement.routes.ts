import { Router } from 'express';
import { z } from 'zod';

import { prisma } from '../../lib/prisma.js';
import { requireAuthentication, requireRole } from '../auth/auth.middleware.js';

const announcementSchema = z.object({ audience: z.enum(['ALL', 'TEACHERS', 'STUDENTS', 'GUARDIANS']), content: z.string().trim().min(5).max(5_000), title: z.string().trim().min(3).max(180) });
const audiencesByRole = { ADMIN: undefined, TEACHER: ['ALL', 'TEACHERS'], STUDENT: ['ALL', 'STUDENTS'], GUARDIAN: ['ALL', 'GUARDIANS'] } as const;

export const announcementRouter = Router();

announcementRouter.get('/', requireAuthentication, async (request, response, next) => {
  try {
    const allowedAudiences = audiencesByRole[request.auth!.role];
    const announcements = await prisma.announcement.findMany({ where: allowedAudiences ? { audience: { in: [...allowedAudiences] } } : {}, orderBy: { publishedAt: 'desc' }, take: 50 });
    response.status(200).json({ announcements });
  } catch (error) {
    next(error);
  }
});

announcementRouter.post('/', requireAuthentication, requireRole('ADMIN'), async (request, response, next) => {
  try {
    const announcement = await prisma.announcement.create({ data: announcementSchema.parse(request.body) });
    response.status(201).json({ announcement });
  } catch (error) {
    next(error);
  }
});
