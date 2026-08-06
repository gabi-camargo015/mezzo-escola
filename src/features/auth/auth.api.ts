export type PortalRole = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'GUARDIAN';

export interface AuthenticatedUser {
  email: string;
  id: string;
  name: string;
  role: PortalRole;
}

interface LoginResponse {
  accessToken: string;
  user: AuthenticatedUser;
}

export const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3333';

async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...init.headers },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(body?.message ?? 'Não foi possível concluir a solicitação.');
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const authApi = {
  login: (email: string, password: string) => apiRequest<LoginResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => apiRequest<void>('/api/auth/logout', { method: 'POST' }),
  refresh: () => apiRequest<Pick<LoginResponse, 'accessToken'>>('/api/auth/refresh', { method: 'POST' }),
};
