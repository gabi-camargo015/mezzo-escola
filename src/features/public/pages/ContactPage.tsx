import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { createPublicLead } from '../lead.api';

const contactSchema = z.object({
  email: z.string().email('Informe um e-mail válido.'),
  interest: z.string().min(1, 'Selecione uma opção.'),
  message: z.string().min(10, 'Conte brevemente como podemos ajudar.'),
  name: z.string().min(2, 'Informe seu nome completo.'),
  phone: z.string().min(8, 'Informe um telefone para retorno.'),
});

type ContactForm = z.infer<typeof contactSchema>;

export function ContactPage() {
  const [notice, setNotice] = useState<string>();
  const { formState: { errors, isSubmitting }, handleSubmit, register, reset } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });
  const onSubmit = async (input: ContactForm) => {
    try {
      await createPublicLead(input);
      reset();
      setNotice('Mensagem enviada com sucesso. A equipe da MEZZO entrará em contato.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Não foi possível enviar sua mensagem agora.');
    }
  };

  return <main><section className="bg-[radial-gradient(circle_at_80%_0%,rgba(141,92,192,.35),transparent_24rem),#100d17] px-6 pb-20 pt-32 text-white sm:px-10 lg:px-16"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold tracking-[.2em] text-mezzo-yellow">VAMOS CONVERSAR</p><h1 className="mt-4 font-display text-5xl font-bold leading-[.98] tracking-[-.06em] sm:text-6xl">A sua música<br />começa em um contato.</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">Tire dúvidas, conheça as possibilidades e encontre o curso que mais combina com o seu momento.</p></div></section>
    <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><ContactChannel icon={<MessageCircle />} title="WhatsApp" text="Número oficial a configurar." /><ContactChannel icon={<Phone />} title="Telefone" text="Telefone oficial a configurar." /><ContactChannel icon={<Mail />} title="E-mail" text="E-mail oficial a configurar." /><ContactChannel icon={<MapPin />} title="Endereço" text="Endereço oficial a configurar." /></div></section>
    <section className="bg-stone-100 px-6 py-20 sm:px-10 lg:px-16"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.75fr_1.25fr]"><div><p className="text-xs font-bold tracking-[.18em] text-mezzo-purple">ENVIE UMA MENSAGEM</p><h2 className="mt-3 font-display text-4xl font-bold leading-tight tracking-[-.04em] sm:text-5xl">Conte o que você quer aprender.</h2><p className="mt-5 leading-relaxed text-stone-600">Preencha os seus dados e a equipe da MEZZO poderá orientar você sobre cursos, disponibilidade e o melhor caminho para começar.</p><div className="mt-7 rounded-2xl bg-mezzo-purple p-6 text-white"><h3 className="font-display text-2xl font-bold">Ativação antes do lançamento</h3><p className="mt-2 text-sm leading-relaxed text-white/75">O formulário será ligado ao CRM da plataforma, permitindo rastrear origem, contato e conversão de cada interesse.</p></div></div><form className="rounded-2xl bg-white p-7 shadow-sm sm:p-9" noValidate onSubmit={handleSubmit(onSubmit)}><div className="grid gap-5 md:grid-cols-2"><Field error={errors.name?.message} label="Nome completo"><input autoComplete="name" {...register('name')} /></Field><Field error={errors.phone?.message} label="Telefone ou WhatsApp"><input autoComplete="tel" {...register('phone')} /></Field><Field error={errors.email?.message} label="E-mail"><input autoComplete="email" type="email" {...register('email')} /></Field><Field error={errors.interest?.message} label="Curso de interesse"><select defaultValue="" {...register('interest')}><option disabled value="">Selecione uma opção</option><option value="canto">Canto</option><option value="teclas">Teclas</option><option value="cordas">Cordas</option><option value="percussao">Percussão</option><option value="musicalizacao">Musicalização Infantil</option><option value="coral">Canto Coral</option><option value="outro">Outro / ainda não sei</option></select></Field><div className="md:col-span-2"><Field error={errors.message?.message} label="Como podemos ajudar?"><textarea rows={5} {...register('message')} /></Field></div></div><button className="mt-6 inline-flex items-center gap-2 rounded-md bg-mezzo-yellow px-5 py-3 font-bold text-mezzo-ink transition hover:bg-mezzo-yellow-light disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting} type="submit">{isSubmitting ? 'Enviando...' : 'Enviar mensagem'} <Send size={17} /></button>{notice && <p className="mt-4 text-sm font-semibold text-mezzo-purple" role="status">{notice}</p>}</form></div></section></main>;
}

function ContactChannel({ icon, text, title }: { icon: ReactNode; text: string; title: string }) {
  return <article className="rounded-2xl border border-mezzo-purple/15 bg-white p-6 shadow-sm"><div className="text-mezzo-purple">{icon}</div><h2 className="mt-4 font-display text-2xl font-bold">{title}</h2><p className="mt-2 text-sm text-stone-600">{text}</p></article>;
}

function Field({ children, error, label }: { children: ReactNode; error?: string; label: string }) {
  return <label className="block text-sm font-bold">{label}<span className="text-red-700"> *</span><span className="mt-1.5 block [&_input]:w-full [&_input]:rounded-md [&_input]:border [&_input]:border-mezzo-purple/20 [&_input]:px-3 [&_input]:py-2.5 [&_select]:w-full [&_select]:rounded-md [&_select]:border [&_select]:border-mezzo-purple/20 [&_select]:px-3 [&_select]:py-2.5 [&_textarea]:w-full [&_textarea]:rounded-md [&_textarea]:border [&_textarea]:border-mezzo-purple/20 [&_textarea]:px-3 [&_textarea]:py-2.5">{children}</span>{error && <span className="mt-1 block text-xs font-medium text-red-700">{error}</span>}</label>;
}
