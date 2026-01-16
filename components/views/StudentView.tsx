
import React, { useState } from 'react';
import {
  Trophy, Play, Book, Target, MessageSquare,
  Flame, Star, Zap, LayoutList, DownloadCloud,
  AlertCircle, ChevronLeft, Calendar, BrainCircuit,
  TrendingUp, Award, Clock, ArrowRight, Activity
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import SmartAnalytic from '../SmartAnalytic';
import { UserRole } from '../../types';

interface ViewProps {
  onNavigate: (tab: string) => void;
}

const StudentView: React.FC<ViewProps> = ({ onNavigate }) => {
  const { lang, t, user, notifications, theme } = useAppContext();
  const isRtl = lang === 'ar';

  // تجربة مستخدم: مهام اليوم
  const dailyMissions = [
    { id: 1, title: isRtl ? 'اختبار مراجعة الذرة' : 'Atomic Review Quiz', time: '10 mins', done: false, type: 'exam' },
    { id: 2, title: isRtl ? 'شرح الميكانيكا - فيديو' : 'Mechanics Video', time: '25 mins', done: true, type: 'video' }
  ];

  return (
    <div className="space-y-10 animate-view pb-16">
      {/* 1. Scorpion Hero Header - Command Center Style */}
      <div className="relative p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-white border border-slate-200 shadow-xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -mr-60 -mt-60"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 blur-[80px] rounded-full -ml-40 -mb-40"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-right w-full md:w-auto">
            <div className="relative">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] md:rounded-[2.5rem] bg-blue-50 p-1 border-[3px] md:border-4 border-white shadow-2xl"
                alt="Profile"
              />
              <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-amber-500 text-white p-1.5 md:p-2 rounded-lg md:rounded-xl shadow-xl animate-bounce">
                <Trophy size={16} md:size={18} />
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight mb-3 text-black">
                {t('student_hero_welcome')} {user?.firstName}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-4 items-center">
                <div className="flex items-center gap-2 px-3 md:px-4 py-1 md:py-1.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                  <Flame size={12} md:size={14} className="text-orange-500" />
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-widest tabular-nums">12 {t('streak_label')}</span>
                </div>
                <div className="flex items-center gap-2 px-3 md:px-4 py-1 md:py-1.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
                  <Award size={12} md:size={14} />
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">{t('rank_label')} {t('bronze_scorpion')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full md:w-auto justify-center">
            <button
              onClick={() => onNavigate('tutor')}
              className="w-full md:w-auto px-8 py-4 md:py-5 bg-blue-600 text-white rounded-xl md:rounded-[1.75rem] font-black flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-600/20"
            >
              <BrainCircuit size={24} />
              {t('ask_ai_tutor')}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* 2. Intelligent Learning Path */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black flex items-center gap-3 text-black"><TrendingUp className="text-blue-600" /> {t('learning_path')}</h3>
              <button className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">{t('view_schedule')}</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <PathCard
                title={isRtl ? 'الفيزياء الحديثة' : 'Modern Physics'}
                progress={75}
                lessons={12}
                icon={<Zap className="text-amber-500" />}
                onClick={() => onNavigate('student_exams')}
                t={t}
              />
              <PathCard
                title={isRtl ? 'الميكانيكا الكلاسيكية' : 'Classical Mechanics'}
                progress={40}
                lessons={8}
                icon={<LayoutList className="text-blue-500" />}
                onClick={() => onNavigate('student_exams')}
                t={t}
              />
            </div>
          </section>

          {/* 3. AI Smart Insights */}
          <section className="glass-card p-1 border-none shadow-3xl overflow-hidden">
            <SmartAnalytic
              role={UserRole.STUDENT}
              dataContext={`الطالب ${user?.firstName} أحرز 95% في اختبار الكهربية، ولكنه يحتاج لتحسين سرعة الحل في المسائل الرياضية.`}
            />
          </section>

          {/* 4. Action Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <QuickAction icon={<Activity />} label={isRtl ? 'رحلتي التعليمية' : 'My Journey'} onClick={() => onNavigate('student_journey')} color="bg-slate-900" />
            <QuickAction icon={<Target />} label={t('exam_hall')} onClick={() => onNavigate('student_exams')} color="bg-orange-500" />
            <QuickAction icon={<DownloadCloud />} label={t('digital_library')} onClick={() => onNavigate('files')} color="bg-blue-600" />
            <QuickAction icon={<MessageSquare />} label={t('discussion_room')} onClick={() => onNavigate('messages')} color="bg-emerald-600" />
            <QuickAction icon={<Calendar />} label={t('tool_schedule')} onClick={() => onNavigate('overview')} color="bg-purple-600" />
          </div>
        </div>

        <div className="space-y-10">
          {/* 5. Daily Missions Card */}
          <div className="glass-card p-10 bg-white border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8 border-b pb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Clock size={18} /></div>
              <h4 className="font-black text-sm uppercase tracking-widest text-black">{t('daily_mission')}</h4>
            </div>
            <div className="space-y-4">
              {dailyMissions.map(m => (
                <div key={m.id} className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${m.done ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-transparent'}`}>
                  <div className="flex items-center gap-4">
                    {m.done ? <CheckCircle className="text-emerald-500" size={20} /> : <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>}
                    <div>
                      <p className={`font-black text-xs text-black ${m.done ? 'line-through opacity-40' : ''}`}>{m.title}</p>
                      <span className="text-[10px] text-slate-400 font-bold">{m.time}</span>
                    </div>
                  </div>
                  {!m.done && <ArrowRight size={16} className="text-blue-600" />}
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-4 bg-black text-white rounded-2xl font-black text-xs hover:bg-blue-600 transition-all">{t('update_missions')}</button>
          </div>

          {/* 6. Recent Notifications */}
          <div className="glass-card p-10 bg-blue-50 border-blue-100 shadow-sm">
            <h4 className="font-black text-xs uppercase tracking-widest text-blue-600 mb-6 flex items-center gap-2">
              <AlertCircle size={16} /> {t('scorpion_notices')}
            </h4>
            <div className="space-y-6">
              {notifications.slice(0, 2).map(n => (
                <div key={n.id} className="relative pr-4 border-r-2 border-blue-500/30">
                  <p className="font-black text-xs mb-1 text-black">{n.title}</p>
                  <p className="text-[10px] font-bold text-slate-500 line-clamp-2">{n.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PathCard = ({ title, progress, lessons, icon, onClick, t }: any) => (
  <button onClick={onClick} className="glass-card p-8 bg-white group hover:border-blue-500 transition-all text-right flex flex-col gap-6 shadow-sm border border-slate-100">
    <div className="flex justify-between items-start">
      <div className="p-4 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('lessons_label')}</p>
        <p className="font-black text-lg text-black">{lessons}</p>
      </div>
    </div>
    <div>
      <h4 className="font-black text-xl mb-3 text-black">{title}</h4>
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-black text-slate-400 uppercase">{t('progress_label')}</span>
        <span className="text-xs font-black text-blue-600">{progress}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  </button>
);

const QuickAction = ({ icon, label, onClick, color }: any) => (
  <button onClick={onClick} className="glass-card p-6 flex flex-col items-center gap-4 bg-white border border-slate-100 hover:bg-blue-600 group transition-all shadow-sm">
    <div className={`p-4 ${color} text-white rounded-[1.5rem] shadow-lg group-hover:scale-110 transition-transform`}>
      {React.cloneElement(icon as React.ReactElement<any>, { size: 24 })}
    </div>
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white">{label}</span>
  </button>
);

const CheckCircle = ({ className, size }: any) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

export default StudentView;
