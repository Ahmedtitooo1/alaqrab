
import React, { useState, useEffect } from 'react';
import {
    User, MessageCircle, AlertCircle, FileCheck, DollarSign, Activity,
    Award, Star, ShieldCheck, HeartPulse, BrainCircuit, TrendingUp,
    Printer, Calendar, ArrowRight, CheckCircle, FileText, Download,
    Sparkles, Zap, Bell, CreditCard, X, Briefcase, Megaphone, UserCircle,
    FileBadge, Receipt, History, Wallet, ArrowDownRight, CreditCard as CardIcon, List,
    UploadCloud, Banknote
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { UserRole } from '../../types';

interface ParentDashboardProps {
    onNavigate: (tab: string) => void;
    mode?: 'overview' | 'academic_results' | 'ai_analysis' | 'financial_records' | 'behavior';
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ onNavigate, mode = 'overview' }) => {
    const { lang, user, systemName, systemLogo, announcements, allUsers, addNotification, startSimulation, addPaymentRequest, paymentRequests } = useAppContext();
    const isRtl = lang === 'ar';

    const [isPaid, setIsPaid] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [selectedReceiptData, setSelectedReceiptData] = useState<any>(null);

    const [transferData, setTransferData] = useState({
        senderName: '',
        amount: 650,
        notes: '',
        refNo: '',
        receiptImg: ''
    });

    // Get Student Data
    const student = allUsers.find(u => u.role === UserRole.STUDENT) || {
        firstName: "ياسين",
        lastName: "محمود",
        code: "STD-1001",
        subscriptionAmount: 650,
        nextRenewalDate: "2024-06-01",
        username: "std_demo",
        id: "std_demo_id"
    };

    const myPaymentRequests = paymentRequests ? paymentRequests.filter(req => req.studentId === student.id) : [];
    const hasPendingRequest = myPaymentRequests.some(req => req.status === 'pending');
    const isSubscriptionActive = !hasPendingRequest && (student.paidAmount || 0) >= (student.subscriptionAmount || 0);

    const handlePrintReceipt = (payment: any) => {
        setSelectedReceiptData(payment);
        setShowReceipt(true);
    };

    // Mock AI Data
    const mockAiData = {
        trend: [
            { subject: 'الفيزياء', score: 92, improvement: true, label: 'تقدم ملحوظ' },
            { subject: 'الرياضيات', score: 88, improvement: true, label: 'تحسن طفيف' },
            { subject: 'الكيمياء', score: 84, improvement: false, label: 'تراجع بسيط' }
        ],
        eduSuggestions: [
            "يحتاج الطالب لتركيز أكبر في ميكانيكا الكم (الفيزياء) لتحسين الدرجة النهائية.",
            "مستوى ممتاز في الجبر الخطي، ينصح بحل مسائل إثرائية لتعزيز الموهبة.",
            "يفضل مراجعة المعادلات الكيميائية قبل الاختبار القادم لتجنب الأخطاء الشائعة."
        ],
        behSuggestions: [
            "سجل حضور ممتاز هذا الشهر (100%)، مما يعكس انضباطاً عالياً.",
            "لوحظ بعض التشتت في الحصة الأخيرة (الخميس)، يرجى التأكد من الحصول على قسط كافٍ من النوم.",
            "تفاعل إيجابي جداً مع الزملاء في المشاريع الجماعية."
        ]
    };

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
                    <h1 className="text-4xl font-black mb-2 text-slate-900 tracking-tight">مرحباً ولي أمر الطالب/ {student.firstName} {student.lastName}</h1>
                    <p className="text-slate-500 font-bold text-lg">نحن نهتم بمتابعة أدق تفاصيل رحلة ابنكم التعليمية والمالية.</p>
                    <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
                        <div className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black border border-indigo-100">{student.code}</div>
                        <button onClick={() => startSimulation(student)} className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-xs font-black border border-slate-900 hover:bg-slate-700 transition-colors">دخول الحساب كمحاكاة</button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <SummaryCard label="المعدل التراكمي" val="96.8%" icon={<Award />} color="text-amber-500" bg="bg-amber-50" trend="+2.5% من الشهر الماضي" />
                <SummaryCard label="نسبة الحضور والالتزام" val="99%" icon={<ShieldCheck />} color="text-emerald-500" bg="bg-emerald-50" trend="مثالي" />
                <SummaryCard
                    label="حالة الاشتراك"
                    val={hasPendingRequest ? "قيد المراجعة" : (isSubscriptionActive ? "نشط" : "يستحق التجديد")}
                    icon={<CreditCard />}
                    color={hasPendingRequest ? "text-amber-600" : (isSubscriptionActive ? "text-emerald-600" : "text-rose-600")}
                    bg={hasPendingRequest ? "bg-amber-50" : (isSubscriptionActive ? "bg-emerald-50" : "bg-rose-50")}
                    trend={hasPendingRequest ? "جارٍ التحقق" : (isSubscriptionActive ? "مدفوع" : "غير مدفوع")}
                />
            </div>
        </div>
    );

    const renderAIAnalysis = () => (
        <div className="space-y-10 animate-view">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Sparkles className="text-amber-500" /> التحليل الذكي للأداء
                    </h2>
                    <p className="text-slate-500 font-bold">تقرير تفصيلي يوضح نقاط القوة وفرص التحسين (بيانات تجريبية).</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
                        <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-slate-900"><TrendingUp className="text-indigo-600" /> مؤشر الأداء العام</h3>
                        <div className="space-y-6">
                            {mockAiData.trend.map((item, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between items-center text-sm font-black text-slate-700">
                                        <span>{item.subject}</span>
                                        <span className={item.improvement ? 'text-emerald-600' : 'text-rose-600'}>{item.label} ({item.score}%)</span>
                                    </div>
                                    <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${item.improvement ? 'bg-indigo-600' : 'bg-rose-500'}`}
                                            style={{ width: `${item.score}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-[2.5rem] shadow-sm">
                            <h4 className="font-black text-lg text-indigo-900 mb-4 flex items-center gap-2"><BrainCircuit size={20} /> مقترحات أكاديمية</h4>
                            <ul className="space-y-4">
                                {mockAiData.eduSuggestions.map((sug, idx) => (
                                    <li key={idx} className="text-sm font-bold text-indigo-800 leading-relaxed flex items-start gap-2">
                                        <span className="mt-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full flex-shrink-0"></span>
                                        {sug}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-[2.5rem] shadow-sm">
                            <h4 className="font-black text-lg text-emerald-900 mb-4 flex items-center gap-2"><HeartPulse size={20} /> ملاحظات سلوكية</h4>
                            <ul className="space-y-4">
                                {mockAiData.behSuggestions.map((sug, idx) => (
                                    <li key={idx} className="text-sm font-bold text-emerald-800 leading-relaxed flex items-start gap-2">
                                        <span className="mt-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0"></span>
                                        {sug}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-10 bg-slate-900 text-white rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl"></div>
                    <h3 className="text-xl font-black mb-6 flex items-center gap-3"><FileText size={24} className="text-amber-400" /> تقرير الذكاء الاصطناعي</h3>
                    <div className="space-y-6 text-sm text-slate-300 font-bold leading-relaxed">
                        <p>تم استخراج هذا التقرير بناءً على تحليل 15 اختبار و 20 واجب مدرسي.</p>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1">مستوى الذكاء التحليلي</p>
                            <p className="text-2xl font-black text-white">متقدم (A+)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderFinancials = () => (
        <div className="space-y-12 animate-view pb-24">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 no-print">
                <div className="flex items-center gap-6">
                    <div className="p-5 bg-rose-600 text-white rounded-[2rem] shadow-xl">
                        <Wallet size={40} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Payments & Wallet</h2>
                        <p className="text-slate-500 font-bold">إدارة الاشتراكات وسجل المدفوعات.</p>
                    </div>
                </div>
                {hasPendingRequest && (
                    <div className="px-6 py-3 bg-amber-50 text-amber-600 rounded-full text-xs font-black border border-amber-100 flex items-center gap-3">
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></div> طلبك قيد المراجعة
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="glass-card p-12 space-y-10 border-t-[12px] border-indigo-600 bg-white shadow-2xl no-print relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 -mr-20 -mt-20 rounded-full"></div>

                    <div className="relative z-10 border-b pb-6">
                        <h3 className="text-2xl font-black text-slate-900 italic">RENEW SUBSCRIPTION</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase mt-2">تجديد الاشتراك الشهري للخدمة</p>
                    </div>

                    {hasPendingRequest ? (
                        <div className="p-8 bg-amber-50 border-2 border-dashed border-amber-200 rounded-[2.5rem] text-center space-y-5">
                            <div className="w-16 h-16 bg-amber-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg"><Activity size={32} /></div>
                            <h4 className="text-xl font-black text-amber-900">جاري معالجة الطلب</h4>
                            <p className="font-bold text-amber-700 text-sm">تم إرسال بيانات الدفع الخاصة بك بنجاح. سنقوم بإعلامك فور اعتماد المحاسب للعملية.</p>
                            <p className="text-xs font-mono bg-white inline-block px-3 py-1 rounded border border-amber-200">{myPaymentRequests.find(r => r.status === 'pending')?.refNo || '---'}</p>
                        </div>
                    ) : (
                        <div className="space-y-8 relative z-10">
                            <div className="flex justify-between items-start">
                                <div className="p-5 bg-indigo-50 text-indigo-600 rounded-[2rem] shadow-inner"><DollarSign size={40} /></div>
                                <div className="text-right">
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">قيمة الاشتراك المطلوب</p>
                                    <h4 className="text-6xl font-black text-slate-900 tabular-nums">{(student.subscriptionAmount || 650).toLocaleString()} <span className="text-xl font-bold opacity-20">EGP</span></h4>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowTransferModal(true)}
                                className="w-full py-6 bg-slate-950 text-white rounded-[2.5rem] font-black text-xl shadow-3xl hover:scale-[1.02] transition-all flex items-center justify-center gap-4 active:scale-95 group"
                            >
                                <Banknote size={28} /> تجديد الاشتراك الآن
                            </button>
                        </div>
                    )}
                </div>

                <div className="glass-card p-10 space-y-8 bg-white border border-slate-100 no-print shadow-sm">
                    <h3 className="font-black text-2xl border-b pb-6 text-slate-900 flex items-center gap-3"><History size={24} className="text-indigo-600" /> سجل المدفوعات السابق</h3>

                    {myPaymentRequests.length > 0 ? (
                        <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
                            {myPaymentRequests.slice().reverse().map((req, idx) => (
                                <div key={idx} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-3xl border-2 border-transparent hover:border-indigo-100 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm ${req.status === 'approved' ? 'bg-emerald-100 text-emerald-600 border-emerald-200' : 'bg-amber-100 text-amber-600 border-amber-200'}`}>
                                            {req.status === 'approved' ? <CheckCircle size={20} /> : <Activity size={20} />}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 text-sm">{new Date(req.date).toLocaleDateString('ar-EG')}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">REF: {req.refNo}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-black text-lg text-slate-700 tabular-nums">{req.amount}</span>
                                        {req.status === 'approved' && (
                                            <button
                                                onClick={() => handlePrintReceipt(req)}
                                                className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all shadow-sm"
                                                title="طباعة الإيصال"
                                            >
                                                <Printer size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-slate-400 font-bold text-sm">لا توجد سجلات دفع سابقة.</div>
                    )}
                </div>
            </div>

            {/* Transfer Modal */}
            {showTransferModal && (
                <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-[3rem] p-8 shadow-2xl animate-view relative border-[8px] border-slate-100">
                        <button onClick={() => setShowTransferModal(false)} className="absolute top-6 left-6 p-2 bg-slate-100 rounded-full hover:bg-rose-100 hover:text-rose-600 transition-all"><X size={20} /></button>
                        <h3 className="text-2xl font-black text-slate-900 mb-2 text-center">بيانات الدفع والتحويل</h3>

                        <div className="space-y-4 mt-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 mb-1 block">اسم المرسل</label>
                                <input
                                    className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold border border-slate-200 focus:border-indigo-500 outline-none"
                                    value={transferData.senderName}
                                    onChange={e => setTransferData({ ...transferData, senderName: e.target.value })}
                                    placeholder="الاسم الثلاثي"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 mb-1 block">المبلغ</label>
                                <input
                                    type="number"
                                    className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold border border-slate-200 focus:border-indigo-500 outline-none"
                                    value={transferData.amount}
                                    onChange={e => setTransferData({ ...transferData, amount: Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 mb-1 block">رقم المرجع</label>
                                <input
                                    className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold border border-slate-200 focus:border-indigo-500 outline-none font-mono"
                                    value={transferData.refNo}
                                    onChange={e => setTransferData({ ...transferData, refNo: e.target.value })}
                                />
                            </div>

                            <div className="relative group cursor-pointer border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-2xl p-4 flex flex-col items-center justify-center bg-slate-50 transition-colors" onClick={() => document.getElementById('receipt-upload')?.click()}>
                                <input type="file" id="receipt-upload" className="hidden" onChange={e => setTransferData({ ...transferData, receiptImg: e.target.files?.[0]?.name || '' })} />
                                <UploadCloud className="text-slate-400 mb-2 group-hover:text-indigo-600" />
                                <p className="text-[10px] font-black text-slate-400 group-hover:text-indigo-600">{transferData.receiptImg || 'اضغط لرفع صورة الإيصال'}</p>
                            </div>

                            <button
                                onClick={() => {
                                    if (!transferData.senderName || !transferData.refNo) return alert("يرجى إكمال البيانات");
                                    addPaymentRequest({
                                        studentId: student.id,
                                        studentName: `${student.firstName} ${student.lastName}`,
                                        amount: Number(transferData.amount),
                                        refNo: transferData.refNo,
                                        date: new Date().toISOString(),
                                        receiptImg: transferData.receiptImg,
                                        senderName: transferData.senderName,
                                        notes: transferData.notes,
                                        method: 'manual_transfer'
                                    });
                                    setShowTransferModal(false);
                                }}
                                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black shadow-xl hover:bg-indigo-700 transition-all"
                            >
                                إرسال الطلب
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Receipt Print View */}
            {showReceipt && selectedReceiptData && (
                <div className="hidden print:block p-16 bg-white text-right border-[10px] border-black rounded-none min-h-screen">
                    <div className="flex justify-between items-center border-b-8 border-black pb-12 mb-12">
                        <img src={systemLogo} className="h-32 w-32 object-contain" alt="logo" />
                        <div className="text-center">
                            <h1 className="text-6xl font-black uppercase tracking-tighter mb-2">{systemName}</h1>
                            <p className="text-2xl font-bold mt-2 border-2 border-black inline-block px-10 py-2">سند تحصيل مالي إلكتروني</p>
                        </div>
                        <div className="text-left font-black text-sm">
                            <p>رقم السند: {selectedReceiptData.refNo}</p>
                            <p>التاريخ: {new Date(selectedReceiptData.date).toLocaleDateString('ar-EG')}</p>
                        </div>
                    </div>
                    <div className="space-y-10 text-3xl font-bold leading-relaxed">
                        <p>استلمنا من السيد/ة: <span className="underline font-black">{selectedReceiptData.senderName || 'ولي الأمر'}</span></p>
                        <p>بخصوص الطالب/ة: <span className="underline font-black">{student.firstName} {student.lastName}</span></p>
                        <p>مبلغاً وقدره: <span className="text-6xl font-black">{Number(selectedReceiptData.amount).toLocaleString()} ج.م</span></p>
                    </div>
                    <div className="mt-40 flex justify-between items-end px-12">
                        <div className="text-center w-64 border-t-4 border-black pt-4 font-black text-2xl">توقيع المحاسب</div>
                        <div className="text-center w-64 border-t-4 border-black pt-4 font-black text-2xl">الختم الرسمي</div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="pb-24">
            {mode === 'overview' && renderOverview()}
            {mode === 'academic_results' && (
                <div className="p-10 text-center"><p className="text-slate-500 font-bold">لا توجد نتائج حديثة لعرضها.</p></div>
            )}
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

export default ParentDashboard;
