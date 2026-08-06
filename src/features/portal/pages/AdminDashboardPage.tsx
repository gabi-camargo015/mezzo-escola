import { AlertTriangle, CalendarDays, CircleDollarSign, GraduationCap, UsersRound } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useAuth } from '../../auth/AuthProvider';
import { fetchAdminDashboard, type AdminDashboardSummary } from '../dashboard.api';

export function AdminDashboardPage() {
  const { accessToken, user } = useAuth();
  const [dashboard, setDashboard] = useState<AdminDashboardSummary>();
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    if (!accessToken) return;
    void fetchAdminDashboard(accessToken).then(setDashboard).catch((error: unknown) => setErrorMessage(error instanceof Error ? error.message : 'Não foi possível carregar o dashboard.'));
  }, [accessToken]);

  const name = user?.name || user?.email || 'Administração';
  const metrics = [
    { label: 'Alunos ativos', icon: GraduationCap, value: dashboard?.metrics.activeStudents.toLocaleString('pt-BR') },
    { label: 'Professores ativos', icon: UsersRound, value: dashboard?.metrics.activeTeachers.toLocaleString('pt-BR') },
    { label: 'Receita do mês', icon: CircleDollarSign, value: dashboard ? formatCurrency(dashboard.metrics.monthlyRevenueInCents) : undefined },
    { label: 'Aulas de hoje', icon: CalendarDays, value: dashboard?.lessonsToday.length.toLocaleString('pt-BR') },
  ];

  return <main className="px-6 py-20 lg:px-10 lg:py-10"><p className="text-xs font-bold tracking-[.18em] text-mezzo-purple">ADMINISTRAÇÃO</p><h1 className="mt-2 font-display text-4xl font-bold tracking-[-.04em]">Olá, {name}.</h1><p className="mt-3 text-stone-600">Acompanhe os indicadores essenciais da escola em um só lugar.</p>{errorMessage && <p className="mt-6 rounded-md bg-red-50 p-4 text-sm font-medium text-red-800" role="alert">{errorMessage}</p>}<section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicadores operacionais">{metrics.map(({ icon: Icon, label, value }) => <article className="rounded-2xl border border-mezzo-purple/15 bg-white p-6 shadow-sm" key={label}><div className="flex items-start justify-between"><p className="text-sm font-bold text-stone-600">{label}</p><Icon className="text-mezzo-purple" size={20} aria-hidden="true" /></div><p className="mt-7 font-display text-3xl font-bold text-mezzo-ink">{value ?? '—'}</p><p className="mt-1 text-xs text-stone-500">{dashboard ? 'Atualizado com dados reais.' : 'Carregando dados...'}</p></article>)}</section><section className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_.8fr]"><article className="rounded-2xl bg-white p-7 shadow-sm"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold tracking-[.16em] text-mezzo-purple">AGENDA</p><h2 className="mt-2 font-display text-3xl font-bold">Aulas de hoje</h2></div><CalendarDays className="text-mezzo-purple" aria-hidden="true" /></div>{!dashboard && <p className="mt-7 text-sm text-stone-600">Carregando agenda...</p>}{dashboard?.lessonsToday.length === 0 && <div className="mt-7 rounded-xl border border-dashed border-mezzo-purple/25 p-8 text-center"><p className="font-semibold">Nenhuma aula para hoje.</p><p className="mt-2 text-sm text-stone-600">Cadastre aulas na agenda para que apareçam nesta visão.</p></div>}{dashboard && dashboard.lessonsToday.length > 0 && <ul className="mt-6 divide-y divide-mezzo-purple/10">{dashboard.lessonsToday.map((lesson) => <li className="flex flex-wrap items-center justify-between gap-3 py-4" key={lesson.id}><div><p className="font-bold">{lesson.course}</p><p className="mt-1 text-sm text-stone-600">{lesson.teacher}{lesson.room ? ` · ${lesson.room}` : ''}</p></div><time className="text-sm font-bold text-mezzo-purple" dateTime={lesson.startsAt}>{formatTime(lesson.startsAt)}–{formatTime(lesson.endsAt)}</time></li>)}</ul>}</article><article className="rounded-2xl bg-mezzo-purple p-7 text-white"><div className="flex items-center gap-3"><AlertTriangle className="text-mezzo-yellow" aria-hidden="true" /><div><p className="text-xs font-bold tracking-[.16em] text-mezzo-yellow">ATENÇÃO</p><h2 className="mt-1 font-display text-2xl font-bold">Alertas operacionais</h2></div></div><div className="mt-7 rounded-xl border border-white/15 p-5 text-sm text-white/75">{dashboard ? `${dashboard.metrics.overdueInvoices} fatura(s) em atraso no momento.` : 'Carregando alertas financeiros...'}</div></article></section></main>;
}

function formatCurrency(amountInCents: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amountInCents / 100);
}

function formatTime(date: string) {
  return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(date));
}
