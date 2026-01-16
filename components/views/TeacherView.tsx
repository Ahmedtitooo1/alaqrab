
import React from 'react';
import {
   Users, BookOpen, BrainCircuit, Video,
   TrendingUp, Activity, PlusCircle, FileUp,
   ArrowUpRight, Clock, Award, Star, Zap,
   MonitorPlay
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import SmartAnalytic from '../SmartAnalytic';
import { UserRole } from '../../types';

interface ViewProps {
   onNavigate: (tab: string) => void;
}

const TeacherView: React.FC<ViewProps> = ({ onNavigate }) => {
   const { lang, t, user, allUsers } = useAppContext();
   const isRtl = lang === 'ar';

   const studentCount = allUsers.filter(u => u.role === UserRole.STUDENT).length;

   return (
      <div className="space-y-10 animate-view pb-16">
         {/* 1. Teacher Hero Header */}
         <div className="relative p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-white border border-slate-200 shadow-xl">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full -mr-40 -mt-40"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10">
               <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-right w-full md:w-auto">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-50 rounded-[1.5rem] md:rounded-3xl flex items-center justify-center text-blue-600 border border-blue-100 shadow-inner shrink-0">
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher`} className="w-full h-full p-2" alt="Teacher" />
                  </div>
                  <div>
                     <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">
                        {isRtl ? `مرحباً بك، م/ ${user?.firstName}` : `Welcome, Eng. ${user?.firstName}`}
                     </h1>
                     <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-4 items-center">
                        <div className="flex items-center gap-2 px-3 md:px-4 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                           <Activity size={12} />
                           <span className="text-[10px] font-black uppercase tracking-widest">{t('active_now')}</span>
                        </div>
                        <p className="text-[10px] md:text-xs font-bold text-slate-400">{isRtl ? 'كبير معلمي الفيزياء' : 'Senior Physics Instructor'}</p>
                     </div>
                  </div>
               </div>

               <div className="flex flex-wrap justify-center gap-3 w-full md:w-auto">
                  <button
                     onClick={() => onNavigate('exams_create')}
                     className="flex-1 md:flex-none px-6 md:px-8 py-3 md:py-4 bg-orange-500 text-white rounded-xl md:rounded-2xl font-black text-xs md:text-sm flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-lg shadow-orange-500/20"
                  >
                     <BrainCircuit size={20} />
                     {t('ai_builder_btn')}
                  </button>
                  <button
                     onClick={() => onNavigate('live_broadcast')}
                     className="flex-1 md:flex-none px-6 md:px-8 py-3 md:py-4 bg-rose-600 text-white rounded-xl md:rounded-2xl font-black text-xs md:text-sm flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-lg shadow-rose-600/20"
                  >
                     <MonitorPlay size={20} />
                     {t('go_live')}
                  </button>
               </div>
            </div>
         </div>

         {/* 2. Key Stats Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label={t('stat_total_students')} val={studentCount} icon={<Users />} color="text-blue-600" bg="bg-blue-50" />
            <StatCard label={t('stat_active_exams')} val={12} icon={<ListChecks />} color="text-rose-600" bg="bg-rose-50" />
            <StatCard label={t('stat_broadcast_hours')} val="45h" icon={<Video />} color="text-purple-600" bg="bg-purple-50" />
            <StatCard label={t('stat_student_rating')} val="4.9" icon={<Star />} color="text-amber-500" bg="bg-amber-50" />
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
               {/* 3. AI Smart Analytic Hub */}
               <div className="glass-card p-1 border-none shadow-2xl overflow-hidden rounded-[3rem]">
                  <SmartAnalytic
                     role={UserRole.TEACHER}
                     dataContext="المعلم لديه 150 طالباً، نسبة النجاح في الاختبار الأخير 85%، هناك نقص في حضور الطلاب لمجموعة السبت."
                  />
               </div>

               {/* 4. Content Quick Links */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <QuickTool icon={<FileUp />} label={t('tool_upload_file')} onClick={() => onNavigate('files')} color="bg-blue-600" />
                  <QuickTool icon={<Award />} label={t('tool_top_students')} onClick={() => onNavigate('students')} color="bg-amber-500" />
                  <QuickTool icon={<Clock />} label={t('tool_schedule')} onClick={() => onNavigate('overview')} color="bg-emerald-600" />
                  <QuickTool icon={<PlusCircle />} label={t('tool_new_group')} onClick={() => onNavigate('students')} color="bg-slate-900" />
               </div>
            </div>

            {/* 5. Performance Monitoring Side Panel */}
            <div className="glass-card p-10 bg-white border border-slate-200">
               <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-8 flex items-center gap-3">
                  <TrendingUp size={18} className="text-blue-600" /> {t('performance_analysis')}
               </h3>
               <div className="space-y-8">
                  <ProgressBar label="الفيزياء الحديثة" val={92} color="bg-blue-600" />
                  <ProgressBar label="الميكانيكا" val={74} color="bg-rose-500" />
                  <ProgressBar label="الكهربائية" val={88} color="bg-emerald-500" />
               </div>
               <div className="mt-10 p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <div className="flex items-center gap-4 mb-3">
                     <Zap className="text-orange-500" size={20} />
                     <p className="text-xs font-black">{t('smart_insight')}</p>
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 leading-relaxed">
                     {isRtl ? 'تحسن مستوى مجموعة "العباقرة" بنسبة 15% بعد الاختبار الأخير.' : 'Elite group improved by 15% after the last quiz.'}
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
};

const StatCard = ({ label, val, icon, color, bg }: any) => (
   <div className="glass-card p-8 flex items-center justify-between group hover:border-blue-200 transition-all bg-white border-slate-100">
      <div>
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
         <h4 className="text-3xl font-black text-slate-900 tabular-nums">{val}</h4>
      </div>
      <div className={`p-4 ${bg} ${color} rounded-2xl group-hover:scale-110 transition-transform`}>
         {React.cloneElement(icon as React.ReactElement<any>, { size: 24 })}
      </div>
   </div>
);

const QuickTool = ({ icon, label, onClick, color }: any) => (
   <button onClick={onClick} className="glass-card p-6 flex flex-col items-center gap-4 bg-white border-slate-100 group hover:bg-slate-950 transition-all">
      <div className={`p-4 ${color} text-white rounded-2xl shadow-lg group-hover:scale-110 transition-transform`}>
         {React.cloneElement(icon as React.ReactElement<any>, { size: 24 })}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white">{label}</span>
   </button>
);

const ProgressBar = ({ label, val, color }: any) => (
   <div className="space-y-3">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
         <span>{label}</span>
         <span className="text-slate-900">{val}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
         <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${val}%` }}></div>
      </div>
   </div>
);

const ListChecks = ({ size, className }: any) => (
   <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"></path>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
   </svg>
);

export default TeacherView;
