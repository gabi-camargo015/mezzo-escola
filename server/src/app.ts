import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import type { ErrorRequestHandler } from 'express';
import helmet from 'helmet';
import { ZodError } from 'zod';

import { env } from './config/env.js';
import { authRouter } from './features/auth/auth.routes.js';
import { dashboardRouter } from './features/dashboard/dashboard.routes.js';
import { guardianRouter } from './features/guardian/guardian.routes.js';
import { financeRouter } from './features/finance/finance.routes.js';
import { leadRouter } from './features/crm/lead.routes.js';
import { peopleRouter } from './features/people/people.routes.js';
import { announcementRouter } from './features/communication/announcement.routes.js';
import { attendanceRouter } from './features/attendance/attendance.routes.js';
import { lessonRouter } from './features/lessons/lesson.routes.js';
import { studentRouter } from './features/student/student.routes.js';
import { teacherRouter } from './features/teacher/teacher.routes.js';
import { teacherPaymentRouter } from './features/teacher/teacher-payment.routes.js';

export const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.WEB_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));

app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/guardian', guardianRouter);
app.use('/api/finance', financeRouter);
app.use('/api/leads', leadRouter);
app.use('/api/people', peopleRouter);
app.use('/api/announcements', announcementRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/lessons', lessonRouter);
app.use('/api/student', studentRouter);
app.use('/api/teacher', teacherRouter);
app.use('/api/teacher/payments', teacherPaymentRouter);

app.get('/health', (_request, response) => {
  response.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((_request, response) => {
  response.status(404).json({ message: 'Recurso não encontrado.' });
});

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (env.NODE_ENV !== 'test') console.error(error);
  if (error instanceof ZodError) {
    response.status(400).json({ message: 'Dados inválidos.', fields: error.flatten().fieldErrors });
    return;
  }
  response.status(500).json({ message: 'Ocorreu um erro inesperado. Tente novamente.' });
};

app.use(errorHandler);
