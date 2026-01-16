
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
   Settings2, PlusCircle as PlusIcon, Settings, Banknote, ShieldCheck, Globe, CreditCard as CreditCardIcon
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { FinancialCategory, FinancialFund, Liability, UserRole, User as SystemUser, FinancialEntry, VoucherLine, Supplier } from '../types';
import * as XLSX from 'xlsx';
import FinanceModule from './FinanceModule';
import InventoryModule from './InventoryModule';
import ReportsModule from './ReportsModule';
import PayrollModule from './PayrollModule';

interface AccountantModuleProps {
   mode: string;
   onNavigate: (t: string) => void;
}

const AccountantModule: React.FC<AccountantModuleProps> = ({ mode, onNavigate }) => {
   const {
      financialCategories, financialEntries, addFinancialCategory, updateFinancialCategory, deleteFinancialCategory,
      allUsers, lang, addFinancialEntry, addNotification, funds, addFinancialFund,
      inventoryItems, updateStudentSubscription, suppliers, addSupplier,
      addEmployeeRecord, user: currentUser, systemName, systemLogo, t
   } = useAppContext();

   const [showModal, setShowModal] = useState<'add_cat' | 'edit_cat' | 'voucher' | 'fund' | 'transfer' | 'student_edit' | 'student_add' | 'employee_add' | 'supplier_add' | 'liquidity_transfer' | 'fund_settings' | null>(null);
   const [selectedStudent, setSelectedStudent] = useState<SystemUser | null>(null);
   const [selectedFund, setSelectedFund] = useState<FinancialFund | null>(null);
   const [selectedCategory, setSelectedCategory] = useState<FinancialCategory | null>(null);
   const [formData, setFormData] = useState<any>({
      name: '', phone: '', email: '', address: '', amount: 0, date: '',
      firstName: '', lastName: '', username: '', password: '', jobTitle: '',
      salary: 3000, createLogin: true, bankName: '', iban: '',
      fundImage: null
   });

   const isRtl = lang === 'ar';

   const exportToExcel = (data: any[], fileName: string) => {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, `${fileName}.xlsx`);
   };

   const handleExportCOA = () => {
      const data = financialCategories.map(c => ({
         'الكود': c.code,
         'الاسم': c.name,
         'النوع': c.type,
         'المستوى': c.level
      }));
      exportToExcel(data, "Chart_of_Accounts");
   };

   const handleExportSuppliers = () => {
      const data = suppliers.map(s => ({
         'كود المورد': s.code,
         'الاسم': s.name,
         'الهاتف': s.phone,
         'العنوان': s.address,
         'الرصيد': s.balance
      }));
      exportToExcel(data, "Suppliers_List");
   };

   const handleExportClients = () => {
      const data = allUsers.filter(u => u.role === UserRole.STUDENT).map(s => ({
         'كود الطالب': s.code,
         'الاسم': `${s.firstName} ${s.lastName}`,
         'قسط الاشتراك': s.subscriptionAmount,
         'تاريخ التجديد': s.nextRenewalDate
      }));
      exportToExcel(data, "Students_Financials");
   };

   const handleAddEmployee = () => {
      if (!formData.firstName || !formData.lastName) return alert(t('acc_err_name'));
      addEmployeeRecord({
         id: `emp-${Date.now()}`,
         code: '',
         firstName: formData.firstName,
         lastName: formData.lastName,
         username: formData.username || `emp_${Date.now()}`,
         role: formData.jobTitle.includes('حساب') ? UserRole.ACCOUNTANT : UserRole.ADMIN,
         institutionId: currentUser?.institutionId || 'inst-1',
         phone: formData.phone,
         email: formData.email,
         salary: formData.salary,
         jobTitle: formData.jobTitle,
         aiQuestionsCount: 50,
         // Bank details extension
         bankName: formData.bankName,
         iban: formData.iban
      }, formData.createLogin);
      addNotification({ title: t('acc_add_emp'), content: `${t('acc_success_add_emp')} ${formData.firstName}`, type: 'success', date: new Date().toISOString() });
      setShowModal(null);
   };

   const handleAddStudent = () => {
      if (!formData.firstName || !formData.lastName) return alert(t('acc_err_name'));
      addEmployeeRecord({
         id: `stud-${Date.now()}`,
         code: `ST-${Date.now().toString().slice(-4)}`,
         firstName: formData.firstName,
         lastName: formData.lastName,
         role: UserRole.STUDENT,
         institutionId: currentUser?.institutionId || 'inst-1',
         phone: formData.phone,
         subscriptionAmount: formData.amount || 0,
         nextRenewalDate: formData.date || new Date().toISOString().split('T')[0],
         aiQuestionsCount: 0
      }, formData.createLogin);
      addNotification({ title: t('acc_add_student'), content: `${t('acc_success_add_student')} ${formData.firstName}`, type: 'success', date: new Date().toISOString() });
      setShowModal(null);
   };

   const handleAddSupplier = () => {
      if (!formData.name) return;
      addSupplier({
         id: `sup-${Date.now()}`,
         code: `SUP-${Date.now().toString().slice(-4)}`,
         name: formData.name,
         phone: formData.phone,
         email: formData.email,
         address: formData.address,
         balance: 0
      });
      addNotification({ title: t('acc_new_supplier'), content: `${t('acc_success_add_supplier')} ${formData.name}`, type: 'success', date: new Date().toISOString() });
      setShowModal(null);
   };

   const handleAddNewFinanceItem = (name: string, type: 'income' | 'expense') => {
      if (!name) return;
      const parentId = type === 'income' ? '4' : '5';
      const parent = financialCategories.find(c => c.id === parentId);
      const count = financialCategories.filter(c => c.parentId === parentId).length + 1;
      const code = `${parent?.code}${count}`.padEnd(4, '0');

      addFinancialCategory({
         id: `cat-${Date.now()}`,
         name,
         code,
         type: type === 'income' ? 'income' : 'expense',
         parentId,
         level: 2,
         isDynamic: true
      });
      addNotification({ title: t('acc_update_tree'), content: `${t('acc_item_listed')} ${name}`, type: 'success', date: new Date().toISOString() });
   };

   const handleUpdateCategory = () => {
      if (!selectedCategory) return;
      updateFinancialCategory({ ...selectedCategory, name: formData.name, code: formData.code });
      addNotification({ title: t('acc_update_account'), content: t('acc_success_update'), type: 'success', date: new Date().toISOString() });
      setShowModal(null);
   };

   const handleAddCategory = () => {
      if (!formData.name) return alert(t('acc_err_account_name'));

      let newCode = formData.code;
      if (!newCode && formData.parentId) {
         const parent = financialCategories.find(c => c.id === formData.parentId);
         if (parent) {
            const siblings = financialCategories.filter(c => c.parentId === formData.parentId);
            const nextNum = siblings.length + 1;
            newCode = `${parent.code}${nextNum}`;
         }
      }

      addFinancialCategory({
         id: `cat-${Date.now()}`,
         name: formData.name,
         code: newCode || `${Date.now()}`,
         type: formData.type || 'asset',
         parentId: formData.parentId,
         level: formData.level || 1,
         isDynamic: true
      });

      addNotification({ title: t('acc_new_account'), content: `${t('acc_success_create_account')} ${formData.name}`, type: 'success', date: new Date().toISOString() });
      setShowModal(null);
   };

   const handleLiquidityTransfer = () => {
      if (!formData.fromId || !formData.toId || !formData.amount) return alert(t('acc_err_transfer_data'));
      if (formData.fromId === formData.toId) return alert(t('acc_err_same_account'));

      const entry: FinancialEntry = {
         id: `TRF-${Date.now()}`,
         date: new Date().toISOString().split('T')[0],
         description: `مناقلة مالية: ${formData.note || 'تحويل داخلي'}`,
         amount: parseFloat(formData.amount),
         debitAccount: formData.toId,
         creditAccount: formData.fromId,
         refType: 'transfer'
      };

      addFinancialEntry(entry);
      addNotification({ title: t('acc_transfer'), content: `${t('acc_success_transfer')} ${formData.amount}`, type: 'success', date: entry.date });
      setShowModal(null);
   };

   const PrintListTemplate: React.FC<{ title: string, columns: string[], data: any[] }> = ({ title, columns, data }) => (
      <div className="hidden print:block bg-white p-8 min-h-screen text-right font-serif" dir="rtl">
         <div className="border-[6px] border-slate-900 p-10 relative min-h-[900px] flex flex-col rounded-3xl">
            <div className="flex justify-between items-center border-b-4 border-slate-900 pb-8 mb-10">
               <div className="space-y-2">
                  <h2 className="text-3xl font-black">{systemName}</h2>
                  <p className="font-bold text-lg italic uppercase text-slate-500">{t('acc_official_registry')}</p>
               </div>
               <div className="text-center">
                  <img src={systemLogo} className="h-20 w-20 mx-auto mb-2" />
                  <h1 className="text-3xl font-black underline decoration-indigo-600 underline-offset-8">{title}</h1>
               </div>
               <div className="text-left font-bold text-xs space-y-1">
                  <p>{t('acc_report_date')}: {new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</p>
                  <p>{t('acc_report_time')}: {new Date().toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US')}</p>
                  <p>{t('acc_page')}: 1 / 1</p>
               </div>
            </div>

            <table className="w-full border-collapse border-2 border-slate-900 shadow-lg">
               <thead>
                  <tr className="bg-slate-900 text-white">
                     <th className="p-4 border border-slate-700 font-black text-center w-12">#</th>
                     {columns.map((col, i) => (
                        <th key={i} className="p-4 border border-slate-700 font-black text-right">{col}</th>
                     ))}
                  </tr>
               </thead>
               <tbody>
                  {data.map((row, i) => (
                     <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="p-4 border border-slate-200 text-center font-bold text-slate-400">{i + 1}</td>
                        {Object.values(row).map((val: any, j) => (
                           <td key={j} className="p-4 border border-slate-200 font-black text-slate-800">{val}</td>
                        ))}
                     </tr>
                  ))}
               </tbody>
            </table>

            <div className="mt-auto pt-20 flex justify-between px-10">
               <div className="text-center w-64 border-t-2 border-slate-900 pt-4 font-black">{t('acc_prepared_by')}</div>
               <div className="text-center w-64 border-t-2 border-slate-900 pt-4 font-black">{t('acc_approved_by')}</div>
            </div>

            <div className="mt-10 pt-5 border-t border-slate-100 flex justify-between items-center opacity-20 text-[8px] font-bold">
               <p>{t('acc_report_footer')} {systemName}</p>
               <p>Scorpion Core V10.4 • Security Verified Report</p>
            </div>
         </div>
      </div>
   );

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
            <div className="flex items-center gap-6"><div className="p-5 bg-indigo-50 text-indigo-700 rounded-3xl"><Settings2 size={32} /></div><div><h2 className="text-3xl font-black">{t('acc_fin_settings')}</h2><p className="text-slate-500 font-bold">{t('acc_fin_settings_desc')}</p></div></div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="glass-panel p-10 bg-white rounded-[3rem] border-t-8 border-rose-500 shadow-sm space-y-8">
               <h3 className="text-xl font-black flex items-center gap-3"><ArrowUpRight className="text-rose-600" /> {t('acc_expense_items')}</h3>
               <div className="flex gap-2">
                  <input id="exp-input" className="flex-1 p-4 bg-slate-50 rounded-xl font-bold text-sm outline-none border-2 border-transparent focus:border-rose-500" placeholder={t('acc_expense_ph')} />
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
               <h3 className="text-xl font-black flex items-center gap-3"><ArrowDownRight className="text-emerald-600" /> {t('acc_income_items')}</h3>
               <div className="flex gap-2">
                  <input id="inc-input" className="flex-1 p-4 bg-slate-50 rounded-xl font-bold text-sm outline-none border-2 border-transparent focus:border-emerald-500" placeholder={t('acc_income_ph')} />
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
                     <div className="flex items-center gap-6"><div className="p-5 bg-indigo-50 text-indigo-700 rounded-[1.75rem] border border-indigo-100 shadow-inner"><Layers size={40} /></div><div><h2 className="text-3xl font-black">{t('acc_coa_title')}</h2><p className="text-slate-500 font-bold">{t('acc_coa_desc')}</p></div></div>
                     <div className="flex gap-3">
                        <button onClick={handleExportCOA} className="p-5 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"><FileSpreadsheet size={18} /></button>
                        <button onClick={() => onNavigate('acc_finance_settings')} className="px-8 py-5 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-xs flex items-center gap-3 hover:bg-slate-50 transition-all"><Settings2 size={18} /> {t('acc_config_items')}</button>
                        <button onClick={() => { setFormData({ level: 1, type: 'asset' }); setShowModal('add_cat'); }} className="px-10 py-5 bg-slate-950 text-white rounded-2xl font-black text-xs flex items-center gap-3 shadow-xl">{t('acc_new_main_account')}</button>
                     </div>

                  </div>
                  <div className="glass-panel p-12 bg-white max-w-6xl mx-auto rounded-[3.5rem] shadow-2xl border-none text-right">{renderTree()}</div>
               </div>
            );
         case 'acc_finance_settings': return <FinanceConfigPage />;
         case 'acc_vouchers': return <FinanceModule initialMode="entry" />;
         case 'acc_suppliers': return (
            <div className="space-y-10 animate-view text-right">
               <div className="flex justify-between items-center bg-white p-10 rounded-[3rem] border shadow-sm">
                  <div className="flex items-center gap-6"><div className="p-5 bg-orange-50 text-orange-600 rounded-[1.75rem] shadow-inner"><Truck size={40} /></div><div><h2 className="text-3xl font-black">{t('acc_suppliers_title')}</h2><p className="text-slate-500 font-bold">{t('acc_suppliers_desc')}</p></div></div>
                  <div className="flex gap-3">
                     <button onClick={handleExportSuppliers} className="p-5 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"><FileSpreadsheet size={18} /></button>
                     <button onClick={() => { setFormData({ name: '', phone: '', email: '', address: '' }); setShowModal('supplier_add'); }} className="px-10 py-5 bg-slate-950 text-white rounded-2xl font-black text-xs flex items-center gap-3">{t('acc_new_supplier')}</button>
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {suppliers.map(s => (
                     <div key={s.id} className="glass-panel p-10 bg-white border border-slate-100 rounded-[3rem] group hover:border-orange-500 transition-all shadow-sm">
                        <div className="flex justify-between items-start mb-8"><div className="p-5 bg-slate-50 rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-all shadow-inner"><Truck size={32} /></div><code className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.code}</code></div>
                        <h3 className="text-2xl font-black text-slate-900 mb-4">{s.name}</h3>
                        <div className="space-y-3 mb-10"><p className="text-xs text-slate-500 flex items-center gap-2 font-bold justify-end"> {s.phone} <Phone size={14} /></p><p className="text-xs text-slate-500 flex items-center gap-2 font-bold justify-end"> {s.address || t('acc_no_address')} <MapPin size={14} /></p></div>
                        <div className="pt-6 border-t border-slate-50 flex items-center justify-between"><div className="text-right"><p className="text-[10px] font-black text-slate-400 uppercase mb-1">{t('acc_balance_due')}</p><p className="text-2xl font-black text-rose-600 tabular-nums">{s.balance.toLocaleString()} <span className="text-xs">{t('currency')}</span></p></div><button className="px-6 py-3 bg-slate-950 text-white rounded-xl font-black text-[10px] hover:bg-orange-600 transition-all shadow-lg">{t('acc_statement')}</button></div>
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
                     <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">{t('acc_safe_liquidity')}</span>
                     <div className="p-5 bg-indigo-50 text-indigo-700 rounded-3xl shadow-inner group-hover:scale-110 transition-transform"><Wallet size={36} /></div>
                  </div>
                  <div><p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('acc_total_cash')}</p><h4 className="text-5xl font-black text-slate-900 tabular-nums">{funds.reduce((a, b) => a + b.balance, 0).toLocaleString()} <span className="text-xl">{t('currency')}</span></h4></div>
                  <button onClick={() => setShowModal('liquidity_transfer')} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"><ArrowRightLeft size={16} /> {t('acc_transfer_funds')}</button>
               </div>
               {funds.map(f => (
                  <div key={f.id} className="glass-panel p-10 bg-white rounded-[2.5rem] border shadow-sm flex flex-col gap-6 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 -mr-12 -mt-12 rounded-full opacity-50 group-hover:scale-150 transition-transform"></div>
                     <div className="p-5 bg-slate-50 text-slate-900 rounded-3xl shadow-inner w-fit relative z-10 ms-auto">{f.type === 'cash' ? <Coins size={36} /> : <Landmark size={36} />}</div>
                     <div className="relative z-10"><p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{f.name}</p><h4 className="text-4xl font-black text-slate-900 tabular-nums">{f.balance.toLocaleString()}</h4><p className="text-[10px] text-indigo-600 font-bold mt-2 font-mono uppercase">Acc: {f.accountCode}</p></div>
                     <button onClick={() => { setSelectedFund(f); setShowModal('fund_settings'); }} className="absolute bottom-4 left-4 p-2 text-slate-300 hover:text-indigo-600 transition-all"><Settings size={14} /></button>
                  </div>
               ))}
            </div>
            <div className="glass-panel p-10 bg-white rounded-[3rem] border shadow-sm">
               <h3 className="text-xl font-black mb-8 flex items-center gap-4 text-slate-900 justify-end"> {t('acc_last_transfers')} <History className="text-indigo-600" /></h3>
               <div className="space-y-4">
                  {financialEntries.filter(e => e.refType === 'transfer').map(e => (
                     <div key={e.id} className="p-6 bg-slate-50/50 rounded-2xl border-2 border-transparent hover:border-indigo-100 transition-all flex items-center justify-between">
                        <p className="text-2xl font-black text-slate-900 tabular-nums">{e.amount.toLocaleString()} <span className="text-xs">{t('acc_currency')}</span></p>
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
            const employeeData = allUsers.filter(u => u.role !== UserRole.STUDENT && u.role !== UserRole.SUPER_ADMIN).map(u => ({
               name: `${u.firstName} ${u.lastName}`,
               job: u.jobTitle || 'عضو كادر',
               salary: `${u.salary?.toLocaleString() || 3000} ${t('acc_currency')}`,
               liability: `0.00 ${t('acc_currency')}`
            }));
            return (
               <div className="space-y-10 animate-view text-right">
                  <PrintListTemplate title={t('acc_emp_report_title')} columns={[t('acc_emp_name'), t('acc_job'), t('acc_salary'), t('acc_custody')]} data={employeeData} />
                  <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border shadow-sm no-print">
                     <div className="flex items-center gap-6"><div className="p-5 bg-indigo-50 text-indigo-600 rounded-3xl"><Users size={32} /></div><div><h2 className="text-3xl font-black">{t('acc_emp_title')}</h2><p className="text-slate-500 font-bold">{t('acc_emp_desc')}</p></div></div>
                     <div className="flex gap-4">
                        <button onClick={() => window.print()} className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm"><Printer size={24} /></button>
                        <button onClick={() => setShowModal('employee_add')} className="px-8 py-4 bg-slate-950 text-white rounded-2xl font-black text-xs flex items-center gap-3 shadow-xl"><UserPlus size={18} /> {t('acc_add_emp')}</button>
                     </div>
                  </div>
                  <div className="glass-panel overflow-hidden bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
                     <table className="w-full text-right">
                        <thead><tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b"><th className="p-6">{t('acc_emp_name')}</th><th className="p-6">{t('acc_job')}</th><th className="p-6 text-center">{t('acc_salary')}</th><th className="p-6 text-center">{t('acc_custody')}</th><th className="p-6 text-center">{t('acc_action')}</th></tr></thead>
                        <tbody className="divide-y font-bold text-sm">
                           {allUsers.filter(u => u.role !== UserRole.STUDENT && u.role !== UserRole.SUPER_ADMIN).map(u => (
                              <tr key={u.id} className="hover:bg-slate-50 transition-all"><td className="p-6 flex items-center gap-4 justify-end"><div className="flex flex-col"><span className="font-black">{u.firstName} {u.lastName}</span><span className="text-[10px] text-slate-400 font-mono tracking-tighter">{u.iban || t('acc_no_iban')}</span></div><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} className="w-10 h-10 rounded-xl bg-slate-100 border shadow-sm" /></td><td className="p-6 text-slate-500">{u.jobTitle || t('acc_staff_member')}</td><td className="p-6 text-center tabular-nums font-black text-indigo-700">{u.salary?.toLocaleString() || 3000} {t('acc_currency')}</td><td className="p-6 text-center font-black text-rose-600 tabular-nums">0.00 {t('acc_currency')}</td><td className="p-6 text-center"><button className="p-3 bg-slate-50 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"><Edit3 size={16} /></button></td></tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            );
         case 'acc_clients':
            const clientData = allUsers.filter(u => u.role === UserRole.STUDENT).map(s => ({
               name: `${s.firstName} ${s.lastName}`,
               code: s.code || 'N/A',
               amount: `${s.subscriptionAmount?.toLocaleString() || 0} ${t('acc_currency')}`,
               renewal: s.nextRenewalDate || '---'
            }));
            return (
               <div className="space-y-10 animate-view text-right">
                  <PrintListTemplate title={t('acc_students_debt')} columns={[t('acc_student_name'), t('acc_student_code'), t('acc_amount_due'), t('acc_renewal_date')]} data={clientData} />
                  <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border shadow-sm no-print">
                     <div className="flex items-center gap-6"><div className="p-5 bg-indigo-50 text-indigo-600 rounded-3xl"><UserCircle size={32} /></div><div><h2 className="text-3xl font-black">{t('acc_students_title')}</h2><p className="text-slate-500 font-bold">{t('acc_students_desc')}</p></div></div>
                     <div className="flex gap-4">
                        <button onClick={() => window.print()} className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm"><Printer size={24} /></button>
                        <button onClick={() => setShowModal('student_add')} className="px-8 py-4 bg-slate-950 text-white rounded-2xl font-black text-xs flex items-center gap-3"><Plus size={18} /> {t('acc_add_student')}</button>
                        <button className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs flex items-center gap-3">{t('acc_bulk_collect')}</button>
                     </div>
                  </div>
                  <div className="glass-panel overflow-hidden bg-white border border-slate-100 rounded-[3rem] shadow-sm">
                     <table className="w-full text-right">
                        <thead><tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b"><th className="p-8 text-center"><input type="checkbox" className="w-5 h-5 rounded-lg border-2" /></th><th className="p-8 text-right">{t('acc_student')}</th><th className="p-8 text-center">{t('acc_amount_due')}</th><th className="p-8 text-center">{t('acc_renewal_date')}</th><th className="p-8 text-center">{t('acc_action')}</th></tr></thead>
                        <tbody className="divide-y font-bold text-sm">
                           {allUsers.filter(u => u.role === UserRole.STUDENT).map(s => (
                              <tr key={s.id} className="hover:bg-slate-50/50"><td className="p-8 text-center"><input type="checkbox" className="w-5 h-5 rounded-lg border-2" /></td><td className="p-8 flex items-center gap-4 justify-end"><div className="flex flex-col text-right"><span className="text-slate-900 font-black">{s.firstName} {s.lastName}</span><span className="text-[10px] text-indigo-600 font-mono uppercase">ID: {s.code}</span></div><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.username}`} className="w-11 h-11 rounded-xl bg-slate-100 shadow-sm" /></td><td className="p-8 font-black text-indigo-700 text-center">{s.subscriptionAmount?.toLocaleString() || 0} {t('acc_currency')}</td><td className="p-8 text-slate-400 font-mono text-xs text-center">{s.nextRenewalDate || '---'}</td><td className="p-8 text-center"><button onClick={() => { setSelectedStudent(s); setFormData({ amount: s.subscriptionAmount, date: s.nextRenewalDate, fundId: '11101' }); setShowModal('student_edit'); }} className="p-3 bg-slate-100 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"><CreditCard size={16} /></button></td></tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            );
         default: return <div className="p-20 text-center font-black text-slate-300 italic">{t('acc_loading_engine')}</div>;
      }
   };

   return (
      <div className="relative pb-24">
         {getContent()}

         {showModal === 'edit_cat' && selectedCategory && (
            <div className="fixed inset-0 z-[1000] premium-modal-backdrop flex items-center justify-center p-6" onClick={() => setShowModal(null)}>
               <div className="premium-modal-content w-full max-w-lg bg-white p-12 rounded-[3.5rem] shadow-3xl space-y-8 animate-view text-right" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-center border-b pb-6"><h3 className="text-2xl font-black">{t('acc_edit_account')}</h3><button onClick={() => setShowModal(null)}><X size={32} /></button></div>
                  <div className="space-y-6">
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">{t('acc_account_name')}</label><input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold" /></div>
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">{t('acc_account_code')}</label><input value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-mono" /></div>
                     <button onClick={handleUpdateCategory} className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black text-xl">{t('acc_save_changes')}</button>
                  </div>
               </div>
            </div>
         )}

         {showModal === 'add_cat' && (
            <div className="fixed inset-0 z-[1000] premium-modal-backdrop flex items-center justify-center p-6 no-print" onClick={() => setShowModal(null)}>
               <div className="premium-modal-content w-full max-w-lg animate-view flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                  <div className="premium-modal-header flex justify-between items-center"><h3 className="text-2xl font-black">{t('acc_add_new_account')}</h3><button onClick={() => setShowModal(null)}><X size={32} /></button></div>
                  <div className="flex-1 overflow-y-auto p-12 space-y-8 no-scrollbar text-right">
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">{t('acc_account_name')}</label><input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold" placeholder={t('acc_account_ph')} /></div>
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">{t('acc_account_code_opt')}</label><input value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-mono" placeholder={t('acc_leave_empty')} /></div>
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">{t('acc_account_type')}</label>
                        <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-black">
                           <option value="asset">{t('acc_assets')}</option>
                           <option value="liability">{t('acc_liabilities')}</option>
                           <option value="equity">{t('acc_equity')}</option>
                           <option value="income">{t('acc_income')}</option>
                           <option value="expense">{t('acc_expenses')}</option>
                        </select>
                     </div>
                     <button onClick={handleAddCategory} className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-slate-900 transition-all">{t('acc_create_account')}</button>
                  </div>
               </div>
            </div>
         )}

         {showModal === 'supplier_add' && (
            <div className="fixed inset-0 z-[1000] premium-modal-backdrop flex items-center justify-center p-6 no-print" onClick={() => setShowModal(null)}>
               <div className="premium-modal-content w-full max-w-lg animate-view flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                  <div className="premium-modal-header flex justify-between items-center"><h3 className="text-2xl font-black">{t('acc_new_supplier')}</h3><button onClick={() => setShowModal(null)}><X size={32} /></button></div>
                  <div className="flex-1 overflow-y-auto p-12 space-y-8 no-scrollbar text-right">
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">{t('acc_supplier_name')}</label><input onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold" /></div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">{t('acc_phone')}</label><input onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold" /></div>
                        <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">{t('acc_email_opt')}</label><input onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold" /></div>
                     </div>
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">{t('acc_address')}</label><input onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold" /></div>
                     <button onClick={handleAddSupplier} className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-orange-600 transition-all">{t('acc_confirm_supplier')}</button>
                  </div>
               </div>
            </div>
         )}

         {showModal === 'employee_add' && (
            <div className="fixed inset-0 z-[1000] premium-modal-backdrop flex items-center justify-center p-6 no-print" onClick={() => setShowModal(null)}>
               <div className="premium-modal-content w-full max-w-lg animate-view flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                  <div className="premium-modal-header flex justify-between items-center"><h3 className="text-2xl font-black">{t('acc_add_new_employee')}</h3><button onClick={() => setShowModal(null)}><X size={32} /></button></div>
                  <div className="flex-1 overflow-y-auto p-12 space-y-8 no-scrollbar text-right">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">{t('acc_first_name')}</label><input onChange={e => setFormData({ ...formData, firstName: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold" /></div>
                        <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">{t('acc_last_name')}</label><input onChange={e => setFormData({ ...formData, lastName: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold" /></div>
                     </div>
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">{t('acc_job_title')}</label><input onChange={e => setFormData({ ...formData, jobTitle: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold" placeholder={t('acc_job_title_ph')} /></div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">{t('acc_bank_name')}</label><input onChange={e => setFormData({ ...formData, bankName: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold" /></div>
                        <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">{t('acc_iban')}</label><input onChange={e => setFormData({ ...formData, iban: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-mono text-xs" /></div>
                     </div>

                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">{t('acc_base_salary')}</label><input type="number" onChange={e => setFormData({ ...formData, salary: parseFloat(e.target.value) })} className="w-full p-4 bg-indigo-50 border-2 border-indigo-100 rounded-xl font-black text-xl tabular-nums text-center" /></div>

                     <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                           <input type="checkbox" checked={formData.createLogin} onChange={e => setFormData({ ...formData, createLogin: e.target.checked })} className="w-5 h-5 rounded-lg" />
                           <div className="flex items-center gap-3"><span className="text-xs font-bold">{t('acc_create_login')}</span><Lock size={16} className="text-indigo-600" /></div>
                        </div>
                        {formData.createLogin && (
                           <div className="grid grid-cols-2 gap-4 animate-view">
                              <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase tracking-widest">{t('acc_username')}</label><input onChange={e => setFormData({ ...formData, username: e.target.value })} className="w-full p-4 bg-white border rounded-xl font-mono text-xs" /></div>
                              <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase tracking-widest">{t('acc_password')}</label><input type="password" onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full p-4 bg-white border rounded-xl font-bold" /></div>
                           </div>
                        )}
                     </div>
                     <button onClick={handleAddEmployee} className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-indigo-600 transition-all">{t('acc_confirm_employee')}</button>
                  </div>
               </div>
            </div>
         )}

         {showModal === 'student_add' && (
            <div className="fixed inset-0 z-[1000] premium-modal-backdrop flex items-center justify-center p-6 no-print" onClick={() => setShowModal(null)}>
               <div className="premium-modal-content w-full max-w-lg animate-view flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                  <div className="premium-modal-header flex justify-between items-center"><h3 className="text-2xl font-black">{t('acc_add_student')}</h3><button onClick={() => setShowModal(null)}><X size={32} /></button></div>
                  <div className="flex-1 overflow-y-auto p-12 space-y-8 no-scrollbar text-right">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">{t('acc_first_name')}</label><input onChange={e => setFormData({ ...formData, firstName: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold" /></div>
                        <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase px-2 uppercase">{t('acc_last_name')}</label><input onChange={e => setFormData({ ...formData, lastName: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold" /></div>
                     </div>
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">{t('acc_phone')}</label><input onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold" /></div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">{t('acc_amount')}</label><input type="number" onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) })} className="w-full p-4 bg-indigo-50 border-2 border-indigo-100 rounded-xl font-black text-center" /></div>
                        <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">{t('acc_due_date')}</label><input type="date" onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold" /></div>
                     </div>
                     <button onClick={handleAddStudent} className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-emerald-600 transition-all">{t('acc_complete_reg')}</button>
                  </div>
               </div>
            </div>
         )}

         {showModal === 'fund_settings' && selectedFund && (
            <div className="fixed inset-0 z-[1000] premium-modal-backdrop flex items-center justify-center p-6 no-print" onClick={() => setShowModal(null)}>
               <div className="premium-modal-content w-full max-w-lg animate-view flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                  <div className="premium-modal-header flex justify-between items-center"><h3 className="text-2xl font-black">{t('acc_fund_settings')}</h3><button onClick={() => setShowModal(null)}><X size={32} /></button></div>
                  <div className="flex-1 overflow-y-auto p-12 space-y-10 no-scrollbar text-right">
                     <div className="p-8 bg-indigo-50 rounded-[2.5rem] border-2 border-dashed border-indigo-200 text-center">
                        <p className="text-sm font-black text-indigo-900">{t('acc_account_id')}</p>
                        <p className="text-4xl font-black mt-2 text-indigo-700 tracking-widest">{selectedFund.accountCode}</p>
                        <p className="text-xs font-bold text-slate-400 mt-2 uppercase">{selectedFund.name}</p>
                     </div>

                     <div className="space-y-6">
                        <h4 className="text-sm font-black text-slate-900 border-r-4 border-indigo-600 pr-3">{t('acc_online_payment_title')}</h4>
                        <div className="space-y-4">
                           <div className="space-y-1">
                              <label className="text-[10px] font-black text-slate-400 px-2">{t('acc_bank_account_num')}</label>
                              <input
                                 value={selectedFund.bankAccountNum || ''}
                                 onChange={(e) => { (selectedFund as any).bankAccountNum = e.target.value; }}
                                 className="w-full p-4 bg-slate-50 border rounded-xl font-mono text-xs"
                              />
                           </div>
                           <div className="space-y-1">
                              <label className="text-[10px] font-black text-slate-400 px-2">{t('acc_wallet_number')}</label>
                              <input
                                 value={selectedFund.walletNumber || ''}
                                 onChange={(e) => { (selectedFund as any).walletNumber = e.target.value; }}
                                 className="w-full p-4 bg-slate-50 border rounded-xl font-mono text-xs"
                              />
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6 pt-4 border-t">
                        <h4 className="text-sm font-black text-slate-900 border-r-4 border-orange-600 pr-3">صورة بيانات الصندوق (QR/لقطة شاشة)</h4>
                        <div className="p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-center space-y-4">
                           {selectedFund.fundImage || formData.fundImage ? (
                              <div className="relative inline-block group">
                                 <img src={formData.fundImage || selectedFund.fundImage} className="max-w-full h-48 object-contain rounded-xl shadow-lg" alt="Fund details" />
                                 <button onClick={() => { setFormData({ ...formData, fundImage: null }); }} className="absolute -top-2 -right-2 p-2 bg-rose-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                              </div>
                           ) : (
                              <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                                 <Paperclip size={32} className="mb-2" />
                                 <p className="text-xs font-bold">اضغط لرفع صورة الباركود أو بيانات الحساب</p>
                              </div>
                           )}
                           <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                 if (e.target.files && e.target.files[0]) {
                                    const reader = new FileReader();
                                    reader.onload = (ev) => {
                                       setFormData({ ...formData, fundImage: ev.target?.result as string });
                                    };
                                    reader.readAsDataURL(e.target.files[0]);
                                 }
                              }}
                              className="block w-full text-xs text-slate-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-full file:border-0
                                  file:text-xs file:font-semibold
                                  file:bg-indigo-50 file:text-indigo-700
                                  hover:file:bg-indigo-100
                               "
                           />
                        </div>
                     </div>

                     <button onClick={() => {
                        if (formData.fundImage) {
                           (selectedFund as any).fundImage = formData.fundImage;
                        }
                        addNotification({ title: 'تم حفظ بيانات الصندوق', content: 'تم تحديث صورة وبيانات الصندوق بنجاح.', type: 'success', date: new Date().toISOString() });
                        setShowModal(null);
                     }} className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3"><Save size={24} /> {t('acc_save_settings')}</button>
                  </div>
               </div>
            </div>
         )}

         {showModal === 'student_edit' && selectedStudent && (
            <div className="fixed inset-0 z-[1000] premium-modal-backdrop flex items-center justify-center p-6 no-print" onClick={() => setShowModal(null)}>
               <div className="premium-modal-content w-full max-w-lg animate-view flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                  <div className="premium-modal-header flex justify-between items-center"><h3 className="text-2xl font-black text-slate-900">{t('acc_renew_sub')}</h3><button onClick={() => setShowModal(null)}><X size={32} /></button></div>
                  <div className="flex-1 overflow-y-auto p-12 space-y-8 no-scrollbar text-right">
                     <div className="bg-slate-50 p-6 rounded-3xl flex items-center gap-4">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-indigo-600"><User size={24} /></div>
                        <div>
                           <p className="font-black text-slate-900 text-lg leading-tight">{selectedStudent.firstName} {selectedStudent.lastName}</p>
                           <p className="text-xs font-mono text-slate-400">{selectedStudent.code}</p>
                        </div>
                     </div>
                     <div className="space-y-6">
                        <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">{t('acc_renew_amount')}</label><input type="number" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} className="w-full p-4 bg-indigo-50 border-2 border-indigo-100 rounded-xl font-black text-2xl text-center tabular-nums" /></div>
                        <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">{t('acc_new_expiry')}</label><input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold" /></div>
                        <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">{t('acc_deposit_fund')}</label>
                           <select value={formData.fundId} onChange={e => setFormData({ ...formData, fundId: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold">
                              {funds.map(f => <option key={f.id} value={f.accountCode}>{f.name}</option>)}
                           </select>
                        </div>
                     </div>
                     <button onClick={() => {
                        if (!formData.amount || !formData.date) return alert(t('acc_err_amount_date'));
                        updateStudentSubscription(selectedStudent.id, parseFloat(formData.amount), formData.date);

                        // Create Financial Entry (Receipt)
                        const entry: FinancialEntry = {
                           id: `SUB-${Date.now()}`,
                           date: new Date().toISOString().split('T')[0],
                           description: `${t('acc_renew_desc')}: ${selectedStudent.firstName} ${selectedStudent.lastName}`,
                           amount: parseFloat(formData.amount),
                           debitAccount: formData.fundId || '11101',
                           creditAccount: '41101',
                           refType: 'subscription'
                        };
                        addFinancialEntry(entry);
                        addNotification({ title: t('acc_renew_success_title'), content: t('acc_renew_success_msg'), type: 'success', date: entry.date });
                        setShowModal(null);
                     }} className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3"><CheckCircle size={20} /> {t('acc_confirm_payment')}</button>
                  </div>
               </div>
            </div>
         )}

         {showModal === 'liquidity_transfer' && (
            <div className="fixed inset-0 z-[1000] premium-modal-backdrop flex items-center justify-center p-6" onClick={() => setShowModal(null)}>
               <div className="premium-modal-content w-full max-w-lg bg-white p-12 rounded-[3.5rem] shadow-3xl space-y-10 animate-view text-right" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-center border-b pb-6"><h3 className="text-2xl font-black">{t('acc_liquidity_transfer')}</h3><button onClick={() => setShowModal(null)}><X size={32} /></button></div>
                  <div className="space-y-6">
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">{t('acc_from_account')}</label>
                        <select onChange={e => setFormData({ ...formData, fromId: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-black">
                           <option value="">{t('acc_select_source')}</option>
                           {funds.map(f => <option key={f.id} value={f.accountCode}>{f.name} ({f.balance} {t('acc_currency')})</option>)}
                        </select>
                     </div>
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">{t('acc_to_account')}</label>
                        <select onChange={e => setFormData({ ...formData, toId: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-black">
                           <option value="">{t('acc_select_dest')}</option>
                           {funds.map(f => <option key={f.id} value={f.accountCode}>{f.name}</option>)}
                        </select>
                     </div>
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">{t('acc_amount')}</label><input type="number" onChange={e => setFormData({ ...formData, amount: e.target.value })} className="w-full p-5 bg-indigo-50 rounded-2xl font-black text-3xl tabular-nums text-center" /></div>
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 px-2 uppercase">{t('acc_transfer_notes')}</label><input onChange={e => setFormData({ ...formData, note: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-bold" /></div>
                     <button onClick={handleLiquidityTransfer} className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-indigo-600 transition-all">{t('acc_confirm_transfer')}</button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default AccountantModule;
