
import * as React from 'react';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { LearningPath, UserRole } from '../types';
import {
    Route, Play, CheckCircle2, Lock, Sparkles,
    ArrowRight, FileText, Video, HelpCircle,
    TrendingUp, Award, BrainCircuit
} from 'lucide-react';

export const LearningPathModule: React.FC = () => {
    const { learningPaths, user, t } = useAppContext();
    const [selectedPath, setSelectedPath] = useState<LearningPath | null>(learningPaths[0] || null);

    // Mock active path if none exists
    const mockPath: LearningPath = {
        id: 'lp-1',
        title: 'أساسيات الفيزياء المتقدمة',
        studentId: user?.id || 'u1',
        progress: 35,
        steps: [
            { id: 's1', title: 'مقدمة في الميكانيكا الكلاسيكية', type: 'video', targetId: 'v1', isCompleted: true },
            { id: 's2', title: 'اختبار تجريبي: قوانين نيوتن', type: 'quiz', targetId: 'q1', isCompleted: true },
            { id: 's3', title: 'شرح القوة والحركة (PDF)', type: 'file', targetId: 'f1', isCompleted: false },
            { id: 's4', title: 'المقذوفات في بعدين', type: 'video', targetId: 'v2', isCompleted: false, unlockCondition: { previousStepId: 's3' } },
            { id: 's5', title: 'اختبار نهائي المستوى الأول', type: 'quiz', targetId: 'q2', isCompleted: false, unlockCondition: { minScore: 80, previousStepId: 's4' } },
        ]
    };

    const activePath = selectedPath || mockPath;

    return (
        <div className="space-y-12 animate-view pb-20">
            {/* Hero Section */}
            <div className="premium-dark-card p-14 text-white overflow-hidden relative border-none shadow-3xl">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] -mr-60 -mt-60 rounded-full"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="text-right">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl"><BrainCircuit size={32} className="text-white" /></div>
                            <h2 className="text-5xl font-black italic uppercase tracking-tighter">{t('ai_learning_path')}</h2>
                        </div>
                        <p className="text-slate-400 font-bold text-xl max-w-xl">مسارك التعليمي مصمم خصيصاً ليناسب مستوى أدائك وسرعة تعلمك. ذكاء اصطناعي يوجهك خطوة بخطوة.</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 text-center shadow-3xl">
                        <p className="text-[11px] font-black text-indigo-400 uppercase mb-4 tracking-widest">إجمالي التقدم</p>
                        <div className="relative inline-flex items-center justify-center">
                            <svg className="w-40 h-40">
                                <circle className="text-white/5" strokeWidth="12" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80" />
                                <circle className="text-indigo-500 transition-all duration-1000" strokeWidth="12" strokeDasharray={440} strokeDashoffset={440 - (440 * activePath.progress) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80" />
                            </svg>
                            <span className="absolute text-4xl font-black">{activePath.progress}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                {/* Steps List */}
                <div className="lg:col-span-3 space-y-6">
                    <h3 className="text-2xl font-black text-slate-900 border-r-4 border-indigo-600 pr-4 italic">الخطة الدراسية الحالية: {activePath.title}</h3>

                    <div className="space-y-6 relative">
                        {/* Connecting Line */}
                        <div className="absolute right-[43px] top-10 bottom-10 w-1 bg-slate-100 -z-10"></div>

                        {activePath.steps.map((step, idx) => {
                            const isLocked = step.unlockCondition && !activePath.steps.find(s => s.id === step.unlockCondition?.previousStepId)?.isCompleted;

                            return (
                                <div key={step.id} className={`flex items-start gap-8 transition-all group ${isLocked ? 'opacity-50' : 'opacity-100 hover:translate-x-2'}`}>
                                    <div className={`w-[90px] h-[90px] rounded-[2rem] flex items-center justify-center shadow-2xl relative transition-transform duration-500 group-hover:rotate-12 ${step.isCompleted ? 'bg-emerald-500 text-white' : (isLocked ? 'bg-slate-200 text-slate-400' : 'bg-white text-indigo-600 border-4 border-slate-50')}`}>
                                        {step.isCompleted ? <CheckCircle2 size={36} strokeWidth={3} /> : (isLocked ? <Lock size={32} /> : idx + 1)}
                                        {step.isCompleted && <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-30 -z-10"></div>}
                                    </div>

                                    <div className={`flex-1 p-8 rounded-[2.5rem] border transition-all flex flex-col md:flex-row items-center justify-between gap-6 ${step.isCompleted ? 'bg-emerald-50/50 border-emerald-100' : (isLocked ? 'bg-slate-50 border-slate-100 shadow-inner' : 'bg-white border-slate-100 shadow-sm hover:shadow-xl')}`}>
                                        <div className="text-right space-y-2">
                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${step.isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-50 text-indigo-600'}`}>{step.type}</span>
                                                <h4 className="text-xl font-black text-slate-900">{step.title}</h4>
                                            </div>
                                            {isLocked && step.unlockCondition?.minScore && (
                                                <p className="text-[10px] font-bold text-rose-500 flex items-center gap-2 italic uppercase">
                                                    <Lock size={12} /> يتطلب درجة {step.unlockCondition.minScore}% في المهمة السابقة
                                                </p>
                                            )}
                                        </div>

                                        {!isLocked && !step.isCompleted && (
                                            <button className="px-8 py-4 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-indigo-600 transition-all flex items-center gap-4 group/btn">
                                                دخول الآن <Play size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                        )}
                                        {step.isCompleted && <div className="text-emerald-600 font-black text-xs italic">مكتمل ✅</div>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="glass-panel p-8 bg-white border border-slate-100 rounded-[3rem] shadow-sm space-y-8">
                        <h4 className="text-sm font-black text-indigo-600 uppercase tracking-widest border-b pb-4">تحليل الأداء (AI)</h4>
                        <div className="space-y-6">
                            <div className="text-center p-6 bg-slate-50 rounded-2xl">
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-2">تقدير الذكاء</p>
                                <p className="text-2xl font-black text-slate-900 italic">{t('advanced') || 'Advanced'}</p>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase px-2">سرعة الإنجاز</label>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: '75%' }}></div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase px-2">دقة الإجابات</label>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500" style={{ width: '88%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-10 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-1000"></div>
                        <TrendingUp size={48} className="text-white/20 mb-6" />
                        <h4 className="text-xl font-black italic mb-4 tracking-tighter uppercase">Next Level Reward</h4>
                        <p className="text-indigo-100 text-sm font-medium mb-6">أكمل مسار "نيوتن" لتحصل على وسام "عقرب الميكانيكا" و 500 نقطة إضافية.</p>
                        <div className="p-4 bg-white/10 rounded-2xl border border-white/20 flex flex-center gap-4">
                            <Award className="text-amber-400" /> <span className="text-xs font-black">Mechanical Master Badge</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
