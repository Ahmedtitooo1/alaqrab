
import * as React from 'react';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';
import {
    BarChart3, TrendingUp, TrendingDown, Users, DollarSign,
    Building2, School, Activity, Zap, Globe, PieChart, Layers
} from 'lucide-react';
import SmartAnalytic from './SmartAnalytic';

export const AdminCEODashboard: React.FC = () => {
    const { institutions, allUsers, financialEntries, t } = useAppContext();

    const totalRevenue = institutions.reduce((a, b) => a + b.pricing.paidAmount, 0);
    const totalStudents = allUsers.filter(u => u.role === UserRole.STUDENT).length;
    const activeBranches = institutions.filter(i => i.status === 'active').length;

    const StatCard = ({ label, val, sub, trend, icon, color }: any) => (
        <div className="glass-panel p-10 bg-white border border-slate-100 rounded-[3.5rem] shadow-sm relative overflow-hidden group hover:border-indigo-600 transition-all">
            <div className="flex justify-between items-start mb-8">
                <div className={`p-5 rounded-[1.75rem] shadow-xl text-white ${color}`}>{icon}</div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {Math.abs(trend)}%
                </div>
            </div>
            <div className="space-y-1">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                <div className="flex items-end gap-3">
                    <p className="text-4xl font-black text-slate-900 tabular-nums leading-none">{val}</p>
                    <p className="text-xs font-bold text-slate-400 pb-1">{sub}</p>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-50 group-hover:bg-indigo-600 transition-all"></div>
        </div>
    );

    return (
        <div className="space-y-12 animate-view pb-20">
            {/* Executive Hero */}
            <div className="premium-dark-card p-16 text-white overflow-hidden relative border-none shadow-3xl">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 blur-[200px] rounded-full -mr-40 -mt-40"></div>
                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
                    <div className="text-right">
                        <div className="flex items-center gap-5 mb-6">
                            <div className="p-4 bg-indigo-600 rounded-3xl shadow-2xl"><BarChart3 size={40} className="text-white" /></div>
                            <h2 className="text-6xl font-black italic uppercase italic tracking-tighter">{t('executive_insights')}</h2>
                        </div>
                        <p className="text-slate-400 font-bold text-2xl max-w-2xl leading-relaxed">تحليل مركزي شامل لأداء كافة الفروع، التدفقات المالية، ومعدلات نمو المنظومة التعليمية.</p>
                    </div>
                    <div className="flex gap-16 bg-white/5 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 shadow-3xl">
                        <div className="text-center">
                            <p className="text-[12px] font-black uppercase text-indigo-400 tracking-widest mb-3">{t('net_profit') || 'Net Profit'}</p>
                            <p className="text-5xl font-black tabular-nums">{totalRevenue.toLocaleString()} <span className="text-xl font-bold opacity-30">{t('egp')}</span></p>
                        </div>
                        <div className="w-px h-16 bg-white/10"></div>
                        <div className="text-center">
                            <p className="text-[12px] font-black uppercase text-emerald-400 tracking-widest mb-3">النمو السنوي</p>
                            <p className="text-5xl font-black tabular-nums">+24%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                <StatCard label="إجمالي الفروع" val={activeBranches} sub="فرع نشط" trend={+2} icon={<Building2 />} color="bg-indigo-600" />
                <StatCard label="تعداد الطلاب الكلي" val={totalStudents} sub="طالب مسجل" trend={+15} icon={<Users />} color="bg-slate-900" />
                <StatCard label="معدل التحصيل" val="92%" sub="مالي (SaaS)" trend={+5} icon={<DollarSign />} color="bg-emerald-600" />
                <StatCard label="السيولة الإجمالية" val="840K" sub="جنية مصري" trend={-3} icon={<PieChart />} color="bg-amber-600" />
            </div>

            {/* AI Executive Analysis */}
            <div className="glass-panel p-1 rounded-[4rem] shadow-2xl overflow-hidden border-none relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 px-10 py-8 bg-white/50 backdrop-blur-3xl border-b border-white/20 flex items-center gap-6">
                    <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg animate-pulse"><Zap size={24} /></div>
                    <div>
                        <h3 className="font-black text-2xl text-slate-900 tracking-tight">{t('ai_executive_analysis') || 'AI Executive Analysis'}</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">تنبؤات الذكاء الاصطناعي بناءً على البيانات المالية والأكاديمية للفروع</p>
                    </div>
                </div>
                <SmartAnalytic
                    role={UserRole.SUPER_ADMIN}
                    dataContext={`التقرير التنفيذي: إجمالي الطلاب ${totalStudents} في ${activeBranches} فروع. السيولة المالية الحالية جيدة جداً مع معدل نمو 24% سنوياً. الفرع الأكثر نمواً هو "فرع المعادي" بمعدل 40%. التوصيات: التوسع في ميزات الذكاء الاصطناعي لزيادة متوسط العائد لكل طالب.`}
                />
            </div>

            {/* Detailed Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="glass-panel bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-12">
                    <h3 className="text-2xl font-black flex items-center gap-5 text-slate-900 italic border-r-8 border-indigo-600 pr-6 uppercase tracking-tighter">{t('branch_performance_matrix')}</h3>
                    <div className="space-y-10">
                        {institutions.slice(0, 4).map(inst => (
                            <div key={inst.id} className="space-y-4 group">
                                <div className="flex justify-between items-center px-2">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm"><School size={20} /></div>
                                        <p className="font-black text-lg text-slate-800">{inst.name}</p>
                                    </div>
                                    <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-4 py-1 rounded-full">{inst.pricing.paidAmount.toLocaleString()} EGP</span>
                                </div>
                                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner translate-y-2 group-hover:translate-y-0 transition-transform">
                                    <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${(inst.pricing.paidAmount / totalRevenue) * 100 * 2}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-panel bg-slate-950 p-12 rounded-[4rem] text-white shadow-3xl relative overflow-hidden group">
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full"></div>
                    <h3 className="text-2xl font-black flex items-center gap-5 text-white italic border-r-8 border-indigo-400 pr-6 uppercase tracking-tighter mb-12">{t('strategic_indicators')}</h3>
                    <div className="grid grid-cols-2 gap-10">
                        {[
                            { label: 'كفاءة التشغيل', val: '94%', trend: +2, icon: <Activity className="text-emerald-400" /> },
                            { label: 'نسبة الاستثقاء', val: '88%', trend: -1, icon: <Users className="text-indigo-400" /> },
                            { label: 'تغطية السوق', val: '12%', trend: +4, icon: <Globe className="text-amber-400" /> },
                            { label: 'سرعة الاستجابة', val: '0.8s', trend: -12, icon: <Zap className="text-rose-400" /> },
                        ].map((ind, i) => (
                            <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-4 hover:bg-white/10 transition-all">
                                <div className="flex items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">{ind.icon} {ind.label}</div>
                                <div className="flex justify-between items-end">
                                    <p className="text-4xl font-black italic">{ind.val}</p>
                                    <span className={`text-[10px] font-black ${ind.trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{ind.trend > 0 ? '+' : ''}{ind.trend}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
