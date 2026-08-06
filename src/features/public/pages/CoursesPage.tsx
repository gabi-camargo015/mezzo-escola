import { ArrowRight, Drum, MicVocal, Music2, Piano, Shapes, UsersRound } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

const courses: Array<{ description: string; icon: ReactNode; slug: string; title: string }> = [
  { title: 'Canto', slug: 'canto', icon: <MicVocal />, description: 'Para descobrir a potência, a técnica e a identidade da sua voz.' },
  { title: 'Teclas', slug: 'teclas', icon: <Piano />, description: 'Piano e teclado para tocar, acompanhar e ampliar seu repertório.' },
  { title: 'Cordas', slug: 'cordas', icon: <Music2 />, description: 'Violão, guitarra e baixo com prática musical desde as primeiras aulas.' },
  { title: 'Percussão', slug: 'percussao', icon: <Drum />, description: 'Ritmo, coordenação e presença para sustentar cada música.' },
  { title: 'Musicalização Infantil', slug: 'musicalizacao', icon: <Shapes />, description: 'Uma relação alegre, criativa e afetiva com a música desde cedo.' },
  { title: 'Canto Coral', slug: 'coral', icon: <UsersRound />, description: 'Vozes que se encontram para construir algo maior juntas.' },
];

export function CoursesPage() {
  return (
    <main>
      <section className="bg-[radial-gradient(circle_at_80%_0%,rgba(141,92,192,.35),transparent_24rem),#100d17] px-6 pb-20 pt-32 text-white sm:px-10 lg:px-16"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold tracking-[.2em] text-mezzo-yellow">CURSOS</p><h1 className="mt-4 font-display text-5xl font-bold leading-[.98] tracking-[-.06em] sm:text-6xl">A música que você<br />quer viver começa aqui.</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">Encontre uma experiência de aprendizado conectada aos seus objetivos, à sua curiosidade e ao seu tempo.</p></div></section>
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16"><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{courses.map((course) => <Link className="group flex min-h-72 flex-col rounded-2xl border border-mezzo-purple/15 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-mezzo-purple/55 hover:shadow-xl" key={course.slug} to={`/cursos/${course.slug}`}><div className="text-mezzo-purple">{course.icon}</div><h2 className="mt-10 font-display text-3xl font-bold tracking-[-.03em]">{course.title}</h2><p className="mt-3 leading-relaxed text-stone-600">{course.description}</p><span className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-bold text-mezzo-purple transition group-hover:gap-3">Conhecer curso <ArrowRight size={17} /></span></Link>)}</div></section>
      <section className="bg-mezzo-purple px-6 py-16 text-white sm:px-10 lg:px-16"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center"><div><p className="text-xs font-bold tracking-[.18em] text-mezzo-yellow">PRECISA DE ORIENTAÇÃO?</p><h2 className="mt-2 font-display text-3xl font-bold">A equipe da MEZZO ajuda você a escolher.</h2></div><Link className="inline-flex shrink-0 items-center gap-2 rounded-md bg-mezzo-yellow px-5 py-3 font-bold text-mezzo-ink transition hover:bg-mezzo-yellow-light" to="/contato">Falar com a MEZZO <ArrowRight size={18} /></Link></div></section>
    </main>
  );
}
