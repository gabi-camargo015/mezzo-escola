import { ArrowDownCircle, ArrowUpCircle, Landmark, Plus, ReceiptText } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { useAuth } from '../../auth/AuthProvider';
import {
  createExpense,
  createInvoice,
  fetchActiveStudents,
  fetchFinanceSummary,
  type FinanceSummary,
} from '../finance.api';

type ExpenseForm = { amount: string; category: string; description: string; dueDate: string };
type InvoiceForm = { amount: string; description: string; dueDate: string; studentId: string };

const emptyExpenseForm: ExpenseForm = { amount: '', category: '', description: '', dueDate: '' };
const emptyInvoiceForm: InvoiceForm = { amount: '', description: '', dueDate: '', studentId: '' };

export function FinancePage() {
  const { accessToken } = useAuth();
  const [finance, setFinance] = useState<FinanceSummary>();
  const [students, setStudents] = useState<Array<{ id: string; name: string }>>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [expenseForm, setExpenseForm] = useState<ExpenseForm>(emptyExpenseForm);
  const [invoiceForm, setInvoiceForm] = useState<InvoiceForm>(emptyInvoiceForm);
  const [isExpenseSaving, setIsExpenseSaving] = useState(false);
  const [isInvoiceSaving, setIsInvoiceSaving] = useState(false);

  const loadSummary = async () => {
    if (!accessToken) return;

    try {
      setFinance(await fetchFinanceSummary(accessToken));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Não foi possível carregar o financeiro.');
    }
  };

  useEffect(() => {
    if (!accessToken) return;

    void Promise.all([fetchFinanceSummary(accessToken), fetchActiveStudents(accessToken)])
      .then(([summary, activeStudents]) => {
        setFinance(summary);
        setStudents(activeStudents);
      })
      .catch((error: unknown) => {
        setErrorMessage(error instanceof Error ? error.message : 'Não foi possível carregar o financeiro.');
      });
  }, [accessToken]);

  const submitExpense = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accessToken) return;

    const amountInCents = toCents(expenseForm.amount);
    if (!amountInCents) {
      setErrorMessage('Informe um valor de despesa válido.');
      return;
    }

    setIsExpenseSaving(true);
    setErrorMessage(undefined);

    try {
      await createExpense(accessToken, {
        amountInCents,
        category: expenseForm.category,
        description: expenseForm.description,
        dueDate: toIsoDate(expenseForm.dueDate),
      });
      setExpenseForm(emptyExpenseForm);
      await loadSummary();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Não foi possível lançar a despesa.');
    } finally {
      setIsExpenseSaving(false);
    }
  };

  const submitInvoice = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accessToken) return;

    const amountInCents = toCents(invoiceForm.amount);
    if (!amountInCents || !invoiceForm.studentId) {
      setErrorMessage('Selecione um aluno e informe um valor válido para a fatura.');
      return;
    }

    setIsInvoiceSaving(true);
    setErrorMessage(undefined);

    try {
      await createInvoice(accessToken, {
        amountInCents,
        description: invoiceForm.description,
        dueDate: toIsoDate(invoiceForm.dueDate),
        studentId: invoiceForm.studentId,
      });
      setInvoiceForm(emptyInvoiceForm);
      await loadSummary();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Não foi possível emitir a fatura.');
    } finally {
      setIsInvoiceSaving(false);
    }
  };

  return (
    <main className="px-6 py-20 lg:px-10 lg:py-10">
      <p className="text-xs font-bold tracking-[.18em] text-mezzo-purple">FINANCEIRO</p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-[-.04em]">Fluxo de caixa</h1>
      <p className="mt-3 text-stone-600">Visão consolidada do mês corrente, atualizada a partir dos lançamentos registrados.</p>

      {errorMessage && <p className="mt-6 rounded-md bg-red-50 p-4 text-sm font-medium text-red-800" role="alert">{errorMessage}</p>}

      <section className="mt-8 rounded-2xl bg-white p-7 shadow-sm">
        <div className="flex items-center gap-3">
          <Plus className="text-mezzo-purple" aria-hidden="true" />
          <h2 className="font-display text-3xl font-bold">Lançar despesa</h2>
        </div>
        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={(event) => void submitExpense(event)}>
          <Field label="Descrição"><input required value={expenseForm.description} onChange={(event) => setExpenseForm({ ...expenseForm, description: event.target.value })} /></Field>
          <Field label="Categoria"><input required value={expenseForm.category} onChange={(event) => setExpenseForm({ ...expenseForm, category: event.target.value })} /></Field>
          <Field label="Vencimento"><input required type="date" value={expenseForm.dueDate} onChange={(event) => setExpenseForm({ ...expenseForm, dueDate: event.target.value })} /></Field>
          <Field label="Valor (R$)"><input required inputMode="decimal" placeholder="0,00" value={expenseForm.amount} onChange={(event) => setExpenseForm({ ...expenseForm, amount: event.target.value })} /></Field>
          <div className="md:col-span-2"><button className="rounded-md bg-mezzo-purple px-5 py-3 font-bold text-white disabled:opacity-60" disabled={isExpenseSaving} type="submit">{isExpenseSaving ? 'Salvando...' : 'Lançar despesa'}</button></div>
        </form>
      </section>

      <section className="mt-8 rounded-2xl bg-white p-7 shadow-sm">
        <div className="flex items-center gap-3">
          <ReceiptText className="text-mezzo-purple" aria-hidden="true" />
          <div><h2 className="font-display text-3xl font-bold">Emitir fatura</h2><p className="mt-1 text-sm text-stone-600">Registre uma nova cobrança para o aluno.</p></div>
        </div>
        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={(event) => void submitInvoice(event)}>
          <Field label="Aluno"><select required value={invoiceForm.studentId} onChange={(event) => setInvoiceForm({ ...invoiceForm, studentId: event.target.value })}><option value="">{students ? 'Selecione o aluno' : 'Carregando alunos...'}</option>{students?.map((student) => <option key={student.id} value={student.id}>{student.name}</option>)}</select></Field>
          <Field label="Descrição"><input required placeholder="Ex.: Mensalidade de setembro" value={invoiceForm.description} onChange={(event) => setInvoiceForm({ ...invoiceForm, description: event.target.value })} /></Field>
          <Field label="Vencimento"><input required type="date" value={invoiceForm.dueDate} onChange={(event) => setInvoiceForm({ ...invoiceForm, dueDate: event.target.value })} /></Field>
          <Field label="Valor (R$)"><input required inputMode="decimal" placeholder="0,00" value={invoiceForm.amount} onChange={(event) => setInvoiceForm({ ...invoiceForm, amount: event.target.value })} /></Field>
          <div className="md:col-span-2"><button className="rounded-md bg-mezzo-yellow px-5 py-3 font-bold text-mezzo-black disabled:opacity-60" disabled={isInvoiceSaving || !students} type="submit">{isInvoiceSaving ? 'Emitindo...' : 'Emitir fatura'}</button></div>
        </form>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <Metric icon={<ArrowUpCircle />} label="Receita recebida" tone="text-emerald-700" value={finance ? formatCurrency(finance.summary.revenueInCents) : '—'} />
        <Metric icon={<ArrowDownCircle />} label="Despesas pagas" tone="text-red-700" value={finance ? formatCurrency(finance.summary.paidExpensesInCents) : '—'} />
        <Metric icon={<Landmark />} label="Saldo do mês" tone="text-mezzo-purple" value={finance ? formatCurrency(finance.summary.balanceInCents) : '—'} />
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <FinancialList title="Contas a pagar" empty="Não há despesas pendentes." rows={finance?.pendingExpenses.map((expense) => ({ id: expense.id, title: expense.description, detail: `${expense.category} · vence ${formatDate(expense.dueDate)}`, value: formatCurrency(expense.amountInCents) }))} />
        <FinancialList title="Contas a receber" empty="Não há faturas pendentes." rows={finance?.receivables.map((invoice) => ({ id: invoice.id, title: invoice.description, detail: `${invoice.status === 'OVERDUE' ? 'Em atraso' : 'Pendente'} · vence ${formatDate(invoice.dueDate)}`, value: formatCurrency(invoice.amountInCents) }))} />
      </section>
    </main>
  );
}

function Field({ children, label }: { children: ReactNode; label: string }) {
  return <label className="block text-sm font-bold">{label}<span className="mt-1.5 block [&_input]:w-full [&_input]:rounded-md [&_input]:border [&_input]:border-mezzo-purple/20 [&_input]:px-3 [&_input]:py-2.5 [&_select]:w-full [&_select]:rounded-md [&_select]:border [&_select]:border-mezzo-purple/20 [&_select]:px-3 [&_select]:py-2.5">{children}</span></label>;
}

function Metric({ icon, label, tone, value }: { icon: ReactNode; label: string; tone: string; value: string }) {
  return <article className="rounded-2xl bg-white p-6 shadow-sm"><div className="flex items-start justify-between"><p className="text-sm font-bold text-stone-600">{label}</p><span className={tone}>{icon}</span></div><p className={`mt-7 font-display text-3xl font-bold ${tone}`}>{value}</p></article>;
}

function FinancialList({ empty, rows, title }: { empty: string; rows?: Array<{ detail: string; id: string; title: string; value: string }>; title: string }) {
  return <article className="rounded-2xl bg-white p-7 shadow-sm"><h2 className="font-display text-3xl font-bold">{title}</h2>{!rows && <p className="mt-7 text-sm text-stone-600">Carregando dados...</p>}{rows?.length === 0 && <p className="mt-7 rounded-xl border border-dashed border-mezzo-purple/25 p-6 text-center text-sm text-stone-600">{empty}</p>}{rows && rows.length > 0 && <ul className="mt-6 divide-y divide-mezzo-purple/10">{rows.map((row) => <li className="flex items-center justify-between gap-4 py-4" key={row.id}><div><p className="font-bold">{row.title}</p><p className="mt-1 text-sm text-stone-600">{row.detail}</p></div><strong className="shrink-0 text-mezzo-purple">{row.value}</strong></li>)}</ul>}</article>;
}

function toCents(value: string) {
  const cents = Math.round(Number(value.replace(',', '.')) * 100);
  return Number.isInteger(cents) && cents > 0 ? cents : undefined;
}

function toIsoDate(value: string) { return new Date(`${value}T12:00:00`).toISOString(); }
function formatCurrency(cents: number) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100); }
function formatDate(value: string) { return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(value)); }
