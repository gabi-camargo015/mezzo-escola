import { ArrowLeft } from 'lucide-react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';

import { PortalLoginPage } from '../features/auth/PortalLoginPage';
import { RoleGuard } from '../features/auth/RoleGuard';
import { PublicFooter } from '../features/public/components/PublicFooter';
import { PublicHeader } from '../features/public/components/PublicHeader';
import { AboutPage } from '../features/public/pages/AboutPage';
import { CoursesPage } from '../features/public/pages/CoursesPage';
import { CourseDetailPage } from '../features/public/pages/CourseDetailPage';
import { ContactPage } from '../features/public/pages/ContactPage';
import { PublicHomePage } from '../features/public/pages/PublicHomePage';
import { TeachersPage } from '../features/public/pages/TeachersPage';
import { GalleryPage } from '../features/public/pages/GalleryPage';
import { PortalLayout } from '../features/portal/PortalLayout';
import { AdminDashboardPage } from '../features/portal/pages/AdminDashboardPage';
import { StudentDashboardPage } from '../features/portal/pages/StudentDashboardPage';
import { TeacherDashboardPage } from '../features/portal/pages/TeacherDashboardPage';
import { GuardianDashboardPage } from '../features/portal/pages/GuardianDashboardPage';
import { FinancePage } from '../features/portal/pages/FinancePage';
import { AdminSchedulePage } from '../features/portal/pages/AdminSchedulePage';
import { CrmPage } from '../features/portal/pages/CrmPage';
import { PeoplePage } from '../features/portal/pages/PeoplePage';
import { AnnouncementsPage } from '../features/portal/pages/AnnouncementsPage';
import { TeacherPaymentsPage } from '../features/portal/pages/TeacherPaymentsPage';
import { TeacherAttendancePage } from '../features/portal/pages/TeacherAttendancePage';
import { MySchedulePage } from '../features/portal/pages/MySchedulePage';
import { PendingInvoicesPage } from '../features/portal/pages/PendingInvoicesPage';

export function App() {
  const location = useLocation();
  const isPortalRoute = location.pathname.startsWith('/portal');

  return (
    <div id="topo" className="min-h-screen bg-mezzo-surface">
      {!isPortalRoute && <PublicHeader />}
      <Routes>
        <Route path="/" element={<PublicHomePage />} />
        <Route path="/sobre" element={<AboutPage />} />
        <Route path="/cursos" element={<CoursesPage />} />
        <Route path="/cursos/:slug" element={<CourseDetailPage />} />
        <Route path="/contato" element={<ContactPage />} />
        <Route path="/professores" element={<TeachersPage />} />
        <Route path="/galeria" element={<GalleryPage />} />
        <Route path="/portal/login" element={<PortalLoginPage />} />
        <Route path="/portal/aluno/login" element={<PortalLoginPage />} />
        <Route path="/portal" element={<PortalLayout />}>
          <Route path="admin" element={<RoleGuard allowedRoles={['ADMIN']}><AdminDashboardPage /></RoleGuard>} />
          <Route path="admin/financeiro" element={<RoleGuard allowedRoles={['ADMIN']}><FinancePage /></RoleGuard>} />
          <Route path="admin/agenda" element={<RoleGuard allowedRoles={['ADMIN']}><AdminSchedulePage /></RoleGuard>} />
          <Route path="admin/crm" element={<RoleGuard allowedRoles={['ADMIN']}><CrmPage /></RoleGuard>} />
          <Route path="admin/pessoas" element={<RoleGuard allowedRoles={['ADMIN']}><PeoplePage /></RoleGuard>} />
          <Route path="admin/comunicacao" element={<RoleGuard allowedRoles={['ADMIN']}><AnnouncementsPage /></RoleGuard>} />
          <Route path="aluno" element={<RoleGuard allowedRoles={['STUDENT']}><StudentDashboardPage /></RoleGuard>} />
          <Route path="aluno/agenda" element={<RoleGuard allowedRoles={['STUDENT']}><MySchedulePage /></RoleGuard>} />
          <Route path="aluno/financeiro" element={<RoleGuard allowedRoles={['STUDENT']}><PendingInvoicesPage /></RoleGuard>} />
          <Route path="professor" element={<RoleGuard allowedRoles={['TEACHER']}><TeacherDashboardPage /></RoleGuard>} />
          <Route path="professor/mensagens" element={<RoleGuard allowedRoles={['TEACHER']}><AnnouncementsPage /></RoleGuard>} />
          <Route path="professor/pagamentos" element={<RoleGuard allowedRoles={['TEACHER']}><TeacherPaymentsPage /></RoleGuard>} />
          <Route path="professor/alunos" element={<RoleGuard allowedRoles={['TEACHER']}><TeacherAttendancePage /></RoleGuard>} />
          <Route path="responsavel" element={<RoleGuard allowedRoles={['GUARDIAN']}><GuardianDashboardPage /></RoleGuard>} />
          <Route path="responsavel/agenda" element={<RoleGuard allowedRoles={['GUARDIAN']}><MySchedulePage /></RoleGuard>} />
          <Route path="responsavel/financeiro" element={<RoleGuard allowedRoles={['GUARDIAN']}><PendingInvoicesPage /></RoleGuard>} />
          <Route path="responsavel/comunicados" element={<RoleGuard allowedRoles={['GUARDIAN']}><AnnouncementsPage /></RoleGuard>} />
          <Route path="aluno/comunicados" element={<RoleGuard allowedRoles={['STUDENT']}><AnnouncementsPage /></RoleGuard>} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {!isPortalRoute && <PublicFooter />}
    </div>
  );
}

function NotFoundPage() {
  return (
    <main className="grid min-h-[65vh] place-items-center px-6 py-20 text-center">
      <div>
        <p className="font-display text-8xl font-bold text-mezzo-purple">404</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-[-.04em]">Esta página não encontrou o seu compasso.</h1>
        <p className="mx-auto mt-4 max-w-md text-stone-600">O endereço pode estar incorreto ou a página ainda está sendo preparada pela MEZZO.</p>
        <Link className="mt-8 inline-flex items-center gap-2 rounded-md bg-mezzo-purple px-5 py-3 font-bold text-white transition hover:bg-mezzo-purple-dark" to="/"><ArrowLeft size={18} aria-hidden="true" />Voltar ao início</Link>
      </div>
    </main>
  );
}
