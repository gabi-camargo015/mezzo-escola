import { Search, UserPlus } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { useAuth } from '../../auth/AuthProvider';
import { createPerson, fetchPeople, type Person } from '../people.api';

const roles = [{ value: '', label: 'Todos os perfis' }, { value: 'STUDENT', label: 'Alunos' }, { value: 'TEACHER', label: 'Professores' }, { value: 'GUARDIAN', label: 'Responsáveis' }, { value: 'ADMIN', label: 'Administração' }];
const roleLabels: Record<Person['role'], string> = { ADMIN: 'Administração', TEACHER: 'Professor(a)', STUDENT: 'Aluno(a)', GUARDIAN: 'Responsável' };

export function PeoplePage() {
  const { accessToken } = useAuth();
  const [people, setPeople] = useState<Person[]>();
  const [role, setRole] = useState('');
  const [search, setSearch] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'STUDENT' as Person['role'], specialty: '' });

  useEffect(() => { if (accessToken) void fetchPeople(accessToken, { role, search: submittedSearch }).then(setPeople).catch((error: unknown) => setErrorMessage(error instanceof Error ? error.message : 'Não foi possível carregar os cadastros.')); }, [accessToken, role, submittedSearch]);

  const submitPerson = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accessToken) return;
    setErrorMessage(undefined);
    setIsCreating(true);
    try {
      const person = await createPerson(accessToken, { ...form, specialty: form.role === 'TEACHER' ? form.specialty : undefined });
      setPeople((current) => [person, ...(current ?? [])]);
      setForm({ name: '', email: '', password: '', role: 'STUDENT', specialty: '' });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Não foi possível criar o cadastro.');
    } finally {
      setIsCreating(false);
    }
  };

  return <main className="px-6 py-20 lg:px-10 lg:py-10"><p className="text-xs font-bold tracking-[.18em] text-mezzo-purple">CADASTROS</p><h1 className="mt-2 font-display text-4xl font-bold tracking-[-.04em]">Pessoas</h1><p className="mt-3 text-stone-600">Cadastre e consulte alunos, professores, responsáveis e usuários administrativos.</p>{errorMessage && <p className="mt-6 rounded-md bg-red-50 p-4 text-sm font-medium text-red-800" role="alert">{errorMessage}</p>}<section className="mt-8 rounded-2xl bg-white p-7 shadow-sm"><div className="flex items-center gap-3"><UserPlus className="text-mezzo-purple" /><h2 className="font-display text-3xl font-bold">Novo cadastro</h2></div><form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={(event) => void submitPerson(event)}><Field label="Nome completo"><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></Field><Field label="E-mail"><input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></Field><Field label="Senha inicial"><input required minLength={12} type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></Field><Field label="Perfil"><select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as Person['role'] })}>{roles.slice(1).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></Field>{form.role === 'TEACHER' && <Field label="Especialidade"><input required value={form.specialty} onChange={(event) => setForm({ ...form, specialty: event.target.value })} /></Field>}<div className="md:col-span-2"><button className="rounded-md bg-mezzo-purple px-5 py-3 font-bold text-white disabled:opacity-60" disabled={isCreating} type="submit">{isCreating ? 'Criando...' : 'Criar cadastro'}</button></div></form></section><section className="mt-8 rounded-2xl bg-white p-7 shadow-sm"><form className="flex flex-col gap-3 sm:flex-row" onSubmit={(event) => { event.preventDefault(); setSubmittedSearch(search); }}><label className="sr-only" htmlFor="people-search">Buscar pessoa</label><div className="relative flex-1"><Search className="absolute left-3 top-3 text-mezzo-purple" size={18} aria-hidden="true" /><input className="w-full rounded-md border border-mezzo-purple/20 py-2.5 pl-10 pr-3" id="people-search" placeholder="Buscar por nome ou e-mail" value={search} onChange={(event) => setSearch(event.target.value)} /></div><select className="rounded-md border border-mezzo-purple/20 px-3 py-2.5" value={role} onChange={(event) => setRole(event.target.value)}>{roles.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select><button className="rounded-md bg-mezzo-purple px-5 py-2.5 font-bold text-white" type="submit">Buscar</button></form>{!people && <p className="mt-7 text-sm text-stone-600">Carregando cadastros...</p>}{people?.length === 0 && <p className="mt-7 rounded-xl border border-dashed border-mezzo-purple/25 p-8 text-center text-sm text-stone-600">Nenhuma pessoa encontrada com esses filtros.</p>}{people && people.length > 0 && <div className="mt-7 overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="border-b border-mezzo-purple/15 text-xs uppercase tracking-wide text-stone-500"><tr><th className="pb-3 pr-5">Nome</th><th className="pb-3 pr-5">E-mail</th><th className="pb-3 pr-5">Perfil</th><th className="pb-3">Situação</th></tr></thead><tbody className="divide-y divide-mezzo-purple/10">{people.map((person) => <tr key={person.id}><td className="py-4 pr-5 font-bold">{person.name}</td><td className="py-4 pr-5 text-stone-600">{person.email}</td><td className="py-4 pr-5">{roleLabels[person.role]}</td><td className="py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${person.active ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100 text-stone-600'}`}>{person.active ? 'Ativo' : 'Inativo'}</span></td></tr>)}</tbody></table></div>}</section></main>;
}

function Field({ children, label }: { children: ReactNode; label: string }) { return <label className="block text-sm font-bold">{label}<span className="mt-1.5 block [&_input]:w-full [&_input]:rounded-md [&_input]:border [&_input]:border-mezzo-purple/20 [&_input]:px-3 [&_input]:py-2.5 [&_select]:w-full [&_select]:rounded-md [&_select]:border [&_select]:border-mezzo-purple/20 [&_select]:px-3 [&_select]:py-2.5">{children}</span></label>; }
