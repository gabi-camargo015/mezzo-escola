import { Router } from 'express';

import { prisma } from '../../lib/prisma.js';
import { requireAuthentication, requireRole } from '../auth/auth.middleware.js';

export const guardianRouter = Router();

guardianRouter.get('/overview', requireAuthentication, requireRole('GUARDIAN'), async (request, response, next) => {
  try {
    const guardian = await prisma.guardian.findUnique({ where: { userId: request.auth!.sub }, include: { students: { include: { student: { include: { user: { select: { name: true } } } } } } } });
    if (!guardian) {
      response.status(404).json({ message: 'Perfil de responsável não encontrado.' });
      return;
    }

    const studentIds = guardian.students.map(({ studentId }) => studentId);
    const [upcomingLessons, invoices, attendance] = await Promise.all([
      prisma.lessonStudent.findMany({ where: { studentId: { in: studentIds }, lesson: { startsAt: { gte: new Date() }, status: { in: ['CONFIRMED', 'RESCHEDULED'] } } }, orderBy: { lesson: { startsAt: 'asc' } }, take: 10, include: { student: { include: { user: { select: { name: true } } } }, lesson: { include: { course: { select: { name: true } }, teacher: { include: { user: { select: { name: true } } } } } } } }),
      prisma.invoice.findMany({ where: { studentId: { in: studentIds }, status: { in: ['PENDING', 'OVERDUE'] } }, orderBy: { dueDate: 'asc' }, take: 10, include: { student: { include: { user: { select: { name: true } } } } } }),
      prisma.attendance.groupBy({ by: ['present'], where: { studentId: { in: studentIds } }, _count: { _all: true } }),
    ]);
    const attendanceCounts = new Map(attendance.map((entry) => [entry.present, entry._count._all]));
    const present = attendanceCounts.get(true) ?? 0;
    const absent = attendanceCounts.get(false) ?? 0;

    response.status(200).json({
      attendance: { absent, present, total: present + absent },
      students: guardian.students.map(({ student }) => ({ id: student.id, name: student.user.name })),
      invoices: invoices.map(({ amount, student, ...invoice }) => ({ ...invoice, amountInCents: Math.round(Number(amount) * 100), student: student.user.name })),
      upcomingLessons: upcomingLessons.map(({ student, lesson }) => ({ id: lesson.id, student: student.user.name, course: lesson.course.name, teacher: lesson.teacher.user.name, startsAt: lesson.startsAt, endsAt: lesson.endsAt, status: lesson.status })),
    });
  } catch (error) {
    next(error);
  }
});
