
import * as React from 'react';
import {
   Users, Landmark, Briefcase, Activity, Calendar, Trophy,
   ArrowUpRight, ClipboardCheck, Bell, Wand2, Calculator,
   TrendingUp, GraduationCap, CheckCircle, Settings,
   ArrowRightLeft, Wallet, ShieldCheck, Receipt, BarChart3,
   UserCircle, FileSpreadsheet, UserPlus, FileCheck, LayoutGrid, Siren
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { UserRole } from '../../types';
import SmartAnalytic from '../SmartAnalytic';

import PanicModeModule from '../PanicModeModule';
import FloorPlanModule from '../FloorPlanModule';
import AcademicSettings from '../modules/AcademicSettings';
import ControlSheet from '../modules/ControlSheet';

const AdminView: React.FC<{ onNavigate: (t: string) => void }> = ({ onNavigate }) => {
   const { allUsers = [], announcements = [], systemName, user, currentTenant } = useAppContext();
   const [internalMode, setInternalMode] = React.useState<'dashboard' | 'panic' | 'floor_plan' | 'academic_settings' | 'control_sheet'>('dashboard');
   const isTutorMode = currentTenant?.type === 'individual';

   if (internalMode === 'panic') return <PanicModeModule />;
   if (internalMode === 'floor_plan') return <div className="space-y-6"><button onClick={() => setInternalMode('dashboard')} className="text-sm font-bold text-slate-400 hover:text-indigo-600">← Back to Dashboard</button><FloorPlanModule /></div>;
   if (internalMode === 'academic_settings') return <div className="space-y-6"><button onClick={() => setInternalMode('dashboard')} className="text-sm font-bold text-slate-400 hover:text-indigo-600">← Back to Dashboard</button><AcademicSettings /></div>;
   if (internalMode === 'control_sheet') return <div className="space-y-6"><button onClick={() => setInternalMode('dashboard')} className="text-sm font-bold text-slate-400 hover:text-indigo-600">← Back to Dashboard</button><ControlSheet /></div>;

   const pendingApprovals = announcements?.filter?.(a => a.status === 'pending')?.length || 0;
   const teacherCount = allUsers.filter(u => u.role === UserRole.TEACHER).length;
   const studentCount = allUsers.filter(u => u.role === UserRole.STUDENT).length;

   return (
      <div className="space-y-12 animate-view pb-20">
         {/* Admin Command Center Hero */}
         <div className="relative p-12 rounded-[3.5rem] bg-slate-950 text-white shadow-3xl overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full -mr-60 -mt-60"></div>

            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
               <div className="space-y-6 text-right w-full lg:w-auto">
                  <div className="flex items-center gap-3">
                     <ShieldCheck className="text-blue-500" size={24} />
                     <span className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Branch Management Console</span>
                  </div>
                  <h1 className="text-5xl lg:text-5xl font-black tracking-tighter leading-none">{systemName}</h1>
                  <p className="text-slate-400 font-bold max-w-xl text-xl leading-relaxed">أهلاً بك يا سيادة المدير. المنظومة تعمل بكامل طاقتها، ولديك بعض المهام بانتظار قرارك.</p>
                  <div className="flex gap-4 pt-4 flex-wrap">
                     <button onClick={() => onNavigate('manage_students')} className="px-8 py-4 bg-white text-black rounded-2xl font-black text-sm flex items-center gap-3 hover:scale-105 transition-all">
                        <Users size={20} /> كشف الطلاب
                     </button>
                     <button onClick={() => onNavigate('approvals')} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20">
                        <FileCheck size={20} /> مركز الاعتمادات
                     </button>
                  </div>
               </div>

               <div className="relative z-10 grid grid-cols-2 gap-6 w-full lg:w-auto">
                  <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-xl text-center min-w-[200px] shadow-2xl">
                     <p className="text-[11px] font-black text-blue-400 uppercase mb-3 tracking-widest">طلبات الاعتماد</p>
                     <p className="text-6xl font-black text-white tabular-nums">{pendingApprovals}</p>
                     <button onClick={() => onNavigate('approvals')} className="mt-4 text-[10px] font-black text-slate-400 hover:text-white underline">مراجعة الآن</button>
                  </div>
                  <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-xl text-center min-w-[200px] shadow-2xl">
                     <p className="text-[11px] font-black text-emerald-400 uppercase mb-3 tracking-widest">الحضور العام</p>
                     <p className="text-6xl font-black text-white tabular-nums">94%</p>
                     <div className="w-16 h-1.5 bg-emerald-500 rounded-full mx-auto mt-4"></div>
                  </div>
               </div>
            </div>
         </div>

         {/* Statistics Hub */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <AdminStatCard label="إجمالي الطلاب" val={studentCount} icon={<Users />} trend="+12" color="text-blue-600" />
            <AdminStatCard label="المعلمون" val={teacherCount} icon={<GraduationCap />} trend="0" color="text-indigo-600" />
            <AdminStatCard label="الموظفون" val={allUsers.filter(u => u.role === UserRole.ACCOUNTANT || (u.role === UserRole.ADMIN && u.id !== user?.id)).length} icon={<Briefcase />} trend="+1" color="text-slate-900" />
            <AdminStatCard label="إيرادات الفرع" val="12,400" icon={<Landmark />} trend="+8%" color="text-emerald-600" />
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
               {/* Quick Actions Matrix */}
               <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {/* Common Tools */}
                  <AdminTool icon={<UserPlus />} label="إضافة كادر" onClick={() => onNavigate('add_employee')} color="bg-indigo-600" />
                  <AdminTool icon={<Briefcase />} label="إدارة الموظفين" onClick={() => onNavigate('manage_employees')} color="bg-blue-600" />
                  <AdminTool icon={<Users />} label="شؤون الطلاب" onClick={() => onNavigate('manage_students')} color="bg-slate-900" />
                  <AdminTool icon={<FileCheck />} label="الاعتمادات" onClick={() => onNavigate('approvals')} color="bg-amber-500" />

                  {/* Center Mode Extras */}
                  {!isTutorMode && (
                     <>
                        <AdminTool icon={<GraduationCap />} label="الإعدادات الأكاديمية" onClick={() => onNavigate('academic_settings')} color="bg-purple-600" />
                        <AdminTool icon={<FileSpreadsheet />} label="شيت الكنترول" onClick={() => onNavigate('control_sheet')} color="bg-emerald-600" />
                     </>
                  )}

                  {/* Other Tools */}
                  <AdminTool icon={<LayoutGrid />} label="القاعات (Floor Plan)" onClick={() => setInternalMode('floor_plan')} color="bg-teal-600" />
                  <AdminTool icon={<Siren />} label="الطوارئ (Panic)" onClick={() => setInternalMode('panic')} color="bg-rose-600" />
               </div>

               {/* Pending List with visual flair */}
               <div className="glass-card bg-white p-10 border border-slate-200 rounded-[3rem]">
                  <div className="flex justify-between items-center mb-10 border-b pb-6">
                     <h3 className="text-2xl font-black flex items-center gap-4 text-black"><ClipboardCheck className="text-blue-600" size={28} /> طلبات معلقة بانتظار موافقتك</h3>
                     <button onClick={() => onNavigate('approvals')} className="px-6 py-3 bg-slate-100 text-slate-900 rounded-xl text-xs font-black hover:bg-slate-900 hover:text-white transition-all">عرض الكل</button>
                  </div>
                  <div className="space-y-4">
                     {announcements?.filter?.(a => a.status === 'pending')?.slice(0, 4)?.map(ann => (
                        <div key={ann.id} className="flex justify-between items-center p-6 bg-slate-50/50 border border-transparent rounded-2xl hover:border-blue-600 hover:bg-white transition-all group shadow-sm">
                           <div className="flex items-center gap-5">
                              <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm"><Bell size={24} /></div>
                              <div>
                                 <p className="font-black text-lg text-slate-900">{ann.title}</p>
                                 <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">مقدم الطلب: {ann.authorName} ({ann.authorRole})</p>
                              </div>
                           </div>
                           <button onClick={() => onNavigate('approvals')} className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-900 rounded-xl text-xs font-black hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">معاينة واعتماد</button>
                        </div>
                     ))}
                     {pendingApprovals === 0 && (
                        <div className="text-center py-20 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                           <CheckCircle size={48} className="mx-auto text-emerald-500 mb-4 opacity-30" />
                           <p className="text-slate-400 font-black">لا توجد طلبات معلقة حالياً</p>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {/* Right Analytics Sidebar */}
            <div className="space-y-10">
               <div className="glass-card p-10 bg-white border border-slate-200 shadow-xl relative overflow-hidden rounded-[3rem]">
                  <h3 className="text-xl font-black mb-10 flex items-center gap-3 text-black">
                     <TrendingUp size={24} className="text-blue-600" /> تحليل نمو الفرع
                  </h3>
                  <div className="space-y-10">
                     <GrowthBar label="معدل التحصيل الدراسي" val={88} color="bg-blue-600" />
                     <GrowthBar label="التوسع في أعداد الطلاب" val={75} color="bg-slate-950" />
                     <GrowthBar label="كفاءة المصاريف التشغيلية" val={92} color="bg-emerald-600" />
                  </div>
                  <div className="mt-8">
                     <SmartAnalytic
                        role={UserRole.ADMIN}
                        dataContext={`مدير الفرع: عدد الطلاب ${studentCount}، المعلمين ${teacherCount}، الإيرادات 12,400. النمو الشهري 8%. هناك 3 طلبات اعتماد معلقة.`}
                     />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

const AdminStatCard = ({ label, val, icon, trend, color }: any) => (
   <div className="glass-card p-8 bg-white border border-slate-200 rounded-[2.5rem] flex flex-col gap-6 group hover:border-blue-600 transition-all shadow-sm">
      <div className="flex justify-between items-start">
         <div className={`p-4 bg-slate-50 ${color} rounded-2xl shadow-inner group-hover:scale-110 transition-transform`}>{React.cloneElement(icon, { size: 28 })}</div>
         <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 tabular-nums">
            <ArrowUpRight size={12} /> {trend}
         </div>
      </div>
      <div>
         <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
         <h4 className="text-4xl font-black text-slate-900 tabular-nums">{val}</h4>
      </div>
   </div>
);

const AdminTool = ({ icon, label, onClick, color }: any) => (
   <button onClick={onClick} className="glass-card p-6 bg-white border border-slate-100 rounded-[2rem] flex flex-col items-center gap-4 hover:bg-slate-950 transition-all group shadow-sm min-h-[160px] justify-center">
      <div className={`p-5 ${color} text-white rounded-2xl shadow-lg group-hover:scale-110 transition-transform`}>
         {React.cloneElement(icon as React.ReactElement<any>, { size: 28 })}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors text-center">{label}</span>
   </button>
);

const GrowthBar = ({ label, val, color }: any) => (
   <div className="space-y-3">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
         <span>{label}</span>
         <span className="text-black">{val}%</span>
      </div>
      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
         <div className={`h-full ${color} transition-all duration-1000 shadow-sm`} style={{ width: `${val}%` }}></div>
      </div>
   </div>
);

export default AdminView;
