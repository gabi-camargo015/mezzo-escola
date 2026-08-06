import { apiBaseUrl } from '../auth/auth.api';

export async function recordAttendance(accessToken: string, input: { lessonId: string; observation?: string; present: boolean; studentId: string }): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/api/attendance/${input.lessonId}`, { method: 'POST', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ studentId: input.studentId, present: input.present, observation: input.observation }) });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(body?.message ?? 'Não foi possível registrar a frequência.');
  }
}
