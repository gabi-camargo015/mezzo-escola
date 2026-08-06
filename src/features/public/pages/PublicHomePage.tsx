import { ArrowRight, BookOpen, CalendarDays, ChevronRight, Music2, UsersRound } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

const courses = [
  { title: 'Canto', description: 'Descubra técnica, presença e a identidade da sua voz.', href: '/cursos/canto' },
  { title: 'Teclas', description: 'Piano e teclado para tocar, acompanhar e criar.', href: '/cursos/teclas' },
  { title: 'Cordas', description: 'Violão, guitarra e baixo com prática desde o início.', href: '/cursos/cordas' },
  { title: 'Percussão', description: 'Ritmo, coordenação e escuta para cada música.', href: '/cursos/percussao' },
  { title: 'Musicalização Infantil', description: 'Uma relação criativa e afetiva com a música.', href: '/cursos/musicalizacao' },
  { title: 'Canto Coral', description: 'Vozes que se encontram para construir juntas.', href: '/cursos/coral' },
];

export function PublicHomePage() {
  return (
    <main className="min-h-screen bg-mezzo-surface text-mezzo-ink">
      <section className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_85%_10%,rgba(141,92,192,.42),transparent_24rem),linear-gradient(125deg,#100d17_15%,#2c1746)] px-6 pb-20 pt-36 text-white sm:px-10 lg:px-16">
        <div className="absolute -right-32 -top-40 -z-10 size-[34rem] rounded-full border border-mezzo-yellow/25" />
        <div className="absolute -bottom-96 right-[18%] -z-10 size-[42rem] rounded-full border border-mezzo-yellow/20" />
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
          <div>
            <p className="mb-4 text-xs font-bold tracking-[.22em] text-mezzo-yellow">MEZZO ESCOLA DE MÚSICA</p>
            <h1 className="max-w-3xl font-display text-5xl font-bold leading-[.96] tracking-[-.06em] sm:text-6xl lg:text-7xl">Encontre o seu som.<br /><span className="italic text-mezzo-yellow">Viva a sua música.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/75">Um espaço para aprender, criar e se expressar com orientação musical próxima, acolhedora e inspiradora.</p>
            <div className="mt-9 flex flex-wrap gap-3"><Link className="inline-flex items-center gap-2 rounded-md bg-mezzo-yellow px-5 py-3 font-bold text-mezzo-ink transition hover:-translate-y-0.5 hover:bg-mezzo-yellow-light" to="/cursos">Conheça os cursos <ArrowRight size={18} /></Link><Link className="inline-flex items-center gap-2 rounded-md border border-white/60 px-5 py-3 font-bold transition hover:bg-white hover:text-mezzo-purple-dark" to="/sobre">Conheça a MEZZO</Link></div>
          </div>
          <div className="mx-auto grid size-72 place-items-center rounded-[50%_50%_50%_8%] border border-white/25 bg-white/10 shadow-[1.5rem_1.5rem_0_rgba(246,197,66,.16)] lg:size-80"><Music2 className="size-28 rotate-6 text-mezzo-yellow" strokeWidth={1.15} aria-hidden="true" /></div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-10 lg:grid-cols-2 lg:items-center lg:px-16">
        <div className="grid min-h-80 place-items-center rounded-3xl bg-[linear-gradient(135deg,rgba(80,36,122,.95),rgba(16,13,23,.95))] font-display text-6xl font-bold italic tracking-[-.08em] text-mezzo-yellow">MEZZO</div>
        <div><p className="text-xs font-bold tracking-[.18em] text-mezzo-purple">QUEM SOMOS</p><h2 className="mt-3 max-w-lg font-display text-4xl font-bold leading-tight tracking-[-.04em] sm:text-5xl">A música tem o poder de transformar encontros em memórias.</h2><p className="mt-5 max-w-xl leading-relaxed text-stone-600">Na MEZZO, cada aluno encontra um caminho musical que respeita seu momento, seus objetivos e sua forma única de aprender.</p><Link className="mt-6 inline-flex items-center gap-2 font-bold text-mezzo-purple transition hover:gap-3" to="/sobre">Conheça nossa história <ArrowRight size={17} /></Link></div>
      </section>

      <section className="bg-mezzo-ink px-6 py-20 text-white sm:px-10 lg:px-16"><div className="mx-auto max-w-7xl"><div className="mb-10 flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs font-bold tracking-[.18em] text-mezzo-yellow">CURSOS</p><h2 className="mt-3 font-display text-4xl font-bold tracking-[-.04em] sm:text-5xl">Seu próximo acorde começa aqui.</h2></div><Link className="inline-flex items-center gap-2 rounded-md border border-white/50 px-4 py-2.5 text-sm font-bold hover:bg-white hover:text-mezzo-purple-dark" to="/contato">Fale com a equipe</Link></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{courses.map((course) => <Link className="group flex min-h-60 flex-col rounded-2xl border border-white/10 bg-white/5 p-7 transition hover:-translate-y-1 hover:border-mezzo-yellow/70 hover:bg-white/10" key={course.href} to={course.href}><Music2 className="mb-10 text-mezzo-yellow" aria-hidden="true" /><h3 className="font-display text-2xl font-bold">{course.title}</h3><p className="mt-2 text-sm leading-relaxed text-white/65">{course.description}</p><span className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-mezzo-yellow">Saiba mais <ChevronRight size={16} /></span></Link>)}</div></div></section>

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16"><div className="text-center"><p className="text-xs font-bold tracking-[.18em] text-mezzo-purple">POR QUE A MEZZO</p><h2 className="mx-auto mt-3 max-w-2xl font-display text-4xl font-bold leading-tight tracking-[-.04em] sm:text-5xl">Aprender música vai muito além da técnica.</h2></div><div className="mt-12 grid gap-5 md:grid-cols-3"><Feature icon={<UsersRound />} number="01" title="Ensino próximo" description="Aulas que acompanham sua evolução e valorizam os seus objetivos musicais." /><Feature icon={<BookOpen />} number="02" title="Aprendizado vivo" description="Teoria conectada à prática, ao repertório e à experiência de fazer música." /><Feature icon={<CalendarDays />} number="03" title="Ambiente acolhedor" description="Um espaço seguro para experimentar, errar, descobrir e se expressar." /></div></section>

      <section className="bg-mezzo-purple px-6 py-16 text-center text-white sm:px-10 lg:px-16"><div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-4"><Metric value="6+" label="áreas de aprendizado" /><Metric value="1" label="propósito: fazer música" /><Metric value="100%" label="dedicação à evolução" /><Metric value="1 só" label="experiência MEZZO" /></div></section>

      <section className="bg-[linear-gradient(135deg,#2c1746,#50247a)] px-6 py-20 text-center text-white sm:px-10 lg:px-16"><div className="mx-auto max-w-3xl"><p className="text-xs font-bold tracking-[.18em] text-mezzo-yellow">COMECE AGORA</p><h2 className="mt-3 font-display text-4xl font-bold leading-tight tracking-[-.05em] sm:text-5xl">A sua música merece espaço para acontecer.</h2><p className="mx-auto mt-5 max-w-xl text-white/75">Converse com a equipe da MEZZO e encontre o curso mais adequado para você.</p><Link className="mt-8 inline-flex items-center gap-2 rounded-md bg-mezzo-yellow px-5 py-3 font-bold text-mezzo-ink transition hover:-translate-y-0.5 hover:bg-mezzo-yellow-light" to="/contato">Quero falar com a MEZZO <ArrowRight size={18} /></Link></div></section>
    </main>
  );
}

function Feature({ description, icon, number, title }: { description: string; icon: ReactNode; number: string; title: string }) {
  return <article className="relative overflow-hidden rounded-2xl border border-mezzo-purple/15 bg-white p-7 shadow-sm"><span className="absolute right-5 top-3 font-display text-6xl font-bold text-mezzo-purple/10">{number}</span><div className="text-mezzo-purple">{icon}</div><h3 className="mt-6 font-display text-2xl font-bold">{title}</h3><p className="mt-2 leading-relaxed text-stone-600">{description}</p></article>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div><strong className="block font-display text-5xl leading-none tracking-[-.05em] text-mezzo-yellow">{value}</strong><span className="mt-3 block text-xs font-semibold uppercase tracking-wide text-white/80">{label}</span></div>;
}
