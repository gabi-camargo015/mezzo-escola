import { Router } from 'express';
import { z } from 'zod';

import { prisma } from '../../lib/prisma.js';
import { requireAuthentication, requireRole } from '../auth/auth.middleware.js';

const monthSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Mês deve usar o formato AAAA-MM.');

export const teacherPaymentRouter = Router();

teacherPaymentRouter.get('/estimate', requireAuthentication, requireRole('ADMIN', 'TEACHER'), async (request, response, next) => {
  try {
    const month = monthSchema.parse(typeof request.query.month === 'string' ? request.query.month : currentMonth());
    const teacherId = await resolveTeacherId(request.auth!.role, request.auth!.sub, request.query.teacherId);
    const [year, monthIndex] = month.split('-').map(Number);
    const startsAt = new Date(year!, monthIndex! - 1, 1);
    const endsAt = new Date(year!, monthIndex!, 1);
    const [plan, lessons] = await Promise.all([
      prisma.teacherCompensation.findFirst({ where: { teacherId, active: true, effectiveFrom: { lte: endsAt } }, orderBy: { effectiveFrom: 'desc' } }),
      prisma.lesson.findMany({ where: { teacherId, startsAt: { gte: startsAt, lt: endsAt }, status: 'TAUGHT' }, select: { startsAt: true, endsAt: true } }),
    ]);
    if (!plan) {
      response.status(404).json({ message: 'Nenhum plano de remuneração vigente foi encontrado.' });
      return;
    }

    const hoursWorked = lessons.reduce((total, lesson) => total + (lesson.endsAt.getTime() - lesson.startsAt.getTime()) / 3_600_000, 0);
    const rate = Number(plan.rate);
    const amount = plan.type === 'HOURLY' ? hoursWorked * rate : plan.type === 'PER_LESSON' ? lessons.length * rate : plan.type === 'FIXED' ? rate : null;
    response.status(200).json({ month, type: plan.type, lessonsTaught: lessons.length, hoursWorked, rateInCents: Math.round(rate * 100), amountInCents: amount === null ? null : Math.round(amount * 100), requiresManualCalculation: plan.type === 'PERCENTAGE' });
  } catch (error) {
    next(error);
  }
});

async function resolveTeacherId(role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'GUARDIAN', userId: string, queryTeacherId: unknown) {
  if (role === 'ADMIN') return z.string().min(1, 'Informe o professor para calcular a remuneração.').parse(queryTeacherId);
  const teacher = await prisma.teacher.findUnique({ where: { userId }, select: { id: true } });
  if (!teacher) throw new Error('Perfil de professor não encontrado.');
  return teacher.id;
}

function currentMonth() { return new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit' }).format(new Date()); }
