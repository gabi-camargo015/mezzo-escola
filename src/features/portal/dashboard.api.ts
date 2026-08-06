import { apiBaseUrl } from '../auth/auth.api';

export interface AdminDashboardSummary {
  lessonsToday: Array<{ course: string; endsAt: string; id: string; room: string | null; startsAt: string; status: string; teacher: string }>;
  metrics: { activeStudents: number; activeTeachers: number; monthlyRevenueInCents: number; overdueInvoices: number };
}

export async function fetchAdminDashboard(accessToken: string): Promise<AdminDashboardSummary> {
  const response = await fetch(`${apiBaseUrl}/api/dashboard/admin/summary`, { headers: { Authorization: `Bearer ${accessToken}` }, credentials: 'include' });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(body?.message ?? 'Não foi possível carregar o dashboard.');
  }
  return response.json() as Promise<AdminDashboardSummary>;
}
