import { apiBaseUrl } from '../auth/auth.api';

export interface FinanceSummary {
  pendingExpenses: Array<{ amountInCents: number; category: string; description: string; dueDate: string; id: string }>;
  receivables: Array<{ amountInCents: number; description: string; dueDate: string; id: string; status: 'PENDING' | 'OVERDUE' }>;
  summary: { balanceInCents: number; paidExpensesInCents: number; revenueInCents: number };
}

export async function fetchFinanceSummary(accessToken: string): Promise<FinanceSummary> {
  const response = await fetch(`${apiBaseUrl}/api/finance/summary`, { headers: { Authorization: `Bearer ${accessToken}` }, credentials: 'include' });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(body?.message ?? 'Não foi possível carregar o financeiro.');
  }
  return response.json() as Promise<FinanceSummary>;
}

export async function createExpense(accessToken: string, input: { amountInCents: number; category: string; description: string; dueDate: string }): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/api/finance/expenses`, { method: 'POST', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(input) });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(body?.message ?? 'Não foi possível lançar a despesa.');
  }
}

export async function createInvoice(accessToken: string, input: { amountInCents: number; description: string; dueDate: string; studentId: string }): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/api/finance/invoices`, { method: 'POST', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(input) });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(body?.message ?? 'Não foi possível emitir a fatura.');
  }
}

export async function fetchActiveStudents(accessToken: string): Promise<Array<{ id: string; name: string }>> {
  const response = await fetch(`${apiBaseUrl}/api/lessons/options`, { headers: { Authorization: `Bearer ${accessToken}` }, credentials: 'include' });
  if (!response.ok) throw new Error('Não foi possível carregar os alunos.');
  const body = await response.json() as { students: Array<{ id: string; name: string }> };
  return body.students;
}
