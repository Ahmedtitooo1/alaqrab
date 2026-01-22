
import * as React from 'react';
import { useState, useMemo } from 'react';
import {
    Save, Plus, Trash2, Calendar, FileText, Hash,
    CheckCircle, Search, AlertTriangle, Printer
} from 'lucide-react';
import { openProfessionalPrintWindow } from '../../utils/printUtils';
import { useAppContext } from '../../../context/AppContext';
import { FinancialEntry } from '../../../types';

interface JournalLine {
    id: string;
    accountId: string;
    costCenter: string;
    debit: number;
    credit: number;
    note: string;
    accountSearch: string; // for autocomplete UI
    isSearchOpen: boolean;
}

const MOCK_COST_CENTERS = [
    { id: 'CC-001', name: 'الفرع الرئيسي' },
    { id: 'CC-002', name: 'المبيعات' },
    { id: 'CC-003', name: 'الموارد البشرية' },
    { id: 'CC-004', name: 'التسويق' },
    { id: 'CC-005', name: 'مشروع أ' },
];

const JournalEntryEditor: React.FC = () => {
    const {
        financialCategories,
        addFinancialEntry,
        addNotification,
        lang,
        user
    } = useAppContext();

    const isRtl = lang === 'ar';

    const [header, setHeader] = useState({
        date: new Date().toISOString().split('T')[0],
        description: '',
        referenceNo: `JRN-${Date.now().toString().slice(-6)}`
    });

    const [lines, setLines] = useState<JournalLine[]>([
        { id: '1', accountId: '', costCenter: '', debit: 0, credit: 0, note: '', accountSearch: '', isSearchOpen: false },
        { id: '2', accountId: '', costCenter: '', debit: 0, credit: 0, note: '', accountSearch: '', isSearchOpen: false },
    ]);

    // Computed Totals
    const { totalDebit, totalCredit, isBalanced, difference } = useMemo(() => {
        const d = lines.reduce((acc, l) => acc + (l.debit || 0), 0);
        const c = lines.reduce((acc, l) => acc + (l.credit || 0), 0);
        return {
            totalDebit: d,
            totalCredit: c,
            difference: Math.abs(d - c),
            isBalanced: Math.abs(d - c) < 0.01 && d > 0 // Must be balanced AND have value
        };
    }, [lines]);

    const addLine = () => {
        setLines([...lines, {
            id: Date.now().toString(),
            accountId: '',
            costCenter: '',
            debit: 0,
            credit: 0,
            note: '',
            accountSearch: '',
            isSearchOpen: false
        }]);
    };

    const removeLine = (id: string) => {
        if (lines.length <= 2) return; // Maintain minimum 2 lines
        setLines(lines.filter(l => l.id !== id));
    };

    const updateLine = (id: string, field: keyof JournalLine, value: any) => {
        setLines(lines.map(l => {
            if (l.id !== id) return l;

            // Validation: Can't have both Debit and Credit
            if (field === 'debit' && value > 0) return { ...l, [field]: value, credit: 0 };
            if (field === 'credit' && value > 0) return { ...l, [field]: value, debit: 0 };

            return { ...l, [field]: value };
        }));
    };

    // Helper to pair Debits and Credits
    const generateEntries = (): FinancialEntry[] => {
        const debits = lines.filter(l => l.debit > 0).map(l => ({ ...l, remaining: l.debit }));
        const credits = lines.filter(l => l.credit > 0).map(l => ({ ...l, remaining: l.credit }));

        const entries: FinancialEntry[] = [];
        let dIndex = 0;
        let cIndex = 0;

        // Standard Pairing Algorithm
        while (dIndex < debits.length && cIndex < credits.length) {
            const currentDebit = debits[dIndex];
            const currentCredit = credits[cIndex];

            const amount = Math.min(currentDebit.remaining, currentCredit.remaining);

            if (amount <= 0) break;

            entries.push({
                id: `${header.referenceNo}-${entries.length + 1}`,
                date: header.date,
                description: header.description + (currentDebit.note ? ` - ${currentDebit.note}` : '') + (currentCredit.note ? ` / ${currentCredit.note}` : ''),
                amount: parseFloat(amount.toFixed(2)),
                debitAccount: currentDebit.accountId,
                creditAccount: currentCredit.accountId,
                costCenter: currentDebit.costCenter || currentCredit.costCenter,
                refType: 'journal',
                institutionId: user?.institutionId || 'tenant-a'
            });

            currentDebit.remaining -= amount;
            currentCredit.remaining -= amount;

            if (currentDebit.remaining < 0.01) dIndex++;
            if (currentCredit.remaining < 0.01) cIndex++;
        }

        return entries;
    };

    const handleSave = () => {
        if (!isBalanced) return;
        if (!header.description) return alert('الرجاء إدخال وصف للقيد');

        const newEntries = generateEntries();

        // Save all entries
        newEntries.forEach(entry => addFinancialEntry(entry));

        addNotification({
            title: 'تم ترحيل القيد',
            content: `تم حفظ قيد اليومية رقم ${header.referenceNo} بنجاح`,
            type: 'success',
            date: new Date().toISOString()
        });

        // Reset Form
        setHeader({
            date: new Date().toISOString().split('T')[0],
            description: '',
            referenceNo: `JRN-${Date.now().toString().slice(-6)}`
        });
        setLines([
            { id: Date.now().toString(), accountId: '', costCenter: '', debit: 0, credit: 0, note: '', accountSearch: '', isSearchOpen: false },
            { id: (Date.now() + 1).toString(), accountId: '', costCenter: '', debit: 0, credit: 0, note: '', accountSearch: '', isSearchOpen: false },
        ]);
    };

    return (
        <div className="space-y-8 animate-view pb-24 text-right" dir={isRtl ? 'rtl' : 'ltr'}>
            {/* Header Section */}
            <div className="glass-panel p-8 bg-white rounded-[2.5rem] border shadow-sm space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b pb-6">
                    <div className="flex items-center gap-6">
                        <div className="p-5 bg-indigo-600 text-white rounded-[1.75rem] shadow-xl">
                            <FileText size={40} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900">محرر قيود اليومية</h2>
                            <p className="text-slate-500 font-bold">إنشاء وتحرير القيود المحاسبية المركبة</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">التاريخ</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="date"
                                    value={header.date}
                                    onChange={e => setHeader({ ...header, date: e.target.value })}
                                    className="p-4 pl-12 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl font-black text-sm outline-none shadow-inner w-full md:w-48"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">رقم القيد (Reference)</label>
                            <div className="relative">
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    value={header.referenceNo}
                                    onChange={e => setHeader({ ...header, referenceNo: e.target.value })}
                                    className="p-4 pl-12 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl font-black text-sm outline-none shadow-inner w-full md:w-48 font-mono"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">وصف القيد (Description)</label>
                    <input
                        value={header.description}
                        onChange={e => setHeader({ ...header, description: e.target.value })}
                        className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl font-bold text-sm outline-none shadow-inner"
                        placeholder="شرح مفصل لطبيعة العملية..."
                    />
                </div>
            </div>

            {/* Grid Lines Section */}
            <div className="glass-panel p-2 bg-white rounded-[2.5rem] border shadow-sm overflow-hidden">
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-right min-w-[1000px]">
                        <thead>
                            <tr className="bg-slate-900 text-white text-xs font-black uppercase">
                                <th className="p-5 w-12 text-center">#</th>
                                <th className="p-5 w-1/3">الحساب (Account)</th>
                                <th className="p-5 w-48">مركز التكلفة</th>
                                <th className="p-5 w-48 text-center text-emerald-400">مدين (Debit)</th>
                                <th className="p-5 w-48 text-center text-rose-400">دائن (Credit)</th>
                                <th className="p-5">ملاحظات</th>
                                <th className="p-5 w-12"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-bold text-sm">
                            {lines.map((line, idx) => (
                                <tr key={line.id} className="hover:bg-indigo-50/20 transition-colors group">
                                    <td className="p-4 text-center text-slate-400">{idx + 1}</td>

                                    {/* Account Autocomplete */}
                                    <td className="p-4 relative">
                                        <div className="relative">
                                            <input
                                                value={line.accountSearch}
                                                onChange={e => {
                                                    updateLine(line.id, 'accountSearch', e.target.value);
                                                    updateLine(line.id, 'isSearchOpen', true);
                                                }}
                                                onFocus={() => updateLine(line.id, 'isSearchOpen', true)}
                                                className="w-full p-3 bg-slate-50 rounded-xl border border-transparent focus:border-indigo-600 outline-none text-xs font-bold"
                                                placeholder="بحث عن حساب..."
                                            />
                                            {line.accountId && <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" size={14} />}

                                            {line.isSearchOpen && (
                                                <div className="absolute z-50 top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 max-h-[200px] overflow-y-auto no-scrollbar p-2">
                                                    {financialCategories
                                                        .filter(c => c.name.includes(line.accountSearch) || c.code.includes(line.accountSearch))
                                                        .slice(0, 20)
                                                        .map(cat => (
                                                            <div
                                                                key={cat.id}
                                                                onClick={() => {
                                                                    updateLine(line.id, 'accountId', cat.code);
                                                                    updateLine(line.id, 'accountSearch', `${cat.name} (${cat.code})`);
                                                                    updateLine(line.id, 'isSearchOpen', false);
                                                                }}
                                                                className="p-3 hover:bg-indigo-50 rounded-xl cursor-pointer flex justify-between items-center group/item transition-all"
                                                            >
                                                                <span className="text-xs font-black text-slate-700">{cat.name}</span>
                                                                <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{cat.code}</span>
                                                            </div>
                                                        ))}
                                                    <div
                                                        className="p-2 text-center text-[10px] text-rose-400 cursor-pointer hover:bg-rose-50 rounded-lg mt-1"
                                                        onClick={() => updateLine(line.id, 'isSearchOpen', false)}
                                                    >
                                                        إغلاق
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    {/* Cost Center Select */}
                                    <td className="p-4">
                                        <select
                                            value={line.costCenter}
                                            onChange={e => updateLine(line.id, 'costCenter', e.target.value)}
                                            className="w-full p-3 bg-slate-50 rounded-xl border border-transparent focus:border-indigo-600 outline-none text-xs font-bold"
                                        >
                                            <option value="">-- بلا --</option>
                                            {MOCK_COST_CENTERS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </td>

                                    {/* Debit Input */}
                                    <td className="p-4">
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={line.debit > 0 ? line.debit : ''}
                                            onChange={e => updateLine(line.id, 'debit', parseFloat(e.target.value) || 0)}
                                            className="w-full p-3 bg-white border-2 border-slate-100 focus:border-emerald-500 rounded-xl text-center font-black tabular-nums text-emerald-600 outline-none placeholder:text-slate-200"
                                            placeholder="0.00"
                                        />
                                    </td>

                                    {/* Credit Input */}
                                    <td className="p-4">
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={line.credit > 0 ? line.credit : ''}
                                            onChange={e => updateLine(line.id, 'credit', parseFloat(e.target.value) || 0)}
                                            className="w-full p-3 bg-white border-2 border-slate-100 focus:border-rose-500 rounded-xl text-center font-black tabular-nums text-rose-600 outline-none placeholder:text-slate-200"
                                            placeholder="0.00"
                                        />
                                    </td>

                                    <td className="p-4">
                                        <input
                                            value={line.note}
                                            onChange={e => updateLine(line.id, 'note', e.target.value)}
                                            className="w-full p-3 bg-slate-50 rounded-xl border border-transparent focus:border-indigo-600 outline-none text-xs font-bold"
                                            placeholder="ملاحظات..."
                                        />
                                    </td>

                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => removeLine(line.id)}
                                            className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-center">
                    <button onClick={addLine} className="px-8 py-3 bg-white border-2 border-dashed border-slate-300 hover:border-indigo-500 text-slate-500 hover:text-indigo-600 rounded-2xl font-black text-xs flex items-center gap-2 transition-all shadow-sm hover:shadow-md">
                        <Plus size={16} /> إضافة سطر جديد
                    </button>
                </div>
            </div>

            {/* Footer / Totals Section */}
            <div className="glass-panel p-8 bg-white rounded-[2.5rem] border shadow-lg sticky bottom-6 z-20">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className={`flex items-center gap-6 px-8 py-4 rounded-3xl border-2 transition-all ${isBalanced ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                        {isBalanced ? <CheckCircle size={32} /> : <AlertTriangle size={32} />}
                        <div>
                            <h3 className="text-xl font-black">{isBalanced ? 'القيد متوازن' : 'القيد غير متوازن'}</h3>
                            <p className="text-xs font-bold opacity-80">{isBalanced ? 'يمكنك حفظ القيد الآن' : `يوجد فرق قدره ${difference.toFixed(2)}`}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-12">
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">إجمالي المدين</p>
                            <p className="text-3xl font-black text-emerald-600 tabular-nums">{totalDebit.toFixed(2)}</p>
                        </div>
                        <div className="h-12 w-[2px] bg-slate-100"></div>
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">إجمالي الدائن</p>
                            <p className="text-3xl font-black text-rose-600 tabular-nums">{totalCredit.toFixed(2)}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={!isBalanced}
                        className={`px-12 py-5 rounded-2xl font-black text-lg flex items-center gap-4 shadow-xl transition-all ${isBalanced ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-[1.02]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                    >
                        <Save size={24} /> حفظ وترحيل القيد
                    </button>

                    <button
                        onClick={() => {
                            const html = `
                                <div class="header-box">
                                    <h2 style="text-align:center; font-size: 1.5rem; font-weight: 900; margin-bottom: 20px;">مسودة قيد يومية</h2>
                                    <div class="info-grid">
                                        <div class="info-card">
                                            <div class="info-card-title">رقم القيد</div>
                                            <div class="info-card-value">${header.referenceNo}</div>
                                        </div>
                                        <div class="info-card">
                                            <div class="info-card-title">التاريخ</div>
                                            <div class="info-card-value">${header.date}</div>
                                        </div>
                                    </div>
                                    <div class="info-card" style="margin-bottom: 20px;">
                                        <div class="info-card-title">الوصف</div>
                                        <div class="info-card-value">${header.description || 'بدون وصف'}</div>
                                    </div>
                                </div>

                                <table>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>الحساب</th>
                                            <th>مركز التكلفة</th>
                                            <th>مدين</th>
                                            <th>دائن</th>
                                            <th>ملاحظات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${lines.map((l, i) => `
                                            <tr>
                                                <td>${i + 1}</td>
                                                <td style="text-align: right;">${l.accountSearch || l.accountId || '-'}</td>
                                                <td>${MOCK_COST_CENTERS.find(c => c.id === l.costCenter)?.name || '-'}</td>
                                                <td style="color: #059669; font-weight: bold;">${l.debit > 0 ? l.debit.toLocaleString() : '-'}</td>
                                                <td style="color: #e11d48; font-weight: bold;">${l.credit > 0 ? l.credit.toLocaleString() : '-'}</td>
                                                <td>${l.note}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colspan="3" style="text-align: left; padding-left: 20px;">الإجمالي</td>
                                            <td style="color: #6ee7b7;">${totalDebit.toLocaleString()}</td>
                                            <td style="color: #fda4af;">${totalCredit.toLocaleString()}</td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>

                                <div class="signatures-container">
                                    <div class="signature-box"><div class="signature-line">المعد</div></div>
                                    <div class="signature-box"><div class="signature-line">المراجع</div></div>
                                    <div class="signature-box"><div class="signature-line">الاعتماد</div></div>
                                </div>
                            `;

                            openProfessionalPrintWindow(html, {
                                title: `مسودة قيد - ${header.referenceNo}`,
                                pageSize: 'A4',
                                orientation: 'portrait',
                                watermark: 'مسودة',
                                systemName: 'منظومة العقرب التعليمية'
                            });
                        }}
                        className="px-8 py-5 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl font-black text-lg flex items-center gap-4 shadow-lg hover:bg-slate-50 hover:border-slate-300 transition-all"
                    >
                        <Printer size={24} /> طباعة مسودة
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JournalEntryEditor;
