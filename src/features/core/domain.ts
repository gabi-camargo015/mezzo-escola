export const userRoles = ['ADMIN', 'TEACHER', 'STUDENT', 'GUARDIAN'] as const;

export type UserRole = (typeof userRoles)[number];

export const lessonStatuses = ['CONFIRMED', 'TAUGHT', 'CANCELLED', 'RESCHEDULED', 'STUDENT_ABSENCE', 'TEACHER_ABSENCE'] as const;

export type LessonStatus = (typeof lessonStatuses)[number];

export interface UserIdentity {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  birthDate?: string;
  guardianIds: string[];
  activeCourseIds: string[];
}

export interface TeacherProfile {
  id: string;
  name: string;
  specialty: string;
  courseIds: string[];
}

export interface Lesson {
  id: string;
  courseId: string;
  teacherId: string;
  studentIds: string[];
  roomId?: string;
  startsAt: string;
  endsAt: string;
  status: LessonStatus;
  notes?: string;
}

export interface MoneyAmount {
  amountInCents: number;
  currency: 'BRL';
}

export interface Invoice {
  id: string;
  studentId: string;
  description: string;
  dueDate: string;
  amount: MoneyAmount;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
}

export interface DashboardMetric {
  label: string;
  value: string;
  trend?: { value: string; direction: 'up' | 'down' | 'neutral' };
}
