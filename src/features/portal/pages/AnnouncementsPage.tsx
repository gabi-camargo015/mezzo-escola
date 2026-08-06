import { Megaphone, Send } from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';

import { useAuth } from '../../auth/AuthProvider';
import { createAnnouncement, fetchAnnouncements, type Announcement } from '../announcement.api';

export function AnnouncementsPage() {
  const { accessToken, user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>();
  const [audience, setAudience] = useState<Announcement['audience']>('ALL');
  const [content, setContent] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isPublishing, setIsPublishing] = useState(false);
  const [title, setTitle] = useState('');
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => { if (accessToken) void fetchAnnouncements(accessToken).then(setAnnouncements).catch((error: unknown) => setErrorMessage(error instanceof Error ? error.message : 'Não foi possível carregar os comunicados.')); }, [accessToken]);

  const publish = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accessToken) return;
    setIsPublishing(true);
    setErrorMessage(undefined);
    try {
      const announcement = await createAnnouncement(accessToken, { title, content, audience });
      setAnnouncements((current) => [announcement, ...(current ?? [])]);
      setTitle('');
      setContent('');
      setAudience('ALL');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Não foi possível publicar o comunicado.');
    } finally {
      setIsPublishing(false);
    }
  };

  return <main className="px-6 py-20 lg:px-10 lg:py-10"><p className="text-xs font-bold tracking-[.18em] text-mezzo-purple">COMUNICAÇÃO</p><h1 className="mt-2 font-display text-4xl font-bold tracking-[-.04em]">Comunicados</h1><p className="mt-3 text-stone-600">Avisos importantes da MEZZO para o seu perfil.</p>{errorMessage && <p className="mt-6 rounded-md bg-red-50 p-4 text-sm font-medium text-red-800" role="alert">{errorMessage}</p>}{isAdmin && <form className="mt-8 grid gap-4 rounded-2xl bg-white p-7 shadow-sm" onSubmit={(event) => void publish(event)}><h2 className="font-display text-3xl font-bold">Publicar comunicado</h2><div className="grid gap-4 md:grid-cols-[1fr_12rem]"><label className="text-sm font-bold">Título<input className="mt-2 w-full rounded-md border border-mezzo-purple/20 px-3 py-2.5 font-normal" minLength={3} required value={title} onChange={(event) => setTitle(event.target.value)} /></label><label className="text-sm font-bold">Público<select className="mt-2 w-full rounded-md border border-mezzo-purple/20 px-3 py-2.5 font-normal" value={audience} onChange={(event) => setAudience(event.target.value as Announcement['audience'])}><option value="ALL">Todos</option><option value="TEACHERS">Professores</option><option value="STUDENTS">Alunos</option><option value="GUARDIANS">Responsáveis</option></select></label></div><label className="text-sm font-bold">Mensagem<textarea className="mt-2 w-full rounded-md border border-mezzo-purple/20 px-3 py-2.5 font-normal" minLength={5} required rows={4} value={content} onChange={(event) => setContent(event.target.value)} /></label><button className="inline-flex w-fit items-center gap-2 rounded-md bg-mezzo-purple px-5 py-3 font-bold text-white disabled:opacity-60" disabled={isPublishing} type="submit"><Send size={17} />{isPublishing ? 'Publicando...' : 'Publicar'}</button></form>}<section className="mt-9 max-w-4xl space-y-4">{!announcements && <p className="rounded-2xl bg-white p-7 text-sm text-stone-600 shadow-sm">Carregando comunicados...</p>}{announcements?.length === 0 && <div className="rounded-2xl border border-dashed border-mezzo-purple/25 bg-white p-9 text-center shadow-sm"><Megaphone className="mx-auto text-mezzo-purple" /><p className="mt-4 font-bold">Nenhum comunicado no momento.</p><p className="mt-2 text-sm text-stone-600">Novos avisos da escola aparecerão aqui.</p></div>}{announcements?.map((announcement) => <article className="rounded-2xl bg-white p-7 shadow-sm" key={announcement.id}><div className="flex flex-wrap items-start justify-between gap-3"><h2 className="font-display text-3xl font-bold">{announcement.title}</h2><time className="text-xs font-semibold uppercase tracking-wide text-mezzo-purple" dateTime={announcement.publishedAt}>{formatDate(announcement.publishedAt)}</time></div><p className="mt-4 whitespace-pre-wrap leading-relaxed text-stone-700">{announcement.content}</p></article>)}</section></main>;
}

function formatDate(value: string) { return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(value)); }
