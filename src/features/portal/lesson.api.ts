import { apiBaseUrl } from '../auth/auth.api';

export interface ScheduledLesson {
  course: string;
  endsAt: string;
  id: string;
  notes: string | null;
  room: string | null;
  startsAt: string;
  status: string;
  students: Array<{ id: string; name: string }>;
  teacher: string;
}

export interface LessonOptions {
  courses: Array<{ id: string; name: string }>;
  rooms: Array<{ id: string; name: string }>;
  students: Array<{ id: string; name: string }>;
  teachers: Array<{ id: string; name: string; specialty: string }>;
}

export async function fetchLessons(accessToken: string): Promise<ScheduledLesson[]> {
  const response = await fetch(`${apiBaseUrl}/api/lessons`, { headers: { Authorization: `Bearer ${accessToken}` }, credentials: 'include' });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(body?.message ?? 'Não foi possível carregar a agenda.');
  }
  const body = await response.json() as { lessons: ScheduledLesson[] };
  return body.lessons;
}

export async function fetchLessonOptions(accessToken: string): Promise<LessonOptions> {
  const response = await fetch(`${apiBaseUrl}/api/lessons/options`, { headers: { Authorization: `Bearer ${accessToken}` }, credentials: 'include' });
  if (!response.ok) throw new Error('Não foi possível carregar opções de agendamento.');
  return response.json() as Promise<LessonOptions>;
}

export async function createLesson(accessToken: string, input: { courseId: string; endsAt: string; notes?: string; roomId?: string; startsAt: string; studentIds: string[]; teacherId: string }): Promise<ScheduledLesson> {
  const response = await fetch(`${apiBaseUrl}/api/lessons`, { method: 'POST', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(input) });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(body?.message ?? 'Não foi possível criar a aula.');
  }
  return (await response.json() as { lesson: ScheduledLesson }).lesson;
}
