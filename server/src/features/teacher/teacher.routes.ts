import { Router } from 'express';

import { prisma } from '../../lib/prisma.js';
import { requireAuthentication, requireRole } from '../auth/auth.middleware.js';

export const teacherRouter = Router();

teacherRouter.get('/overview', requireAuthentication, requireRole('TEACHER'), async (request, response, next) => {
  try {
    const teacher = await prisma.teacher.findUnique({ where: { userId: request.auth!.sub }, select: { id: true } });
    if (!teacher) {
      response.status(404).json({ message: 'Perfil de professor não encontrado.' });
      return;
    }

    const [upcomingLessons, students] = await Promise.all([
      prisma.lesson.findMany({ where: { teacherId: teacher.id, startsAt: { gte: new Date() }, status: { in: ['CONFIRMED', 'RESCHEDULED'] } }, orderBy: { startsAt: 'asc' }, take: 8, include: { course: { select: { name: true } }, room: { select: { name: true } }, students: { include: { student: { include: { user: { select: { name: true } } } } } } } }),
      prisma.lessonStudent.findMany({ where: { lesson: { teacherId: teacher.id } }, distinct: ['studentId'], select: { studentId: true } }),
    ]);

    response.status(200).json({
      activeStudents: students.length,
      upcomingLessons: upcomingLessons.map((lesson) => ({ id: lesson.id, course: lesson.course.name, room: lesson.room?.name ?? null, startsAt: lesson.startsAt, endsAt: lesson.endsAt, status: lesson.status, students: lesson.students.map(({ student }) => ({ id: student.id, name: student.user.name })) })),
    });
  } catch (error) {
    next(error);
  }
});
