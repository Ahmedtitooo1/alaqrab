
import React from 'react';
import {
   Users, BookOpen, BrainCircuit, Video,
   TrendingUp, Activity, PlusCircle, FileUp,
   ArrowUpRight, Clock, Award, Star, Zap,
   MonitorPlay, UserPlus, ListChecks, CalendarDays, MapPin
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import SmartAnalytic from '../SmartAnalytic';
import { UserRole } from '../../types';

interface ViewProps {
   onNavigate: (tab: string) => void;
}

const TeacherView: React.FC<ViewProps> = ({ onNavigate }) => {
   const { lang, user, allUsers, currentTenant } = useAppContext();
   const isRtl = lang === 'ar';
   const isTutorMode = currentTenant?.type === 'individual';

   const studentCount = allUsers.filter(u => u.role === UserRole.STUDENT).length;

   // Mock Teacher Schedule
   const todayClasses = [
      { id: 1, period: 1, subject: 'الفيزياء (ميكانيكا)', room: 'Lab 1', grade: 'Grade 10' },
      { id: 2, period: 3, subject: 'الفيزياء (كهربائية)', room: 'Room 102', grade: 'Grade 11' },
      { id: 3, period: 5, subject: 'مراجعة عامة', room: 'Hall A', grade: 'Grade 12' },
   ];

   return (
      <div className="space-y-10 animate-view pb-16">
         {/* 1. Teacher Hero Header */}
         <div className="relative p-10 rounded-[3rem] overflow-hidden bg-white border border-slate-200 shadow-xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 blur-[80px] rounded-full -mr-40 -mt-40"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
               <div className="flex items-center gap-8">
                  <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 border border-blue-100 shadow-inner">
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher`} className="w-full h-full p-2" alt="Teacher" />
                  </div>
                  <div>
                     <h1 className="text-3xl font-black text-slate-900 mb-2">
                        {isRtl ? `مرحباً بك، م/ ${user?.firstName}` : `Welcome, Eng. ${user?.firstName}`}
                     </h1>
                     <div className="flex gap-4 items-center">
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                           <Activity size={12} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Active Now</span>
                        </div>
                        <p className="text-xs font-bold text-slate-400">{isRtl ? 'كبير معلمي الفيزياء' : 'Senior Physics Instructor'}</p>
                     </div>
                  </div>
               </div>

               <div className="flex flex-wrap justify-center gap-4">
                  <button
                     onClick={() => onNavigate('add_student')}
                     className="px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm flex items-center gap-3 hover:scale-105 transition-all shadow-lg shadow-indigo-600/20"
                  >
                     <UserPlus size={20} />
                     {isRtl ? 'إضافة طالب جديد' : 'Add New Student'}
                  </button>
                  <button
                     onClick={() => onNavigate('exams_manage')}
                     className="px-6 py-4 bg-orange-500 text-white rounded-2xl font-black text-sm flex items-center gap-3 hover:scale-105 transition-all shadow-lg shadow-orange-500/20"
                  >
                     <BrainCircuit size={20} />
                     {isRtl ? 'إنشاء اختبار ذكي' : 'AI Exam Builder'}
                  </button>
                  <button
                     onClick={() => onNavigate('live_broadcast')}
                     className="px-6 py-4 bg-rose-600 text-white rounded-2xl font-black text-sm flex items-center gap-3 hover:scale-105 transition-all shadow-lg shadow-rose-600/20"
                  >
                     <MonitorPlay size={20} />
                     {isRtl ? 'بث مباشر الآن' : 'Start Live Stream'}
                  </button>
               </div>
            </div>
         </div>

         {/* 2. Key Stats Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="إجمالي الطلاب" val={studentCount} icon={<Users />} color="text-blue-600" bg="bg-blue-50" />
            <StatCard label="الاختبارات النشطة" val={12} icon={<ListChecks />} color="text-rose-600" bg="bg-rose-50" />
            <StatCard label="ساعات البث" val="45h" icon={<Video />} color="text-purple-600" bg="bg-purple-50" />
            <StatCard label="تقييم الطلاب" val="4.9" icon={<Star />} color="text-amber-500" bg="bg-amber-50" />
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">

               {/* 2.5 Schedule Widget (For Schools/Centers) */}
               {!isTutorMode && (
                  <div className="glass-card bg-indigo-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                     <div className="relative z-10">
                        <div className="flex justify-between items-center mb-6">
                           <h3 className="text-xl font-black flex items-center gap-3"><CalendarDays className="text-indigo-300" /> {isRtl ? 'جدولي اليوم' : 'Today\'s Schedule'}</h3>
                           <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest">{new Date().toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', { weekday: 'long' })}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                           {todayClasses.map(cls => (
                              <div key={cls.id} className="p-4 bg-white/10 rounded-2xl border border-white/5 hover:bg-white/20 transition-all cursor-pointer">
                                 <div className="flex justify-between items-start mb-2">
                                    <span className="px-2 py-1 bg-indigo-500/50 rounded-lg text-[10px] font-black uppercase tracking-widest">P-{cls.period}</span>
                                    <span className="text-[10px] font-bold opacity-70">{cls.grade}</span>
                                 </div>
                                 <p className="font-black text-lg mb-1">{cls.subject}</p>
                                 <p className="text-xs font-bold text-indigo-200 flex items-center gap-1"><MapPin size={10} /> {cls.room}</p>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               )}

               {/* 3. AI Smart Analytic Hub */}
               <div className="glass-card p-1 border-none shadow-2xl overflow-hidden rounded-[3rem]">
                  <SmartAnalytic
                     role={UserRole.TEACHER}
                     dataContext="المعلم لديه 150 طالباً، نسبة النجاح في الاختبار الأخير 85%، هناك نقص في حضور الطلاب لمجموعة السبت."
                  />
               </div>

               {/* 4. Content Quick Links */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <QuickTool icon={<FileUp />} label="دفتر التحضير" onClick={() => onNavigate('lesson_planner')} color="bg-blue-600" />
                  <QuickTool icon={<Award />} label="أوائل الطلاب" onClick={() => onNavigate('manage_students')} color="bg-amber-500" />
                  <QuickTool icon={<Clock />} label="الجدول" onClick={() => onNavigate('teacher_schedule')} color="bg-emerald-600" />
                  <QuickTool icon={<PlusCircle />} label="إضافة طالب" onClick={() => onNavigate('add_student')} color="bg-slate-900" />
               </div>
            </div>

            {/* 5. Performance Monitoring Side Panel */}
            <div className="glass-card p-10 bg-white border border-slate-200">
               <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-8 flex items-center gap-3">
                  <TrendingUp size={18} className="text-blue-600" /> {isRtl ? 'تحليل الأداء' : 'Performance Analysis'}
               </h3>
               <div className="space-y-8">
                  <ProgressBar label="الفيزياء الحديثة" val={92} color="bg-blue-600" />
                  <ProgressBar label="الميكانيكا" val={74} color="bg-rose-500" />
                  <ProgressBar label="الكهربائية" val={88} color="bg-emerald-500" />
               </div>
               <div className="mt-10 p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <div className="flex items-center gap-4 mb-3">
                     <Zap className="text-orange-500" size={20} />
                     <p className="text-xs font-black">{isRtl ? 'تنبيه ذكي' : 'Smart Insight'}</p>
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

export default TeacherView;
