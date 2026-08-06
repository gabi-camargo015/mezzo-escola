import { apiBaseUrl } from '../auth/auth.api';

export interface TeacherPaymentEstimate {
  amountInCents: number | null;
  hoursWorked: number;
  lessonsTaught: number;
  month: string;
  rateInCents: number;
  requiresManualCalculation: boolean;
  type: 'HOURLY' | 'PER_LESSON' | 'PERCENTAGE' | 'FIXED';
}

export async function fetchTeacherPaymentEstimate(accessToken: string, month: string): Promise<TeacherPaymentEstimate> {
  const response = await fetch(`${apiBaseUrl}/api/teacher/payments/estimate?month=${encodeURIComponent(month)}`, { headers: { Authorization: `Bearer ${accessToken}` }, credentials: 'include' });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(body?.message ?? 'Não foi possível carregar a remuneração.');
  }
  return response.json() as Promise<TeacherPaymentEstimate>;
}
