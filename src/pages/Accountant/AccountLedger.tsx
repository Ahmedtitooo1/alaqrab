import React, { useMemo } from 'react';
import { ArrowLeft, Printer, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import { FinancialCategory } from '../../../types';

interface AccountLedgerProps {
    account: FinancialCategory;
    onBack: () => void;
}

const AccountLedger: React.FC<AccountLedgerProps> = ({ account, onBack }) => {
    const { financialEntries, allUsers } = useAppContext();

    // Filter entries related to this account
    const accountEntries = useMemo(() => {
        return financialEntries
            .filter(e => e.debitAccount === account.code || e.creditAccount === account.code)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [financialEntries, account.code]);

    // Calculate running balance
    let runningBalance = 0;
    const entriesWithBalance = accountEntries.map(entry => {
        const isDebit = entry.debitAccount === account.code;
        const amount = entry.amount;

        if (isDebit) {
            runningBalance += amount;
        } else {
            runningBalance -= amount;
        }

        return {
            ...entry,
            balance: runningBalance,
            isDebit
        };
    }).reverse(); // Show oldest first

    const totalDebit = accountEntries
        .filter(e => e.debitAccount === account.code)
        .reduce((sum, e) => sum + e.amount, 0);

    const totalCredit = accountEntries
        .filter(e => e.creditAccount === account.code)
        .reduce((sum, e) => sum + e.amount, 0);

    const netBalance = totalDebit - totalCredit;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-8 animate-view pb-24">
            {/* Header */}
            <div className="glass-panel p-8 bg-white rounded-[2.5rem] border shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900">كشف حساب تفصيلي</h2>
                            <p className="text-slate-500 font-bold mt-1">Account Ledger Statement</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handlePrint}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2"
                        >
                            <Printer size={16} /> طباعة
                        </button>
                        <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-black text-xs hover:bg-slate-50 transition-all flex items-center gap-2">
                            <Download size={16} /> تصدير Excel
                        </button>
                    </div>
                </div>

                {/* Account Info */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">رقم الحساب</p>
                        <p className="text-2xl font-black text-slate-900 font-mono">{account.code}</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">اسم الحساب</p>
                        <p className="text-xl font-black text-slate-900">{account.name}</p>
                    </div>
                    <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                        <p className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <TrendingUp size={14} /> إجمالي المدين
                        </p>
                        <p className="text-2xl font-black text-emerald-900 tabular-nums">{totalDebit.toLocaleString()}</p>
                    </div>
                    <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                        <p className="text-xs font-black text-rose-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <TrendingDown size={14} /> إجمالي الدائن
                        </p>
                        <p className="text-2xl font-black text-rose-900 tabular-nums">{totalCredit.toLocaleString()}</p>
                    </div>
                </div>

                {/* Net Balance */}
                <div className={`mt-6 p-6 rounded-2xl border-2 ${netBalance >= 0 ? 'bg-indigo-50 border-indigo-200' : 'bg-amber-50 border-amber-200'}`}>
                    <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: netBalance >= 0 ? '#4f46e5' : '#d97706' }}>
                        الرصيد الصافي (Net Balance)
                    </p>
                    <p className="text-4xl font-black tabular-nums" style={{ color: netBalance >= 0 ? '#4f46e5' : '#d97706' }}>
                        {Math.abs(netBalance).toLocaleString()}
                        <span className="text-sm mr-2">{netBalance >= 0 ? 'مدين' : 'دائن'}</span>
                    </p>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="glass-panel bg-white rounded-[2.5rem] border shadow-sm overflow-hidden">
                <div className="p-6 border-b bg-slate-50">
                    <h3 className="text-xl font-black text-slate-900">سجل الحركات ({entriesWithBalance.length} عملية)</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400">
                            <tr>
                                <th className="p-4">التاريخ</th>
                                <th className="p-4">رقم القيد</th>
                                <th className="p-4">البيان</th>
                                <th className="p-4 text-center">مدين</th>
                                <th className="p-4 text-center">دائن</th>
                                <th className="p-4 text-center">الرصيد</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {entriesWithBalance.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-10 text-center text-slate-400 font-bold">
                                        لا توجد حركات مسجلة على هذا الحساب
                                    </td>
                                </tr>
                            )}
                            {entriesWithBalance.map((entry, idx) => (
                                <tr key={entry.id} className="hover:bg-indigo-50/10 transition-colors">
                                    <td className="p-4 font-bold text-sm text-slate-600">{entry.date}</td>
                                    <td className="p-4 font-mono text-xs text-slate-500">{entry.id}</td>
                                    <td className="p-4 font-bold text-slate-800">{entry.description}</td>
                                    <td className="p-4 text-center font-black text-emerald-600 tabular-nums">
                                        {entry.isDebit ? entry.amount.toLocaleString() : '-'}
                                    </td>
                                    <td className="p-4 text-center font-black text-rose-600 tabular-nums">
                                        {!entry.isDebit ? entry.amount.toLocaleString() : '-'}
                                    </td>
                                    <td className={`p-4 text-center font-black tabular-nums ${entry.balance >= 0 ? 'text-indigo-600' : 'text-amber-600'}`}>
                                        {Math.abs(entry.balance).toLocaleString()}
                                        <span className="text-[10px] mr-1">{entry.balance >= 0 ? 'مدين' : 'دائن'}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-slate-900 text-white font-black">
                            <tr>
                                <td colSpan={3} className="p-4 text-right">الإجماليات</td>
                                <td className="p-4 text-center tabular-nums">{totalDebit.toLocaleString()}</td>
                                <td className="p-4 text-center tabular-nums">{totalCredit.toLocaleString()}</td>
                                <td className="p-4 text-center tabular-nums">
                                    {Math.abs(netBalance).toLocaleString()}
                                    <span className="text-[10px] mr-1">{netBalance >= 0 ? 'مدين' : 'دائن'}</span>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AccountLedger;
