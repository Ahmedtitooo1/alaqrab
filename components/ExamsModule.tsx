
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
   Plus, Save, Clock, Trash2, Sparkles, Image as ImageIcon, Check, Search, X, Award,
   RotateCcw, Target, ImagePlus, Crosshair, Users, CheckSquare, Loader2, Camera, Info, Eye, RefreshCw, Printer, Download, MapPin, FileText,
   UserCheck, AlertCircle, CheckCircle, Upload, FileType, PlusCircle, BrainCircuit, ListChecks, Send, ArrowRight, Archive, BarChart3, MousePointer2,
   Calendar, Hash, UserCircle, FileSpreadsheet
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { QuestionType, Question, UserRole } from '../types';
import { generateSmartExam, analyzeExamPaper } from '../services/geminiService';
import * as XLSX from 'xlsx';

interface ExamsModuleProps {
   mode: 'list' | 'create' | 'ai_create' | 'ai_corrector';
}

const ExamsModule: React.FC<ExamsModuleProps> = ({ mode }) => {
   const { lang, addNotification, systemName, systemLogo, user } = useAppContext();
   const isRtl = lang === 'ar';

   const [view, setView] = useState<'hub' | 'editor' | 'ai' | 'ocr'>(
      mode === 'list' ? 'hub' : mode === 'create' ? 'editor' : mode === 'ai_create' ? 'ai' : 'ocr'
   );

   const [examTitle, setExamTitle] = useState('');
   const [examDuration, setExamDuration] = useState(30);
   const [questions, setQuestions] = useState<Question[]>([]);
   const [isGenerating, setIsGenerating] = useState(false);
   const [aiPrompt, setAiPrompt] = useState('');
   const [archivedExams, setArchivedExams] = useState<string[]>([]);

   // OCR States
   const [isAnalyzing, setIsAnalyzing] = useState(false);
   const [ocrResult, setOcrResult] = useState<any>(null);
   const [capturedImage, setCapturedImage] = useState<string | null>(null);

   const fileInputRef = useRef<HTMLInputElement>(null);
   const ocrFileInputRef = useRef<HTMLInputElement>(null);

   const [examsList, setExamsList] = useState([
      { id: 'ex-101', title: 'اختبار شهر أكتوبر - ميكانيكا', date: '2024-10-15', students: 145, avgScore: 82, status: 'active' },
      { id: 'ex-102', title: 'مراجعة الفيزياء الكهربية', date: '2024-11-02', students: 98, avgScore: 75, status: 'active' }
   ]);

   const handleAiGenerate = async () => {
      if (!aiPrompt.trim()) return alert("يرجى إدخال وصف للاختبار");
      setIsGenerating(true);
      try {
         const result = await generateSmartExam(aiPrompt);
         setExamTitle(result.title);
         setQuestions(result.questions);
         addNotification({ title: 'تم توليد الاختبار', content: 'قام الـ AI ببناء الاختبار بناءً على وصفك.', type: 'success', date: new Date().toISOString() });
      } catch (err) {
         console.error(err);
         alert("عذراً، واجه المحرك الذكي مشكلة في توليد الأسئلة حالياً.");
      } finally {
         setIsGenerating(false);
      }
   };

   const handleOCRAnalysis = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = async () => {
         const base64 = reader.result as string;
         setCapturedImage(base64);
         setIsAnalyzing(true);
         try {
            const result = await analyzeExamPaper(base64);
            setOcrResult(result);
            addNotification({ title: 'تم التصحيح', content: `تم التعرف على الطالب: ${result.detectedStudentName}`, type: 'success', date: new Date().toISOString() });
         } catch (err) {
            alert("فشل تحليل الورقة. تأكد من جودة الصورة.");
         } finally {
            setIsAnalyzing(false);
         }
      };
      reader.readAsDataURL(file);
   };

   const exportToExcel = (data: any[], fileName: string) => {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, `${fileName}.xlsx`);
   };

   const handleExportQuestions = () => {
      if (questions.length === 0) return alert("لا يوجد أسئلة لتصديرها");
      const data = questions.map((q, i) => ({
         '#': i + 1,
         'السؤال': q.text,
         'النوع': q.type,
         'الدرجة': q.points,
         'الإجابة الصحيحة': q.correctAnswer || ''
      }));
      exportToExcel(data, examTitle || 'اختبار_جديد');
   };


   const resetExamForStudent = (examId: string, studentId: string) => {
      // Mock reset logic
      addNotification({
         title: 'تم تصفير المحاولة',
         content: `تم إعادة ضبط المحاولة للطالب بنجاح. يمكنه الآن أداؤه مرة أخرى.`,
         type: 'success',
         date: new Date().toISOString()
      });
   };

   const PrintExamTemplate = () => (
      <div className="hidden print:block bg-white p-2 min-h-screen text-right font-serif" dir="rtl">
         <div className="border-[6px] border-double border-indigo-900 p-10 relative min-h-[1050px] flex flex-col">
            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
               <img src={systemLogo} className="w-[500px] h-[500px] object-contain grayscale" />
            </div>

            {/* Header Section */}
            <div className="flex justify-between items-start border-b-[3px] border-indigo-900 pb-8 mb-10 relative z-10">
               <div className="space-y-3">
                  <h2 className="text-3xl font-black text-indigo-900">{systemName}</h2>
                  <div className="h-1 w-20 bg-indigo-900"></div>
                  <p className="font-bold text-lg">المادة: <span className="border-b border-dotted border-black px-4">فيزياء</span></p>
                  <p className="font-bold text-lg">المعلم: <span className="border-b border-dotted border-black px-4">{user?.firstName} {user?.lastName}</span></p>
               </div>

               <div className="text-center">
                  <img src={systemLogo} className="h-24 w-24 mx-auto mb-4 object-contain shadow-sm p-2 bg-white rounded-2xl" />
                  <h1 className="text-4xl font-black underline decoration-double underline-offset-8 text-slate-900">ورقة التحصيل الرسمية</h1>
                  <p className="text-[10px] mt-4 font-black uppercase text-slate-400 tracking-[0.3em]">Official Examination Record</p>
               </div>

               <div className="text-left space-y-2 rtl:text-right">
                  <p className="font-bold">التاريخ: <span className="font-mono">{new Date().toLocaleDateString('ar-EG')}</span></p>
                  <p className="font-bold">الزمن: <span className="font-mono">{examDuration}</span> دقيقة</p>
                  <div className="mt-4 p-4 border-2 border-indigo-900 bg-slate-50 rounded-lg text-center">
                     <p className="text-xs font-black mb-1">الدرجة الكلية</p>
                     <p className="text-3xl font-black border-slate-300">{questions.reduce((a, b) => a + b.points, 0)}</p>
                  </div>
               </div>
            </div>

            {/* Student Identification - Professional Layout */}
            <div className="grid grid-cols-2 gap-8 border-2 border-indigo-900 p-6 mb-12 bg-slate-50/50 rounded-2xl relative z-10">
               <div className="flex gap-4 items-center">
                  <span className="font-black whitespace-nowrap">اسم الطالب:</span>
                  <div className="flex-1 border-b-2 border-dotted border-indigo-200 h-8"></div>
               </div>
               <div className="flex gap-4 items-center">
                  <span className="font-black whitespace-nowrap">رقم الجلوس:</span>
                  <div className="flex-1 border-b-2 border-dotted border-indigo-200 h-8"></div>
               </div>
            </div>

            {/* Exam Title with Decorative Badges */}
            <div className="text-center mb-16 relative z-10">
               <div className="inline-block relative">
                  <div className="absolute inset-0 bg-indigo-900 blur-lg opacity-20 transform -rotate-1"></div>
                  <h3 className="text-3xl font-black bg-indigo-900 text-white px-16 py-4 rounded-full relative z-10 shadow-xl border-4 border-white">
                     {examTitle || 'اختبار تقييم المستوى'}
                  </h3>
               </div>
            </div>

            {/* Examination Content */}
            <div className="space-y-12 flex-1 relative z-10">
               {questions.map((q, idx) => (
                  <div key={idx} className="space-y-6 break-inside-avoid">
                     <div className="flex justify-between items-center gap-6">
                        <div className="flex items-center gap-4 flex-1">
                           <div className="w-10 h-10 bg-indigo-900 text-white rounded-lg flex items-center justify-center font-black text-xl shrink-0">{idx + 1}</div>
                           <h4 className="text-xl font-black leading-relaxed">{q.text}</h4>
                        </div>
                        <div className="px-3 py-1 border-2 border-indigo-900 rounded font-black text-xs whitespace-nowrap">({q.points} درجة)</div>
                     </div>

                     <div className="pr-14">
                        {q.type === QuestionType.SINGLE_CHOICE && (
                           <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                              {q.options?.map((opt, oIdx) => (
                                 <div key={oIdx} className="flex items-center gap-4">
                                    <div className="w-6 h-6 border-2 border-indigo-900 rounded-full shrink-0"></div>
                                    <span className="font-bold text-lg">{opt.text}</span>
                                 </div>
                              ))}
                           </div>
                        )}

                        {q.type === QuestionType.TRUE_FALSE && (
                           <div className="flex gap-16 font-black text-xl">
                              <div className="flex gap-3 items-center"><div className="w-7 h-7 border-[3px] border-indigo-900 rounded"></div> صواب ( )</div>
                              <div className="flex gap-3 items-center"><div className="w-7 h-7 border-[3px] border-indigo-900 rounded"></div> خطأ ( )</div>
                           </div>
                        )}

                        {q.type === QuestionType.SHORT_ESSAY && (
                           <div className="space-y-3 mt-4">
                              <div className="h-px bg-slate-300 w-full mb-3 border-b-2 border-dotted border-indigo-100"></div>
                              <div className="h-px bg-slate-300 w-full mb-3 border-b-2 border-dotted border-indigo-100"></div>
                              <div className="h-px bg-slate-300 w-full mb-3 border-b-2 border-dotted border-indigo-100"></div>
                           </div>
                        )}

                        {q.type === QuestionType.IMAGE_CHOICE && q.image && (
                           <div className="mt-4">
                              <img src={q.image} className="max-h-72 border-2 border-indigo-900 rounded-xl mx-auto shadow-md" />
                              <p className="text-center text-xs mt-3 font-black text-indigo-600 italic">قم بالتأشير بوضوح على الرسم أعلاه</p>
                           </div>
                        )}
                     </div>
                  </div>
               ))}
            </div>

            {/* Legal / Verification Footer */}
            <div className="mt-16 pt-8 border-t-[3px] border-indigo-900 flex justify-between items-center relative z-10">
               <div className="space-y-2">
                  <p className="text-xs font-black text-indigo-900 italic">توقيع المدرس: ...........................................</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Scorpion Smart Systems • AI Integrated Education</p>
               </div>

               <div className="text-center opacity-40 grayscale h-16 w-16">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=exam-${Date.now()}`} className="h-full w-full object-contain" />
               </div>

               <div className="text-left rtl:text-right font-black text-xs text-indigo-900 space-y-1">
                  <p>تم سحب هذه النسخة آلياً</p>
                  <p>تمنياتنا لجميع الطلاب بالنجاح</p>
               </div>
            </div>
         </div>
      </div>
   );


   if (view === 'hub') {
      return (
         <div className="space-y-10 animate-view">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border shadow-sm no-print">
               <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-right">
                  <div className="p-4 md:p-5 bg-indigo-600 text-white rounded-2xl md:rounded-[1.75rem] shadow-xl"><FileText size={isRtl ? 32 : 40} /></div>
                  <div>
                     <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">EXAMS REPOSITORY</h2>
                     <p className="text-slate-500 font-bold uppercase text-[10px] md:text-xs tracking-widest mt-1">إدارة الاختبارات المنشورة، مراقبة التفاعل، والأرشفة</p>
                  </div>
               </div>
               <div className="flex flex-wrap justify-center gap-3 w-full md:w-auto">
                  <button onClick={() => setView('ai')} className="flex-1 md:flex-none px-6 md:px-8 py-4 md:py-5 bg-orange-500 text-white rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs flex items-center justify-center gap-3 shadow-lg hover:scale-105 transition-all"><Sparkles size={18} /> AI Builder</button>
                  <button onClick={() => { setQuestions([]); setExamTitle(''); setView('editor'); }} className="flex-1 md:flex-none px-6 md:px-8 py-4 md:py-5 bg-slate-950 text-white rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs flex items-center justify-center gap-3 shadow-lg hover:scale-105 transition-all"><Plus size={18} /> اختبار يدوي</button>
               </div>
            </div>

            <div className="grid grid-cols-1 gap-8 no-print">
               {examsList.filter(ex => !archivedExams.includes(ex.id)).map(ex => (
                  <div key={ex.id} className="glass-panel p-10 bg-white border border-slate-100 rounded-[3rem] space-y-8 group hover:border-indigo-600 transition-all shadow-sm">
                     <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 flex-1 w-full text-center sm:text-right">
                           <div className="w-16 h-16 bg-slate-50 text-indigo-600 rounded-2xl flex items-center justify-center border shadow-inner shrink-0"><Target size={32} /></div>
                           <div className="flex-1">
                              <h3 className="text-xl md:text-2xl font-black text-slate-900 line-clamp-2">{ex.title}</h3>
                              <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{ex.date} • {ex.id}</p>
                           </div>
                        </div>
                        <div className="flex flex-wrap gap-10 flex-1 justify-center py-6 lg:py-0 w-full">
                           <div className="text-center">
                              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">المختبرين</p>
                              <p className="text-xl font-black text-slate-900 flex items-center gap-2 justify-center"><Users size={16} /> {ex.students}</p>
                           </div>
                           <div className="text-center">
                              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">متوسط الدرجات</p>
                              <p className="text-xl font-black text-emerald-600 flex items-center gap-2 justify-center"><BarChart3 size={16} /> {ex.avgScore}%</p>
                           </div>
                        </div>
                        <div className="flex gap-3 w-full lg:w-auto">
                           <button className="flex-1 lg:flex-none px-6 py-3 bg-slate-50 text-slate-400 rounded-xl font-black text-[10px] uppercase hover:bg-indigo-600 hover:text-white transition-all">Preview</button>
                           <button onClick={() => window.print()} className="p-3 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-900 hover:text-white transition-all"><Printer size={18} /></button>
                           <button onClick={() => setArchivedExams([...archivedExams, ex.id])} className="p-3 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><Archive size={18} /></button>
                        </div>
                     </div>

                     <div className="pt-8 border-t border-slate-50">
                        <h4 className="text-sm font-black text-slate-400 mb-6 flex items-center gap-2">آخر المختبرين وتفاصيل الأداء <Info size={14} /></h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           {[
                              { name: 'أحمد محمد', score: 95, time: '12 د', id: 's1' },
                              { name: 'سارة خالد', score: 88, time: '15 د', id: 's2' },
                              { name: 'ياسين علي', score: 65, time: '28 د', id: 's3' }
                           ].map(student => (
                              <div key={student.id} className="p-5 bg-slate-50 rounded-2xl flex items-center justify-between hover:bg-white border border-transparent hover:border-indigo-100 transition-all">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-xs">{student.name[0]}</div>
                                    <div>
                                       <p className="font-bold text-sm text-slate-900">{student.name}</p>
                                       <p className="text-[10px] text-slate-400 font-bold">{student.time}</p>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-4">
                                    <span className={`text-sm font-black ${student.score >= 50 ? 'text-emerald-600' : 'text-rose-600'}`}>{student.score}%</span>
                                    <button onClick={() => resetExamForStudent(ex.id, student.id)} className="p-2 text-slate-300 hover:text-indigo-600 transition-all" title="إعادة الاختبار"><RotateCcw size={16} /></button>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      );
   }

   // محرر الاختبار
   if (view === 'editor') {
      return (
         <div className="max-w-5xl mx-auto py-12 space-y-12 animate-view pb-24 text-right">
            <PrintExamTemplate />

            <div className="glass-card p-6 md:p-10 bg-white border-t-4 md:border-t-8 border-indigo-600 flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl rounded-[2rem] md:rounded-[3rem] no-print">
               <div className="flex-1 space-y-4 w-full">
                  <input value={examTitle} onChange={e => setExamTitle(e.target.value)} placeholder="ضع عنوان الاختبار هنا..." className="text-2xl md:text-4xl font-black w-full border-none outline-none bg-transparent text-slate-900 md:text-right text-center" />
                  <div className="flex items-center gap-4 md:gap-6 text-slate-400 font-bold text-[10px] md:text-xs justify-center md:justify-end">
                     <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg"><Clock size={16} className="text-indigo-600" /> مدة الاختبار: <input type="number" value={examDuration} onChange={e => setExamDuration(parseInt(e.target.value))} className="w-12 bg-transparent border-none p-0 text-center font-black" /> دقيقة</div>
                  </div>
               </div>
               <div className="flex flex-wrap justify-center gap-3 w-full md:w-auto">
                  <button onClick={() => window.print()} className="p-4 md:p-5 bg-white border border-slate-200 text-slate-400 rounded-2xl md:rounded-3xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"><Printer size={24} /></button>
                  <button onClick={() => setView('hub')} className="flex-1 md:flex-none px-6 md:px-12 py-4 md:py-5 bg-slate-950 text-white rounded-2xl md:rounded-3xl font-black text-sm md:text-lg shadow-xl flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all">
                     <Save size={20} md:size={24} /> حفظ ونشر
                  </button>
                  <button onClick={handleExportQuestions} className="p-4 md:p-5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl md:rounded-3xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                     <FileSpreadsheet size={24} />
                  </button>
               </div>
            </div>


            <div className="space-y-8 no-print">
               {questions.map((q, idx) => (
                  <div key={q.id} className="glass-card p-10 bg-white border-2 border-transparent hover:border-indigo-100 transition-all relative group rounded-[3rem] shadow-sm">
                     <button onClick={() => setQuestions(questions.filter(item => item.id !== q.id))} className="absolute top-8 left-8 p-3 text-slate-200 hover:text-rose-600 transition-all"><Trash2 size={24} /></button>
                     <div className="flex items-start gap-8 flex-row-reverse">
                        <div className="w-14 h-14 bg-slate-950 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg">{idx + 1}</div>
                        <div className="flex-1 space-y-8 text-right">
                           <textarea value={q.text} onChange={e => { const nq = [...questions]; nq[idx].text = e.target.value; setQuestions(nq); }} placeholder="اكتب نص السؤال هنا..." className="w-full p-6 bg-slate-50 border rounded-2xl font-bold text-xl min-h-[100px] outline-none text-right" />

                           {q.type === QuestionType.SINGLE_CHOICE && (
                              <div className="space-y-4">
                                 <p className="text-xs font-black text-indigo-600 mb-2">الخيارات (ضع علامة على الإجابة الصحيحة):</p>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {q.options?.map((opt, oIdx) => (
                                       <div key={oIdx} className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border-2 border-transparent hover:border-indigo-200">
                                          <input type="radio" name={`correct-${q.id}`} checked={q.correctAnswer === opt.text} onChange={() => {
                                             const nq = [...questions];
                                             nq[idx].correctAnswer = opt.text;
                                             setQuestions(nq);
                                          }} className="w-5 h-5" />
                                          <input value={opt.text} onChange={e => {
                                             const nq = [...questions];
                                             nq[idx].options![oIdx].text = e.target.value;
                                             setQuestions(nq);
                                          }} className="flex-1 bg-transparent border-none outline-none font-bold" />
                                       </div>
                                    ))}
                                    <button onClick={() => {
                                       const nq = [...questions];
                                       nq[idx].options!.push({ id: Date.now().toString(), text: 'خيار جديد' });
                                       setQuestions(nq);
                                    }} className="p-4 border-2 border-dashed rounded-xl text-slate-400 font-bold text-xs hover:border-indigo-600 hover:text-indigo-600 transition-all">+ إضافة خيار</button>
                                 </div>
                              </div>
                           )}

                           {q.type === QuestionType.IMAGE_CHOICE && (
                              <div className="space-y-4">
                                 <div className="h-60 bg-slate-100 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-slate-400 transition-all hover:bg-slate-200 cursor-pointer overflow-hidden relative">
                                    {q.image ? <img src={q.image} className="w-full h-full object-contain" /> : <><ImageIcon size={40} /><span className="font-black mt-2 text-xs">ارفع صورة السؤال</span></>}
                                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                                       const file = e.target.files?.[0];
                                       if (file) {
                                          const r = new FileReader();
                                          r.onload = () => {
                                             const nq = [...questions];
                                             nq[idx].image = r.result as string;
                                             setQuestions(nq);
                                          };
                                          r.readAsDataURL(file);
                                       }
                                    }} />
                                 </div>
                              </div>
                           )}

                           <div className="flex items-center gap-6 pt-6 border-t flex-row-reverse">
                              <div className="flex items-center gap-4 px-6 py-4 bg-indigo-50 text-indigo-700 rounded-2xl">
                                 <Award size={20} /> <span className="text-xs font-black uppercase">الدرجة:</span>
                                 <input type="number" value={q.points} onChange={e => { const nq = [...questions]; nq[idx].points = parseInt(e.target.value) || 1; setQuestions(nq); }} className="w-16 bg-transparent text-center font-black text-xl outline-none tabular-nums" />
                              </div>
                              <span className="text-xs font-black text-slate-400">نوع السؤال: {q.type}</span>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}

               <div className="flex flex-wrap gap-4 justify-center py-20 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-200 shadow-inner">
                  <button onClick={() => setQuestions([...questions, { id: Date.now().toString(), type: QuestionType.SINGLE_CHOICE, text: '', points: 5, options: [{ id: '1', text: 'خيار 1' }, { id: '2', text: 'خيار 2' }], correctAnswer: 'خيار 1' } as any])} className="px-10 py-5 bg-white border shadow-sm rounded-3xl font-black text-xs flex items-center gap-3 hover:border-indigo-600 transition-all"><CheckSquare size={18} /> خيارات متعددة</button>
                  <button onClick={() => setQuestions([...questions, { id: Date.now().toString(), type: QuestionType.TRUE_FALSE, text: '', points: 5, correctAnswer: 'صح' } as any])} className="px-10 py-5 bg-white border shadow-sm rounded-3xl font-black text-xs flex items-center gap-3 hover:border-indigo-600 transition-all"><CheckCircle size={18} /> صح أو خطأ</button>
                  <button onClick={() => setQuestions([...questions, { id: Date.now().toString(), type: QuestionType.SHORT_ESSAY, text: '', points: 10 } as any])} className="px-10 py-5 bg-white border shadow-sm rounded-3xl font-black text-xs flex items-center gap-3 hover:border-indigo-600 transition-all"><FileText size={18} /> سؤال مقالي</button>
                  <button onClick={() => setQuestions([...questions, { id: Date.now().toString(), type: QuestionType.IMAGE_CHOICE, text: '', points: 10, image: '' } as any])} className="px-10 py-5 bg-white border shadow-sm rounded-3xl font-black text-xs flex items-center gap-3 hover:border-indigo-600 transition-all"><ImageIcon size={18} /> اختيار على صورة</button>
               </div>
            </div>
         </div>
      );
   }

   if (view === 'ai') {
      return (
         <div className="max-w-4xl mx-auto py-12 space-y-12 animate-view text-right">
            <div className="glass-panel p-12 bg-white rounded-[4rem] shadow-2xl space-y-10 border-t-[12px] border-orange-500">
               <div className="flex items-center gap-6 flex-row-reverse">
                  <div className="p-6 bg-orange-100 text-orange-600 rounded-[2rem] animate-pulse"><Sparkles size={48} /></div>
                  <div>
                     <h2 className="text-4xl font-black">المصمم الذكي (AI Exam Builder)</h2>
                     <p className="text-slate-500 font-bold text-lg mt-2">اشرح موضوع الاختبار للـ AI وسيقوم هو بالباقي!</p>
                  </div>
               </div>
               <div className="space-y-4">
                  <textarea
                     value={aiPrompt}
                     onChange={e => setAiPrompt(e.target.value)}
                     placeholder="مثال: قم بإنشاء اختبار فيزياء لطلاب الصف الثالث الثانوي عن قوانين نيوتن، أريد 5 أسئلة خيارات و2 مقالي..."
                     className="w-full p-10 bg-slate-50 rounded-[2.5rem] font-bold text-xl min-h-[250px] outline-none border-2 border-transparent focus:border-orange-200 focus:bg-white transition-all text-right"
                  />
                  <button
                     onClick={handleAiGenerate}
                     disabled={isGenerating}
                     className="w-full py-8 bg-slate-950 text-white rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-orange-500/20 hover:bg-orange-600 transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
                  >
                     {isGenerating ? <Loader2 size={32} className="animate-spin" /> : <BrainCircuit size={32} />} {isGenerating ? 'جاري العصف الذهني...' : 'بدء التوليد الذكي'}
                  </button>
               </div>
            </div>
         </div>
      );
   }

   if (view === 'ocr') {
      return (
         <div className="max-w-5xl mx-auto py-12 space-y-12 animate-view text-right">
            <div className="glass-panel p-12 bg-white rounded-[4rem] shadow-2xl space-y-10 border-t-[12px] border-indigo-600">
               <div className="flex items-center gap-6 justify-between flex-row-reverse">
                  <div className="flex items-center gap-6 flex-row-reverse">
                     <div className="p-6 bg-indigo-100 text-indigo-600 rounded-[2rem]"><Camera size={48} /></div>
                     <div>
                        <h2 className="text-4xl font-black">المصحح الذكي (Smart OCR)</h2>
                        <p className="text-slate-500 font-bold text-lg mt-2">ارفع ورقة إجابة الطالب وسيقوم الـ AI بتصحيحها فوراً.</p>
                     </div>
                  </div>
                  <X onClick={() => setView('hub')} className="cursor-pointer text-slate-300 hover:text-rose-600" size={32} />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                     <div className="h-[450px] bg-slate-50 rounded-[3rem] border-4 border-dashed border-indigo-100 flex flex-col items-center justify-center text-slate-400 relative overflow-hidden group">
                        {capturedImage ? (
                           <img src={capturedImage} className="w-full h-full object-cover" />
                        ) : (
                           <div className="text-center space-y-4">
                              <Upload size={64} className="mx-auto opacity-20" />
                              <p className="font-black text-xl">اسحب الصورة هنا أو اضغط للرفع</p>
                              <p className="text-xs font-bold text-slate-400">يدعم JPG, PNG, PDF</p>
                           </div>
                        )}
                        <input type="file" ref={ocrFileInputRef} className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleOCRAnalysis} />
                        {isAnalyzing && <div className="absolute inset-0 bg-indigo-600/40 backdrop-blur-md flex flex-col items-center justify-center text-white space-y-4">
                           <Loader2 size={64} className="animate-spin" />
                           <p className="font-black text-2xl animate-pulse">جاري التعرف على الكتابة...</p>
                        </div>}
                     </div>
                  </div>

                  <div className="space-y-8">
                     <div className="p-8 bg-slate-900 text-white rounded-[3rem] shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        <h4 className="text-indigo-400 font-black text-xs tracking-widest uppercase mb-6 flex items-center gap-2">نتائج المسح الذكي <Target size={14} /></h4>
                        {ocrResult ? (
                           <div className="space-y-6 animate-view">
                              <div className="flex items-center gap-5 bg-white/5 p-4 rounded-2xl">
                                 <UserCircle size={40} className="text-indigo-400" />
                                 <div>
                                    <p className="font-black text-xl">{ocrResult.detectedStudentName || 'غير معروف'}</p>
                                    <p className="text-[10px] text-slate-400 font-bold">معرف الطالب المكتشف</p>
                                 </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                 <div className="bg-white/5 p-6 rounded-[2rem] text-center border border-white/10">
                                    <p className="text-[10px] text-indigo-400 font-black mb-2 uppercase tracking-widest">الدرجة النهائية</p>
                                    <p className="text-5xl font-black text-emerald-400">{ocrResult.totalScore}</p>
                                 </div>
                                 <div className="bg-white/5 p-6 rounded-[2rem] text-center border border-white/10">
                                    <p className="text-[10px] text-indigo-400 font-black mb-2 uppercase tracking-widest">الحالة</p>
                                    <p className="text-3xl font-black text-white">{ocrResult.totalScore >= 50 ? 'ناجح' : 'راسب'}</p>
                                 </div>
                              </div>
                              <button className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3">اعتماد ورصد النتيجة <CheckCircle size={20} /></button>
                           </div>
                        ) : (
                           <div className="py-20 text-center space-y-4 opacity-40">
                              <Info size={40} className="mx-auto" />
                              <p className="font-black italic">في انتظار رفع الورقة وتصحيحها آلياً</p>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   return null;
};

export default ExamsModule;
