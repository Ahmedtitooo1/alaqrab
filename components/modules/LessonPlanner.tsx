
import React, { useState } from 'react';
import {
    BookOpen, List, Plus, CheckCircle, Clock, Trash2, CalendarDays, FileText, CheckSquare
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

type Tab = 'summaries' | 'tasks';

const LessonPlanner: React.FC = () => {
    const { lang } = useAppContext();
    const isRtl = lang === 'ar';
    const [activeTab, setActiveTab] = useState<Tab>('summaries');

    // Mock Data
    const [summaries, setSummaries] = useState([
        { id: 1, title: 'شرح قانون أوم - فيزياء 101', date: '2025-10-15', content: 'تم شرح العلاقة بين الجهد والتيار والمقاومة مع أمثلة عملية.' },
        { id: 2, title: 'تطبيقات قوانين نيوتن', date: '2025-10-18', content: 'حل مسائل متقدمة على الحركة بعجلة منتظمة.' }
    ]);

    const [tasks, setTasks] = useState([
        { id: 1, title: 'إعداد اختبار الشهر', deadline: '2025-10-25', completed: false, priority: 'high' },
        { id: 2, title: 'تصحيح أوراق العمل', deadline: '2025-10-20', completed: true, priority: 'medium' }
    ]);

    return (
        <div className="space-y-8 animate-view pb-20">
            <div className="flex justify-between items-center bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4">
                        <BookOpen className="text-indigo-600" size={32} />
                        {isRtl ? 'دفتر التحضير والمهام' : 'Lesson Planner'}
                    </h2>
                    <p className="text-slate-400 font-bold mt-2">توثيق الحصص الدراسية وإدارة المهام الشخصية.</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-2xl">
                    <button
                        onClick={() => setActiveTab('summaries')}
                        className={`px-6 py-3 rounded-xl font-black text-xs transition-all flex items-center gap-2 ${activeTab === 'summaries' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-indigo-600'}`}
                    >
                        <FileText size={16} /> ملخصات الحصص
                    </button>
                    <button
                        onClick={() => setActiveTab('tasks')}
                        className={`px-6 py-3 rounded-xl font-black text-xs transition-all flex items-center gap-2 ${activeTab === 'tasks' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-indigo-600'}`}
                    >
                        <CheckSquare size={16} /> المهام
                    </button>
                </div>
            </div>

            {activeTab === 'summaries' ? (
                <div className="space-y-6">
                    <button className="w-full py-6 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-400 font-black hover:border-indigo-600 hover:text-indigo-600 hover:bg-slate-50 transition-all gap-2 group">
                        <div className="p-3 bg-slate-50 rounded-full group-hover:bg-indigo-100 transition-colors"><Plus size={24} /></div>
                        <span>إضافة ملخص حصة جديد</span>
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {summaries.map(s => (
                            <div key={s.id} className="glass-card bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-indigo-200 transition-all flex flex-col justify-between min-h-[200px]">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><BookOpen size={20} /></div>
                                        <div className="text-xs font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full">{s.date}</div>
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 mb-2">{s.title}</h3>
                                    <p className="text-sm font-bold text-slate-500 leading-relaxed line-clamp-3">{s.content}</p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-2">
                                    <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="glass-panel p-8 bg-white rounded-[3rem] space-y-6">
                        <div className="flex gap-4">
                            <input placeholder="أضف مهمة جديدة..." className="flex-1 p-4 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-2 ring-indigo-600/20" />
                            <button className="p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-colors"><Plus /></button>
                        </div>

                        <div className="space-y-2">
                            {tasks.map(task => (
                                <div key={task.id} className={`flex items-center gap-4 p-4 rounded-2xl transition-all border ${task.completed ? 'bg-slate-50 border-transparent opacity-60' : 'bg-white border-slate-100 hover:border-indigo-200 shadow-sm'}`}>
                                    <button
                                        onClick={() => setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t))}
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 text-transparent hover:border-indigo-600'}`}
                                    >
                                        <CheckCircle size={14} fill="currentColor" />
                                    </button>
                                    <div className="flex-1">
                                        <p className={`font-black ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>{task.title}</p>
                                        <div className="flex items-center gap-4 mt-1">
                                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Clock size={10} /> {task.deadline}</span>
                                            {task.priority === 'high' && <span className="text-[10px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded">High Priority</span>}
                                        </div>
                                    </div>
                                    <button onClick={() => setTasks(tasks.filter(t => t.id !== task.id))} className="text-slate-300 hover:text-rose-500 p-2"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LessonPlanner;
