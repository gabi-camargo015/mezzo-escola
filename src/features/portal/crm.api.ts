import { apiBaseUrl } from '../auth/auth.api';

export type LeadStatus = 'NEW' | 'CONTACTED' | 'TRIAL_SCHEDULED' | 'WON' | 'LOST';
export interface Lead { createdAt: string; email: string | null; id: string; interest: string | null; name: string; notes: string | null; phone: string | null; source: string; status: LeadStatus; }

export async function fetchLeads(accessToken: string): Promise<Lead[]> {
  const response = await fetch(`${apiBaseUrl}/api/leads`, { headers: { Authorization: `Bearer ${accessToken}` }, credentials: 'include' });
  if (!response.ok) throw new Error('Não foi possível carregar os leads.');
  return (await response.json() as { leads: Lead[] }).leads;
}

export async function updateLeadStatus(accessToken: string, leadId: string, status: LeadStatus): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/api/leads/${leadId}/status`, { method: 'PATCH', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ status }) });
  if (!response.ok) throw new Error('Não foi possível atualizar o lead.');
}
