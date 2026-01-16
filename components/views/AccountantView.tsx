
import * as React from 'react';
import {
   Calculator, Wallet, Receipt, TrendingUp,
   BarChart3, Users, Landmark, Activity, PieChart,
   ArrowUpRight, ArrowDownRight, FileText, Search, Plus,
   Briefcase, Boxes, CreditCard, ChevronLeft, Package,
   History, DollarSign, ArrowRightLeft, ShieldCheck, RefreshCw
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import SmartAnalytic from '../SmartAnalytic';
import { UserRole } from '../../types';

const AccountantView: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
   const { financialEntries } = useAppContext();

   return (
      <div className="space-y-12 animate-view pb-24">
         <div className="premium-dark-card p-6 md:p-14 text-white overflow-hidden relative border-none shadow-3xl rounded-[2rem] md:rounded-[3.5rem]">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full -mr-40 -mt-40"></div>
            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8 md:gap-10">
               <div className="w-full lg:w-auto text-center lg:text-right">
                  <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                     <ShieldCheck className="text-indigo-400" size={24} />
                     <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-indigo-300">Financial Hub Terminal</span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none mb-6">INTEGRATED ERP</h1>
                  <p className="text-slate-400 font-bold text-base md:text-xl max-w-xl mx-auto lg:mx-0">مرحباً بك في المحرك المالي لمنظومة العقرب. كافة القيود مرحلة والسيولة مراقبة لحظياً.</p>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-3 md:gap-4 mt-8 md:mt-10">
                     <button onClick={() => onNavigate('acc_vouchers')} className="flex-1 md:flex-none px-6 md:px-10 py-4 md:py-5 bg-indigo-600 rounded-xl md:rounded-[1.75rem] font-black text-xs md:text-sm flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
                        <Plus size={20} /> تحرير سند
                     </button>
                     <button onClick={() => onNavigate('acc_reports')} className="flex-1 md:flex-none px-6 md:px-10 py-4 md:py-5 bg-white/5 border border-white/10 rounded-xl md:rounded-[1.75rem] font-black text-xs md:text-sm flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
                        <BarChart3 size={20} /> التقارير المجمعة
                     </button>
                  </div>
               </div>
               <div className="bg-white/5 backdrop-blur-2xl p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-white/10 shadow-3xl text-center w-full lg:w-auto lg:min-w-[300px]">
                  <p className="text-[10px] md:text-[11px] font-black uppercase text-indigo-400 tracking-widest mb-3 md:mb-4">إجمالي السيولة المتاحة</p>
                  <h2 className="text-4xl md:text-6xl font-black tabular-nums mb-4 tracking-tighter">1.28M <span className="text-lg md:text-xl font-bold opacity-30">EGP</span></h2>
                  <div className="flex items-center justify-center gap-2 text-emerald-400 text-[10px] md:text-xs font-black">
                     <TrendingUp size={16} /> +12.5% عجزاً الشهر الماضي
                  </div>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard label="إجمالي التحصيل" val="452K" icon={<ArrowDownRight />} color="text-emerald-500" />
            <StatCard label="المنصرفات العامة" val="124K" icon={<ArrowUpRight />} color="text-rose-500" />
            <StatCard label="رواتب الكادر" val="85K" icon={<Users />} color="text-indigo-600" />
            <StatCard label="الالتزامات" val="18K" icon={<Activity />} color="text-amber-500" />
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
               <div className="glass-panel p-10 bg-white rounded-[3rem] border shadow-sm">
                  <div className="flex justify-between items-center mb-10 border-b pb-6">
                     <h3 className="text-2xl font-black flex items-center gap-4 uppercase tracking-tight text-slate-900">
                        <History className="text-indigo-600" size={28} /> آخر القيود المرحلة لليومية
                     </h3>
                     <button onClick={() => onNavigate('acc_entries_list')} className="text-xs font-black text-indigo-600 hover:underline">مشاهدة السجل الكامل</button>
                  </div>
                  <div className="space-y-4">
                     {financialEntries.slice(0, 4).map(e => (
                        <div key={e.id} className="p-6 bg-slate-50/50 border-2 border-transparent rounded-[2rem] hover:border-indigo-600 hover:bg-white transition-all flex items-center justify-between group">
                           <div className="flex items-center gap-6">
                              <div className="p-4 bg-white rounded-2xl shadow-sm text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all"><Receipt size={24} /></div>
                              <div>
                                 <p className="font-black text-slate-900 text-lg">{e.description}</p>
                                 <p className="text-[10px] text-slate-400 font-black mt-1 uppercase tracking-widest">{e.id} • {e.date}</p>
                              </div>
                           </div>
                           <p className="text-2xl font-black text-slate-900 tabular-nums">{e.amount.toLocaleString()} <span className="text-xs opacity-20">EGP</span></p>
                        </div>
                     ))}
                     {financialEntries.length === 0 && <div className="text-center py-20 opacity-20 font-black text-xl">لا توجد قيود مسجلة اليوم</div>}
                  </div>
               </div>
            </div>

            <div className="space-y-10">
               <div className="glass-panel p-10 bg-white rounded-[3rem] shadow-sm relative overflow-hidden group">
                  <h3 className="text-xl font-black mb-10 flex items-center gap-3 text-slate-900"><PieChart size={24} className="text-indigo-600" /> تحليل المصاريف التشغيلية</h3>
                  <div className="py-12 flex items-center justify-center">
                     <div className="w-48 h-48 rounded-full border-[16px] border-indigo-600 border-t-rose-500 border-r-amber-500 animate-[spin_10s_linear_infinite] flex items-center justify-center relative">
                        <div className="absolute inset-0 flex flex-col items-center justify-center -rotate-0 animate-none">
                           <span className="text-3xl font-black text-slate-900">84%</span>
                           <span className="text-[9px] font-black text-slate-400 uppercase">Efficiency</span>
                        </div>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <FlowStat label="الرواتب والبدلات" val="55%" color="bg-indigo-600" />
                     <FlowStat label="إيجارات وخدمات" val="25%" color="bg-rose-500" />
                     <FlowStat label="مشتريات مخزنية" val="20%" color="bg-amber-500" />
                  </div>
                  <div className="mt-8 border-t pt-8">
                     <SmartAnalytic
                        role={UserRole.ACCOUNTANT}
                        dataContext="تحليل الوضع المالي: السيولة 1.28M، التحصيل 452K، المصروفات 124K. الرواتب تمثل 55% من المصروفات. هناك فائض في الميزانية."
                     />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

const StatCard = ({ label, val, icon, color }: any) => (
   <div className="glass-panel p-10 bg-white flex flex-col gap-8 group hover:border-indigo-600 transition-all shadow-sm rounded-[3rem]">
      <div className={`p-5 bg-slate-50 ${color} rounded-[2rem] w-fit shadow-inner group-hover:scale-110 transition-transform`}>{React.cloneElement(icon, { size: 36 })}</div>
      <div>
         <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{label}</p>
         <h4 className="text-4xl font-black text-slate-900 tabular-nums tracking-tighter">{val}</h4>
      </div>
   </div>
);

const FlowStat = ({ label, val, color }: any) => (
   <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
         <div className={`w-3 h-3 rounded-full ${color}`}></div>
         <span className="text-sm font-black text-slate-600">{label}</span>
      </div>
      <span className="font-black text-sm text-slate-900 tabular-nums">{val}</span>
   </div>
);

export default AccountantView;
