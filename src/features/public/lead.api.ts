import { apiBaseUrl } from '../auth/auth.api';

export interface PublicLeadInput {
  email: string;
  interest: string;
  message: string;
  name: string;
  phone: string;
}

export async function createPublicLead(input: PublicLeadInput): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/api/leads/public`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(body?.message ?? 'Não foi possível enviar sua mensagem agora.');
  }
}
