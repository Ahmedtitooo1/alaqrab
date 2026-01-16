
import * as React from 'react';
import {
   Users, Landmark, Briefcase, Activity, Calendar, Trophy,
   ArrowUpRight, ClipboardCheck, Bell, Wand2, Calculator,
   TrendingUp, GraduationCap, CheckCircle, Settings,
   ArrowRightLeft, Wallet, ShieldCheck, Receipt, BarChart3,
   UserCircle, FileSpreadsheet, UserPlus, FileCheck
} from 'lucide-react';
import SmartAnalytic from '../SmartAnalytic';
import { useAppContext } from '../../context/AppContext';
import { UserRole } from '../../types';

const AdminView: React.FC<{ onNavigate: (t: string) => void }> = ({ onNavigate }) => {
   const { allUsers = [], announcements = [], systemName, user } = useAppContext();

   const pendingApprovals = announcements?.filter?.(a => a.status === 'pending')?.length || 0;
   const teacherCount = allUsers?.filter?.(u => u.role === UserRole.TEACHER)?.length || 0;
   const studentCount = allUsers?.filter?.(u => u.role === UserRole.STUDENT)?.length || 0;

   return (
      <div className="space-y-12 animate-view pb-20">
         {/* Admin Command Center Hero */}
         <div className="relative p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] bg-slate-950 text-white shadow-3xl overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full -mr-60 -mt-60"></div>

            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8 md:gap-12">
               <div className="space-y-4 md:space-y-6 text-center lg:text-right w-full lg:w-auto">
                  <div className="flex items-center justify-center lg:justify-start gap-3">
                     <ShieldCheck className="text-indigo-500" size={20} md:size={24} />
                     <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-slate-400">Branch Management Console</span>
                  </div>
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-none">{systemName}</h1>
                  <p className="text-slate-400 font-bold max-w-xl text-base md:text-xl leading-relaxed mx-auto lg:mx-0">أهلاً بك يا سيادة المدير. المنظومة تعمل بكامل طاقتها، ولديك بعض المهام بانتظار قرارك.</p>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                     <button onClick={() => onNavigate('manage_students')} className="flex-1 sm:flex-none px-6 md:px-8 py-3 md:py-4 bg-white text-black rounded-xl md:rounded-2xl font-black text-xs md:text-sm flex items-center justify-center gap-3 hover:scale-105 transition-all">
                        <Users size={18} md:size={20} /> كشف الطلاب
                     </button>
                     <button onClick={() => onNavigate('approvals')} className="flex-1 sm:flex-none px-6 md:px-8 py-3 md:py-4 bg-indigo-600 text-white rounded-xl md:rounded-2xl font-black text-xs md:text-sm flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20">
                        <FileCheck size={18} md:size={20} /> مركز الاعتمادات
                     </button>
                  </div>
               </div>

               <div className="relative z-10 grid grid-cols-2 gap-4 md:gap-6 w-full lg:w-auto">
                  <div className="p-4 md:p-8 bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] backdrop-blur-xl text-center min-w-[120px] md:min-w-[200px] shadow-2xl">
                     <p className="text-[9px] md:text-[11px] font-black text-indigo-400 uppercase mb-2 md:mb-3 tracking-widest">طلبات الاعتماد</p>
                     <p className="text-3xl md:text-6xl font-black text-white tabular-nums">{pendingApprovals}</p>
                     <button onClick={() => onNavigate('approvals')} className="mt-2 md:mt-4 text-[9px] md:text-[10px] font-black text-slate-400 hover:text-white underline">مراجعة الآن</button>
                  </div>
                  <div className="p-4 md:p-8 bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] backdrop-blur-xl text-center min-w-[120px] md:min-w-[200px] shadow-2xl">
                     <p className="text-[9px] md:text-[11px] font-black text-emerald-400 uppercase mb-2 md:mb-3 tracking-widest">الحضور العام</p>
                     <p className="text-3xl md:text-6xl font-black text-white tabular-nums">94%</p>
                     <div className="w-12 md:w-16 h-1 md:h-1.5 bg-emerald-500 rounded-full mx-auto mt-3 md:mt-4"></div>
                  </div>
               </div>
            </div>
         </div>

         {/* Statistics Hub */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <AdminStatCard label="إجمالي الطلاب" val={studentCount} icon={<Users />} trend="+12" color="text-indigo-600" />
            <AdminStatCard label="المعلمون" val={teacherCount} icon={<GraduationCap />} trend="0" color="text-indigo-600" />
            <AdminStatCard label="الموظفون" val={allUsers.filter(u => u.role === UserRole.ACCOUNTANT || (u.role === UserRole.ADMIN && u.id !== user?.id)).length} icon={<Briefcase />} trend="+1" color="text-slate-900" />
            <AdminStatCard label="إيرادات الفرع" val="12,400" icon={<Landmark />} trend="+8%" color="text-emerald-600" />
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
               {/* Quick Actions Matrix */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <AdminTool icon={<UserPlus />} label="إضافة معلم" onClick={() => onNavigate('manage_teachers')} color="bg-indigo-600" />
                  <AdminTool icon={<Briefcase />} label="إدارة الموظفين" onClick={() => onNavigate('manage_employees')} color="bg-indigo-500" />
                  <AdminTool icon={<Users />} label="شؤون الطلاب" onClick={() => onNavigate('manage_students')} color="bg-slate-900" />
                  <AdminTool icon={<FileCheck />} label="الاعتمادات" onClick={() => onNavigate('approvals')} color="bg-amber-500" />
               </div>

               {/* Pending List with visual flair */}
               <div className="glass-card bg-white p-6 md:p-10 border border-slate-200 rounded-[2rem] md:rounded-[3rem]">
                  <div className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-10 border-b pb-6 gap-4">
                     <h3 className="text-xl md:text-2xl font-black flex items-center gap-3 md:gap-4 text-black"><ClipboardCheck className="text-indigo-600" size={24} md:size={28} /> طلبات معلقة</h3>
                     <button onClick={() => onNavigate('approvals')} className="w-full sm:w-auto px-6 py-3 bg-slate-100 text-slate-900 rounded-xl text-xs font-black hover:bg-slate-900 hover:text-white transition-all">عرض الكل</button>
                  </div>
                  <div className="space-y-4">
                     {announcements?.filter?.(a => a.status === 'pending')?.slice(0, 4)?.map(ann => (
                        <div key={ann.id} className="flex justify-between items-center p-6 bg-slate-50/50 border border-transparent rounded-2xl hover:border-indigo-600 hover:bg-white transition-all group shadow-sm">
                           <div className="flex items-center gap-5">
                              <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm"><Bell size={24} /></div>
                              <div>
                                 <p className="font-black text-lg text-slate-900">{ann.title}</p>
                                 <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">مقدم الطلب: {ann.authorName} ({ann.authorRole})</p>
                              </div>
                           </div>
                           <button onClick={() => onNavigate('approvals')} className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-900 rounded-xl text-xs font-black hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all">معاينة واعتماد</button>
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
                     <TrendingUp size={24} className="text-indigo-600" /> تحليل نمو الفرع
                  </h3>
                  <div className="space-y-10">
                     <GrowthBar label="معدل التحصيل الدراسي" val={88} color="bg-indigo-600" />
                     <GrowthBar label="التوسع في أعداد الطلاب" val={75} color="bg-slate-950" />
                     <GrowthBar label="كفاءة المصاريف التشغيلية" val={92} color="bg-emerald-600" />
                  </div>
                  <div className="mt-12">
                     <SmartAnalytic
                        role={UserRole.ADMIN}
                        dataContext={`تحليل أداء الفرع: إجمالي الطلاب ${studentCount}، المعلمين ${teacherCount}، نسبة الحضور 94%. الدخل الشهري 12,400، وهناك ${pendingApprovals} طلبات معلقة.`}
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
