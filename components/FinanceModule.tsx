
import React, { useState, useMemo } from 'react';
import {
   Save, Plus, List, Trash2, ArrowDownCircle, ArrowUpCircle,
   Search, CheckCircle, Printer, X, BookOpen, ChevronLeft,
   History, PlusCircle, Edit3, FileSpreadsheet,
   Wallet, Coins, Boxes, Truck, GraduationCap, Briefcase, ClipboardList,
   Building, QrCode, Lock, PlusSquare, User, Users, BarChart3, PieChart
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { FinancialEntry, FinancialCategory, FinancialFund, UserRole } from '../types';
import { classifyFinancialTransaction } from '../services/geminiService';
import { openProfessionalPrintWindow, generateVoucherHTML, generateZReportHTML } from '../src/utils/printUtils';

interface FinanceModuleProps {
   initialMode?: 'list' | 'entry' | 'payment-requests' | 'boxes' | 'currencies' | 'z-report' | 'reports' | 'coa';
}

const FinanceModule: React.FC<FinanceModuleProps> = ({ initialMode = 'list' }) => {
   const {
      financialCategories, financialEntries, addFinancialEntry,
      funds, allUsers, addNotification, deleteFinancialEntry,
      paymentRequests, updatePaymentStatus,
      addFinancialFund, systemName, user, systemLogo, updateFinancialFund, suppliers,
      financialSettings, postFinancialEntries
   } = useAppContext();

   const [viewMode, setViewMode] = useState<FinanceModuleProps['initialMode']>(initialMode);
   const [searchQuery, setSearchQuery] = useState('');
   const [voucherType, setVoucherType] = useState<'spending' | 'deposit'>('spending');
   const [isAiClassifying, setIsAiClassifying] = useState(false);
   const [isProcessing, setIsProcessing] = useState(false);
   const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

   // Z-Report State
   const [zReportData, setZReportData] = useState({
      actualCash: 0,
      selectedFund: '',
      notes: ''
   });

   // Add Fund State
   const [newFund, setNewFund] = useState({ name: '', type: 'cash' as any, balance: 0, accountCode: '11105' });
   const [showAddFund, setShowAddFund] = useState(false);

   const [header, setHeader] = useState({
      entryNo: 'VCH-' + Date.now().toString().slice(-6),
      date: new Date().toISOString().split('T')[0],
      description: '',
      fundAccount: '11101',
      totalAmount: 0,
      currency: financialSettings.currency || 'EGP',
      exchangeRate: 1
   });

   const [lines, setLines] = useState<any[]>([
      { id: '1', description: '', amount: 0, category: '', subTargetId: '', subTargetSearch: '', isSearchOpen: false, entityType: 'general' }
   ]);

   // --- HELPERS ---
   const filteredCategories = useMemo(() => {
      return financialCategories.filter(c => {
         if (c.level <= 1) return false;
         if (voucherType === 'spending') {
            return c.type !== 'income';
         } else {
            return c.type !== 'expense';
         }
      });
   }, [financialCategories, voucherType]);

   const addLine = () => setLines(prev => [...prev, { id: Date.now().toString(), description: '', amount: 0, category: '', subTargetId: '', subTargetSearch: '', isSearchOpen: false, entityType: 'general' }]);
   const removeLine = (id: string) => setLines(prev => prev.filter(l => l.id !== id));
   const handleLineChange = (id: string, field: string, value: any) => setLines(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));

   const handleEntityTypeChange = (lineId: string, type: string) => {
      setLines(prev => prev.map(l => l.id === lineId ? { ...l, entityType: type, subTargetId: '', subTargetSearch: '', isSearchOpen: type !== 'general' } : l));
   }

   const handleCategorySelect = (lineId: string, categoryName: string) => {
      setLines(prev => prev.map(line => {
         if (line.id !== lineId) return line;
         const match = filteredCategories.find(c => c.name === categoryName || c.code === categoryName);
         if (!match) return {
            ...line,
            categorySearch: categoryName,
            category: '',
         };

         let newEntityType = line.entityType;
         let isSearchOpen = line.isSearchOpen;

         if (newEntityType === 'general') {
            if (match.code.startsWith('112') || (match.type === 'income' && (match.name.includes('دراس') || match.name.includes('رسوم')))) {
               newEntityType = 'student'; isSearchOpen = true;
            } else if (match.code.startsWith('212') || match.type === 'expense') {
               if (match.name.includes('رواتب') || match.name.includes('سلف') || match.name.includes('عهدة')) {
                  newEntityType = 'employee'; isSearchOpen = true;
               } else if (match.type === 'expense' && (match.name.includes('كهرباء') || match.name.includes('نت') || match.name.includes('مياه') || match.name.includes('صيانة'))) {
                  newEntityType = 'general';
               } else {
                  newEntityType = 'supplier'; isSearchOpen = true;
               }
            }
         }
         return {
            ...line, categorySearch: categoryName, category: match.code, entityType: newEntityType, isSearchOpen: isSearchOpen
         };
      }));
   };

   // --- MAIN ACTIONS ---

   const handleSaveVoucher = () => {
      const total = lines.reduce((sum, l) => sum + parseFloat(l.amount || 0), 0);
      if (total <= 0) return alert("لا يمكن ترحيل سند بمبلغ صفر");

      setIsProcessing(true);

      setTimeout(() => {
         if (editingEntryId) deleteFinancialEntry(editingEntryId);

         lines.forEach(line => {
            const amount = parseFloat(line.amount);
            let taxVal = 0;
            let netVal = amount;

            if (financialSettings.taxRate > 0) {
               netVal = amount / (1 + (financialSettings.taxRate / 100));
               taxVal = amount - netVal;
            }

            const entry: FinancialEntry = {
               id: header.entryNo + (lines.length > 1 ? '-' + line.id : ''),
               date: header.date,
               description: `${line.description || header.description}${line.subTargetId ? ' - Ent: ' + (allUsers.find(u => u.id === line.subTargetId)?.firstName || '') : ''}`,
               amount: amount,
               taxAmount: parseFloat(taxVal.toFixed(2)),
               netAmount: parseFloat(netVal.toFixed(2)),
               debitAccount: voucherType === 'spending' ? line.category : header.fundAccount,
               creditAccount: voucherType === 'spending' ? header.fundAccount : line.category,
               institutionId: user?.institutionId || '',
               targetId: line.subTargetId,
               refType: 'invoice',
               currency: header.currency,
               exchangeRate: header.exchangeRate,
               status: 'draft',
               invoiceNumber: `INV-${Date.now()}`
            };
            addFinancialEntry(entry);
         });

         addNotification({ title: 'Success', content: 'Entry Saved Successfully', type: 'success', date: new Date().toISOString() });

         setViewMode('list');
         setEditingEntryId(null);
         setHeader({ ...header, entryNo: 'VCH-' + Date.now().toString().slice(-6), description: '', totalAmount: 0 });
         setLines([{ id: '1', description: '', amount: 0, category: '', subTargetId: '', subTargetSearch: '', isSearchOpen: false, entityType: 'general' }]);
         setIsProcessing(false);
      }, 800);
   };

   const handlePrintInvoice = (entry: FinancialEntry) => {
      const debitName = financialCategories.find(c => c.code === entry.debitAccount)?.name;
      openProfessionalPrintWindow(`<h1>Reprinting Invoice...</h1>`, { title: 'Invoice' });
   };

   const handleAddFund = () => {
      if (!newFund.name) return;
      addFinancialFund({
         id: `fund-${Date.now()}`,
         name: newFund.name,
         type: newFund.type,
         balance: newFund.balance,
         accountCode: newFund.accountCode,
         institutionId: user?.institutionId || ''
      });
      setShowAddFund(false);
      setNewFund({ name: '', type: 'cash', balance: 0, accountCode: '11105' });
   };

   const handleZReport = () => {
      if (!zReportData.selectedFund) return alert("اختر الخزينة");
      const fund = funds.find(f => f.id === zReportData.selectedFund);
      if (!fund) return;

      const todayEntries = financialEntries.filter(e => e.date === new Date().toISOString().split('T')[0]);
      const income = todayEntries.filter(e => e.creditAccount === fund.accountCode).reduce((a, b) => a + b.amount, 0); // Money In if fund is Debited (Wait, standard logic: Fund Debit = Increase)
      // Let's stick to simple logic: Debit Account = Fund -> Money IN. Credit Account = Fund -> Money OUT.

      const moneyIn = todayEntries.filter(e => e.debitAccount === fund.accountCode).reduce((a, b) => a + b.amount, 0);
      const moneyOut = todayEntries.filter(e => e.creditAccount === fund.accountCode).reduce((a, b) => a + b.amount, 0);

      const expected = fund.balance; // Current balance is practically expected if updated real-time
      const diff = zReportData.actualCash - expected;

      alert(`Z-Report Generated!\nMoney In: ${moneyIn}\nMoney Out: ${moneyOut}\nDiff: ${diff}`);
      // Trigger Print...
   };

   const getSubTargetOptions = (type: string) => {
      if (type === 'student') return allUsers.filter(u => u.role === UserRole.STUDENT);
      if (type === 'employee') return allUsers.filter(u => u.role === UserRole.TEACHER || u.role === UserRole.ACCOUNTANT || u.role === UserRole.ADMIN || u.role === UserRole.SECRETARY);
      if (type === 'supplier') return suppliers.map(s => ({ id: s.id, firstName: s.name, role: 'supplier' }));
      return [];
   };

   return (
      <div className="space-y-10 animate-view pb-24 text-right">
         <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-100 rounded-[2rem] w-fit mx-auto no-print">
            {[
               { id: 'list', label: 'العمليات', icon: <History size={16} /> },
               { id: 'entry', label: 'سند جديد', icon: <PlusSquare size={16} /> },
               { id: 'payment-requests', label: 'طلبات الدفع', icon: <Boxes size={16} />, badge: paymentRequests.filter(r => r.status === 'pending').length },
               { id: 'boxes', label: 'الصناديق', icon: <Wallet size={16} /> },
               { id: 'z-report', label: 'إغلاق وردية', icon: <List size={16} /> },
               { id: 'currencies', label: 'العملات', icon: <Coins size={16} /> },
               { id: 'reports', label: 'التقارير', icon: <BarChart3 size={16} /> },
            ].map(tab => (
               <button key={tab.id} onClick={() => setViewMode(tab.id as any)} className={`px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition-all ${viewMode === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white'}`}>
                  {tab.icon} {tab.label}
                  {tab.badge ? <span className="bg-rose-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">{tab.badge}</span> : null}
               </button>
            ))}
         </div>

         {/* List View with Posting Button */}
         {viewMode === 'list' && (
            <div className="glass-panel bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
               <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-xl font-black">سجل العمليات اليومية</h3>
                  <div className="flex gap-3">
                     <button onClick={postFinancialEntries} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2">
                        <Lock size={16} /> إغلاق الورية / ترحيل القيود
                     </button>
                     <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="بحث..." className="p-3 bg-white rounded-xl border border-slate-200 outline-none font-bold text-xs" />
                  </div>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-right">
                     <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase">
                        <tr>
                           <th className="p-4">الحالة</th>
                           <th className="p-4">رقم السند</th>
                           <th className="p-4">الوصف</th>
                           <th className="p-4 text-center">المبلغ</th>
                           <th className="p-4 text-center">الضريبة</th>
                           <th className="p-4 text-center">طباعة</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y font-bold text-sm text-slate-700">
                        {financialEntries.slice(0, 50).map(e => (
                           <tr key={e.id} className="hover:bg-indigo-50/20 transition-all">
                              <td className="p-4">
                                 {e.status === 'posted' ?
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px]">Posted</span> :
                                    <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px]">Draft</span>
                                 }
                              </td>
                              <td className="p-4 font-mono text-xs">{e.id}</td>
                              <td className="p-4 text-xs">{e.description}</td>
                              <td className="p-4 text-center">{e.amount.toLocaleString()}</td>
                              <td className="p-4 text-center text-xs text-slate-400">{e.taxAmount ? e.taxAmount.toLocaleString() : '-'}</td>
                              <td className="p-4 text-center">
                                 <button onClick={() => handlePrintInvoice(e)} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all">
                                    <Printer size={16} />
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}

         {/* Payment Requests View */}
         {viewMode === 'payment-requests' && (
            <div className="space-y-6">
               {paymentRequests.length === 0 ? (
                  <div className="p-20 text-center font-black text-slate-300">لا توجد طلبات دفع معلقة</div>
               ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {paymentRequests.map(req => (
                        <div key={req.id} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center">
                           <div>
                              <p className="font-black text-slate-900">{req.studentName}</p>
                              <p className="text-xs text-slate-500">{req.amount} EGP - {req.type}</p>
                           </div>
                           <div className="flex gap-2">
                              <button onClick={() => updatePaymentStatus(req.id, 'approved')} className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-xs">قبول</button>
                              <button onClick={() => updatePaymentStatus(req.id, 'rejected')} className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl font-bold text-xs">رفض</button>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         )}

         {/* Entry Form */}
         {viewMode === 'entry' && (
            <div className="max-w-4xl mx-auto space-y-8 animate-view">
               <div className="glass-panel p-8 bg-white rounded-[3rem] border shadow-sm space-y-8">
                  <div className="flex justify-between items-center border-b pb-6">
                     <h3 className="text-2xl font-black">إضافة سند جديد</h3>
                     <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                        <button onClick={() => setVoucherType('spending')} className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${voucherType === 'spending' ? 'bg-white shadow text-indigo-600' : 'text-slate-400'}`}>صرف</button>
                        <button onClick={() => setVoucherType('deposit')} className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${voucherType === 'deposit' ? 'bg-white shadow text-emerald-600' : 'text-slate-400'}`}>قبض</button>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 px-2 uppercase">رقم السند</label>
                        <input value={header.entryNo} readOnly className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-slate-500" />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 px-2 uppercase">التاريخ</label>
                        <input type="date" value={header.date} onChange={e => setHeader({ ...header, date: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl font-bold" />
                     </div>
                     <div className="col-span-2 space-y-1">
                        <label className="text-[10px] font-black text-slate-400 px-2 uppercase">الصندوق / الخزينة</label>
                        <select value={header.fundAccount} onChange={e => setHeader({ ...header, fundAccount: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none">
                           {funds.map(f => <option key={f.id} value={f.accountCode}>{f.name}</option>)}
                        </select>
                     </div>
                  </div>

                  <div className="border-t pt-8 space-y-4">
                     {lines.map((line, idx) => (
                        <div key={line.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-6 relative group">
                           <button onClick={() => removeLine(line.id)} className="absolute top-4 left-4 p-2 text-rose-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all"><X size={16} /></button>

                           {/* Row 1: Amount & Desc */}
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="md:col-span-2 space-y-1">
                                 <label className="text-[9px] font-black text-slate-400 px-2">الوصف</label>
                                 <input value={line.description} onChange={e => handleLineChange(line.id, 'description', e.target.value)} className="w-full p-3 bg-white rounded-xl font-bold text-xs border-transparent focus:border-indigo-500 border-2 outline-none" placeholder="وصف العملية..." />
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[9px] font-black text-slate-400 px-2">المبلغ (شامل الضريبة)</label>
                                 <input type="number" value={line.amount} onChange={e => handleLineChange(line.id, 'amount', e.target.value)} className="w-full p-3 bg-white rounded-xl font-black text-lg text-center outline-none" />
                              </div>
                           </div>

                           {/* Row 2: Classification (Category & Entity) */}
                           <div className="grid grid-cols-1 gap-4">
                              <div className="space-y-2">
                                 <div className="flex justify-between items-center px-2">
                                    <label className="text-[9px] font-black text-slate-400">جهة المصروف / التوجيه المحاسبي</label>
                                    <div className="flex gap-1">
                                       {[
                                          { id: 'general', label: 'عام' },
                                          { id: 'student', label: 'طالب' },
                                          { id: 'employee', label: 'موظف' },
                                          { id: 'supplier', label: 'مورد' },
                                       ].map(t => (
                                          <button
                                             key={t.id}
                                             onClick={() => handleEntityTypeChange(line.id, t.id)}
                                             className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${line.entityType === t.id ? 'bg-indigo-600 text-white shadow' : 'bg-slate-200 text-slate-500'}`}
                                          >
                                             {t.label}
                                          </button>
                                       ))}
                                    </div>
                                 </div>

                                 <div className="flex gap-2">
                                    {/* Category Search */}
                                    <div className="flex-1">
                                       <input
                                          list={`cat-list-${line.id}`}
                                          value={line.categorySearch}
                                          onChange={e => handleCategorySelect(line.id, e.target.value)}
                                          className="w-full p-3 bg-white rounded-xl font-bold text-xs border border-transparent focus:border-indigo-500"
                                          placeholder="ابحث عن الحساب (كهرباء، صيانة...)"
                                       />
                                       <datalist id={`cat-list-${line.id}`}>
                                          {filteredCategories.map(c => <option key={c.id} value={c.name}>{c.code}</option>)}
                                       </datalist>
                                    </div>

                                    {/* Sub Target Entity Search - SHOWN CONDITIONALLY */}
                                    {line.entityType !== 'general' && (
                                       <div className="flex-1 animate-view">
                                          <input
                                             list={`sub-target-${line.id}`}
                                             placeholder={`ابحث عن اسم ال${line.entityType === 'student' ? 'طالب' : (line.entityType === 'employee' ? 'موظف' : 'مورد')}...`}
                                             className="w-full p-3 bg-indigo-50 text-indigo-900 rounded-xl font-bold text-xs border border-indigo-200 focus:border-indigo-500"
                                             onChange={(e) => {
                                                const val = e.target.value;
                                                const opts = getSubTargetOptions(line.entityType);
                                                const found = opts.find((o: any) => (o.firstName || o.name || '').includes(val));
                                                handleLineChange(line.id, 'subTargetSearch', val);
                                                if (found) handleLineChange(line.id, 'subTargetId', found.id);
                                             }}
                                          />
                                          <datalist id={`sub-target-${line.id}`}>
                                             {getSubTargetOptions(line.entityType).map((op: any) => (
                                                <option key={op.id} value={op.firstName || op.name}>{op.name || op.firstName} ({op.role})</option>
                                             ))}
                                          </datalist>
                                       </div>
                                    )}
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                     <button onClick={addLine} className="w-full py-3 bg-slate-100 text-slate-400 rounded-2xl font-black text-xs hover:bg-slate-200 transition-all">+ إضافة بند آخر</button>
                  </div>

                  <button
                     onClick={handleSaveVoucher}
                     disabled={isProcessing}
                     className="w-full py-6 bg-slate-950 text-white rounded-[2.5rem] font-black text-xl shadow-2xl hover:bg-indigo-600 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                     {isProcessing ? 'جاري المعالجة...' : <><Save size={24} /> حفظ وترحيل السند</>}
                  </button>
               </div>
            </div>
         )}

         {viewMode === 'receipt' && (
            <div className="p-8 text-center text-slate-500 font-bold">نموذج الطباعة جاهز</div>
         )}

         {/* Fund Management (Boxes) */}
         {viewMode === 'boxes' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-view">
               <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black">إدارة الصناديق والمحافظ</h3>
                  <button onClick={() => setShowAddFund(!showAddFund)} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-xs flex items-center gap-2">
                     {showAddFund ? <X size={16} /> : <Plus size={16} />}
                     {showAddFund ? 'إلغاء' : 'إضافة صندوق'}
                  </button>
               </div>

               {showAddFund && (
                  <div className="p-8 bg-slate-50 rounded-[2.5rem] space-y-4 border border-slate-200">
                     <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 px-2 uppercase">اسم الخزينة</label>
                        <input value={newFund.name} onChange={e => setNewFund({ ...newFund, name: e.target.value })} className="w-full p-4 bg-white rounded-xl font-bold" placeholder="مثال: الخزينة الرئيسية" />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className="text-[10px] font-black text-slate-400 px-2 uppercase">الكود المحاسبي</label>
                           <input value={newFund.accountCode} onChange={e => setNewFund({ ...newFund, accountCode: e.target.value })} className="w-full p-4 bg-white rounded-xl font-mono text-xs" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] font-black text-slate-400 px-2 uppercase">الرصيد الافتتاحي</label>
                           <input type="number" value={newFund.balance} onChange={e => setNewFund({ ...newFund, balance: parseFloat(e.target.value) })} className="w-full p-4 bg-white rounded-xl font-bold tabular-nums" />
                        </div>
                     </div>
                     <button onClick={handleAddFund} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold">حفظ الخزينة</button>
                  </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {funds.map(f => (
                     <div key={f.id} className="glass-panel p-6 bg-white rounded-[2rem] border shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><Wallet size={24} /></div>
                           <div>
                              <p className="font-black text-slate-900">{f.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono">CODE: {f.accountCode}</p>
                           </div>
                        </div>
                        <p className="text-xl font-black text-slate-900 tabular-nums">{f.balance.toLocaleString()} {financialSettings.currency}</p>
                     </div>
                  ))}
               </div>
            </div>
         )}

         {/* Report Views */}
         {viewMode === 'reports' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-view">
               <div className="glass-panel p-8 bg-white rounded-[2.5rem] border shadow-sm space-y-6">
                  <h3 className="text-xl font-black flex items-center gap-2"><BarChart3 size={20} /> ملخص الدخل</h3>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-2xl">
                        <span className="font-bold text-emerald-700">إجمالي الإيرادات</span>
                        <span className="font-black text-xl text-emerald-800">{financialEntries.filter(e => e.debitAccount === '11101').reduce((a, b) => a + b.amount, 0).toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between items-center p-4 bg-rose-50 rounded-2xl">
                        <span className="font-bold text-rose-700">إجمالي المصروفات</span>
                        <span className="font-black text-xl text-rose-800">{financialEntries.filter(e => e.creditAccount === '11101').reduce((a, b) => a + b.amount, 0).toLocaleString()}</span>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* Z-Report View */}
         {viewMode === 'z-report' && (
            <div className="max-w-2xl mx-auto glass-panel p-10 bg-white rounded-[3rem] border shadow-lg space-y-8 animate-view border-t-8 border-indigo-600">
               <div className="text-center">
                  <h2 className="text-3xl font-black mb-2">إغلاق الوردية (Z-Report)</h2>
                  <p className="text-slate-500 font-bold">تسوية العهدة النقدية وإغلاق الحسابات اليومية</p>
               </div>

               <div className="space-y-6">
                  <div className="space-y-1">
                     <label className="text-[10px] font-black text-slate-400 px-2 uppercase">اختر الخزينة (التي سيتم جردها)</label>
                     <select onChange={e => setZReportData({ ...zReportData, selectedFund: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none">
                        <option value="">-- اختر الخزينة للإغلاق --</option>
                        {funds.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                     </select>
                  </div>

                  <div className="space-y-1">
                     <label className="text-[10px] font-black text-slate-400 px-2 uppercase">الرصيد الفعلي (جرد الدرج)</label>
                     <input type="number" onChange={e => setZReportData({ ...zReportData, actualCash: parseFloat(e.target.value) })} className="w-full p-5 bg-indigo-50 rounded-2xl font-black text-3xl tabular-nums text-center text-indigo-900 outline-none" placeholder="0.00" />
                  </div>

                  <button onClick={handleZReport} className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3">
                     <Lock size={20} /> إغلاق الوردية وطباعة التقرير
                  </button>
               </div>
            </div>
         )}
      </div>
   );
};

export default FinanceModule;
