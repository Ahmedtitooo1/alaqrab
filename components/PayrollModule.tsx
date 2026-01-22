
import * as React from 'react';
import { useState, useMemo } from 'react';
import {
   Coins, Search, Printer, CheckCircle, RefreshCw, CreditCard,
   X, Landmark, Wallet, AlertCircle, Users, Check, Calendar, FileText
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { UserRole, FinancialEntry } from '../types';

const PayrollModule: React.FC = () => {
   const { lang, allUsers, addFinancialEntry, addNotification, systemName, systemLogo, funds, financialEntries, user } = useAppContext();
   const [selectedEmps, setSelectedEmps] = useState<Set<string>>(new Set());
   const [showPayModal, setShowPayModal] = useState(false);
   const [payFund, setPayFund] = useState('11101');
   const [payrollMonth, setPayrollMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

   const employees = useMemo(() => allUsers.filter(u =>
      [UserRole.TEACHER, UserRole.ACCOUNTANT, UserRole.ADMIN].includes(u.role)
   ), [allUsers]);

   // Check if salary is paid for an employee in the selected month
   const isSalaryPaid = (empId: string, month: string) => {
      return financialEntries.some(entry =>
         entry.refType === 'payroll' &&
         entry.description.includes(`[${empId}]`) && // We will store ID in description for tracking
         entry.description.includes(month)
      );
   };

   const toggleSelect = (id: string) => {
      if (isSalaryPaid(id, payrollMonth)) return; // Prevent selection if already paid
      const newSet = new Set(selectedEmps);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      setSelectedEmps(newSet);
   };

   const handleBulkPay = () => {
      let paidCount = 0;

      employees.forEach(emp => {
         if (selectedEmps.has(emp.id)) {
            const amount = (emp.salary || 3000) + (emp.allowances || 0) - (emp.deductions || 0);
            const entry: FinancialEntry = {
               id: `PAY-${Date.now()}-${emp.id}`,
               date: new Date().toISOString().split('T')[0],
               description: `صرف راتب شهر ${payrollMonth} للموظف: ${emp.firstName} ${emp.lastName} [${emp.id}]`,
               amount: amount,
               debitAccount: '5201', // كود حساب الرواتب
               creditAccount: payFund,
               refType: 'payroll',
               institutionId: user?.institutionId || ''
            };
            addFinancialEntry(entry);
            paidCount++;
         }
      });

      addNotification({ title: 'صرف الرواتب', content: `تم صرف رواتب ${paidCount} موظف بنجاح`, type: 'success', date: new Date().toISOString().split('T')[0] });
      setSelectedEmps(new Set());
      setShowPayModal(false);
   };

   return (
      <div className="space-y-10 animate-view pb-24">
         {/* Print View Only */}
         <div className="hidden print:block text-right border-4 border-black p-12 bg-white">
            <div className="flex justify-between items-center mb-10 pb-8 border-b-4 border-black">
               <img src={systemLogo} className="h-28 w-28 object-contain" alt="Logo" />
               <div className="text-center">
                  <h1 className="text-5xl font-black mb-2">{systemName}</h1>
                  <p className="text-xl font-bold uppercase tracking-widest italic">Official Payroll Sheet - كشف مسيرات الرواتب</p>
               </div>
               <div className="text-left font-black text-sm">
                  <p>الفترة: {payrollMonth}</p>
                  <p>تاريخ الاستخراج: {new Date().toLocaleDateString('ar-EG')}</p>
               </div>
            </div>
            <table className="w-full border-collapse border-2 border-black">
               <thead><tr className="bg-slate-200 border-b-2 border-black"><th className="p-4 border-l-2 border-black">الموظف</th><th className="p-4 border-l-2 border-black">الوظيفة</th><th className="p-4 border-l-2 border-black text-center">الراتب الأساسي</th><th className="p-4 border-l-2 border-black text-center">الحالة</th><th className="p-4 text-center">توقيع المستلم</th></tr></thead>
               <tbody>
                  {employees.map(emp => {
                     const isPaid = isSalaryPaid(emp.id, payrollMonth);
                     return (
                        <tr key={emp.id} className="border-b-2 border-black">
                           <td className="p-4 border-l-2 border-black font-black">{emp.firstName} {emp.lastName}</td>
                           <td className="p-4 border-l-2 border-black">{emp.jobTitle || 'عضو كادر'}</td>
                           <td className="p-4 border-l-2 border-black text-center tabular-nums">{(emp.salary || 3000).toLocaleString()}</td>
                           <td className="p-4 border-l-2 border-black text-center font-bold">{isPaid ? 'تم الاستلام' : 'غير مدفوع'}</td>
                           <td className="p-4"></td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
            <div className="mt-24 flex justify-between px-10">
               <div className="text-center w-64 border-t-4 border-black pt-4 font-black text-xl">المحاسب المالي</div>
               <div className="text-center w-64 border-t-4 border-black pt-4 font-black text-xl">مدير الفرع</div>
            </div>
         </div>

         <div className="flex flex-col md:flex-row justify-between items-center bg-white p-10 rounded-[3rem] border shadow-sm no-print gap-6">
            <div className="flex items-center gap-8">
               <div className="p-6 bg-indigo-50 text-indigo-600 rounded-[2.5rem] shadow-inner"><Coins size={40} /></div>
               <div><h2 className="text-3xl font-black">إدارة مسيرات الرواتب</h2><p className="text-slate-500 font-bold">صرف المستحقات، تحديد بدلات، وطباعة الكشوف.</p></div>
            </div>
            <div className="flex gap-4">
               <input type="month" value={payrollMonth} onChange={e => { setPayrollMonth(e.target.value); setSelectedEmps(new Set()); }} className="p-4 bg-slate-50 border rounded-2xl font-black outline-none focus:border-indigo-600 transition-all" />
               <button onClick={() => window.print()} className="p-5 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 shadow-sm transition-all"><Printer size={24} /></button>
               {selectedEmps.size > 0 && <button onClick={() => setShowPayModal(true)} className="px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black flex items-center gap-3 shadow-xl animate-bounce"><CreditCard size={20} /> صرف مجمع ({selectedEmps.size})</button>}
            </div>
         </div>

         <div className="glass-panel bg-white overflow-hidden rounded-[3rem] shadow-sm no-print">
            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full text-right min-w-[1000px]">
                  <thead><tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 border-b"><th className="p-8 text-center">صرف</th><th className="p-8">الموظف / المعلم</th><th className="p-8">المسمى الوظيفي</th><th className="p-8">الراتب الأساسي</th><th className="p-8">البدلات (+)</th><th className="p-8 text-rose-600">الاستقطاع (-)</th><th className="p-8 font-black text-black text-center">الصافي</th><th className="p-8 text-center">الحالة / الإجراء</th></tr></thead>
                  <tbody className="divide-y font-bold text-sm">
                     {employees.map(emp => {
                        const net = (emp.salary || 3000) + (emp.allowances || 0) - (emp.deductions || 0);
                        const isPaid = isSalaryPaid(emp.id, payrollMonth);

                        return (
                           <tr key={emp.id} className={`${selectedEmps.has(emp.id) ? 'bg-indigo-50/50' : isPaid ? 'bg-emerald-50/30' : 'hover:bg-slate-50/50'}`}>
                              <td className="p-8 text-center">
                                 {!isPaid ? (
                                    <button onClick={() => toggleSelect(emp.id)} className={`w-8 h-8 rounded-xl border-2 transition-all flex items-center justify-center ${selectedEmps.has(emp.id) ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'border-slate-200'}`}>{selectedEmps.has(emp.id) && <Check size={16} />}</button>
                                 ) : (
                                    <CheckCircle className="text-emerald-500 mx-auto" size={24} />
                                 )}
                              </td>
                              <td className="p-8 flex items-center gap-4"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.username}`} className="w-10 h-10 rounded-xl bg-slate-100 shadow-inner" /><div className="flex flex-col"><span className="text-slate-900 font-black">{emp.firstName} {emp.lastName}</span><span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Account: {emp.code}</span></div></td>
                              <td className="p-8 text-slate-500">{emp.jobTitle || 'عضو كادر'}</td>
                              <td className="p-8 tabular-nums font-mono">{(emp.salary || 3000).toLocaleString()}</td>
                              <td className="p-8 text-emerald-600 tabular-nums font-mono">{(emp.allowances || 0).toLocaleString()}</td>
                              <td className="p-8 text-rose-600 tabular-nums font-mono">{(emp.deductions || 0).toLocaleString()}</td>
                              <td className="p-8 text-center font-black text-slate-900 text-lg tabular-nums">{net.toLocaleString()}</td>
                              <td className="p-8 text-center">
                                 {isPaid ? (
                                    <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-xs font-black">تم الاستلام</span>
                                 ) : (
                                    <button onClick={() => { setSelectedEmps(new Set([emp.id])); setShowPayModal(true); }} className="px-6 py-2 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase shadow-sm">صرف الآن</button>
                                 )}
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
         </div>

         {showPayModal && (
            <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6 no-print">
               <div className="glass-panel w-full max-w-lg bg-white p-12 rounded-[3.5rem] shadow-3xl space-y-10 border-t-[12px] border-emerald-600">
                  <div className="flex justify-between items-center border-b pb-6"><h3 className="text-2xl font-black">تأكيد تحويل الرواتب</h3><button onClick={() => setShowPayModal(false)}><X size={32} /></button></div>
                  <div className="space-y-8">
                     <div className="p-8 bg-emerald-50 rounded-[2.5rem] border-2 border-dashed border-emerald-200 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100/50 -mr-12 -mt-12 rounded-full"></div>
                        <p className="text-sm font-black text-emerald-900 relative z-10">إجمالي المبلغ المراد صرفه ({payrollMonth})</p>
                        <p className="text-5xl font-black mt-2 tabular-nums text-emerald-700 relative z-10">{employees.reduce((acc, emp) => selectedEmps.has(emp.id) ? acc + ((emp.salary || 3000) + (emp.allowances || 0) - (emp.deductions || 0)) : acc, 0).toLocaleString()} <span className="text-xl">ج.م</span></p>
                     </div>
                     <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">جهة السداد (الصندوق المالي)</label>
                        <select value={payFund} onChange={e => setPayFund(e.target.value)} className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-3xl font-black outline-none transition-all shadow-inner">
                           {funds.map(f => <option key={f.id} value={f.accountCode}>{f.name} ({f.accountCode})</option>)}
                        </select>
                     </div>
                     <button onClick={handleBulkPay} className="w-full py-6 bg-emerald-600 text-white rounded-[2.5rem] font-black text-xl shadow-2xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-4 active:scale-95"><CheckCircle size={32} /> تأكيد الترحيل المالي</button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default PayrollModule;
