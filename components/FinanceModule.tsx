
import React, { useState, useMemo } from 'react';
import {
   Save, Plus, List, Trash2, ArrowDownCircle, ArrowUpCircle,
   Search, CheckCircle, Printer, X, BookOpen, ChevronLeft,
   History, PlusCircle, Edit3, FileSpreadsheet,
   Wallet, Coins, Boxes, Truck, GraduationCap, Briefcase, ClipboardList,
   Building, QrCode, Lock
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

   const handleCategorySelect = (lineId: string, categoryName: string) => {
      setLines(prev => prev.map(line => {
         if (line.id !== lineId) return line;
         const match = filteredCategories.find(c => c.name === categoryName || c.code === categoryName);
         if (!match) return { ...line, categorySearch: categoryName, category: '', entityType: 'general', subTargetId: '', subTargetSearch: '', isSearchOpen: false };

         let newEntityType = 'general';
         let isSearchOpen = false;
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
         return {
            ...line, categorySearch: categoryName, category: match.code, entityType: newEntityType, isSearchOpen: isSearchOpen, subTargetId: '', subTargetSearch: ''
         };
      }));
   };

   const handleAiClassification = async (lineId: string, desc: string) => {
      if (!desc || desc.length < 5) return;
      setIsAiClassifying(true);
      const result = await classifyFinancialTransaction(desc, voucherType);
      if (result && result.suggestedAccountCode) {
         const exists = financialCategories.find(c => c.code.startsWith(result.suggestedAccountCode) || result.suggestedAccountCode.startsWith(c.code));
         if (exists) {
            handleLineChange(lineId, 'category', exists.code);
            addNotification({ title: 'AI Classifier', content: `suggested: ${exists.name}`, type: 'info', date: new Date().toISOString() });
         }
      }
      setIsAiClassifying(false);
   };

   // --- MAIN ACTIONS ---

   const handleSaveVoucher = () => {
      const total = lines.reduce((sum, l) => sum + parseFloat(l.amount || 0), 0);
      if (total <= 0) return alert("لا يمكن ترحيل سند بمبلغ صفر");

      setIsProcessing(true); // Disable button immediately

      // Simulate Async Save for Robustness
      setTimeout(() => {
         if (editingEntryId) deleteFinancialEntry(editingEntryId);

         lines.forEach(line => {
            const amount = parseFloat(line.amount);
            let taxVal = 0;
            let netVal = amount;

            // Tax Logic
            if (financialSettings.taxRate > 0) {
               if (financialSettings.isTaxInclusive) {
                  // Amount = Net * (1 + Rate) -> Net = Amount / (1 + Rate)
                  netVal = amount / (1 + (financialSettings.taxRate / 100));
                  taxVal = amount - netVal;
               } else {
                  // Exclusive: Amount entered is Base? Or Amount entered is Total?
                  // Assumption: User always enters the FINAL Total they see on the invoice/receipt.
                  // So we still back-calculate Tax from Total.
                  netVal = amount / (1 + (financialSettings.taxRate / 100));
                  taxVal = amount - netVal;
               }
            }

            // Create Entry
            const entry: FinancialEntry = {
               id: header.entryNo + (lines.length > 1 ? '-' + line.id : ''),
               date: header.date,
               description: `${line.description || header.description}${line.subTargetId ? ' - Ent: ' + (allUsers.find(u => u.id === line.subTargetId)?.firstName || '') : ''}`,
               amount: amount, // TOTAL Amount
               taxAmount: parseFloat(taxVal.toFixed(2)),
               netAmount: parseFloat(netVal.toFixed(2)),
               debitAccount: voucherType === 'spending' ? line.category : header.fundAccount,
               creditAccount: voucherType === 'spending' ? header.fundAccount : line.category,
               institutionId: user?.institutionId || '',
               targetId: line.subTargetId,
               refType: 'invoice', // Marking as invoice for printing purposes
               currency: header.currency,
               exchangeRate: header.exchangeRate,
               status: 'draft', // Default to Draft
               invoiceNumber: `INV-${Date.now()}` // Generate Invoice Number
            };
            addFinancialEntry(entry);
         });

         addNotification({ title: 'Success', content: 'Entry Saved Successfully', type: 'success', date: new Date().toISOString() });

         // Reset Form
         setViewMode('list');
         setEditingEntryId(null);
         setHeader({ ...header, entryNo: 'VCH-' + Date.now().toString().slice(-6), description: '', totalAmount: 0 });
         setLines([{ id: '1', description: '', amount: 0, category: '', subTargetId: '', subTargetSearch: '', isSearchOpen: false, entityType: 'general' }]);
         setIsProcessing(false);
      }, 800);
   };

   const handlePrintInvoice = (entry: FinancialEntry) => {
      const debitName = financialCategories.find(c => c.code === entry.debitAccount)?.name;
      const creditName = financialCategories.find(c => c.code === entry.creditAccount)?.name;

      const html = `
            <div style="max-width: 800px; margin: 0 auto; padding: 40px; font-family: 'Cairo', sans-serif; direction: rtl;">
                
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid #000; padding-bottom: 20px;">
                    <div>
                        <h1 style="font-size: 24px; font-weight: 900; margin: 0;">${financialSettings.companyName}</h1>
                        <p style="margin: 5px 0;">Tax ID: ${financialSettings.taxId}</p>
                        <p style="margin: 5px 0;">Cairo, Egypt</p>
                    </div>
                    <div style="text-align: left;">
                        <h2 style="font-size: 32px; font-weight: 900; margin: 0; text-transform: uppercase;">Tax Invoice</h2>
                        <p style="font-size: 14px; font-weight: bold;"># ${entry.invoiceNumber || entry.id}</p>
                        <p style="font-size: 14px;">Date: ${entry.date}</p>
                    </div>
                </div>

                <!-- Bill To -->
                <div style="margin-bottom: 40px; padding: 20px; background: #f8fafc; border-radius: 12px;">
                    <h3 style="margin-top: 0; font-size: 12px; text-transform: uppercase; color: #64748b;">Invoice To</h3>
                    <p style="font-weight: 900; font-size: 18px; margin: 5px 0;">${entry.targetId ? allUsers.find(u => u.id === entry.targetId)?.firstName || 'General Client' : 'General Client'}</p>
                    <p style="margin: 0; color: #64748b;">${debitName || 'Client Account'}</p>
                </div>

                <!-- Table -->
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
                    <thead>
                        <tr style="background: #0f172a; color: white;">
                            <th style="padding: 15px; text-align: right;">Description</th>
                            <th style="padding: 15px; text-align: center;">Net Amount</th>
                            <th style="padding: 15px; text-align: center;">Tax (${financialSettings.taxRate}%)</th>
                            <th style="padding: 15px; text-align: center;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 15px; border-bottom: 1px solid #e2e8f0;">${entry.description}</td>
                            <td style="padding: 15px; text-align: center; border-bottom: 1px solid #e2e8f0;">${(entry.netAmount || entry.amount).toLocaleString()}</td>
                            <td style="padding: 15px; text-align: center; border-bottom: 1px solid #e2e8f0;">${(entry.taxAmount || 0).toLocaleString()}</td>
                            <td style="padding: 15px; text-align: center; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${entry.amount.toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>

                <!-- Totals -->
                <div style="display: flex; justify-content: flex-end;">
                    <div style="width: 300px;">
                        <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                            <span>Subtotal:</span>
                            <span>${(entry.netAmount || entry.amount).toLocaleString()}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                            <span>VAT (${financialSettings.taxRate}%):</span>
                            <span>${(entry.taxAmount || 0).toLocaleString()}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 15px 0; font-size: 20px; font-weight: 900; color: #0f172a;">
                            <span>Grand Total:</span>
                            <span>${entry.amount.toLocaleString()} ${entry.currency || 'EGP'}</span>
                        </div>
                    </div>
                </div>

                <!-- QR Code & Footer -->
                <div style="margin-top: 60px; display: flex; justify-content: space-between; align-items: flex-end;">
                    <div style="text-align: center;">
                        <div style="width: 100px; height: 100px; background: #e2e8f0; display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                            <span style="font-size: 10px;">QR Placeholder</span>
                        </div>
                        <p style="font-size: 10px; color: #64748b;">Scan for E-Invoice</p>
                    </div>
                    <div style="text-align: left; font-size: 12px; color: #64748b;">
                        <p>Thank you for your business.</p>
                        <p>${systemName}</p>
                    </div>
                </div>
            </div>
        `;

      openProfessionalPrintWindow(html, {
         title: `Tax Invoice - ${entry.invoiceNumber}`,
         pageSize: 'A4',
         orientation: 'portrait',
         logo: systemLogo,
         systemName: systemName
      });
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
                        <div key={line.id} className="p-4 bg-slate-50 rounded-3xl border border-slate-100 space-y-4 relative group">
                           <button onClick={() => removeLine(line.id)} className="absolute top-4 left-4 p-2 text-rose-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all"><X size={16} /></button>
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
                           <div className="space-y-1">
                              <label className="text-[9px] font-black text-slate-400 px-2">نوع الحساب</label>
                              <input
                                 list={`cat-list-${line.id}`}
                                 value={line.categorySearch}
                                 onChange={e => handleCategorySelect(line.id, e.target.value)}
                                 className="w-full p-3 bg-white rounded-xl font-bold text-xs"
                                 placeholder="بحث في الحسابات..."
                              />
                              <datalist id={`cat-list-${line.id}`}>
                                 {filteredCategories.map(c => <option key={c.id} value={c.name}>{c.code}</option>)}
                              </datalist>
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

         {/* Report Views (Placeholder) */}
         {viewMode === 'reports' && <div className="p-20 text-center font-black text-slate-300">التقارير المالية</div>}
         {viewMode === 'z-report' && <div className="p-20 text-center font-black text-slate-300">نظام إغلاق الوردية</div>}
      </div>
   );
};

export default FinanceModule;
