
import React, { useState } from 'react';
import {
    FileSpreadsheet, Filter, CheckCircle, XCircle, ArrowRight, Printer,
    Download, Award, UserCheck, AlertCircle, ChevronDown, Trophy,
    CalendarDays, CheckSquare, Square
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import CertificateTemplate from './CertificateTemplate';

// Mock Interfaces locally since we don't have backend
interface StudentGradeRow {
    studentId: string;
    studentName: string;
    code: string;
    grades: Record<string, number>; // subjectId -> score
    midtermGrades?: Record<string, number>;
    totalScore: number;
    finalStatus: 'PASS' | 'FAIL';
}

const ControlSheet: React.FC = () => {
    const { lang, allUsers, systemName } = useAppContext();
    const isRtl = lang === 'ar';

    // State
    const [selectedGrade, setSelectedGrade] = useState('gl-1');
    const [activeTerm, setActiveTerm] = useState<'midterm' | 'final'>('final');
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
    const [showPromotionModal, setShowPromotionModal] = useState(false);

    // Printing State
    const [printingStudent, setPrintingStudent] = useState<StudentGradeRow | null>(null);

    // Filter Students for this "School Center"
    // In a real app, filtering would use user.gradeLevelId
    // mocking some students for visualization
    const mockStudents: StudentGradeRow[] = [
        {
            studentId: 'std-1', studentName: 'ياسين محمود', code: 'STD-101',
            grades: { 'sub-1': 45, 'sub-2': 88 },
            midtermGrades: { 'sub-1': 20, 'sub-2': 40 },
            totalScore: 133, finalStatus: 'PASS'
        },
        {
            studentId: 'std-2', studentName: 'أحمد علي', code: 'STD-102',
            grades: { 'sub-1': 20, 'sub-2': 60 },
            midtermGrades: { 'sub-1': 10, 'sub-2': 30 },
            totalScore: 80, finalStatus: 'FAIL'
        },
        {
            studentId: 'std-3', studentName: 'سارة محمد', code: 'STD-103',
            grades: { 'sub-1': 50, 'sub-2': 95 },
            midtermGrades: { 'sub-1': 25, 'sub-2': 48 },
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

    // Bulk Selection Logic
    const toggleSelectAll = () => {
        if (selectedStudentIds.length === mockStudents.length) {
            setSelectedStudentIds([]);
        } else {
            setSelectedStudentIds(mockStudents.map(s => s.studentId));
        }
    };

    const toggleSelectStudent = (id: string) => {
        if (selectedStudentIds.includes(id)) {
            setSelectedStudentIds(prev => prev.filter(sid => sid !== id));
        } else {
            setSelectedStudentIds(prev => [...prev, id]);
        }
    };

    const handleBulkPrint = () => {
        if (selectedStudentIds.length === 0) return;

        if (selectedStudentIds.length === 1) {
            // Single Print Preview
            const student = mockStudents.find(s => s.studentId === selectedStudentIds[0]);
            if (student) setPrintingStudent(student);
        } else {
            // Bulk Simulation
            alert(isRtl
                ? `جاري تجهيز ${selectedStudentIds.length} شهادة للطباعة... (سيتم تحميل ملف PDF مجمع)`
                : `Generating ${selectedStudentIds.length} certificates... (Consolidated PDF downloading)`
            );
        }
    };

    return (
        <div className="space-y-10 animate-view pb-20 relative">

            {/* Certificate Modal Overlay */}
            {printingStudent && (
                <CertificateTemplate
                    student={printingStudent}
                    subjects={mockSubjects}
                    term={activeTerm}
                    onClose={() => setPrintingStudent(null)}
                />
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 no-print">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <FileSpreadsheet className="text-emerald-600" /> {isRtl ? 'شيت الكنترول' : 'Control Sheet'}
                    </h2>
                    <p className="text-slate-500 font-bold mt-1 max-w-2xl">
                        {isRtl ? 'استعراض درجات الطلاب النهائية وقرار الترحيل.' : 'Review student grades and promotion status.'}
                    </p>
                </div>

                <div className="flex gap-3">
                    {/* Term Toggle */}
                    <div className="bg-slate-100 p-1 rounded-xl flex font-bold text-xs">
                        <button
                            onClick={() => setActiveTerm('midterm')}
                            className={`px-4 py-2 rounded-lg transition-all ${activeTerm === 'midterm' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
                        >
                            {isRtl ? 'نصف العام' : 'Midterm'}
                        </button>
                        <button
                            onClick={() => setActiveTerm('final')}
                            className={`px-4 py-2 rounded-lg transition-all ${activeTerm === 'final' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
                        >
                            {isRtl ? 'نهاية العام' : 'Final'}
                        </button>
                    </div>

                    <div className="w-px h-10 bg-slate-200 mx-2"></div>

                    <button
                        disabled={selectedStudentIds.length === 0}
                        onClick={handleBulkPrint}
                        className={`p-4 border border-slate-200 rounded-2xl shadow-sm transition-all flex items-center gap-2 font-black text-xs ${selectedStudentIds.length > 0 ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700' : 'bg-white text-slate-300'}`}
                    >
                        <Printer size={18} /> {isRtl ? 'طباعة الشهادات' : 'Print Certificates'}
                        {selectedStudentIds.length > 0 && <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">{selectedStudentIds.length}</span>}
                    </button>

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

            {/* Master Table */}
            <div className="overflow-x-auto rounded-[2.5rem] border border-slate-200 shadow-xl bg-white">
                <table className="w-full text-right min-w-[1000px]">
                    <thead className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
                        <tr>
                            <th className="p-6 w-16 text-center cursor-pointer hover:bg-white/10" onClick={toggleSelectAll}>
                                {selectedStudentIds.length === mockStudents.length && mockStudents.length > 0 ? <CheckSquare size={16} /> : <Square size={16} />}
                            </th>
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
                            {/* Columns shown only in FINAL term */}
                            {activeTerm === 'final' && (
                                <>
                                    <th className="p-6 text-center bg-indigo-900 border-l border-white/10">{isRtl ? 'المجموع' : 'Total'}</th>
                                    <th className="p-6 text-center bg-indigo-950 border-l border-white/10">{isRtl ? 'النتيجة' : 'Result'}</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-bold text-sm text-slate-700">
                        {mockStudents.map((student, idx) => {
                            const isSelected = selectedStudentIds.includes(student.studentId);
                            return (
                                <tr key={student.studentId} className={`transition-colors ${isSelected ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'hover:bg-slate-50'}`}>
                                    <td className="p-6 text-center text-slate-400 cursor-pointer" onClick={() => toggleSelectStudent(student.studentId)}>
                                        {isSelected ? <CheckSquare size={16} className="text-indigo-600" /> : <Square size={16} />}
                                    </td>
                                    <td className="p-6 text-center text-slate-400">{idx + 1}</td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black">{student.studentName.charAt(0)}</div>
                                            <div>
                                                <p className="text-slate-900">{student.studentName}</p>
                                                <p className="text-[10px] text-slate-400 font-black">{student.code}</p>
                                            </div>
                                            {activeTerm === 'final' && student.finalStatus === 'PASS' && student.totalScore > 140 && <Trophy size={14} className="text-amber-500" />}
                                        </div>
                                    </td>
                                    {mockSubjects.map(sub => {
                                        // Pick Midterm score if mode is midterm, else final grades
                                        const scoreMap = activeTerm === 'midterm' ? (student.midtermGrades || {}) : student.grades;
                                        const score = scoreMap[sub.id] || 0;
                                        const isFail = activeTerm === 'final' && score < sub.passScore; // Only flag fail in finals for now (or make midterm strict too)

                                        return (
                                            <td key={sub.id} className={`p-6 text-center border-l border-slate-50 tabular-nums ${isFail ? 'bg-rose-50/50 text-rose-600' : ''}`}>
                                                {score}
                                                {isFail && <span className="block text-[9px] text-rose-400 font-black uppercase">Fail</span>}
                                            </td>
                                        );
                                    })}
                                    {activeTerm === 'final' && (
                                        <>
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
                                        </>
                                    )}
                                </tr>
                            );
                        })}
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
