
import React, { useState, useRef } from 'react';
import {
    FilePlus2, Calendar, Clock,
    Paperclip, Send, ChevronRight,
    LayoutList, CheckCircle2, AlertCircle,
    FolderOpen, Plus, Trash2, Edit3,
    BookOpen, Star, Printer, Download,
    Image as ImageIcon, UploadCloud, X,
    UserCheck, MessageCircle, FileText,
    Camera, Eye, Check
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { UserRole, QuestionType, Question, Assignment, AssignmentSubmission } from '../types';

const AssignmentsModule: React.FC = () => {
    const { lang, t, isRtl, user, allUsers, addNotification } = useAppContext();
    const [view, setView] = useState<'list' | 'create' | 'details' | 'submissions'>('list');
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
    const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);

    // States for creation
    const [newAssignment, setNewAssignment] = useState<Partial<Assignment>>({
        title: '',
        description: '',
        dueDate: '',
        points: 10,
        questions: []
    });

    // Mock Data
    const [assignments, setAssignments] = useState<Assignment[]>([
        {
            id: '1',
            title: isRtl ? 'واجب القوانين الميكانيكية' : 'Mechanical Laws Homework',
            description: isRtl ? 'يرجى حل المسائل المتعلقة بقوانين نيوتن الثلاثة.' : 'Please solve problems related to Newton\'s three laws.',
            dueDate: '2026-03-20',
            status: 'active',
            subject: 'Physics',
            teacherId: 't1',
            points: 20,
            questions: [
                { id: 'q1', type: QuestionType.SINGLE_CHOICE, text: isRtl ? 'ما هو القانون الأول لنيوتن؟' : 'What is Newton\'s First Law?', points: 5, correctAnswer: 'Inertia', options: [{ id: '1', text: 'Inertia' }, { id: '2', text: 'Force' }] }
            ]
        },
        {
            id: '2',
            title: isRtl ? 'تقرير تحليل الحركة' : 'Kinematic Analysis Report',
            description: isRtl ? 'اكتب تقريراً عن حركة المقذوفات.' : 'Write a report on projectile motion.',
            dueDate: '2026-03-22',
            status: 'active',
            subject: 'Physics',
            teacherId: 't1',
            points: 50
        },
    ]);

    const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([
        {
            id: 'sub1',
            assignmentId: '1',
            studentId: 's1',
            studentName: isRtl ? 'أحمد محمد' : 'Ahmed Mohamed',
            submissionDate: '2024-03-18',
            submittedAt: '2024-03-18T10:30:00Z',
            status: 'pending',
            files: [{ url: 'https://via.placeholder.com/600x800?text=Student+Work', type: 'image' }]
        }
    ]);

    const isTeacher = user?.role === UserRole.TEACHER || user?.role === UserRole.ADMIN;
    const isStudent = user?.role === UserRole.STUDENT;

    const handlePrint = () => {
        window.print();
    };

    const handleCreateAssignment = () => {
        if (!newAssignment.title) return;
        const assignment: Assignment = {
            ...newAssignment as Assignment,
            id: `as-${Date.now()}`,
            status: 'active',
            teacherId: user?.id || 't1',
            subject: 'Physics'
        };
        setAssignments([...assignments, assignment]);
        setView('list');
        addNotification({ title: t('success'), content: isRtl ? 'تم نشر الواجب بنجاح' : 'Assignment published successfully', type: 'success', date: new Date().toISOString() });
    };

    const addQuestion = () => {
        const q: Question = {
            id: `q-${Date.now()}`,
            type: QuestionType.SHORT_ESSAY,
            text: '',
            points: 5,
            correctAnswer: ''
        };
        setNewAssignment({ ...newAssignment, questions: [...(newAssignment.questions || []), q] });
    };

    const SubmissionView = ({ submission }: { submission: AssignmentSubmission }) => (
        <div className="space-y-8 animate-view">
            <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="flex items-center gap-6">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${submission.studentName}`} className="w-16 h-16 rounded-2xl bg-indigo-50" />
                    <div>
                        <h3 className="text-2xl font-black text-slate-900">{submission.studentName}</h3>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{t('submission_date')}: {submission.submissionDate}</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setView('submissions')}
                        className="px-6 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold hover:bg-slate-200 transition-all"
                    >
                        {isRtl ? 'رجوع' : 'Back'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-6">
                    {submission.files.map((file, idx) => (
                        <div key={idx} className="glass-card overflow-hidden bg-white border border-slate-100 rounded-[3rem] shadow-lg">
                            <div className="p-4 bg-slate-50 border-b flex justify-between items-center px-8">
                                <span className="font-black text-xs text-slate-400 uppercase tracking-widest">{isRtl ? 'ورقة الطالب' : 'Student Paper'} #{idx + 1}</span>
                                <button className="p-2 text-indigo-600 hover:bg-white rounded-lg transition-all"><Download size={18} /></button>
                            </div>
                            <img src={file.url} className="w-full h-auto object-contain bg-slate-900" alt="Submission" />
                        </div>
                    ))}
                </div>

                <div className="space-y-6">
                    <div className="glass-card p-10 bg-white border border-slate-100 rounded-[3rem] shadow-xl space-y-8">
                        <h4 className="text-xl font-black text-slate-900 border-b pb-4">{isRtl ? 'التقييم والملاحظات' : 'Grading & Feedback'}</h4>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{isRtl ? 'الدرجة المستحقة' : 'Score'}</label>
                            <input type="number" className="w-full p-6 bg-slate-50 rounded-2xl font-black text-3xl outline-none focus:bg-white border-2 border-transparent focus:border-indigo-100 text-center" placeholder="0" />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{isRtl ? 'ملاحظات المعلم' : 'Teacher Comments'}</label>
                            <textarea className="w-full p-6 bg-slate-50 rounded-2xl font-bold min-h-[150px] outline-none" placeholder={isRtl ? 'اكتب ملاحظاتك للطالب...' : 'Add your feedback...'} />
                        </div>
                        <button className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                            <CheckCircle2 size={24} /> {isRtl ? 'اعتماد الدرجة' : 'Grade Assignment'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-10 animate-view pb-20">
            {/* 1. Module Hub Header */}
            <div className="relative p-12 rounded-[4rem] bg-indigo-600 text-white overflow-hidden shadow-2xl no-print">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 blur-[80px] rounded-full -mr-40 -mt-40"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="space-y-4 text-center md:text-right">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight">{isRtl ? 'إدارة الواجبات والمهام' : 'Assignments & Projects'}</h2>
                        <p className="text-indigo-100 font-bold max-w-xl text-lg opacity-80">
                            {isRtl ? 'قم بمتابعة أداء الطلاب من خلال المهام المدرسية والتقارير البحثية.' : 'Track student performance through academic tasks and research reports.'}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        {isTeacher && (
                            <>
                                <button
                                    onClick={() => setView(view === 'submissions' ? 'list' : 'submissions')}
                                    className="px-8 py-5 bg-indigo-500/50 text-white border border-white/20 rounded-3xl font-black text-sm flex items-center gap-3 hover:bg-white/10 transition-all"
                                >
                                    <Eye size={20} />
                                    {view === 'submissions' ? (isRtl ? 'رجوع للواجبات' : 'Back to List') : (isRtl ? 'مراجعة التسليمات' : 'Review Submissions')}
                                </button>
                                <button
                                    onClick={() => setView(view === 'create' ? 'list' : 'create')}
                                    className="px-10 py-5 bg-white text-indigo-600 rounded-3xl font-black text-sm flex items-center gap-3 hover:scale-105 transition-all shadow-xl"
                                >
                                    {view === 'list' || view === 'submissions' ? <Plus size={20} /> : <LayoutList size={20} />}
                                    {view === 'list' || view === 'submissions' ? (isRtl ? 'إضافة واجب جديد' : 'Create Assignment') : (isRtl ? 'عرض القائمة' : 'View List')}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {view === 'submissions' && isTeacher && (
                <div className="space-y-8 animate-view">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-right">
                        {submissions.map(sub => (
                            <div key={sub.id} className="glass-card p-8 bg-white border border-slate-100 rounded-[2.5rem] hover:shadow-xl transition-all group">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest">{sub.status}</span>
                                    <p className="text-[10px] text-slate-400 font-black">{sub.submissionDate}</p>
                                </div>
                                <div className="flex items-center gap-4 mb-8">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${sub.studentName}`} className="w-14 h-14 rounded-xl bg-slate-50" />
                                    <div>
                                        <h4 className="font-black text-lg text-slate-900">{sub.studentName}</h4>
                                        <p className="text-xs text-slate-400 font-bold">{isRtl ? 'واجب الفيزياء الذرية' : 'Atomic Physics HW'}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setSelectedSubmission(sub); setView('submissions'); }}
                                    className="w-full py-4 bg-slate-50 text-indigo-600 rounded-2xl font-black text-xs group-hover:bg-indigo-600 group-hover:text-white transition-all flex items-center justify-center gap-3"
                                >
                                    <Eye size={16} /> {isRtl ? 'عرض وتصحيح' : 'View & Grade'}
                                </button>
                            </div>
                        ))}
                    </div>
                    {selectedSubmission && <SubmissionView submission={selectedSubmission} />}
                </div>
            )}

            {view === 'list' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {assignments.map(a => (
                        <div key={a.id} className="glass-card p-10 bg-white border border-slate-100 rounded-[3rem] hover:shadow-2xl transition-all relative group">
                            <div className="flex justify-between items-start mb-8">
                                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:rotate-12 transition-all"><BookOpen size={24} /></div>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${a.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                                    {a.status}
                                </span>
                            </div>

                            <h4 className={`text-2xl font-black text-slate-900 mb-6 ${isRtl ? 'text-right' : 'text-left'}`}>{a.title}</h4>

                            <div className={`space-y-4 border-t pt-8 ${isRtl ? 'text-right' : 'text-left'}`}>
                                <div className={`flex items-center gap-4 text-slate-400 font-bold text-sm ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <Calendar size={18} className="text-indigo-600" />
                                    <span>{isRtl ? 'تاريخ التسليم:' : 'Deadline:'} <span className="text-slate-900">{a.dueDate}</span></span>
                                </div>
                                <div className={`flex items-center gap-4 text-slate-400 font-bold text-sm ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <CheckCircle2 size={18} className="text-emerald-500" />
                                    <span>{isRtl ? 'تم التسليم:' : 'Submitted:'} <span className="text-slate-900">{isTeacher ? a.studentsSubmitted : (submissions.find(s => s.assignmentId === a.id) ? '1' : '0')}</span></span>
                                </div>
                            </div>

                            <div className="mt-10 flex gap-4">
                                <button
                                    onClick={() => { setSelectedAssignment(a); setView('details'); }}
                                    className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs hover:bg-slate-950 shadow-xl transition-all"
                                >
                                    {isRtl ? 'فتح وتفاصيل' : 'Open Details'}
                                </button>
                                {isTeacher && <button className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={18} /></button>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {view === 'create' && isTeacher && (
                <div className="max-w-4xl mx-auto glass-card p-12 bg-white rounded-[4rem] shadow-2xl space-y-10 border-t-[12px] border-indigo-600">
                    <div className="space-y-4">
                        <label className={`block font-black text-slate-400 uppercase text-xs tracking-[0.2em] ${isRtl ? 'text-right' : 'text-left'}`}>{isRtl ? 'عنوان الواجب' : 'Assignment Title'}</label>
                        <input
                            value={newAssignment.title}
                            onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })}
                            className={`w-full p-6 bg-slate-50 rounded-2xl font-black text-xl outline-none focus:bg-white border-2 border-transparent focus:border-indigo-100 transition-all ${isRtl ? 'text-right' : 'text-left'}`}
                            placeholder={isRtl ? 'اكتب عنواناً جذاباً...' : 'Ex: Thermodynamics Assignment #1'}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className={`block font-black text-slate-400 uppercase text-xs tracking-[0.2em] ${isRtl ? 'text-right' : 'text-left'}`}>{isRtl ? 'الموعد النهائي' : 'Deadline'}</label>
                            <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-2xl">
                                <Calendar className="text-indigo-600" size={20} />
                                <input type="date" value={newAssignment.dueDate} onChange={e => setNewAssignment({ ...newAssignment, dueDate: e.target.value })} className="bg-transparent border-none outline-none font-bold w-full" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className={`block font-black text-slate-400 uppercase text-xs tracking-[0.2em] ${isRtl ? 'text-right' : 'text-left'}`}>{isRtl ? 'الدرجة الكلية' : 'Total Points'}</label>
                            <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-2xl">
                                <Star className="text-amber-500" size={20} />
                                <input type="number" value={newAssignment.points} onChange={e => setNewAssignment({ ...newAssignment, points: parseInt(e.target.value) })} className="bg-transparent border-none outline-none font-bold w-full" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className={`block font-black text-slate-400 uppercase text-xs tracking-[0.2em] ${isRtl ? 'text-right' : 'text-left'}`}>{isRtl ? 'وصف المهمة' : 'Description & Instructions'}</label>
                        <textarea
                            value={newAssignment.description}
                            onChange={e => setNewAssignment({ ...newAssignment, description: e.target.value })}
                            className={`w-full p-6 bg-slate-50 rounded-3xl font-bold min-h-[150px] outline-none focus:bg-white border-2 border-transparent focus:border-indigo-100 transition-all ${isRtl ? 'text-right' : 'text-left'}`}
                            placeholder={isRtl ? 'اكتب تفاصيل الواجب هنا...' : 'Explain the requirements clearly...'}
                        />
                    </div>

                    {/* New Section: Add Questions */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h4 className="font-black text-slate-900">{isRtl ? 'الأسئلة السريعة (اختياري)' : 'Quick Questions (Optional)'}</h4>
                            <button onClick={addQuestion} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-black text-[10px] uppercase flex items-center gap-2">+ {t('add_question')}</button>
                        </div>
                        <div className="space-y-4">
                            {newAssignment.questions?.map((q, idx) => (
                                <div key={q.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex gap-4">
                                    <span className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-black text-xs shrink-0">{idx + 1}</span>
                                    <input
                                        value={q.text}
                                        onChange={e => {
                                            const nq = [...(newAssignment.questions || [])];
                                            nq[idx].text = e.target.value;
                                            setNewAssignment({ ...newAssignment, questions: nq });
                                        }}
                                        className="flex-1 bg-transparent border-none outline-none font-bold"
                                        placeholder={isRtl ? 'اكتب السؤال هنا...' : 'Type question here...'}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-10 border-4 border-dashed border-slate-100 rounded-[3rem] text-center space-y-4 hover:border-indigo-200 transition-all group cursor-pointer relative">
                        <div className="p-6 bg-slate-50 text-slate-400 rounded-full inline-block group-hover:scale-110 transition-transform"><Paperclip size={32} /></div>
                        <p className="font-black text-slate-900">{isRtl ? 'ارفع ملف الواجب (PDF)' : 'Attach Assignment File (PDF)'}</p>
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>

                    <div className="flex gap-4 pt-6">
                        <button onClick={handleCreateAssignment} className="flex-1 py-6 bg-slate-950 text-white rounded-[2rem] font-black text-xl hover:bg-indigo-600 transition-all shadow-2xl flex items-center justify-center gap-4">
                            <Send size={24} /> {isRtl ? 'نشر الواجب للطلاب' : 'Publish to Students'}
                        </button>
                        <button onClick={() => setView('list')} className="px-12 py-6 bg-slate-100 text-slate-500 rounded-[2rem] font-bold hover:bg-rose-50 hover:text-rose-600 transition-all">{isRtl ? 'إلغاء' : 'Cancel'}</button>
                    </div>
                </div>
            )}

            {view === 'details' && selectedAssignment && (
                <div className="max-w-5xl mx-auto space-y-10 animate-view">
                    {/* Detailed View for Printing */}
                    <div id="assignment-to-print" className="glass-card p-12 bg-white rounded-[3rem] shadow-2xl border-t-[10px] border-indigo-600 space-y-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-50 z-0 no-print"></div>

                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-8">
                            <div className="space-y-4">
                                <h2 className="text-4xl font-black text-slate-900">{selectedAssignment.title}</h2>
                                <div className="flex gap-4">
                                    <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-black">{selectedAssignment.subject}</span>
                                    <span className="px-4 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-black">{selectedAssignment.points} {t('points_label')}</span>
                                </div>
                            </div>
                            <div className="flex gap-4 no-print">
                                <button onClick={() => setView('list')} className="p-4 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-all"><X size={24} /></button>
                                <button onClick={handlePrint} className="p-4 bg-slate-950 text-white rounded-2xl hover:bg-indigo-600 transition-all shadow-lg"><Printer size={24} /></button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="font-black text-lg text-slate-900 border-b pb-2 flex items-center gap-3"><FileText className="text-indigo-600" /> {isRtl ? 'وصف المهمة' : 'Instructions'}</h4>
                            <p className="text-slate-600 font-bold leading-relaxed text-lg whitespace-pre-wrap">{selectedAssignment.description}</p>
                        </div>

                        {selectedAssignment.questions && selectedAssignment.questions.length > 0 && (
                            <div className="space-y-8">
                                <h4 className="font-black text-lg text-slate-900 border-b pb-2 flex items-center gap-3"><LayoutList className="text-indigo-600" /> {isRtl ? 'الأسئلة المطلوب حلها' : 'Questions to Answer'}</h4>
                                <div className="space-y-10">
                                    {selectedAssignment.questions.map((q, idx) => (
                                        <div key={q.id} className="space-y-4">
                                            <p className="font-black text-xl text-slate-900">{idx + 1}. {q.text}</p>
                                            <div className="h-40 w-full border-2 border-dashed border-slate-100 rounded-3xl print:border-slate-300"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Submission Area for Student */}
                        {isStudent && (
                            <div className="mt-20 pt-10 border-t-2 border-dashed border-indigo-100 no-print space-y-10">
                                <div className="text-center">
                                    <h3 className="text-3xl font-black text-slate-900 mb-2">{isRtl ? 'تسليم الواجب' : 'Submit Your Work'}</h3>
                                    <p className="text-slate-400 font-bold">{isRtl ? 'قم بتصوير الحل ورفعه كصورة أو ملف PDF' : 'Capture your solution and upload it as image or PDF'}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-10 bg-slate-50 border-4 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center gap-4 hover:border-indigo-300 transition-all group relative cursor-pointer">
                                        <div className="p-6 bg-white text-indigo-600 rounded-full shadow-lg group-hover:scale-110 transition-transform"><Camera size={40} /></div>
                                        <p className="font-black text-lg">{isRtl ? 'التقاط صورة للحل' : 'Take a Photo'}</p>
                                        <input type="file" accept="image/*" capture="environment" className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>
                                    <div className="p-10 bg-slate-50 border-4 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center gap-4 hover:border-emerald-300 transition-all group relative cursor-pointer">
                                        <div className="p-6 bg-white text-emerald-600 rounded-full shadow-lg group-hover:scale-110 transition-transform"><UploadCloud size={40} /></div>
                                        <p className="font-black text-lg">{isRtl ? 'عرض ملف PDF' : 'Upload PDF'}</p>
                                        <input type="file" accept="application/pdf" className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>
                                </div>

                                <button className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-2xl shadow-xl shadow-indigo-600/20 hover:bg-slate-950 transition-all flex items-center justify-center gap-4">
                                    <Send size={28} /> {isRtl ? 'ارسال الحل النهائي' : 'Submit Solution'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignmentsModule;
