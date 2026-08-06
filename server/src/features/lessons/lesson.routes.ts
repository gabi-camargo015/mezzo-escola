import { Router } from 'express';
import type { Prisma } from '@prisma/client';
import { z } from 'zod';

import { prisma } from '../../lib/prisma.js';
import { requireAuthentication, requireRole } from '../auth/auth.middleware.js';

const createLessonSchema = z.object({
  courseId: z.string().min(1),
  endsAt: z.coerce.date(),
  notes: z.string().trim().max(2_000).optional(),
  roomId: z.string().min(1).optional(),
  startsAt: z.coerce.date(),
  studentIds: z.array(z.string().min(1)).min(1).max(30),
  teacherId: z.string().min(1),
}).superRefine(({ endsAt, startsAt }, context) => {
  if (endsAt <= startsAt) context.addIssue({ code: 'custom', message: 'O término deve ser posterior ao início da aula.', path: ['endsAt'] });
});

export const lessonRouter = Router();

lessonRouter.get('/options', requireAuthentication, requireRole('ADMIN'), async (_request, response, next) => {
  try {
    const [courses, teachers, rooms, students] = await Promise.all([
      prisma.course.findMany({ where: { active: true }, select: { id: true, name: true }, orderBy: { name: 'asc' } }),
      prisma.teacher.findMany({ where: { user: { active: true } }, select: { id: true, specialty: true, user: { select: { name: true } } }, orderBy: { user: { name: 'asc' } } }),
      prisma.room.findMany({ where: { active: true }, select: { id: true, name: true }, orderBy: { name: 'asc' } }),
      prisma.student.findMany({ where: { user: { active: true } }, select: { id: true, user: { select: { name: true } } }, orderBy: { user: { name: 'asc' } } }),
    ]);
    response.status(200).json({ courses, teachers: teachers.map(({ user, ...teacher }) => ({ ...teacher, name: user.name })), rooms, students: students.map(({ user, ...student }) => ({ ...student, name: user.name })) });
  } catch (error) {
    next(error);
  }
});

lessonRouter.get('/', requireAuthentication, async (request, response, next) => {
  try {
    const auth = request.auth!;
    const where = auth.role === 'ADMIN' ? {} : auth.role === 'TEACHER' ? { teacher: { userId: auth.sub } } : auth.role === 'STUDENT' ? { students: { some: { student: { userId: auth.sub } } } } : { students: { some: { student: { guardians: { some: { guardian: { userId: auth.sub } } } } } } };
    const lessons = await prisma.lesson.findMany({ where, orderBy: { startsAt: 'asc' }, include: lessonIncludes });
    response.status(200).json({ lessons: lessons.map(formatLesson) });
  } catch (error) {
    next(error);
  }
});

lessonRouter.post('/', requireAuthentication, requireRole('ADMIN'), async (request, response, next) => {
  try {
    const data = createLessonSchema.parse(request.body);
    const conflicts = await findConflicts(data);
    if (conflicts.length > 0) {
      response.status(409).json({ message: `Conflito de agenda: ${conflicts.join(', ')}.` });
      return;
    }

    const lesson = await prisma.lesson.create({
      data: { courseId: data.courseId, teacherId: data.teacherId, roomId: data.roomId, startsAt: data.startsAt, endsAt: data.endsAt, notes: data.notes, students: { create: data.studentIds.map((studentId) => ({ studentId })) } },
      include: lessonIncludes,
    });
    response.status(201).json({ lesson: formatLesson(lesson) });
  } catch (error) {
    next(error);
  }
});

const lessonIncludes = { course: { select: { name: true } }, teacher: { include: { user: { select: { name: true } } } }, room: { select: { name: true } }, students: { include: { student: { include: { user: { select: { name: true } } } } } } } as const;

async function findConflicts(data: z.infer<typeof createLessonSchema>): Promise<string[]> {
  const overlappingLessons = await prisma.lesson.findMany({
    where: { startsAt: { lt: data.endsAt }, endsAt: { gt: data.startsAt }, status: { not: 'CANCELLED' }, OR: [{ teacherId: data.teacherId }, ...(data.roomId ? [{ roomId: data.roomId }] : []), { students: { some: { studentId: { in: data.studentIds } } } }] },
    select: { roomId: true, teacherId: true, students: { select: { studentId: true } } },
  });
  const conflicts = new Set<string>();
  for (const lesson of overlappingLessons) {
    if (lesson.teacherId === data.teacherId) conflicts.add('professor indisponível');
    if (data.roomId && lesson.roomId === data.roomId) conflicts.add('sala ocupada');
    if (lesson.students.some(({ studentId }) => data.studentIds.includes(studentId))) conflicts.add('aluno com aula no mesmo horário');
  }
  return [...conflicts];
}

function formatLesson(lesson: Prisma.LessonGetPayload<{ include: typeof lessonIncludes }>) {
  return { id: lesson.id, course: lesson.course.name, teacher: lesson.teacher.user.name, room: lesson.room?.name ?? null, students: lesson.students.map(({ student }) => ({ id: student.id, name: student.user.name })), startsAt: lesson.startsAt, endsAt: lesson.endsAt, status: lesson.status, notes: lesson.notes };
}
