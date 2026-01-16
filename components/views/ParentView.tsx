
import React, { useState, useEffect } from 'react';
import {
   User, MessageCircle, AlertCircle, FileCheck, DollarSign, Activity,
   Award, Star, ShieldCheck, HeartPulse, BrainCircuit, TrendingUp,
   Printer, Calendar, ArrowRight, CheckCircle, FileText, Download,
   Sparkles, Zap, Bell, CreditCard, X, Briefcase, Megaphone, UserCircle,
   FileBadge, Receipt, History, Wallet, ArrowDownRight, CreditCard as CardIcon,
   Landmark, Check
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import SmartAnalytic from '../SmartAnalytic';
import { UserRole } from '../../types';

interface ParentViewProps {
   onNavigate: (tab: string) => void;
   mode?: 'overview' | 'academic_results' | 'ai_analysis' | 'financial_records' | 'behavior';
}

const ParentView: React.FC<ParentViewProps> = ({ onNavigate, mode = 'overview' }) => {
   const { lang, user, systemName, systemLogo, announcements, allUsers, updateStudentSubscription, addNotification, t } = useAppContext();
   const isRtl = lang === 'ar';

   const [isPaid, setIsPaid] = useState(false);
   const [showReceipt, setShowReceipt] = useState(false);

   // جلب بيانات الطالب المرتبط بولي الأمر (في النسخة التجريبية نربطه بأول طالب متاح أو طالب ديمو)
   const student = allUsers.find(u => u.role === UserRole.STUDENT) || {
      firstName: "ياسين",
      lastName: "محمود",
      code: "STD-1001",
      subscriptionAmount: 650,
      nextRenewalDate: "2024-06-01",
      username: "std_demo"
   };

   const environmentAnnouncements = announcements.filter(a => a.status === 'approved');

   const renderOverview = () => (
      <div className="space-y-10 animate-view">
         {/* Welcome Hero */}
         <div className="glass-card p-12 flex flex-col md:flex-row items-center gap-10 border-r-8 border-indigo-600 shadow-2xl relative overflow-hidden bg-white">
            <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-600/5 blur-[100px] -ml-40 -mt-40"></div>
            <div className="relative z-10">
               <div className="w-28 h-28 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center border-4 border-white shadow-xl overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.username}`} className="w-full h-full object-cover" alt="Student" />
               </div>
               <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-lg border-2 border-white">
                  <CheckCircle size={18} />
               </div>
            </div>
            <div className="flex-1 relative z-10 text-center md:text-right">
               <h1 className="text-4xl font-black mb-2 text-slate-900 tracking-tight">{t('par_welcome')} / {student.firstName} {student.lastName}</h1>
               <p className="text-slate-500 font-bold text-lg">{t('par_student_journey')}</p>
               <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
                  <div className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black border border-indigo-100">{student.code}</div>
                  <div className="px-4 py-1.5 bg-slate-50 text-slate-600 rounded-full text-xs font-black border border-slate-100">الصف الثالث الثانوي</div>
               </div>
            </div>
            <div className="flex gap-4 z-10 no-print">
               <button onClick={() => onNavigate('messages')} className="p-5 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm group">
                  <MessageCircle size={28} className="group-hover:scale-110 transition-transform" />
               </button>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SummaryCard label={t('par_academic')} val="96.8%" icon={<Award />} color="text-amber-500" bg="bg-amber-50" trend="+2.5%" />
            <SummaryCard label={t('par_attendance')} val="99%" icon={<ShieldCheck />} color="text-emerald-500" bg="bg-emerald-50" trend={t('par_perfect')} />
            <SummaryCard label={t('par_next_payment')} val={isPaid ? "0.00" : student.nextRenewalDate} icon={<CreditCard />} color={isPaid ? "text-emerald-600" : "text-rose-600"} bg={isPaid ? "bg-emerald-50" : "bg-rose-50"} trend={isPaid ? t('inv_available') : t('par_current_due')} />
         </div>

         <div className="space-y-6">
            <div className="flex justify-between items-center px-4">
               <h3 className="text-2xl font-black flex items-center gap-3 text-slate-900"><Megaphone className="text-amber-500" /> {t('par_announcements')}</h3>
               <button className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">{t('view_all')}</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {environmentAnnouncements.slice(0, 4).map(ann => (
                  <div key={ann.id} className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm flex gap-6 hover:border-indigo-600 transition-all group">
                     <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${ann.authorRole === UserRole.ADMIN ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
                        {ann.authorRole === UserRole.ADMIN ? <ShieldCheck size={32} /> : <Briefcase size={32} />}
                     </div>
                     <div>
                        <div className="flex justify-between items-start mb-2">
                           <h4 className="font-black text-lg text-slate-900">{ann.title}</h4>
                           <span className="text-[9px] font-black text-slate-300 uppercase">{ann.date}</span>
                        </div>
                        <p className="text-sm text-slate-500 font-bold leading-relaxed line-clamp-2">{ann.content}</p>
                        <div className="flex items-center gap-2 mt-4 text-[10px] font-black text-indigo-600 uppercase tracking-tighter">
                           <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span> {ann.authorName}
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );

   const renderAcademic = () => (
      <div className="space-y-10 animate-view">
         <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
               <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t('par_detailed_results')}</h2>
               <p className="text-slate-500 font-bold">{t('par_detailed_results_desc')}</p>
            </div>
            <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm flex items-center gap-3 shadow-xl shadow-indigo-600/20 hover:scale-105 transition-all">
               <Download size={20} /> {t('par_export_certificate')}
            </button>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 glass-card p-10 bg-white border border-slate-200 space-y-8">
               <h3 className="text-xl font-black border-b pb-6 flex items-center gap-4 text-slate-900"><FileBadge className="text-indigo-600" size={24} /> {t('par_exam_performance')}</h3>
               <div className="space-y-4">
                  {[1, 2, 3].map(id => (
                     <div key={id} className="p-6 bg-slate-50/50 rounded-3xl flex items-center justify-between border-2 border-transparent hover:border-indigo-100 hover:bg-white transition-all group">
                        <div className="flex items-center gap-5">
                           <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm font-black group-hover:bg-indigo-600 group-hover:text-white transition-colors">{id}</div>
                           <div>
                              <p className="font-black text-lg text-slate-900">اختبار الفيزياء الشامل - {id}</p>
                              <p className="text-[10px] text-slate-400 font-black flex items-center gap-2 uppercase tracking-widest"><Calendar size={10} /> 2024-04-10 • م/ محمود العزازي</p>
                           </div>
                        </div>
                        <div className="text-left">
                           <p className="text-3xl font-black text-indigo-700 tabular-nums">4{id}/50</p>
                           <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600`}>{t('par_excellent')}</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <div className="space-y-10">
               <div className="glass-card p-10 text-center space-y-8 bg-white border shadow-sm">
                  <h3 className="text-lg font-black flex items-center justify-center gap-3 text-slate-900"><Activity className="text-rose-600" /> {t('par_commitment_level')}</h3>
                  <div className="relative w-48 h-48 mx-auto">
                     <svg className="w-full h-full transform -rotate-90">
                        <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                        <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={552.92} strokeDashoffset={552.92 * (1 - 0.99)} className="text-emerald-500 stroke-round transition-all duration-1000" />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-black text-slate-900">99%</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase">Attendance</span>
                     </div>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                     <p className="font-bold text-sm text-emerald-800">{t('par_attendance_desc')}</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );

   /**
    * تقديم تحليل ذكي لولي الأمر حول مستوى الطالب الدراسي
    */
   const renderAIAnalysis = () => (
      <div className="space-y-10 animate-view">
         <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
               <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t('par_ai_report')}</h2>
               <p className="text-slate-500 font-bold">{t('performance_analysis_smart')}</p>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
               <div className="glass-card p-1 border-none shadow-3xl overflow-hidden rounded-[3rem]">
                  <SmartAnalytic
                     role={UserRole.PARENT}
                     dataContext={`أنت تحلل أداء الطالب ${student.firstName} ${student.lastName}. معدله التراكمي 96.8%، وحضوره 99%. لديه تميز في الفيزياء الذرية ولكنه يحتاج لمراجعة قوانين نيوتن الثالث.`}
                  />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm flex items-start gap-5">
                     <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl"><Sparkles size={24} /></div>
                     <div>
                        <h4 className="font-black text-lg text-slate-900">{t('par_tip_of_day')}</h4>
                        <p className="text-sm text-slate-500 font-bold mt-2 leading-relaxed">بناءً على نتائج الاختبارات الأخيرة، يفضل التركيز على حل التدريبات العملية في قسم الميكانيكا لتعزيز سرعة الاستجابة.</p>
                     </div>
                  </div>
                  <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm flex items-start gap-5">
                     <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl"><Zap size={24} /></div>
                     <div>
                        <h4 className="font-black text-lg text-slate-900">{t('par_path_prediction')}</h4>
                        <p className="text-sm text-slate-500 font-bold mt-2 leading-relaxed">يتوقع المحلل الذكي وصول الطالب لنسبة 98% في الاختبار النهائي إذا استمر على نفس معدل التحصيل الحالي.</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="space-y-10">
               <div className="glass-card p-10 bg-indigo-600 text-white rounded-[3rem] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl"></div>
                  <h3 className="text-xl font-black mb-6 flex items-center gap-3"><BrainCircuit size={24} /> {t('par_how_ai_works')}</h3>
                  <p className="text-sm text-indigo-100 font-bold leading-relaxed mb-8">{t('par_ai_explanation')}</p>
                  <div className="p-4 bg-white/10 rounded-2xl border border-white/20">
                     <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">{t('powered_by')}</p>
                     <p className="font-black text-lg">Gemini 3 Pro</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );

   const renderFinancials = () => {
      const { funds } = useAppContext();
      const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
      const availablePaymentMethods = funds.filter(f => f.isActiveForParentPayments);

      return (
         <div className="space-y-12 animate-view pb-24">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 no-print">
               <div className="flex items-center gap-6">
                  <div className="p-5 bg-rose-600 text-white rounded-[2rem] shadow-xl">
                     <Wallet size={40} />
                  </div>
                  <div>
                     <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">{t('par_financials')}</h2>
                     <p className="text-slate-500 font-bold">{t('par_financial_status')}</p>
                  </div>
               </div>
               <div className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black border border-emerald-100 flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div> {t('par_account_active')}
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
               {/* بطاقة السداد الرئيسية */}
               <div className="glass-card p-12 space-y-10 border-t-[12px] border-indigo-600 bg-white shadow-2xl no-print relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 -mr-20 -mt-20 rounded-full"></div>
                  <div className="flex justify-between items-start relative z-10">
                     <div className="p-5 bg-indigo-50 text-indigo-600 rounded-[2rem] shadow-inner"><DollarSign size={40} /></div>
                     <div className="text-right">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('par_next_renewal')}</p>
                        <p className="text-2xl font-black text-slate-900 tabular-nums">{student.nextRenewalDate || '2024-06-01'}</p>
                     </div>
                  </div>
                  <div className="relative z-10">
                     <p className="text-xs font-black text-slate-400 uppercase mb-3 tracking-widest">{t('par_current_due')}</p>
                     <h4 className="text-7xl font-black text-slate-900 tabular-nums">{isPaid ? '0.00' : (student.subscriptionAmount || 650).toLocaleString()} <span className="text-2xl font-bold opacity-20">{t('acc_currency')}</span></h4>
                  </div>

                  <div className="relative z-10 pt-6">
                     {!isPaid ? (
                        <>
                           {/* اختيار طريقة الدفع */}
                           <div className="space-y-6 mb-8">
                              <h5 className="text-sm font-black text-slate-900 uppercase tracking-widest">{t('par_choose_payment')}</h5>
                              <div className="grid grid-cols-1 gap-4">
                                 {availablePaymentMethods.map(fund => (
                                    <button
                                       key={fund.id}
                                       onClick={() => setSelectedPaymentMethod(fund.id)}
                                       className={`p-6 rounded-[2rem] border-2 transition-all text-right ${selectedPaymentMethod === fund.id
                                          ? 'border-indigo-600 bg-indigo-50 shadow-lg'
                                          : 'border-slate-200 bg-white hover:border-indigo-200'
                                          }`}
                                    >
                                       <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-4">
                                             <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${fund.type === 'bank' ? 'bg-blue-50 text-blue-600' :
                                                fund.type === 'e-wallet' ? 'bg-emerald-50 text-emerald-600' :
                                                   'bg-slate-50 text-slate-600'
                                                }`}>
                                                {fund.type === 'bank' ? <Landmark size={24} /> : <Wallet size={24} />}
                                             </div>
                                             <div>
                                                <p className="font-black text-lg text-slate-900">{fund.name}</p>
                                                <p className="text-xs text-slate-400 font-bold">
                                                   {fund.type === 'bank' && fund.bankName}
                                                   {fund.type === 'e-wallet' && fund.walletProvider?.replace('-', ' ').toUpperCase()}
                                                </p>
                                             </div>
                                          </div>
                                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPaymentMethod === fund.id
                                             ? 'border-indigo-600 bg-indigo-600'
                                             : 'border-slate-300'
                                             }`}>
                                             {selectedPaymentMethod === fund.id && <Check size={16} className="text-white" />}
                                          </div>
                                       </div>

                                       {/* عرض تفاصيل الدفع عند الاختيار */}
                                       {selectedPaymentMethod === fund.id && (
                                          <div className="mt-6 pt-6 border-t border-slate-200 space-y-3 animate-view">
                                             {fund.type === 'bank' && (
                                                <>
                                                   {(fund.accountNumber || fund.bankAccountNum) && (
                                                      <div className="flex justify-between items-center p-3 bg-white rounded-xl">
                                                         <span className="text-xs font-bold text-slate-500">{t('acc_account_number')}</span>
                                                         <span className="font-mono font-black text-slate-900">{fund.accountNumber || fund.bankAccountNum}</span>
                                                      </div>
                                                   )}
                                                   {fund.iban && (
                                                      <div className="flex justify-between items-center p-3 bg-white rounded-xl">
                                                         <span className="text-xs font-bold text-slate-500">IBAN</span>
                                                         <span className="font-mono text-xs font-black text-slate-900">{fund.iban}</span>
                                                      </div>
                                                   )}
                                                </>
                                             )}
                                             {fund.type === 'e-wallet' && fund.walletNumber && (
                                                <div className="flex justify-between items-center p-3 bg-white rounded-xl">
                                                   <span className="text-xs font-bold text-slate-500">{t('par_wallet_number')}</span>
                                                   <span className="font-mono font-black text-slate-900">{fund.walletNumber}</span>
                                                </div>
                                             )}
                                             {(fund.qrCode || fund.fundImage) && (
                                                <div className="flex flex-col items-center gap-3 p-4 bg-white rounded-xl shadow-inner border border-slate-50">
                                                   <p className="text-xs font-black text-slate-500">{t('par_scan_to_pay')}</p>
                                                   <img src={fund.fundImage || fund.qrCode} className="max-w-full h-auto max-h-64 rounded-xl border-2 border-slate-100 shadow-sm" alt="Payment" />
                                                   {fund.fundImage && !fund.qrCode && <p className="text-[10px] font-bold text-indigo-600">بيانات تحويل بنكي / لقطة شاشة</p>}
                                                </div>
                                             )}
                                          </div>
                                       )}
                                    </button>
                                 ))}
                              </div>
                           </div>

                           <button
                              onClick={() => {
                                 if (!selectedPaymentMethod) {
                                    alert(t('par_select_payment_first'));
                                    return;
                                 }
                                 setIsPaid(true);
                                 addNotification({
                                    title: t('par_payment_success_title'),
                                    content: `${t('par_payment_success_msg')} ${availablePaymentMethods.find(f => f.id === selectedPaymentMethod)?.name}`,
                                    type: 'success',
                                    date: new Date().toISOString()
                                 });
                              }}
                              disabled={!selectedPaymentMethod}
                              className={`w-full py-7 rounded-[2.5rem] font-black text-2xl shadow-3xl transition-all flex items-center justify-center gap-4 group ${selectedPaymentMethod
                                 ? 'bg-slate-950 text-white hover:scale-[1.02] active:scale-95 cursor-pointer'
                                 : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                 }`}
                           >
                              <CardIcon size={32} className={selectedPaymentMethod ? 'group-hover:rotate-12 transition-transform' : ''} />
                              {selectedPaymentMethod ? t('par_confirm_payment') : t('par_pay_now')}
                           </button>
                        </>
                     ) : (
                        <div className="p-8 bg-emerald-50 border-4 border-dashed border-emerald-200 rounded-[2.5rem] text-center space-y-5 animate-view">
                           <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl"><CheckCircle size={40} /></div>
                           <h4 className="text-3xl font-black text-emerald-900">{t('par_payment_success')}</h4>
                           <p className="font-bold text-emerald-700 text-lg">{t('inv_success_trx')}</p>
                           <button onClick={() => setShowReceipt(true)} className="flex items-center gap-3 mx-auto px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black text-xs shadow-lg hover:bg-emerald-700 transition-colors">
                              <Printer size={18} /> {t('par_print_receipt')}
                           </button>
                        </div>
                     )}
                  </div>
               </div>

               {/* سجل المدفوعات */}
               <div className="glass-card p-10 space-y-8 bg-white border border-slate-100 no-print shadow-sm">
                  <h3 className="font-black text-2xl border-b pb-6 text-slate-900 flex items-center gap-3"><History size={24} className="text-indigo-600" /> {t('par_history')}</h3>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
                     <PaymentRow date="01 مايو 2024" amount="650 ج.م" status="Paid" refNo="RC-1102" />
                     <PaymentRow date="01 ابريل 2024" amount="650 ج.م" status="Paid" refNo="RC-1055" />
                     <PaymentRow date="01 مارس 2024" amount="650 ج.م" status="Paid" refNo="RC-0988" />
                     <PaymentRow date="01 فبراير 2024" amount="500 ج.م" status="Paid" refNo="RC-0821" />
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                     <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest leading-relaxed">{t('par_financial_disclaimer')}</p>
                  </div>
               </div>
            </div>

            {/* نافذة الإيصال الرسمي */}
            {showReceipt && (
               <div className="fixed inset-0 z-[1000] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6 no-print" onClick={() => setShowReceipt(false)}>
                  <div className="glass-card w-full max-w-2xl p-12 bg-white animate-view relative overflow-hidden border-[10px] border-slate-50 rounded-[4rem]" onClick={e => e.stopPropagation()}>
                     <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 -mr-20 -mt-20 rounded-full"></div>
                     <button onClick={() => setShowReceipt(false)} className="absolute top-8 left-8 p-3 text-slate-300 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"><X size={32} /></button>

                     <div className="text-center space-y-8 border-b-2 border-slate-100 pb-12">
                        <div className="flex justify-center mb-4">
                           <img src={systemLogo} className="h-24 w-24 object-contain" alt="Logo" />
                        </div>
                        <div>
                           <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900 italic">AL-AQRAB OFFICIAL RECEIPT</h3>
                           <p className="text-[11px] font-black text-slate-400 tracking-[0.4em] mt-2 uppercase">{t('par_official_receipt_subtitle')}</p>
                        </div>
                        <div className="inline-flex items-center gap-3 px-8 py-3 bg-emerald-50 text-emerald-600 rounded-full font-black text-sm border border-emerald-100 shadow-inner">
                           <div className="w-2 h-2 bg-emerald-500 rounded-full"></div> {t('par_paid_status')}
                        </div>
                     </div>

                     <div className="py-10 space-y-5 text-base font-bold text-slate-600">
                        <div className="flex justify-between border-b border-slate-50 pb-3"><span>{t('student_name')}</span><span className="text-slate-950 font-black">{student.firstName} {student.lastName}</span></div>
                        <div className="flex justify-between border-b border-slate-50 pb-3"><span>{t('acc_student_code')}</span><span className="text-indigo-600 font-black">{student.code}</span></div>
                        <div className="flex justify-between border-b border-slate-50 pb-3"><span>{t('transaction_id')}</span><span className="text-slate-950 font-mono tracking-widest uppercase">TX-S-0098224</span></div>
                        <div className="flex justify-between border-b border-slate-50 pb-3"><span>{t('payment_date')}</span><span className="text-slate-950">{new Date().toLocaleDateString('ar-EG')}</span></div>
                        <div className="flex justify-between border-b border-slate-50 pb-3"><span>{t('payment_method')}</span><span className="text-slate-950">بطاقة بنكية / محفظة إلكترونية</span></div>
                        <div className="flex justify-between pt-10">
                           <span className="text-2xl font-black text-slate-900 uppercase">{t('total_paid')}</span>
                           <span className="text-5xl font-black text-indigo-700 tabular-nums">{(student.subscriptionAmount || 650).toLocaleString()} <span className="text-xl">{t('acc_currency')}</span></span>
                        </div>
                     </div>

                     <div className="flex gap-6 mt-8 no-print">
                        <button onClick={() => window.print()} className="flex-1 py-5 bg-slate-950 text-white rounded-[1.75rem] font-black flex items-center justify-center gap-4 shadow-3xl hover:bg-black active:scale-95 transition-all">
                           <Printer size={24} /> {t('par_print_official')}
                        </button>
                        <button onClick={() => setShowReceipt(false)} className="px-10 py-5 bg-slate-100 text-slate-500 rounded-[1.75rem] font-black hover:bg-slate-200 transition-all">{t('close')}</button>
                     </div>

                     <p className="text-[10px] text-center text-slate-400 mt-12 italic font-bold leading-relaxed">
                        {t('par_receipt_footer')}
                     </p>
                  </div>
               </div>
            )}

            {/* نسخة الطباعة - تظهر فقط عند الضغط على زر الطباعة */}
            <div className="hidden print:block p-16 bg-white text-right border-[10px] border-black rounded-none min-h-screen">
               <div className="flex justify-between items-center border-b-8 border-black pb-12 mb-12">
                  <img src={systemLogo} className="h-32 w-32 object-contain" alt="logo" />
                  <div className="text-center">
                     <h1 className="text-6xl font-black uppercase tracking-tighter mb-2">{systemName}</h1>
                     <p className="text-2xl font-bold mt-2 border-2 border-black inline-block px-10 py-2">{t('par_receipt')}</p>
                  </div>
                  <div className="text-left font-black text-sm">
                     <p>رقم السند: {Math.floor(Math.random() * 1000000)}</p>
                     <p>التاريخ: {new Date().toLocaleDateString('ar-EG')}</p>
                     <p>توقيت الدفع: {new Date().toLocaleTimeString('ar-EG')}</p>
                  </div>
               </div>
               <div className="space-y-10 text-3xl font-bold leading-relaxed">
                  <p>{t('par_receipt_body_1')} <span className="underline font-black">{student.firstName} {student.lastName}</span></p>
                  <p>{t('acc_student_code')}: <span className="underline font-black">{student.code}</span></p>
                  <p>{t('par_receipt_amount')} <span className="text-6xl font-black">{(student.subscriptionAmount || 650).toLocaleString()} {t('acc_currency')}</span> {t('par_only')}</p>
                  <p>{t('par_for_value')} <span className="underline font-black">{t('par_subscription_desc')}</span></p>
               </div>
               <div className="mt-40 flex justify-between items-end px-12">
                  <div className="text-center w-64 border-t-4 border-black pt-4 font-black text-2xl">{t('par_employee_signature')}</div>
                  <div className="text-center w-64 border-t-4 border-black pt-4 font-black text-2xl">{t('par_digital_seal')}</div>
               </div>
               <div className="mt-20 text-center opacity-30 text-xs font-black">Generated by ALEAQRAB ERP - SYSTEM SECURED ID: {student.id}</div>
            </div>
         </div>
      );
   };

   return (
      <div className="pb-24">
         {mode === 'overview' && renderOverview()}
         {mode === 'academic_results' && renderAcademic()}
         {mode === 'ai_analysis' && renderAIAnalysis()}
         {mode === 'financial_records' && renderFinancials()}
      </div>
   );
};

const SummaryCard = ({ label, val, icon, color, bg, trend }: any) => (
   <div className="glass-card p-10 flex flex-col gap-6 group hover:shadow-2xl transition-all bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
      <div className="flex justify-between items-start">
         <div className={`p-5 ${bg} ${color} rounded-[2rem] group-hover:scale-110 transition-transform shadow-inner`}>
            {React.cloneElement(icon as React.ReactElement<any>, { size: 36 })}
         </div>
         <div className="text-left">
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full uppercase border border-emerald-100">{trend}</span>
         </div>
      </div>
      <div>
         <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
         <p className={`text-5xl font-black ${color} tabular-nums tracking-tighter`}>{val}</p>
      </div>
   </div>
);

const PaymentRow = ({ date, amount, status, refNo }: any) => {
   const { t } = useAppContext();
   return (
      <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[2.5rem] border-2 border-transparent hover:border-indigo-100 hover:bg-white transition-all group shadow-xs">
         <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-50"><CheckCircle size={24} /></div>
            <div>
               <p className="font-black text-slate-900 text-lg">{date}</p>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('transaction_id')}: {refNo}</p>
            </div>
         </div>
         <div className="flex items-center gap-8">
            <span className="font-black text-xl text-slate-700 tabular-nums">{amount}</span>
            <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 group-hover:text-indigo-600 transition-all shadow-sm hover:scale-110" title={t('par_download_receipt')}><Download size={20} /></button>
         </div>
      </div>
   );
};

export default ParentView;
