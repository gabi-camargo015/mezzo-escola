import { Check, ClipboardCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useAuth } from '../../auth/AuthProvider';
import { recordAttendance } from '../attendance.api';
import { fetchTeacherOverview, type TeacherOverview } from '../teacher.api';

export function TeacherAttendancePage() {
  const { accessToken } = useAuth();
  const [overview, setOverview] = useState<TeacherOverview>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  useEffect(() => { if (accessToken) void fetchTeacherOverview(accessToken).then(setOverview).catch((error: unknown) => setErrorMessage(error instanceof Error ? error.message : 'Não foi possível carregar as aulas.')); }, [accessToken]);
  const saveAttendance = async (lessonId: string, studentId: string, present: boolean) => { if (!accessToken) return; const key = `${lessonId}:${studentId}`; try { await recordAttendance(accessToken, { lessonId, studentId, present }); setSaved((current) => ({ ...current, [key]: present })); } catch (error) { setErrorMessage(error instanceof Error ? error.message : 'Não foi possível registrar a frequência.'); } };
  return <main className="px-6 py-20 lg:px-10 lg:py-10"><p className="text-xs font-bold tracking-[.18em] text-mezzo-purple">PEDAGÓGICO</p><h1 className="mt-2 font-display text-4xl font-bold tracking-[-.04em]">Frequência</h1><p className="mt-3 text-stone-600">Registre a presença dos alunos em suas próximas aulas.</p>{errorMessage && <p className="mt-6 rounded-md bg-red-50 p-4 text-sm font-medium text-red-800" role="alert">{errorMessage}</p>}<section className="mt-9 space-y-5">{!overview && <p className="rounded-2xl bg-white p-7 text-sm text-stone-600 shadow-sm">Carregando aulas...</p>}{overview?.upcomingLessons.length === 0 && <p className="rounded-2xl border border-dashed border-mezzo-purple/25 bg-white p-8 text-center text-sm text-stone-600">Não há aulas futuras para registrar frequência.</p>}{overview?.upcomingLessons.map((lesson) => <article className="rounded-2xl bg-white p-7 shadow-sm" key={lesson.id}><div className="flex flex-wrap justify-between gap-3"><div><p className="text-xs font-bold tracking-[.14em] text-mezzo-purple">{formatDateTime(lesson.startsAt)}</p><h2 className="mt-2 font-display text-3xl font-bold">{lesson.course}</h2></div><ClipboardCheck className="text-mezzo-purple" /></div><ul className="mt-6 divide-y divide-mezzo-purple/10">{lesson.students.map((student) => { const key = `${lesson.id}:${student.id}`; return <li className="flex flex-wrap items-center justify-between gap-3 py-3" key={student.id}><p className="font-bold">{student.name}</p><div className="flex gap-2"><button className={`inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-bold ${saved[key] === true ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-800'}`} type="button" onClick={() => void saveAttendance(lesson.id, student.id, true)}><Check size={16} />Presente</button><button className={`inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-bold ${saved[key] === false ? 'bg-red-700 text-white' : 'bg-red-50 text-red-800'}`} type="button" onClick={() => void saveAttendance(lesson.id, student.id, false)}><X size={16} />Ausente</button></div></li>; })}</ul></article>)}</section></main>;
}

function formatDateTime(value: string) { return new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(value)); }
