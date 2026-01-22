
import * as React from 'react';
import { useState, useEffect } from 'react';
import {
   Target, Clock, CheckCircle, Play, FileText, X, Check, Eye, Loader2, Sparkles, Trophy, Award, Calendar, History, BrainCircuit, AlertCircle, RefreshCw, Crosshair,
   ChevronLeft, ChevronRight, PlayCircle, ArrowRight, BookOpen, AlertTriangle, LayoutDashboard, DoorOpen
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { QuestionType, Question } from '../types';

const StudentExamModule: React.FC<{ mode?: 'hall' | 'results' }> = ({ mode = 'hall' }) => {
   const { lang, addNotification } = useAppContext();
   const [view, setView] = useState<'hall' | 'intro' | 'active' | 'result' | 'review'>(mode === 'results' ? 'result' : 'hall');
   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
   const [answers, setAnswers] = useState<Record<string, any>>({});
   const [timeLeft, setTimeLeft] = useState(0);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [finalScore, setFinalScore] = useState(0);
   const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
   const [selectedExamForReview, setSelectedExamForReview] = useState<any>(null);

   const [completedExamIds, setCompletedExamIds] = useState<string[]>(['exam-old-1']);
   const isRtl = lang === 'ar';

   const availableExams = [
      {
         id: 'ex1', title: 'مراجعة فيزياء - الباب الأول', time: 20, points: 20, questions: [
            { id: 'q1', type: QuestionType.SHORT_ESSAY, text: 'اشرح باختصار ظاهرة الانبعاث الكهروضوئي؟', points: 10, correctAnswer: 'انبعاث الإلكترونات من أسطح المعادن عند سقوط ضوء ذو تردد مناسب عليها.' },
            { id: 'q2', type: QuestionType.TRUE_FALSE, text: 'سرعة الضوء ثابتة في الفراغ.', points: 5, correctAnswer: 'true' },
            { id: 'q3', type: QuestionType.SINGLE_CHOICE, text: 'أي مما يلي لا يعتبر جسيماً أولياً؟', points: 5, options: [{ id: '1', text: 'الإلكترون' }, { id: '2', text: 'البروتون' }, { id: '3', text: 'الكوارك' }], correctAnswer: '2' }
         ]
      },
      { id: 'ex2', title: 'اختبار قوانين كيرشوف', time: 15, points: 10, questions: [] }
   ];

   const [resultsHistory, setResultsHistory] = useState<{
      id: string;
      title: string;
      score: number;
      total: number;
      date: string;
      status: string;
      questions: Question[];
      studentAnswers: Record<string, any>;
   }[]>([
      {
         id: 'exam-old-1',
         title: 'اختبار الميكانيكا الشامل',
         score: 48,
         total: 50,
         date: '2024-04-10',
         status: 'ممتاز',
         questions: [{ id: 'h1', text: 'قانون نيوتن الثاني ينص على أن F=ma', type: QuestionType.TRUE_FALSE, points: 50, correctAnswer: 'true' }],
         studentAnswers: { 'h1': 'true' }
      }
   ]);

   const startExam = (exam: any) => {
      setShuffledQuestions(exam.questions);
      setSelectedExamForReview(exam);
      setAnswers({});
      setCurrentQuestionIndex(0);
      setTimeLeft(exam.time * 60);
      setView('active');
   };

   const handleSubmit = async () => {
      setIsSubmitting(true);
      let score = 0;
      shuffledQuestions.forEach(q => {
         if (q.type === QuestionType.SHORT_ESSAY) {
            if (answers[q.id] && answers[q.id].length > 10) score += q.points;
         } else if (q.type === QuestionType.HOTSPOT) {
            const studentAns = answers[q.id];
            if (studentAns && q.correctX !== undefined && q.correctY !== undefined) {
               // Calculate Euclidean distance in percentage units for simplified grading
               const distance = Math.sqrt(
                  Math.pow(studentAns.x - q.correctX, 2) +
                  Math.pow(studentAns.y - q.correctY, 2)
               );
               // Convert tolerance radius (px) to a rough percentage or use a fixed % threshold
               // For now, let's treat toleranceRadius as percentage if we feel like it,
               // but the teacher UI sets it in px.
               // Let's assume a standard image width of 800px for conversion: 30px ~ 3.75%
               const tolerancePercent = (q.toleranceRadius || 30) / 8;
               if (distance <= tolerancePercent) score += q.points;
            }
         } else {
            if (answers[q.id] === q.correctAnswer) score += q.points;
         }
      });

      const newResult = {
         id: selectedExamForReview.id,
         title: selectedExamForReview.title,
         score: score,
         total: selectedExamForReview.points,
         date: new Date().toISOString().split('T')[0],
         status: score > selectedExamForReview.points * 0.8 ? 'ممتاز' : 'جيد',
         questions: shuffledQuestions,
         studentAnswers: answers
      };

      setResultsHistory([newResult, ...resultsHistory]);
      setCompletedExamIds([...completedExamIds, selectedExamForReview.id]);
      setFinalScore(score);
      setIsSubmitting(false);
      setView('result');
   };

   // شريط مسار لتحسين التنقل
   const Breadcrumbs = () => (
      <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-400 no-print mb-8">
         <div className="flex items-center gap-2 hover:text-indigo-600 cursor-pointer" onClick={() => setView('hall')}>
            <LayoutDashboard size={14} /> {isRtl ? 'قاعة الاختبارات' : 'Exam Hall'}
         </div>
         <ChevronRight size={14} className={isRtl ? 'rotate-180' : ''} />
         <span className="text-indigo-600">{view === 'active' ? (isRtl ? 'جاري الحل الآن' : 'Answering') : view === 'result' ? (isRtl ? 'النتيجة النهائية' : 'Results') : (isRtl ? 'قائمة الاختبارات' : 'Exams List')}</span>
      </div>
   );

   if (view === 'result') {
      return (
         <div className="max-w-4xl mx-auto py-10 animate-view">
            <Breadcrumbs />
            <div className="text-center space-y-10">
               <div className="w-40 h-40 bg-indigo-600 text-white rounded-[3.5rem] flex items-center justify-center mx-auto shadow-3xl animate-bounce">
                  <Trophy size={80} />
               </div>
               <div>
                  <h2 className="text-5xl font-black text-slate-900">انتهت الرحلة بنجاح!</h2>
                  <p className="text-slate-500 font-bold text-xl mt-4">درجتك النهائية في {selectedExamForReview?.title}:</p>
               </div>
               <div className="glass-panel p-10 bg-white inline-block rounded-[3rem] border shadow-xl">
                  <h4 className="text-8xl font-black text-indigo-700 tabular-nums">{finalScore} <span className="text-2xl text-slate-300">/ {selectedExamForReview?.points}</span></h4>
               </div>
               <div className="flex justify-center gap-6">
                  <button onClick={() => setView('hall')} className="px-12 py-5 bg-slate-950 text-white rounded-[2rem] font-black text-lg flex items-center gap-3"> <DoorOpen size={20} /> العودة للقاعة</button>
                  <button onClick={() => setView('review')} className="px-12 py-5 bg-white border-2 border-indigo-600 text-indigo-600 rounded-[2rem] font-black text-lg">مراجعة الإجابات</button>
               </div>
            </div>
         </div>
      );
   }

   if (view === 'review') {
      const currentReview = selectedExamForReview;
      return (
         <div className="max-w-5xl mx-auto py-10 space-y-10 animate-view">
            <Breadcrumbs />
            <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border shadow-sm">
               <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4"><BookOpen className="text-indigo-600" /> مراجعة: {currentReview?.title}</h2>
               <button onClick={() => setView('hall')} className="p-4 bg-slate-50 rounded-2xl"><X /></button>
            </div>
            <div className="space-y-6">
               {currentReview?.questions.map((q: any, idx: number) => {
                  const studentAns = currentReview.studentAnswers[q.id] || "لم يتم الإجابة";
                  const isCorrect = q.type !== QuestionType.SHORT_ESSAY ? studentAns === q.correctAnswer : true;
                  return (
                     <div key={q.id} className={`p-8 bg-white border-2 rounded-[2.5rem] relative overflow-hidden ${isCorrect ? 'border-emerald-100 shadow-sm' : 'border-rose-100 shadow-sm'}`}>
                        <div className={`absolute top-0 right-0 w-2 h-full ${isCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                        <div className="flex justify-between items-start mb-6">
                           <span className="font-black text-indigo-600 uppercase text-xs">سؤال رقم {idx + 1}</span>
                           <div className={`px-4 py-1 rounded-xl text-[10px] font-black uppercase ${isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                              {isCorrect ? 'إجابة صحيحة' : 'إجابة خاطئة'}
                           </div>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-6 leading-relaxed">{q.text}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="p-5 bg-slate-50 rounded-2xl border">
                              <p className="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">إجابتك</p>
                              {q.type === QuestionType.HOTSPOT ? (
                                 <div className="relative inline-block border-2 border-slate-200 rounded-xl overflow-hidden mt-2">
                                    <img src={q.image} className="max-h-40 w-auto opacity-60" />
                                    {studentAns && typeof studentAns === 'object' && (
                                       <div
                                          className="absolute -translate-x-1/2 -translate-y-1/2"
                                          style={{ left: `${studentAns.x}%`, top: `${studentAns.y}%` }}
                                       >
                                          <Crosshair className={isCorrect ? 'text-emerald-500' : 'text-rose-500'} size={20} />
                                       </div>
                                    )}
                                    <div
                                       className="absolute border-2 border-emerald-500 rounded-full bg-emerald-500/10 -translate-x-1/2 -translate-y-1/2"
                                       style={{
                                          left: `${q.correctX}%`,
                                          top: `${q.correctY}%`,
                                          width: `${((q.toleranceRadius || 30) / 8) * 2}%`,
                                          height: `${((q.toleranceRadius || 30) / 8) * 2}%`
                                       }}
                                    />
                                 </div>
                              ) : (
                                 <p className="font-bold text-slate-700">{studentAns === 'true' ? 'صح' : studentAns === 'false' ? 'خطأ' : studentAns}</p>
                              )}
                           </div>
                           {!isCorrect && q.type !== QuestionType.HOTSPOT && (
                              <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                                 <p className="text-[10px] font-black text-emerald-600 mb-1 uppercase tracking-widest">الإجابة النموذجية</p>
                                 <p className="font-bold text-emerald-700">{q.correctAnswer === 'true' ? 'صح' : q.correctAnswer}</p>
                              </div>
                           )}
                        </div>
                     </div>
                  );
               })}
            </div>
            <button onClick={() => setView('hall')} className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black text-xl shadow-2xl active:scale-95 transition-all">العودة للسجل</button>
         </div>
      );
   }

   if (view === 'active') {
      const q = shuffledQuestions[currentQuestionIndex];
      return (
         <div className="max-w-4xl mx-auto space-y-10 animate-view pb-24">
            <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-xl sticky top-0 z-50 border">
               <div className="flex items-center gap-4">
                  <span className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">{currentQuestionIndex + 1}</span>
                  <p className="text-slate-400 font-black text-xs uppercase tracking-widest">من {shuffledQuestions.length}</p>
               </div>
               <div className="px-8 py-4 bg-slate-950 text-white rounded-2xl font-black flex items-center gap-3 border-2 border-white/10">
                  <Clock size={22} className="text-rose-500 animate-pulse" />
                  <span className="tabular-nums font-mono text-xl">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
               </div>
            </div>

            <div className="glass-panel p-12 bg-white space-y-10 min-h-[500px] rounded-[3.5rem] shadow-2xl relative overflow-hidden border-none">
               <h3 className="text-4xl font-black leading-[1.4] text-slate-900">{q.text}</h3>
               <div className="pt-10">
                  {q.type === QuestionType.TRUE_FALSE && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {['true', 'false'].map(v => (
                           <button key={v} onClick={() => setAnswers({ ...answers, [q.id]: v })} className={`py-16 rounded-[2.5rem] border-4 font-black text-3xl transition-all shadow-sm ${answers[q.id] === v ? 'bg-indigo-600 border-indigo-600 text-white shadow-3xl scale-[1.03]' : 'bg-slate-50 border-transparent hover:bg-white hover:border-indigo-200 text-slate-400'}`}>
                              {v === 'true' ? 'صواب' : 'خطأ'}
                           </button>
                        ))}
                     </div>
                  )}
                  {q.type === QuestionType.SINGLE_CHOICE && (
                     <div className="grid grid-cols-1 gap-6">
                        {q.options?.map(opt => (
                           <button key={opt.id} onClick={() => setAnswers({ ...answers, [q.id]: opt.id })} className={`p-8 rounded-3xl border-4 text-right font-black text-xl transition-all flex items-center justify-between ${answers[q.id] === opt.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl' : 'bg-slate-50 border-transparent hover:bg-white hover:border-indigo-100 text-slate-500'}`}>
                              <span>{opt.text}</span>
                              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${answers[q.id] === opt.id ? 'bg-white text-indigo-600 border-white' : 'border-slate-300'}`}>{answers[q.id] === opt.id && <Check size={20} strokeWidth={4} />}</div>
                           </button>
                        ))}
                     </div>
                  )}
                  {q.type === QuestionType.HOTSPOT && q.image && (
                     <div className="space-y-4">
                        <p className="text-sm font-bold text-slate-500">انقر على الإجابة الصحيحة في الصورة أدناه:</p>
                        <div className="relative inline-block border-4 border-slate-100 rounded-[2rem] overflow-hidden cursor-crosshair shadow-lg">
                           <img
                              src={q.image}
                              className="max-h-[500px] w-auto block select-none"
                              onClick={(e) => {
                                 const rect = (e.target as HTMLImageElement).getBoundingClientRect();
                                 const x = ((e.clientX - rect.left) / rect.width) * 100;
                                 const y = ((e.clientY - rect.top) / rect.height) * 100;
                                 setAnswers({ ...answers, [q.id]: { x: Math.round(x), y: Math.round(y) } });
                              }}
                           />
                           {answers[q.id] && (
                              <div
                                 className="absolute pointer-events-none flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
                                 style={{
                                    left: `${answers[q.id].x}%`,
                                    top: `${answers[q.id].y}%`,
                                 }}
                              >
                                 <div className="w-8 h-8 bg-indigo-600/40 border-2 border-indigo-600 rounded-full animate-ping absolute" />
                                 <Crosshair className="text-indigo-600 bg-white rounded-full p-0.5 shadow-md" size={24} />
                              </div>
                           )}
                        </div>
                     </div>
                  )}
               </div>
            </div>

            <div className="flex justify-between items-center px-4">
               <button disabled={currentQuestionIndex === 0} onClick={() => setCurrentQuestionIndex(prev => prev - 1)} className="px-12 py-6 bg-white border-2 border-slate-100 text-slate-300 rounded-3xl font-black hover:text-slate-900 hover:border-indigo-600 transition-all disabled:opacity-20">السابق</button>
               {currentQuestionIndex < shuffledQuestions.length - 1 ? (
                  <button onClick={() => setCurrentQuestionIndex(prev => prev + 1)} className="px-16 py-6 bg-slate-950 text-white rounded-[2rem] font-black text-lg shadow-2xl hover:bg-indigo-600 transition-all flex items-center gap-4">
                     التالي <ArrowRight size={24} className={isRtl ? 'rotate-180' : ''} />
                  </button>
               ) : (
                  <button onClick={handleSubmit} disabled={isSubmitting} className="px-20 py-6 bg-emerald-600 text-white rounded-[2rem] font-black text-xl shadow-3xl hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-4">
                     {isSubmitting ? <Loader2 className="animate-spin" /> : <Sparkles />} إنهاء وتسليم الإجابات
                  </button>
               )}
            </div>
         </div>
      );
   }

   if (view === 'hall') {
      const visibleExams = availableExams.filter(ex => !completedExamIds.includes(ex.id));
      return (
         <div className="max-w-5xl mx-auto py-10 space-y-12 animate-view">
            <Breadcrumbs />
            <div className="flex items-center gap-6">
               <div className="p-5 bg-indigo-600 text-white rounded-[2rem] shadow-xl"><PlayCircle size={40} /></div>
               <h2 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">Current Exams</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               {visibleExams.map(ex => (
                  <div key={ex.id} className="glass-panel p-12 bg-white border-r-[12px] border-indigo-600 shadow-2xl space-y-8 group hover:scale-[1.02] transition-all relative overflow-hidden">
                     <div className="p-5 bg-indigo-50 text-indigo-600 rounded-[1.75rem] w-fit shadow-inner"><Target size={40} /></div>
                     <h3 className="text-3xl font-black text-slate-900">{ex.title}</h3>
                     <p className="text-sm text-slate-400 font-bold mt-2 uppercase tracking-widest">{ex.questions.length} أسئلة • {ex.time} دقيقة</p>
                     <button onClick={() => startExam(ex)} className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-4"><Play size={24} /> دخول القاعة</button>
                  </div>
               ))}
            </div>
         </div>
      );
   }

   return (
      <div className="max-w-5xl mx-auto py-10 space-y-12 animate-view">
         <Breadcrumbs />
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
               <div className="p-5 bg-amber-500 text-white rounded-[2rem] shadow-xl"><Award size={40} /></div>
               <h2 className="text-4xl font-black text-slate-900 tracking-tight italic">RESULTS ARCHIVE</h2>
            </div>
         </div>
         <div className="grid grid-cols-1 gap-6">
            {resultsHistory.map(res => (
               <div key={res.id} className="glass-panel p-8 bg-white border border-slate-100 flex flex-col md:flex-row items-center justify-between hover:border-indigo-600 transition-all rounded-[2.5rem] shadow-sm group gap-8">
                  <div className="flex items-center gap-8 flex-1">
                     <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 transition-all shadow-inner"><FileText size={32} /></div>
                     <div><h4 className="text-2xl font-black text-slate-900">{res.title}</h4><p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">{res.date}</p></div>
                  </div>
                  <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end">
                     <div className="text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</p>
                        <p className="text-4xl font-black text-indigo-700 tabular-nums">{res.score}<span className="text-lg text-slate-300">/{res.total}</span></p>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

export default StudentExamModule;
