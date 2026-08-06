import { Router } from 'express';
import { z } from 'zod';

import { prisma } from '../../lib/prisma.js';
import { requireAuthentication, requireRole } from '../auth/auth.middleware.js';

const expenseSchema = z.object({
  amountInCents: z.number().int().positive(),
  category: z.string().trim().min(2).max(100),
  description: z.string().trim().min(2).max(500),
  dueDate: z.coerce.date(),
});
const invoiceSchema = z.object({
  amountInCents: z.number().int().positive(),
  description: z.string().trim().min(2).max(500),
  dueDate: z.coerce.date(),
  studentId: z.string().min(1),
});

export const financeRouter = Router();

financeRouter.get('/summary', requireAuthentication, requireRole('ADMIN'), async (_request, response, next) => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const [revenue, paidExpenses, pendingExpenses, receivables] = await Promise.all([
      prisma.payment.aggregate({ where: { paidAt: { gte: monthStart, lt: monthEnd } }, _sum: { amount: true } }),
      prisma.expense.aggregate({ where: { paidAt: { gte: monthStart, lt: monthEnd }, status: 'PAID' }, _sum: { amount: true } }),
      prisma.expense.findMany({ where: { status: 'PENDING' }, orderBy: { dueDate: 'asc' }, take: 10, select: { id: true, description: true, category: true, dueDate: true, amount: true } }),
      prisma.invoice.findMany({ where: { status: { in: ['PENDING', 'OVERDUE'] } }, orderBy: { dueDate: 'asc' }, take: 10, select: { id: true, description: true, dueDate: true, amount: true, status: true } }),
    ]);
    const revenueInCents = toCents(revenue._sum.amount);
    const paidExpensesInCents = toCents(paidExpenses._sum.amount);
    response.status(200).json({
      summary: { revenueInCents, paidExpensesInCents, balanceInCents: revenueInCents - paidExpensesInCents },
      pendingExpenses: pendingExpenses.map(({ amount, ...expense }) => ({ ...expense, amountInCents: toCents(amount) })),
      receivables: receivables.map(({ amount, ...invoice }) => ({ ...invoice, amountInCents: toCents(amount) })),
    });
  } catch (error) {
    next(error);
  }
});

financeRouter.post('/expenses', requireAuthentication, requireRole('ADMIN'), async (request, response, next) => {
  try {
    const data = expenseSchema.parse(request.body);
    const expense = await prisma.expense.create({ data: { description: data.description, category: data.category, dueDate: data.dueDate, amount: data.amountInCents / 100 } });
    const { amount, ...expenseData } = expense;
    response.status(201).json({ expense: { ...expenseData, amountInCents: toCents(amount) } });
  } catch (error) {
    next(error);
  }
});

financeRouter.post('/invoices', requireAuthentication, requireRole('ADMIN'), async (request, response, next) => {
  try {
    const data = invoiceSchema.parse(request.body);
    const invoice = await prisma.invoice.create({ data: { studentId: data.studentId, description: data.description, dueDate: data.dueDate, amount: data.amountInCents / 100 } });
    const { amount, ...invoiceData } = invoice;
    response.status(201).json({ invoice: { ...invoiceData, amountInCents: toCents(amount) } });
  } catch (error) {
    next(error);
  }
});

function toCents(amount: { toString(): string } | null) {
  return Math.round(Number(amount?.toString() ?? 0) * 100);
}
