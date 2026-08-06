import { CalendarDays, LayoutDashboard, LogOut, Menu, MessageSquareText, ReceiptText, UsersRound, X } from 'lucide-react';
import { useState } from 'react';
import { Navigate, NavLink, Outlet } from 'react-router-dom';

import { portalPathForRole, useAuth } from '../auth/AuthProvider';

const menuByRole = {
  ADMIN: [{ label: 'Visão geral', to: '/portal/admin', icon: LayoutDashboard }, { label: 'Agenda', to: '/portal/admin/agenda', icon: CalendarDays }, { label: 'Pessoas', to: '/portal/admin/pessoas', icon: UsersRound }, { label: 'CRM', to: '/portal/admin/crm', icon: MessageSquareText }, { label: 'Financeiro', to: '/portal/admin/financeiro', icon: ReceiptText }, { label: 'Comunicação', to: '/portal/admin/comunicacao', icon: MessageSquareText }],
  TEACHER: [{ label: 'Minha agenda', to: '/portal/professor', icon: CalendarDays }, { label: 'Alunos', to: '/portal/professor/alunos', icon: UsersRound }, { label: 'Pagamentos', to: '/portal/professor/pagamentos', icon: ReceiptText }, { label: 'Mensagens', to: '/portal/professor/mensagens', icon: MessageSquareText }],
  STUDENT: [{ label: 'Início', to: '/portal/aluno', icon: LayoutDashboard }, { label: 'Agenda', to: '/portal/aluno/agenda', icon: CalendarDays }, { label: 'Financeiro', to: '/portal/aluno/financeiro', icon: ReceiptText }, { label: 'Comunicados', to: '/portal/aluno/comunicados', icon: MessageSquareText }],
  GUARDIAN: [{ label: 'Início', to: '/portal/responsavel', icon: LayoutDashboard }, { label: 'Agenda', to: '/portal/responsavel/agenda', icon: CalendarDays }, { label: 'Financeiro', to: '/portal/responsavel/financeiro', icon: ReceiptText }, { label: 'Comunicados', to: '/portal/responsavel/comunicados', icon: MessageSquareText }],
};

export function PortalLayout() {
  const { isLoading, logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  if (isLoading) return <main className="grid min-h-screen place-items-center bg-stone-100 text-mezzo-purple">Carregando sessão...</main>;
  if (!user) return <Navigate replace to="/portal/login" />;
  const items = menuByRole[user.role];
  const displayName = user.name || user.email;

  return <div className="min-h-screen bg-stone-100 text-mezzo-ink"><button className="fixed left-4 top-4 z-40 rounded-md bg-mezzo-ink p-2 text-white lg:hidden" type="button" aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'} onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X /> : <Menu />}</button><aside className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-30 flex w-72 flex-col bg-mezzo-ink p-6 text-white transition-transform lg:translate-x-0`}><NavLink className="flex items-center gap-2 font-display text-2xl font-bold tracking-[.06em]" to={portalPathForRole(user.role)}><span className="grid size-9 place-items-center rounded-full bg-mezzo-yellow text-mezzo-ink">M</span>MEZZO</NavLink><p className="mt-8 text-xs font-bold tracking-[.18em] text-mezzo-yellow">{roleLabel(user.role)}</p><nav className="mt-4 space-y-1" aria-label="Navegação do portal">{items.map(({ icon: Icon, label, to }) => <NavLink className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition ${isActive ? 'bg-mezzo-purple text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`} end={to === portalPathForRole(user.role)} key={to} onClick={() => setIsOpen(false)} to={to}><Icon size={18} aria-hidden="true" />{label}</NavLink>)}</nav><div className="mt-auto border-t border-white/15 pt-5"><p className="truncate text-sm font-bold">{displayName}</p><p className="mt-1 text-xs text-white/60">{user.email}</p><button className="mt-4 flex items-center gap-2 text-sm font-semibold text-white/75 hover:text-mezzo-yellow" type="button" onClick={() => void logout()}><LogOut size={17} />Sair</button></div></aside><div className="min-h-screen lg:pl-72"><Outlet /></div></div>;
}

function roleLabel(role: keyof typeof menuByRole) {
  return { ADMIN: 'ADMINISTRAÇÃO', TEACHER: 'PROFESSOR(A)', STUDENT: 'ALUNO(A)', GUARDIAN: 'RESPONSÁVEL' }[role];
}
