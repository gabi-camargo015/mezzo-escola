import { ArrowUp, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const year = new Date().getFullYear();

export function PublicFooter() {
  return (
    <footer className="bg-mezzo-ink px-6 pt-16 text-white sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl gap-10 border-b border-white/15 pb-10 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <div><Link className="inline-flex items-center gap-2" to="/"><span className="grid size-10 place-items-center rounded-full bg-mezzo-yellow font-display text-2xl font-bold text-mezzo-ink">M</span><span className="font-display text-xl font-bold tracking-[.06em]">MEZZO<span className="mt-0.5 block font-sans text-[.48rem] font-bold uppercase tracking-[.2em]">escola de música</span></span></Link><p className="mt-5 max-w-xs text-sm leading-relaxed text-white/65">Música para aprender, criar e compartilhar.</p></div>
        <FooterColumn title="Navegação" links={[['A MEZZO', '/sobre'], ['Cursos', '/cursos'], ['Professores', '/professores'], ['Galeria', '/galeria']]} />
        <FooterColumn title="Cursos" links={[['Canto', '/cursos/canto'], ['Teclas', '/cursos/teclas'], ['Cordas', '/cursos/cordas'], ['Percussão', '/cursos/percussao']]} />
        <div><h2 className="text-xs font-bold tracking-[.16em] text-mezzo-yellow">CONTATO</h2><p className="mt-4 text-sm leading-relaxed text-white/65">Os canais oficiais de atendimento serão disponibilizados pela MEZZO antes do lançamento.</p><Link className="mt-4 inline-flex size-10 items-center justify-center rounded-full bg-mezzo-purple text-white transition hover:bg-mezzo-yellow hover:text-mezzo-ink" aria-label="Ir para a página de contato" to="/contato"><MessageCircle size={18} aria-hidden="true" /></Link></div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 py-5 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between"><p>© {year} MEZZO Escola de Música. Todos os direitos reservados.</p><a className="inline-flex items-center gap-1 text-mezzo-yellow" href="#topo">Voltar ao início <ArrowUp size={14} aria-hidden="true" /></a></div>
    </footer>
  );
}

function FooterColumn({ links, title }: { links: Array<[string, string]>; title: string }) {
  return <div><h2 className="text-xs font-bold tracking-[.16em] text-mezzo-yellow">{title.toUpperCase()}</h2><ul className="mt-4 space-y-2.5 text-sm text-white/70">{links.map(([label, to]) => <li key={to}><Link className="transition hover:text-mezzo-yellow" to={to}>{label}</Link></li>)}</ul></div>;
}
