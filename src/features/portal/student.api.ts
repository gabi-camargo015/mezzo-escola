import { apiBaseUrl } from '../auth/auth.api';

export interface StudentOverview {
  attendance: { absent: number; present: number; total: number };
  invoices: Array<{ amountInCents: number; description: string; dueDate: string; id: string; status: 'PENDING' | 'OVERDUE' }>;
  upcomingLessons: Array<{ course: string; endsAt: string; id: string; room: string | null; startsAt: string; status: string; teacher: string }>;
}

export async function fetchStudentOverview(accessToken: string): Promise<StudentOverview> {
  const response = await fetch(`${apiBaseUrl}/api/student/overview`, { headers: { Authorization: `Bearer ${accessToken}` }, credentials: 'include' });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(body?.message ?? 'Não foi possível carregar as informações do aluno.');
  }
  return response.json() as Promise<StudentOverview>;
}
