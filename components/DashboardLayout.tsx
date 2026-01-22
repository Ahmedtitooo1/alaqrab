
import * as React from 'react';
import { useState } from 'react';
import { UserRole } from '../types';
import { useAppContext } from '../context/AppContext';
import {
  LayoutDashboard, MessageSquare, Settings, LogOut, ChevronDown,
  Menu, Bell, X, ChevronRight, GraduationCap, Users,
  Briefcase, Boxes, Receipt, FileSpreadsheet, Wallet, Package,
  Settings2, MonitorPlay, BrainCircuit, CalendarCheck, FileText,
  FolderPlus, PenTool, Database, ClipboardList, Share2, ChevronLeft,
  BookOpen, Star, CreditCard, Activity, Globe, ShieldCheck, PlayCircle,
  BarChart3, Landmark, ClipboardCheck, UserCircle, Building, Layers, Coins,
  PlusCircle, FileCheck, History, ArrowRightLeft, ShieldAlert, MonitorCheck,
  UserPlus, UserCheck2, HeartPulse, Trophy, FileBadge, MonitorUp, Presentation,
  NotebookTabs, Radio, FileType, Truck, Notebook as NotebookIcon,
  ShieldQuestion, UserMinus, Scan, AlertCircle, Gavel, Award, Calculator, Calendar
} from 'lucide-react';

import StudentView from './views/StudentView';
import TeacherView from './views/TeacherView';
import ParentView from './views/ParentView';
import SuperAdminView from './views/SuperAdminView';
import AccountantView from './views/AccountantView';
import AdminView from './views/AdminView';
import FinanceDashboard from '../src/components/finance/FinanceDashboard';
// import AccountantModule from './AccountantModule'; // Removed
import ManagementModule from './ManagementModule';
import ChatSystem from './ChatSystem';
import InternalTicketSystem from './InternalTicketSystem';
import BehaviorModule from './BehaviorModule';
import StudentFinancialProfile from './StudentFinancialProfile';
import CertificateManager from './CertificateManager';
import GradingStandards from './GradingStandards';
import SettingsView from './SettingsView';
import ContentModule from './ContentModule';
import FilesModule from './FilesModule';
import ApprovalsModule from './ApprovalsModule';
import StudentExamModule from './StudentExamModule';
import LiveLessonsModule from './LiveLessonsModule';
import ExamsModule from './ExamsModule';
import ResultsModule from './ResultsModule';
import AttendanceModule from './AttendanceModule';
import AddInstitutionPage from './AddInstitutionPage';
import AddContentPage from './AddContentPage';
import AddUserPage from './AddUserPage';
import SecretaryView from './views/SecretaryView';
import ChartOfAccounts from '../src/pages/Accountant/ChartOfAccounts';
import AcademicSettings from './modules/AcademicSettings';
import ControlSheet from './modules/ControlSheet';
import SubjectMaster from './modules/SubjectMaster';
import WeeklyTimetable from './modules/WeeklyTimetable';
import TeacherSchedule from './modules/TeacherSchedule';
import LessonPlanner from './modules/LessonPlanner';

import WatermarkOverlay from './WatermarkOverlay';

const DashboardLayout: React.FC<{ role: UserRole; onLogout: () => void; onRoleSwitch: (r: UserRole) => void }> = ({ role, onLogout, onRoleSwitch }) => {
  const { lang, setLang, t, user, systemLogo, originalAdmin, endSimulation, currentTenant, systemName } = useAppContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    sa_envs_group: true,
    acc_admin: true,
    acc_entries: true,
    admin_management: true,
    parent_student_profile: true,
    student_exams_group: true,
    teacher_exams_group: true,
    teacher_files_group: true,
    teacher_ledger_group: true,
    admin_academic_group: true
  });

  const isRtl = lang === 'ar';
  const isTutorMode = currentTenant?.type === 'individual';
  const toggleMenu = (menu: string) => setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));

  const renderContent = () => {
    if (activeTab === 'certificates') return <CertificateManager />;
    if (activeTab === 'grading_standards') return <GradingStandards />;
    if (activeTab === 'behavior_records') return <BehaviorModule />;
    if (activeTab === 'messages') return <ChatSystem currentUserRole={role} />;

    // New Feature Components
    if (activeTab === 'academic_settings') return <AcademicSettings />;
    if (activeTab === 'control_sheet') return <ControlSheet />;
    if (activeTab === 'subject_master') return <SubjectMaster />;
    if (activeTab === 'weekly_timetable') return <WeeklyTimetable />;
    if (activeTab === 'teacher_schedule') return <TeacherSchedule />;
    if (activeTab === 'lesson_planner') return <LessonPlanner />;

    if (activeTab === 'settings') return <SettingsView />;
    if (activeTab === 'internal_tickets') return <InternalTicketSystem />;

    if (role === UserRole.SUPER_ADMIN) {
      if (activeTab === 'add_institution') return <AddInstitutionPage onBack={() => setActiveTab('overview')} />;
      return <SuperAdminView mode={activeTab as any} onNavigate={setActiveTab} />;
    }

    if (role === UserRole.ADMIN) {
      if (activeTab === 'overview') return <AdminView onNavigate={setActiveTab} />;
      if (activeTab === 'approvals') return <ApprovalsModule />;
      if (activeTab === 'manage_teachers') return <ManagementModule mode="teachers" onNavigate={setActiveTab} />;
      if (activeTab === 'manage_employees') return <ManagementModule mode="employees" onNavigate={setActiveTab} />;
      if (activeTab === 'manage_students') return <ManagementModule mode="students" onNavigate={setActiveTab} />;

      if (activeTab === 'add_teacher') return <AddUserPage onBack={() => setActiveTab('manage_teachers')} initialRole={UserRole.TEACHER} />;
      if (activeTab === 'add_employee') return <AddUserPage onBack={() => setActiveTab('manage_employees')} initialRole={UserRole.ACCOUNTANT} />;
      if (activeTab === 'add_student') return <AddUserPage onBack={() => setActiveTab('manage_students')} initialRole={UserRole.STUDENT} />;
    }

    if (role === UserRole.ACCOUNTANT) {
      if (activeTab === 'overview') return <AccountantView onNavigate={setActiveTab} />;
      if (activeTab === 'finance_dashboard') return <FinanceDashboard />;
      return <FinanceDashboard />; // Default catch-all for accountant modules now
    }

    if (role === UserRole.SECRETARY) {
      return <SecretaryView onNavigate={setActiveTab} />;
    }

    if (role === UserRole.PARENT) return <ParentView onNavigate={setActiveTab} mode={activeTab as any} />;

    if (role === UserRole.STUDENT) {
      if (activeTab === 'overview') return <StudentView onNavigate={setActiveTab} />;
      if (activeTab === 'take_exam') return <StudentExamModule mode="hall" />;
      if (activeTab === 'exam_results') return <StudentExamModule mode="results" />;
      if (activeTab === 'files') return <FilesModule />;
      if (activeTab === 'live_room') return <LiveLessonsModule isStudentView />;
    }

    if (role === UserRole.TEACHER) {
      if (activeTab === 'overview') return <TeacherView onNavigate={setActiveTab} />;
      if (activeTab === 'exams_list') return <ExamsModule mode="list" />;
      if (activeTab === 'exams_create') return <ExamsModule mode="create" />;
      if (activeTab === 'exams_ai_create') return <ExamsModule mode="ai_create" />;
      if (activeTab === 'exams_ai_corrector') return <ExamsModule mode="ai_corrector" />;

      if (activeTab === 'manage_students') return <ManagementModule mode="students" />;
      if (activeTab === 'content_events') return <ContentModule mode="events" />;
      if (activeTab === 'add_content') return <AddContentPage onBack={() => setActiveTab('content_files')} />;
      if (activeTab === 'content_files') return <ContentModule mode="content" />;
      if (activeTab === 'results_book') return <ResultsModule />;
      if (activeTab === 'attendance_book') return <AttendanceModule />;
      if (activeTab === 'live_broadcast') return <LiveLessonsModule />;
    }

    return <div className="p-10 text-center font-black opacity-30 text-xl italic">جاري تحميل الوحدة المختارة...</div>;
  };

  const MenuItem = ({ id, icon: Icon, labelKey, submenu, menuKey }: any) => {
    const isActive = activeTab === id || (submenu && submenu.some((s: any) => s.id === activeTab));
    const isOpen = openMenus[menuKey || id];

    return (
      <div className="mb-2">
        <div
          onClick={() => {
            if (submenu) toggleMenu(menuKey || id);
            else {
              setActiveTab(id);
              if (window.innerWidth < 1024) setIsSidebarOpen(false);
            }
          }}
          className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer layout-transition ${isActive && !submenu ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'}`}
        >
          <div className="flex items-center gap-3">
            <Icon size={20} className={isActive && !submenu ? 'text-white' : 'text-slate-400'} />
            {!isCollapsed && <span className="text-[13px] font-bold tracking-tight">{labelKey}</span>}
          </div>
          {submenu && !isCollapsed && (
            <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          )}
        </div>
        {submenu && isOpen && !isCollapsed && (
          <div className={`mt-1 space-y-1 ${isRtl ? 'mr-5 border-r-2 pr-4' : 'ml-5 border-l-2 pl-4'} border-slate-100 animate-view`}>
            {submenu.map((sub: any) => (
              <div
                key={sub.id}
                onClick={() => {
                  setActiveTab(sub.id);
                  if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                className={`p-2.5 rounded-xl cursor-pointer text-[11px] font-bold transition-all ${activeTab === sub.id ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600'}`}
              >
                {sub.labelKey}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex h-screen overflow-hidden bg-[#f8fafc] ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <WatermarkOverlay />
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 right-0 z-[110] bg-white border-x flex flex-col layout-transition lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} ${isCollapsed ? 'w-24' : 'w-72'}`}>
        <div className="p-8 flex items-center justify-between border-b bg-white sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <img src={systemLogo} className="h-10 w-10 min-w-[40px] object-contain" alt="Logo" />
            {!isCollapsed && <span className="font-black text-xl tracking-tighter text-slate-900 italic">العقرب</span>}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 no-scrollbar space-y-1">
          <MenuItem id="overview" icon={LayoutDashboard} labelKey="لوحة التحكم" />

          {role === UserRole.ACCOUNTANT && (
            <>
              <MenuItem id="finance_dashboard" icon={Calculator} labelKey="اللوحة المالية (الحسابات)" />
              <MenuItem id="internal_tickets" icon={AlertCircle} labelKey="الدعم والتذاكر" />
            </>
          )}

          {role === UserRole.TEACHER && (
            <>
              <MenuItem
                labelKey="إدارة الاختبارات" icon={PenTool} menuKey="teacher_exams_group"
                submenu={[
                  { id: 'exams_list', labelKey: 'الاختبارات المنشورة' },
                  { id: 'exams_create', labelKey: 'إنشاء اختبار يدوي' },
                  { id: 'exams_ai_create', labelKey: 'اختبار ذكي (AI)' },
                  { id: 'exams_ai_corrector', labelKey: 'مصحح ذكي (OCR)' }
                ]}
              />
              <MenuItem id="manage_students" icon={Users} labelKey="إدارة الطلاب" />
              <MenuItem id="behavior_records" icon={Gavel} labelKey="سجل السلوك" />
              <MenuItem id="certificates" icon={Award} labelKey="الشهادات والتكريمات" />
              <MenuItem
                labelKey="الملفات والمركز" icon={FileType} menuKey="teacher_files_group"
                submenu={[
                  { id: 'content_events', labelKey: 'المناسبات والفعاليات' },
                  { id: 'content_files', labelKey: 'إدارة المحتوى التعليمي' }
                ]}
              />
              <MenuItem
                labelKey="الدفاتر والتقارير" icon={NotebookTabs} menuKey="teacher_ledger_group"
                submenu={[
                  { id: 'results_book', labelKey: 'دفتر النتائج' },
                  { id: 'attendance_book', labelKey: 'دفتر الحضور والغياب' },
                  { id: 'lesson_planner', labelKey: 'دفتر التحضير والمهام' }
                ]}
              />
              <MenuItem id="teacher_schedule" icon={CalendarCheck} labelKey="الجدول المدرسي" />
              <MenuItem id="live_broadcast" icon={Radio} labelKey="البث المباشر" />
              <MenuItem id="internal_tickets" icon={AlertCircle} labelKey="الدعم الفني" />
            </>
          )}

          {role === UserRole.STUDENT && (
            <>
              <MenuItem
                labelKey="الاختبارات" icon={FileText} menuKey="student_exams_group"
                submenu={[
                  { id: 'take_exam', labelKey: 'أداء الاختبارات' },
                  { id: 'exam_results', labelKey: 'سجل النتائج' }
                ]}
              />
              <MenuItem
                id="ai_tutor"
                icon={BrainCircuit}
                labelKey={t('ai_tutor') || 'المعلم الذكي'}
              />
              <MenuItem id="files" icon={Package} labelKey="الملفات والمحتوى" />
              <MenuItem id="live_room" icon={Presentation} labelKey="غرفة البث المباشر" />
            </>
          )}

          {role === UserRole.SUPER_ADMIN && (
            <>
              <MenuItem
                labelKey="إدارة بيئات النظام" icon={Globe} menuKey="sa_envs_group"
                submenu={[
                  { id: 'overview', labelKey: 'كافة العملاء' },
                  { id: 'simulation', labelKey: 'مركز المحاكاة' }
                ]}
              />
              <MenuItem id="subscriptions" icon={CreditCard} labelKey="متابعة الاشتراكات" />
            </>
          )}

          {role === UserRole.ADMIN && (
            <>
              <MenuItem id="approvals" icon={ClipboardCheck} labelKey="الاعتمادات والموافقات" />
              <MenuItem
                labelKey="إدارة الكوادر" icon={Building} menuKey="admin_management"
                submenu={[
                  { id: 'manage_teachers', labelKey: 'إدارة المعلمون' },
                  !isTutorMode && { id: 'manage_employees', labelKey: 'إدارة الموظفين' }
                ].filter(Boolean)}
              />
              <MenuItem id="manage_students" icon={Users} labelKey="كشف الطلاب والنتائج" />

              {/* Only show Academic Structure for Schools/Centers */}
              {!isTutorMode && (
                <MenuItem
                  labelKey="الهيكل الأكاديمي والكنترول"
                  icon={GraduationCap}
                  menuKey="admin_academic_group"
                  submenu={[
                    { id: 'academic_settings', labelKey: 'الإعدادات الأكاديمية' },
                    { id: 'subject_master', labelKey: 'توزيع المواد والمعلمين' },
                    { id: 'weekly_timetable', labelKey: 'الجدول الدراسي' },
                    { id: 'control_sheet', labelKey: 'شيت الكنترول والترحيل' }
                  ]}
                />
              )}

              <MenuItem id="behavior_records" icon={Gavel} labelKey="السلوك والمواظبة" />
              <MenuItem id="certificates" icon={Award} labelKey="إدارة الشهادات" />
              <MenuItem id="grading_standards" icon={Calculator} labelKey="معادلات الدرجات" />
            </>
          )}

          {role === UserRole.SECRETARY && (
            <>
              <MenuItem id="overview" icon={Scan} labelKey="الواجهة الرئيسية (Walk-In)" />
              <MenuItem id="internal_tickets" icon={AlertCircle} labelKey="التذاكر والطلبات" />
            </>
          )}

          {role === UserRole.PARENT && (
            <MenuItem
              labelKey="ملف الطالب" icon={UserCircle} menuKey="parent_student_profile"
              submenu={[
                { id: 'academic_results', labelKey: 'النتائج والمستوى الدراسي' },
                { id: 'ai_analysis', labelKey: 'تحليل ومقترحات AI' },
                { id: 'financial_records', labelKey: 'الاشتراكات والايصالات' }
              ]}
            />
          )}

          <MenuItem id="messages" icon={MessageSquare} labelKey="المراسلات" />
          <MenuItem id="settings" icon={Settings2} labelKey="الإعدادات" />
        </nav>

        <div className="p-6 border-t bg-white">
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 p-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-xs hover:bg-rose-600 hover:text-white transition-all shadow-sm">
            <LogOut size={18} /> {!isCollapsed && 'تسجيل الخروج'}
          </button>
        </div>
      </aside>

      <main className={`flex-1 flex flex-col overflow-hidden layout-transition ${isCollapsed ? 'pr-24' : 'pr-0 lg:pr-72'}`}>
        {/* Simulation Banner */}
        {originalAdmin && (
          <div className="bg-rose-600 text-white p-3 flex items-center justify-between px-10 animate-pulse z-[200]">
            <div className="flex items-center gap-4">
              <ShieldQuestion size={20} />
              <p className="font-black text-xs uppercase tracking-widest">
                {isRtl ? `أنت الآن في وضع المحاكاة: تتقمص دور [ ${user?.firstName} ${user?.lastName} ]` : `Simulation Mode: Acting as [ ${user?.firstName} ${user?.lastName} ]`}
              </p>
            </div>
            <button onClick={endSimulation} className="bg-white text-rose-600 px-6 py-2 rounded-xl font-black text-[10px] flex items-center gap-2 hover:bg-rose-50 transition-all">
              <UserMinus size={14} /> {isRtl ? 'إنهاء المحاكاة والعودة' : 'Exit Simulation'}
            </button>
          </div>
        )}

        <header className="h-20 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b z-40 sticky top-0 no-print">
          <button className="lg:hidden p-3 bg-slate-900 text-white rounded-xl" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-6 ms-auto">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-black text-xs flex items-center gap-2 transition-all border border-slate-200"
              title={lang === 'ar' ? 'English' : 'العربية'}
            >
              <Globe size={16} />
              <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900">{user?.firstName} {user?.lastName}</p>
                <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">{t(user?.role || '')}</p>
              </div>
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} className="w-10 h-10 rounded-xl bg-slate-50 border shadow-sm p-0.5" alt="Avatar" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 md:p-12 no-scrollbar bg-[#f8fafc]">
          <div className="max-w-[1600px] mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
