
import React, { useState } from 'react';
import {
   FileText, Search, Download, Filter, Printer,
   TrendingUp, Award, User, ChevronRight, Eye, RefreshCw,
   Edit3, Trash2, CheckCircle, ArrowUpRight, X, BookOpen, Check, AlertCircle, Star
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const ResultsModule: React.FC = () => {
   const { lang, t, systemLogo, systemName } = useAppContext();
   const isRtl = lang === 'ar';

   const [search, setSearch] = useState('');
   const [showEditScore, setShowEditScore] = useState<any>(null);
   const [viewingAnswers, setViewingAnswers] = useState<any>(null);

   const submissions = [
      {
         id: '1', student: isRtl ? 'ياسين محمود' : 'Yassin Mahmoud', exam: isRtl ? 'فيزياء ذرية' : 'Atomic Physics', score: 45, total: 50, date: '2024-03-22', code: 'STD-1002', answers: [
            { q: isRtl ? 'ما هو تعريف الذرة؟' : 'What is an atom?', studentAns: isRtl ? 'أصغر وحدة بناء للمادة' : 'Smallest unit of matter', correctAns: isRtl ? 'أصغر وحدة بناء للمادة' : 'Smallest unit of matter', isCorrect: true, points: 5 },
            { q: isRtl ? 'هل الضوء موجة كهرومغناطيسية؟' : 'Is light an EM wave?', studentAns: isRtl ? 'خطأ' : 'False', correctAns: isRtl ? 'صح' : 'True', isCorrect: false, points: 0 }
         ]
      },
      { id: '2', student: isRtl ? 'سارة محمد' : 'Sara Mohamed', exam: isRtl ? 'فيزياء ذرية' : 'Atomic Physics', score: 38, total: 50, date: '2024-03-22', code: 'STD-1005', answers: [] },
   ];

   return (
      <div className="space-y-10 animate-view pb-20">
         <div className="hidden print:block text-center border-b-4 border-black pb-8 mb-10">
            <img src={systemLogo} className="h-20 w-20 mx-auto mb-4" alt="logo" />
            <h1 className="text-3xl font-black">{systemName}</h1>
            <h2 className="text-xl font-bold mt-2">{isRtl ? 'كشف نتائج الطلاب التفصيلي' : 'Detailed Student Results Ledger'}</h2>
         </div>

         <div className="flex flex-col md:flex-row justify-between items-center gap-6 no-print">
            <div className="flex items-center gap-6">
               <div className="p-5 bg-emerald-600 text-white rounded-[2rem] shadow-xl"><FileText size={40} /></div>
               <div>
                  <h2 className="text-3xl font-black">{isRtl ? 'مركز النتائج والتقارير' : 'Results & Reports Center'}</h2>
                  <p className="text-slate-500 font-bold">{isRtl ? 'تحليل شامل لأداء الطلاب ومراجعة دقيقة لنتائج الاختبارات.' : 'Comprehensive analysis of student performance and detailed exam review.'}</p>
               </div>
            </div>
            <div className="flex gap-4">
               <button onClick={() => window.print()} className="p-4 bg-white border border-slate-200 rounded-2xl hover:text-emerald-600 transition-all shadow-sm"><Printer size={24} /></button>
               <button className="px-8 py-4 bg-slate-950 text-white rounded-2xl font-black text-xs flex items-center gap-3 shadow-xl">
                  <Download size={20} /> {isRtl ? 'تصدير التقارير' : 'Export Reports'}
               </button>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 no-print">
            <StatBox label={isRtl ? 'متوسط الدرجات' : 'AVG SCORE'} val="84%" icon={<TrendingUp size={24} />} color="text-emerald-600" bg="bg-emerald-50" />
            <StatBox label={isRtl ? 'نسبة النجاح' : 'PASS RATE'} val="92%" icon={<Award size={24} />} color="text-blue-600" bg="bg-blue-50" />
            <StatBox label={isRtl ? 'أعلى درجة' : 'TOP SCORE'} val="100/100" icon={<Star size={24} />} color="text-amber-500" bg="bg-amber-50" />
            <StatBox label={isRtl ? 'أوراق مصححة' : 'PAPERS GRADED'} val="1.2k" icon={<CheckCircle size={24} />} color="text-purple-600" bg="bg-purple-50" />
         </div>

         <div className="glass-card overflow-hidden">
            <div className="p-6 border-b flex flex-col md:flex-row items-center gap-4 bg-slate-50/30 no-print">
               <div className="flex-1 relative w-full">
                  <Search size={22} className={`absolute ${isRtl ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 text-slate-300`} />
                  <input
                     value={search}
                     onChange={e => setSearch(e.target.value)}
                     type="text"
                     placeholder={isRtl ? 'بحث بكود الطالب، اسم الطالب، أو الاختبار...' : 'Search by code, name, or exam...'}
                     className={`w-full p-5 ${isRtl ? 'pr-14' : 'pl-14'} bg-white border border-white rounded-[1.5rem] outline-none font-bold text-sm shadow-sm`}
                  />
               </div>
            </div>

            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full text-right min-w-[900px]">
                  <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b">
                     <tr>
                        <th className="p-8">كود الطالب</th>
                        <th className="p-8">اسم الطالب</th>
                        <th className="p-8">عنوان الاختبار</th>
                        <th className="p-8 text-center">الدرجة</th>
                        <th className="p-8 no-print text-center">الإجراءات</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-bold text-sm">
                     {submissions.map(sub => (
                        <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                           <td className="p-8"><code className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-black text-blue-600">{sub.code}</code></td>
                           <td className="p-8">{sub.student}</td>
                           <td className="p-8 text-slate-500">{sub.exam}</td>
                           <td className="p-8 text-center"><span className={`text-xl font-black tabular-nums ${sub.score / sub.total > 0.8 ? 'text-emerald-600' : 'text-amber-600'}`}>{sub.score} <span className="text-xs opacity-30">/ {sub.total}</span></span></td>
                           <td className="p-8 no-print">
                              <div className="flex justify-center gap-3">
                                 <button onClick={() => setViewingAnswers(sub)} title="عرض الإجابات" className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm flex items-center gap-2">
                                    <BookOpen size={18} /> <span className="text-[10px] font-black uppercase">إجابات الطالب</span>
                                 </button>
                                 <button onClick={() => setShowEditScore(sub)} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 transition-all"><Edit3 size={18} /></button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* مودال عرض إجابات الطالب التفصيلية */}
         {viewingAnswers && (
            <div className="fixed inset-0 z-[900] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6">
               <div className="glass-card w-full max-w-3xl bg-white animate-view flex flex-col max-h-[90vh]">
                  <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
                     <div>
                        <h3 className="text-2xl font-black">إجابات الطالب: {viewingAnswers.student}</h3>
                        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{viewingAnswers.exam}</p>
                     </div>
                     <button onClick={() => setViewingAnswers(null)} className="p-2 hover:bg-slate-100 rounded-full"><X /></button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
                     {viewingAnswers.answers.length > 0 ? viewingAnswers.answers.map((ans: any, idx: number) => (
                        <div key={idx} className={`p-6 rounded-[2rem] border-r-[10px] ${ans.isCorrect ? 'bg-emerald-50 border-emerald-500' : 'bg-rose-50 border-rose-500 shadow-sm'}`}>
                           <div className="flex justify-between items-start mb-4">
                              <p className="font-black text-lg text-slate-900">{idx + 1}. {ans.q}</p>
                              <span className={`px-4 py-1 rounded-xl text-[10px] font-black uppercase ${ans.isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                 {ans.isCorrect ? 'صحيحة' : 'خاطئة'}
                              </span>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 bg-white/60 rounded-2xl border">
                                 <p className="text-[10px] font-black text-slate-400 uppercase mb-1">إجابة الطالب</p>
                                 <p className={`font-bold ${ans.isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>{ans.studentAns}</p>
                              </div>
                              {!ans.isCorrect && (
                                 <div className="p-4 bg-white/60 rounded-2xl border">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">النموذجية</p>
                                    <p className="font-bold text-emerald-700">{ans.correctAns}</p>
                                 </div>
                              )}
                           </div>
                        </div>
                     )) : (
                        <div className="p-20 text-center flex flex-col items-center gap-4 text-slate-300">
                           <AlertCircle size={64} />
                           <p className="font-black text-xl">لا تتوفر تفاصيل إجابات لهذا الاختبار حالياً</p>
                        </div>
                     )}
                  </div>

                  <div className="p-6 border-t bg-slate-50 flex justify-between items-center">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">{viewingAnswers.score}</div>
                        <p className="font-black text-slate-900 uppercase text-xs">إجمالي نقاط الطالب</p>
                     </div>
                     <button onClick={() => setViewingAnswers(null)} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-lg">إغلاق المعاينة</button>
                  </div>
               </div>
            </div>
         )}

         {showEditScore && (
            <div className="fixed inset-0 z-[700] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6 no-print">
               <div className="glass-card w-full max-w-lg p-10 bg-white animate-view text-center space-y-8">
                  <div className="flex justify-between items-center border-b pb-4"><h3 className="text-xl font-black">تعديل درجة الطالب</h3><button onClick={() => setShowEditScore(null)}><X /></button></div>
                  <input type="number" defaultValue={showEditScore.score} className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-emerald-600 rounded-2xl outline-none font-black text-3xl text-center" />
                  <button onClick={() => setShowEditScore(null)} className="w-full py-5 bg-slate-950 text-white rounded-3xl font-black text-lg shadow-xl">حفظ التغييرات</button>
               </div>
            </div>
         )}
      </div>
   );
};

const StatBox = ({ label, val, icon, color, bg }: any) => (
   <div className="glass-card p-8 flex items-center justify-between group hover:border-slate-300 transition-all">
      <div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">{label}</p><p className={`text-3xl font-black ${color} tabular-nums`}>{val}</p></div>
      <div className={`p-4 ${bg} ${color} rounded-2xl group-hover:scale-110 transition-transform`}>{icon}</div>
   </div>
);

export default ResultsModule;
