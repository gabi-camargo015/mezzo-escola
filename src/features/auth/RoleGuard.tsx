import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { portalPathForRole, useAuth } from './AuthProvider';
import type { PortalRole } from './auth.api';

interface RoleGuardProps {
  allowedRoles: PortalRole[];
  children: ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { isLoading, user } = useAuth();

  if (isLoading) return <main className="grid min-h-screen place-items-center bg-stone-100 text-mezzo-purple">Carregando sessão...</main>;
  if (!user) return <Navigate replace to="/portal/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate replace to={portalPathForRole(user.role)} />;
  return <>{children}</>;
}
