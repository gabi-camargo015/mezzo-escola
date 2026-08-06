import { CheckCircle2, Ear, Music2, UsersRound } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

const commitments = [
  'Respeito à individualidade de cada aluno.',
  'Professores preparados para orientar com técnica e sensibilidade.',
  'Aprendizado conectado à prática e ao repertório.',
  'Ambiente seguro, criativo e acolhedor para todas as idades.',
];

export function AboutPage() {
  return (
    <main>
      <section className="bg-[radial-gradient(circle_at_80%_0%,rgba(141,92,192,.35),transparent_24rem),#100d17] px-6 pb-20 pt-32 text-white sm:px-10 lg:px-16"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold tracking-[.2em] text-mezzo-yellow">NOSSA ESSÊNCIA</p><h1 className="mt-4 font-display text-5xl font-bold leading-[.98] tracking-[-.06em] sm:text-6xl">A música encontra<br />o seu lugar.</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">Um ambiente para desenvolver técnica, sensibilidade e confiança — no tempo de cada pessoa.</p></div></section>
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-10 lg:grid-cols-2 lg:items-center lg:px-16"><div className="grid min-h-96 place-items-center rounded-3xl bg-[linear-gradient(135deg,rgba(80,36,122,.95),rgba(16,13,23,.95))] font-display text-6xl font-bold italic tracking-[-.08em] text-mezzo-yellow">MEZZO</div><div><p className="text-xs font-bold tracking-[.18em] text-mezzo-purple">QUEM SOMOS</p><h2 className="mt-3 font-display text-4xl font-bold leading-tight tracking-[-.04em] sm:text-5xl">Mais que ensinar música, queremos despertar possibilidades.</h2><div className="mt-6 space-y-4 leading-relaxed text-stone-600"><p>A MEZZO Escola de Música nasce do encontro entre conhecimento, escuta e paixão pela arte. Aqui, entendemos que cada aluno traz uma história, uma referência e uma maneira própria de se conectar com a música.</p><p>Por isso, construímos percursos de aprendizado com clareza, prática e afeto. Do primeiro contato com um instrumento à preparação de repertório, cada aula é uma oportunidade de descobrir novos caminhos sonoros.</p><p>A história institucional, a fundação e os marcos da escola serão incluídos assim que a MEZZO disponibilizar o conteúdo oficial.</p></div></div></section>
      <section className="bg-mezzo-ink px-6 py-20 text-white sm:px-10 lg:px-16"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-xs font-bold tracking-[.18em] text-mezzo-yellow">NOSSA PROPOSTA</p><h2 className="mt-3 font-display text-4xl font-bold leading-tight tracking-[-.04em] sm:text-5xl">Aprender com intenção. Criar com liberdade.</h2></div><div className="grid gap-7 sm:grid-cols-2"><Value icon={<Ear />} title="Escuta ativa" text="A música começa pela escuta: de si, do outro e de tudo o que nos cerca." /><Value icon={<Music2 />} title="Prática real" text="Repertório e vivências musicais fazem parte do processo desde o início." /><Value icon={<UsersRound />} title="Cuidado individual" text="Objetivos, ritmo e interesses do aluno orientam cada etapa do ensino." /><Value icon={<Music2 />} title="Experiência coletiva" text="Compartilhar música amplia escuta, presença e senso de comunidade." /></div></div></section>
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-10 lg:grid-cols-2 lg:px-16"><div><p className="text-xs font-bold tracking-[.18em] text-mezzo-purple">O QUE NOS GUIA</p><h2 className="mt-3 font-display text-4xl font-bold leading-tight tracking-[-.04em] sm:text-5xl">Uma escola feita para pessoas e suas músicas.</h2></div><div className="rounded-2xl bg-mezzo-purple p-8 text-white"><h3 className="font-display text-3xl font-bold">Nosso compromisso</h3><p className="mt-3 leading-relaxed text-white/80">Oferecer uma formação musical que combine excelência, humanidade e prazer em aprender.</p><ul className="mt-6 space-y-4">{commitments.map((commitment) => <li className="flex gap-3" key={commitment}><CheckCircle2 className="mt-0.5 shrink-0 text-mezzo-yellow" size={19} aria-hidden="true" /><span>{commitment}</span></li>)}</ul></div></section>
      <section className="bg-[linear-gradient(135deg,#2c1746,#50247a)] px-6 py-20 text-center text-white sm:px-10 lg:px-16"><p className="text-xs font-bold tracking-[.18em] text-mezzo-yellow">VAMOS CONVERSAR?</p><h2 className="mx-auto mt-3 max-w-3xl font-display text-4xl font-bold leading-tight tracking-[-.05em] sm:text-5xl">A sua jornada musical pode começar agora.</h2><p className="mx-auto mt-5 max-w-xl text-white/75">Conheça os cursos e encontre a melhor forma de viver a música na MEZZO.</p><Link className="mt-8 inline-flex rounded-md bg-mezzo-yellow px-5 py-3 font-bold text-mezzo-ink transition hover:bg-mezzo-yellow-light" to="/contato">Falar com a MEZZO</Link></section>
    </main>
  );
}

function Value({ icon, text, title }: { icon: ReactNode; text: string; title: string }) {
  return <article><div className="text-mezzo-yellow">{icon}</div><h3 className="mt-3 font-display text-2xl font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-white/60">{text}</p></article>;
}
