
import React, { useState } from 'react';
import {
    FileSpreadsheet, Filter, CheckCircle, XCircle, ArrowRight, Printer,
    Download, Award, UserCheck, AlertCircle, ChevronDown, Trophy
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { UserRole } from '../../types';

// Mock Interfaces locally since we don't have backend
interface StudentGradeRow {
    studentId: string;
    studentName: string;
    code: string;
    grades: Record<string, number>; // subjectId -> score
    totalScore: number;
    finalStatus: 'PASS' | 'FAIL';
}

const ControlSheet: React.FC = () => {
    const { lang, allUsers, systemName } = useAppContext();
    const isRtl = lang === 'ar';
    const [selectedGrade, setSelectedGrade] = useState('gl-1');
    const [showPromotionModal, setShowPromotionModal] = useState(false);

    // Filter Students for this "School Center"
    // In a real app, filtering would use user.gradeLevelId
    // mocking some students for visualization
    const mockStudents: StudentGradeRow[] = [
        {
            studentId: 'std-1', studentName: 'ياسين محمود', code: 'STD-101',
            grades: { 'sub-1': 45, 'sub-2': 88 },
            totalScore: 133, finalStatus: 'PASS'
        },
        {
            studentId: 'std-2', studentName: 'أحمد علي', code: 'STD-102',
            grades: { 'sub-1': 20, 'sub-2': 60 },
            totalScore: 80, finalStatus: 'FAIL'
        },
        {
            studentId: 'std-3', studentName: 'سارة محمد', code: 'STD-103',
            grades: { 'sub-1': 50, 'sub-2': 95 },
            totalScore: 145, finalStatus: 'PASS'
        },
    ];

    // Mock configured subjects for the selected grade
    const mockSubjects = [
        { id: 'sub-1', name: isRtl ? 'الفيزياء' : 'Physics', maxScore: 50, passScore: 25 },
        { id: 'sub-2', name: isRtl ? 'الرياضيات' : 'Math', maxScore: 100, passScore: 50 },
    ];

    const passCount = mockStudents.filter(s => s.finalStatus === 'PASS').length;
    const failCount = mockStudents.filter(s => s.finalStatus === 'FAIL').length;

    // Logic for Promotion Modal
    const [promotionConfig, setPromotionConfig] = useState({
        targetYear: '2025-2026',
        targetGrade: 'gl-2'
    });

    const handlePromote = () => {
        alert(`تم ترحيل ${passCount} طالب بنجاح إلى ${promotionConfig.targetYear} - ${promotionConfig.targetGrade === 'gl-2' ? 'الصف الثاني الثانوي' : '...'}`);
        setShowPromotionModal(false);
    };

    return (
        <div className="space-y-10 animate-view pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 no-print">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <FileSpreadsheet className="text-emerald-600" /> {isRtl ? 'شيت الكنترول النهائي' : 'End of Year Control Sheet'}
                    </h2>
                    <p className="text-slate-500 font-bold mt-1 max-w-2xl">
                        {isRtl ? 'استعراض درجات الطلاب النهائية وقرار الترحيل للسنة القادمة.' : 'Review final student grades and promote successful students.'}
                    </p>
                </div>

                <div className="flex gap-3">
                    <button onClick={() => window.print()} className="p-4 bg-white border border-slate-200 rounded-2xl hover:text-emerald-600 shadow-sm transition-all"><Printer /></button>
                    <button className="px-6 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-slate-50 shadow-sm"><Download size={18} /> Excel</button>
                    <button
                        onClick={() => setShowPromotionModal(true)}
                        className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs flex items-center gap-3 shadow-xl hover:bg-emerald-600 transition-all"
                    >
                        <UserCheck size={18} /> {isRtl ? 'ترحيل الناجحين' : 'Promote Students'}
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="glass-card p-4 bg-white flex flex-col md:flex-row items-center gap-4 rounded-[2rem] border border-slate-100 shadow-sm no-print">
                <div className="flex items-center gap-2 px-4 text-slate-400"><Filter size={18} /> <span className="text-xs font-black uppercase tracking-widest">{isRtl ? 'تصفية:' : 'FILTER:'}</span></div>

                <select
                    value={selectedGrade}
                    onChange={e => setSelectedGrade(e.target.value)}
                    className="p-3 bg-slate-50 rounded-xl font-bold text-sm outline-none border border-transparent focus:border-indigo-500 min-w-[200px]"
                >
                    <option value="gl-1">{isRtl ? 'الصف الأول الثانوي' : 'Grade 10'}</option>
                    <option value="gl-2">{isRtl ? 'الصف الثاني الثانوي' : 'Grade 11'}</option>
                </select>

                <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>

                <div className="flex gap-4 text-xs font-black">
                    <span className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle size={14} /> {isRtl ? 'نـاجح:' : 'PASS:'} {passCount}</span>
                    <span className="flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-lg"><XCircle size={14} /> {isRtl ? 'راسـب:' : 'FAIL:'} {failCount}</span>
                </div>
            </div>

            {/* Print Header (Visible only in print) */}
            <div className="hidden print:block text-center mb-8 border-b-4 border-black pb-4">
                <h1 className="text-4xl font-black">{systemName}</h1>
                <h2 className="text-2xl font-bold mt-2">كشف درجات الطلاب - {selectedGrade === 'gl-1' ? 'الصف الأول الثانوي' : '...'}</h2>
                <p className="text-sm">العام الدراسي: 2024-2025</p>
            </div>

            {/* Master Table */}
            <div className="overflow-x-auto rounded-[2.5rem] border border-slate-200 shadow-xl bg-white">
                <table className="w-full text-right min-w-[1000px]">
                    <thead className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
                        <tr>
                            <th className="p-6 w-16 text-center">#</th>
                            <th className="p-6">{isRtl ? 'الطالب' : 'Student'}</th>
                            {mockSubjects.map(sub => (
                                <th key={sub.id} className="p-6 text-center border-l border-white/10">
                                    <div className="flex flex-col items-center gap-1">
                                        <span>{sub.name}</span>
                                        <span className="opacity-50 text-[9px]">Max: {sub.maxScore}</span>
                                    </div>
                                </th>
                            ))}
                            <th className="p-6 text-center bg-indigo-900 border-l border-white/10">{isRtl ? 'المجموع' : 'Total'}</th>
                            <th className="p-6 text-center bg-indigo-950 border-l border-white/10">{isRtl ? 'النتيجة' : 'Result'}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-bold text-sm text-slate-700">
                        {mockStudents.map((student, idx) => (
                            <tr key={student.studentId} className="hover:bg-slate-50 transition-colors">
                                <td className="p-6 text-center text-slate-400">{idx + 1}</td>
                                <td className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black">{student.studentName.charAt(0)}</div>
                                        <div>
                                            <p className="text-slate-900">{student.studentName}</p>
                                            <p className="text-[10px] text-slate-400 font-black">{student.code}</p>
                                        </div>
                                        {student.finalStatus === 'PASS' && student.totalScore > 140 && <Trophy size={14} className="text-amber-500" />}
                                    </div>
                                </td>
                                {mockSubjects.map(sub => {
                                    const score = student.grades[sub.id] || 0;
                                    const isFail = score < sub.passScore;
                                    return (
                                        <td key={sub.id} className={`p-6 text-center border-l border-slate-50 tabular-nums ${isFail ? 'bg-rose-50/50 text-rose-600' : ''}`}>
                                            {score}
                                            {isFail && <span className="block text-[9px] text-rose-400 font-black uppercase">Fail</span>}
                                        </td>
                                    );
                                })}
                                <td className="p-6 text-center font-black text-indigo-900 bg-indigo-50/30 tabular-nums border-l border-slate-100">
                                    {student.totalScore}
                                </td>
                                <td className="p-6 text-center border-l border-slate-100">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${student.finalStatus === 'PASS'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-rose-100 text-rose-700'
                                        }`}>
                                        {student.finalStatus === 'PASS' ? (isRtl ? 'ناجـح' : 'PASS') : (isRtl ? 'راسـب' : 'FAIL')}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Promotion Modal */}
            {showPromotionModal && (
                <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-view border-[8px] border-slate-100 text-center space-y-8">
                        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-inner mb-4">
                            <Award size={40} />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-slate-900 leading-tight">
                                {isRtl ? 'ترحيل الطلاب الناجحين' : 'Promote Successful Students'}
                            </h3>
                            <p className="text-slate-500 font-bold mt-2">
                                {isRtl
                                    ? `سيتم نقل ${passCount} طالب من الصف الحالي إلى الصف التالي.`
                                    : `Moving ${passCount} passing students to the next grade.`
                                }
                            </p>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4 text-right">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">{isRtl ? 'السنة الدراسية الجديدة' : 'Target Academic Year'}</label>
                                <select className="w-full p-4 bg-white rounded-xl font-bold shadow-sm outline-none border-2 border-transparent focus:border-indigo-500">
                                    <option>2025-2026</option>
                                    <option>2026-2027</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">{isRtl ? 'الصف الدراسي الجديد (المستهدف)' : 'Target Grade Level'}</label>
                                <select className="w-full p-4 bg-white rounded-xl font-bold shadow-sm outline-none border-2 border-transparent focus:border-indigo-500">
                                    <option value="gl-2">{isRtl ? 'الصف الثاني الثانوي' : 'Grade 11'}</option>
                                    <option value="gl-3">{isRtl ? 'الصف الثالث الثانوي' : 'Grade 12'}</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setShowPromotionModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black hover:bg-slate-200 transition-all">
                                {isRtl ? 'إلغاء' : 'Cancel'}
                            </button>
                            <button onClick={handlePromote} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                                {isRtl ? 'تأكيد الترحيل' : 'Confirm Promotion'} <ArrowRight size={18} className={isRtl ? 'rotate-180' : ''} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ControlSheet;
