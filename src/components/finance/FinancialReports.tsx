import * as React from 'react';
import { useState, useEffect } from 'react';
import { FileText, TrendingUp, Scale, Printer, Download, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import {
    getTrialBalance,
    getIncomeStatement,
    getBalanceSheet,
    getAccounts
} from '../../services/mockAccounting';
import { TrialBalanceRow, IncomeStatement, BalanceSheet } from '../../types/accounting';

interface FinancialReportsProps {
    institutionId?: string;
}

const FinancialReports: React.FC<FinancialReportsProps> = ({ institutionId = 'inst-1' }) => {
    const [activeTab, setActiveTab] = useState<'trial' | 'income' | 'balance'>('trial');
    const [trialBalance, setTrialBalance] = useState<TrialBalanceRow[]>([]);
    const [incomeStatement, setIncomeStatement] = useState<IncomeStatement | null>(null);
    const [balanceSheet, setBalanceSheet] = useState<BalanceSheet | null>(null);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
    const [asOfDate, setAsOfDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = () => {
        setTrialBalance(getTrialBalance());
        setIncomeStatement(getIncomeStatement(fromDate || undefined, toDate));
        setBalanceSheet(getBalanceSheet(asOfDate));
    };

    const handlePrint = () => {
        window.print();
    };

    const totalTrialDebit = trialBalance.reduce((sum, row) => sum + row.debitBalance, 0);
    const totalTrialCredit = trialBalance.reduce((sum, row) => sum + row.creditBalance, 0);
    const trialBalanced = Math.abs(totalTrialDebit - totalTrialCredit) < 0.01;

    return (
        <div className="space-y-10 animate-view text-right" dir="rtl">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-10 rounded-[3rem] border shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="p-5 bg-indigo-50 text-indigo-700 rounded-[1.75rem] border border-indigo-100 shadow-inner">
                        <FileText size={40} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black">📈 التقارير المالية الختامية</h2>
                        <p className="text-slate-500 font-bold">ميزان المراجعة، قائمة الدخل، والميزانية العمومية</p>
                    </div>
                </div>
                <button
                    onClick={handlePrint}
                    className="px-10 py-5 bg-slate-950 text-white rounded-2xl font-black text-xs flex items-center gap-3 shadow-xl hover:bg-indigo-700 transition-all"
                >
                    <Printer size={20} />
                    طباعة التقرير
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 bg-white p-3 rounded-[2.5rem] border shadow-sm">
                <button
                    onClick={() => setActiveTab('trial')}
                    className={`flex-1 py-5 rounded-[2rem] font-black text-sm flex items-center justify-center gap-3 transition-all ${activeTab === 'trial'
                            ? 'bg-slate-900 text-white shadow-xl'
                            : 'bg-transparent text-slate-600 hover:bg-slate-50'
                        }`}
                >
                    <Scale size={20} />
                    ميزان المراجعة
                </button>
                <button
                    onClick={() => setActiveTab('income')}
                    className={`flex-1 py-5 rounded-[2rem] font-black text-sm flex items-center justify-center gap-3 transition-all ${activeTab === 'income'
                            ? 'bg-slate-900 text-white shadow-xl'
                            : 'bg-transparent text-slate-600 hover:bg-slate-50'
                        }`}
                >
                    <TrendingUp size={20} />
                    قائمة الدخل
                </button>
                <button
                    onClick={() => setActiveTab('balance')}
                    className={`flex-1 py-5 rounded-[2rem] font-black text-sm flex items-center justify-center gap-3 transition-all ${activeTab === 'balance'
                            ? 'bg-slate-900 text-white shadow-xl'
                            : 'bg-transparent text-slate-600 hover:bg-slate-50'
                        }`}
                >
                    <FileText size={20} />
                    الميزانية العمومية
                </button>
            </div>

            {/* Trial Balance */}
            {activeTab === 'trial' && (
                <div className="glass-panel bg-white rounded-[3rem] shadow-sm border p-10 space-y-8">
                    <div className="flex justify-between items-center pb-6 border-b">
                        <h3 className="text-2xl font-black">ميزان المراجعة (Trial Balance)</h3>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={loadReports}
                                className="px-6 py-3 bg-indigo-50 text-indigo-700 rounded-xl font-black text-xs hover:bg-indigo-600 hover:text-white transition-all"
                            >
                                تحديث
                            </button>
                            {trialBalanced ? (
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black">
                                    <CheckCircle size={16} />
                                    متوازن
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 rounded-xl text-xs font-black">
                                    <AlertCircle size={16} />
                                    غير متوازن!
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead>
                                <tr className="bg-slate-900 text-white text-[11px] font-black uppercase">
                                    <th className="p-6">رمز الحساب</th>
                                    <th className="p-6">اسم الحساب</th>
                                    <th className="p-6 text-center">النوع</th>
                                    <th className="p-6 text-center">الرصيد المدين</th>
                                    <th className="p-6 text-center">الرصيد الدائن</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y font-bold text-sm">
                                {trialBalance.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-20 text-center text-slate-400 italic">
                                            لا توجد بيانات في ميزان المراجعة
                                        </td>
                                    </tr>
                                ) : (
                                    trialBalance.map((row, index) => (
                                        <tr key={index} className="hover:bg-slate-50 transition-all">
                                            <td className="p-6">
                                                <code className="font-mono text-xs font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
                                                    {row.accountCode}
                                                </code>
                                            </td>
                                            <td className="p-6 font-black text-slate-900">{row.accountName}</td>
                                            <td className="p-6 text-center">
                                                <span className={`px-3 py-1 rounded-lg text-xs font-black ${row.accountType === 'ASSET' ? 'bg-blue-50 text-blue-700' :
                                                        row.accountType === 'LIABILITY' ? 'bg-rose-50 text-rose-700' :
                                                            row.accountType === 'EQUITY' ? 'bg-purple-50 text-purple-700' :
                                                                row.accountType === 'REVENUE' ? 'bg-emerald-50 text-emerald-700' :
                                                                    'bg-amber-50 text-amber-700'
                                                    }`}>
                                                    {row.accountType}
                                                </span>
                                            </td>
                                            <td className="p-6 text-center font-black text-emerald-600 tabular-nums">
                                                {row.debitBalance > 0 ? row.debitBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
                                            </td>
                                            <td className="p-6 text-center font-black text-rose-600 tabular-nums">
                                                {row.creditBalance > 0 ? row.creditBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                            <tfoot className="bg-slate-100 border-t-4 border-slate-900">
                                <tr className="font-black text-lg">
                                    <td colSpan={3} className="p-6 text-left">الإجمالي</td>
                                    <td className="p-6 text-center text-emerald-700 tabular-nums">
                                        {totalTrialDebit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م
                                    </td>
                                    <td className="p-6 text-center text-rose-700 tabular-nums">
                                        {totalTrialCredit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}

            {/* Income Statement */}
            {activeTab === 'income' && incomeStatement && (
                <div className="glass-panel bg-white rounded-[3rem] shadow-sm border p-10 space-y-8">
                    <div className="flex justify-between items-center pb-6 border-b">
                        <h3 className="text-2xl font-black">قائمة الدخل (Income Statement)</h3>
                        <div className="flex gap-4 items-center">
                            <div className="flex gap-2 items-center">
                                <label className="text-xs font-bold text-slate-600">من:</label>
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => {
                                        setFromDate(e.target.value);
                                        setIncomeStatement(getIncomeStatement(e.target.value || undefined, toDate));
                                    }}
                                    className="p-2 bg-slate-50 rounded-lg text-xs font-bold border-2 border-transparent focus:border-indigo-500 outline-none"
                                />
                            </div>
                            <div className="flex gap-2 items-center">
                                <label className="text-xs font-bold text-slate-600">إلى:</label>
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => {
                                        setToDate(e.target.value);
                                        setIncomeStatement(getIncomeStatement(fromDate || undefined, e.target.value));
                                    }}
                                    className="p-2 bg-slate-50 rounded-lg text-xs font-bold border-2 border-transparent focus:border-indigo-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Revenue Section */}
                    <div className="space-y-6">
                        <div className="bg-emerald-50 p-8 rounded-3xl border-2 border-emerald-200">
                            <h4 className="text-xl font-black text-emerald-900 mb-6 flex items-center gap-3">
                                <TrendingUp className="text-emerald-600" />
                                الإيرادات (Revenues)
                            </h4>
                            <div className="space-y-3">
                                {incomeStatement.revenues.accounts.length === 0 ? (
                                    <p className="text-slate-500 text-sm italic">لا توجد إيرادات في هذه الفترة</p>
                                ) : (
                                    incomeStatement.revenues.accounts.map((acc, index) => (
                                        <div key={index} className="flex justify-between items-center p-4 bg-white rounded-2xl">
                                            <span className="font-black text-slate-900">{acc.name}</span>
                                            <div className="flex items-center gap-4">
                                                <code className="text-xs font-mono text-slate-400">{acc.code}</code>
                                                <span className="font-black text-emerald-700 tabular-nums text-lg">
                                                    {acc.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="mt-6 pt-6 border-t-2 border-emerald-300 flex justify-between items-center">
                                <span className="text-lg font-black text-emerald-900">إجمالي الإيرادات</span>
                                <span className="text-3xl font-black text-emerald-700 tabular-nums">
                                    {incomeStatement.revenues.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م
                                </span>
                            </div>
                        </div>

                        {/* Expenses Section */}
                        <div className="bg-rose-50 p-8 rounded-3xl border-2 border-rose-200">
                            <h4 className="text-xl font-black text-rose-900 mb-6 flex items-center gap-3">
                                <TrendingUp className="text-rose-600 rotate-180" />
                                المصروفات (Expenses)
                            </h4>
                            <div className="space-y-3">
                                {incomeStatement.expenses.accounts.length === 0 ? (
                                    <p className="text-slate-500 text-sm italic">لا توجد مصروفات في هذه الفترة</p>
                                ) : (
                                    incomeStatement.expenses.accounts.map((acc, index) => (
                                        <div key={index} className="flex justify-between items-center p-4 bg-white rounded-2xl">
                                            <span className="font-black text-slate-900">{acc.name}</span>
                                            <div className="flex items-center gap-4">
                                                <code className="text-xs font-mono text-slate-400">{acc.code}</code>
                                                <span className="font-black text-rose-700 tabular-nums text-lg">
                                                    {acc.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="mt-6 pt-6 border-t-2 border-rose-300 flex justify-between items-center">
                                <span className="text-lg font-black text-rose-900">إجمالي المصروفات</span>
                                <span className="text-3xl font-black text-rose-700 tabular-nums">
                                    {incomeStatement.expenses.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م
                                </span>
                            </div>
                        </div>

                        {/* Net Profit/Loss */}
                        <div className={`p-10 rounded-3xl border-4 ${incomeStatement.netProfit >= 0
                                ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-400'
                                : 'bg-gradient-to-br from-rose-50 to-rose-100 border-rose-400'
                            }`}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-black text-slate-600 uppercase mb-2">
                                        {incomeStatement.netProfit >= 0 ? 'صافي الربح (Net Profit)' : 'صافي الخسارة (Net Loss)'}
                                    </p>
                                    <p className="text-6xl font-black tabular-nums" style={{
                                        color: incomeStatement.netProfit >= 0 ? '#059669' : '#dc2626'
                                    }}>
                                        {Math.abs(incomeStatement.netProfit).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })} ج.م
                                    </p>
                                </div>
                                <div className={`p-8 rounded-3xl ${incomeStatement.netProfit >= 0 ? 'bg-emerald-600' : 'bg-rose-600'
                                    }`}>
                                    <TrendingUp
                                        size={64}
                                        className={`text-white ${incomeStatement.netProfit < 0 ? 'rotate-180' : ''}`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Balance Sheet */}
            {activeTab === 'balance' && balanceSheet && (
                <div className="glass-panel bg-white rounded-[3rem] shadow-sm border p-10 space-y-8">
                    <div className="flex justify-between items-center pb-6 border-b">
                        <h3 className="text-2xl font-black">الميزانية العمومية (Balance Sheet)</h3>
                        <div className="flex gap-4 items-center">
                            <div className="flex gap-2 items-center">
                                <label className="text-xs font-bold text-slate-600">كما في:</label>
                                <input
                                    type="date"
                                    value={asOfDate}
                                    onChange={(e) => {
                                        setAsOfDate(e.target.value);
                                        setBalanceSheet(getBalanceSheet(e.target.value));
                                    }}
                                    className="p-2 bg-slate-50 rounded-lg text-xs font-bold border-2 border-transparent focus:border-indigo-500 outline-none"
                                />
                            </div>
                            {balanceSheet.balanced ? (
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black">
                                    <CheckCircle size={16} />
                                    متوازنة
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 rounded-xl text-xs font-black">
                                    <AlertCircle size={16} />
                                    غير متوازنة!
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Assets */}
                        <div className="bg-blue-50 p-8 rounded-3xl border-2 border-blue-200 space-y-6">
                            <h4 className="text-2xl font-black text-blue-900 pb-4 border-b-2 border-blue-300">
                                الأصول (Assets)
                            </h4>
                            <div className="space-y-3">
                                {balanceSheet.assets.accounts.length === 0 ? (
                                    <p className="text-slate-500 text-sm italic">لا توجد أصول</p>
                                ) : (
                                    balanceSheet.assets.accounts.map((acc, index) => (
                                        <div key={index} className="flex justify-between items-center p-4 bg-white rounded-2xl">
                                            <div>
                                                <p className="font-black text-slate-900">{acc.name}</p>
                                                <code className="text-xs font-mono text-slate-400">{acc.code}</code>
                                            </div>
                                            <span className="font-black text-blue-700 tabular-nums text-lg">
                                                {acc.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="pt-6 border-t-2 border-blue-300 flex justify-between items-center">
                                <span className="text-lg font-black text-blue-900">إجمالي الأصول</span>
                                <span className="text-3xl font-black text-blue-700 tabular-nums">
                                    {balanceSheet.assets.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م
                                </span>
                            </div>
                        </div>

                        {/* Liabilities + Equity */}
                        <div className="space-y-6">
                            {/* Liabilities */}
                            <div className="bg-rose-50 p-8 rounded-3xl border-2 border-rose-200 space-y-6">
                                <h4 className="text-xl font-black text-rose-900 pb-4 border-b-2 border-rose-300">
                                    الخصوم (Liabilities)
                                </h4>
                                <div className="space-y-3">
                                    {balanceSheet.liabilities.accounts.length === 0 ? (
                                        <p className="text-slate-500 text-sm italic">لا توجد خصوم</p>
                                    ) : (
                                        balanceSheet.liabilities.accounts.map((acc, index) => (
                                            <div key={index} className="flex justify-between items-center p-4 bg-white rounded-2xl">
                                                <div>
                                                    <p className="font-black text-slate-900 text-sm">{acc.name}</p>
                                                    <code className="text-[10px] font-mono text-slate-400">{acc.code}</code>
                                                </div>
                                                <span className="font-black text-rose-700 tabular-nums">
                                                    {acc.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="pt-4 border-t-2 border-rose-300 flex justify-between items-center">
                                    <span className="font-black text-rose-900">الإجمالي</span>
                                    <span className="text-xl font-black text-rose-700 tabular-nums">
                                        {balanceSheet.liabilities.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م
                                    </span>
                                </div>
                            </div>

                            {/* Equity */}
                            <div className="bg-purple-50 p-8 rounded-3xl border-2 border-purple-200 space-y-6">
                                <h4 className="text-xl font-black text-purple-900 pb-4 border-b-2 border-purple-300">
                                    حقوق الملكية (Equity)
                                </h4>
                                <div className="space-y-3">
                                    {balanceSheet.equity.accounts.map((acc, index) => (
                                        <div key={index} className="flex justify-between items-center p-4 bg-white rounded-2xl">
                                            <div>
                                                <p className="font-black text-slate-900 text-sm">{acc.name}</p>
                                                <code className="text-[10px] font-mono text-slate-400">{acc.code}</code>
                                            </div>
                                            <span className="font-black text-purple-700 tabular-nums">
                                                {acc.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    ))}
                                    {balanceSheet.equity.retainedEarnings !== undefined && balanceSheet.equity.retainedEarnings !== 0 && (
                                        <div className="flex justify-between items-center p-4 bg-white rounded-2xl border-2 border-purple-300">
                                            <div>
                                                <p className="font-black text-slate-900 text-sm">الأرباح المحتجزة</p>
                                                <code className="text-[10px] font-mono text-slate-400">302</code>
                                            </div>
                                            <span className="font-black text-purple-700 tabular-nums">
                                                {balanceSheet.equity.retainedEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="pt-4 border-t-2 border-purple-300 flex justify-between items-center">
                                    <span className="font-black text-purple-900">الإجمالي</span>
                                    <span className="text-xl font-black text-purple-700 tabular-nums">
                                        {balanceSheet.equity.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م
                                    </span>
                                </div>
                            </div>

                            {/* Total Liabilities + Equity */}
                            <div className="bg-slate-900 p-6 rounded-3xl text-white">
                                <div className="flex justify-between items-center">
                                    <span className="font-black">الخصوم + حقوق الملكية</span>
                                    <span className="text-2xl font-black tabular-nums">
                                        {(balanceSheet.liabilities.total + balanceSheet.equity.total).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })} ج.م
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Balance Check */}
                    <div className={`p-8 rounded-3xl text-center ${balanceSheet.balanced
                            ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-4 border-emerald-400'
                            : 'bg-gradient-to-br from-rose-50 to-rose-100 border-4 border-rose-400'
                        }`}>
                        <p className="text-sm font-black text-slate-600 uppercase mb-2">
                            معادلة الميزانية
                        </p>
                        <p className="text-3xl font-black" style={{
                            color: balanceSheet.balanced ? '#059669' : '#dc2626'
                        }}>
                            الأصول ({balanceSheet.assets.total.toFixed(2)})
                            {balanceSheet.balanced ? ' = ' : ' ≠ '}
                            الخصوم + حقوق الملكية ({(balanceSheet.liabilities.total + balanceSheet.equity.total).toFixed(2)})
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FinancialReports;
