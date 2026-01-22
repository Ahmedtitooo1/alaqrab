
import React, { useState, useEffect } from 'react';
import { FinanceTransaction, FinanceConfig } from '../../../types';
import { getTransactions, addTransaction, getFinanceConfig } from '../../services/mockFinance';
import FinanceSettings from './FinanceSettings';
import JournalEntries from './JournalEntries';
import FinancialReports from './FinancialReports';
import { Plus, Printer, Download, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';

const FinanceDashboard: React.FC = () => {
    const { user } = useAppContext();
    const [view, setView] = useState<'transactions' | 'settings' | 'journal' | 'reports'>('transactions');
    const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
    const [config, setConfig] = useState<FinanceConfig | null>(null); // Should load
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        description: '',
        amount: 0,
        type: 'INCOME' as 'INCOME' | 'EXPENSE',
        category: 'عام'
    });

    const refreshData = () => {
        setTransactions(getTransactions());
        setConfig(getFinanceConfig());
    };

    useEffect(() => {
        refreshData();
    }, [view]); // Refresh when switching views too

    // Calc Stats
    const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
    const netProfit = totalIncome - totalExpense;

    const handleAdd = () => {
        if (!formData.description || formData.amount <= 0 || !config) return;

        addTransaction({
            description: formData.description,
            amount: Number(formData.amount),
            type: formData.type,
            category: formData.category,
            date: new Date().toISOString().split('T')[0]
        }, config);

        setShowModal(false);
        setFormData({ description: '', amount: 0, type: 'INCOME', category: 'عام' });
        refreshData();
    };

    const handlePrint = (t: FinanceTransaction) => {
        const w = window.open('', '_blank');
        if (w) {
            w.document.write(`<html><body dir="rtl" style="font-family:sans-serif; padding:20px; text-align:center;">
                <h1>فاتورة ضريبية مبسطة</h1>
                <h2>${config?.companyName}</h2>
                <hr/>
                <p>رقم الفاتورة: ${t.id}</p>
                <p>التاريخ: ${t.date}</p>
                <h3 style="margin:20px 0;">${t.description}</h3>
                <p>المبلغ الأساسي: ${t.baseAmount}</p>
                <p>الضريبة (${config?.vatRate}%): ${t.taxAmount}</p>
                <h1>الإجمالي: ${t.amount} ${config?.currency}</h1>
                <hr/>
                <p>الرقم الضريبي: ${config?.taxNumber}</p>
            </body></html>`);
            w.print();
        }
    };

    return (
        <div className="p-8 space-y-8 animate-view min-h-screen bg-slate-50/50">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="إجمالي الدخل"
                    value={totalIncome}
                    icon={<TrendingUp />}
                    color="text-emerald-600"
                    bg="bg-emerald-50"
                    currency={config?.currency}
                />
                <StatCard
                    label="المصروفات"
                    value={totalExpense}
                    icon={<TrendingDown />}
                    color="text-rose-600"
                    bg="bg-rose-50"
                    currency={config?.currency}
                />
                <StatCard
                    label="وصافي الربح"
                    value={netProfit}
                    icon={<DollarSign />}
                    color={netProfit >= 0 ? "text-indigo-600" : "text-amber-600"}
                    bg={netProfit >= 0 ? "bg-indigo-50" : "bg-amber-50"}
                    currency={config?.currency}
                />
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex gap-2">
                    <button
                        onClick={() => setView('transactions')}
                        className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${view === 'transactions' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        سجل العمليات
                    </button>
                    <button
                        onClick={() => setView('journal')}
                        className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${view === 'journal' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        📒 القيود اليومية
                    </button>
                    <button
                        onClick={() => setView('reports')}
                        className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${view === 'reports' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        📈 التقارير المالية
                    </button>
                    <button
                        onClick={() => setView('settings')}
                        className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${view === 'settings' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        الإعدادات المالية
                    </button>
                </div>

                {view === 'transactions' && (
                    <div className="flex gap-3">
                        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-indigo-700">
                            <Plus size={16} /> عملية جديدة
                        </button>
                        <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-slate-50">
                            <Download size={16} /> تصدير Excel
                        </button>
                    </div>
                )}
            </div>

            {/* Content Area */}
            {view === 'settings' ? (
                <FinanceSettings />
            ) : view === 'journal' ? (
                <JournalEntries institutionId={user?.institutionId} userName={`${user?.firstName} ${user?.lastName}`} />
            ) : view === 'reports' ? (
                <FinancialReports institutionId={user?.institutionId} />
            ) : (
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-right">
                        <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400">
                            <tr>
                                <th className="p-6">التاريخ</th>
                                <th className="p-6">الوصف</th>
                                <th className="p-6">النوع</th>
                                <th className="p-6">القيمة (شامل الضريبة)</th>
                                <th className="p-6 text-center">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center text-slate-400 font-bold">لا توجد عمليات مسجلة حتى الآن</td>
                                </tr>
                            )}
                            {transactions.map(t => (
                                <tr key={t.id} className="hover:bg-indigo-50/10 transition-colors">
                                    <td className="p-6 font-bold text-sm text-slate-600">{t.date}</td>
                                    <td className="p-6 font-black text-slate-800">{t.description}</td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black ${t.type === 'INCOME' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                            {t.type === 'INCOME' ? 'إيراد' : 'مصروف'}
                                        </span>
                                    </td>
                                    <td className="p-6 font-black text-slate-900">{t.amount.toLocaleString()} <span className="text-[10px] text-slate-400">{config?.currency}</span></td>
                                    <td className="p-6 text-center">
                                        <button onClick={() => handlePrint(t)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="طباعة فاتورة">
                                            <Printer size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* NEW TRANSACTION MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-3xl p-8 animate-view">
                        <h3 className="text-xl font-black mb-6">تسجيل عملية جديدة</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">نوع العملية</label>
                                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                                    <button
                                        onClick={() => setFormData({ ...formData, type: 'INCOME' })}
                                        className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${formData.type === 'INCOME' ? 'bg-emerald-500 text-white shadow' : 'text-slate-500'}`}
                                    >
                                        إيراد (قبض)
                                    </button>
                                    <button
                                        onClick={() => setFormData({ ...formData, type: 'EXPENSE' })}
                                        className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${formData.type === 'EXPENSE' ? 'bg-rose-500 text-white shadow' : 'text-slate-500'}`}
                                    >
                                        مصروف (دفع)
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">وصف العملية</label>
                                <input
                                    className="w-full p-3 bg-slate-50 rounded-xl font-bold border border-transparent focus:border-indigo-500 outline-none"
                                    placeholder="مثال: رسوم تسجيل طالب / فاتورة كهرباء"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">المبلغ</label>
                                    <input
                                        type="number"
                                        className="w-full p-3 bg-slate-50 rounded-xl font-bold border border-transparent focus:border-indigo-500 outline-none"
                                        value={formData.amount}
                                        onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">التصنيف</label>
                                    <select
                                        className="w-full p-3 bg-slate-50 rounded-xl font-bold border border-transparent focus:border-indigo-500 outline-none"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option>عام</option>
                                        <option>رسوم دراسية</option>
                                        <option>رواتب</option>
                                        <option>تشغيل وصيانة</option>
                                        <option>نثريات</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button onClick={handleAdd} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-700">حفظ وترحيل</button>
                                <button onClick={() => setShowModal(false)} className="px-6 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold hover:bg-slate-200">إلغاء</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ label, value, icon, color, bg, currency }: any) => (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all">
        <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <h4 className={`text-3xl font-black ${color} tabular-nums`}>{value.toLocaleString()} <span className="text-xs text-slate-300">{currency}</span></h4>
        </div>
        <div className={`p-4 ${bg} ${color} rounded-2xl group-hover:scale-110 transition-transform`}>
            {React.cloneElement(icon, { size: 24 })}
        </div>
    </div>
);

export default FinanceDashboard;
