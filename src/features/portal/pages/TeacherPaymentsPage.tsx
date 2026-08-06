import { CalendarDays, Clock3, ReceiptText } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { useAuth } from '../../auth/AuthProvider';
import { fetchTeacherPaymentEstimate, type TeacherPaymentEstimate } from '../teacher-payment.api';

const paymentLabels: Record<TeacherPaymentEstimate['type'], string> = { HOURLY: 'Valor por hora', PER_LESSON: 'Valor por aula', FIXED: 'Valor fixo', PERCENTAGE: 'Percentual' };

export function TeacherPaymentsPage() {
  const { accessToken } = useAuth();
  const [month, setMonth] = useState(currentMonth());
  const [estimate, setEstimate] = useState<TeacherPaymentEstimate>();
  const [errorMessage, setErrorMessage] = useState<string>();
  useEffect(() => { if (accessToken) { setEstimate(undefined); void fetchTeacherPaymentEstimate(accessToken, month).then(setEstimate).catch((error: unknown) => setErrorMessage(error instanceof Error ? error.message : 'Não foi possível carregar a remuneração.')); } }, [accessToken, month]);
  return <main className="px-6 py-20 lg:px-10 lg:py-10"><p className="text-xs font-bold tracking-[.18em] text-mezzo-purple">REMUNERAÇÃO</p><h1 className="mt-2 font-display text-4xl font-bold tracking-[-.04em]">Estimativa mensal</h1><p className="mt-3 text-stone-600">Acompanhe aulas ministradas, horas registradas e o cálculo do plano vigente.</p>{errorMessage && <p className="mt-6 rounded-md bg-red-50 p-4 text-sm font-medium text-red-800" role="alert">{errorMessage}</p>}<section className="mt-9 max-w-4xl rounded-2xl bg-white p-7 shadow-sm"><label className="text-sm font-bold">Mês de referência<input className="mt-2 block rounded-md border border-mezzo-purple/20 px-3 py-2.5 font-normal" type="month" value={month} onChange={(event) => setMonth(event.target.value)} /></label>{!estimate && !errorMessage && <p className="mt-7 text-sm text-stone-600">Calculando remuneração...</p>}{estimate && <><div className="mt-8 grid gap-4 md:grid-cols-3"><Metric icon={<ReceiptText />} label="Aulas ministradas" value={estimate.lessonsTaught.toLocaleString('pt-BR')} /><Metric icon={<Clock3 />} label="Horas trabalhadas" value={estimate.hoursWorked.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} /><Metric icon={<CalendarDays />} label="Plano vigente" value={paymentLabels[estimate.type]} /></div><div className="mt-7 rounded-2xl bg-mezzo-purple p-7 text-white"><p className="text-xs font-bold tracking-[.16em] text-mezzo-yellow">ESTIMATIVA DO PERÍODO</p>{estimate.requiresManualCalculation ? <p className="mt-3 text-lg text-white/85">O plano percentual exige vínculo de receita por professor e será apurado pela Administração.</p> : <p className="mt-3 font-display text-5xl font-bold text-mezzo-yellow">{formatCurrency(estimate.amountInCents ?? 0)}</p>}<p className="mt-3 text-sm text-white/70">Base do plano: {formatCurrency(estimate.rateInCents)} · valores sujeitos à conferência administrativa.</p></div></>}</section></main>;
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) { return <article className="rounded-xl border border-mezzo-purple/15 p-5"><span className="text-mezzo-purple">{icon}</span><p className="mt-4 text-xs font-bold uppercase tracking-wide text-stone-500">{label}</p><p className="mt-1 font-display text-2xl font-bold">{value}</p></article>; }
function currentMonth() { const value = new Date(); return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}`; }
function formatCurrency(cents: number) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100); }
