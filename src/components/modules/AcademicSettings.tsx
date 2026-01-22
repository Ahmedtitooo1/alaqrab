
import React, { useState } from 'react';
import {
    CalendarDays, Layers, Plus, Edit2, Trash2, CheckCircle, FolderPlus,
    BookOpen, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';
import { AcademicYear, GradeLevel, Subject } from '../../types';
import { useAppContext } from '../../context/AppContext';

// Simple ID Generator
const generateId = () => Math.random().toString(36).substr(2, 9);

const AcademicSettings: React.FC = () => {
    const { lang } = useAppContext();
    const isRtl = lang === 'ar';

    const [activeTab, setActiveTab] = useState<'years' | 'grades'>('years');

    // --- Mock State (in a real app, this would come from a Context or API) ---
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([
        { id: 'ay-1', name: '2023-2024', startDate: '2023-09-01', endDate: '2024-06-30', isCurrent: false, institutionId: 'inst-1' },
        { id: 'ay-2', name: '2024-2025', startDate: '2024-09-01', endDate: '2025-06-30', isCurrent: true, institutionId: 'inst-1' }
    ]);

    const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([
        {
            id: 'gl-1',
            name: isRtl ? 'الصح الأول الثانوي' : 'Grade 10',
            institutionId: 'inst-1',
            subjects: [
                { id: 'sub-1', name: isRtl ? 'الفيزياء' : 'Physics', gradeLevelId: 'gl-1' },
                { id: 'sub-2', name: isRtl ? 'الرياضيات' : 'Mathematics', gradeLevelId: 'gl-1' }
            ]
        },
        {
            id: 'gl-2',
            name: isRtl ? 'الصف الثاني الثانوي' : 'Grade 11',
            institutionId: 'inst-1',
            subjects: []
        }
    ]);

    // --- Actions ---

    const handleSetCurrentYear = (id: string) => {
        setAcademicYears(prev => prev.map(y => ({
            ...y,
            isCurrent: y.id === id
        })));
    };

    const handleAddYear = () => {
        const name = prompt(isRtl ? 'أدخل اسم السنة الدراسية (مثال: 2025-2026)' : 'Enter Academic Year Name (e.g. 2025-2026)');
        if (!name) return;
        setAcademicYears([...academicYears, {
            id: generateId(),
            name,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            isCurrent: false,
            institutionId: 'inst-1'
        }]);
    };

    const handleDeleteYear = (id: string) => {
        if (confirm(isRtl ? 'هل أنت متأكد من الحذف؟' : 'Are you sure?')) {
            setAcademicYears(prev => prev.filter(y => y.id !== id));
        }
    };

    const handleAddGrade = () => {
        const name = prompt(isRtl ? 'أدخل اسم المرحلة الدراسية' : 'Enter Grade Level Name');
        if (!name) return;
        setGradeLevels([...gradeLevels, {
            id: generateId(),
            name,
            subjects: [],
            institutionId: 'inst-1'
        }]);
    };

    const handleAddSubject = (gradeId: string) => {
        const name = prompt(isRtl ? 'أدخل اسم المادة' : 'Enter Subject Name');
        if (!name) return;
        setGradeLevels(prev => prev.map(g => {
            if (g.id === gradeId) {
                return { ...g, subjects: [...g.subjects, { id: generateId(), name, gradeLevelId: gradeId }] };
            }
            return g;
        }));
    };

    const handleDeleteSubject = (gradeId: string, subjectId: string) => {
        setGradeLevels(prev => prev.map(g => {
            if (g.id === gradeId) {
                return { ...g, subjects: g.subjects.filter(s => s.id !== subjectId) };
            }
            return g;
        }));
    };

    return (
        <div className="space-y-8 animate-view">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <Layers className="text-indigo-600" /> {isRtl ? 'الإعدادات الأكاديمية' : 'Academic Configuration'}
                    </h2>
                    <p className="text-slate-500 font-bold mt-1 max-w-2xl">
                        {isRtl ? 'إعداد هيكل المدرسة، السنوات الدراسية، الصفوف، والمواد لضمان سير العملية التعليمية.' : 'Configure the school structure, academic years, grades, and subjects.'}
                    </p>
                </div>

                <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl">
                    <button
                        onClick={() => setActiveTab('years')}
                        className={`px-6 py-2.5 rounded-xl font-black text-sm transition-all ${activeTab === 'years' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        {isRtl ? 'السنوات الدراسية' : 'Academic Years'}
                    </button>
                    <button
                        onClick={() => setActiveTab('grades')}
                        className={`px-6 py-2.5 rounded-xl font-black text-sm transition-all ${activeTab === 'grades' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        {isRtl ? 'الصفوف والمواد' : 'Grades & Subjects'}
                    </button>
                </div>
            </div>

            {activeTab === 'years' ? (
                <div className="glass-card bg-white p-8 rounded-[2.5rem] shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black flex items-center gap-2"><CalendarDays size={20} /> {isRtl ? 'قائمة السنوات الدراسية' : 'Academic Years List'}</h3>
                        <button onClick={handleAddYear} className="px-5 py-3 bg-slate-900 text-white rounded-xl font-black text-xs flex items-center gap-2 hover:bg-indigo-600 transition-all">
                            <Plus size={16} /> {isRtl ? 'إضافة سنة جديدة' : 'Add New Year'}
                        </button>
                    </div>

                    <div className="space-y-4">
                        {academicYears.map(year => (
                            <div key={year.id} className={`p-6 rounded-3xl border-2 flex items-center justify-between transition-all ${year.isCurrent ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-100'}`}>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h4 className="font-black text-xl text-slate-800">{year.name}</h4>
                                        {year.isCurrent && <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest">{isRtl ? 'الحالية' : 'CURRENT'}</span>}
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{year.startDate} - {year.endDate}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {!year.isCurrent && (
                                        <button onClick={() => handleSetCurrentYear(year.id)} className="px-4 py-2 border-2 border-slate-200 rounded-xl text-xs font-black text-slate-500 hover:border-indigo-600 hover:text-indigo-600 transition-all">
                                            {isRtl ? 'تفعيل كحالية' : 'Set as Current'}
                                        </button>
                                    )}
                                    <button onClick={() => handleDeleteYear(year.id)} className="p-3 text-rose-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Grades List & Add */}
                    <div className="space-y-6">
                        <div className="glass-card p-6 bg-slate-900 text-white rounded-[2rem] flex justify-between items-center shadow-xl">
                            <div>
                                <h3 className="font-black text-lg">{isRtl ? 'الهيكل التعليمي' : 'Educational Structure'}</h3>
                                <p className="text-xs text-slate-400 font-bold mt-1">{isRtl ? 'أضف الصفوف الدراسية هنا' : 'Add grade levels here'}</p>
                            </div>
                            <button onClick={handleAddGrade} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"><Plus /></button>
                        </div>

                        {gradeLevels.map((grade) => (
                            <div key={grade.id} className="glass-card bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm group">
                                <div className="flex justify-between items-center border-b border-slate-50 pb-4 mb-4">
                                    <h4 className="font-black text-slate-800 flex items-center gap-2"><FolderPlus size={18} className="text-amber-500" /> {grade.name}</h4>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleAddSubject(grade.id)} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black hover:bg-indigo-600 hover:text-white transition-all">
                                            + {isRtl ? 'مادة' : 'Subject'}
                                        </button>
                                    </div>
                                </div>

                                {grade.subjects.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        {grade.subjects.map(sub => (
                                            <div key={sub.id} className="p-3 bg-slate-50 rounded-2xl flex justify-between items-center group/sub hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
                                                <span className="text-xs font-bold text-slate-600">{sub.name}</span>
                                                <button onClick={() => handleDeleteSubject(grade.id, sub.id)} className="text-slate-300 hover:text-rose-500 opacity-0 group-hover/sub:opacity-100 transition-all"><Trash2 size={14} /></button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-slate-300 text-xs font-bold border-2 border-dashed border-slate-100 rounded-2xl">
                                        {isRtl ? 'لا توجد مواد دراسية' : 'No subjects assigned'}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Helper / Info Panel */}
                    <div className="glass-card bg-indigo-50 p-8 rounded-[2.5rem] h-fit border border-indigo-100">
                        <div className="p-4 bg-white rounded-2xl w-fit shadow-sm mb-6 text-indigo-600"><AlertCircle /></div>
                        <h3 className="text-xl font-black text-indigo-900 mb-4">{isRtl ? 'كيف يعمل الهيكل؟' : 'How does it work?'}</h3>
                        <p className="text-sm font-bold text-indigo-800/70 leading-relaxed mb-6">
                            {isRtl
                                ? 'عند إضافة صف دراسي (مثل: الصف الأول الثانوي)، يمكنك تعيين مجموعة من المواد له. سيتم تسجيل الطلاب في الصف، وبشكل تلقائي سيتم ربطهم بجميع المواد التابعة لهذا الصف في "شيت الكنترول".'
                                : 'When you add a Grade Level (e.g. Grade 10), you can assign subjects to it. Students will be enrolled in the Grade, and automatically linked to all subjects in the "Control Sheet".'
                            }
                        </p>
                        <div className="p-4 bg-white/60 rounded-xl text-xs font-bold text-indigo-800">
                            {isRtl ? 'نصيحة: تأكد من تفعيل "السنة الحالية" بشكل صحيح قبل بدء تسجيل الطلاب.' : 'Tip: Ensure the "Current Year" is set correctly before enrolling students.'}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AcademicSettings;
