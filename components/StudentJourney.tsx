
import React from 'react';
import {
    TrendingUp, Award, Target, Zap,
    BrainCircuit, ChevronRight, Activity,
    Star, Flame, Lightbulb, CheckCircle2
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const StudentJourney: React.FC = () => {
    const { lang, t, isRtl } = useAppContext();

    // Mock data for student progress
    const performanceData = [
        { month: isRtl ? 'أكتوبر' : 'Oct', score: 65 },
        { month: isRtl ? 'نوفمبر' : 'Nov', score: 72 },
        { month: isRtl ? 'ديسمبر' : 'Dec', score: 85 },
        { month: isRtl ? 'يناير' : 'Jan', score: 92 },
    ];

    const subjects = [
        { name: isRtl ? 'الفيزياء' : 'Physics', score: 92, trend: '+5%', color: 'from-blue-600 to-indigo-600' },
        { name: isRtl ? 'الرياضيات' : 'Math', score: 88, trend: '+12%', color: 'from-emerald-600 to-teal-600' },
        { name: isRtl ? 'الكيمياء' : 'Chemistry', score: 74, trend: '-2%', color: 'from-orange-600 to-rose-600' },
    ];

    const maxScore = 100;
    const chartHeight = 200;
    const chartWidth = 600;

    return (
        <div className="space-y-10 animate-view pb-20">
            {/* 1. Journey Header & Level */}
            <div className="relative p-10 rounded-[3rem] bg-slate-950 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -mr-60 -mt-60"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="space-y-6 text-center md:text-right">
                        <div className="flex items-center justify-center md:justify-start gap-4">
                            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-2xl"><Activity size={24} /></div>
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">{isRtl ? 'رحلتك التعليمية' : 'YOUR LEARNING JOURNEY'}</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight">{isRtl ? 'أنت الآن في المستوى' : 'You are at Level'} <span className="text-blue-500">12</span></h1>
                        <p className="text-slate-400 text-lg md:text-xl font-bold max-w-xl">
                            {isRtl ? 'لقد قمت بإكمال 85% من المنهج الدراسي بنجاح مبهر. استمر في التقدم!' : 'You have completed 85% of the curriculum with impressive success. Keep going!'}
                        </p>
                    </div>

                    <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="50%" cy="50%" r="45%" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                            <circle cx="50%" cy="50%" r="45%" fill="none" stroke="url(#levelGradient)" strokeWidth="12" strokeDasharray="283" strokeDashoffset="42" className="animate-progress-draw" />
                            <defs>
                                <linearGradient id="levelGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#8b5cf6" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-5xl md:text-7xl font-black">85%</span>
                            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-blue-400 mt-2">{isRtl ? 'اكتمال' : 'COMPLETE'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    {/* 2. Monthly Progress Chart (Custom SVG) */}
                    <div className="glass-card p-10 bg-white shadow-xl rounded-[3rem] border border-slate-100 overflow-hidden">
                        <div className="flex justify-between items-center mb-12">
                            <h3 className="text-2xl font-black flex items-center gap-4 text-slate-900 border-r-4 border-blue-600 pr-6">
                                {isRtl ? 'تحليل الأداء الشهري' : 'Monthly Performance Analysis'}
                            </h3>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-600 rounded-full"></div> <span className="text-xs font-black text-slate-400">{isRtl ? 'نقاطك' : 'Your Score'}</span></div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-100 rounded-full"></div> <span className="text-xs font-black text-slate-400">{isRtl ? 'متوسط الدفعة' : 'Batch Avg'}</span></div>
                            </div>
                        </div>

                        <div className="relative h-[250px] w-full lg:w-[110%] -mr-10">
                            <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="chartBg" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="rgba(59, 130, 246, 0.2)" />
                                        <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                                    </linearGradient>
                                </defs>

                                {/* Grid Lines */}
                                {[0, 25, 50, 75, 100].map((level, i) => (
                                    <line
                                        key={i}
                                        x1="0" y1={chartHeight - (level * chartHeight / 100)}
                                        x2={chartWidth} y2={chartHeight - (level * chartHeight / 100)}
                                        stroke="#f1f5f9"
                                        strokeWidth="1"
                                    />
                                ))}

                                {/* Area under the curve */}
                                <path
                                    d={`
                    M 0 ${chartHeight}
                    L 0 ${chartHeight - (performanceData[0].score * chartHeight / 100)}
                    ${performanceData.map((d, i) => `L ${i * (chartWidth / (performanceData.length - 1))} ${chartHeight - (d.score * chartHeight / 100)}`).join(' ')}
                    L ${chartWidth} ${chartHeight}
                    Z
                  `}
                                    fill="url(#chartBg)"
                                />

                                {/* Main Line */}
                                <path
                                    d={`M 0 ${chartHeight - (performanceData[0].score * chartHeight / 100)} 
                     ${performanceData.map((d, i) => `L ${i * (chartWidth / (performanceData.length - 1))} ${chartHeight - (d.score * chartHeight / 100)}`).join(' ')}`}
                                    fill="none"
                                    stroke="#2563eb"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="animate-chart-line"
                                />

                                {/* Points */}
                                {performanceData.map((d, i) => (
                                    <circle
                                        key={i}
                                        cx={i * (chartWidth / (performanceData.length - 1))}
                                        cy={chartHeight - (d.score * chartHeight / 100)}
                                        r="6"
                                        fill="white"
                                        stroke="#2563eb"
                                        strokeWidth="3"
                                    />
                                ))}
                            </svg>

                            {/* X Axis Labels */}
                            <div className="flex justify-between mt-6 px-1">
                                {performanceData.map((d, i) => (
                                    <span key={i} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{d.month}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 3. Strength & Weakness Analysis (AI Driven) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="glass-card p-10 bg-emerald-50/50 border border-emerald-100 rounded-[3rem] shadow-sm">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl"><Zap size={20} /></div>
                                <h4 className="text-xl font-black text-emerald-900">{isRtl ? 'نقاط القوة' : 'Strengths'}</h4>
                            </div>
                            <div className="space-y-4">
                                {[
                                    isRtl ? 'سرعة حل مسائل الحركة' : 'Kinematics problem solving speed',
                                    isRtl ? 'فهم مبادئ الكهربية الحديثة' : 'Modern Electricity principles comprehension',
                                    isRtl ? 'دقة النتائج الجافة' : 'Dry calculation accuracy'
                                ].map((s, i) => (
                                    <div key={i} className="flex items-start gap-3 text-emerald-700 font-bold text-sm">
                                        <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                                        <span>{s}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card p-10 bg-rose-50/50 border border-rose-100 rounded-[3rem] shadow-sm">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl"><Target size={20} /></div>
                                <h4 className="text-xl font-black text-rose-900">{isRtl ? 'تحديات تحتاج تركيز' : 'Weaknesses'}</h4>
                            </div>
                            <div className="space-y-4">
                                {[
                                    isRtl ? 'تحويل الوحدات المركبة' : 'Compound unit conversion',
                                    isRtl ? 'إدارة الوقت في الأسئلة المقالية' : 'Essay question time management',
                                    isRtl ? 'الإحصاء والاحتمالات' : 'Statistics & Probability'
                                ].map((s, i) => (
                                    <div key={i} className="flex items-start gap-3 text-rose-700 font-bold text-sm">
                                        <div className="w-4 h-4 rounded-full border-2 border-rose-300 mt-1 shrink-0"></div>
                                        <span>{s}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-10">
                    {/* 4. AI Recommendations Engine */}
                    <div className="glass-card p-10 bg-slate-900 text-white rounded-[3rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        <div className="flex items-center gap-4 mb-10">
                            <BrainCircuit className="text-blue-400" size={32} />
                            <h4 className="text-xl font-black tracking-tight">{isRtl ? 'توصيات العقرب الذكي' : 'AI Recommendations'}</h4>
                        </div>

                        <div className="space-y-8">
                            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all cursor-pointer group">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-amber-500/20 text-amber-500 rounded-2xl group-hover:scale-110 transition-transform"><Lightbulb size={20} /></div>
                                    <div>
                                        <p className="font-black text-sm mb-1">{isRtl ? 'مراجعة الميكانيكا' : 'Revew Mechanics'}</p>
                                        <p className="text-[10px] text-slate-400 font-bold">{isRtl ? 'نقاطك تراجعت قليلاً، تحتاج لمراجعة سريعة.' : 'Your scores dropped slightly, needs quick review.'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all cursor-pointer group">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-purple-500/20 text-purple-500 rounded-2xl group-hover:scale-110 transition-transform"><Target size={20} /></div>
                                    <div>
                                        <p className="font-black text-sm mb-1">{isRtl ? 'اختبار تحدي (الكهربية)' : 'Challenge Quiz (Electricity)'}</p>
                                        <p className="text-[10px] text-slate-400 font-bold">{isRtl ? 'مستواك ممتاز! جرب اختبار مستوى الصعوبة العالي.' : 'Excellent level! Try a high-difficulty challenge.'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button className="w-full mt-12 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3">
                            {isRtl ? 'تطبيق جميع التوصيات' : 'Apply All Insights'} <ChevronRight size={18} />
                        </button>
                    </div>

                    {/* 5. Subject Progress Breakdown */}
                    <div className="glass-card p-10 bg-white border border-slate-100 shadow-sm rounded-[3rem]">
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">{isRtl ? 'تحليل المواد' : 'Subject Breakdown'}</h4>
                        <div className="space-y-10">
                            {subjects.map((s, i) => (
                                <div key={i} className="space-y-4">
                                    <div className="flex justify-between items-center px-1">
                                        <span className="font-black text-slate-900">{s.name}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">{s.trend}</span>
                                            <span className="font-black text-lg tabular-nums">{s.score}%</span>
                                        </div>
                                    </div>
                                    <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full bg-gradient-to-r ${s.color} transition-all duration-1000 shadow-sm`}
                                            style={{ width: `${s.score}%` }}
                                        ></div>
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

export default StudentJourney;
