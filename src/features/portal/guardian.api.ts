import { apiBaseUrl } from '../auth/auth.api';

export interface GuardianOverview {
  attendance: { absent: number; present: number; total: number };
  invoices: Array<{ amountInCents: number; description: string; dueDate: string; id: string; status: 'PENDING' | 'OVERDUE'; student: string }>;
  students: Array<{ id: string; name: string }>;
  upcomingLessons: Array<{ course: string; endsAt: string; id: string; startsAt: string; status: string; student: string; teacher: string }>;
}

export async function fetchGuardianOverview(accessToken: string): Promise<GuardianOverview> {
  const response = await fetch(`${apiBaseUrl}/api/guardian/overview`, { headers: { Authorization: `Bearer ${accessToken}` }, credentials: 'include' });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(body?.message ?? 'Não foi possível carregar as informações do responsável.');
  }
  return response.json() as Promise<GuardianOverview>;
}
