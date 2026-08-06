import { apiBaseUrl } from '../auth/auth.api';

export interface Announcement { audience: 'ALL' | 'TEACHERS' | 'STUDENTS' | 'GUARDIANS'; content: string; id: string; publishedAt: string; title: string; }

export async function fetchAnnouncements(accessToken: string): Promise<Announcement[]> {
  const response = await fetch(`${apiBaseUrl}/api/announcements`, { headers: { Authorization: `Bearer ${accessToken}` }, credentials: 'include' });
  if (!response.ok) throw new Error('Não foi possível carregar os comunicados.');
  return (await response.json() as { announcements: Announcement[] }).announcements;
}

export async function createAnnouncement(accessToken: string, input: Pick<Announcement, 'audience' | 'content' | 'title'>): Promise<Announcement> {
  const response = await fetch(`${apiBaseUrl}/api/announcements`, { method: 'POST', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(input) });
  if (!response.ok) throw new Error('Não foi possível publicar o comunicado.');
  return (await response.json() as { announcement: Announcement }).announcement;
}
