
import React, { useState } from 'react';
import StudentIDCard from '../../components/StudentIDCard';
import SmartTutor from '../../components/SmartTutor';
import ResultsModule from '../../components/ResultsModule'; // Note: This will need to be the Gamified version we created
import FilesModule from '../../components/FilesModule';
import LiveLessonsModule from '../../components/LiveLessonsModule';
import {
    Trophy, Play, Book, Target, MessageSquare,
    Flame, Star, Zap, LayoutList, DownloadCloud,
    AlertCircle, TrendingUp, Award, Clock, ArrowRight, CheckCircle, BrainCircuit
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import SmartAnalytic from '../../components/SmartAnalytic';
import { UserRole } from '../../types';

interface StudentDashboardProps {
    onNavigate: (tab: string) => void;
    activeTab?: string;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate, activeTab = 'overview' }) => {
    const { lang, user, notifications } = useAppContext();
    const [showIDCard, setShowIDCard] = useState(false);
    const isRtl = lang === 'ar';

    const dailyMissions = [
        { id: 1, title: isRtl ? 'اختبار مراجعة الذرة' : 'Atomic Review Quiz', time: '10 mins', done: false, type: 'exam' },
        { id: 2, title: isRtl ? 'شرح الميكانيكا - فيديو' : 'Mechanics Video', time: '25 mins', done: true, type: 'video' }
    ];

    if (activeTab === 'ai_tutor') return <SmartTutor />;
    if (activeTab === 'exam_results') return <ResultsModule />;
    if (activeTab === 'files') return <FilesModule />;
    if (activeTab === 'live_room') return <LiveLessonsModule isStudentView />;

    return (
        <div className="space-y-10 animate-view pb-16">
            {/* Hero */}
            <div className="relative p-10 rounded-[3rem] overflow-hidden bg-white border border-slate-200 shadow-xl">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -mr-60 -mt-60"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-8">
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                            className="w-32 h-32 rounded-[2.5rem] bg-blue-50 p-1 border-4 border-white shadow-2xl"
                            alt="Profile"
                        />
                        <div>
                            <h1 className="text-4xl font-black tracking-tight mb-2 text-black">
                                {isRtl ? `أهلاً يا بطل، ${user?.firstName}` : `Welcome Hero, ${user?.firstName}`}
                            </h1>
                            <div className="flex flex-wrap gap-4 items-center">
                                <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                                    <Flame size={14} className="text-orange-500" />
                                    <span className="text-xs font-black uppercase tracking-widest tabular-nums">12 Day Streak</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => setShowIDCard(true)} className="px-6 py-5 bg-slate-950 text-white rounded-[1.75rem] font-black flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl">
                            <DownloadCloud size={24} /> {isRtl ? 'بطاقتي' : 'My ID'}
                        </button>
                        <button onClick={() => onNavigate('ai_tutor')} className="px-8 py-5 bg-blue-600 text-white rounded-[1.75rem] font-black flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-600/20">
                            <BrainCircuit size={24} /> {isRtl ? 'اسأل المعلم الذكي' : 'Ask AI Tutor'}
                        </button>
                    </div>
                </div>
            </div>

            {showIDCard && <StudentIDCard onClose={() => setShowIDCard(false)} />}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    {/* Learning Path */}
                    <section>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black flex items-center gap-3 text-black"><TrendingUp className="text-blue-600" /> {isRtl ? 'مسارك التعليمي' : 'Learning Path'}</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <PathCard title={isRtl ? 'الفيزياء الحديثة' : 'Modern Physics'} progress={75} lessons={12} icon={<Zap className="text-amber-500" />} onClick={() => onNavigate('exam_results')} />
                            <PathCard title={isRtl ? 'الميكانيكا الكلاسيكية' : 'Classical Mechanics'} progress={40} lessons={8} icon={<LayoutList className="text-blue-500" />} onClick={() => onNavigate('exam_results')} />
                        </div>
                    </section>

                    {/* Smart Analytic */}
                    <section className="glass-card p-1 border-none shadow-3xl overflow-hidden">
                        <SmartAnalytic role={UserRole.STUDENT} dataContext={`الطالب ${user?.firstName} أحرز 95% في اختبار الكهربية.`} />
                    </section>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <QuickAction icon={<Target />} label={isRtl ? 'قاعة الاختبارات' : 'Exam Hall'} onClick={() => onNavigate('take_exam')} color="bg-orange-500" />
                        <QuickAction icon={<DownloadCloud />} label={isRtl ? 'نتائجي' : 'Results'} onClick={() => onNavigate('exam_results')} color="bg-blue-600" />
                        <QuickAction icon={<MessageSquare />} label={isRtl ? 'المعلم الذكي' : 'AI Tutor'} onClick={() => onNavigate('ai_tutor')} color="bg-emerald-600" />
                    </div>
                </div>

                <div className="space-y-10">
                    {/* Missions */}
                    <div className="glass-card p-10 bg-white border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-8 border-b pb-4">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Clock size={18} /></div>
                            <h4 className="font-black text-sm uppercase tracking-widest text-black">{isRtl ? 'مهمة اليوم' : 'Daily Missions'}</h4>
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
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PathCard = ({ title, progress, lessons, icon, onClick }: any) => (
    <button onClick={onClick} className="glass-card p-8 bg-white group hover:border-blue-500 transition-all text-right flex flex-col gap-6 shadow-sm border border-slate-100">
        <div className="flex justify-between items-start">
            <div className="p-4 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lessons</p>
                <p className="font-black text-lg text-black">{lessons}</p>
            </div>
        </div>
        <div>
            <h4 className="font-black text-xl mb-3 text-black">{title}</h4>
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase">Progress</span>
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

export default StudentDashboard;
