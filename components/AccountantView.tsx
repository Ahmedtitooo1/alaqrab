
import React from 'react';
import { 
  Calculator, Wallet, Receipt, TrendingUp, 
  BarChart3, Users, Landmark, Activity, PieChart,
  ArrowUpRight, ArrowDownRight, FileText, Search, Plus,
  Briefcase, Boxes, CreditCard, ChevronLeft, Package,
  History, DollarSign, ArrowRightLeft
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface ViewProps {
  onNavigate: (tab: string) => void;
}

const AccountantView: React.FC<ViewProps> = ({ onNavigate }) => {
  const { lang, t } = useAppContext();
  const isRtl = lang === 'ar';

  return (
    <div className="space-y-10 pb-16 animate-view">
      {/* Financial Hero Header - Glassy White Version */}
      <div className="glass-card p-12 rounded-[2.5rem] relative overflow-hidden flex flex-col lg:flex-row justify-between items-center border-b-8 border-blue-600/20">
         <div className="absolute top-0 left-0 w-80 h-80 bg-blue-600/5 blur-[100px] rounded-full -ml-40 -mt-40"></div>
         <div className="relative z-10 flex items-center gap-8">
            <div className="p-6 bg-white rounded-3xl border border-blue-100 text-blue-800 shadow-xl transition-transform hover:scale-105">
               <Calculator size={48} />
            </div>
            <div>
               <h1 className="text-4xl font-black tracking-tight text-slate-900">{isRtl ? 'الإدارة المالية المركزية' : 'Financial Control Center'}</h1>
               <p className="text-blue-700 font-black mt-2 uppercase tracking-[0.2em] text-[10px]">Al-Aqrab Premium ERP v3.0 • Secure Ledger</p>
            </div>
         </div>
         <div className="relative z-10 flex flex-wrap justify-center gap-4">
            <QuickActionBtn 
               onClick={() => onNavigate('acc_new_entry')} 
               icon={<Plus size={20} />} 
               label="قيد يومية" 
               color="bg-slate-950 text-white hover:bg-black" 
            />
            <QuickActionBtn 
               onClick={() => onNavigate('acc_liquidity')} 
               icon={<ArrowRightLeft size={20} />} 
               label="تحويل نقدية" 
               color="bg-white text-slate-900 border border-slate-200 shadow-sm" 
            />
         </div>
      </div>

      {/* Main Stats - Glass Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         <StatBox label="إجمالي التحصيل" val="12,500" icon={<ArrowDownRight />} color="text-emerald-600" />
         <StatBox label="إجمالي المنصرف" val="3,800" icon={<ArrowUpRight />} color="text-rose-600" />
         <StatBox label="النقدية المتاحة" val="45,200" icon={<Wallet />} color="text-blue-700" />
         <StatBox label="صافي التدفق" val="8,700" icon={<TrendingUp />} color="text-slate-900" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               <ToolCard onClick={() => onNavigate('acc_coa')} icon={<Boxes />} label="شجرة الحسابات" />
               <ToolCard onClick={() => onNavigate('acc_payroll')} icon={<CreditCard />} label="الرواتب والبدلات" />
               <ToolCard onClick={() => onNavigate('acc_inventory')} icon={<Package />} label="المخازن والصرف" />
               <ToolCard onClick={() => onNavigate('acc_reports')} icon={<BarChart3 />} label="التقارير المالية" />
            </div>

            <div className="glass-card p-10">
               <div className="flex justify-between items-center mb-10 border-b pb-6 border-white/50">
                  <h3 className="text-2xl font-black flex items-center gap-4 text-slate-900 uppercase tracking-tight">
                     <History className="text-blue-700" size={28} /> آخر العمليات المرحلة
                  </h3>
                  <button onClick={() => onNavigate('acc_entries_list')} className="text-xs font-black text-blue-700 flex items-center gap-2 hover:underline">
                     سجل القيود كاملاً <ChevronLeft size={16} className={isRtl ? '' : 'rotate-180'} />
                  </button>
               </div>
               <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between p-6 bg-white/40 border border-white/80 rounded-2xl hover:border-blue-600 transition-all group shadow-sm">
                       <div className="flex items-center gap-6">
                          <div className={`p-4 rounded-xl ${i % 2 === 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} transition-transform`}>
                             {i % 2 === 0 ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                          </div>
                          <div>
                             <p className="font-black text-lg text-slate-900">{i % 2 === 0 ? 'توريد نقدية من طالب' : 'صرف عهدة صيانة'}</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Journal Entry #TRX-2024-{i}</p>
                          </div>
                       </div>
                       <p className={`text-2xl font-black tabular-nums ${i % 2 === 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                         {i % 2 === 0 ? '+' : '-'}{i % 2 === 0 ? '750' : '150'} <span className="text-xs">ج.م</span>
                       </p>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="space-y-10">
            <div className="glass-card p-10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 blur-[60px] rounded-full -mr-24 -mt-24"></div>
               <h3 className="text-xl font-black mb-10 border-b border-white/50 pb-6 flex items-center gap-3 text-slate-900 uppercase tracking-tight">
                  <PieChart size={24} className="text-blue-700" /> تحليل المصروفات
               </h3>
               <div className="flex justify-center py-8">
                  <div className="relative">
                    <Activity size={180} className="text-slate-200/50" />
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                       <span className="text-4xl font-black text-slate-900">82%</span>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Efficiency</span>
                    </div>
                  </div>
               </div>
               <div className="space-y-6">
                  <FlowStat label="المرتبات" val="55%" color="bg-blue-600" />
                  <FlowStat label="المشتريات" val="25%" color="bg-slate-900" />
                  <FlowStat label="أخرى" val="20%" color="bg-slate-300" />
               </div>
               <button className="w-full mt-10 py-5 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-xs hover:bg-slate-50 transition-all uppercase tracking-widest shadow-sm">تصدير تقرير تنفيذي</button>
            </div>
         </div>
      </div>
    </div>
  );
};

const QuickActionBtn = ({ icon, label, onClick, color }: any) => (
  <button onClick={onClick} className={`px-8 py-4 ${color} rounded-2xl font-black text-sm flex items-center gap-3 hover:scale-105 transition-all shadow-xl active:scale-95`}>
    {icon} {label}
  </button>
);

const StatBox = ({ label, val, icon, color }: any) => (
  <div className="glass-card p-8 flex flex-col gap-6 group hover:border-blue-600/30 transition-all">
     <div className="flex justify-between items-start">
        <div className={`p-4 bg-white border border-slate-100 ${color} rounded-2xl group-hover:scale-110 transition-transform shadow-sm`}>{React.cloneElement(icon, { size: 28 })}</div>
        <Search size={16} className="text-slate-200" />
     </div>
     <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{label}</p>
        <h4 className="text-3xl font-black text-slate-900 tabular-nums">{val} <span className="text-xs text-slate-300 font-bold">ج.م</span></h4>
     </div>
  </div>
);

const ToolCard = ({ icon, label, onClick }: any) => (
  <button onClick={onClick} className="glass-card p-6 flex flex-col items-center gap-4 hover:border-blue-600 transition-all group shadow-sm">
     <div className="p-5 bg-white text-blue-700 border border-blue-50 rounded-2xl group-hover:bg-blue-700 group-hover:text-white transition-all shadow-sm">
        {React.cloneElement(icon as React.ReactElement<any>, { size: 28 })}
     </div>
     <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900 transition-colors">{label}</span>
  </button>
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
