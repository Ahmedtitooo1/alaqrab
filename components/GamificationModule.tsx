
import * as React from 'react';
import { useAppContext } from '../context/AppContext';
import { User, UserRole } from '../types';
import {
    Trophy, Medal, Target, Flame, Star, Crown, Zap,
    TrendingUp, Users, ChevronRight, Award, Timer
} from 'lucide-react';

export const GamificationModule: React.FC = () => {
    const { allUsers, user, t } = useAppContext();

    const topStudents = [...allUsers]
        .filter(u => u.role === UserRole.STUDENT)
        .sort((a, b) => (b.balance || 0) - (a.balance || 0)) // Using balance as 'XP' for now
        .slice(0, 10);

    const userRank = [...allUsers]
        .filter(u => u.role === UserRole.STUDENT)
        .sort((a, b) => (b.balance || 0) - (a.balance || 0))
        .findIndex(u => u.id === user?.id) + 1;

    // Fixed mock milestones
    const milestones = [
        { id: 1, label: 'أول 100 نقطة', progress: (user?.balance || 0) > 100 ? 100 : (user?.balance || 0), target: 100, icon: <Zap size={16} /> },
        { id: 2, label: 'سلسلة حضور 7 أيام', progress: 4, target: 7, icon: <Flame size={16} /> },
        { id: 3, label: 'حل 5 اختبارات بتقدير ممتاز', progress: 3, target: 5, icon: <Star size={16} /> },
    ];

    return (
        <div className="space-y-12 animate-view pb-20">
            {/* XP & Rank Header */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 premium-dark-card p-12 text-white overflow-hidden relative border-none shadow-3xl">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-[100px] -mr-40 -mt-40 rounded-full"></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="text-right">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl"><Crown size={32} className="text-white" /></div>
                                <h2 className="text-4xl font-black italic uppercase italic tracking-tighter">{t('level_label')} {(user?.balance || 0) > 1000 ? 5 : Math.floor((user?.balance || 0) / 200) + 1}</h2>
                            </div>
                            <p className="text-slate-400 font-bold text-lg max-w-md">أنت تبلي بلاءً حسناً! رتبتك الحالية هي المركز <span className="text-indigo-400 font-black">#{userRank}</span> على مستوى الفرع.</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 text-center min-w-[200px] shadow-2xl">
                            <p className="text-[10px] font-black text-indigo-400 uppercase mb-3 tracking-widest">{t('total_xp') || 'Total XP'}</p>
                            <p className="text-5xl font-black tabular-nums">{user?.balance || 0}</p>
                            <div className="w-full h-2 bg-white/5 rounded-full mt-6 overflow-hidden">
                                <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${((user?.balance || 0) % 200) / 2}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm flex flex-col justify-center gap-6">
                    <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest flex items-center gap-3"><Target size={20} /> مهمة اليوم</h3>
                    <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
                        <p className="font-black text-slate-800 text-lg mb-2">حل اختبار "المتجهات" القصير</p>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">+50 XP</span>
                            <button className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-lg">ابدأ الآن</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Leaderboard */}
                <div className="lg:col-span-8 glass-panel bg-white border border-slate-100 rounded-[3.5rem] p-10 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-slate-100"></div>
                    <div className="flex justify-between items-center mb-10 border-b pb-8">
                        <h3 className="text-3xl font-black flex items-center gap-4 text-slate-900 border-r-4 border-indigo-600 pr-4">{t('leaderboard')}</h3>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black shadow-lg">هذا الشهر</button>
                            <button className="px-4 py-2 bg-slate-100 text-slate-500 rounded-xl text-xs font-black">العام الدراسي</button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {topStudents.map((s, idx) => (
                            <div key={s.id} className={`p-6 rounded-[2rem] flex items-center justify-between transition-all group ${s.id === user?.id ? 'bg-indigo-600 text-white shadow-2xl scale-[1.02]' : 'bg-slate-50 hover:bg-white hover:shadow-xl border border-transparent hover:border-indigo-100'}`}>
                                <div className="flex items-center gap-6">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${idx === 0 ? 'bg-amber-400 text-white' : (idx === 1 ? 'bg-slate-300 text-slate-700' : (idx === 2 ? 'bg-amber-700 text-white' : 'bg-white text-slate-400'))}`}>
                                        {idx + 1}
                                    </div>
                                    <div className="flex items-center gap-5">
                                        <div className="relative">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.username}`} className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm" alt="av" />
                                            {idx === 0 && <Crown size={16} className="absolute -top-2 -right-2 text-amber-500 drop-shadow-md" />}
                                        </div>
                                        <div>
                                            <p className="font-black text-lg leading-tight">{s.firstName} {s.lastName}</p>
                                            <p className={`text-[10px] font-bold uppercase tracking-widest ${s.id === user?.id ? 'text-indigo-200' : 'text-slate-400'}`}>{idx === 0 ? t('conqueror') : t('elite_student')}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8 px-6">
                                    <div className="text-right">
                                        <p className={`text-[10px] font-black uppercase mb-1 ${s.id === user?.id ? 'text-indigo-200' : 'text-slate-400'}`}>النقاط</p>
                                        <p className="text-2xl font-black tabular-nums">{s.balance || 0}</p>
                                    </div>
                                    <ChevronRight size={20} className={s.id === user?.id ? 'text-indigo-100' : 'text-slate-200'} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Badges & Achievements Area */}
                <div className="lg:col-span-4 space-y-10">
                    <div className="glass-panel bg-white border border-slate-100 rounded-[3.5rem] p-10 shadow-sm border-t-8 border-indigo-600">
                        <h3 className="text-xl font-black mb-10 flex items-center gap-4 text-slate-900"><Medal className="text-indigo-600" /> الأوسمة والشارات</h3>
                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { id: 1, label: 'الأكثر التزاماً', icon: <Timer />, color: 'bg-emerald-50 text-emerald-600', active: true },
                                { id: 2, label: 'بطل العباقرة', icon: <Trophy />, color: 'bg-amber-50 text-amber-600', active: true },
                                { id: 3, label: 'أسرع إجابة', icon: <Zap />, color: 'bg-indigo-50 text-indigo-600', active: false },
                                { id: 4, label: 'مرشد الأقران', icon: <Users />, color: 'bg-rose-50 text-rose-600', active: false },
                            ].map(badge => (
                                <div key={badge.id} className={`p-8 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 transition-all ${badge.active ? 'bg-white shadow-xl scale-100 grayscale-0 border border-slate-50' : 'bg-slate-50 opacity-40 grayscale pointer-events-none'}`}>
                                    <div className={`p-5 rounded-2xl shadow-inner ${badge.color}`}>{badge.icon}</div>
                                    <p className="text-[11px] font-black text-slate-900 text-center leading-tight">{badge.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel bg-slate-950 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-[60px] group-hover:bg-amber-500/20 transition-all duration-700"></div>
                        <h3 className="text-xl font-black mb-8 text-white flex items-center gap-4 italic"><TrendingUp className="text-indigo-400" /> الإنجازات القادمة</h3>
                        <div className="space-y-8">
                            {milestones.map(m => (
                                <div key={m.id} className="space-y-3">
                                    <div className="flex justify-between text-[11px] font-black uppercase text-slate-400">
                                        <span className="flex items-center gap-2">{m.icon} {m.label}</span>
                                        <span>{Math.round((m.progress / m.target) * 100)}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-l from-indigo-500 to-indigo-400 transition-all duration-1000" style={{ width: `${(m.progress / m.target) * 100}%` }}></div>
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
