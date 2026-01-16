
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
  ShieldQuestion, UserMinus, Bot, Search
} from 'lucide-react';

import StudentView from './views/StudentView';
import TeacherView from './views/TeacherView';
import ParentView from './views/ParentView';
import SuperAdminView from './views/SuperAdminView';
import AccountantView from './views/AccountantView';
import AdminView from './views/AdminView';
import AccountantModule from './AccountantModule';
import ManagementModule from './ManagementModule';
import ChatSystem from './ChatSystem';
import SettingsView from './SettingsView';
import ContentModule from './ContentModule';
import FilesModule from './FilesModule';
import ApprovalsModule from './ApprovalsModule';
import StudentExamModule from './StudentExamModule';
import LiveLessonsModule from './LiveLessonsModule';
import ExamsModule from './ExamsModule';
import ResultsModule from './ResultsModule';
import AttendanceModule from './AttendanceModule';

import { AIAnalyst } from './AIModules';
import SmartTutor from './SmartTutor';

const DashboardLayout: React.FC<{ role: UserRole; onLogout: () => void; onRoleSwitch: (r: UserRole) => void }> = ({ role, onLogout, onRoleSwitch }) => {
  const { lang, t, user, systemLogo, originalAdmin, endSimulation, systemContact, focusMode } = useAppContext();
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
    teacher_ledger_group: true
  });

  const isRtl = lang === 'ar';
  const toggleMenu = (menu: string) => setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));

  const renderContent = () => {
    if (activeTab === 'messages') return <ChatSystem currentUserRole={role} />;
    if (activeTab === 'settings') return <SettingsView />;

    // Shared AI Views
    if (activeTab === 'ai_analysis') return <AIAnalyst role={role} />;

    if (role === UserRole.SUPER_ADMIN) return <SuperAdminView mode={activeTab as any} onNavigate={setActiveTab} />;

    if (role === UserRole.ADMIN) {
      if (activeTab === 'overview') return <AdminView onNavigate={setActiveTab} />;
      if (activeTab === 'approvals') return <ApprovalsModule />;
      if (activeTab === 'manage_teachers') return <ManagementModule mode="teachers" />;
      if (activeTab === 'manage_employees') return <ManagementModule mode="employees" />;
      if (activeTab === 'manage_students') return <ManagementModule mode="students" />;
    }

    if (role === UserRole.ACCOUNTANT) {
      if (activeTab === 'overview') return <AccountantView onNavigate={setActiveTab} />;
      return <AccountantModule mode={activeTab} onNavigate={setActiveTab} />;
    }

    if (role === UserRole.PARENT) {
      if (activeTab === 'ai_analysis_parent') return <AIAnalyst role={UserRole.STUDENT} />; // Analyze child
      return <ParentView onNavigate={setActiveTab} mode={activeTab as any} />;
    }

    if (role === UserRole.STUDENT) {
      if (activeTab === 'overview') return <StudentView onNavigate={setActiveTab} />;
      if (activeTab === 'take_exam') return <StudentExamModule mode="hall" />;
      if (activeTab === 'exam_results') return <StudentExamModule mode="results" />;
      if (activeTab === 'files') return <FilesModule />;
      if (activeTab === 'live_room') return <LiveLessonsModule isStudentView />;
      if (activeTab === 'ai_tutor') return <SmartTutor />;
    }

    if (role === UserRole.TEACHER) {
      if (activeTab === 'overview') return <TeacherView onNavigate={setActiveTab} />;
      if (activeTab === 'exams_list') return <ExamsModule mode="list" />;
      if (activeTab === 'exams_create') return <ExamsModule mode="create" />;
      if (activeTab === 'exams_ai_create') return <ExamsModule mode="ai_create" />;
      if (activeTab === 'exams_ai_corrector') return <ExamsModule mode="ai_corrector" />;

      if (activeTab === 'manage_students') return <ManagementModule mode="students" />;
      if (activeTab === 'content_events') return <ContentModule mode="events" />;
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
      <div className="mb-2 px-3">
        <div
          onClick={() => {
            if (submenu) toggleMenu(menuKey || id);
            else {
              setActiveTab(id);
              if (window.innerWidth < 1024) setIsSidebarOpen(false);
            }
          }}
          className={`group flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all duration-300 ${isActive && !submenu ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'}`}
        >
          <div className="flex items-center gap-3.5">
            <div className={`p-1 rounded-lg transition-colors ${isActive && !submenu ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-indigo-100'}`}>
              <Icon size={18} className={isActive && !submenu ? 'text-white' : 'text-slate-500 group-hover:text-indigo-600'} />
            </div>
            {!isCollapsed && <span className="text-[13px] font-bold tracking-tight">{labelKey}</span>}
          </div>
          {submenu && !isCollapsed && (
            <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} ${isActive ? 'text-indigo-200' : 'text-slate-400'}`} />
          )}
        </div>
        {submenu && isOpen && !isCollapsed && (
          <div className={`mt-2 space-y-1 ${isRtl ? 'mr-4 pr-3 border-r-2 border-slate-100' : 'ml-4 pl-3 border-l-2 border-slate-100'} animate-fade-in`}>
            {submenu.map((sub: any) => (
              <div
                key={sub.id}
                onClick={() => {
                  setActiveTab(sub.id);
                  if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                className={`p-2.5 rounded-lg cursor-pointer text-[11px] font-bold transition-all relative overflow-hidden ${activeTab === sub.id ? 'text-indigo-600 bg-indigo-50/80 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-indigo-600' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-50'}`}
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
    <div className={`flex h-screen overflow-hidden bg-[#f1f5f9] ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {!focusMode && (
        <aside className={`fixed inset-y-0 ${isRtl ? 'right-0' : 'left-0'} z-[110] bg-white shadow-xl shadow-slate-200/50 flex flex-col layout-transition lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : (isRtl ? 'translate-x-full' : '-translate-x-full')} ${isCollapsed ? 'w-24' : 'w-72'}`}>
          <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100 bg-white/50 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shadow-inner border border-slate-100">
                <img src={systemLogo} className="h-9 w-9 object-contain" alt="Logo" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="font-black text-lg tracking-tighter text-slate-900 leading-none uppercase">ALEAQRAB</span>
                  <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">System v3.0</span>
                </div>
              )}
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-6 no-scrollbar space-y-1">
            <MenuItem id="overview" icon={LayoutDashboard} labelKey="لوحة التحكم" />

            {role === UserRole.ACCOUNTANT && (
              <>
                <MenuItem
                  labelKey="إدارية" icon={Building} menuKey="acc_admin"
                  submenu={[
                    { id: 'acc_coa', labelKey: 'شجرة الحسابات' },
                    { id: 'acc_employees', labelKey: 'إدارة موظفين' },
                    { id: 'acc_clients', labelKey: 'العملاء' },
                    { id: 'acc_suppliers', labelKey: 'الموردين' },
                    { id: 'acc_inventory', labelKey: 'ادارة مخازن' }
                  ]}
                />
                <MenuItem
                  labelKey="قيود محاسبية" icon={FileSpreadsheet} menuKey="acc_entries"
                  submenu={[
                    { id: 'acc_entries_list', labelKey: 'دفتر القيود' },
                    { id: 'acc_vouchers', labelKey: 'سندات صرف وإيداع' },
                    { id: 'acc_journal', labelKey: 'قيود يومية' }
                  ]}
                />
                <MenuItem id="acc_payroll" icon={CreditCard} labelKey="كشوفات الرواتب والالتزامات" />
                <MenuItem id="acc_reports" icon={BarChart3} labelKey="تقارير محاسبية" />
                <MenuItem id="acc_liquidity" icon={Wallet} labelKey="السيولة المالية" />
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
                <MenuItem
                  labelKey="الملفات والمركز" icon={FileType} menuKey="teacher_files_group"
                  submenu={[
                    { id: 'content_events', labelKey: 'المناسبات والفعاليات' },
                    { id: 'content_files', labelKey: 'إدارة المحتوى التعليمي' }
                  ]}
                />
                <MenuItem
                  labelKey="دفتر" icon={NotebookTabs} menuKey="teacher_ledger_group"
                  submenu={[
                    { id: 'results_book', labelKey: 'دفتر النتائج' },
                    { id: 'attendance_book', labelKey: 'دفتر الحضور والغياب' }
                  ]}
                />
                <MenuItem id="live_broadcast" icon={Radio} labelKey="البث المباشر" />
                <MenuItem id="ai_analysis" icon={BrainCircuit} labelKey="المحلل الذكي" />
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
                <MenuItem id="files" icon={Package} labelKey="الملفات والمحتوى" />
                <MenuItem id="live_room" icon={Presentation} labelKey="غرفة البث المباشر" />
                <MenuItem id="ai_tutor" icon={Bot} labelKey="المعلم الذكي" />
                <MenuItem id="ai_analysis" icon={BrainCircuit} labelKey="تحليل مستواي" />
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
                <MenuItem id="permissions" icon={ShieldCheck} labelKey="إدارة الصلاحيات (SaaS)" />
                <MenuItem id="system_settings" icon={Settings} labelKey="الإعدادات العامة" />
              </>
            )}

            {role === UserRole.ADMIN && (
              <>
                <MenuItem id="approvals" icon={ClipboardCheck} labelKey="الاعتمادات والموافقات" />
                <MenuItem
                  labelKey="إدارة الكوادر" icon={Building} menuKey="admin_management"
                  submenu={[
                    { id: 'manage_teachers', labelKey: 'إدارة المعلمون' },
                    { id: 'manage_employees', labelKey: 'إدارة الموظفين' }
                  ]}
                />
                <MenuItem id="manage_students" icon={Users} labelKey="كشف الطلاب والنتائج" />
                <MenuItem id="ai_analysis" icon={BrainCircuit} labelKey="تحليل أداء الفرع" />
              </>
            )}

            {role === UserRole.PARENT && (
              <MenuItem
                labelKey="ملف الطالب" icon={UserCircle} menuKey="parent_student_profile"
                submenu={[
                  { id: 'academic_results', labelKey: 'النتائج والمستوى الدراسي' },
                  { id: 'ai_analysis_parent', labelKey: 'تحليل ومقترحات AI' },
                  { id: 'financial_records', labelKey: 'الاشتراكات والايصالات' }
                ]}
              />
            )}

            <div className="my-4 px-6 border-b border-slate-100"></div>

            <MenuItem id="messages" icon={MessageSquare} labelKey="المراسلات" />
            <MenuItem id="settings" icon={Settings2} labelKey="الإعدادات" />
          </nav>

          {!isCollapsed && (
            <div className="mx-6 mb-8 p-6 bg-slate-900 rounded-[2rem] text-right relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full -mr-12 -mt-12 blur-xl group-hover:bg-indigo-500/20 transition-all"></div>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">الدعم الفني <ShieldQuestion size={12} /></p>
              <div className="space-y-3 relative z-10">
                <a href={`mailto:${systemContact.email}`} className="block text-[11px] font-bold text-slate-300 hover:text-white transition-colors truncate">{systemContact.email}</a>
                <a href={`tel:${systemContact.phone}`} className="block text-sm font-black text-white hover:text-indigo-400 transition-colors">{systemContact.phone}</a>
              </div>
            </div>
          )}

          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 p-3 text-slate-500 rounded-xl font-bold text-xs hover:bg-rose-50 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100">
              <LogOut size={16} /> {!isCollapsed && 'تسجيل الخروج'}
            </button>
          </div>
        </aside>
      )}

      <main className={`flex-1 flex flex-col overflow-hidden layout-transition bg-[#f1f5f9] 
        ${focusMode ? 'fixed inset-0 z-[200]' : (isCollapsed
          ? (isRtl ? 'lg:pr-24' : 'lg:pl-24')
          : (isRtl ? 'lg:pr-72' : 'lg:pl-72')
        )} w-full`}>

        {/* Simulation Banner */}
        {originalAdmin && (
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-2.5 flex items-center justify-between px-6 shadow-md z-[200]">
            <div className="flex items-center gap-3">
              <ShieldQuestion size={18} className="animate-pulse" />
              <p className="font-bold text-xs uppercase tracking-wider">
                {isRtl ? `وضع المحاكاة نشط: [ ${user?.firstName} ${user?.lastName} ]` : `Simulation Mode Active: [ ${user?.firstName} ${user?.lastName} ]`}
              </p>
            </div>
            <button onClick={endSimulation} className="bg-white/20 hover:bg-white/30 text-white px-4 py-1.5 rounded-lg font-bold text-[10px] flex items-center gap-2 transition-all">
              <UserMinus size={14} /> {isRtl ? 'إنهاء' : 'Exit'}
            </button>
          </div>
        )}

        {!focusMode && (
          <header className="h-20 md:h-24 flex items-center justify-between px-4 md:px-8 glass-panel border-b-0 border-white/40 sticky top-2 md:top-4 z-40 mx-2 md:mx-4 rounded-2xl md:rounded-3xl shadow-sm no-print mb-4 md:mb-6 transition-all duration-300 hover:soft-shadow">

            <div className="flex items-center gap-6">
              <button className="lg:hidden p-3 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all" onClick={() => setIsSidebarOpen(true)}>
                <Menu size={24} />
              </button>
              <div className="hidden md:flex flex-col">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                  {t(activeTab) || activeTab.replace(/_/g, ' ')}
                </h2>
                <p className="text-xs font-bold text-slate-400 mt-1">مرحباً بك في لوحة التحكم</p>
              </div>
            </div>

            <div className="flex-1 max-w-xl mx-8 hidden lg:block group">
              <div className="relative group-hover:scale-[1.01] transition-transform duration-300">
                <Search className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 transition-colors`} size={20} />
                <input
                  type="text"
                  placeholder={isRtl ? "ابحث عن طالب، فاتورة، أو إعداد..." : "Search for student, invoice, or setting..."}
                  className="w-full bg-slate-50/80 border-2 border-transparent focus:bg-white focus:border-indigo-100 focus:shadow-lg focus:shadow-indigo-100/50 rounded-2xl py-3.5 px-12 text-sm font-bold text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-300"
                />
                <div className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 flex gap-1`}>
                  <span className="bg-slate-200 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-lg">⌘ K</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <button className="relative p-3 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-2xl transition-all group">
                <Bell size={22} className="group-hover:animate-swing" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
              </button>

              <div className="h-10 w-[1px] bg-slate-200/60"></div>

              <div className="flex items-center gap-4 pl-2 cursor-pointer p-1.5 pr-2 rounded-2xl hover:bg-white/50 border border-transparent hover:border-slate-100 transition-all">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-slate-800">{user?.firstName} {user?.lastName}</p>
                  <div className="flex items-center justify-end gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t(user?.role || '')}</p>
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-indigo-600 rounded-2xl rotate-6 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} className="w-12 h-12 rounded-2xl bg-indigo-50 border-2 border-white shadow-md group-hover:scale-105 transition-transform" alt="Avatar" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
              </div>
            </div>
          </header>
        )}

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 no-scrollbar">
          <div className="max-w-[1600px] mx-auto animate-fade-in relative z-10 w-full">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
