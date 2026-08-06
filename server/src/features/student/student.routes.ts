import { Router } from 'express';

import { prisma } from '../../lib/prisma.js';
import { requireAuthentication, requireRole } from '../auth/auth.middleware.js';

export const studentRouter = Router();

studentRouter.get('/overview', requireAuthentication, requireRole('STUDENT'), async (request, response, next) => {
  try {
    const student = await prisma.student.findUnique({ where: { userId: request.auth!.sub }, select: { id: true } });
    if (!student) {
      response.status(404).json({ message: 'Perfil de aluno não encontrado.' });
      return;
    }

    const [upcomingLessons, invoices, attendance] = await Promise.all([
      prisma.lessonStudent.findMany({ where: { studentId: student.id, lesson: { startsAt: { gte: new Date() }, status: { in: ['CONFIRMED', 'RESCHEDULED'] } } }, orderBy: { lesson: { startsAt: 'asc' } }, take: 5, include: { lesson: { include: { course: { select: { name: true } }, teacher: { include: { user: { select: { name: true } } } }, room: { select: { name: true } } } } } }),
      prisma.invoice.findMany({ where: { studentId: student.id, status: { in: ['PENDING', 'OVERDUE'] } }, orderBy: { dueDate: 'asc' }, take: 5, select: { id: true, description: true, dueDate: true, amount: true, status: true } }),
      prisma.attendance.groupBy({ by: ['present'], where: { studentId: student.id }, _count: { _all: true } }),
    ]);

    const attendanceCounts = new Map(attendance.map((entry) => [entry.present, entry._count._all]));
    const present = attendanceCounts.get(true) ?? 0;
    const absent = attendanceCounts.get(false) ?? 0;
    response.status(200).json({
      attendance: { absent, present, total: present + absent },
      invoices: invoices.map(({ amount, ...invoice }) => ({ ...invoice, amountInCents: Math.round(Number(amount) * 100) })),
      upcomingLessons: upcomingLessons.map(({ lesson }) => ({ id: lesson.id, course: lesson.course.name, teacher: lesson.teacher.user.name, room: lesson.room?.name ?? null, startsAt: lesson.startsAt, endsAt: lesson.endsAt, status: lesson.status })),
    });
  } catch (error) {
    next(error);
  }
});
