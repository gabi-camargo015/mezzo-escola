import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, LockKeyhole, Mail, Music2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { portalPathForRole, useAuth } from './AuthProvider';

const loginSchema = z.object({ email: z.string().email('Informe um e-mail válido.'), password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.') });
type LoginForm = z.infer<typeof loginSchema>;

export function PortalLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>();
  const { formState: { errors, isSubmitting }, handleSubmit, register } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (credentials: LoginForm) => {
    setErrorMessage(undefined);
    try {
      const user = await login(credentials.email, credentials.password);
      navigate(portalPathForRole(user.role), { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Não foi possível entrar agora.');
    }
  };

  return <main className="grid min-h-[calc(100vh-10rem)] place-items-center bg-stone-100 px-6 py-16"><section className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-[.9fr_1.1fr]"><div className="bg-[radial-gradient(circle_at_85%_10%,rgba(141,92,192,.42),transparent_18rem),#100d17] p-9 text-white sm:p-12"><div className="grid size-12 place-items-center rounded-full bg-mezzo-yellow text-mezzo-ink"><Music2 aria-hidden="true" /></div><p className="mt-12 text-xs font-bold tracking-[.2em] text-mezzo-yellow">PORTAL MEZZO</p><h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-[-.05em]">Sua jornada musical, também no digital.</h1><p className="mt-5 max-w-sm leading-relaxed text-white/70">Acesse aulas, agenda, comunicados, materiais e informações financeiras conforme o seu perfil.</p></div><div className="p-9 sm:p-12"><p className="text-xs font-bold tracking-[.18em] text-mezzo-purple">ACESSO SEGURO</p><h2 className="mt-3 font-display text-3xl font-bold tracking-[-.04em]">Entre na sua conta</h2><form className="mt-8 space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}><label className="block text-sm font-bold">E-mail<input autoComplete="email" className="mt-2 w-full rounded-md border border-mezzo-purple/20 px-3 py-2.5 font-normal" type="email" {...register('email')} /></label>{errors.email && <p className="-mt-3 text-xs font-medium text-red-700">{errors.email.message}</p>}<label className="block text-sm font-bold">Senha<input autoComplete="current-password" className="mt-2 w-full rounded-md border border-mezzo-purple/20 px-3 py-2.5 font-normal" type="password" {...register('password')} /></label>{errors.password && <p className="-mt-3 text-xs font-medium text-red-700">{errors.password.message}</p>}{errorMessage && <p className="rounded-md bg-red-50 p-3 text-sm font-medium text-red-800" role="alert">{errorMessage}</p>}<button className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-mezzo-yellow px-5 py-3 font-bold text-mezzo-ink transition hover:bg-mezzo-yellow-light disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting} type="submit"><LockKeyhole size={17} />{isSubmitting ? 'Entrando...' : 'Entrar'}<ArrowRight size={17} /></button></form><p className="mt-7 text-sm text-stone-600">Ainda não tem acesso? <Link className="font-bold text-mezzo-purple hover:underline" to="/contato">Fale com a MEZZO</Link>.</p><p className="mt-5 flex items-center gap-2 text-xs text-stone-500"><Mail size={14} aria-hidden="true" />Em caso de dúvida, use os canais oficiais da escola.</p></div></section></main>;
}
