import { Router } from 'express';

import { prisma } from '../../lib/prisma.js';
import { requireAuthentication, requireRole } from '../auth/auth.middleware.js';

export const dashboardRouter = Router();

dashboardRouter.get('/admin/summary', requireAuthentication, requireRole('ADMIN'), async (_request, response, next) => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const [students, teachers, paidThisMonth, lessonsToday, overdueInvoices] = await Promise.all([
      prisma.student.count({ where: { user: { active: true } } }),
      prisma.teacher.count({ where: { user: { active: true } } }),
      prisma.payment.aggregate({ where: { paidAt: { gte: monthStart } }, _sum: { amount: true } }),
      prisma.lesson.findMany({ where: { startsAt: { gte: dayStart, lt: dayEnd }, status: { not: 'CANCELLED' } }, orderBy: { startsAt: 'asc' }, include: { course: { select: { name: true } }, teacher: { include: { user: { select: { name: true } } } }, room: { select: { name: true } } } }),
      prisma.invoice.count({ where: { status: 'OVERDUE' } }),
    ]);

    response.status(200).json({
      metrics: {
        activeStudents: students,
        activeTeachers: teachers,
        monthlyRevenueInCents: Math.round(Number(paidThisMonth._sum.amount ?? 0) * 100),
        overdueInvoices,
      },
      lessonsToday: lessonsToday.map((lesson) => ({ id: lesson.id, course: lesson.course.name, teacher: lesson.teacher.user.name, room: lesson.room?.name ?? null, startsAt: lesson.startsAt, endsAt: lesson.endsAt, status: lesson.status })),
    });
  } catch (error) {
    next(error);
  }
});
