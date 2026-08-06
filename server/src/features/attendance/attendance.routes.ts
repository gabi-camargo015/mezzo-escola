import { Router } from 'express';
import { z } from 'zod';

import { prisma } from '../../lib/prisma.js';
import { requireAuthentication, requireRole } from '../auth/auth.middleware.js';

const attendanceSchema = z.object({ observation: z.string().trim().max(2_000).optional(), present: z.boolean(), studentId: z.string().min(1) });

export const attendanceRouter = Router();

attendanceRouter.post('/:lessonId', requireAuthentication, requireRole('TEACHER'), async (request, response, next) => {
  try {
    const lessonId = z.string().min(1).parse(request.params.lessonId);
    const data = attendanceSchema.parse(request.body);
    const teacher = await prisma.teacher.findUnique({ where: { userId: request.auth!.sub }, select: { id: true } });
    if (!teacher) {
      response.status(404).json({ message: 'Perfil de professor não encontrado.' });
      return;
    }

    const lessonStudent = await prisma.lessonStudent.findFirst({ where: { lessonId, studentId: data.studentId, lesson: { teacherId: teacher.id } }, select: { lessonId: true } });
    if (!lessonStudent) {
      response.status(403).json({ message: 'Aula ou aluno não pertence à sua agenda.' });
      return;
    }

    const [, attendance] = await prisma.$transaction([
      prisma.lesson.update({ where: { id: lessonId }, data: { status: 'TAUGHT' } }),
      prisma.attendance.upsert({ where: { lessonId_studentId: { lessonId, studentId: data.studentId } }, create: { lessonId, studentId: data.studentId, teacherId: teacher.id, present: data.present, observation: data.observation }, update: { teacherId: teacher.id, present: data.present, observation: data.observation } }),
    ]);
    response.status(200).json({ attendance });
  } catch (error) {
    next(error);
  }
});
