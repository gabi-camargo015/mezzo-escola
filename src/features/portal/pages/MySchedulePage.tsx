import { BookOpen, CalendarDays, Clock3, MapPin } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '../../auth/AuthProvider';
import { fetchLessons, type ScheduledLesson } from '../lesson.api';

export function MySchedulePage() {
  const { accessToken } = useAuth();
  const [lessons, setLessons] = useState<ScheduledLesson[]>();
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    if (!accessToken) return;

    void fetchLessons(accessToken)
      .then(setLessons)
      .catch((error: unknown) => setErrorMessage(error instanceof Error ? error.message : 'Não foi possível carregar sua agenda.'));
  }, [accessToken]);

  const upcomingLessons = useMemo(
    () => lessons?.filter((lesson) => new Date(lesson.endsAt).getTime() >= Date.now()).sort((first, second) => new Date(first.startsAt).getTime() - new Date(second.startsAt).getTime()),
    [lessons],
  );

  return (
    <main className="px-6 py-20 lg:px-10 lg:py-10">
      <p className="text-xs font-bold tracking-[.18em] text-mezzo-purple">MINHA JORNADA</p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-[-.04em]">Minha agenda</h1>
      <p className="mt-3 max-w-2xl text-stone-600">Acompanhe suas próximas aulas, horários, sala e professor responsável.</p>

      {errorMessage && <p className="mt-6 rounded-md bg-red-50 p-4 text-sm font-medium text-red-800" role="alert">{errorMessage}</p>}

      {!upcomingLessons && !errorMessage && <p className="mt-8 text-sm text-stone-600">Carregando sua agenda...</p>}

      {upcomingLessons?.length === 0 && <section className="mt-8 rounded-2xl border border-dashed border-mezzo-purple/25 bg-white p-10 text-center"><CalendarDays className="mx-auto text-mezzo-purple" size={34} aria-hidden="true" /><h2 className="mt-4 font-display text-3xl font-bold">Nenhuma aula agendada</h2><p className="mx-auto mt-2 max-w-md text-sm text-stone-600">Quando sua próxima aula for programada pela escola, ela aparecerá aqui.</p></section>}

      {upcomingLessons && upcomingLessons.length > 0 && <div className="mt-8 grid gap-5 xl:grid-cols-2">{upcomingLessons.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} />)}</div>}
    </main>
  );
}

function LessonCard({ lesson }: { lesson: ScheduledLesson }) {
  const start = new Date(lesson.startsAt);

  return (
    <article className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold tracking-[.14em] text-mezzo-purple">{new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(start)}</p><h2 className="mt-2 font-display text-3xl font-bold">{lesson.course}</h2></div><span className="rounded-full bg-mezzo-purple/10 px-3 py-1 text-xs font-bold text-mezzo-purple">{statusLabel(lesson.status)}</span></div>
      <dl className="mt-6 grid gap-4 text-sm text-stone-700 sm:grid-cols-3"><Info icon={<Clock3 size={17} />} label="Horário" value={`${formatTime(lesson.startsAt)}–${formatTime(lesson.endsAt)}`} /><Info icon={<MapPin size={17} />} label="Sala" value={lesson.room ?? 'A confirmar'} /><Info icon={<BookOpen size={17} />} label="Professor" value={lesson.teacher} /></dl>
      {lesson.notes && <p className="mt-5 rounded-lg bg-stone-50 p-4 text-sm text-stone-600">{lesson.notes}</p>}
    </article>
  );
}

function Info({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <div><dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.1em] text-stone-500">{icon}{label}</dt><dd className="mt-1.5 font-bold text-mezzo-black">{value}</dd></div>;
}

function formatTime(value: string) { return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(value)); }
function statusLabel(status: string) { return ({ SCHEDULED: 'Agendada', TAUGHT: 'Realizada', CANCELLED: 'Cancelada' } as Record<string, string>)[status] ?? status; }
