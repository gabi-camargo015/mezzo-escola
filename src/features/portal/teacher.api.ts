import { apiBaseUrl } from '../auth/auth.api';

export interface TeacherOverview {
  activeStudents: number;
  upcomingLessons: Array<{ course: string; endsAt: string; id: string; room: string | null; startsAt: string; status: string; students: Array<{ id: string; name: string }> }>;
}

export async function fetchTeacherOverview(accessToken: string): Promise<TeacherOverview> {
  const response = await fetch(`${apiBaseUrl}/api/teacher/overview`, { headers: { Authorization: `Bearer ${accessToken}` }, credentials: 'include' });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(body?.message ?? 'Não foi possível carregar as informações do professor.');
  }
  return response.json() as Promise<TeacherOverview>;
}
