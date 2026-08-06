import { apiBaseUrl } from '../auth/auth.api';

export interface Person { active: boolean; createdAt: string; email: string; id: string; name: string; role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'GUARDIAN'; }

export async function fetchPeople(accessToken: string, filters: { role?: string; search?: string } = {}): Promise<Person[]> {
  const parameters = new URLSearchParams();
  if (filters.role) parameters.set('role', filters.role);
  if (filters.search) parameters.set('search', filters.search);
  const response = await fetch(`${apiBaseUrl}/api/people?${parameters.toString()}`, { headers: { Authorization: `Bearer ${accessToken}` }, credentials: 'include' });
  if (!response.ok) throw new Error('Não foi possível carregar os cadastros.');
  return (await response.json() as { people: Person[] }).people;
}

export async function createPerson(accessToken: string, input: { email: string; name: string; password: string; role: Person['role']; specialty?: string }): Promise<Person> {
  const response = await fetch(`${apiBaseUrl}/api/people`, { method: 'POST', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(input) });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(body?.message ?? 'Não foi possível criar o cadastro.');
  }
  return (await response.json() as { person: Person }).person;
}
