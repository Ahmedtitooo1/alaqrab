
import React, { useState } from 'react';
import {
    LayoutDashboard, MessageSquare, Settings2, LogOut, ChevronDown,
    Globe, ShieldCheck, UserMinus, Menu, Bell,
    Building, FileSpreadsheet, CreditCard, BarChart3, Wallet, AlertCircle,
    PenTool, Users, Gavel, Award, FileType, NotebookTabs, Radio,
    FileText, BrainCircuit, Package, Presentation,
    ClipboardCheck, Calculator, GraduationCap,
    Scan, UserCircle
} from 'lucide-react';
import { UserRole } from '../../../types';
import { useAppContext } from '../../../context/AppContext';
import { useLanguage } from '../../../src/context/LanguageContext';

interface SidebarProps {
    role: UserRole;
    isCollapsed: boolean;
    onLogout: () => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isSidebarOpen: boolean;
    onCloseMobile: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    role, isCollapsed, onLogout, activeTab, setActiveTab, isSidebarOpen, onCloseMobile
}) => {
    const { systemLogo, currentTenant } = useAppContext();
    const { t, isRtl } = useLanguage();
    const isTutorMode = currentTenant?.type === 'individual';

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

    const toggleMenu = (menu: string) => setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));

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
                            if (window.innerWidth < 1024) onCloseMobile();
                        }
                    }}
                    className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer layout-transition ${isActive && !submenu ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'}`}
                >
                    <div className="flex items-center gap-3">
                        <Icon size={20} className={isActive && !submenu ? 'text-white' : 'text-slate-400'} />
                        {!isCollapsed && <span className="text-[13px] font-bold tracking-tight">{t(labelKey)}</span>}
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
                                    if (window.innerWidth < 1024) onCloseMobile();
                                }}
                                className={`p-2.5 rounded-xl cursor-pointer text-[11px] font-bold transition-all ${activeTab === sub.id ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600'}`}
                            >
                                {t(sub.labelKey)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] lg:hidden" onClick={onCloseMobile} />
            )}

            <aside className={`fixed inset-y-0 right-0 z-[110] bg-white border-x flex flex-col layout-transition lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : (isRtl ? 'translate-x-full' : '-translate-x-full')} ${isCollapsed ? 'w-24' : 'w-72'} ${!isRtl && 'left-0 right-auto border-r border-l-0'}`}>
                <div className="p-8 flex items-center justify-between border-b bg-white sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <img src={systemLogo} className="h-10 w-10 min-w-[40px] object-contain" alt="Logo" />
                        {!isCollapsed && <span className="font-black text-xl tracking-tighter text-slate-900 italic">{t('system_name')}</span>}
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 py-6 no-scrollbar space-y-1">
                    <MenuItem id="overview" icon={LayoutDashboard} labelKey="dashboard" />

                    {role === UserRole.ACCOUNTANT && (
                        <>
                            <MenuItem
                                labelKey="acc_admin" icon={Building} menuKey="acc_admin"
                                submenu={[
                                    { id: 'acc_coa', labelKey: 'acc_coa' },
                                    !isTutorMode && { id: 'acc_employees', labelKey: 'acc_employees' },
                                    { id: 'acc_clients', labelKey: 'acc_clients' },
                                    { id: 'acc_suppliers', labelKey: 'acc_suppliers' },
                                    !isTutorMode && { id: 'acc_inventory', labelKey: 'acc_inventory' }
                                ].filter(Boolean)}
                            />
                            <MenuItem
                                labelKey="acc_entries" icon={FileSpreadsheet} menuKey="acc_entries"
                                submenu={[
                                    { id: 'acc_entries_list', labelKey: 'acc_entries_list' },
                                    { id: 'acc_vouchers', labelKey: 'acc_vouchers' },
                                    { id: 'acc_journal', labelKey: 'acc_journal' }
                                ]}
                            />
                            {!isTutorMode && <MenuItem id="acc_payroll" icon={CreditCard} labelKey="acc_payroll" />}
                            <MenuItem id="acc_reports" icon={BarChart3} labelKey="acc_reports" />
                            <MenuItem id="acc_liquidity" icon={Wallet} labelKey="acc_liquidity" />
                            <MenuItem id="internal_tickets" icon={AlertCircle} labelKey="internal_tickets" />
                        </>
                    )}

                    {role === UserRole.TEACHER && (
                        <>
                            <MenuItem
                                labelKey="teacher_exams_group" icon={PenTool} menuKey="teacher_exams_group"
                                submenu={[
                                    { id: 'exams_list', labelKey: 'exams_list' },
                                    { id: 'exams_create', labelKey: 'exams_create' },
                                    { id: 'exams_ai_create', labelKey: 'exams_ai_create' },
                                    { id: 'exams_ai_corrector', labelKey: 'exams_ai_corrector' }
                                ]}
                            />
                            <MenuItem id="manage_students" icon={Users} labelKey="manage_students" />
                            <MenuItem id="behavior_records" icon={Gavel} labelKey="behavior_records" />
                            <MenuItem id="certificates" icon={Award} labelKey="certificates" />
                            <MenuItem
                                labelKey="teacher_files_group" icon={FileType} menuKey="teacher_files_group"
                                submenu={[
                                    { id: 'content_events', labelKey: 'content_events' },
                                    { id: 'content_files', labelKey: 'content_files' }
                                ]}
                            />
                            <MenuItem
                                labelKey="teacher_ledger_group" icon={NotebookTabs} menuKey="teacher_ledger_group"
                                submenu={[
                                    { id: 'results_book', labelKey: 'results_book' },
                                    { id: 'attendance_book', labelKey: 'attendance_book' }
                                ]}
                            />
                            <MenuItem id="live_broadcast" icon={Radio} labelKey="live_broadcast" />
                            <MenuItem id="internal_tickets" icon={AlertCircle} labelKey="internal_tickets_tech" />
                        </>
                    )}

                    {role === UserRole.STUDENT && (
                        <>
                            <MenuItem
                                labelKey="student_exams_group" icon={FileText} menuKey="student_exams_group"
                                submenu={[
                                    { id: 'take_exam', labelKey: 'take_exam' },
                                    { id: 'exam_results', labelKey: 'exam_results' }
                                ]}
                            />
                            <MenuItem
                                id="ai_tutor"
                                icon={BrainCircuit}
                                labelKey="ai_tutor"
                            />
                            <MenuItem id="files" icon={Package} labelKey="files" />
                            <MenuItem id="live_room" icon={Presentation} labelKey="live_room" />
                        </>
                    )}

                    {role === UserRole.SUPER_ADMIN && (
                        <>
                            <MenuItem
                                labelKey="sa_envs_group" icon={Globe} menuKey="sa_envs_group"
                                submenu={[
                                    { id: 'overview', labelKey: 'sa_overview' },
                                    { id: 'simulation', labelKey: 'simulation' }
                                ]}
                            />
                            <MenuItem id="subscriptions" icon={CreditCard} labelKey="subscriptions" />
                        </>
                    )}

                    {role === UserRole.ADMIN && (
                        <>
                            <MenuItem id="approvals" icon={ClipboardCheck} labelKey="approvals" />
                            <MenuItem
                                labelKey="admin_management" icon={Building} menuKey="admin_management"
                                submenu={[
                                    { id: 'manage_teachers', labelKey: 'manage_teachers' },
                                    !isTutorMode && { id: 'manage_employees', labelKey: 'acc_employees' }
                                ].filter(Boolean)}
                            />
                            <MenuItem id="manage_students" icon={Users} labelKey="manage_students" />

                            {!isTutorMode && (
                                <MenuItem
                                    labelKey="admin_academic_group"
                                    icon={GraduationCap}
                                    menuKey="admin_academic_group"
                                    submenu={[
                                        { id: 'academic_settings', labelKey: 'academic_settings' },
                                        { id: 'subject_master', labelKey: 'subject_master' },
                                        { id: 'weekly_timetable', labelKey: 'weekly_timetable' },
                                        { id: 'control_sheet', labelKey: 'control_sheet' }
                                    ]}
                                />
                            )}

                            <MenuItem id="behavior_records" icon={Gavel} labelKey="behavior_records" />
                            <MenuItem id="certificates" icon={Award} labelKey="certificates" />
                            <MenuItem id="grading_standards" icon={Calculator} labelKey="grading_standards" />
                        </>
                    )}

                    {role === UserRole.SECRETARY && (
                        <>
                            <MenuItem id="overview" icon={Scan} labelKey="walk_in" />
                            <MenuItem id="internal_tickets" icon={AlertCircle} labelKey="internal_tickets" />
                        </>
                    )}

                    {role === UserRole.PARENT && (
                        <MenuItem
                            labelKey="parent_student_profile" icon={UserCircle} menuKey="parent_student_profile"
                            submenu={[
                                { id: 'academic_results', labelKey: 'academic_results' },
                                { id: 'ai_analysis', labelKey: 'ai_analysis' },
                                { id: 'financial_records', labelKey: 'financial_records' }
                            ]}
                        />
                    )}

                    <MenuItem id="messages" icon={MessageSquare} labelKey="messages" />
                    <MenuItem id="settings" icon={Settings2} labelKey="settings" />
                </nav>

                <div className="p-6 border-t bg-white">
                    <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 p-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-xs hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                        <LogOut size={18} /> {!isCollapsed && t('logout')}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
