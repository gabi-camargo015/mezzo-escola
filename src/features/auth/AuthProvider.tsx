import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';

import { authApi, type AuthenticatedUser, type PortalRole } from './auth.api';

interface AuthContextValue {
  accessToken?: string;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthenticatedUser>;
  logout: () => Promise<void>;
  user?: AuthenticatedUser;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [accessToken, setAccessToken] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthenticatedUser>();

  const login = useCallback(async (email: string, password: string) => {
    const session = await authApi.login(email, password);
    setAccessToken(session.accessToken);
    setUser(session.user);
    return session.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setAccessToken(undefined);
      setUser(undefined);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const session = await authApi.refresh();
        const payload = parseAccessToken(session.accessToken);
        setAccessToken(session.accessToken);
        setUser(payload ? { id: payload.sub, email: payload.email, name: '', role: payload.role } : undefined);
      } catch {
        setAccessToken(undefined);
        setUser(undefined);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const value = useMemo(() => ({ accessToken, isLoading, login, logout, user }), [accessToken, isLoading, login, logout, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Este hook pertence ao contexto de autenticação e é exportado intencionalmente.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return context;
}

// Mapeamento de rota compartilhado entre login e guardas de perfil.
// eslint-disable-next-line react-refresh/only-export-components
export function portalPathForRole(role: PortalRole): string {
  return { ADMIN: '/portal/admin', TEACHER: '/portal/professor', STUDENT: '/portal/aluno', GUARDIAN: '/portal/responsavel' }[role];
}

function parseAccessToken(token: string): { email: string; role: PortalRole; sub: string } | undefined {
  try {
    const base64Payload = token.split('.')[1];
    if (!base64Payload) return undefined;
    const payload = JSON.parse(atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'))) as { email?: string; role?: PortalRole; sub?: string };
    if (!payload.email || !payload.role || !payload.sub) return undefined;
    return { email: payload.email, role: payload.role, sub: payload.sub };
  } catch {
    return undefined;
  }
}
