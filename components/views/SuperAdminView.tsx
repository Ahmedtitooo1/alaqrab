
import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import {
   Building2, Users, Globe, Plus, X, Settings,
   ShieldCheck, BrainCircuit, Sparkles, UserPlus,
   CreditCard, AlertTriangle, Calendar, Save,
   School, CheckCircle, Package, MonitorPlay, Check,
   RefreshCw, DollarSign, Calculator, ChevronRight, UserCircle, Activity, PlayCircle, LogIn,
   Layout, Palette, MessageSquare, Key, UserCheck, ShieldAlert, Zap,
   Wallet, Search, Trash2, ArrowUpRight, TrendingUp, History, Info, Layers
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import SmartAnalytic from '../SmartAnalytic';
import { ClientType, PricingModel, Institution, UserRole, User } from '../../types';

import { PermissionsManager } from '../PermissionsManager';

interface SuperAdminViewProps {
   mode: 'overview' | 'simulation' | 'subscriptions' | 'permissions' | 'system_settings';
   // Adding onNavigate prop to handle view switching
   onNavigate: (tab: string) => void;
}

const QuotaBox = ({ label, val, highlight }: any) => (
   <div className={`p-5 rounded-3xl border transition-all text-center ${highlight ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'bg-slate-50 border-slate-100 group-hover:bg-white group-hover:shadow-inner'}`}>
      <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${highlight ? 'text-indigo-200' : 'text-slate-400'}`}>{label}</p>
      <p className="text-3xl font-black tabular-nums leading-none">{val}</p>
   </div>
);

const QuotaInput = ({ label, val, onChange, highlight }: any) => (
   <div className="space-y-3 text-right">
      <label className="text-[11px] font-black text-slate-400 uppercase px-2 tracking-widest">{label}</label>
      <input type="number" value={val} onChange={e => onChange?.(parseInt(e.target.value) || 0)} className={`w-full p-6 rounded-[2rem] text-center font-black text-3xl border-2 shadow-inner outline-none transition-all ${highlight ? 'border-indigo-200 bg-indigo-50 text-indigo-900 focus:border-indigo-600' : 'border-slate-100 bg-white text-slate-900 focus:border-indigo-600'}`} />
   </div>
);

const PermissionItem = ({ label, active, onClick, icon }: any) => (
   <button onClick={onClick} className={`p-8 rounded-[3rem] border-2 transition-all flex items-center justify-between group ${active ? 'border-indigo-200 bg-indigo-50/50 shadow-sm' : 'border-slate-100 bg-white grayscale opacity-50'}`}>
      <div className="flex items-center gap-6">
         <div className={`p-4 rounded-2xl transition-all ${active ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>{icon}</div>
         <span className={`text-lg font-black ${active ? 'text-indigo-950' : 'text-slate-400'}`}>{label}</span>
      </div>
      <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all ${active ? 'bg-indigo-600 border-indigo-100 text-white' : 'border-slate-100 text-transparent'}`}><Check size={24} strokeWidth={4} /></div>
   </button>
);

const SuperAdminView: React.FC<SuperAdminViewProps> = ({ mode, onNavigate }) => {
   const {
      institutions, allUsers, updateInstitution, addInstitution,
      startSimulation, addEmployeeRecord, addNotification,
      systemName, setSystemName, systemLogo, setSystemLogo,
      systemContact, setSystemContact
   } = useAppContext();

   const [showModal, setShowModal] = useState<boolean>(false);
   const [editingInst, setEditingInst] = useState<Institution | null>(null);
   const [activeSimulationInst, setActiveSimulationInst] = useState<string | null>(null);
   const [searchSim, setSearchSim] = useState('');

   // بيانات النموذج لإنشاء بيئة
   const [formData, setFormData] = useState<any>({
      name: '', subdomain: '', type: ClientType.INSTITUTION, status: 'active',
      adminData: { firstName: '', lastName: '', username: '', password: '', phone: '' },
      permissions: {
         allowCustomBranding: false,
         allowAiCorrection: true,
         allowSmartAnalyst: true,
         allowAiUsage: true,
         allowFinancialLedger: true,
         allowLiveStreaming: true
      },
      pricing: { model: PricingModel.MONTHLY, totalAmount: 0, paidAmount: 0, rate: 1000 },
      paymentHistory: [],
      limits: { admins: 1, teachers: 5, accountants: 1, students: 200 },
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
   });

   // حساب إجمالي المبلغ بناءً على الموديل
   const calculatedTotal = useMemo(() => {
      if (formData.pricing.model === PricingModel.PER_STUDENT) {
         return formData.limits.students * formData.pricing.rate;
      }
      return formData.pricing.rate;
   }, [formData.pricing.model, formData.pricing.rate, formData.limits.students]);

   const handleSaveInstitution = () => {
      if (!formData.name || !formData.subdomain) return alert("يرجى إكمال البيانات الأساسية");

      const finalPricing = { ...formData.pricing, totalAmount: calculatedTotal };
      const instData = { ...formData, pricing: finalPricing };

      if (editingInst) {
         updateInstitution({ ...editingInst, ...instData } as Institution);
         addNotification({ title: 'تعديل بيئة', content: `تم تحديث بيانات ${formData.name}`, type: 'success', date: new Date().toISOString() });
      } else {
         const instId = 'inst-' + Date.now();
         const newInst = {
            ...instData,
            id: instId,
            revenue: instData.pricing.paidAmount,
            status: 'active'
         };
         addInstitution(newInst as Institution);

         if (formData.adminData.firstName && formData.adminData.username) {
            addEmployeeRecord({
               id: `admin-${Date.now()}`,
               code: `ADM-${formData.subdomain.toUpperCase()}`,
               firstName: formData.adminData.firstName,
               lastName: formData.adminData.lastName,
               username: formData.adminData.username,
               role: UserRole.ADMIN,
               institutionId: instId,
               phone: formData.adminData.phone,
               aiQuestionsCount: 100,
               jobTitle: 'مدير النظام الفرعي'
            }, true);
         }
         addNotification({ title: 'تفعيل بيئة', content: `تم إنشاء بيئة ${formData.name} بنجاح.`, type: 'success', date: new Date().toISOString() });
      }
      setShowModal(false);
   };

   const handleAddPayment = (instId: string) => {
      const amount = prompt("أدخل قيمة الدفعة المحصلة (ج.م):");
      if (!amount || isNaN(Number(amount))) return;

      const inst = institutions.find(i => i.id === instId);
      if (inst) {
         const newPayment = { id: Date.now().toString(), amount: Number(amount), date: new Date().toISOString().split('T')[0], note: 'تحصيل دفعة جزئية' };
         const updated = {
            ...inst,
            pricing: { ...inst.pricing, paidAmount: inst.pricing.paidAmount + Number(amount) },
            paymentHistory: [...(inst.paymentHistory || []), newPayment]
         };
         updateInstitution(updated);
         addNotification({ title: 'تحصيل مالي', content: `تم تسجيل مبلغ ${amount} لـ ${inst.name}`, type: 'success', date: new Date().toISOString() });
      }
   };

   // واجهة مركز المحاكاة (Simulation)
   if (mode === 'simulation') {
      return (
         <div className="space-y-10 animate-view">
            <div className="premium-dark-card p-14 text-white overflow-hidden relative border-none shadow-3xl">
               <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/10 blur-[120px] -mr-40 -mt-40 rounded-full"></div>
               <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="text-right">
                     <h2 className="text-5xl font-black italic uppercase flex items-center gap-6">
                        <Activity size={48} className="text-emerald-500 animate-pulse" /> SIMULATION HUB
                     </h2>
                     <p className="text-slate-400 font-bold mt-4 text-xl">تقمص دور أي مستخدم في أي فرع لتقديم الدعم الفني المباشر.</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 flex items-center gap-6">
                     <div className="text-center"><p className="text-[9px] font-black uppercase text-emerald-400 mb-1">بيئات مفعلة</p><p className="text-3xl font-black">{institutions.length}</p></div>
                     <div className="w-px h-10 bg-white/10"></div>
                     <div className="text-center"><p className="text-[9px] font-black uppercase text-indigo-400 mb-1">إجمالي المستخدمين</p><p className="text-3xl font-black">{allUsers.length}</p></div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
               {/* قائمة المؤسسات */}
               <div className="lg:col-span-1 space-y-6">
                  <h3 className="text-xl font-black text-slate-900 border-b pb-4 flex items-center gap-3"><Building2 className="text-indigo-600" /> 1. اختر المؤسسة</h3>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto no-scrollbar pr-2">
                     {institutions.map(inst => (
                        <button
                           key={inst.id}
                           onClick={() => setActiveSimulationInst(inst.id)}
                           className={`w-full p-6 rounded-[2.5rem] border-2 transition-all text-right flex items-center justify-between group ${activeSimulationInst === inst.id ? 'border-indigo-600 bg-indigo-50 shadow-xl' : 'border-slate-100 bg-white hover:border-indigo-200'}`}
                        >
                           <div className="flex items-center gap-5">
                              <div className={`p-4 rounded-2xl shadow-inner ${activeSimulationInst === inst.id ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400'}`}><Globe size={24} /></div>
                              <div><p className="font-black text-slate-900 text-lg">{inst.name}</p><p className="text-[10px] text-slate-400 font-mono tracking-tighter">@{inst.subdomain}</p></div>
                           </div>
                           <ChevronRight size={18} className={activeSimulationInst === inst.id ? 'text-indigo-600' : 'text-slate-200'} />
                        </button>
                     ))}
                     {institutions.length === 0 && <p className="p-10 text-center text-slate-300 font-black italic">لا يوجد بيئات مفعلة للمحاكاة</p>}
                  </div>
               </div>

               {/* قائمة المستخدمين */}
               <div className="lg:col-span-2 space-y-6">
                  <div className="flex justify-between items-center border-b pb-4">
                     <h3 className="text-xl font-black text-slate-900 flex items-center gap-3"><Users className="text-emerald-600" /> 2. اختر المستخدم للمحاكاة</h3>
                     {activeSimulationInst && (
                        <div className="relative w-72">
                           <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                           <input value={searchSim} onChange={e => setSearchSim(e.target.value)} className="w-full p-3 pr-12 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:border-emerald-500 outline-none" placeholder="بحث باسم المستخدم..." />
                        </div>
                     )}
                  </div>

                  {!activeSimulationInst ? (
                     <div className="p-32 text-center bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-100">
                        <UserCircle size={100} className="mx-auto text-slate-200 mb-6" />
                        <p className="text-slate-400 font-black text-2xl italic tracking-tight">برجاء تحديد المؤسسة أولاً لعرض كادرها وطلابها</p>
                     </div>
                  ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-view">
                        {allUsers.filter(u => u.institutionId === activeSimulationInst && (u.firstName + ' ' + u.lastName).toLowerCase().includes(searchSim.toLowerCase())).map(u => (
                           <div key={u.id} className="p-6 bg-white border border-slate-100 rounded-[3rem] flex items-center justify-between hover:shadow-2xl transition-all group relative overflow-hidden">
                              <div className="flex items-center gap-5 relative z-10">
                                 <div className="relative">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} className="w-16 h-16 rounded-2xl bg-slate-50 border shadow-inner" alt="av" />
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                                 </div>
                                 <div>
                                    <p className="font-black text-slate-900 text-lg leading-tight">{u.firstName} {u.lastName}</p>
                                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${u.role === UserRole.ADMIN ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>{u.role}</span>
                                 </div>
                              </div>
                              <button
                                 onClick={() => startSimulation(u)}
                                 className="p-5 bg-slate-950 text-white rounded-2xl hover:bg-emerald-600 transition-all shadow-xl active:scale-95 flex items-center gap-4 group"
                              >
                                 <LogIn size={24} className="group-hover:translate-x-1 transition-transform" /> <span className="text-xs font-black">دخول الآن</span>
                              </button>
                              <div className="absolute top-0 left-0 w-2 h-full bg-slate-50 group-hover:bg-emerald-500 transition-all"></div>
                           </div>
                        ))}
                        {allUsers.filter(u => u.institutionId === activeSimulationInst).length === 0 && (
                           <p className="col-span-full p-20 text-center text-slate-300 font-black italic">لا يوجد مستخدمين مسجلين لهذه المؤسسة</p>
                        )}
                     </div>
                  )}
               </div>
            </div>
         </div>
      );
   }

   // واجهة متابعة الاشتراكات والدفعات (Subscriptions)
   if (mode === 'subscriptions') {
      return (
         <div className="space-y-12 animate-view">
            <div className="flex justify-between items-center bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-50 -ml-10 -mt-10 rounded-full"></div>
               <div className="relative z-10 text-right">
                  <h2 className="text-4xl font-black italic flex items-center gap-6 uppercase tracking-tighter">
                     <CreditCard size={48} className="text-indigo-600" /> SUBSCRIPTIONS LEDGER
                  </h2>
                  <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.3em] mt-3">إدارة الفواتير، الدفعات الجزئية، ومراقبة المديونيات</p>
               </div>
               <div className="flex gap-14 relative z-10">
                  <div className="text-center">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">إجمالي العقود</p>
                     <p className="text-4xl font-black text-slate-900 tabular-nums">{institutions.reduce((a, b) => a + b.pricing.totalAmount, 0).toLocaleString()} <span className="text-xl opacity-20">EGP</span></p>
                  </div>
                  <div className="text-center">
                     <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">المحصل الكلي</p>
                     <p className="text-4xl font-black text-emerald-600 tabular-nums">{institutions.reduce((a, b) => a + b.pricing.paidAmount, 0).toLocaleString()} <span className="text-xl opacity-20">EGP</span></p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 gap-10">
               {institutions.map(inst => {
                  const remaining = inst.pricing.totalAmount - inst.pricing.paidAmount;
                  const percent = (inst.pricing.paidAmount / inst.pricing.totalAmount) * 100;
                  return (
                     <div key={inst.id} className="glass-panel p-12 bg-white border border-slate-100 rounded-[4rem] shadow-sm flex flex-col lg:flex-row items-center gap-16 group hover:border-indigo-600 transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-2 h-full bg-slate-100 group-hover:bg-indigo-600 transition-all"></div>

                        <div className="flex items-center gap-8 flex-1 w-full lg:w-auto text-right">
                           <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center border-4 border-white shadow-xl group-hover:scale-105 transition-transform"><Building2 size={48} /></div>
                           <div>
                              <h3 className="text-3xl font-black text-slate-900">{inst.name}</h3>
                              <div className="flex items-center gap-4 mt-3">
                                 <p className="text-slate-400 font-bold flex items-center gap-2 uppercase tracking-widest text-[11px]"><Calendar size={16} /> التجديد: {inst.expiryDate}</p>
                                 <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${inst.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{inst.status === 'active' ? 'نشط' : 'متوقف'}</span>
                              </div>
                           </div>
                        </div>

                        <div className="grid grid-cols-3 gap-16 flex-1 w-full lg:w-auto text-center">
                           <div className="space-y-2">
                              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">قيمة العقد</p>
                              <p className="text-3xl font-black text-slate-900 tabular-nums">{inst.pricing.totalAmount.toLocaleString()}</p>
                           </div>
                           <div className="space-y-2">
                              <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">تم تحصيل</p>
                              <p className="text-3xl font-black text-emerald-600 tabular-nums">{inst.pricing.paidAmount.toLocaleString()}</p>
                           </div>
                           <div className="space-y-2">
                              <p className="text-[11px] font-black text-rose-600 uppercase tracking-widest">المتبقي</p>
                              <p className="text-3xl font-black text-rose-600 tabular-nums">{remaining.toLocaleString()}</p>
                           </div>
                        </div>

                        <div className="w-full lg:w-80 space-y-5">
                           <div className="flex justify-between text-[11px] font-black uppercase">
                              <span className="text-slate-400 tracking-widest">نسبة السداد</span>
                              <span className="text-indigo-600">{Math.round(percent)}%</span>
                           </div>
                           <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-50">
                              <div className="h-full bg-gradient-to-l from-indigo-600 to-indigo-400 transition-all duration-1000" style={{ width: `${percent}%` }}></div>
                           </div>
                           <div className="flex gap-3">
                              <button onClick={() => handleAddPayment(inst.id)} className="flex-1 py-5 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-indigo-600 active:scale-95 transition-all flex items-center justify-center gap-3">
                                 <DollarSign size={18} /> تحصيل دفعة
                              </button>
                              <button className="p-5 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-200 transition-all"><History size={20} /></button>
                           </div>
                        </div>
                     </div>
                  );
               })}
               {institutions.length === 0 && (
                  <div className="p-40 text-center text-slate-300 font-black italic text-2xl uppercase tracking-[0.5em] opacity-30">No Subscription Data Found</div>
               )}
            </div>
         </div>
      );
   }

   // واجهة إدارة الصلاحيات (Permissions)
   if (mode === 'permissions') {
      return <PermissionsManager />;
   }

   // واجهة الإعدادات العامة (System Settings)
   if (mode === 'system_settings') {
      return (
         <div className="space-y-12 animate-view pb-20 text-right">
            <div className="premium-dark-card p-14 text-white overflow-hidden relative border-none shadow-3xl">
               <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 blur-[120px] -mr-40 -mt-40 rounded-full"></div>
               <div className="relative z-10">
                  <h2 className="text-5xl font-black italic uppercase flex items-center gap-6">
                     <Settings size={48} className="text-indigo-400" /> SYSTEM SETTINGS
                  </h2>
                  <p className="text-slate-400 font-bold mt-4 text-xl">تخصيص بيانات النظام المركزية ومعلومات الدعم الفني.</p>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
               <div className="glass-panel p-12 bg-white rounded-[3.5rem] border border-slate-100 shadow-sm space-y-10">
                  <h3 className="text-2xl font-black text-slate-900 border-b pb-6 flex items-center gap-4"><Info size={32} className="text-indigo-600" /> معلومات الهوية</h3>
                  <div className="space-y-8">
                     <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">اسم المنظومة</label>
                        <input value={systemName} onChange={e => setSystemName(e.target.value)} className="input-primary text-xl font-black p-6" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">رابط الشعار (URL)</label>
                        <input value={systemLogo} onChange={e => setSystemLogo?.(e.target.value)} className="input-primary text-sm font-mono p-6" />
                     </div>
                  </div>
               </div>

               <div className="glass-panel p-12 bg-white rounded-[3.5rem] border border-slate-100 shadow-sm space-y-10">
                  <h3 className="text-2xl font-black text-slate-900 border-b pb-6 flex items-center gap-4"><MessageSquare size={32} className="text-emerald-600" /> قنوات الدعم الفني</h3>
                  <div className="space-y-8">
                     <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">بريد الدعم الفني</label>
                        <input value={systemContact.email} onChange={e => setSystemContact({ ...systemContact, email: e.target.value })} className="input-primary text-xl font-black p-6 text-left" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">رقم هاتف الدعم / واتساب</label>
                        <input value={systemContact.phone} onChange={e => setSystemContact({ ...systemContact, phone: e.target.value })} className="input-primary text-xl font-black p-6 text-left" />
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex justify-end pt-10">
               <button onClick={() => addNotification({ title: 'حفظ الإعدادات', content: 'تم حفظ كافة تغييرات النظام بنجاح.', type: 'success', date: new Date().toISOString() })} className="px-20 py-8 btn-primary rounded-[2.5rem] font-black text-2xl shadow-3xl flex items-center gap-4 group">
                  <Save size={32} className="group-hover:scale-110 transition-transform" /> حفظ كافة التغييرات
               </button>
            </div>
         </div>
      );
   }

   // الواجهة الرئيسية (Overview)
   return (
      <div className="space-y-12 animate-view pb-20">
         <div className="space-y-10">
            <div className="premium-dark-card p-16 text-white overflow-hidden relative border-none shadow-3xl">
               <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 blur-[180px] rounded-full -mr-60 -mt-60"></div>
               <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10 text-right">
                  <div className="w-full lg:w-auto">
                     <h1 className="text-7xl font-black tracking-tighter mb-6 uppercase italic">ALEAQRAB SaaS</h1>
                     <p className="text-slate-400 font-bold text-2xl max-w-2xl">التحكم المركزي الكامل في البيئات، الاشتراكات، والولوج الأمني للمنظومة.</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white/10 flex gap-20 shadow-3xl">
                     <div className="text-center">
                        <p className="text-[12px] font-black uppercase text-indigo-400 tracking-widest mb-3">إجمالي الإيرادات</p>
                        <p className="text-5xl font-black tabular-nums">{institutions.reduce((a, b) => a + b.pricing.paidAmount, 0).toLocaleString()} <span className="text-lg font-bold ml-1 opacity-40">EGP</span></p>
                     </div>
                     <div className="text-center">
                        <p className="text-[12px] font-black uppercase text-emerald-400 tracking-widest mb-3">البيئات المفعلة</p>
                        <p className="text-5xl font-black tabular-nums">{institutions.length}</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex justify-between items-center bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm">
               <div className="text-right">
                  <h2 className="text-4xl font-black tracking-tighter italic uppercase text-slate-900">Environments Console</h2>
                  <p className="text-slate-500 font-bold mt-2 text-lg">تخصيص الحصص التخزينية، وتفعيل ميزات الذكاء الاصطناعي لكل مؤسسة.</p>
               </div>
               <button onClick={() => { setEditingInst(null); setShowModal(true); }} className="btn-update-premium px-16 py-8 rounded-[2.5rem] font-black text-xl flex items-center gap-6 shadow-3xl hover:scale-105 active:scale-95 transition-all">
                  <Plus size={36} strokeWidth={3} /> تكوين بيئة تعليمية
               </button>
            </div>

            <div className="glass-panel p-1 rounded-[3rem] border-none shadow-xl overflow-hidden">
               <SmartAnalytic
                  role={UserRole.SUPER_ADMIN}
                  dataContext={`إجمالي الإيرادات ${institutions.reduce((a, b) => a + b.pricing.paidAmount, 0).toLocaleString()} من أصل ${institutions.reduce((a, b) => a + b.pricing.totalAmount, 0).toLocaleString()}. عدد البيئات النشطة ${institutions.filter(i => i.status === 'active').length}. معدل النمو إيجابي.`}
               />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
               {institutions.map(inst => (
                  <div key={inst.id} className="glass-panel p-12 bg-white group hover:border-indigo-600 transition-all rounded-[3.5rem] shadow-sm relative overflow-hidden text-right">
                     <div className="flex justify-between items-start mb-10">
                        <div className="flex items-center gap-8">
                           <div className="w-24 h-24 bg-slate-50 text-indigo-600 rounded-3xl flex items-center justify-center border-4 border-white group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xl">
                              {inst.type === ClientType.SCHOOL ? <School size={48} /> : <Building2 size={48} />}
                           </div>
                           <div>
                              <h3 className="text-3xl font-black text-slate-900">{inst.name}</h3>
                              <p className="text-indigo-600 font-black text-[12px] uppercase tracking-[0.2em] mt-2">@{inst.subdomain}.aleaqrab.com</p>
                           </div>
                        </div>
                        <button onClick={() => { setEditingInst(inst); setFormData(inst); setShowModal(true); }} className="p-5 bg-slate-100 text-slate-400 rounded-2xl hover:bg-slate-950 hover:text-white transition-all shadow-sm"><Settings size={24} /></button>
                     </div>
                     <div className="grid grid-cols-4 gap-6 mb-10">
                        <QuotaBox label="مديرين" val={inst.limits.admins} />
                        <QuotaBox label="معلمين" val={inst.limits.teachers} />
                        <QuotaBox label="محاسبين" val={inst.limits.accountants} />
                        <QuotaBox label="طلاب" val={inst.limits.students} highlight />
                     </div>
                     <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                        <div className="flex items-center gap-3">
                           <div className={`w-3 h-3 rounded-full ${inst.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                           <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{inst.status} system</span>
                        </div>
                        {/* Fixed onNavigate call by adding it to component props */}
                        <button onClick={() => { setActiveSimulationInst(inst.id); onNavigate('simulation'); }} className="px-6 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-black text-[10px] uppercase hover:bg-indigo-600 hover:text-white transition-all">Support Users</button>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* مودال تكوين بيئة جديدة (Pricing & Provisioning) */}
         {showModal && (
            <div className="fixed inset-0 z-[1000] premium-modal-backdrop flex items-center justify-center p-6">
               <div className="premium-modal-content w-full max-w-7xl animate-view flex flex-col max-h-[95vh]">
                  <div className="premium-modal-header flex justify-between items-center">
                     <div className="flex items-center gap-8">
                        <div className="p-6 bg-indigo-600 text-white rounded-[2rem] shadow-2xl"><Globe size={40} /></div>
                        <h3 className="text-5xl font-black tracking-tighter italic uppercase">{editingInst ? 'تحديث البيئة' : 'نشر بيئة جديدة'}</h3>
                     </div>
                     <button onClick={() => setShowModal(false)} className="p-5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-[2rem] transition-all"><X size={48} /></button>
                  </div>

                  <div className="flex-1 overflow-y-auto py-12 px-6 space-y-16 no-scrollbar">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 text-right">
                        {/* الأساسيات والحدود */}
                        <div className="space-y-12">
                           <div className="space-y-8">
                              <h4 className="text-sm font-black text-indigo-600 uppercase tracking-[0.3em] flex items-center gap-4 border-r-4 border-indigo-600 pr-4">1. المؤسسة والمدير</h4>
                              <div className="space-y-8">
                                 <div className="space-y-2"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">اسم الجهة التعليمية</label><input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-3xl font-black text-xl outline-none transition-all shadow-inner" placeholder="مثال: أكاديمية النخبة" /></div>
                                 <div className="space-y-2"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">النطاق الفرعي (SUBDOMAIN)</label><div className="relative"><input value={formData.subdomain} onChange={e => setFormData({ ...formData, subdomain: e.target.value })} className="w-full p-6 pr-8 pl-48 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-3xl font-black text-xl outline-none text-left font-mono" placeholder="elite-branch" /><span className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 font-bold font-mono text-lg">.aleaqrab.com</span></div></div>
                              </div>
                              {!editingInst && (
                                 <div className="grid grid-cols-2 gap-6 pt-6">
                                    <div className="space-y-2"><label className="text-[11px] font-black text-slate-400">يوزر المدير</label><input onChange={e => setFormData({ ...formData, adminData: { ...formData.adminData, username: e.target.value } })} className="w-full p-5 bg-indigo-50/50 rounded-2xl font-black border-none" /></div>
                                    <div className="space-y-2"><label className="text-[11px] font-black text-slate-400">كلمة المرور</label><input type="password" onChange={e => setFormData({ ...formData, adminData: { ...formData.adminData, password: e.target.value } })} className="w-full p-5 bg-indigo-50/50 rounded-2xl font-black border-none" /></div>
                                 </div>
                              )}
                           </div>

                           <div className="space-y-8">
                              <h4 className="text-sm font-black text-emerald-600 uppercase tracking-[0.3em] flex items-center gap-4 border-r-4 border-emerald-600 pr-4">2. تخصيص الموارد والحدود القصوى</h4>
                              <div className="grid grid-cols-2 gap-8 bg-slate-50 p-12 rounded-[4rem] shadow-inner">
                                 <QuotaInput label="عدد المديرين" val={formData.limits.admins} onChange={v => setFormData({ ...formData, limits: { ...formData.limits, admins: v } })} />
                                 <QuotaInput label="عدد المعلمين" val={formData.limits.teachers} onChange={v => setFormData({ ...formData, limits: { ...formData.limits, teachers: v } })} />
                                 <QuotaInput label="عدد المحاسبين" val={formData.limits.accountants} onChange={v => setFormData({ ...formData, limits: { ...formData.limits, accountants: v } })} />
                                 <QuotaInput label="عدد الطلاب المسموح" val={formData.limits.students} highlight onChange={v => setFormData({ ...formData, limits: { ...formData.limits, students: v } })} />
                              </div>
                           </div>
                        </div>

                        {/* الصلاحيات والتسعير */}
                        <div className="space-y-12">
                           <div className="space-y-8">
                              <h4 className="text-sm font-black text-amber-600 uppercase tracking-[0.3em] flex items-center gap-4 border-r-4 border-amber-600 pr-4">3. تمكين الوحدات والصلاحيات (Permissions)</h4>
                              <div className="grid grid-cols-1 gap-4">
                                 <PermissionItem label="الذكاء الاصطناعي التوليدي (Gemini Integration)" active={formData.permissions.allowAiUsage} onClick={() => setFormData({ ...formData, permissions: { ...formData.permissions, allowAiUsage: !formData.permissions.allowAiUsage } })} icon={<BrainCircuit size={24} />} />
                                 <PermissionItem label="البث المباشر والحصص التفاعلية" active={formData.permissions.allowLiveStreaming} onClick={() => setFormData({ ...formData, permissions: { ...formData.permissions, allowLiveStreaming: !formData.permissions.allowLiveStreaming } })} icon={<MonitorPlay size={24} />} />
                                 <PermissionItem label="النظام المالي المحاسبي المطور" active={formData.permissions.allowFinancialLedger} onClick={() => setFormData({ ...formData, permissions: { ...formData.permissions, allowFinancialLedger: !formData.permissions.allowFinancialLedger } })} icon={<Wallet size={24} />} />
                                 <PermissionItem label="هوية بصرية مخصصة (White Labeling)" active={formData.permissions.allowCustomBranding} onClick={() => setFormData({ ...formData, permissions: { ...formData.permissions, allowCustomBranding: !formData.permissions.allowCustomBranding } })} icon={<Palette size={24} />} />
                              </div>
                           </div>

                           <div className="premium-dark-card p-12 space-y-10 relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 blur-[80px]"></div>
                              <h4 className="text-sm font-black text-indigo-400 uppercase tracking-[0.3em] flex items-center gap-4 border-r-4 border-indigo-500 pr-4">4. نموذج التسعير والفوترة</h4>
                              <div className="space-y-8">
                                 <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-2">نوع الاشتراك</label>
                                    <div className="grid grid-cols-3 gap-3">
                                       {[
                                          { id: PricingModel.MONTHLY, label: 'شهري' },
                                          { id: PricingModel.YEARLY, label: 'سنوي' },
                                          { id: PricingModel.PER_STUDENT, label: 'لكل طالب' }
                                       ].map(m => (
                                          <button key={m.id} onClick={() => setFormData({ ...formData, pricing: { ...formData.pricing, model: m.id } })} className={`py-5 rounded-2xl font-black text-sm border-2 transition-all ${formData.pricing.model === m.id ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}>{m.label}</button>
                                       ))}
                                    </div>
                                 </div>

                                 <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                       <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-2">قيمة الاشتراك / سعر الطالب</label>
                                       <input type="number" value={formData.pricing.rate} onChange={e => setFormData({ ...formData, pricing: { ...formData.pricing, rate: Number(e.target.value) } })} className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl font-black text-white text-2xl tabular-nums outline-none focus:border-indigo-500" />
                                    </div>
                                    <div className="space-y-3">
                                       <label className="text-[11px] font-black text-emerald-500 uppercase tracking-widest px-2">الدفعة المقدمة (Deposit)</label>
                                       <input type="number" value={formData.pricing.paidAmount} onChange={e => setFormData({ ...formData, pricing: { ...formData.pricing, paidAmount: Number(e.target.value) } })} className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl font-black text-white text-2xl tabular-nums outline-none focus:border-indigo-500" />
                                    </div>
                                 </div>

                                 <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-between">
                                    <div><p className="text-[10px] font-black uppercase text-slate-500 mb-1">إجمالي قيمة العقد (Auto-calculated)</p><p className="text-4xl font-black text-white tabular-nums">{calculatedTotal.toLocaleString()} <span className="text-lg opacity-40">EGP</span></p></div>
                                    <div className="p-4 bg-indigo-500/20 text-indigo-400 rounded-2xl"><Calculator size={32} /></div>
                                 </div>

                                 <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-2">تاريخ انتهاء الخدمة (التجديد القادم)</label>
                                    <input type="date" value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl font-black text-white outline-none focus:border-indigo-500" />
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="pt-12 border-t flex gap-6">
                     <button onClick={() => setShowModal(false)} className="px-12 py-8 bg-slate-100 text-slate-400 rounded-[2.5rem] font-black text-xl hover:bg-slate-200 transition-all">إلغاء</button>
                     <button onClick={handleSaveInstitution} className="btn-update-premium flex-1 py-8 rounded-[2.5rem] font-black text-3xl flex items-center justify-center gap-8 shadow-3xl active:scale-[0.98] transition-all">
                        <Save size={40} strokeWidth={3} /> {editingInst ? 'حفظ ونشر التحديثات' : 'تفعيل ونشر البيئة'}
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};



export default SuperAdminView;
