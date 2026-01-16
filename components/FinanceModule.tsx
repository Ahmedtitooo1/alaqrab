
import * as React from 'react';
import { useState, useMemo, useRef, useEffect } from 'react';
import {
   Save, Plus, List, Trash2, ArrowDownCircle, ArrowUpCircle,
   Search, CheckCircle, Printer, X, BookOpen, ChevronLeft, Calendar,
   History, Receipt, Filter, PlusCircle, Edit3, FileSpreadsheet,
   ArrowRightLeft, User, DollarSign, Wallet, Landmark, Info, Users,
   GraduationCap, ClipboardList, Briefcase, PlusSquare, Sparkles, Loader2, UserCheck
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { FinancialEntry, UserRole, User as SystemUser, FinancialCategory } from '../types';
import { classifyFinancialTransaction } from '../services/geminiService';

interface FinanceModuleProps {
   initialMode?: 'list' | 'entry';
}

const FinanceModule: React.FC<FinanceModuleProps> = ({ initialMode = 'list' }) => {
   const {
      financialCategories, financialEntries, addFinancialEntry,
      lang, funds, allUsers, updateStudentSubscription, addNotification,
      updateFinancialEntry, deleteFinancialEntry, systemName, systemLogo
   } = useAppContext();

   const [viewMode, setViewMode] = useState<'list' | 'entry'>(initialMode);
   const [searchQuery, setSearchQuery] = useState('');
   const [voucherType, setVoucherType] = useState<'spending' | 'deposit'>('spending');
   const [isAiClassifying, setIsAiClassifying] = useState(false);
   const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

   const [header, setHeader] = useState({
      entryNo: 'VCH-' + Date.now().toString().slice(-6),
      date: new Date().toISOString().split('T')[0],
      description: '',
      fundAccount: '11101',
      totalAmount: 0,
      currency: 'EGP',
      exchangeRate: 1
   });

   const [lines, setLines] = useState<any[]>([
      { id: '1', description: '', amount: 0, category: '', subTargetId: '', subTargetSearch: '', isSearchOpen: false }
   ]);

   const filteredCategories = useMemo(() => {
      return financialCategories.filter(c => {
         if (c.level <= 1) return false;
         if (voucherType === 'spending') {
            return c.type === 'expense' || c.code.startsWith('2') || c.code.startsWith('113');
         } else {
            return c.type === 'income' || c.code.startsWith('112') || c.code.startsWith('212');
         }
      });
   }, [financialCategories, voucherType]);

   // منطق تصفية الأشخاص بناءً على الحساب المختار
   const getFilteredPersons = (categoryCode: string, search: string) => {
      let pool = [];
      const query = search.toLowerCase();

      // إذا كان حساب طلاب (112)
      if (categoryCode.startsWith('112')) {
         pool = allUsers.filter(u => u.role === UserRole.STUDENT);
      }
      // إذا كان حساب موظفين (رواتب 5201، ذمم موظفين 211، عهدة)
      else if (categoryCode.startsWith('5201') || categoryCode.startsWith('211')) {
         pool = allUsers.filter(u => u.role !== UserRole.STUDENT && u.role !== UserRole.SUPER_ADMIN);
      }

      return pool.filter(u =>
         (u.firstName + ' ' + u.lastName).toLowerCase().includes(query) ||
         (u.code || '').toLowerCase().includes(query)
      );
   };

   const addLine = () => setLines([...lines, { id: Date.now().toString(), description: '', amount: 0, category: '', subTargetId: '', subTargetSearch: '', isSearchOpen: false }]);
   const removeLine = (id: string) => setLines(lines.filter(l => l.id !== id));

   const handleLineChange = (id: string, field: string, value: any) => {
      setLines(lines.map(l => l.id === id ? { ...l, [field]: value } : l));
   };

   const handleAiClassification = async (lineId: string, desc: string) => {
      if (!desc || desc.length < 5) return;
      setIsAiClassifying(true);
      const result = await classifyFinancialTransaction(desc, voucherType);
      if (result && result.suggestedAccountCode) {
         const exists = financialCategories.find(c => c.code.startsWith(result.suggestedAccountCode) || result.suggestedAccountCode.startsWith(c.code));
         if (exists) {
            handleLineChange(lineId, 'category', exists.code);
            addNotification({ title: 'AI Classifier', content: `تم اقتراح حساب: ${exists.name}`, type: 'info', date: new Date().toISOString() });
         }
      }
      setIsAiClassifying(false);
   };

   // وظيفة لتعديل القيد وملء النموذج
   const handleEditEntry = (entry: FinancialEntry) => {
      const isSpending = funds.some(f => f.accountCode === entry.creditAccount);
      setVoucherType(isSpending ? 'spending' : 'deposit');

      // محاولة استعادة معرف السند الأساسي
      const baseId = entry.id.includes('-') ? entry.id.split('-').slice(0, 2).join('-') : entry.id;

      setHeader({
         entryNo: baseId,
         date: entry.date,
         description: entry.description,
         fundAccount: isSpending ? entry.creditAccount : entry.debitAccount,
         totalAmount: entry.amount
      });

      setLines([{
         id: '1',
         description: entry.description,
         amount: entry.amount,
         category: isSpending ? entry.debitAccount : entry.creditAccount,
         subTargetId: '',
         subTargetSearch: '',
         isSearchOpen: false
      }]);

      setViewMode('entry');
      setEditingEntryId(entry.id);
   };

   const handleSaveVoucher = () => {
      const total = lines.reduce((sum, l) => sum + parseFloat(l.amount || 0), 0);
      if (total <= 0) return alert("لا يمكن ترحيل سند بمبلغ صفر");

      if (editingEntryId) {
         deleteFinancialEntry(editingEntryId);
      }

      lines.forEach(line => {
         const entry: FinancialEntry = {
            id: header.entryNo + (lines.length > 1 ? '-' + line.id : ''),
            date: header.date,
            description: `${line.description || header.description}${line.subTargetId ? ' - للعميل: ' + (allUsers.find(u => u.id === line.subTargetId)?.firstName || '') : ''}`,
            amount: parseFloat(line.amount),
            debitAccount: voucherType === 'spending' ? line.category : header.fundAccount,
            creditAccount: voucherType === 'spending' ? header.fundAccount : line.category,
            refType: 'manual',
            currency: (header as any).currency,
            exchangeRate: (header as any).exchangeRate
         };
         addFinancialEntry(entry);
      });

      addNotification({ title: 'تم الحفظ', content: `تم ترحيل السند وتحديث سجلات الأطراف المعنية بنجاح.`, type: 'success', date: header.date });
      setViewMode('list');
      setEditingEntryId(null);
      setLines([{ id: '1', description: '', amount: 0, category: '', subTargetId: '', subTargetSearch: '', isSearchOpen: false }]);
   };

   const PrintVoucherTemplate = () => (
      <div className="hidden print:block bg-white p-2 min-h-screen text-right font-serif" dir="rtl">
         <div className="border-[8px] border-double border-slate-900 p-12 relative min-h-[800px] flex flex-col rounded-[2rem]">
            {/* Header */}
            <div className="flex justify-between items-start border-b-[4px] border-slate-900 pb-10 mb-12">
               <div className="w-1/3 space-y-3">
                  <h2 className="text-3xl font-black text-slate-900">{systemName}</h2>
                  <div className="h-1.5 w-16 bg-slate-900"></div>
                  <p className="font-bold text-lg">الفرع الرئيسي - الإدارة المالية</p>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-relaxed">Accounts & Financial Operations</p>
               </div>

               <div className="w-1/3 text-center">
                  <img src={systemLogo} className="h-28 w-28 mx-auto mb-6 p-4 bg-white shadow-xl rounded-3xl border border-slate-50" />
                  <div className={`inline-block px-12 py-3 text-white rounded-full font-black text-3xl shadow-xl ${voucherType === 'spending' ? 'bg-rose-700 shadow-rose-100' : 'bg-emerald-700 shadow-emerald-100'}`}>
                     {voucherType === 'spending' ? 'سند صرف نقدي' : 'سند قبض نقدي'}
                  </div>
                  <p className="text-[10px] mt-4 font-black text-slate-400 tracking-[0.4em] uppercase">Official Payment Voucher</p>
               </div>

               <div className="w-1/3 text-left rtl:text-right font-black text-sm space-y-2">
                  <div className="p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 shadow-sm inline-block min-w-[200px]">
                     <p className="text-slate-400 text-[10px] mb-2 uppercase tracking-widest">Serial Information</p>
                     <p>رقم السند: <span className="text-xl text-indigo-700 font-mono">{header.entryNo}</span></p>
                     <p>التاريخ: <span className="font-mono text-slate-600">{header.date}</span></p>
                     <p>المحاسب: {allUsers.find(u => u.role === UserRole.ACCOUNTANT)?.firstName || 'الإدارة المالية'}</p>
                  </div>
               </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 space-y-12">
               {/* Summary Info */}
               <div className="grid grid-cols-2 gap-10">
                  <div className="p-8 border-2 border-indigo-50 bg-indigo-50/20 rounded-[2.5rem] relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-white/50 -mr-12 -mt-12 rounded-full blur-2xl"></div>
                     <p className="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-widest">المستلم / الدافع</p>
                     <p className="text-2xl font-black text-slate-900 border-b-2 border-dotted border-slate-300 pb-3">....................................................................</p>
                  </div>
                  <div className="p-8 border-2 border-indigo-50 bg-indigo-50/20 rounded-[2.5rem] relative overflow-hidden text-center">
                     <p className="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-widest">تحميل على حساب</p>
                     <p className="text-xl font-black text-slate-900 leading-tight">
                        {lines[0]?.category ? financialCategories.find(c => c.code === lines[0].category)?.name : 'بند مالي متنوع'}
                        <br />
                        <span className="text-sm font-mono text-indigo-600">{lines[0]?.category}</span>
                     </p>
                  </div>
               </div>

               {/* Table of Items */}
               <table className="w-full border-collapse">
                  <thead>
                     <tr className="bg-slate-900 text-white">
                        <th className="p-5 border border-slate-800 font-black text-right rounded-tr-2xl w-16">م</th>
                        <th className="p-5 border border-slate-800 font-black text-right">البيان وتفاصيل العملية</th>
                        <th className="p-5 border border-slate-800 font-black text-center rounded-tl-2xl w-48">المبلغ (EGP)</th>
                     </tr>
                  </thead>
                  <tbody className="bg-white">
                     {lines.map((l, i) => (
                        <tr key={l.id} className="border-b-2 border-slate-100">
                           <td className="p-6 border-x border-slate-100 text-center font-black text-slate-400">{i + 1}</td>
                           <td className="p-6 border-x border-slate-100 font-black text-xl text-slate-900">{l.description || header.description}</td>
                           <td className="p-6 border-x border-slate-100 text-center font-black text-2xl tabular-nums text-indigo-700">{parseFloat(l.amount || 0).toLocaleString()}</td>
                        </tr>
                     ))}
                     {/* Empty lines to maintain height */}
                     {[...Array(Math.max(0, 3 - lines.length))].map((_, i) => (
                        <tr key={`empty-${i}`} className="border-b-2 border-slate-100 h-20">
                           <td className="p-6 border-x border-slate-100"></td>
                           <td className="p-6 border-x border-slate-100"></td>
                           <td className="p-6 border-x border-slate-100"></td>
                        </tr>
                     ))}
                  </tbody>
                  <tfoot>
                     <tr className="bg-slate-100">
                        <td colSpan={2} className="p-8 text-left text-2xl font-black border-2 border-slate-900">إجمالي المبلغ بالحروف: ........................................................................</td>
                        <td className="p-8 text-center text-4xl font-black bg-slate-900 text-white border-2 border-slate-900 underline decoration-double shadow-2xl">
                           {lines.reduce((s, l) => s + parseFloat(l.amount || 0), 0).toLocaleString()}
                        </td>
                     </tr>
                  </tfoot>
               </table>
            </div>

            {/* Bottom Section */}
            <div className="mt-20 flex justify-between gap-16 text-center">
               <div className="flex-1 space-y-10 group">
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-indigo-600 w-1/3"></div>
                  </div>
                  <p className="text-xl font-black text-slate-900">توقيع المستلم / المخول</p>
                  <div className="h-24 border-2 border-dashed border-slate-200 rounded-3xl"></div>
               </div>

               <div className="flex flex-col items-center justify-center -mt-10">
                  <div className="relative w-48 h-48 border-[6px] border-double border-slate-900/10 rounded-full flex items-center justify-center p-4">
                     <div className="text-[10px] font-black text-slate-400 uppercase text-center leading-tight tracking-[0.2em] relative z-10">
                        OFFICIAL STAMP<br />REQUIRED HERE<br />{systemName}<br />{new Date().getFullYear()}
                     </div>
                     <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] grayscale rotate-12">
                        <img src={systemLogo} className="w-32 h-32 object-contain" />
                     </div>
                  </div>
               </div>

               <div className="flex-1 space-y-10">
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-indigo-600 w-1/3 float-left"></div>
                  </div>
                  <p className="text-xl font-black text-slate-900">اعتماد المحاسب / المدير</p>
                  <div className="h-24 border-2 border-dashed border-slate-200 rounded-3xl"></div>
               </div>
            </div>

            {/* Footer */}
            <div className="mt-16 pt-8 border-t-[2px] border-slate-100 flex justify-between items-center opacity-40">
               <div className="text-[10px] space-y-1">
                  <p className="font-bold underline">ملاحظات أمنية:</p>
                  <p>تعتبر هذه الورقة ملغاة في حال وجود كشط أو تعديل يدوي في الأرقام.</p>
               </div>
               <div className="text-center">
                  <p className="text-[9px] font-black tracking-[0.5em] uppercase">Security Verified System</p>
                  <p className="text-[8px] font-bold">Generated at: {new Date().toLocaleString('ar-EG')}</p>
               </div>
               <div className="h-12 w-12 grayscale">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=vch-${header.entryNo}`} />
               </div>
            </div>
         </div>
      </div>
   );

   return (
      <div className="space-y-10 animate-view pb-24 text-right">
         <PrintVoucherTemplate />
         <div className="flex justify-between items-center no-print">
            <div className="flex items-center gap-6">
               <div className="p-5 bg-indigo-600 text-white rounded-[1.75rem] shadow-xl"><FileSpreadsheet size={40} /></div>
               <div>
                  <h2 className="text-3xl font-black text-slate-900">{viewMode === 'list' ? 'دفتر اليومية العامة' : 'منشئ السندات الذكي (AI)'}</h2>
                  <p className="text-slate-500 font-bold">إدارة القيود والسندات مع التوجيه الآلي للحسابات والأشخاص.</p>
               </div>
            </div>
            <button onClick={() => { setViewMode(viewMode === 'list' ? 'entry' : 'list'); setEditingEntryId(null); }} className="px-10 py-5 bg-slate-950 text-white rounded-2xl font-black text-xs flex items-center gap-3 shadow-xl active:scale-95 transition-all">
               {viewMode === 'list' ? <PlusCircle size={20} /> : <List size={20} />}
               {viewMode === 'list' ? 'تحرير سند جديد' : 'العودة لدفتر اليومية'}
            </button>
         </div>

         {viewMode === 'entry' ? (
            <div className="max-w-6xl mx-auto space-y-10 animate-view">
               <div className="flex justify-center">
                  <div className="bg-white p-2 rounded-[2rem] shadow-xl border-2 border-slate-50 flex gap-2">
                     <button onClick={() => setVoucherType('spending')} className={`px-14 py-4 rounded-3xl font-black text-sm flex items-center gap-3 transition-all ${voucherType === 'spending' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}><ArrowUpCircle size={20} /> سند صرف</button>
                     <button onClick={() => setVoucherType('deposit')} className={`px-14 py-4 rounded-3xl font-black text-sm flex items-center gap-3 transition-all ${voucherType === 'deposit' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}><ArrowDownCircle size={20} /> سند قبض</button>
                  </div>
               </div>

               <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1 space-y-8">
                     <div className="glass-panel p-10 bg-white rounded-[3rem] border shadow-sm space-y-8 relative overflow-hidden">
                        {/* Header Information (Voucher # and Date) */}
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b pb-8">
                           <div className="flex gap-4 items-center">
                              <div className="space-y-1">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">رقم السند</label>
                                 <div className="p-4 bg-slate-900 text-white rounded-2xl font-mono font-black text-lg shadow-inner">
                                    {header.entryNo}
                                 </div>
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">تاريخ السند</label>
                                 <input type="date" value={header.date} onChange={e => setHeader({ ...header, date: e.target.value })} className="p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl font-black text-sm outline-none shadow-inner" />
                              </div>
                           </div>
                           <div className="flex-1 w-full md:w-auto text-right space-y-4">
                              <div className="space-y-1">
                                 <label className="text-[10px] font-black text-indigo-600 uppercase px-2 tracking-widest">الصندوق المالي (الخزينة/البنك)</label>
                                 <select value={header.fundAccount} onChange={e => setHeader({ ...header, fundAccount: e.target.value })} className="w-full p-4 bg-indigo-50/50 border-2 border-transparent focus:border-indigo-600 rounded-2xl font-black text-sm outline-none shadow-inner">
                                    {funds.map(f => <option key={f.id} value={f.accountCode}>{f.name} ({f.balance.toLocaleString()} ج.م)</option>)}
                                 </select>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">العملة</label>
                                    <select value={(header as any).currency} onChange={e => setHeader({ ...header, currency: e.target.value })} className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl font-black text-sm outline-none shadow-inner">
                                       <option value="EGP">EGP (جنيه مصري)</option>
                                       <option value="USD">USD (دولار أمريكي)</option>
                                       <option value="SAR">SAR (ريال سعودي)</option>
                                       <option value="EUR">EUR (يورو)</option>
                                    </select>
                                 </div>
                                 <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">سعر الصرف</label>
                                    <input type="number" step="0.01" value={(header as any).exchangeRate} onChange={e => setHeader({ ...header, exchangeRate: parseFloat(e.target.value) })} className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl font-black text-sm outline-none shadow-inner" />
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="flex justify-between items-center">
                           <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3"><ClipboardList className="text-indigo-600" /> بنود العمليات والتوجيه المحاسبي</h4>
                           <button onClick={addLine} className="p-4 bg-indigo-600 text-white rounded-2xl hover:bg-slate-950 transition-all shadow-xl flex items-center gap-2 text-xs font-black"><Plus size={18} /> إضافة بند جديد</button>
                        </div>

                        <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar pr-2">
                           {lines.map((line, idx) => {
                              const filteredPersons = getFilteredPersons(line.category, line.subTargetSearch || '');
                              const needsPerson = line.category.startsWith('112') || line.category.startsWith('5201') || line.category.startsWith('211');

                              return (
                                 <div key={line.id} className="p-8 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 space-y-6 animate-view relative group">
                                    <button onClick={() => removeLine(line.id)} className="absolute top-6 left-6 p-2 text-slate-300 hover:text-rose-600 transition-all opacity-0 group-hover:opacity-100"><X size={18} /></button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                       <div className="space-y-1 relative">
                                          <label className="text-[9px] font-black text-slate-400 uppercase px-2">البند / البيان</label>
                                          <input
                                             value={line.description}
                                             onBlur={(e) => handleAiClassification(line.id, e.target.value)}
                                             onChange={e => handleLineChange(line.id, 'description', e.target.value)}
                                             className="w-full p-4 bg-white rounded-xl font-bold text-xs"
                                             placeholder="اكتب البيان وسيقوم الـ AI بالاقتراح..."
                                          />
                                          {isAiClassifying && <Loader2 size={14} className="absolute left-4 bottom-4 animate-spin text-indigo-400" />}
                                       </div>
                                       <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase px-2">المبلغ</label><input type="number" value={line.amount} onChange={e => handleLineChange(line.id, 'amount', e.target.value)} className="w-full p-4 bg-white rounded-xl font-black text-lg tabular-nums text-center" /></div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                       <div className="space-y-1"><label className="text-[9px] font-black text-indigo-600 uppercase px-2">التصنيف المحاسبي</label>
                                          <select value={line.category} onChange={e => handleLineChange(line.id, 'category', e.target.value)} className="w-full p-4 bg-white rounded-xl font-black text-xs border-2 border-transparent focus:border-indigo-600">
                                             <option value="">-- اختر الحساب --</option>
                                             {filteredCategories.map(a => <option key={a.id} value={a.code}>{a.name} ({a.code})</option>)}
                                          </select>
                                       </div>

                                       {/* حقل البحث الذكي عن الأشخاص */}
                                       {needsPerson && (
                                          <div className="space-y-1 relative animate-view">
                                             <label className="text-[9px] font-black text-blue-600 uppercase px-2">تحديد الشخص المستهدف (بحث ذكي)</label>
                                             <div className="relative">
                                                <input
                                                   value={line.subTargetSearch}
                                                   onFocus={() => handleLineChange(line.id, 'isSearchOpen', true)}
                                                   onChange={e => handleLineChange(line.id, 'subTargetSearch', e.target.value)}
                                                   className="w-full p-4 bg-white rounded-xl font-black text-xs border-2 border-blue-100"
                                                   placeholder="ابدأ بكتابة اسم الطالب أو الموظف..."
                                                />
                                                {line.subTargetId && <CheckCircle size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />}
                                             </div>

                                             {line.isSearchOpen && (
                                                <div className="absolute z-[100] w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 max-h-[250px] overflow-y-auto no-scrollbar p-2 space-y-1 animate-view">
                                                   {filteredPersons.length > 0 ? filteredPersons.map(p => (
                                                      <button
                                                         key={p.id}
                                                         onClick={() => {
                                                            handleLineChange(line.id, 'subTargetId', p.id);
                                                            handleLineChange(line.id, 'subTargetSearch', `${p.firstName} ${p.lastName} (${p.code})`);
                                                            handleLineChange(line.id, 'isSearchOpen', false);
                                                         }}
                                                         className="w-full p-4 rounded-xl hover:bg-blue-50 text-right flex items-center justify-between group transition-all"
                                                      >
                                                         <div className="flex items-center gap-3">
                                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.username}`} className="w-8 h-8 rounded-lg bg-slate-50" />
                                                            <span className="font-bold text-sm text-slate-800">{p.firstName} {p.lastName}</span>
                                                         </div>
                                                         <span className="text-[9px] font-mono text-slate-400 group-hover:text-blue-600">{p.code}</span>
                                                      </button>
                                                   )) : <div className="p-10 text-center text-slate-300 font-bold italic text-xs">لا توجد نتائج مطابقة</div>}
                                                </div>
                                             )}
                                          </div>
                                       )}
                                    </div>
                                 </div>
                              );
                           })}
                        </div>

                        <button onClick={handleSaveVoucher} className={`w-full mt-8 py-7 text-white rounded-[2.5rem] font-black text-2xl shadow-3xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-6 ${voucherType === 'spending' ? 'bg-slate-950 hover:bg-black shadow-rose-950/10' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-950/10'}`}>
                           <CheckCircle size={36} /> {editingEntryId ? 'حفظ تعديلات السند' : (voucherType === 'spending' ? 'ترحيل سند الصرف' : 'ترحيل سند القبض')}
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         ) : (
            <div className="glass-panel overflow-hidden bg-white rounded-[3rem] shadow-sm border border-slate-100">
               {/* سجل القيود */}
               <div className="p-8 border-b flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/30">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                     <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600"><History size={24} /></div>
                     <h3 className="font-black text-xl text-slate-900 tracking-tight">سجل اليومية والعمليات</h3>
                  </div>
                  <div className="flex items-center gap-4 w-full md:w-96">
                     <div className="relative flex-1">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="بحث برقم القيد أو البيان..." className="w-full p-4 pr-12 rounded-2xl bg-white border border-slate-100 outline-none font-bold text-sm shadow-inner" />
                     </div>
                  </div>
               </div>
               <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-right min-w-[1000px]">
                     <thead>
                        <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 border-b">
                           <th className="p-8">التاريخ</th>
                           <th className="p-8">رقم القيد</th>
                           <th className="p-8">البيان</th>
                           <th className="p-8">المدين (+)</th>
                           <th className="p-8">الدائن (-)</th>
                           <th className="p-8 text-center">المبلغ</th>
                           <th className="p-8 text-center no-print">إجراء</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50 font-bold text-sm text-slate-700">
                        {financialEntries.filter(e => e.description.includes(searchQuery) || e.id.includes(searchQuery)).map(e => {
                           const isSpending = funds.some(f => f.accountCode === e.creditAccount);
                           return (
                              <tr key={e.id} className="hover:bg-indigo-50/30 transition-colors">
                                 <td className="p-8 text-slate-400 font-mono text-xs whitespace-nowrap">{e.date}</td>
                                 <td className="p-8"><span className="px-4 py-1.5 bg-slate-900 text-white rounded-lg font-black text-xs">{e.id}</span></td>
                                 <td className="p-8 max-w-xs truncate">{e.description}</td>
                                 <td className="p-8 text-indigo-700">{financialCategories.find(c => c.code === e.debitAccount)?.name || e.debitAccount}</td>
                                 <td className="p-8 text-rose-700">{financialCategories.find(c => c.code === e.creditAccount)?.name || e.creditAccount}</td>
                                 <td className={`p-8 text-center font-black tabular-nums text-lg ${isSpending ? 'text-rose-600' : 'text-emerald-600'}`}>
                                    {isSpending ? '-' : '+'}{e.amount.toLocaleString()} <span className="text-[10px] opacity-20">ج.م</span>
                                 </td>
                                 <td className="p-8 no-print text-center">
                                    <div className="flex justify-center gap-2">
                                       <button onClick={() => window.print()} className="p-2 text-slate-300 hover:text-indigo-600"><Printer size={16} /></button>
                                       <button onClick={() => handleEditEntry(e)} className="p-2 text-slate-300 hover:text-amber-600"><Edit3 size={16} /></button>
                                       <button onClick={() => deleteFinancialEntry(e.id)} className="p-2 text-slate-300 hover:text-rose-600"><Trash2 size={16} /></button>
                                    </div>
                                 </td>
                              </tr>
                           );
                        })}
                     </tbody>
                  </table>
               </div>
            </div>
         )}
      </div>
   );
};

export default FinanceModule;
