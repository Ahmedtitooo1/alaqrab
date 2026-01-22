
import React, { useState } from 'react';
import {
    Search, Wallet, CreditCard, ArrowRightLeft,
    FileText, CheckCircle, AlertCircle, Users, Percent,
    ArrowUpRight, ArrowDownLeft, X, CheckSquare, Square, Banknote, Coins
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { UserRole, AdjustmentRequest, FinancialEntry, User } from '../types';
import { openProfessionalPrintWindow, generateStatementHTML } from '../src/utils/printUtils';

const StudentFinancialProfile: React.FC = () => {
    const {
        allUsers, financialEntries, addFinancialEntry,
        adjustmentRequests, addAdjustmentRequest, user: currentUser, isRtl,
        funds, financialCategories
    } = useAppContext();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [adjustmentModalOpen, setAdjustmentModalOpen] = useState(false);
    const [payModalOpen, setPayModalOpen] = useState(false);
    const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());

    // Payment Form State
    // Payment Form State
    const [payForm, setPayForm] = useState({
        amount: 0,
        type: 'fee_payment',
        fundId: '11101',
        categoryId: '41001', // رسوم دراسية
        description: '',
        subscriptionMonth: new Date().getMonth() + 1, // Default current month
        isBulk: false
    });

    const months = [
        { id: 1, name: 'يناير' }, { id: 2, name: 'فبراير' }, { id: 3, name: 'مارس' },
        { id: 4, name: 'أبريل' }, { id: 5, name: 'مايو' }, { id: 6, name: 'يونيو' },
        { id: 7, name: 'يوليو' }, { id: 8, name: 'أغسطس' }, { id: 9, name: 'سبتمبر' },
        { id: 10, name: 'أكتوبر' }, { id: 11, name: 'نوفمبر' }, { id: 12, name: 'ديسمبر' }
    ];

    // Payment Handlers
    const handlePayClick = (user?: User) => {
        setPayForm({
            amount: 0,
            type: 'fee_payment',
            fundId: funds[0]?.accountCode || '11101',
            categoryId: '41101',
            description: '',
            subscriptionMonth: new Date().getMonth() + 1,
            isBulk: !user
        });
        setPayModalOpen(true);
    };

    const handlePaymentSubmit = () => {
        if (payForm.amount <= 0) return alert('يرجى إدخال مبلغ صحيح');
        const date = new Date().toISOString().split('T')[0];

        if (payForm.isBulk) {
            let count = 0;
            selectedUserIds.forEach(id => {
                const user = allUsers.find(u => u.id === id);
                if (user) {
                    const monthName = months.find(m => m.id === Number(payForm.subscriptionMonth))?.name || '';
                    addFinancialEntry({
                        id: `PAY-${Date.now()}-${id}`,
                        date,
                        description: `[دفع مجمع] ${payForm.description} - شهر ${monthName} - ${user.firstName}`,
                        amount: payForm.amount, // المبلغ المدخل لكل طالب
                        debitAccount: payForm.fundId,
                        creditAccount: payForm.categoryId,
                        refType: 'payment',
                        targetId: id, // Linking to student
                        institutionId: currentUser?.institutionId || ''
                    });
                    count++;
                }
            });
            alert(`تم تسجيل الدفع لـ ${count} طالب بنجاح`);
            setSelectedUserIds(new Set());
        } else if (selectedUser) {
            const monthName = months.find(m => m.id === Number(payForm.subscriptionMonth))?.name || '';
            addFinancialEntry({
                id: `PAY-${Date.now()}`,
                date,
                description: `${payForm.description} - شهر ${monthName}`,
                amount: payForm.amount,
                debitAccount: payForm.fundId,
                creditAccount: payForm.categoryId,
                refType: 'payment',
                targetId: selectedUser.id,
                institutionId: currentUser?.institutionId || ''
            });
            alert('تم تسجيل عملية الدفع بنجاح');
        }
        setPayModalOpen(false);
    };

    const toggleUserSelection = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const newSet = new Set(selectedUserIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedUserIds(newSet);
    };

    // Adjustment Form
    const [adjForm, setAdjForm] = useState({
        amount: 0,
        reason: 'scholarship' as const,
        note: ''
    });

    // Search Logic - Show all students/parents when search is empty
    const filteredUsers = allUsers.filter(u => {
        const isStudentOrParent = u.role === UserRole.STUDENT || u.role === UserRole.PARENT;
        if (!isStudentOrParent) return false;

        // If no search term, show all
        if (!searchTerm) return true;

        // Otherwise filter by search term
        const searchLower = searchTerm.toLowerCase();
        return (
            u.firstName.toLowerCase().includes(searchLower) ||
            u.lastName.toLowerCase().includes(searchLower) ||
            u.code?.toLowerCase().includes(searchLower)
        );
    });

    // Computed Data
    const getStudentBalance = (studentId: string) => {
        // Calculates balance based on FinancialEntries (Credits - Debits)
        // Assuming: Debit = Charge (Fee), Credit = Payment
        // So Balance = Debits - Credits
        const entries = financialEntries.filter(e => e.refType !== 'manual'); // Filter logic might need refinement
        // For simplicity using mocked balance logic or filtering specific account codes if implemented
        // Here we will just sum entries tagged with this student ID in description or separate field if exists
        // But standardized way: check '112' (Student Receivables) account code matches
        return 0; // Placeholder, in real implementation we query the Ledger
    };

    const familyMembers = selectedUser ? allUsers.filter(u =>
        (u.parentId === selectedUser.id) || // If selected is Parent
        (u.id === selectedUser.parentId) || // If selected is Child (find parent)
        (u.parentId && u.parentId === selectedUser.parentId && u.id !== selectedUser.id) // Siblings
    ) : [];

    const handleAdjustmentSubmit = () => {
        if (!selectedUser || adjForm.amount <= 0) return;

        const request: AdjustmentRequest = {
            id: Date.now().toString(),
            studentId: selectedUser.id,
            amount: adjForm.amount,
            // @ts-ignore
            reasonCategory: adjForm.reason,
            description: adjForm.note,
            requestedBy: currentUser?.id || 'unknown',
            status: 'pending',
            date: new Date().toISOString(),
            institutionId: currentUser?.institutionId || 'tenant-a'
        };

        addAdjustmentRequest(request);
        setAdjustmentModalOpen(false);
        setAdjForm({ amount: 0, reason: 'scholarship', note: '' });
        alert('تم رفع طلب التعديل للاعتماد');
    };

    return (
        <div className="space-y-6 animate-view p-6" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="glass-panel p-8 bg-white rounded-[2.5rem] border shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-emerald-100 text-emerald-700 rounded-2xl">
                        <Wallet size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">الملف المالي والمحفظة العائلية</h2>
                        <p className="text-slate-500 font-bold">إدارة الرسوم، الخصومات، والسداد المجمع</p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative mb-8">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full p-4 pr-12 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-bold"
                        placeholder="بحث عن طالب أو ولي أمر..."
                    />
                    {searchTerm && !selectedUser && (
                        <div className="absolute top-full right-0 left-0 mt-2 bg-white rounded-2xl shadow-xl border z-50 max-h-60 overflow-y-auto">
                            {filteredUsers.map(u => (
                                <div
                                    key={u.id}
                                    onClick={() => {
                                        setSelectedUser(u);
                                        setSearchTerm('');
                                    }}
                                    className="p-4 hover:bg-slate-50 cursor-pointer border-b last:border-0 flex justify-between items-center"
                                >
                                    <span className="font-bold text-slate-700">{u.firstName} {u.lastName}</span>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] px-2 py-1 rounded font-black uppercase ${u.role === UserRole.PARENT ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                            {u.role}
                                        </span>
                                        <span className="text-xs text-slate-400">{u.code}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {selectedUser ? (
                    <div className="space-y-8">
                        {/* Header Card */}
                        <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 bg-white/5 rounded-full blur-3xl w-64 h-64 -mr-16 -mt-16"></div>

                            {/* Back Button */}
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="absolute top-6 left-6 p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all z-20 flex items-center gap-2 text-xs font-bold"
                            >
                                <ArrowRightLeft size={16} /> رجوع للقائمة
                            </button>

                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-6 md:mt-0">
                                <div className="flex items-center gap-4">
                                    <div className="p-1 bg-white/20 rounded-2xl">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.username}`} className="w-16 h-16 rounded-xl bg-white" alt="Avatar" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black">{selectedUser.firstName} {selectedUser.lastName}</h3>
                                        <p className="opacity-60 font-bold">{selectedUser.code} | {selectedUser.role === UserRole.PARENT ? 'ولي أمر (محفظة عائلية)' : 'طالب'}</p>
                                    </div>
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-bold opacity-60 uppercase tracking-widest mb-1">الرصيد المستحق</p>
                                    <p className="text-4xl font-black tabular-nums tracking-tight">EGP {getStudentBalance(selectedUser.id).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <button onClick={() => handlePayClick(selectedUser)} className="p-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-2xl flex flex-col items-center gap-2 transition-all border border-emerald-100 shadow-sm active:scale-95">
                                <CreditCard size={24} />
                                <span className="font-bold text-xs">شحن رصيد / دفع</span>
                            </button>
                            <button
                                onClick={() => setAdjustmentModalOpen(true)}
                                className="p-4 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-2xl flex flex-col items-center gap-2 transition-all border border-orange-100"
                            >
                                <Percent size={24} />
                                <span className="font-bold text-xs">خصم / تسوية</span>
                            </button>
                            <button
                                onClick={() => {
                                    // Filter entries for this student
                                    // Use targetId if available, otherwise loose match on description or known patterns
                                    // Also include 'fees' (student debits) which might be targeted to them
                                    const studentEntries = financialEntries.filter(e =>
                                        e.targetId === selectedUser.id ||
                                        (e.description && (e.description.includes(selectedUser.code) || e.description.includes(selectedUser.firstName)))
                                    );

                                    const statementHtml = generateStatementHTML(
                                        `${selectedUser.firstName} ${selectedUser.lastName}`,
                                        selectedUser.code,
                                        studentEntries,
                                        'منظومة العقرب التعليمية'
                                    );

                                    openProfessionalPrintWindow(statementHtml, {
                                        title: `كشف حساب - ${selectedUser.firstName}`,
                                        pageSize: 'A4',
                                        systemName: 'منظومة العقرب التعليمية'
                                    });
                                }}
                                className="p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-2xl flex flex-col items-center gap-2 transition-all border border-blue-100"
                            >
                                <FileText size={24} />
                                <span className="font-bold text-xs">كشف حساب مفصل</span>
                            </button>
                            <button className="p-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-2xl flex flex-col items-center gap-2 transition-all border border-purple-100">
                                <Users size={24} />
                                <span className="font-bold text-xs">ربط أخوة</span>
                            </button>
                        </div>

                        {/* Family Members Section */}
                        {(selectedUser.role === UserRole.PARENT || familyMembers.length > 0) && (
                            <div className="space-y-4">
                                <h3 className="font-black text-lg text-slate-700 flex items-center gap-2">
                                    <Users size={20} className="text-indigo-600" />
                                    المحفظة العائلية والأبناء
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {familyMembers.length > 0 ? familyMembers.map(member => (
                                        <div key={member.id} className="p-4 border rounded-2xl flex items-center justify-between bg-slate-50">
                                            <div className="flex items-center gap-3">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.username}`} className="w-10 h-10 rounded-full bg-white border" alt="Child" />
                                                <div>
                                                    <p className="font-bold text-sm text-slate-800">{member.firstName}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold">{member.code}</p>
                                                </div>
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[10px] text-slate-400 font-bold">مستحق</p>
                                                <p className="font-black text-sm text-rose-600">850.00</p>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="col-span-3 p-6 text-center border-2 border-dashed rounded-2xl">
                                            <p className="text-slate-400 font-bold text-sm">لا يوجد أبناء مرتبطين بهذا الحساب</p>
                                        </div>
                                    )}

                                    {/* If parent is selected, show parent wallet summary too if complex */}
                                </div>
                            </div>
                        )}

                        {/* Recent Transactions Mock */}
                        <div className="space-y-4">
                            <h3 className="font-black text-lg text-slate-700">آخر العمليات</h3>
                            <div className="bg-white border rounded-3xl overflow-hidden">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="p-4 flex items-center justify-between border-b last:border-0 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl ${i % 2 === 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                                {i % 2 === 0 ? <ArrowDownLeft size={20} /> : <FileText size={20} />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm">{i % 2 === 0 ? 'سداد رسوم دراسية' : 'استحقاق قسط شهر مارس'}</p>
                                                <p className="text-[10px] text-slate-400 font-bold">12 مارس 2025</p>
                                            </div>
                                        </div>
                                        <span className={`font-black tabular-nums ${i % 2 === 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                                            {i % 2 === 0 ? '+' : '-'} 1,200.00
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(u => (
                                <div
                                    key={u.id}
                                    onClick={() => setSelectedUser(u)}
                                    className="p-6 bg-white border border-slate-100 rounded-3xl cursor-pointer hover:border-emerald-500 hover:shadow-lg transition-all group"
                                >
                                    <div className="absolute top-4 left-4 z-10">
                                        <div onClick={(e) => toggleUserSelection(e, u.id)} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selectedUserIds.has(u.id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 bg-white'}`}>
                                            {selectedUserIds.has(u.id) && <CheckSquare size={14} />}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                                {u.firstName.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-800">{u.firstName} {u.lastName}</h4>
                                                <span className={`text-[10px] px-2 py-1 rounded-lg font-bold ${u.role === UserRole.PARENT ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                    {u.role === UserRole.PARENT ? 'ولي أمر' : 'طالب'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold text-slate-400">
                                            <span>الكود</span>
                                            <span className="font-mono">{u.code || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold text-slate-400">
                                            <span>الرصيد</span>
                                            <span className="text-slate-900 font-black">0.00 EGP</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 p-12 text-center text-slate-400 font-bold bg-slate-50 rounded-3xl border-2 border-dashed">
                                لا توجد نتائج مطابقة للبحث
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Adjustment Modal */}
            {adjustmentModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md animate-scale-in overflow-hidden">
                        <div className="p-6 border-b bg-slate-50 flex justify-between items-center">
                            <h3 className="font-black text-lg text-slate-800">طلب تسوية / خصم</h3>
                            <button onClick={() => setAdjustmentModalOpen(false)}><AlertCircle size={20} className="text-slate-400" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 mb-1 block">سبب التعديل</label>
                                <select
                                    value={adjForm.reason}
                                    // @ts-ignore
                                    onChange={e => setAdjForm({ ...adjForm, reason: e.target.value })}
                                    className="w-full p-3 bg-slate-50 rounded-xl border font-bold text-sm outline-none"
                                >
                                    <option value="scholarship">منحة تفوق</option>
                                    <option value="sibling_discount">خصم أخوة</option>
                                    <option value="admin_decision">قرار إداري / استثناء</option>
                                    <option value="penalty">غرامة / رسوم إضافية</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 mb-1 block">القيمة (EGP)</label>
                                <input
                                    type="number"
                                    value={adjForm.amount}
                                    onChange={e => setAdjForm({ ...adjForm, amount: parseFloat(e.target.value) })}
                                    className="w-full p-3 bg-slate-50 rounded-xl border font-black text-lg outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 mb-1 block">ملاحظات (اجباري)</label>
                                <textarea
                                    rows={3}
                                    value={adjForm.note}
                                    onChange={e => setAdjForm({ ...adjForm, note: e.target.value })}
                                    className="w-full p-3 bg-slate-50 rounded-xl border font-bold text-sm outline-none"
                                    placeholder="اشرح سبب التعديل..."
                                />
                            </div>
                            <button
                                onClick={handleAdjustmentSubmit}
                                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 mt-2"
                            >
                                رفع الطلب للاعتماد
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Action Floating Bar */}
            {selectedUserIds.size > 0 && !selectedUser && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-6 z-50 animate-slide-up">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-sm">{selectedUserIds.size}</div>
                        <span className="font-bold text-sm">طالب محدد</span>
                    </div>
                    <div className="h-8 w-[1px] bg-white/20"></div>
                    <button onClick={() => handlePayClick()} className="flex items-center gap-2 hover:text-emerald-400 transition-colors font-bold text-sm">
                        <Banknote size={18} /> دفع رسوم مجمع
                    </button>
                    <button onClick={() => setSelectedUserIds(new Set())} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white">
                        <X size={18} />
                    </button>
                </div>
            )}

            {/* Payment Modal */}
            {payModalOpen && (
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg animate-scale-in overflow-hidden shadow-2xl">
                        <div className="p-8 border-b flex justify-between items-center bg-slate-50">
                            <h3 className="font-black text-xl text-slate-900 flex items-center gap-3">
                                <Wallet className="text-emerald-600" />
                                {payForm.isBulk ? `دفع مجمع (${selectedUserIds.size} طلاب)` : 'تسجيل عملية دفع'}
                            </h3>
                            <button onClick={() => setPayModalOpen(false)}><X size={24} className="text-slate-400 hover:text-slate-900" /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">المبلغ {payForm.isBulk && '(لكل طالب)'}</label>
                                    <input type="number" value={payForm.amount} onChange={e => setPayForm({ ...payForm, amount: parseFloat(e.target.value) })} className="w-full p-4 bg-slate-50 rounded-xl font-black text-2xl outline-none border-2 border-transparent focus:border-emerald-500 tabular-nums" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">نوع العملية</label>
                                    <select value={payForm.categoryId} onChange={e => setPayForm({ ...payForm, categoryId: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold text-sm outline-none border-2 border-transparent focus:border-emerald-500">
                                        <option value="41101">رسوم دراسية</option>
                                        <option value="41102">رسوم كتب</option>
                                        <option value="41103">رسوم زي</option>
                                        <option value="41104">رسوم باص</option>
                                        {financialCategories.filter(c => c.type === 'income').map(c => <option key={c.id} value={c.code}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">عن شهر (الاشتراك)</label>
                                <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100 max-h-32 overflow-y-auto">
                                    {months.map(m => (
                                        <button
                                            key={m.id}
                                            onClick={() => setPayForm({ ...payForm, subscriptionMonth: m.id })}
                                            className={`p-2 rounded-lg text-xs font-bold transition-all ${payForm.subscriptionMonth === m.id ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-emerald-50'}`}
                                        >
                                            {m.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">خزينة التحصيل</label>
                            <select value={payForm.fundId} onChange={e => setPayForm({ ...payForm, fundId: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold text-sm outline-none border-2 border-transparent focus:border-emerald-500">
                                {funds.map(f => <option key={f.id} value={f.accountCode}>{f.name} ({f.balance} LE)</option>)}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">ملاحظات / بيان إضافي</label>
                            <textarea
                                value={payForm.description}
                                onChange={e => setPayForm({ ...payForm, description: e.target.value })}
                                className="w-full p-4 bg-slate-50 rounded-xl font-bold text-sm outline-none border-2 border-transparent focus:border-emerald-500"
                                placeholder="أية ملاحظات إضافية..."
                                rows={2} // Use textarea for better notes experience
                            />
                        </div>

                        <div className="pt-4">
                            <button onClick={handlePaymentSubmit} className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-3">
                                <CheckCircle size={24} /> تأكيد واستلام المبلغ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentFinancialProfile;
