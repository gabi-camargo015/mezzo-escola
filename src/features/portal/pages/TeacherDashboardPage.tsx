import { CalendarDays, Music2, UsersRound } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { useAuth } from '../../auth/AuthProvider';
import { fetchTeacherOverview, type TeacherOverview } from '../teacher.api';

export function TeacherDashboardPage() {
  const { accessToken, user } = useAuth();
  const [overview, setOverview] = useState<TeacherOverview>();
  const [errorMessage, setErrorMessage] = useState<string>();
  useEffect(() => { if (accessToken) void fetchTeacherOverview(accessToken).then(setOverview).catch((error: unknown) => setErrorMessage(error instanceof Error ? error.message : 'Não foi possível carregar sua agenda.')); }, [accessToken]);

  return <main className="px-6 py-20 lg:px-10 lg:py-10"><p className="text-xs font-bold tracking-[.18em] text-mezzo-purple">PORTAL DO PROFESSOR</p><h1 className="mt-2 font-display text-4xl font-bold tracking-[-.04em]">Olá, {user?.name || user?.email}.</h1><p className="mt-3 text-stone-600">Organize aulas, acompanhe alunos e registre sua prática pedagógica.</p>{errorMessage && <p className="mt-6 rounded-md bg-red-50 p-4 text-sm font-medium text-red-800" role="alert">{errorMessage}</p>}<section className="mt-10 grid gap-4 sm:grid-cols-2"><Metric icon={<CalendarDays />} label="Próximas aulas" value={overview?.upcomingLessons.length.toLocaleString() ?? '—'} /><Metric icon={<UsersRound />} label="Alunos vinculados" value={overview?.activeStudents.toLocaleString() ?? '—'} /></section><section className="mt-8 rounded-2xl bg-white p-7 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-xs font-bold tracking-[.16em] text-mezzo-purple">AGENDA</p><h2 className="mt-2 font-display text-3xl font-bold">Próximas aulas</h2></div><Music2 className="text-mezzo-purple" /></div>{!overview && <p className="mt-7 text-sm text-stone-600">Carregando agenda...</p>}{overview?.upcomingLessons.length === 0 && <p className="mt-7 rounded-xl border border-dashed border-mezzo-purple/25 p-7 text-center text-sm text-stone-600">Não há aulas futuras agendadas.</p>}{overview && overview.upcomingLessons.length > 0 && <ul className="mt-6 divide-y divide-mezzo-purple/10">{overview.upcomingLessons.map((lesson) => <li className="flex flex-wrap items-center justify-between gap-4 py-4" key={lesson.id}><div><p className="font-bold">{lesson.course}</p><p className="mt-1 text-sm text-stone-600">{lesson.students.map((student) => student.name).join(', ') || 'Sem alunos vinculados'}{lesson.room ? ` · ${lesson.room}` : ''}</p></div><time className="text-right text-sm font-bold text-mezzo-purple" dateTime={lesson.startsAt}>{formatDate(lesson.startsAt)}<br />{formatTime(lesson.startsAt)}</time></li>)}</ul>}</section></main>;
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) { return <article className="rounded-2xl bg-white p-6 shadow-sm"><div className="flex items-start justify-between"><p className="text-sm font-bold text-stone-600">{label}</p><span className="text-mezzo-purple">{icon}</span></div><p className="mt-7 font-display text-3xl font-bold">{value}</p></article>; }
function formatDate(value: string) { return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(value)); }
function formatTime(value: string) { return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(value)); }
