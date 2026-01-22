
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
   Plus, Save, Clock, Trash2, Sparkles, Image as ImageIcon, Check, Search, X, Award,
   RotateCcw, Target, ImagePlus, Crosshair, Users, CheckSquare, Loader2, Camera, Info, Eye, RefreshCw, Printer, Download, MapPin, FileText,
   UserCheck, AlertCircle, CheckCircle, Upload, FileType, PlusCircle, BrainCircuit, ListChecks, Send, ArrowRight, Archive, BarChart3, MousePointer2,
   Calendar, Hash, UserCircle
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { QuestionType, Question, UserRole } from '../types';
import { generateSmartExam, analyzeExamPaper } from '../src/services/mockAI';
import { openProfessionalPrintWindow } from '../src/utils/printUtils';

interface ExamsModuleProps {
   mode: 'list' | 'create' | 'ai_create' | 'ai_corrector';
}

const ExamsModule: React.FC<ExamsModuleProps> = ({ mode }) => {
   const { lang, addNotification, systemName, systemLogo, user } = useAppContext();
   const isRtl = lang === 'ar';

   const [view, setView] = useState<'hub' | 'editor' | 'ai' | 'ocr' | 'preview'>(
      mode === 'list' ? 'hub' : mode === 'create' ? 'editor' : mode === 'ai_create' ? 'ai' : 'ocr'
   );
   const [selectedExam, setSelectedExam] = useState<any>(null);

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
         const mockQuestions = await generateSmartExam(aiPrompt);
         setExamTitle('اختبار مولد: ' + aiPrompt);
         setQuestions(mockQuestions);
         setView('editor');
         addNotification({ title: 'تم توليد الاختبار', content: 'قام المحرك الذكي ببناء الاختبار بنجاح.', type: 'success', date: new Date().toISOString() });
      } catch (err) {
         console.error(err);
         alert("عذراً، واجه المحرك الذكي مشكلة.");
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

   const PrintExamTemplate = () => (
      <div className="hidden print:block bg-white p-10 text-right">
         <div className="border-4 border-black p-8 relative">
            {/* Header */}
            <div className="flex justify-between items-start border-b-4 border-black pb-6 mb-8">
               <div className="space-y-2">
                  <h2 className="text-2xl font-black">{systemName}</h2>
                  <p className="font-bold">المادة: فيزياء</p>
                  <p className="font-bold">المدرس: {user?.firstName} {user?.lastName}</p>
               </div>
               <div className="text-center">
                  <img src={systemLogo} className="h-20 w-20 mx-auto mb-2 object-contain" />
                  <h1 className="text-3xl font-black underline">ورقة اختبار رسمي</h1>
               </div>
               <div className="text-left space-y-1">
                  <p className="font-bold">التاريخ: {new Date().toLocaleDateString('ar-EG')}</p>
                  <p className="font-bold">الزمن: {examDuration} دقيقة</p>
                  <p className="font-bold">الدرجة الكلية: {questions.reduce((a, b) => a + b.points, 0)}</p>
               </div>
            </div>

            {/* Student Info Box */}
            <div className="grid grid-cols-2 gap-4 border-2 border-black p-4 mb-10 bg-slate-50">
               <div className="flex gap-2"><span>اسم الطالب:</span> <div className="flex-1 border-b border-dotted border-black"></div></div>
               <div className="flex gap-2"><span>كود الطالب:</span> <div className="flex-1 border-b border-dotted border-black"></div></div>
            </div>

            {/* Exam Title */}
            <div className="text-center mb-10">
               <h3 className="text-2xl font-black bg-black text-white inline-block px-10 py-2 rounded-lg">{examTitle || 'اختبار تقييمي'}</h3>
            </div>

            {/* Questions */}
            <div className="space-y-12">
               {questions.map((q, idx) => (
                  <div key={idx} className="space-y-4">
                     <div className="flex justify-between font-black text-lg">
                        <span>السؤال ({idx + 1}): {q.text}</span>
                        <span className="text-sm border border-black px-2">[{q.points} درجة]</span>
                     </div>
                     {q.type === QuestionType.SINGLE_CHOICE && (
                        <div className="grid grid-cols-2 gap-y-4 pr-8">
                           {q.options?.map((opt, oIdx) => (
                              <div key={oIdx} className="flex items-center gap-3">
                                 <div className="w-5 h-5 border-2 border-black rounded-full"></div>
                                 <span className="font-bold">{opt.text}</span>
                              </div>
                           ))}
                        </div>
                     )}
                     {q.type === QuestionType.TRUE_FALSE && (
                        <div className="flex gap-10 pr-8 font-bold">
                           <div className="flex gap-2 items-center"><div className="w-5 h-5 border-2 border-black"></div> ( ) صواب</div>
                           <div className="flex gap-2 items-center"><div className="w-5 h-5 border-2 border-black"></div> ( ) خطأ</div>
                        </div>
                     )}
                     {q.type === QuestionType.SHORT_ESSAY && (
                        <div className="space-y-2 pr-8">
                           <div className="h-px bg-slate-300 w-full mt-4 border-b border-dotted border-black"></div>
                           <div className="h-px bg-slate-300 w-full mt-4 border-b border-dotted border-black"></div>
                        </div>
                     )}
                     {q.type === QuestionType.IMAGE_CHOICE && q.image && (
                        <div className="pr-8">
                           <img src={q.image} className="max-h-60 border-2 border-black mx-auto" />
                           <p className="text-center text-xs mt-2 italic">حدد الإجابة على الرسم أعلاه</p>
                        </div>
                     )}
                     {q.type === QuestionType.HOTSPOT && q.image && (
                        <div className="pr-8 text-center">
                           <img src={q.image} className="max-h-80 border-4 border-black mx-auto rounded-3xl" />
                           <div className="mt-4 flex justify-center items-center gap-2">
                              <Crosshair size={24} />
                              <p className="font-bold underline italic text-xl">ضع علامة (X) على المنطقة المطلوبة أعلاه</p>
                           </div>
                        </div>
                     )}
                  </div>
               ))}
            </div>

            {/* Footer */}
            <div className="mt-20 pt-8 border-t-2 border-black flex justify-between items-end opacity-50 text-xs font-bold">
               <p>تم استخراج هذه الورقة آلياً عبر منظومة العقرب الذكية</p>
               <p>مع تمنياتنا بالتوفيق والنجاح</p>
            </div>
         </div>
      </div>
   );

   if (view === 'hub') {
      return (
         <div className="space-y-10 animate-view">
            <div className="flex justify-between items-center bg-white p-10 rounded-[3rem] border shadow-sm no-print">
               <div className="flex items-center gap-6">
                  <div className="p-5 bg-indigo-600 text-white rounded-[1.75rem] shadow-xl"><FileText size={40} /></div>
                  <div>
                     <h2 className="text-3xl font-black italic">EXAMS REPOSITORY</h2>
                     <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">إدارة الاختبارات المنشورة، مراقبة التفاعل، والأرشفة</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <button onClick={() => setView('ai')} className="px-8 py-5 bg-orange-500 text-white rounded-2xl font-black text-xs flex items-center gap-3 shadow-lg hover:scale-105 transition-all"><Sparkles size={18} /> AI Builder</button>
                  <button onClick={() => { setQuestions([]); setExamTitle(''); setView('editor'); }} className="px-8 py-5 bg-slate-950 text-white rounded-2xl font-black text-xs flex items-center gap-3 shadow-lg hover:scale-105 transition-all"><Plus size={18} /> اختبار يدوي</button>
               </div>
            </div>

            <div className="grid grid-cols-1 gap-6 no-print">
               {examsList.filter(ex => !archivedExams.includes(ex.id)).map(ex => (
                  <div key={ex.id} className="glass-panel p-8 bg-white border border-slate-100 rounded-[3rem] flex flex-col lg:flex-row items-center justify-between group hover:border-indigo-600 transition-all shadow-sm">
                     <div className="flex items-center gap-8 flex-1 w-full">
                        <div className="w-16 h-16 bg-slate-50 text-indigo-600 rounded-2xl flex items-center justify-center border shadow-inner"><Target size={32} /></div>
                        <div>
                           <h3 className="text-xl font-black text-slate-900">{ex.title}</h3>
                           <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">{ex.date} • {ex.id}</p>
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
                        <button onClick={() => { setSelectedExam(ex); setView('preview'); }} className="flex-1 lg:flex-none px-6 py-3 bg-slate-50 text-slate-400 rounded-xl font-black text-xs uppercase hover:bg-indigo-600 hover:text-white transition-all">Preview</button>
                        <button onClick={() => {
                           const reportHtml = `
                              <div class="info-grid">
                                 <div class="info-card">
                                    <div class="info-card-title">عنوان الاختبار</div>
                                    <div class="info-card-value">${ex.title}</div>
                                 </div>
                                 <div class="info-card">
                                    <div class="info-card-title">التاريخ</div>
                                    <div class="info-card-value">${ex.date}</div>
                                 </div>
                              </div>

                              <div class="amount-box">
                                 <div class="amount-box-label">متوسط الدرجات</div>
                                 <div class="amount-box-value">${ex.avgScore}%</div>
                              </div>

                              <div class="info-grid">
                                 <div class="info-card">
                                    <div class="info-card-title">عدد الطلاب</div>
                                    <div class="info-card-value">${ex.students}</div>
                                 </div>
                                 <div class="info-card">
                                    <div class="info-card-title">الحالة</div>
                                    <div class="info-card-value">${ex.status === 'active' ? 'نشط' : 'منتهي'}</div>
                                 </div>
                              </div>
                           `;

                           openProfessionalPrintWindow(reportHtml, {
                              title: `تقرير اختبار - ${ex.id}`,
                              pageSize: 'A4',
                              orientation: 'portrait',
                              systemName: systemName,
                              watermark: ex.status === 'active' ? 'سري' : undefined
                           });
                        }} className="p-3 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-900 hover:text-white transition-all"><Printer size={18} /></button>
                        <button onClick={() => setArchivedExams([...archivedExams, ex.id])} className="p-3 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><Archive size={18} /></button>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      );
   }

   if (view === 'ai') {
      return (
         <div className="max-w-4xl mx-auto py-12 space-y-10 animate-view text-right">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
               <button onClick={() => setView('hub')} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-200 transition-colors"><ArrowRight /></button>
               <h2 className="text-3xl font-black flex items-center gap-4 text-slate-800"><Sparkles className="text-orange-500" /> المولد الذكي للاختبارات</h2>
            </div>

            <div className="glass-panel p-10 bg-white space-y-8 rounded-[3rem] shadow-xl border border-slate-100">
               <div className="space-y-4">
                  <label className="font-black text-slate-500 text-lg">صف الاختبار الذي تريد توليده بالتفصيل:</label>
                  <textarea
                     value={aiPrompt}
                     onChange={e => setAiPrompt(e.target.value)}
                     placeholder="مثال: قم بإنشاء اختبار فيزياء للصف الثالث الثانوي عن الفصل الأول (التيار الكهربي) يتكون من 5 أسئلة اختيار من متعدد وسؤالين مقاليين، بمستوى صعوبة متوسط."
                     className="w-full h-48 p-8 bg-slate-50 rounded-[2rem] border-2 border-transparent focus:border-orange-500 outline-none font-bold text-lg leading-relaxed shadow-inner transition-colors"
                  />
               </div>

               <div className="flex gap-4">
                  <button
                     onClick={handleAiGenerate}
                     disabled={isGenerating}
                     className="flex-1 py-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-[2rem] font-black text-xl hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {isGenerating ? <Loader2 className="animate-spin" /> : <BrainCircuit />}
                     {isGenerating ? 'جاري التوليد والتحليل...' : 'توليد الاختبار الآن'}
                  </button>
               </div>
            </div>
         </div>
      );
   }

   if (view === 'ocr') {
      return (
         <div className="max-w-5xl mx-auto py-12 space-y-10 animate-view text-right">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
               <button onClick={() => setView('hub')} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-200 transition-colors"><ArrowRight /></button>
               <h2 className="text-3xl font-black flex items-center gap-4 text-slate-800"><Crosshair className="text-rose-500" /> المصحح الآلي للأوراق</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[600px]">
               {/* Upload Area */}
               <div className="glass-panel p-8 bg-white rounded-[3rem] flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden group hover:border-rose-200 border-2 border-dashed border-slate-200 transition-all cursor-pointer shadow-sm">
                  {capturedImage ? (
                     <div className="relative w-full h-full group/img">
                        <img src={capturedImage} className="w-full h-full object-contain rounded-2xl" />
                        <button onClick={(e) => { e.stopPropagation(); setCapturedImage(null); }} className="absolute top-4 right-4 p-3 bg-rose-600 text-white rounded-full shadow-lg hover:scale-110 transition-transform"><X size={20} /></button>
                     </div>
                  ) : (
                     <>
                        <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner"><Camera size={40} /></div>
                        <div>
                           <h3 className="text-xl font-black text-slate-900">رفع ورقة الإجابة</h3>
                           <p className="text-sm font-bold text-slate-400 mt-2">اسحب الصورة هنا أو اضغط للرفع</p>
                        </div>
                        <input type="file" ref={ocrFileInputRef} onChange={handleOCRAnalysis} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                     </>
                  )}
               </div>

               {/* Results Area */}
               <div className="glass-panel p-8 bg-slate-900 text-white rounded-[3rem] overflow-y-auto no-scrollbar relative shadow-2xl border border-slate-800">
                  {isAnalyzing ? (
                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-sm z-10 space-y-6">
                        <div className="relative">
                           <div className="absolute inset-0 bg-rose-500/20 blur-xl rounded-full"></div>
                           <Loader2 size={64} className="animate-spin text-rose-500 relative z-10" />
                        </div>
                        <p className="font-black text-xl animate-pulse">جاري تحليل الورقة...</p>
                     </div>
                  ) : ocrResult ? (
                     <div className="space-y-8 animate-view">
                        <div className="text-center pb-8 border-b border-white/10">
                           <div className="w-24 h-24 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl font-black shadow-lg shadow-rose-900/50">{ocrResult.score}%</div>
                           <h3 className="text-2xl font-black">{ocrResult.detectedStudentName || 'طالب غير معروف'}</h3>
                           <p className="opacity-50 font-bold mt-2 font-mono">{ocrResult.examCode || 'EX-???'}</p>
                        </div>

                        <div className="space-y-4">
                           <h4 className="font-black text-xs uppercase text-rose-400 tracking-[0.2em] mb-4">تفاصيل الإجابات</h4>
                           {ocrResult.answers?.map((ans: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-white/5">
                                 <span className="font-mono font-bold w-8 h-8 flex items-center justify-center bg-white/10 rounded-full text-sm">{idx + 1}</span>
                                 <span className={`font-black flex items-center gap-2 ${ans.correct ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {ans.correct ? <CheckCircle size={16} /> : <X size={16} />}
                                    {ans.correct ? 'صحيحة' : 'خاطئة'}
                                 </span>
                              </div>
                           ))}
                        </div>

                        <button className="w-full py-5 bg-emerald-600 rounded-2xl font-black shadow-lg hover:bg-emerald-500 transition-all text-lg mt-4">اعتماد النتيجة</button>
                     </div>
                  ) : (
                     <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-6">
                        <FileText size={64} strokeWidth={1} />
                        <p className="font-bold text-lg">بانتظار رفع الورقة للتحليل</p>
                     </div>
                  )}
               </div>
            </div>
         </div>
      );
   }

   if (view === 'preview' && selectedExam) {
      return (
         <div className="max-w-5xl mx-auto py-12 space-y-10 animate-view text-right">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
               <button onClick={() => setView('hub')} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-200 transition-colors"><ArrowRight /></button>
               <h2 className="text-3xl font-black flex items-center gap-4 text-slate-800"><Eye className="text-indigo-500" /> معاينة الاختبار: {selectedExam.title}</h2>
               <button onClick={() => {
                  // Print Logic
                  const examHtml = `
                     <div class="exam-header" style="text-align: center; border-bottom: 3px double #000; padding-bottom: 20px; margin-bottom: 30px;">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                           <div style="text-align: right;">
                              <h2 style="font-weight: 900; font-size: 1.2rem;">${systemName}</h2>
                              <p style="font-weight: bold;">المادة: فيزياء</p>
                              <p>الصف: ${selectedExam.grade || 'غير محدد'}</p>
                           </div>
                           <div style="text-align: center;">
                              <img src="${systemLogo}" style="height: 80px; object-fit: contain; margin-bottom: 10px;" />
                              <h1 style="font-size: 1.8rem; font-weight: 900; text-decoration: underline;">اختبار تقييمي</h1>
                           </div>
                           <div style="text-align: left;">
                              <p style="font-weight: bold;">التاريخ: ${new Date().toLocaleDateString('ar-EG')}</p>
                              <p style="font-weight: bold;">الزمن: ${examDuration} دقيقة</p>
                           </div>
                        </div>
                     </div>

                     <div style="border: 2px solid #000; padding: 15px; margin-bottom: 30px; background-color: #f8fafc; border-radius: 8px;">
                        <div style="display: flex; gap: 20px; margin-bottom: 10px;">
                           <div style="flex: 1; display: flex; gap: 10px;">
                              <span style="font-weight: bold;">اسم الطالب:</span>
                              <div style="border-bottom: 2px dotted #000; flex: 1;"></div>
                           </div>
                           <div style="flex: 1; display: flex; gap: 10px;">
                              <span style="font-weight: bold;">رقم الجلوس:</span>
                              <div style="border-bottom: 2px dotted #000; flex: 1;"></div>
                           </div>
                        </div>
                     </div>

                     <div class="exam-title" style="text-align: center; margin-bottom: 40px;">
                        <h3 style="display: inline-block; background: #000; color: #fff; padding: 8px 30px; border-radius: 20px; font-weight: 900; font-size: 1.2rem;">${selectedExam.title}</h3>
                     </div>

                     <div class="questions-container" style="display: flex; flex-direction: column; gap: 30px;">
                        <!-- Mock questions for preview since actual questions are state-based in editor, 
                             in a real app these typically come from DB fetching by ID -->
                        <p style="text-align:center; font-style:italic;">[أسئلة الاختبار ستظهر هنا عند الربط الفعلي بقاعدة البيانات]</p>
                     </div>

                     <div style="margin-top: 50px; border-top: 2px solid #000; padding-top: 20px; display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: bold;">
                        <div>انتهت الأسئلة</div>
                        <div>مع تمنياتنا بالتوفيق والنجاح</div>
                     </div>
                  `;

                  openProfessionalPrintWindow(examHtml, {
                     title: selectedExam.title,
                     pageSize: 'A4',
                     orientation: 'portrait',
                     margin: '20mm',
                     showLogo: false
                  });
               }} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-sm flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg">
                  <Printer size={18} /> 🖨️ Print for Distribution
               </button>
            </div>

            <div className="glass-panel p-10 bg-white rounded-[3rem] border border-slate-100 space-y-8">
               <div className="flex justify-between items-start">
                  <div>
                     <h1 className="text-4xl font-black text-slate-900 mb-2">{selectedExam.title}</h1>
                     <p className="font-bold text-slate-400">{selectedExam.date} • {selectedExam.id}</p>
                  </div>
                  <div className="flex gap-4">
                     <div className="text-center p-4 bg-emerald-50 rounded-2xl">
                        <p className="text-xs font-black uppercase text-emerald-600 mb-1">متوسط الدرجات</p>
                        <p className="text-2xl font-black text-emerald-700">{selectedExam.avgScore}%</p>
                     </div>
                     <div className="text-center p-4 bg-indigo-50 rounded-2xl">
                        <p className="text-xs font-black uppercase text-indigo-600 mb-1">عدد الطلاب</p>
                        <p className="text-2xl font-black text-indigo-700">{selectedExam.students}</p>
                     </div>
                  </div>
               </div>

               <div className="p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] text-center text-slate-400">
                  <FileText size={48} className="mx-auto mb-4" />
                  <p className="font-black text-lg">معاينة الأسئلة غير متاحة في النسخة التجريبية للبيانات الوهمية</p>
               </div>
            </div>
         </div>
      );
   }

   // محرر الاختبار
   return (
      <div className="max-w-5xl mx-auto py-12 space-y-12 animate-view pb-24 text-right">
         <PrintExamTemplate />

         <div className="glass-card p-10 bg-white border-t-8 border-indigo-600 flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl rounded-[3rem] no-print">
            <div className="flex-1 space-y-4 w-full">
               <input value={examTitle} onChange={e => setExamTitle(e.target.value)} placeholder="ضع عنوان الاختبار هنا..." className="text-4xl font-black w-full border-none outline-none bg-transparent text-slate-900 text-right" />
               <div className="flex items-center gap-6 text-slate-400 font-bold text-xs justify-end">
                  <div className="flex items-center gap-2"><Clock size={16} className="text-indigo-600" /> مدة الاختبار: <input type="number" value={examDuration} onChange={e => setExamDuration(parseInt(e.target.value))} className="w-16 bg-slate-50 border-none rounded-lg p-2 text-center font-black" /> دقيقة</div>
               </div>
            </div>
            <div className="flex gap-3">
               <button onClick={() => {
                  const examHtml = `
                     <div class="exam-header" style="text-align: center; border-bottom: 3px double #000; padding-bottom: 20px; margin-bottom: 30px;">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                           <div style="text-align: right;">
                              <h2 style="font-weight: 900; font-size: 1.2rem;">${systemName}</h2>
                              <p style="font-weight: bold;">المادة: فيزياء</p>
                              <p>الصف: الثالث الثانوي</p>
                           </div>
                           <div style="text-align: center;">
                              <img src="${systemLogo}" style="height: 80px; object-fit: contain; margin-bottom: 10px;" />
                              <h1 style="font-size: 1.8rem; font-weight: 900; text-decoration: underline;">اختبار تقييمي</h1>
                           </div>
                           <div style="text-align: left;">
                              <p style="font-weight: bold;">التاريخ: ${new Date().toLocaleDateString('ar-EG')}</p>
                              <p style="font-weight: bold;">الزمن: ${examDuration} دقيقة</p>
                              <p style="font-weight: bold; border: 2px solid #000; padding: 2px 8px; border-radius: 4px; display: inline-block; margin-top: 5px;">الدرجة: ${questions.reduce((a, b) => a + (b.points || 0), 0)}</p>
                           </div>
                        </div>
                     </div>

                     <div style="border: 2px solid #000; padding: 15px; margin-bottom: 30px; background-color: #f8fafc; border-radius: 8px;">
                        <div style="display: flex; gap: 20px; margin-bottom: 10px;">
                           <div style="flex: 1; display: flex; gap: 10px;">
                              <span style="font-weight: bold;">اسم الطالب:</span>
                              <div style="border-bottom: 2px dotted #000; flex: 1;"></div>
                           </div>
                           <div style="flex: 1; display: flex; gap: 10px;">
                              <span style="font-weight: bold;">رقم الجلوس:</span>
                              <div style="border-bottom: 2px dotted #000; flex: 1;"></div>
                           </div>
                        </div>
                     </div>

                     <div class="exam-title" style="text-align: center; margin-bottom: 40px;">
                        <h3 style="display: inline-block; background: #000; color: #fff; padding: 8px 30px; border-radius: 20px; font-weight: 900; font-size: 1.2rem;">${examTitle || 'اختبار بدون عنوان'}</h3>
                     </div>

                     <div class="questions-container" style="display: flex; flex-direction: column; gap: 30px;">
                        ${questions.map((q, idx) => `
                           <div class="question-block" style="break-inside: avoid;">
                              <div style="display: flex; justify-content: space-between; margin-bottom: 15px; font-weight: bold; font-size: 1.1rem;">
                                 <span>س${idx + 1}: ${q.text}</span>
                                 <span style="font-size: 0.9rem; background: #eee; padding: 2px 8px; border-radius: 4px;">(${q.points} درجات)</span>
                              </div>
                              
                              ${q.image ? `<div style="text-align: center; margin: 15px 0;"><img src="${q.image}" style="max-height: 200px; border: 1px solid #ddd;" /></div>` : ''}

                              ${q.type === 'single_choice' ? `
                                 <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; padding-right: 20px;">
                                    ${q.options?.map(opt => `
                                       <div style="display: flex; alignItems: center; gap: 10px;">
                                          <div style="width: 20px; height: 20px; border: 2px solid #000; border-radius: 50%;"></div>
                                          <span>${opt.text}</span>
                                       </div>
                                    `).join('')}
                                 </div>
                              ` : ''}

                              ${q.type === 'true_false' ? `
                                 <div style="display: flex; gap: 40px; padding-right: 20px; font-weight: bold;">
                                    <div style="display: flex; alignItems: center; gap: 10px;">
                                       <div style="width: 20px; height: 20px; border: 2px solid #000;"></div> ( ) صواب
                                    </div>
                                    <div style="display: flex; alignItems: center; gap: 10px;">
                                       <div style="width: 20px; height: 20px; border: 2px solid #000;"></div> ( ) خطأ
                                    </div>
                                 </div>
                              ` : ''}

                              ${q.type === 'short_essay' ? `
                                 <div style="margin-top: 20px; padding-right: 20px;">
                                    <div style="border-bottom: 1px dotted #000; height: 30px; width: 100%;"></div>
                                    <div style="border-bottom: 1px dotted #000; height: 30px; width: 100%;"></div>
                                    <div style="border-bottom: 1px dotted #000; height: 30px; width: 100%;"></div>
                                 </div>
                              ` : ''}
                           </div>
                        `).join('')}
                     </div>

                     <div style="margin-top: 50px; border-top: 2px solid #000; padding-top: 20px; display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: bold;">
                        <div>انتهت الأسئلة</div>
                        <div>مع تمنياتنا بالتوفيق والنجاح</div>
                     </div>
                  `;

                  openProfessionalPrintWindow(examHtml, {
                     title: examTitle || 'طباعة اختبار',
                     pageSize: 'A4',
                     orientation: 'portrait',
                     margin: '20mm',
                     showLogo: false // We handle logo manually in HTML
                  });
               }} className="p-5 bg-white border border-slate-200 text-slate-400 rounded-3xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"><Printer size={24} /></button>
               <button onClick={() => setView('hub')} className="px-12 py-5 bg-slate-950 text-white rounded-3xl font-black text-lg shadow-xl flex items-center gap-3 hover:bg-indigo-600 transition-all">
                  <Save size={24} /> حفظ ونشر
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

                        {q.type === QuestionType.HOTSPOT && (
                           <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                 <p className="text-xs font-black text-slate-400 uppercase">انقر على الصورة لتحديد النقطة الصحيحة</p>
                                 <button
                                    onClick={() => {
                                       const url = prompt('أدخل رابط الصورة:');
                                       if (url) {
                                          const nq = [...questions];
                                          nq[idx].image = url;
                                          setQuestions(nq);
                                       }
                                    }}
                                    className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold flex items-center gap-2 text-xs"
                                 >
                                    <ImagePlus size={16} /> تغيير الصورة
                                 </button>
                              </div>

                              {q.image ? (
                                 <div className="relative inline-block border-4 border-slate-100 rounded-[2rem] overflow-hidden cursor-crosshair group">
                                    <img
                                       src={q.image}
                                       className="max-h-[400px] w-auto block"
                                       onClick={(e) => {
                                          const rect = (e.target as HTMLImageElement).getBoundingClientRect();
                                          const x = ((e.clientX - rect.left) / rect.width) * 100;
                                          const y = ((e.clientY - rect.top) / rect.height) * 100;
                                          const nq = [...questions];
                                          nq[idx].correctX = Math.round(x);
                                          nq[idx].correctY = Math.round(y);
                                          setQuestions(nq);
                                       }}
                                    />
                                    {q.correctX !== undefined && q.correctY !== undefined && (
                                       <div
                                          className="absolute pointer-events-none flex items-center justify-center"
                                          style={{
                                             left: `${q.correctX}%`,
                                             top: `${q.correctY}%`,
                                             width: `${(q.toleranceRadius || 30) * 2}px`,
                                             height: `${(q.toleranceRadius || 30) * 2}px`,
                                             transform: 'translate(-50%, -50%)'
                                          }}
                                       >
                                          <div className="absolute inset-0 bg-indigo-600/20 border-2 border-indigo-600 rounded-full animate-pulse" />
                                          <Crosshair className="text-indigo-600 z-10" size={20} />
                                       </div>
                                    )}
                                 </div>
                              ) : (
                                 <div className="h-60 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center text-slate-400 gap-4">
                                    <ImagePlus size={48} />
                                    <p className="font-bold cursor-pointer hover:text-indigo-600" onClick={() => {
                                       const url = prompt('أدخل رابط الصورة:');
                                       if (url) {
                                          const nq = [...questions];
                                          nq[idx].image = url;
                                          setQuestions(nq);
                                       }
                                    }}>ارفع الصورة للمتابعة</p>
                                 </div>
                              )}

                              <div className="flex items-center gap-6">
                                 <div className="flex-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">دقة الإجابة (نصف قطر التسامح بالبكسل)</label>
                                    <input
                                       type="range"
                                       min="10" max="100"
                                       value={q.toleranceRadius || 30}
                                       onChange={(e) => {
                                          const nq = [...questions];
                                          nq[idx].toleranceRadius = parseInt(e.target.value);
                                          setQuestions(nq);
                                       }}
                                       className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                    <span className="text-xs font-bold text-indigo-600">{q.toleranceRadius || 30}px</span>
                                 </div>
                              </div>
                           </div>
                        )}

                        {/* Question Options UI */}
                        {(q.type === QuestionType.SINGLE_CHOICE || q.type === QuestionType.TRUE_FALSE) && (
                           <div className="space-y-4">
                              <p className="font-black text-slate-500 text-sm mb-4 tracking-widest uppercase">
                                 {q.type === QuestionType.SINGLE_CHOICE ? 'خيارات الإجابة (Options):' : 'تحديد الإجابة الصحيحة:'}
                              </p>

                              {/* Manual Option Editor (Only for Single Choice) */}
                              {q.type === QuestionType.SINGLE_CHOICE && (
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {(q.options || []).map((opt, oIdx) => (
                                       <div key={opt.id} className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border-2 border-transparent hover:border-indigo-200 transition-all group/opt">
                                          <button
                                             onClick={() => {
                                                const nq = [...questions];
                                                nq[idx].correctAnswer = opt.id;
                                                setQuestions(nq);
                                             }}
                                             className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-black transition-all ${q.correctAnswer === opt.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-300'}`}
                                          >
                                             {q.correctAnswer === opt.id ? <Check size={18} strokeWidth={4} /> : String.fromCharCode(65 + oIdx)}
                                          </button>
                                          <input
                                             value={opt.text}
                                             onChange={(e) => {
                                                const nq = [...questions];
                                                if (nq[idx].options) {
                                                   const newOpts = [...nq[idx].options!];
                                                   newOpts[oIdx] = { ...newOpts[oIdx], text: e.target.value };
                                                   nq[idx].options = newOpts;
                                                   setQuestions(nq);
                                                }
                                             }}
                                             className="bg-transparent border-none outline-none font-black text-slate-700 flex-1"
                                             placeholder={`الخيار ${oIdx + 1}...`}
                                          />
                                          {(q.options?.length || 0) > 2 && (
                                             <button
                                                onClick={() => {
                                                   const nq = [...questions];
                                                   nq[idx].options = nq[idx].options?.filter(o => o.id !== opt.id);
                                                   setQuestions(nq);
                                                }}
                                                className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover/opt:opacity-100"
                                             >
                                                <X size={16} />
                                             </button>
                                          )}
                                       </div>
                                    ))}

                                    <button
                                       onClick={() => {
                                          const nq = [...questions];
                                          const newId = (Math.max(0, ...nq[idx].options?.map(o => parseInt(o.id)).filter(v => !isNaN(v)) || [0]) + 1).toString();
                                          nq[idx].options = [...(nq[idx].options || []), { id: newId, text: '' }];
                                          setQuestions(nq);
                                       }}
                                       className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-black hover:border-indigo-400 hover:text-indigo-600 transition-all text-xs"
                                    >
                                       <Plus size={18} /> إضافة خيار جديد للمقترح
                                    </button>
                                 </div>
                              )}

                              {/* Specialized Toggle for True/False */}
                              {q.type === QuestionType.TRUE_FALSE && (
                                 <div className="flex gap-4 mt-4 animate-view">
                                    {[
                                       { id: 'true', label: 'صواب' },
                                       { id: 'false', label: 'خطأ' }
                                    ].map(item => (
                                       <button
                                          key={item.id}
                                          onClick={() => {
                                             const nq = [...questions];
                                             nq[idx].correctAnswer = item.id;
                                             // Auto-initialize standard T/F options if missing
                                             nq[idx].options = [{ id: 'true', text: 'صواب' }, { id: 'false', text: 'خطأ' }];
                                             setQuestions(nq);
                                          }}
                                          className={`px-10 py-5 rounded-2xl font-black text-lg transition-all border-2 flex-1 shadow-sm ${q.correctAnswer === item.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl scale-[1.02]' : 'bg-white border-slate-50 text-slate-400 hover:border-indigo-200'}`}
                                       >
                                          {item.label}
                                       </button>
                                    ))}
                                 </div>
                              )}
                           </div>
                        )}


                        <div className="flex items-center gap-6 pt-6 border-t flex-row-reverse">
                           <div className="flex items-center gap-4 px-6 py-4 bg-indigo-50 text-indigo-700 rounded-2xl">
                              <Award size={20} /> <span className="text-xs font-black uppercase">الدرجة:</span>
                              <input type="number" value={q.points} onChange={e => { const nq = [...questions]; nq[idx].points = parseInt(e.target.value) || 1; setQuestions(nq); }} className="w-16 bg-transparent text-center font-black text-xl outline-none tabular-nums" />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            ))}

            <div className="flex flex-wrap gap-4 justify-center py-20 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-200 shadow-inner">
               <button onClick={() => setQuestions([...questions, { id: Date.now().toString(), type: QuestionType.SINGLE_CHOICE, text: '', points: 5, options: [{ id: '1', text: '' }, { id: '2', text: '' }, { id: '3', text: '' }, { id: '4', text: '' }], correctAnswer: '1' } as any])} className="px-10 py-5 bg-white border shadow-sm rounded-3xl font-black text-xs flex items-center gap-3 hover:border-indigo-600 transition-all"><CheckSquare size={18} /> خيارات متعددة</button>
               <button onClick={() => setQuestions([...questions, { id: Date.now().toString(), type: QuestionType.TRUE_FALSE, text: '', points: 5, correctAnswer: 'true', options: [{ id: 'true', text: 'صواب' }, { id: 'false', text: 'خطأ' }] } as any])} className="px-10 py-5 bg-white border shadow-sm rounded-3xl font-black text-xs flex items-center gap-3 hover:border-indigo-600 transition-all"><CheckCircle size={18} /> صح أو خطأ</button>
               <button onClick={() => setQuestions([...questions, { id: Date.now().toString(), type: QuestionType.HOTSPOT, text: '', points: 10, image: '', correctX: 50, correctY: 50, toleranceRadius: 30 } as any])} className="px-10 py-5 bg-white border shadow-sm rounded-3xl font-black text-xs flex items-center gap-3 hover:border-indigo-600 transition-all"><Target size={18} /> سؤال نقطة في صورة</button>
               <button onClick={() => setQuestions([...questions, { id: Date.now().toString(), type: QuestionType.SHORT_ESSAY, text: '', points: 10 } as any])} className="px-10 py-5 bg-white border shadow-sm rounded-3xl font-black text-xs flex items-center gap-3 hover:border-indigo-600 transition-all"><FileText size={18} /> سؤال مقالي</button>
            </div>
         </div>
      </div>
   );
};

export default ExamsModule;
