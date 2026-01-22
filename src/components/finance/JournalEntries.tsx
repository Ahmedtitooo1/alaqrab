import * as React from 'react';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X, FileCheck, AlertCircle, CheckCircle, Edit3, Printer } from 'lucide-react';
import {
    getAccounts,
    getJournalEntries,
    saveJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    validateJournalEntry
} from '../../services/mockAccounting';
import { JournalEntry, JournalLine, Account } from '../../types/accounting';

interface JournalEntriesProps {
    institutionId?: string;
    userName?: string;
}

const JournalEntries: React.FC<JournalEntriesProps> = ({ institutionId = 'inst-1', userName = 'المحاسب' }) => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

    // Form state
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [lines, setLines] = useState<JournalLine[]>([
        { accountId: '', debit: 0, credit: 0 },
        { accountId: '', debit: 0, credit: 0 }
    ]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setAccounts(getAccounts());
        setEntries(getJournalEntries());
    };

    const handleAddLine = () => {
        setLines([...lines, { accountId: '', debit: 0, credit: 0 }]);
    };

    const handleRemoveLine = (index: number) => {
        if (lines.length > 2) {
            setLines(lines.filter((_, i) => i !== index));
        }
    };

    const handleLineChange = (index: number, field: keyof JournalLine, value: any) => {
        const newLines = [...lines];
        newLines[index] = { ...newLines[index], [field]: value };
        setLines(newLines);
    };

    const calculateTotals = () => {
        const totalDebit = lines.reduce((sum, line) => sum + (parseFloat(String(line.debit)) || 0), 0);
        const totalCredit = lines.reduce((sum, line) => sum + (parseFloat(String(line.credit)) || 0), 0);
        return { totalDebit, totalCredit, balanced: Math.abs(totalDebit - totalCredit) < 0.01 };
    };

    const handleSave = () => {
        // Validate
        const { balanced } = calculateTotals();
        if (!balanced) {
            alert('⚠️ القيد غير متوازن! يجب أن يتساوى إجمالي المدين مع إجمالي الدائن');
            return;
        }

        if (!description.trim()) {
            alert('⚠️ يرجى إدخال وصف القيد');
            return;
        }

        // Check all lines have accounts selected
        const invalidLines = lines.filter(l => !l.accountId || (l.debit === 0 && l.credit === 0));
        if (invalidLines.length > 0) {
            alert('⚠️ يجب تحديد حساب ومبلغ لكل سطر في القيد');
            return;
        }

        // Enrich lines with account details
        const enrichedLines = lines.map(line => {
            const account = accounts.find(a => a.id === line.accountId);
            return {
                ...line,
                accountCode: account?.code,
                accountName: account?.name
            };
        });

        const entry: JournalEntry = {
            id: editingEntry?.id || `JE-${Date.now()}`,
            date,
            description,
            lines: enrichedLines,
            posted: false,
            createdBy: userName,
            createdAt: new Date().toISOString(),
            institutionId,
            voucherNumber: `V-${Date.now()}`
        };

        const validation = validateJournalEntry(entry);
        if (!validation.valid) {
            alert(`⚠️ ${validation.message}`);
            return;
        }

        if (editingEntry) {
            updateJournalEntry(entry.id, entry);
        } else {
            saveJournalEntry(entry);
        }

        loadData();
        handleCloseModal();
    };

    const handleEdit = (entry: JournalEntry) => {
        setEditingEntry(entry);
        setDate(entry.date);
        setDescription(entry.description);
        setLines(entry.lines);
        setShowModal(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('هل أنت متأكد من حذف هذا القيد؟')) {
            deleteJournalEntry(id);
            loadData();
        }
    };

    const handlePost = (entry: JournalEntry) => {
        if (entry.posted) {
            alert('القيد مرحّل بالفعل');
            return;
        }

        const updatedEntry = { ...entry, posted: true };
        updateJournalEntry(entry.id, updatedEntry);
        loadData();
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingEntry(null);
        setDate(new Date().toISOString().split('T')[0]);
        setDescription('');
        setLines([
            { accountId: '', debit: 0, credit: 0 },
            { accountId: '', debit: 0, credit: 0 }
        ]);
    };

    const { totalDebit, totalCredit, balanced } = calculateTotals();

    return (
        <div className="space-y-10 animate-view text-right" dir="rtl">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-10 rounded-[3rem] border shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="p-5 bg-purple-50 text-purple-700 rounded-[1.75rem] border border-purple-100 shadow-inner">
                        <FileCheck size={40} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black">📒 القيود اليومية والتسويات</h2>
                        <p className="text-slate-500 font-bold">إدخال ومتابعة قيود المحاسبة بنظام القيد المزدوج</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-10 py-5 bg-slate-950 text-white rounded-2xl font-black text-xs flex items-center gap-3 shadow-xl hover:bg-purple-700 transition-all"
                >
                    <Plus size={20} />
                    قيد جديد
                </button>
            </div>

            {/* Entries List */}
            <div className="glass-panel bg-white rounded-[3rem] shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b">
                                <th className="p-6">رقم القيد</th>
                                <th className="p-6">التاريخ</th>
                                <th className="p-6">البيان</th>
                                <th className="p-6 text-center">إجمالي المدين</th>
                                <th className="p-6 text-center">إجمالي الدائن</th>
                                <th className="p-6 text-center">الحالة</th>
                                <th className="p-6 text-center">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y font-bold text-sm">
                            {entries.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-20 text-center text-slate-400 italic">
                                        لا توجد قيود محاسبية حتى الآن
                                    </td>
                                </tr>
                            ) : (
                                entries.map(entry => {
                                    const totalD = entry.lines.reduce((s, l) => s + l.debit, 0);
                                    const totalC = entry.lines.reduce((s, l) => s + l.credit, 0);
                                    return (
                                        <tr key={entry.id} className="hover:bg-slate-50 transition-all">
                                            <td className="p-6">
                                                <code className="text-xs font-mono font-black text-purple-600 bg-purple-50 px-3 py-1 rounded-lg">
                                                    {entry.voucherNumber || entry.id}
                                                </code>
                                            </td>
                                            <td className="p-6 text-slate-600">{entry.date}</td>
                                            <td className="p-6 font-black text-slate-900">{entry.description}</td>
                                            <td className="p-6 text-center font-black text-emerald-600 tabular-nums">
                                                {totalD.toLocaleString()} ج.م
                                            </td>
                                            <td className="p-6 text-center font-black text-rose-600 tabular-nums">
                                                {totalC.toLocaleString()} ج.م
                                            </td>
                                            <td className="p-6 text-center">
                                                {entry.posted ? (
                                                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black">
                                                        <CheckCircle size={14} />
                                                        مرحّل
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl text-xs font-black">
                                                        <AlertCircle size={14} />
                                                        مسودة
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-6">
                                                <div className="flex gap-2 justify-center">
                                                    {!entry.posted && (
                                                        <>
                                                            <button
                                                                onClick={() => handleEdit(entry)}
                                                                className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                                                                title="تعديل"
                                                            >
                                                                <Edit3 size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(entry.id)}
                                                                className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"
                                                                title="حذف"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() => handlePost(entry)}
                                                        className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
                                                        title={entry.posted ? 'مرحّل' : 'ترحيل'}
                                                        disabled={entry.posted}
                                                    >
                                                        <CheckCircle size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for New/Edit Entry */}
            {showModal && (
                <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6">
                    <div className="glass-panel w-full max-w-5xl bg-white p-12 rounded-[3.5rem] shadow-3xl space-y-8 animate-view max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center border-b pb-6">
                            <h3 className="text-2xl font-black">
                                {editingEntry ? 'تعديل قيد محاسبي' : 'قيد محاسبي جديد'}
                            </h3>
                            <button onClick={handleCloseModal} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                                <X size={32} />
                            </button>
                        </div>

                        {/* Entry Details */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 px-2 uppercase">تاريخ القيد</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full p-4 bg-slate-50 rounded-xl font-bold border-2 border-transparent focus:border-purple-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 px-2 uppercase">رقم السند</label>
                                <input
                                    type="text"
                                    value={editingEntry?.voucherNumber || `V-${Date.now()}`}
                                    disabled
                                    className="w-full p-4 bg-slate-100 rounded-xl font-mono text-slate-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 px-2 uppercase">البيان / الوصف</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="مثال: قيد افتتاحي، سداد مرتبات، شراء أصل ثابت..."
                                className="w-full p-4 bg-slate-50 rounded-xl font-bold border-2 border-transparent focus:border-purple-500 outline-none"
                            />
                        </div>

                        {/* Journal Lines */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h4 className="text-lg font-black">سطور القيد</h4>
                                <button
                                    onClick={handleAddLine}
                                    className="px-6 py-3 bg-purple-600 text-white rounded-xl font-black text-xs flex items-center gap-2 hover:bg-purple-700 transition-all"
                                >
                                    <Plus size={16} />
                                    إضافة سطر
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-right border border-slate-200 rounded-2xl overflow-hidden">
                                    <thead>
                                        <tr className="bg-slate-900 text-white text-[10px] font-black uppercase">
                                            <th className="p-4 text-center">#</th>
                                            <th className="p-4">الحساب</th>
                                            <th className="p-4 text-center">مدين (Debit)</th>
                                            <th className="p-4 text-center">دائن (Credit)</th>
                                            <th className="p-4 text-center">ملاحظة</th>
                                            <th className="p-4 text-center">حذف</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {lines.map((line, index) => (
                                            <tr key={index} className="hover:bg-slate-50">
                                                <td className="p-4 text-center font-black text-slate-400">{index + 1}</td>
                                                <td className="p-4">
                                                    <select
                                                        value={line.accountId}
                                                        onChange={(e) => handleLineChange(index, 'accountId', e.target.value)}
                                                        className="w-full p-3 bg-slate-50 rounded-xl font-bold text-sm border-2 border-transparent focus:border-purple-500 outline-none"
                                                    >
                                                        <option value="">-- اختر الحساب --</option>
                                                        {accounts.map(acc => (
                                                            <option key={acc.id} value={acc.id}>
                                                                [{acc.code}] {acc.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="p-4">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={line.debit || ''}
                                                        onChange={(e) => handleLineChange(index, 'debit', parseFloat(e.target.value) || 0)}
                                                        className="w-full p-3 bg-emerald-50 rounded-xl font-black text-center tabular-nums border-2 border-transparent focus:border-emerald-500 outline-none"
                                                        placeholder="0.00"
                                                    />
                                                </td>
                                                <td className="p-4">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={line.credit || ''}
                                                        onChange={(e) => handleLineChange(index, 'credit', parseFloat(e.target.value) || 0)}
                                                        className="w-full p-3 bg-rose-50 rounded-xl font-black text-center tabular-nums border-2 border-transparent focus:border-rose-500 outline-none"
                                                        placeholder="0.00"
                                                    />
                                                </td>
                                                <td className="p-4">
                                                    <input
                                                        type="text"
                                                        value={line.note || ''}
                                                        onChange={(e) => handleLineChange(index, 'note', e.target.value)}
                                                        className="w-full p-3 bg-slate-50 rounded-xl font-bold text-xs"
                                                        placeholder="اختياري"
                                                    />
                                                </td>
                                                <td className="p-4 text-center">
                                                    <button
                                                        onClick={() => handleRemoveLine(index)}
                                                        disabled={lines.length <= 2}
                                                        className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-slate-100 font-black">
                                        <tr>
                                            <td colSpan={2} className="p-4 text-left text-slate-700">الإجمالي</td>
                                            <td className="p-4 text-center text-2xl text-emerald-700 tabular-nums">
                                                {totalDebit.toFixed(2)}
                                            </td>
                                            <td className="p-4 text-center text-2xl text-rose-700 tabular-nums">
                                                {totalCredit.toFixed(2)}
                                            </td>
                                            <td colSpan={2} className="p-4 text-center">
                                                {balanced ? (
                                                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs">
                                                        <CheckCircle size={16} />
                                                        متوازن
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 rounded-xl text-xs">
                                                        <AlertCircle size={16} />
                                                        غير متوازن
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-6 border-t">
                            <button
                                onClick={handleSave}
                                className="flex-1 py-6 bg-slate-950 text-white rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 shadow-xl hover:bg-purple-700 transition-all"
                            >
                                <Save size={24} />
                                حفظ القيد
                            </button>
                            <button
                                onClick={handleCloseModal}
                                className="px-10 py-6 bg-slate-200 text-slate-700 rounded-[2rem] font-black text-xl hover:bg-slate-300 transition-all"
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JournalEntries;
