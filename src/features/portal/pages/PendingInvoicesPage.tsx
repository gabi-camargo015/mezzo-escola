import { AlertCircle, CalendarClock, ReceiptText } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '../../auth/AuthProvider';
import { fetchGuardianOverview, type GuardianOverview } from '../guardian.api';
import { fetchStudentOverview, type StudentOverview } from '../student.api';

type Invoice = { amountInCents: number; description: string; dueDate: string; id: string; status: 'PENDING' | 'OVERDUE'; student?: string };

export function PendingInvoicesPage() {
  const { accessToken, user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>();
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    if (!accessToken || (user?.role !== 'STUDENT' && user?.role !== 'GUARDIAN')) return;

    const request = user.role === 'STUDENT'
      ? fetchStudentOverview(accessToken).then((overview: StudentOverview) => overview.invoices)
      : fetchGuardianOverview(accessToken).then((overview: GuardianOverview) => overview.invoices);

    void request.then(setInvoices).catch((error: unknown) => setErrorMessage(error instanceof Error ? error.message : 'Não foi possível carregar as cobranças.'));
  }, [accessToken, user?.role]);

  const overdueTotal = useMemo(() => invoices?.filter((invoice) => invoice.status === 'OVERDUE').reduce((total, invoice) => total + invoice.amountInCents, 0) ?? 0, [invoices]);

  return (
    <main className="px-6 py-20 lg:px-10 lg:py-10">
      <p className="text-xs font-bold tracking-[.18em] text-mezzo-purple">FINANCEIRO</p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-[-.04em]">Minhas cobranças</h1>
      <p className="mt-3 max-w-2xl text-stone-600">Consulte mensalidades e demais lançamentos pendentes. Para pagamento ou negociação, entre em contato com a secretaria.</p>

      {errorMessage && <p className="mt-6 rounded-md bg-red-50 p-4 text-sm font-medium text-red-800" role="alert">{errorMessage}</p>}
      {!invoices && !errorMessage && <p className="mt-8 text-sm text-stone-600">Carregando cobranças...</p>}

      {invoices && <>
        {overdueTotal > 0 && <section className="mt-8 flex gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950"><AlertCircle className="shrink-0" aria-hidden="true" /><div><h2 className="font-display text-2xl font-bold">Há cobrança(s) em atraso</h2><p className="mt-1 text-sm">Total em atraso: <strong>{formatCurrency(overdueTotal)}</strong>. Fale com a secretaria para regularizar.</p></div></section>}
        {invoices.length === 0 && <section className="mt-8 rounded-2xl border border-dashed border-mezzo-purple/25 bg-white p-10 text-center"><ReceiptText className="mx-auto text-mezzo-purple" size={34} aria-hidden="true" /><h2 className="mt-4 font-display text-3xl font-bold">Tudo em dia</h2><p className="mt-2 text-sm text-stone-600">Não há cobranças pendentes neste momento.</p></section>}
        {invoices.length > 0 && <section className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm"><div className="border-b border-stone-100 p-6"><h2 className="font-display text-3xl font-bold">Lançamentos pendentes</h2></div><ul className="divide-y divide-stone-100">{invoices.map((invoice) => <li className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between" key={invoice.id}><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold">{invoice.description}</h3><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${invoice.status === 'OVERDUE' ? 'bg-red-100 text-red-800' : 'bg-mezzo-purple/10 text-mezzo-purple'}`}>{invoice.status === 'OVERDUE' ? 'Em atraso' : 'Pendente'}</span></div>{invoice.student && <p className="mt-1 text-sm text-stone-600">Aluno(a): {invoice.student}</p>}<p className="mt-2 flex items-center gap-2 text-sm text-stone-600"><CalendarClock size={16} aria-hidden="true" />Vencimento: {formatDate(invoice.dueDate)}</p></div><strong className="font-display text-2xl text-mezzo-purple">{formatCurrency(invoice.amountInCents)}</strong></li>)}</ul></section>}
      </>}
    </main>
  );
}

function formatCurrency(cents: number) { return new Intl.NumberFormat('pt-BR', { currency: 'BRL', style: 'currency' }).format(cents / 100); }
function formatDate(value: string) { return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(value)); }
