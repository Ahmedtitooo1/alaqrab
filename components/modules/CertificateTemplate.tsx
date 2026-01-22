
import React from 'react';
import { useAppContext } from '../../context/AppContext';

interface CertificateProps {
    student: any;
    subjects: any[];
    term: 'midterm' | 'final';
    onClose?: () => void;
}

const CertificateTemplate: React.FC<CertificateProps> = ({ student, subjects, term, onClose }) => {
    const { lang, systemLogo, systemName } = useAppContext();
    const isRtl = lang === 'ar';

    const currentDate = new Date().toLocaleDateString(isRtl ? 'ar-EG' : 'en-US');
    const termLabel = term === 'midterm' ? (isRtl ? 'امتحانات منتصف العام' : 'Midterm Exams') : (isRtl ? 'امتحانات نهاية العام' : 'Final Exams');

    return (
        <div className="fixed inset-0 z-[1200] overflow-y-auto bg-slate-900/90 backdrop-blur-sm p-4 flex items-center justify-center print:p-0 print:absolute print:inset-0 print:bg-white print:z-[9999]">
            {/* Modal Controls (Hidden in Print) */}
            <div className="fixed top-4 right-4 flex gap-3 print:hidden z-[1300]">
                <button
                    onClick={() => window.print()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 shadow-lg"
                >
                    {isRtl ? 'طباعة الشهادة' : 'Print Certificate'}
                </button>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="bg-slate-700 text-white px-6 py-2 rounded-xl font-bold hover:bg-slate-800 shadow-lg"
                    >
                        {isRtl ? 'إغلاق' : 'Close'}
                    </button>
                )}
            </div>

            {/* A4 Paper Container */}
            <div className="bg-white w-[210mm] min-h-[297mm] p-[10mm] mx-auto shadow-2xl relative print:shadow-none print:mx-0 print:w-full">
                {/* Formal Header */}
                <div className="border-b-2 border-slate-900 pb-6 mb-8 flex justify-between items-center">
                    <div className="text-center w-1/4">
                        <p className="font-serif font-black text-sm uppercase">{isRtl ? 'وزارة التربية والتعليم' : 'Ministry of Education'}</p>
                        <p className="font-serif font-bold text-xs mt-1 text-slate-500">{isRtl ? 'الإدارة التعليمية' : 'Education Directorate'}</p>
                    </div>

                    <div className="w-1/2 text-center flex flex-col items-center">
                        <img src={systemLogo} className="h-24 w-24 object-contain mb-2" alt="Logo" />
                        <h1 className="text-2xl font-black uppercase tracking-tight">{systemName}</h1>
                        <p className="text-sm font-bold bg-slate-100 px-4 py-1 rounded-full mt-2 inline-block">
                            {isRtl ? 'شهادة بيان درجات الطالب' : 'Student Grade Report'}
                        </p>
                    </div>

                    <div className="text-center w-1/4">
                        <p className="text-xs font-bold text-slate-400">{isRtl ? 'تاريخ التحرير' : 'Date Issued'}</p>
                        <p className="font-mono font-bold text-sm">{currentDate}</p>
                    </div>
                </div>

                {/* Student Info Grid */}
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                            <span className="font-bold text-slate-500">{isRtl ? 'اسم الطالب' : 'Student Name'}</span>
                            <span className="font-black text-lg">{student.studentName}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                            <span className="font-bold text-slate-500">{isRtl ? 'الكود التعريفي' : 'Student ID'}</span>
                            <span className="font-mono font-black">{student.code}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                            <span className="font-bold text-slate-500">{isRtl ? 'الصف الدراسي' : 'Grade Level'}</span>
                            <span className="font-black">{isRtl ? 'الصف الأول الثانوي' : 'Grade 10'}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                            <span className="font-bold text-slate-500">{isRtl ? 'نوع الامتحان' : 'Exam Term'}</span>
                            <span className="font-black text-indigo-700 bg-indigo-50 px-2 rounded">{termLabel}</span>
                        </div>
                    </div>
                </div>

                {/* Grades Table */}
                <div className="mb-12">
                    <table className="w-full text-center border-collapse">
                        <thead className="bg-slate-900 text-white text-xs font-black uppercase tracking-widest">
                            <tr>
                                <th className="p-4 rounded-tl-lg border border-slate-800">{isRtl ? 'المادة الدراسية' : 'Subject'}</th>
                                <th className="p-4 border border-slate-800">{isRtl ? 'الدرجة العظمى' : 'Max Score'}</th>
                                <th className="p-4 border border-slate-800">{isRtl ? 'الدرجة الصغرى' : 'Pass Score'}</th>
                                <th className="p-4 bg-indigo-900 border border-slate-800 rounded-tr-lg">{isRtl ? 'درجة الطالب' : 'Student Score'}</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm border border-slate-200">
                            {subjects.map((sub, idx) => {
                                const score = student.grades[sub.id] || 0;
                                const isFail = score < sub.passScore;
                                return (
                                    <tr key={sub.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} print:bg-transparent`}>
                                        <td className="p-4 font-bold text-right border border-slate-200">{sub.name}</td>
                                        <td className="p-4 font-mono text-slate-500 border border-slate-200">{sub.maxScore}</td>
                                        <td className="p-4 font-mono text-slate-500 border border-slate-200">{sub.passScore}</td>
                                        <td className={`p-4 font-black text-lg border border-slate-200 ${isFail ? 'bg-red-50 text-red-600 print:text-black print:font-bold' : ''}`}>
                                            {score} <span className="text-[10px] uppercase ml-1 opacity-50">{isFail && (isRtl ? 'راسب' : 'FAIL')}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot className="bg-slate-100 border-t-2 border-slate-900">
                            <tr>
                                <td colSpan={3} className="p-4 font-black uppercase text-right">{isRtl ? 'المجموع الكلي' : 'Total Score'}</td>
                                <td className="p-4 font-black text-xl text-indigo-800">{student.totalScore}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Results Warning & Status */}
                <div className="mb-12 border-2 border-dashed border-slate-300 p-6 rounded-xl flex items-center gap-6">
                    <div className={`text-4xl font-black uppercase tracking-tighter ${student.finalStatus === 'PASS' ? 'text-emerald-600' : 'text-rose-600'} print:text-black`}>
                        {student.finalStatus === 'PASS' ? (isRtl ? 'ناجــــــــح' : 'PASSED') : (isRtl ? 'لـه دور ثان' : 'FAILED')}
                    </div>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed">
                        {isRtl
                            ? 'هذه الوثيقة رسمية ومعتمدة من إدارة المدرسة. أي كشط أو تعديل يلغي صحتها. في حالة الرسوب، يرجى مراجعة شؤون الطلاب لمعرفة مواعيد الدور الثاني.'
                            : 'This document is official. Any alteration invalidates it. In case of failure, please contact Student Aftairs for re-exam schedules.'}
                    </p>
                </div>

                {/* Footer Signatures */}
                <div className="flex justify-between mt-auto pt-12">
                    <div className="text-center w-64">
                        <p className="font-bold text-sm mb-12">{isRtl ? 'مسئول الكنترول' : 'Control Officer'}</p>
                        <div className="border-t border-slate-900 w-32 mx-auto"></div>
                    </div>

                    {/* Stamp Area */}
                    <div className="w-32 h-32 rounded-full border-4 border-double border-indigo-200 flex items-center justify-center -mt-8 opacity-50 print:opacity-100">
                        <div className="text-center rotate-[-12deg]">
                            <p className="text-[10px] font-black uppercase text-indigo-900">{isRtl ? 'خاتم المدرسة' : 'School Stamp'}</p>
                            <p className="text-[8px] font-bold text-indigo-400">Official Seal</p>
                        </div>
                    </div>

                    <div className="text-center w-64">
                        <p className="font-bold text-sm mb-12">{isRtl ? 'مدير المدرسة' : 'School Principal'}</p>
                        <div className="border-t border-slate-900 w-32 mx-auto"></div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CertificateTemplate;
