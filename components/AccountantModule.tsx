
import * as React from 'react';
import { useState, useMemo } from 'react';
import {
   Layers, ChevronRight, ChevronDown, Plus, Trash2, Edit3, Save,
   Search, Printer, Download, X, PlusCircle, CheckCircle, Wallet,
   Landmark, Activity, History, ArrowRightLeft, User, CreditCard, Coins,
   AlertCircle, FileText, Filter, TrendingUp, Building, GraduationCap, Package,
   ArrowUpRight, ArrowDownRight, Paperclip, FileCheck, Users, Briefcase, PlusSquare,
   Truck, Inbox, FileSpreadsheet, Info, ChevronLeft, ChevronRight as ChevronRightIcon,
   ChevronsLeft, ChevronsRight, UserCircle, Phone, Mail, MapPin, Key, Lock, UserPlus,
   Settings2, PlusCircle as PlusIcon
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { FinancialCategory, FinancialFund, Liability, UserRole, User as SystemUser, FinancialEntry, VoucherLine, Supplier } from '../types';
import FinanceModule from './FinanceModule';
import InventoryModule from './InventoryModule';
import ReportsModule from './ReportsModule';
import PayrollModule from './PayrollModule';
import StudentFinancialProfile from './StudentFinancialProfile';
import FinanceSettings from './modules/FinanceSettings';

interface AccountantModuleProps {
   mode: string;
   onNavigate: (t: string) => void;
}

const AccountantModule: React.FC<AccountantModuleProps> = ({ mode, onNavigate }) => {
   const {
      financialCategories, financialEntries, addFinancialCategory, updateFinancialCategory, deleteFinancialCategory,
      allUsers, lang, addFinancialEntry, addNotification, funds, addFinancialFund,
      inventoryItems, updateStudentSubscription, suppliers, addSupplier,
      addEmployeeRecord, updateUser, user: currentUser
   } = useAppContext();

   const [showModal, setShowModal] = useState<'add_cat' | 'edit_cat' | 'voucher' | 'fund' | 'transfer' | 'student_edit' | 'employee_add' | 'employee_edit' | 'supplier_add' | 'liquidity_transfer' | 'finance_config' | null>(null);
   const [selectedStudent, setSelectedStudent] = useState<SystemUser | null>(null);
   const [selectedCategory, setSelectedCategory] = useState<FinancialCategory | null>(null);
   const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
   const [formData, setFormData] = useState<any>({ name: '', phone: '', email: '', address: '', amount: 0, date: '', firstName: '', lastName: '', username: '', password: '', jobTitle: '', salary: 3000, createLogin: true });

   const isRtl = lang === 'ar';

   const handleAddEmployee = () => {
      if (!formData.firstName || !formData.lastName) return alert("يرجى إدخال اسم الموظف");
      addEmployeeRecord({
         id: `emp-${Date.now()}`,
         code: '',
         firstName: formData.firstName,
         lastName: formData.lastName,
         username: formData.username || `emp_${Date.now()}`,
         role: formData.jobTitle.includes('محاسب') ? UserRole.ACCOUNTANT : UserRole.ADMIN,
         institutionId: currentUser?.institutionId || 'inst-1',
         phone: formData.phone,
         email: formData.email,
         salary: formData.salary,
         jobTitle: formData.jobTitle,
         aiQuestionsCount: 50
      }, formData.createLogin);
      addNotification({ title: 'إضافة موظف', content: `تم تسجيل الموظف ${formData.firstName} في النظام المالي`, type: 'success', date: new Date().toISOString() });
      setShowModal(null);
   };

   const handleUpdateEmployee = () => {
      if (!selectedUser) return;
      updateUser({
         ...selectedUser,
         firstName: formData.firstName,
         lastName: formData.lastName,
         jobTitle: formData.jobTitle,
         salary: formData.salary,
         username: formData.username,
         phone: formData.phone
      });
      addNotification({ title: 'تحديث بيانات', content: 'تم تحديث بيانات الموظف بنجاح', type: 'success', date: new Date().toISOString() });
      setShowModal(null);
   };

   const handleAddSupplier = () => {
      if (!formData.name || !formData.phone) return alert("يرجى إدخال اسم المورد وهاتفه");
      addSupplier({
         id: `sup-${Date.now()}`,
         code: '',
         name: formData.name,
         phone: formData.phone,
         email: formData.email,
         address: formData.address,
         balance: 0,
         institutionId: currentUser?.institutionId || ''
      });
      addNotification({ title: 'مورد جديد', content: `تم تسجيل المورد ${formData.name} بنجاح`, type: 'success', date: new Date().toISOString() });
      setShowModal(null);
   };

   const handleAddNewFinanceItem = (name: string, type: 'income' | 'expense') => {
      if (!name) return;
      const parentId = type === 'income' ? '4' : '5';
      const parent = financialCategories.find(c => c.id === parentId);

      // Fallback in case parent categories (4 or 5) are missing from initial state
      const parentCode = parent ? parent.code : (type === 'income' ? '4' : '5');
      const siblings = financialCategories.filter(c => c.parentId === parentId);

      // Find the max code to ensure uniqueness more reliably than length
      // Assuming format is ParentCodeXX
      let nextNum = siblings.length + 1;
      let code = `${parentCode}${nextNum.toString().padStart(2, '0')}`;

      // Simple collision check (optional but good)
      while (financialCategories.some(c => c.code === code)) {
         nextNum++;
         code = `${parentCode}${nextNum.toString().padStart(2, '0')}`;
      }

      addFinancialCategory({
         id: `cat-${Date.now()}`,
         name,
         code,
         type: type === 'income' ? 'income' : 'expense',
         parentId,
         level: 2, // Assuming direct children of root 4 or 5
         isDynamic: true,
         institutionId: currentUser?.institutionId || ''
      });
      addNotification({ title: 'تحديث الشجرة', content: `تم إدراج ${name} ضمن ${type === 'income' ? 'الإيرادات' : 'المصروفات'}`, type: 'success', date: new Date().toISOString() });
   };

   const handleUpdateCategory = () => {
      if (!selectedCategory) return;
      updateFinancialCategory({ ...selectedCategory, name: formData.name, code: formData.code });
      addNotification({ title: 'تحديث الحساب', content: 'تم حفظ تعديلات الحساب بنجاح', type: 'success', date: new Date().toISOString() });
      setShowModal(null);
   };

   const handleLiquidityTransfer = () => {
      if (!formData.fromId || !formData.toId || !formData.amount) return alert("يرجى إكمال بيانات التحويل");
      if (formData.fromId === formData.toId) return alert("لا يمكن التحويل لنفس الحساب");

      const entry: FinancialEntry = {
         id: `TRF-${Date.now()}`,
         date: new Date().toISOString().split('T')[0],
         description: `مناقلة مالية: ${formData.note || 'تحويل داخلي'}`,
         amount: parseFloat(formData.amount),
         debitAccount: formData.toId,
         creditAccount: formData.fromId,
         refType: 'transfer',
         institutionId: currentUser?.institutionId || ''
      };

      addFinancialEntry(entry);
      addNotification({ title: 'مناقلة مالية', content: `تم تحويل مبلغ ${formData.amount} بنجاح`, type: 'success', date: entry.date });
      setShowModal(null);
   };

   const renderTree = (parentId?: string) => {
      const nodes = financialCategories.filter(c => c.parentId === parentId || (!parentId && !c.parentId));
      return (
         <div className={`${parentId ? (isRtl ? 'mr-6 border-r-2 pr-6' : 'ml-6 border-l-2 pl-6') : ''} border-slate-100 space-y-2 mt-2 text-right`}>
            {nodes.sort((a, b) => a.code.localeCompare(b.code)).map(node => (
               <div key={node.id}>
                  <div className={`group flex items-center justify-between p-4 rounded-2xl border transition-all ${node.level === 1 ? 'bg-indigo-50 border-indigo-100' : node.isDynamic ? 'bg-amber-50/30 border-amber-100' : 'bg-white border-slate-50 hover:border-indigo-400 shadow-xs'}`}>
                     <div className="flex items-center gap-4 flex-1 justify-end">
                        <span className="font-mono text-[9px] font-black text-slate-400 uppercase tracking-widest">{node.code}</span>
                        <span className="font-black text-sm text-slate-900 leading-tight">{node.name}</span>
                     </div>
                     <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => { setSelectedCategory(node); setFormData({ name: node.name, code: node.code }); setShowModal('edit_cat'); }} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Edit3 size={14} /></button>
                        <button onClick={() => deleteFinancialCategory(node.id)} className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Trash2 size={14} /></button>
                        <button onClick={() => { setFormData({ parentId: node.id, level: node.level + 1, type: node.type }); setShowModal('add_cat'); }} className="p-2 bg-slate-900 text-white rounded-lg"><Plus size={14} /></button>
                     </div>
                  </div>
                  {renderTree(node.id)}
               </div>
            ))}
         </div>
      );
   };

   const FinanceConfigPage = () => (
      <div className="space-y-10 animate-view">
         <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border shadow-sm">
            <div className="flex items-center gap-6"><div className="p-5 bg-indigo-50 text-indigo-700 rounded-3xl"><Settings2 size={32} /></div><div><h2 className="text-3xl font-black">إعدادات البنود المالية</h2><p className="text-slate-500 font-bold">تعريف بنود المصروفات والإيرادات التي تظهر في السندات.</p></div></div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="glass-panel p-10 bg-white rounded-[3rem] border-t-8 border-rose-500 shadow-sm space-y-8">
               <h3 className="text-xl font-black flex items-center gap-3"><ArrowUpRight className="text-rose-600" /> بنود المصروفات التشغيلية</h3>
               <div className="flex gap-2">
                  <input id="exp-input" className="flex-1 p-4 bg-slate-50 rounded-xl font-bold text-sm outline-none border-2 border-transparent focus:border-rose-500" placeholder="مثال: فاتورة كهرباء، صيانة..." />
                  <button onClick={() => {
                     const el = document.getElementById('exp-input') as HTMLInputElement;
                     handleAddNewFinanceItem(el.value, 'expense');
                     el.value = '';
                  }} className="p-4 bg-rose-600 text-white rounded-xl shadow-lg"><Plus /></button>
               </div>
               <div className="space-y-2 max-h-[400px] overflow-y-auto no-scrollbar">
                  {financialCategories.filter(c => c.parentId === '5' || c.type === 'expense').map(c => (
                     <div key={c.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-rose-200 transition-all">
                        <span className="font-black text-slate-800">{c.name}</span>
                        <span className="text-[10px] font-mono font-black text-rose-400 bg-white px-2 py-1 rounded-lg">{c.code}</span>
                     </div>
                  ))}
               </div>
            </div>
            <div className="glass-panel p-10 bg-white rounded-[3rem] border-t-8 border-emerald-500 shadow-sm space-y-8">
               <h3 className="text-xl font-black flex items-center gap-3"><ArrowDownRight className="text-emerald-600" /> بنود الإيرادات والتحصيلات</h3>
               <div className="flex gap-2">
                  <input id="inc-input" className="flex-1 p-4 bg-slate-50 rounded-xl font-bold text-sm outline-none border-2 border-transparent focus:border-emerald-500" placeholder="مثال: بيع كتب، تصفية عهدة..." />
                  <button onClick={() => {
                     const el = document.getElementById('inc-input') as HTMLInputElement;
                     handleAddNewFinanceItem(el.value, 'income');
                     el.value = '';
                  }} className="p-4 bg-emerald-600 text-white rounded-xl shadow-lg"><Plus /></button>
               </div>
               <div className="space-y-2 max-h-[400px] overflow-y-auto no-scrollbar">
                  {financialCategories.filter(c => c.parentId === '4' || c.type === 'income').map(c => (
                     <div key={c.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-emerald-200 transition-all">
                        <span className="font-black text-slate-800">{c.name}</span>
                        <span className="text-[10px] font-mono font-black text-emerald-400 bg-white px-2 py-1 rounded-lg">{c.code}</span>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );

   const getContent = () => {
      switch (mode) {
         case 'acc_coa':
            return (
               <div className="space-y-10 animate-view">
                  <div className="flex justify-between items-center bg-white p-10 rounded-[3rem] border shadow-sm">
                     <div className="flex items-center gap-6"><div className="p-5 bg-indigo-50 text-indigo-700 rounded-[1.75rem] border border-indigo-100 shadow-inner"><Layers size={40} /></div><div><h2 className="text-3xl font-black">دليل الحسابات الهرمي (COA)</h2><p className="text-slate-500 font-bold">بناء هيكلية هرمية متكاملة بترميز لوني وتكويد آلي دقيق.</p></div></div>
                     <div className="flex gap-3">
                        <button onClick={() => onNavigate('acc_finance_settings')} className="px-8 py-5 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-xs flex items-center gap-3 hover:bg-slate-50 transition-all"><Settings2 size={18} /> تكوين البنود</button>
                        <button onClick={() => { setFormData({ level: 1, type: 'asset' }); setShowModal('add_cat'); }} className="px-10 py-5 bg-slate-950 text-white rounded-2xl font-black text-xs flex items-center gap-3 shadow-xl">حساب رئيسي جديد</button>
                     </div>
                  </div>
                  <div className="glass-panel p-12 bg-white max-w-6xl mx-auto rounded-[3.5rem] shadow-2xl border-none text-right">{renderTree()}</div>
               </div>
            );
         case 'acc_finance_settings': return <FinanceSettings />;
         case 'acc_vouchers': return <FinanceModule initialMode="entry" />;
         case 'acc_suppliers': return (
            <div className="space-y-10 animate-view text-right">
               <div className="flex justify-between items-center bg-white p-10 rounded-[3rem] border shadow-sm">
                  <div className="flex items-center gap-6"><div className="p-5 bg-orange-50 text-orange-600 rounded-[1.75rem] shadow-inner"><Truck size={40} /></div><div><h2 className="text-3xl font-black">إدارة الموردين والمدفوعات</h2><p className="text-slate-500 font-bold">تسجيل الموردين، متابعة مديونياتهم، وتوثيق عمليات التوريد.</p></div></div>
                  <button onClick={() => { setFormData({ name: '', phone: '', email: '', address: '' }); setShowModal('supplier_add'); }} className="px-10 py-5 bg-slate-950 text-white rounded-2xl font-black text-xs flex items-center gap-3">مورد جديد</button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {suppliers.map(s => (
                     <div key={s.id} className="glass-panel p-10 bg-white border border-slate-100 rounded-[3rem] group hover:border-orange-500 transition-all shadow-sm">
                        <div className="flex justify-between items-start mb-8"><div className="p-5 bg-slate-50 rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-all shadow-inner"><Truck size={32} /></div><code className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.code}</code></div>
                        <h3 className="text-2xl font-black text-slate-900 mb-4">{s.name}</h3>
                        <div className="space-y-3 mb-10"><p className="text-xs text-slate-500 flex items-center gap-2 font-bold justify-end"> {s.phone} <Phone size={14} /></p><p className="text-xs text-slate-500 flex items-center gap-2 font-bold justify-end"> {s.address || 'العنوان غير محدد'} <MapPin size={14} /></p></div>
                        <div className="pt-6 border-t border-slate-50 flex items-center justify-between"><div className="text-right"><p className="text-[10px] font-black text-slate-400 uppercase mb-1">الرصيد المستحق</p><p className="text-2xl font-black text-rose-600 tabular-nums">{s.balance.toLocaleString()} <span className="text-xs">ج.م</span></p></div><button className="px-6 py-3 bg-slate-950 text-white rounded-xl font-black text-[10px] hover:bg-orange-600 transition-all shadow-lg">كشف حساب</button></div>
                     </div>
                  ))}
               </div>
            </div>
         );
         case 'acc_inventory': return <InventoryModule />;
         case 'acc_reports': return <ReportsModule />;
         case 'acc_liquidity': return <div className="space-y-12 animate-view text-right">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               <div className="glass-panel p-10 bg-white rounded-[2.5rem] border shadow-sm flex flex-col gap-6 group hover:border-indigo-600 transition-all">
                  <div className="flex justify-between items-start">
                     <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">سيولة آمنة</span>
                     <div className="p-5 bg-indigo-50 text-indigo-700 rounded-3xl shadow-inner group-hover:scale-110 transition-transform"><Wallet size={36} /></div>
                  </div>
                  <div><p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">إجمالي النقدية</p><h4 className="text-5xl font-black text-slate-900 tabular-nums">{funds.reduce((a, b) => a + b.balance, 0).toLocaleString()} <span className="text-xl">ج.م</span></h4></div>
                  <button onClick={() => setShowModal('liquidity_transfer')} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"><ArrowRightLeft size={16} /> تحويل بين الحسابات</button>
               </div>
               {funds.map(f => (
                  <div key={f.id} className="glass-panel p-10 bg-white rounded-[2.5rem] border shadow-sm flex flex-col gap-6 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 -mr-12 -mt-12 rounded-full opacity-50 group-hover:scale-150 transition-transform"></div>
                     <div className="p-5 bg-slate-50 text-slate-900 rounded-3xl shadow-inner w-fit relative z-10 ms-auto">{f.type === 'cash' ? <Coins size={36} /> : <Landmark size={36} />}</div>
                     <div className="relative z-10"><p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{f.name}</p><h4 className="text-4xl font-black text-slate-900 tabular-nums">{f.balance.toLocaleString()}</h4><p className="text-[10px] text-indigo-600 font-bold mt-2 font-mono uppercase">Acc: {f.accountCode}</p></div>
                  </div>
               ))}
            </div>
            <div className="glass-panel p-10 bg-white rounded-[3rem] border shadow-sm">
               <h3 className="text-xl font-black mb-8 flex items-center gap-4 text-slate-900 justify-end"> آخر عمليات المناقلة المالية <History className="text-indigo-600" /></h3>
               <div className="space-y-4">
                  {financialEntries.filter(e => e.refType === 'transfer').map(e => (
                     <div key={e.id} className="p-6 bg-slate-50/50 rounded-2xl border-2 border-transparent hover:border-indigo-100 transition-all flex items-center justify-between">
                        <p className="text-2xl font-black text-slate-900 tabular-nums">{e.amount.toLocaleString()} <span className="text-xs">ج.م</span></p>
                        <div className="flex items-center gap-5">
                           <div className="text-right"><p className="font-black text-slate-900">{e.description}</p><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{e.date}</p></div>
                           <div className="p-4 bg-white rounded-xl shadow-sm text-indigo-600"><ArrowRightLeft size={24} /></div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>;
         case 'acc_payroll': return <PayrollModule />;
         case 'acc_entries_list': return <FinanceModule initialMode="list" />;
         case 'acc_journal': return <FinanceModule initialMode="entry" />;
         case 'acc_employees':
            return (
               <div className="space-y-10 animate-view text-right">
                  <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border shadow-sm">
                     <div className="flex items-center gap-6"><div className="p-5 bg-blue-50 text-blue-600 rounded-3xl"><Users size={32} /></div><div><h2 className="text-3xl font-black">إدارة كادر الموظفين والعهدة</h2><p className="text-slate-500 font-bold">المراجعة المالية لبيانات الموظفين، الرواتب، والذمم المدينة.</p></div></div>
                     <button onClick={() => {
                        setFormData({ firstName: '', lastName: '', jobTitle: '', salary: 3000, username: '', createLogin: true, phone: '', email: '' });
                        setShowModal('employee_add');
                     }} className="px-8 py-4 bg-slate-950 text-white rounded-2xl font-black text-xs flex items-center gap-3 shadow-xl"><UserPlus size={18} /> إضافة موظف</button>
                  </div>
                  <div className="glass-panel overflow-hidden bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
                     <table className="w-full text-right">
                        <thead><tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b"><th className="p-6">الموظف</th><th className="p-6">الوظيفة</th><th className="p-6 text-center">الراتب الأساسي</th><th className="p-6 text-center">العهدة (الذمم)</th><th className="p-6 text-center">إجراء</th></tr></thead>
                        <tbody className="divide-y font-bold text-sm">
                           {allUsers.filter(u => u.role !== UserRole.STUDENT && u.role !== UserRole.SUPER_ADMIN).map(u => (
                              <tr key={u.id} className="hover:bg-slate-50 transition-all"><td className="p-6 flex items-center gap-4 justify-end"><span className="font-black">{u.firstName} {u.lastName}</span><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} className="w-10 h-10 rounded-xl bg-slate-100 border shadow-sm" /></td><td className="p-6 text-slate-500">{u.jobTitle || 'عضو كادر'}</td><td className="p-6 text-center tabular-nums font-black text-indigo-700">{u.salary?.toLocaleString() || 3000} ج.م</td><td className="p-6 text-center font-black text-rose-600 tabular-nums">0.00 ج.م</td><td className="p-6 text-center"><button onClick={() => {
                                 setSelectedUser(u);
                                 setFormData({ firstName: u.firstName, lastName: u.lastName, jobTitle: u.jobTitle, salary: u.salary || 3000, username: u.username, phone: u.phone, email: u.email });
                                 setShowModal('employee_edit');
                              }} className="p-3 bg-slate-50 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"><Edit3 size={16} /></button></td></tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            );
         case 'acc_clients':
            return <StudentFinancialProfile />;
         default: return <div className="p-20 text-center font-black text-slate-300 italic">جاري تحميل المحرك المالي...</div>;
      }
   };

   return (
      <div className="relative pb-24">
         {getContent()}

         {showModal === 'edit_cat' && selectedCategory && (
            <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6">
               <div className="glass-panel w-full max-w-lg bg-white p-12 rounded-[3.5rem] shadow-3xl space-y-8 animate-view text-right">
                  <div className="flex justify-between items-center border-b pb-6"><h3 className="text-2xl font-black">تعديل بيانات الحساب</h3><button onClick={() => setShowModal(null)}><X size={32} /></button></div>
                  <div className="space-y-6">
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">اسم الحساب</label><input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold" /></div>
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">كود الحساب</label><input value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-mono" /></div>
                     <button onClick={handleUpdateCategory} className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black text-xl">حفظ التغييرات</button>
                  </div>
               </div>
            </div>
         )}

         {showModal === 'supplier_add' && (
            <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6">
               <div className="glass-panel w-full max-w-lg bg-white p-12 rounded-[3.5rem] shadow-3xl space-y-8 animate-view text-right">
                  <div className="flex justify-between items-center border-b pb-6"><h3 className="text-2xl font-black">تسجيل مورد جديد</h3><button onClick={() => setShowModal(null)}><X size={32} /></button></div>
                  <div className="space-y-6">
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">اسم المورد / الشركة</label><input onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold" /></div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">رقم الهاتف</label><input onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold" /></div>
                        <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">البريد (اختياري)</label><input onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold" /></div>
                     </div>
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">العنوان الفعلي</label><input onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold" /></div>
                     <button onClick={handleAddSupplier} className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-orange-600 transition-all">اعتماد المورد في النظام</button>
                  </div>
               </div>
            </div>
         )}

         {showModal === 'employee_add' && (
            <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6">
               <div className="glass-panel w-full max-w-lg bg-white p-12 rounded-[3.5rem] shadow-3xl space-y-8 animate-view text-right">
                  <div className="flex justify-between items-center border-b pb-6"><h3 className="text-2xl font-black">تكويد موظف جديد</h3><button onClick={() => setShowModal(null)}><X size={32} /></button></div>
                  <div className="space-y-6">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">الاسم الأول</label><input onChange={e => setFormData({ ...formData, firstName: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold" /></div>
                        <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">اللقب</label><input onChange={e => setFormData({ ...formData, lastName: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold" /></div>
                     </div>
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">المسمى الوظيفي</label><input onChange={e => setFormData({ ...formData, jobTitle: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold" placeholder="محاسب، فني، سكرتير..." /></div>
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">الراتب الأساسي</label><input type="number" onChange={e => setFormData({ ...formData, salary: parseFloat(e.target.value) })} className="w-full p-4 bg-slate-50 rounded-xl font-black text-xl tabular-nums" /></div>
                     <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl">
                           <input type="checkbox" checked={formData.createLogin} onChange={e => setFormData({ ...formData, createLogin: e.target.checked })} className="w-5 h-5 rounded-lg" />
                           <div className="flex items-center gap-3"><span className="text-xs font-bold">إنشاء حساب دخول</span><Lock size={16} className="text-indigo-600" /></div>
                        </div>
                        {formData.createLogin && (
                           <div className="grid grid-cols-2 gap-4 animate-view">
                              <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase tracking-widest">يوزر الدخول</label><input onChange={e => setFormData({ ...formData, username: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-mono text-xs" /></div>
                              <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase tracking-widest">كلمة السر</label><input type="password" onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold" /></div>
                           </div>
                        )}
                     </div>
                     <button onClick={handleAddEmployee} className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-indigo-600 transition-all">اعتماد الموظف مالياً</button>
                  </div>
               </div>
            </div>
         )}

         {showModal === 'employee_edit' && selectedUser && (
            <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6">
               <div className="glass-panel w-full max-w-lg bg-white p-12 rounded-[3.5rem] shadow-3xl space-y-8 animate-view text-right">
                  <div className="flex justify-between items-center border-b pb-6"><h3 className="text-2xl font-black">تعديل بيانات {selectedUser.firstName}</h3><button onClick={() => setShowModal(null)}><X size={32} /></button></div>
                  <div className="space-y-6">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">الاسم الأول</label><input value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold" /></div>
                        <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">اللقب</label><input value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold" /></div>
                     </div>
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">المسمى الوظيفي</label><input value={formData.jobTitle} onChange={e => setFormData({ ...formData, jobTitle: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold" /></div>
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">الراتب الأساسي</label><input type="number" value={formData.salary} onChange={e => setFormData({ ...formData, salary: parseFloat(e.target.value) })} className="w-full p-4 bg-slate-50 rounded-xl font-black text-xl tabular-nums" /></div>
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">اسم المستخدم</label><input value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-mono" /></div>
                     <button onClick={handleUpdateEmployee} className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-emerald-600 transition-all">حفظ التعديلات</button>
                  </div>
               </div>
            </div>
         )}

         {showModal === 'employee_edit' && selectedUser && (
            <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6">
               <div className="glass-panel w-full max-w-lg bg-white p-12 rounded-[3.5rem] shadow-3xl space-y-8 animate-view text-right">
                  <div className="flex justify-between items-center border-b pb-6"><h3 className="text-2xl font-black">تعديل بيانات {selectedUser.firstName}</h3><button onClick={() => setShowModal(null)}><X size={32} /></button></div>
                  <div className="space-y-6">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">الاسم الأول</label><input value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold" /></div>
                        <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">اللقب</label><input value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold" /></div>
                     </div>
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">المسمى الوظيفي</label><input value={formData.jobTitle} onChange={e => setFormData({ ...formData, jobTitle: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold" /></div>
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">الراتب الأساسي</label><input type="number" value={formData.salary} onChange={e => setFormData({ ...formData, salary: parseFloat(e.target.value) })} className="w-full p-4 bg-slate-50 rounded-xl font-black text-xl tabular-nums" /></div>
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">اسم المستخدم</label><input value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-mono" /></div>
                     <button onClick={handleUpdateEmployee} className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-emerald-600 transition-all">حفظ التعديلات</button>
                  </div>
               </div>
            </div>
         )}

         {showModal === 'liquidity_transfer' && (
            <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6">
               <div className="glass-panel w-full max-w-lg bg-white p-12 rounded-[3.5rem] shadow-3xl space-y-10 animate-view text-right">
                  <div className="flex justify-between items-center border-b pb-6"><h3 className="text-2xl font-black">مناقلة سيولة مالية</h3><button onClick={() => setShowModal(null)}><X size={32} /></button></div>
                  <div className="space-y-6">
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">من حساب</label>
                        <select onChange={e => setFormData({ ...formData, fromId: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-black">
                           <option value="">-- اختر حساب الصادر --</option>
                           {funds.map(f => <option key={f.id} value={f.accountCode}>{f.name} ({f.balance} ج.م)</option>)}
                        </select>
                     </div>
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">إلى حساب</label>
                        <select onChange={e => setFormData({ ...formData, toId: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-black">
                           <option value="">-- اختر حساب الوارد --</option>
                           {funds.map(f => <option key={f.id} value={f.accountCode}>{f.name}</option>)}
                        </select>
                     </div>
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">المبلغ</label><input type="number" onChange={e => setFormData({ ...formData, amount: e.target.value })} className="w-full p-5 bg-indigo-50 rounded-2xl font-black text-3xl tabular-nums text-center" /></div>
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">ملاحظات التحويل</label><input onChange={e => setFormData({ ...formData, note: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold" /></div>
                     <button onClick={handleLiquidityTransfer} className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-indigo-600 transition-all">تأكيد عملية المناقلة</button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default AccountantModule;
