
import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import {
   BarChart3, Calendar, Search, Filter, Printer, Download,
   ChevronDown, ArrowUpRight, ArrowDownRight, Users, Briefcase,
   Wallet, FileText, CheckCircle, TrendingUp, Activity, User, PieChart,
   ShieldCheck, UserCircle, UserCheck, RefreshCw, Layers, FileSpreadsheet
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';
import * as XLSX from 'xlsx';

const ReportsModule: React.FC = () => {
   const { financialEntries, financialCategories, allUsers, lang, systemName, systemLogo, user, funds } = useAppContext();
   const [dateFrom, setDateFrom] = useState('');
   const [dateTo, setDateTo] = useState('');
   const [reportTarget, setReportTarget] = useState<'all' | 'specific' | 'students' | 'employees' | 'expenses'>('all');
   const [selectedAccountId, setSelectedAccountId] = useState<string>('');

   const isRtl = lang === 'ar';

   const filteredEntries = useMemo(() => {
      return financialEntries.filter(entry => {
         if (dateFrom && entry.date < dateFrom) return false;
         if (dateTo && entry.date > dateTo) return false;

         if (reportTarget === 'specific') {
            return entry.debitAccount === selectedAccountId || entry.creditAccount === selectedAccountId;
         }
         if (reportTarget === 'students') {
            return entry.debitAccount.startsWith('112') || entry.creditAccount.startsWith('112');
         }
         if (reportTarget === 'employees') {
            return entry.debitAccount.startsWith('211') || entry.creditAccount.startsWith('211');
         }
         if (reportTarget === 'expenses') return entry.debitAccount.startsWith('5') || entry.creditAccount.startsWith('5');

         return true;
      });
   }, [financialEntries, dateFrom, dateTo, reportTarget, selectedAccountId]);

   const totalValue = useMemo(() => filteredEntries.reduce((acc, e) => acc + e.amount, 0), [filteredEntries]);


   const handleExportExcel = () => {
      if (filteredEntries.length === 0) return alert("لا توجد بيانات للتصدير");

      const data = filteredEntries.map((e, i) => ({
         'م': i + 1,
         'التاريخ': e.date,
         'رقم القيد': e.id,
         'الوصف': e.description,
         'الحساب المدين': e.debitAccount,
         'الحساب الدائن': e.creditAccount,
         'المبلغ': e.amount
      }));

      const ws = XLSX.utils.json_to_sheet(data, { header: ['م', 'التاريخ', 'رقم القيد', 'الوصف', 'الحساب المدين', 'الحساب الدائن', 'المبلغ'] });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Financial Report");
      XLSX.writeFile(wb, `Financial_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
   };


   return (
      <div className="space-y-10 animate-view pb-24 text-right">
         {/* نسخة الطباعة المحسنة والمحترفة */}
         <div className="hidden print:block bg-white p-12 min-h-screen text-right font-serif relative" dir="rtl">
            {/* Subtle Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
               <img src={systemLogo} className="w-[600px] h-[600px] object-contain grayscale" />
            </div>

            <div className="relative z-10">
               <div className="flex justify-between items-start mb-12 pb-10 border-b-[4px] border-indigo-950">
                  <div className="w-1/3 space-y-2">
                     <h1 className="text-4xl font-black text-indigo-950 uppercase italic tracking-tighter">{systemName}</h1>
                     <div className="h-1.5 w-24 bg-indigo-950"></div>
                     <p className="text-sm font-bold pt-2">الإدارة المالية والتدقيق</p>
                     <p className="text-xs font-bold text-slate-500">Financial Management & Audit</p>
                     <div className="pt-4 text-xs font-bold space-y-1">
                        <p>الهاتف: +20 100 000 0000</p>
                        <p>البريد: finance@aleaqrab.com</p>
                     </div>
                  </div>

                  <div className="w-1/3 text-center">
                     <img src={systemLogo} className="h-32 w-32 mx-auto mb-6 p-4 bg-white shadow-xl rounded-[2rem] border-2 border-slate-50" alt="Logo" />
                     <div className="inline-block px-10 py-3 bg-indigo-950 text-white rounded-full font-black text-2xl shadow-lg ring-4 ring-indigo-50">
                        تقرير الذمة ودفاتر القيد
                     </div>
                     <p className="text-[10px] font-black text-slate-400 mt-4 tracking-[0.4em] uppercase">Official Financial Statement</p>
                  </div>

                  <div className="w-1/3 text-left rtl:text-right font-black text-sm space-y-2">
                     <div className="p-4 bg-slate-50 rounded-2xl border-2 border-indigo-50 inline-block">
                        <p className="text-indigo-600 mb-1">بيانات المستند</p>
                        <p>التاريخ: <span className="font-mono">{new Date().toLocaleDateString('ar-EG')}</span></p>
                        <p>الوقت: <span className="font-mono">{new Date().toLocaleTimeString('ar-EG')}</span></p>
                        <p>الموظف: {user?.firstName} {user?.lastName}</p>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-3 gap-6 mb-12">
                  <div className="p-6 bg-slate-100 rounded-[2rem] border-2 border-slate-200">
                     <p className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">نوع التقرير</p>
                     <p className="font-black text-lg">{reportTarget === 'all' ? 'شامل كافة الحركات' : reportTarget === 'students' ? 'تحصيلات الطلاب' : reportTarget === 'employees' ? 'رواتب الموظفين' : 'تقرير الحسابات المخصصة'}</p>
                  </div>
                  <div className="p-6 bg-indigo-950 text-white rounded-[2rem] text-center shadow-xl">
                     <p className="text-[10px] font-black text-indigo-300 mb-2 uppercase tracking-widest">إجمالي القيود</p>
                     <p className="text-4xl font-black">{totalValue.toLocaleString()} <span className="text-xs font-normal">ج.م</span></p>
                  </div>
                  <div className="p-6 bg-slate-100 rounded-[2rem] border-2 border-slate-200 text-left">
                     <p className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">الفترة الزمنية</p>
                     <p className="font-black text-sm">{dateFrom || 'من البداية'} ← {dateTo || 'حتى الآن'}</p>
                  </div>
               </div>

               <table className="w-full text-sm border-collapse rounded-3xl overflow-hidden shadow-sm">
                  <thead className="bg-indigo-950 text-white">
                     <tr>
                        <th className="p-5 border border-indigo-900 font-black text-center w-12 text-xs">م</th>
                        <th className="p-5 border border-indigo-900 font-black text-center w-32 text-xs">التاريخ</th>
                        <th className="p-5 border border-indigo-900 font-black text-center w-24 text-xs">رقم القيد</th>
                        <th className="p-5 border border-indigo-900 font-black text-right text-xs">البيان وتفاصيل العملية</th>
                        <th className="p-5 border border-indigo-900 font-black text-center w-40 text-xs">القيمة (EGP)</th>
                     </tr>
                  </thead>
                  <tbody className="bg-white">
                     {filteredEntries.map((e, i) => (
                        <tr key={e.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                           <td className="p-5 border-x border-b border-slate-200 text-center font-bold">{i + 1}</td>
                           <td className="p-5 border-x border-b border-slate-200 text-center font-mono font-bold text-slate-600">{e.date}</td>
                           <td className="p-5 border-x border-b border-slate-200 text-center font-black text-indigo-700">{e.id}</td>
                           <td className="p-5 border-x border-b border-slate-200 font-bold text-slate-800 leading-relaxed text-base">{e.description}</td>
                           <td className="p-5 border-x border-b border-slate-200 text-center font-black text-lg tabular-nums">{e.amount.toLocaleString()}</td>
                        </tr>
                     ))}
                  </tbody>
                  <tfoot className="bg-indigo-50">
                     <tr className="font-black border-2 border-indigo-950">
                        <td colSpan={4} className="p-6 text-left text-xl">إجمالي القيمة النهائية المستخرجة:</td>
                        <td className="p-6 text-center text-3xl text-indigo-950 underline decoration-double">{totalValue.toLocaleString()}</td>
                     </tr>
                  </tfoot>
               </table>

               <div className="mt-24 grid grid-cols-3 gap-16 text-center">
                  <div className="space-y-12">
                     <p className="font-black text-lg text-slate-900 underline underline-offset-8">قسم التدقيق والمراجعة</p>
                     <div className="text-xs text-slate-400 font-bold italic">التوقيع والختم</div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                     <div className="border-[5px] border-double border-indigo-950/20 h-40 w-40 rounded-full flex flex-col items-center justify-center p-4">
                        <div className="text-[10px] font-black text-indigo-950/30 uppercase text-center leading-tight">
                           CERTIFIED DOCUMENT<br />LEAQrab SYSTEMS<br />{new Date().getFullYear()}
                        </div>
                     </div>
                  </div>
                  <div className="space-y-12">
                     <p className="font-black text-lg text-slate-900 underline underline-offset-8">اعتماد الإدارة العليا</p>
                     <div className="text-xs text-slate-400 font-bold italic">التوقيع للمفوض</div>
                  </div>
               </div>

               <div className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-center opacity-30 select-none">
                  <p className="text-[9px] font-black">All Rights Reserved © {new Date().getFullYear()} Aleaqrab Management</p>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em]">{systemName} CORE V10.4</p>
               </div>
            </div>
         </div>


         {/* واجهة العرض للمستخدم (الشاشة) */}
         <div className="flex flex-col lg:flex-row justify-between items-center bg-white p-10 rounded-[3rem] border shadow-sm gap-8 no-print">
            <div className="flex items-center gap-6 w-full"><div className="p-5 bg-slate-950 text-white rounded-[1.75rem] shadow-2xl"><BarChart3 size={40} /></div><div><h2 className="text-3xl font-black">المحلل والتقارير المالية</h2><p className="text-slate-500 font-bold">تتبع الأداء المالي، المصروفات، وإيرادات الفرع بدقة.</p></div></div>
            <div className="flex gap-4">
               <button onClick={handleExportExcel} className="px-8 py-5 bg-emerald-50 text-emerald-600 rounded-2xl font-black flex items-center gap-3 border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"><FileSpreadsheet size={24} /> Excel</button>
               <button onClick={() => window.print()} className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black flex items-center gap-3 shadow-xl active:scale-95 transition-all"><Printer size={24} /> طباعة كشف الحساب</button>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 no-print">
            <div className="lg:col-span-1 space-y-6">
               <div className="glass-panel p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm space-y-6">
                  <h3 className="font-black text-indigo-600 border-b pb-4 flex items-center gap-3"><Filter size={20} /> فلترة التقارير</h3>
                  <div className="space-y-4">
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase">من تاريخ</label><input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-full p-4 bg-slate-50 rounded-xl font-black text-xs" /></div>
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase">إلى تاريخ</label><input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-full p-4 bg-slate-50 rounded-xl font-black text-xs" /></div>
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase">نوع الكشف</label>
                        <select value={reportTarget} onChange={e => setReportTarget(e.target.value as any)} className="w-full p-4 bg-slate-50 rounded-xl font-black text-xs">
                           <option value="all">كافة الحركات المالية</option>
                           <option value="specific">حساب محدد (كشف حساب)</option>
                           <option value="students">تحصيلات الطلاب</option>
                           <option value="employees">مصروفات الرواتب</option>
                           <option value="expenses">المصروفات التشغيلية</option>
                        </select>
                     </div>
                  </div>
               </div>
            </div>

            <div className="lg:col-span-3 space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="glass-panel p-10 bg-white border shadow-sm flex justify-between items-center group rounded-[2.5rem]">
                     <div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">صافي الحركات المختارة</p><h4 className="text-4xl font-black text-slate-900 tabular-nums">{totalValue.toLocaleString()} <span className="text-xl opacity-20">EGP</span></h4></div>
                     <div className="p-6 bg-emerald-50 text-emerald-600 rounded-[2rem] group-hover:scale-110 transition-transform"><TrendingUp size={40} /></div>
                  </div>
               </div>

               <div className="glass-panel bg-white overflow-hidden rounded-[3rem] shadow-xl border border-slate-100">
                  <div className="p-8 border-b flex justify-between items-center bg-slate-50/50"><h3 className="font-black text-xl flex items-center gap-4 text-slate-900"><FileText size={24} className="text-indigo-600" /> تفاصيل دفتر القيود المالية</h3></div>
                  <div className="overflow-x-auto no-scrollbar">
                     <table className="w-full text-right">
                        <thead><tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 border-b"><th className="p-8">التاريخ</th><th className="p-8">رقم القيد</th><th className="p-8">البيان</th><th className="p-8 text-left">القيمة</th></tr></thead>
                        <tbody className="divide-y font-bold text-sm">
                           {filteredEntries.map(e => (
                              <tr key={e.id} className="hover:bg-slate-50/50 transition-colors"><td className="p-8 text-slate-400 font-mono text-xs">{e.date}</td><td className="p-8 font-black text-indigo-600">{e.id}</td><td className="p-8">{e.description}</td><td className="p-8 text-left font-black tabular-nums text-xl text-slate-900">{e.amount.toLocaleString()} ج.م</td></tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ReportsModule;
