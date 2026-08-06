import { Router } from 'express';
import { z } from 'zod';

import { prisma } from '../../lib/prisma.js';
import { requireAuthentication, requireRole } from '../auth/auth.middleware.js';

const publicLeadSchema = z.object({
  email: z.string().trim().email(),
  interest: z.string().trim().min(1).max(100),
  message: z.string().trim().min(10).max(2_000),
  name: z.string().trim().min(2).max(150),
  phone: z.string().trim().min(8).max(40),
});
const statusSchema = z.object({ status: z.enum(['NEW', 'CONTACTED', 'TRIAL_SCHEDULED', 'WON', 'LOST']) });

export const leadRouter = Router();

leadRouter.post('/public', async (request, response, next) => {
  try {
    const { message, ...data } = publicLeadSchema.parse(request.body);
    const lead = await prisma.lead.create({ data: { ...data, notes: message } });
    response.status(201).json({ id: lead.id, message: 'Recebemos sua mensagem. A equipe entrará em contato.' });
  } catch (error) {
    next(error);
  }
});

leadRouter.get('/', requireAuthentication, requireRole('ADMIN'), async (_request, response, next) => {
  try {
    const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
    response.status(200).json({ leads });
  } catch (error) {
    next(error);
  }
});

leadRouter.patch('/:leadId/status', requireAuthentication, requireRole('ADMIN'), async (request, response, next) => {
  try {
    const leadId = z.string().min(1).parse(request.params.leadId);
    const lead = await prisma.lead.update({ where: { id: leadId }, data: statusSchema.parse(request.body) });
    response.status(200).json({ lead });
  } catch (error) {
    next(error);
  }
});
