import { Menu, Music2, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const navigation = [
  { label: 'Início', to: '/' },
  { label: 'A MEZZO', to: '/sobre' },
  { label: 'Cursos', to: '/cursos' },
  { label: 'Professores', to: '/professores' },
  { label: 'Galeria', to: '/galeria' },
  { label: 'Contato', to: '/contato' },
];

export function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-mezzo-ink/95 text-white backdrop-blur">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-16">
        <Link className="flex items-center gap-2" onClick={closeMenu} to="/" aria-label="MEZZO Escola de Música - página inicial">
          <span className="grid size-10 place-items-center rounded-full bg-mezzo-yellow font-display text-2xl font-bold text-mezzo-ink">M</span>
          <span className="font-display text-xl font-bold tracking-[.06em]">MEZZO<span className="mt-0.5 block font-sans text-[.48rem] font-bold uppercase tracking-[.2em]">escola de música</span></span>
        </Link>

        <button className="rounded-md p-2 lg:hidden" type="button" aria-expanded={isOpen} aria-controls="menu-publico" aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'} onClick={() => setIsOpen((current) => !current)}>
          {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>

        <nav className={`${isOpen ? 'flex' : 'hidden'} absolute inset-x-0 top-full flex-col gap-1 border-b border-white/10 bg-mezzo-ink px-6 py-5 lg:static lg:flex lg:flex-row lg:items-center lg:gap-1 lg:border-0 lg:bg-transparent lg:p-0`} id="menu-publico" aria-label="Navegação principal">
          {navigation.map((item) => <NavLink className={({ isActive }) => `rounded px-3 py-2 text-sm font-semibold transition hover:text-mezzo-yellow ${isActive ? 'text-mezzo-yellow' : 'text-white/80'}`} end={item.to === '/'} key={item.to} onClick={closeMenu} to={item.to}>{item.label}</NavLink>)}
          <Link className="mt-2 inline-flex items-center justify-center gap-2 rounded-md border border-mezzo-yellow px-3 py-2 text-sm font-bold text-mezzo-yellow transition hover:bg-mezzo-yellow hover:text-mezzo-ink lg:ml-3 lg:mt-0" onClick={closeMenu} to="/portal/aluno/login"><Music2 size={16} aria-hidden="true" />Área do aluno</Link>
          <Link className="mt-2 inline-flex items-center justify-center rounded-md bg-mezzo-yellow px-3 py-2 text-sm font-bold text-mezzo-ink transition hover:bg-mezzo-yellow-light lg:mt-0" onClick={closeMenu} to="/contato">Agende uma aula</Link>
        </nav>
      </div>
    </header>
  );
}
