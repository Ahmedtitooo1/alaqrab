
import * as React from 'react';
import { useState, useMemo } from 'react';
import {
   Coins, Search, Printer, CheckCircle, RefreshCw, CreditCard,
   X, Landmark, Wallet, AlertCircle, Users, Check, Calendar, FileText
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { UserRole, FinancialEntry, Liability } from '../types';

const PayrollModule: React.FC = () => {
   const { lang, allUsers, addFinancialEntry, addNotification, systemName, systemLogo, funds } = useAppContext();
   const [activeSubTab, setActiveSubTab] = useState<'payroll' | 'liabilities'>('payroll');
   const [selectedEmps, setSelectedEmps] = useState<Set<string>>(new Set());
   const [selectedLiabilities, setSelectedLiabilities] = useState<Set<string>>(new Set());
   const [showPayModal, setShowPayModal] = useState(false);
   const [payFund, setPayFund] = useState('11101');
   const [payrollMonth, setPayrollMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

   // Mock data for Liabilities
   const [liabilities, setLiabilities] = useState<Liability[]>([
      { id: 'l1', title: 'إيجار المقر الرئيسي', category: 'مصاريف إدارية', amount: 45000, dueDate: '2024-05-01', status: 'pending' },
      { id: 'l2', title: 'فاتورة الكهرباء والماء', category: 'خدمات تشغيلية', amount: 3200, dueDate: '2024-04-25', status: 'pending' },
      { id: 'l3', title: 'صيانة كاشفات البصمة', category: 'صيانة تقنية', amount: 1500, dueDate: '2024-05-05', status: 'pending' },
   ]);

   const employees = useMemo(() => allUsers.filter(u =>
      [UserRole.TEACHER, UserRole.ACCOUNTANT, UserRole.ADMIN].includes(u.role)
   ), [allUsers]);

   const toggleSelect = (id: string, type: 'payroll' | 'liability') => {
      if (type === 'payroll') {
         const newSet = new Set(selectedEmps);
         if (newSet.has(id)) newSet.delete(id);
         else newSet.add(id);
         setSelectedEmps(newSet);
      } else {
         const newSet = new Set(selectedLiabilities);
         if (newSet.has(id)) newSet.delete(id);
         else newSet.add(id);
         setSelectedLiabilities(newSet);
      }
   };

   const handleBulkPay = () => {
      let totalAmount = 0;
      let description = '';

      if (activeSubTab === 'payroll') {
         employees.forEach(emp => {
            if (selectedEmps.has(emp.id)) totalAmount += (emp.salary || 3000);
         });
         description = `صرف مسيرات رواتب مجمعة لشهر ${payrollMonth}`;
      } else {
         liabilities.forEach(l => {
            if (selectedLiabilities.has(l.id)) totalAmount += l.amount;
         });
         description = `سداد التزامات مالية مجمعة - ${new Date().toLocaleDateString('ar-EG')}`;
         setLiabilities(liabilities.map(l => selectedLiabilities.has(l.id) ? { ...l, status: 'paid' } : l));
      }

      const entry: FinancialEntry = {
         id: `${activeSubTab === 'payroll' ? 'PAY' : 'LIAB'}-${Date.now().toString().slice(-4)}`,
         date: new Date().toISOString().split('T')[0],
         description,
         amount: totalAmount,
         debitAccount: activeSubTab === 'payroll' ? '5201' : '52', // كود حساب الرواتب أو المصروفات
         creditAccount: payFund,
         refType: activeSubTab === 'payroll' ? 'payroll' : 'manual'
      };

      addFinancialEntry(entry);
      addNotification({ title: 'تمت عملية الصرف', content: `تم ترحيل قيد صرف بقيمة ${totalAmount.toLocaleString()} ج.م`, type: 'success', date: entry.date });
      setSelectedEmps(new Set());
      setSelectedLiabilities(new Set());
      setShowPayModal(false);
   };

   return (
      <div className="space-y-10 animate-view pb-24 text-right">
         {/* نسخة الطباعة الاحترافية للمسيرات والالتزامات */}
         <div className="hidden print:block bg-white p-4 min-h-screen text-right font-serif" dir="rtl">
            <div className="border-[10px] border-double border-indigo-950 p-12 relative min-h-[1000px] flex flex-col rounded-[3rem]">
               {/* Background Watermark */}
               <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                  <img src={systemLogo} className="w-[500px] h-[500px] object-contain grayscale" />
               </div>

               {/* Header Section */}
               <div className="flex justify-between items-start border-b-[4px] border-indigo-950 pb-10 mb-12 relative z-10">
                  <div className="space-y-4">
                     <h2 className="text-4xl font-black text-indigo-950">{systemName}</h2>
                     <div className="h-2 w-24 bg-indigo-950"></div>
                     <p className="font-bold text-xl">قسم شؤون العاملين والمحاسبة</p>
                     <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Human Resources & Payroll Office</p>
                  </div>

                  <div className="text-center">
                     <img src={systemLogo} className="h-28 w-28 mx-auto mb-6 p-4 bg-white shadow-2xl rounded-[2rem] border-2 border-slate-50 relative z-20" />
                     <h1 className="text-4xl font-black underline decoration-double underline-offset-8 text-slate-900 leading-tight">
                        {activeSubTab === 'payroll' ? 'مسير رواتب الكادر الوظيفي' : 'بيان سداد الالتزامات المالية'}
                     </h1>
                     <p className="text-[10px] mt-6 font-black uppercase text-indigo-600 tracking-[0.4em]">Official Financial Disclosure</p>
                  </div>

                  <div className="text-left rtl:text-right font-black text-sm space-y-3">
                     <div className="p-6 bg-slate-50 rounded-2xl border-2 border-indigo-50 shadow-sm inline-block min-w-[220px]">
                        <p className="text-indigo-600 mb-2 border-b border-indigo-100 pb-1 text-xs uppercase tracking-widest">Document Meta</p>
                        <p>الفترة الضريبية: <span className="font-mono text-lg">{payrollMonth}</span></p>
                        <p>تاريخ البيان: <span className="font-mono">{new Date().toLocaleDateString('ar-EG')}</span></p>
                        <p className="text-xs text-slate-400 mt-2">عن طريق: {allUsers.find(u => u.role === UserRole.ACCOUNTANT)?.firstName || 'الإدارة المالية'}</p>
                     </div>
                  </div>
               </div>

               {/* Summary Stats in Print */}
               <div className="grid grid-cols-2 gap-8 mb-12 relative z-10">
                  <div className="p-8 bg-indigo-950 text-white rounded-[2.5rem] shadow-2xl flex items-center justify-between">
                     <div>
                        <p className="text-[10px] font-black text-indigo-300 mb-2 uppercase tracking-widest">إجمالي المبلغ المستحق</p>
                        <p className="text-5xl font-black tabular-nums">
                           {(activeSubTab === 'payroll'
                              ? employees.reduce((acc, emp) => acc + (emp.salary || 3000), 0)
                              : liabilities.reduce((acc, l) => acc + l.amount, 0)
                           ).toLocaleString()} <span className="text-xl font-normal opacity-60">ج.م</span>
                        </p>
                     </div>
                     <div className="h-16 w-1px bg-white/20"></div>
                     <div className="text-left">
                        <p className="text-[10px] font-black text-indigo-300 mb-2 uppercase tracking-widest text-center">عدد البنود</p>
                        <p className="text-4xl font-black text-center">{activeSubTab === 'payroll' ? employees.length : liabilities.length}</p>
                     </div>
                  </div>
                  <div className="p-8 bg-slate-50 border-2 border-indigo-50 rounded-[2.5rem] flex flex-col justify-center">
                     <p className="text-xl font-black text-slate-900 mb-2">جهة السداد المعتمدة:</p>
                     <p className="text-3xl font-black text-indigo-900 underline underline-offset-4">{funds.find(f => f.accountCode === payFund)?.name || 'الخزينة الرئيسية'}</p>
                  </div>
               </div>

               {/* Table Content */}
               <div className="flex-1 relative z-10">
                  <table className="w-full border-collapse border-2 border-indigo-950 shadow-sm rounded-3xl overflow-hidden">
                     <thead className="bg-indigo-950 text-white">
                        <tr>
                           <th className="p-6 border border-indigo-900 font-black text-center w-12">#</th>
                           <th className="p-6 border border-indigo-900 font-black text-right">البيان / المستفيد</th>
                           <th className="p-6 border border-indigo-900 font-black text-center w-40">المبلغ المستحق</th>
                           <th className="p-6 border border-indigo-900 font-black text-center w-64">توقيع المستلم / الاعتماد</th>
                        </tr>
                     </thead>
                     <tbody className="bg-white">
                        {activeSubTab === 'payroll' ? employees.map((emp, i) => (
                           <tr key={emp.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                              <td className="p-6 border border-slate-200 text-center font-bold text-slate-400">{i + 1}</td>
                              <td className="p-6 border border-slate-200">
                                 <p className="font-black text-xl text-slate-900">{emp.firstName} {emp.lastName}</p>
                                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{emp.jobTitle} • {emp.code}</p>
                              </td>
                              <td className="p-6 border border-slate-200 text-center font-black text-2xl tabular-nums text-indigo-700">{(emp.salary || 3000).toLocaleString()}</td>
                              <td className="p-6 border border-slate-200"></td>
                           </tr>
                        )) : liabilities.map((l, i) => (
                           <tr key={l.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                              <td className="p-6 border border-slate-200 text-center font-bold text-slate-400">{i + 1}</td>
                              <td className="p-6 border border-slate-200">
                                 <p className="font-black text-xl text-slate-900">{l.title}</p>
                                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{l.category}</p>
                              </td>
                              <td className="p-6 border border-slate-200 text-center font-black text-2xl tabular-nums text-indigo-700">{l.amount.toLocaleString()}</td>
                              <td className="p-6 border border-slate-200"></td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               {/* Footer Signatures */}
               <div className="mt-24 grid grid-cols-3 gap-16 text-center relative z-10">
                  <div className="space-y-12">
                     <p className="font-black text-xl text-slate-900 border-b-4 border-indigo-950 pb-2 inline-block px-10">المراجعة والتدقيق</p>
                     <div className="text-sm text-slate-400 font-bold italic">ختم وتوقيع المحاسب</div>
                  </div>
                  <div className="flex flex-col items-center justify-center -mt-10">
                     <div className="relative w-40 h-40 border-[6px] border-double border-indigo-950/20 rounded-full flex flex-center items-center justify-center p-4">
                        <div className="text-[10px] font-black text-indigo-950/20 uppercase text-center leading-tight tracking-[0.2em]">
                           APPROVED DOCUMENT<br />HR DEPARTMENT<br />{new Date().getFullYear()}
                        </div>
                        <img src={systemLogo} className="absolute inset-0 m-auto w-24 h-24 opacity-5 grayscale rotate-12" />
                     </div>
                  </div>
                  <div className="space-y-12">
                     <p className="font-black text-xl text-slate-900 border-b-4 border-indigo-950 pb-2 inline-block px-10">اعتماد الإدارة</p>
                     <div className="text-sm text-slate-400 font-bold italic">توقيع مدير الفرع / المفوض</div>
                  </div>
               </div>

               {/* Legal Copyright Footer */}
               <div className="mt-20 pt-10 border-t-2 border-slate-100 flex justify-between items-center opacity-30 select-none">
                  <p className="text-[10px] font-black">Generated via SCORPION CORE V10.4 Financial Engine • {new Date().toLocaleTimeString('ar-EG')}</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em]">{systemName}</p>
               </div>
            </div>
         </div>

         <div className="flex flex-col md:flex-row justify-between items-center bg-white p-10 rounded-[3rem] border shadow-sm no-print gap-6">
            <div className="flex items-center gap-8">
               <div className="p-6 bg-indigo-50 text-indigo-600 rounded-[2.5rem] shadow-inner"><Coins size={40} /></div>
               <div><h2 className="text-3xl font-black">الرواتب والالتزامات المالية</h2><p className="text-slate-500 font-bold">صرف المستحقات، سداد الموردين، ومراقبة الالتزامات الشهرية.</p></div>
            </div>
            <div className="flex gap-4">
               <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                  <button onClick={() => setActiveSubTab('payroll')} className={`px-8 py-3 rounded-xl font-black text-xs transition-all ${activeSubTab === 'payroll' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-200'}`}>مسيرات الرواتب</button>
                  <button onClick={() => setActiveSubTab('liabilities')} className={`px-8 py-3 rounded-xl font-black text-xs transition-all ${activeSubTab === 'liabilities' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-200'}`}>الالتزامات التشغيلية</button>
               </div>
               {activeSubTab === 'payroll' && <input type="month" value={payrollMonth} onChange={e => setPayrollMonth(e.target.value)} className="p-4 bg-slate-50 border rounded-2xl font-black outline-none focus:border-indigo-600 transition-all" />}
               <button onClick={() => window.print()} className="p-5 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 shadow-sm transition-all"><Printer size={24} /></button>
               {(selectedEmps.size > 0 || selectedLiabilities.size > 0) && <button onClick={() => setShowPayModal(true)} className="px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black flex items-center gap-3 shadow-xl animate-view"><CreditCard size={20} /> سداد مجمع ({activeSubTab === 'payroll' ? selectedEmps.size : selectedLiabilities.size})</button>}
            </div>
         </div>

         {activeSubTab === 'payroll' ? (
            <div className="glass-panel bg-white overflow-hidden rounded-[3rem] shadow-sm no-print">
               <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-right min-w-[1000px]">
                     <thead><tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 border-b"><th className="p-8 text-center">اختيار</th><th className="p-8 text-right">الموظف / المعلم</th><th className="p-8">المسمى الوظيفي</th><th className="p-8">الراتب الأساسي</th><th className="p-8">البدلات (+)</th><th className="p-8 text-rose-600">الاستقطاع (-)</th><th className="p-8 font-black text-black text-center">الصافي</th><th className="p-8 text-center">الإجراء</th></tr></thead>
                     <tbody className="divide-y font-bold text-sm">
                        {employees.map(emp => {
                           const net = (emp.salary || 3000) + (emp.allowances || 0) - (emp.deductions || 0);
                           return (
                              <tr key={emp.id} className={`${selectedEmps.has(emp.id) ? 'bg-indigo-50/50' : 'hover:bg-slate-50/50'}`}>
                                 <td className="p-8 text-center"><button onClick={() => toggleSelect(emp.id, 'payroll')} className={`w-8 h-8 rounded-xl border-2 transition-all flex items-center justify-center mx-auto ${selectedEmps.has(emp.id) ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'border-slate-200'}`}>{selectedEmps.has(emp.id) && <Check size={16} />}</button></td>
                                 <td className="p-8 flex items-center gap-4 justify-end"><div className="flex flex-col"><span className="text-slate-900 font-black">{emp.firstName} {emp.lastName}</span><span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">ID: {emp.code}</span></div><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.username}`} className="w-10 h-10 rounded-xl bg-slate-100 shadow-inner" /></td>
                                 <td className="p-8 text-slate-500">{emp.jobTitle || 'عضو كادر'}</td>
                                 <td className="p-8 tabular-nums font-mono">{(emp.salary || 3000).toLocaleString()}</td>
                                 <td className="p-8 text-emerald-600 tabular-nums font-mono">{(emp.allowances || 0).toLocaleString()}</td>
                                 <td className="p-8 text-rose-600 tabular-nums font-mono">{(emp.deductions || 0).toLocaleString()}</td>
                                 <td className="p-8 text-center font-black text-slate-900 text-lg tabular-nums">{net.toLocaleString()}</td>
                                 <td className="p-8 text-center"><button onClick={() => { setSelectedEmps(new Set([emp.id])); setShowPayModal(true); }} className="px-6 py-2 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase shadow-sm">صرف الآن</button></td>
                              </tr>
                           );
                        })}
                     </tbody>
                  </table>
               </div>
            </div>
         ) : (
            <div className="glass-panel bg-white overflow-hidden rounded-[3rem] shadow-sm no-print animate-view">
               <table className="w-full text-right">
                  <thead><tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 border-b"><th className="p-8 text-center">اختيار</th><th className="p-8">وصف الالتزام</th><th className="p-8 text-center">التصنيف</th><th className="p-8 text-center">تاريخ الاستحقاق</th><th className="p-8 text-center">المبلغ المستحق</th><th className="p-8 text-center">الحالة</th></tr></thead>
                  <tbody className="divide-y font-bold text-sm">
                     {liabilities.map(l => (
                        <tr key={l.id} className={`${selectedLiabilities.has(l.id) ? 'bg-indigo-50/50' : 'hover:bg-slate-50/50'}`}>
                           <td className="p-8 text-center"><button onClick={() => toggleSelect(l.id, 'liability')} className={`w-8 h-8 rounded-xl border-2 transition-all flex items-center justify-center mx-auto ${selectedLiabilities.has(l.id) ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'border-slate-200'}`}>{selectedLiabilities.has(l.id) && <Check size={16} />}</button></td>
                           <td className="p-8 font-black text-slate-900">{l.title}</td>
                           <td className="p-8 text-center"><span className="px-4 py-1.5 bg-slate-50 rounded-xl text-[10px] text-slate-500">{l.category}</span></td>
                           <td className="p-8 text-center text-slate-400 font-mono text-xs">{l.dueDate}</td>
                           <td className="p-8 text-center font-black text-rose-600 text-lg tabular-nums">{l.amount.toLocaleString()} ج.م</td>
                           <td className="p-8 text-center"><span className={`px-4 py-1.5 rounded-full text-[10px] font-black ${l.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{l.status === 'paid' ? 'تم السداد' : 'بانتظار السداد'}</span></td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}

         {showPayModal && (
            <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6 no-print" onClick={() => setShowPayModal(false)}>
               <div className="glass-panel w-full max-w-lg bg-white p-12 rounded-[3.5rem] shadow-3xl space-y-10 border-t-[12px] border-emerald-600" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-center border-b pb-6"><h3 className="text-2xl font-black">تأكيد عملية السداد المجمع</h3><button onClick={() => setShowPayModal(false)}><X size={32} /></button></div>
                  <div className="space-y-8">
                     <div className="p-8 bg-emerald-50 rounded-[2.5rem] border-2 border-dashed border-emerald-200 text-center relative overflow-hidden">
                        <p className="text-sm font-black text-emerald-900">إجمالي المبلغ المراد سداده</p>
                        <p className="text-5xl font-black mt-2 tabular-nums text-emerald-700">
                           {(activeSubTab === 'payroll'
                              ? employees.reduce((acc, emp) => selectedEmps.has(emp.id) ? acc + (emp.salary || 3000) : acc, 0)
                              : liabilities.reduce((acc, l) => selectedLiabilities.has(l.id) ? acc + l.amount : acc, 0)
                           ).toLocaleString()} <span className="text-xl">ج.م</span>
                        </p>
                     </div>
                     <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">جهة السداد (الصندوق المالي)</label>
                        <select value={payFund} onChange={e => setPayFund(e.target.value)} className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-3xl font-black outline-none transition-all shadow-inner">
                           {funds.map(f => <option key={f.id} value={f.accountCode}>{f.name} ({f.accountCode})</option>)}
                        </select>
                     </div>
                     <button onClick={handleBulkPay} className="w-full py-6 bg-emerald-600 text-white rounded-[2.5rem] font-black text-xl shadow-2xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-4 active:scale-95"><CheckCircle size={32} /> تأكيد ترحيل القيود المالية</button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default PayrollModule;
