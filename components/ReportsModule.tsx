
import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import {
   BarChart3, Calendar, Search, Filter, Printer, Download,
   ChevronDown, ArrowUpRight, ArrowDownRight, Users, Briefcase,
   Wallet, FileText, CheckCircle, TrendingUp, Activity, User, PieChart,
   ShieldCheck, UserCircle, UserCheck, RefreshCw, Layers
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';

const ReportsModule: React.FC = () => {
   const { financialEntries, financialCategories, allUsers, lang, systemName, systemLogo, user, funds } = useAppContext();
   const [dateFrom, setDateFrom] = useState('');
   const [dateTo, setDateTo] = useState('');
   const [reportTarget, setReportTarget] = useState<'all' | 'specific' | 'students' | 'employees' | 'expenses' | 'tax'>('all');
   const [selectedAccountId, setSelectedAccountId] = useState<string>('');
   const [selectedTargetId, setSelectedTargetId] = useState<string>('');

   const isRtl = lang === 'ar';

   const filteredEntries = useMemo(() => {
      return financialEntries.filter(entry => {
         if (dateFrom && entry.date < dateFrom) return false;
         if (dateTo && entry.date > dateTo) return false;

         if (reportTarget === 'specific') {
            if (selectedTargetId) return entry.targetId === selectedTargetId;
            return entry.debitAccount === selectedAccountId || entry.creditAccount === selectedAccountId;
         }
         if (reportTarget === 'students') {
            if (selectedTargetId) return entry.targetId === selectedTargetId;
            return entry.debitAccount.startsWith('112') || entry.creditAccount.startsWith('112');
         }
         if (reportTarget === 'employees') {
            if (selectedTargetId) return entry.targetId === selectedTargetId;
            return entry.debitAccount.startsWith('211') || entry.creditAccount.startsWith('211');
         }
         if (reportTarget === 'expenses') return entry.debitAccount.startsWith('5') || entry.creditAccount.startsWith('5');

         if (reportTarget === 'tax') return (entry.taxAmount || 0) > 0;
         return true;
      });
   }, [financialEntries, dateFrom, dateTo, reportTarget, selectedAccountId, selectedTargetId]);

   const totalValue = useMemo(() => filteredEntries.reduce((acc, e) => acc + e.amount, 0), [filteredEntries]);

   return (
      <div className="space-y-10 animate-view pb-24 text-right">
         {/* نسخة الطباعة المحسنة */}
         <div className="hidden print:block bg-white p-6 border-2 border-black">
            <div className="flex justify-between items-center mb-6 pb-6 border-b-2 border-black">
               <div className="w-1/3">
                  <h1 className="text-2xl font-black">{systemName}</h1>
                  <p className="text-sm font-bold">فرع الإدارة المالية</p>
                  <p className="text-sm">هاتف: 0100XXXXXXX</p>
               </div>
               <div className="w-1/3 text-center">
                  <img src={systemLogo} className="h-20 w-20 mx-auto mb-2" alt="Logo" />
                  <h2 className="text-xl font-black bg-black text-white px-4 py-1 inline-block">كشف حركة مالي رسمي</h2>
               </div>
               <div className="w-1/3 text-left text-sm font-bold">
                  <p>التاريخ: {new Date().toLocaleDateString('ar-EG')}</p>
                  <p>المستخرج: {user?.firstName} {user?.lastName}</p>
                  <p>الصفحة: 1 من 1</p>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6 border p-4 bg-slate-50 font-bold text-sm">
               <div>نوع التقرير: {reportTarget === 'all' ? 'شامل كافة الحركات' : 'مخصص'}</div>
               <div className="text-center">الحساب: {financialCategories.find(c => c.code === selectedAccountId)?.name || 'الكل'}</div>
               <div className="text-left">الفترة: {dateFrom || 'من البداية'} - {dateTo || 'الآن'}</div>
            </div>

            <table className="w-full text-sm border-collapse">
               <thead className="bg-slate-200">
                  <tr className="border-2 border-black">
                     <th className="p-2 border border-black">م</th>
                     <th className="p-2 border border-black">التاريخ</th>
                     <th className="p-2 border border-black">المرجع/القيد</th>
                     <th className="p-2 border border-black">البيان والتفاصيل</th>
                     <th className="p-2 border border-black text-center">المبلغ (EGP)</th>
                  </tr>
               </thead>
               <tbody>
                  {filteredEntries.map((e, i) => (
                     <tr key={e.id} className="border border-black">
                        <td className="p-2 border border-black text-center">{i + 1}</td>
                        <td className="p-2 border border-black text-center font-mono">{e.date}</td>
                        <td className="p-2 border border-black text-center">{e.id}</td>
                        <td className="p-2 border border-black">{e.description}</td>
                        <td className="p-2 border border-black text-center font-black tabular-nums">{e.amount.toLocaleString()}</td>
                     </tr>
                  ))}
               </tbody>
               <tfoot>
                  <tr className="bg-slate-100 border-2 border-black font-black">
                     <td colSpan={4} className="p-4 text-left text-lg">إجمالي قيمة الحركات المختارة:</td>
                     <td className="p-4 text-center text-xl underline decoration-double">{totalValue.toLocaleString()}</td>
                  </tr>
               </tfoot>
            </table>

            <div className="mt-12 grid grid-cols-3 gap-10 text-center font-black">
               <div className="space-y-10">
                  <p>توقيع مراجع الحسابات</p>
                  <div className="border-t border-black w-3/4 mx-auto"></div>
               </div>
               <div className="space-y-10">
                  <p>ختم المنظومة الرسمي</p>
                  <div className="border-2 border-black h-24 w-24 rounded-full mx-auto opacity-10 flex items-center justify-center italic text-[8px]">AL-AQRAB OFFICIAL SEAL</div>
               </div>
               <div className="space-y-10">
                  <p>اعتماد مدير الفرع</p>
                  <div className="border-t border-black w-3/4 mx-auto"></div>
               </div>
            </div>
         </div>

         {/* واجهة العرض للمستخدم (الشاشة) */}
         <div className="flex flex-col lg:flex-row justify-between items-center bg-white p-10 rounded-[3rem] border shadow-sm gap-8 no-print">
            <div className="flex items-center gap-6 w-full"><div className="p-5 bg-slate-950 text-white rounded-[1.75rem] shadow-2xl"><BarChart3 size={40} /></div><div><h2 className="text-3xl font-black">المحلل والتقارير المالية</h2><p className="text-slate-500 font-bold">تتبع الأداء المالي، المصروفات، وإيرادات الفرع بدقة.</p></div></div>
            <button onClick={() => window.print()} className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black flex items-center gap-3 shadow-xl active:scale-95 transition-all"><Printer size={24} /> طباعة كشف الحساب</button>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 no-print">
            <div className="lg:col-span-1 space-y-6">
               <div className="glass-panel p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm space-y-6">
                  <h3 className="font-black text-indigo-600 border-b pb-4 flex items-center gap-3"><Filter size={20} /> فلترة التقارير</h3>
                  <div className="space-y-4">
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase">من تاريخ</label><input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-full p-4 bg-slate-50 rounded-xl font-black text-xs" /></div>
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase">إلى تاريخ</label><input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-full p-4 bg-slate-50 rounded-xl font-black text-xs" /></div>
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase">نوع الكشف</label>
                        <select value={reportTarget} onChange={e => { setReportTarget(e.target.value as any); setSelectedTargetId(''); }} className="w-full p-4 bg-slate-50 rounded-xl font-black text-xs">
                           <option value="all">كافة الحركات المالية</option>
                           <option value="students">تحصيلات الطلاب</option>
                           <option value="employees">مصروفات الموظفين</option>
                           <option value="expenses">المصروفات التشغيلية</option>
                           <option value="tax">الإقرار الضريبي (VAT)</option>
                           <option value="specific">حساب محاسبي محدد</option>
                        </select>
                     </div>
                     {(reportTarget === 'students' || reportTarget === 'employees') && (
                        <div className="space-y-1 animate-view">
                           <label className="text-[10px] font-black text-indigo-600 uppercase">تحديد اسم الشخص</label>
                           <select value={selectedTargetId} onChange={e => setSelectedTargetId(e.target.value)} className="w-full p-4 bg-indigo-50 rounded-xl font-black text-xs">
                              <option value="">-- كافة المشمولين --</option>
                              {allUsers.filter(u => reportTarget === 'students' ? u.role === UserRole.STUDENT : u.role !== UserRole.STUDENT).map(u => (
                                 <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.code})</option>
                              ))}
                           </select>
                        </div>
                     )}
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
                        <thead>
                           <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 border-b">
                              <th className="p-8">التاريخ</th>
                              <th className="p-8 text-center">رقم القيد</th>
                              <th className="p-8">البيان</th>
                              {reportTarget === 'tax' && <th className="p-8 text-center text-emerald-600">صافي المبلغ</th>}
                              {reportTarget === 'tax' && <th className="p-8 text-center text-rose-600">قيمة الضريبة</th>}
                              <th className="p-8 text-left">الإجمالي</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y font-bold text-sm">
                           {filteredEntries.map(e => (
                              <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                                 <td className="p-8 text-slate-400 font-mono text-xs whitespace-nowrap">{e.date}</td>
                                 <td className="p-8 font-black text-indigo-600 text-center">{e.id}</td>
                                 <td className="p-8 max-w-sm truncate">{e.description}</td>
                                 {reportTarget === 'tax' && <td className="p-8 text-center font-mono text-emerald-600 tabular-nums">{(e.netAmount || e.amount).toLocaleString()}</td>}
                                 {reportTarget === 'tax' && <td className="p-8 text-center font-mono text-rose-600 tabular-nums">{(e.taxAmount || 0).toLocaleString()}</td>}
                                 <td className="p-8 text-left font-black tabular-nums text-xl text-slate-900">{e.amount.toLocaleString()} <span className="text-xs text-slate-300">ج.م</span></td>
                              </tr>
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
