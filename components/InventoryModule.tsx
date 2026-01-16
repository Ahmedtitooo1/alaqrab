
import * as React from 'react';
import { useState, useMemo } from 'react';
import {
   Package, Search, Plus, Trash2, Edit3, Save, X,
   ArrowDownCircle, ArrowUpCircle, List, Printer, Activity, TrendingUp,
   Truck, Inbox, ArrowUpRight, History, Layers, AlertTriangle, Coins, DollarSign
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { InventoryItem, InventoryTransaction, UserRole, FinancialEntry } from '../types';

const InventoryModule: React.FC = () => {
   const {
      inventoryItems, addInventoryItem, deleteInventoryItem, updateInventoryItem,
      lang, addNotification, financialCategories, allUsers, funds, addFinancialEntry,
      suppliers, addInventoryTransaction, inventoryTransactions, systemName, systemLogo, user, t
   } = useAppContext();

   const [activeTab, setActiveTab] = useState<'stock' | 'history'>('stock');
   const [showModal, setShowModal] = useState<'item' | 'transaction' | null>(null);
   const [search, setSearch] = useState('');

   const [formData, setFormData] = useState<any>({
      name: '', quantity: 0, unitPrice: 0, category: 'كتب', minQuantity: 5, location: 'A-1',
      type: 'in', itemId: '', unitPriceEntry: 0, targetId: '', fundId: '11101', supplierId: '', description: '', accountCode: '11301'
   });

   // وظيفة لإدراج صنف جديد في المستودع
   const handleSaveItem = () => {
      if (!formData.name || isNaN(parseInt(formData.quantity)) || isNaN(parseFloat(formData.unitPrice))) {
         return alert(t('inv_err_data'));
      }

      const newItem: InventoryItem = {
         id: `item-${Date.now()}`,
         code: `INV-${Date.now().toString().slice(-4)}`,
         name: formData.name,
         category: formData.category || 'كتب',
         quantity: parseInt(formData.quantity),
         unitPrice: parseFloat(formData.unitPrice),
         minQuantity: parseInt(formData.minQuantity) || 5,
         location: formData.location || 'A-1',
         accountCode: formData.accountCode || '11301'
      };

      addInventoryItem(newItem);
      addNotification({
         title: 'تمت إضافة صنف',
         content: `تم تسجيل الصنف ${newItem.name} في المستودع بنجاح.`,
         type: 'success',
         date: new Date().toISOString().split('T')[0]
      });

      setShowModal(null);
      setFormData({ ...formData, name: '', quantity: 0, unitPrice: 0 });
   };

   const handleSaveTransaction = () => {
      // Improved validation
      if (!formData.itemId || !formData.quantity || !formData.unitPriceEntry || parseFloat(formData.quantity) <= 0) {
         return alert(t('inv_err_price'));
      }

      const selectedItem = inventoryItems.find(i => i.id === formData.itemId);
      const qty = parseInt(formData.quantity);
      const price = parseFloat(formData.unitPriceEntry);
      const totalAmount = qty * price;
      const date = new Date().toISOString().split('T')[0];

      if (formData.type === 'in') {
         // --- دورة توريد مخزني ---
         // 1. قيد إثبات المشتريات (من المخزن إلى المورد)
         const entryPurchase: FinancialEntry = {
            id: `PUR-${Date.now()}-1`,
            date,
            description: `شراء أصناف: ${selectedItem?.name} (سعر الوحدة: ${formData.unitPriceEntry})`,
            amount: totalAmount,
            debitAccount: selectedItem?.accountCode || '11301',
            creditAccount: formData.supplierId ? financialCategories.find(c => c.id === formData.supplierId)?.code || '21201' : '21201',
            refType: 'inventory'
         };
         addFinancialEntry(entryPurchase);

         // 2. قيد سداد المورد (من المورد إلى الخزينة)
         const entryPayment: FinancialEntry = {
            id: `PUR-${Date.now()}-2`,
            date,
            description: `سداد قيمة مشتريات: ${selectedItem?.name} نقدياً من الخزينة`,
            amount: totalAmount,
            debitAccount: entryPurchase.creditAccount,
            creditAccount: formData.fundId || '11101',
            refType: 'inventory'
         };
         addFinancialEntry(entryPayment);
      } else {
         // --- دورة صرف مخزني ---
         // 1. قيد المبيعات (من الخزينة إلى الإيرادات)
         const entrySale: FinancialEntry = {
            id: `SALE-${Date.now()}-1`,
            date,
            description: `بيع أصناف: ${selectedItem?.name} (سعر الوحدة: ${formData.unitPriceEntry})`,
            amount: totalAmount,
            debitAccount: formData.fundId || '11101',
            creditAccount: '41101', // كود حساب المبيعات/الإيرادات
            refType: 'inventory'
         };
         addFinancialEntry(entrySale);

         // 2. قيد العميل (إثبات وتصفية في كشف الحساب)
         const entryCustomer: FinancialEntry = {
            id: `SALE-${Date.now()}-2`,
            date,
            description: `تسوية حركة شراء مخزن للعميل: ${allUsers.find(u => u.id === formData.targetId)?.firstName}`,
            amount: totalAmount,
            debitAccount: financialCategories.find(c => c.id === formData.targetId)?.code || '11201',
            creditAccount: formData.fundId || '11101',
            refType: 'inventory'
         };
         addFinancialEntry(entryCustomer);
      }

      addInventoryTransaction({
         id: `TRX-${Date.now()}`,
         itemId: formData.itemId,
         type: formData.type,
         quantity: parseInt(formData.quantity),
         unitPrice: parseFloat(formData.unitPriceEntry),
         date,
         description: formData.description,
         supplierId: formData.supplierId
      });

      addNotification({
         title: 'تمت العملية بنجاح',
         content: `تم ترحيل الحركات المحاسبية لـ ${formData.type === 'in' ? 'توريد' : 'صرف'} الصنف بقيمة إجمالية ${totalAmount}`,
         type: 'success',
         date
      });
      setShowModal(null);
   };

   const totalInventoryValue = useMemo(() => inventoryItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0), [inventoryItems]);

   return (
      <div className="space-y-10 animate-view pb-24 text-right">
         {/* Print-Only Professional Inventory Report */}
         <div className="hidden print:block bg-white p-12 min-h-screen text-right" dir="rtl">
            <div className="flex justify-between items-start mb-12 pb-10 border-b-[4px] border-indigo-950">
               <div className="w-1/3 space-y-2">
                  <h1 className="text-4xl font-black text-indigo-950 uppercase italic tracking-tighter">{systemName}</h1>
                  <div className="h-1.5 w-24 bg-indigo-950"></div>
                  <p className="text-sm font-bold pt-2">إدارة المستودعات والمخازن</p>
                  <p className="text-xs font-bold text-slate-500">Inventory Management System</p>
               </div>
               <div className="w-1/3 text-center">
                  <img src={systemLogo} className="h-32 w-32 mx-auto mb-6 p-4 bg-white shadow-xl rounded-[2rem] border-2 border-slate-50" alt="Logo" />
                  <div className="inline-block px-10 py-3 bg-indigo-950 text-white rounded-full font-black text-2xl shadow-lg ring-4 ring-indigo-50">
                     كشف الجرد والأرصدة
                  </div>
                  <p className="text-[10px] font-black text-slate-400 mt-4 tracking-[0.4em] uppercase">Official Inventory Statement</p>
               </div>
               <div className="w-1/3 text-left font-black text-sm space-y-2">
                  <div className="p-4 bg-slate-50 rounded-2xl border-2 border-indigo-50 inline-block">
                     <p className="text-indigo-600 mb-1">{t('inv_doc_data')}</p>
                     <p>{t('inv_date')}: <span className="font-mono">{new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span></p>
                     <p>{t('inv_time')}: <span className="font-mono">{new Date().toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span></p>
                     <p>{t('inv_employee')}: {user?.firstName} {user?.lastName}</p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-12">
               <div className="p-6 bg-slate-100 rounded-[2rem] border-2 border-slate-200 text-center">
                  <p className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">{t('inv_total_items')}</p>
                  <p className="text-4xl font-black">{inventoryItems.length}</p>
               </div>
               <div className="p-6 bg-indigo-950 text-white rounded-[2rem] text-center shadow-xl">
                  <p className="text-[10px] font-black text-indigo-300 mb-2 uppercase tracking-widest">{t('inv_total_value')}</p>
                  <p className="text-4xl font-black">{totalInventoryValue.toLocaleString()} <span className="text-xs font-normal">{t('egp')}</span></p>
               </div>
               <div className="p-6 bg-slate-100 rounded-[2rem] border-2 border-slate-200 text-center">
                  <p className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">{t('inv_transactions')}</p>
                  <p className="text-4xl font-black">{inventoryTransactions.length}</p>
               </div>
            </div>

            <table className="w-full text-sm border-collapse rounded-3xl overflow-hidden shadow-sm">
               <thead className="bg-indigo-950 text-white">
                  <tr>
                     <th className="p-5 border border-indigo-900 font-black text-center w-12 text-xs">#</th>
                     <th className="p-5 border border-indigo-900 font-black text-right text-xs">{t('inv_item_name')}</th>
                     <th className="p-5 border border-indigo-900 font-black text-center w-32 text-xs">{t('inv_code')}</th>
                     <th className="p-5 border border-indigo-900 font-black text-center w-24 text-xs">{t('inv_qty')}</th>
                     <th className="p-5 border border-indigo-900 font-black text-center w-32 text-xs">{t('inv_unit_price')}</th>
                     <th className="p-5 border border-indigo-900 font-black text-center w-40 text-xs">{t('inv_total')}</th>
                     <th className="p-5 border border-indigo-900 font-black text-center w-24 text-xs">{t('inv_status')}</th>
                  </tr>
               </thead>
               <tbody className="bg-white">
                  {inventoryItems.map((item, i) => (
                     <tr key={item.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="p-5 border-x border-b border-slate-200 text-center font-bold">{i + 1}</td>
                        <td className="p-5 border-x border-b border-slate-200 font-black text-slate-800">{item.name}</td>
                        <td className="p-5 border-x border-b border-slate-200 text-center font-mono text-indigo-700 font-bold">{item.accountCode}</td>
                        <td className="p-5 border-x border-b border-slate-200 text-center font-black text-lg tabular-nums">{item.quantity}</td>
                        <td className="p-5 border-x border-b border-slate-200 text-center font-bold tabular-nums">{item.unitPrice.toLocaleString()}</td>
                        <td className="p-5 border-x border-b border-slate-200 text-center font-black text-lg tabular-nums text-indigo-700">{(item.quantity * item.unitPrice).toLocaleString()}</td>
                        <td className="p-5 border-x border-b border-slate-200 text-center">
                           <span className={`px-3 py-1 rounded-full text-[9px] font-black ${item.quantity <= item.minQuantity ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                              {item.quantity <= item.minQuantity ? t('inv_low_stock') : t('inv_available')}
                           </span>
                        </td>
                     </tr>
                  ))}
               </tbody>
               <tfoot className="bg-indigo-50">
                  <tr className="font-black border-2 border-indigo-950">
                     <td colSpan={5} className="p-6 text-left text-xl">إجمالي قيمة المخزون:</td>
                     <td className="p-6 text-center text-3xl text-indigo-950 underline decoration-double">{totalInventoryValue.toLocaleString()}</td>
                     <td></td>
                  </tr>
               </tfoot>
            </table>

            <div className="mt-24 grid grid-cols-3 gap-16 text-center">
               <div className="space-y-12">
                  <p className="font-black text-lg text-slate-900 underline underline-offset-8">{t('inv_store_keeper')}</p>
                  <div className="text-xs text-slate-400 font-bold italic">{t('inv_signature_seal')}</div>
               </div>
               <div className="flex flex-col items-center justify-center">
                  <div className="border-[5px] border-double border-indigo-950/20 h-40 w-40 rounded-full flex flex-col items-center justify-center p-4">
                     <div className="text-[10px] font-black text-indigo-950/30 uppercase text-center leading-tight whitespace-pre-line">
                        {t('inv_certified_stamp').replace('{year}', new Date().getFullYear().toString())}
                     </div>
                  </div>
               </div>
               <div className="space-y-12">
                  <p className="font-black text-lg text-slate-900 underline underline-offset-8">{t('inv_fin_manager')}</p>
                  <div className="text-xs text-slate-400 font-bold italic">{t('inv_authorized_signature')}</div>
               </div>
            </div>

            <div className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-center opacity-30 select-none">
               <p className="text-[9px] font-black">{t('inv_footer').replace('{year}', new Date().getFullYear().toString())}</p>
               <p className="text-[9px] font-black uppercase tracking-[0.2em]">{t('inv_version')}</p>
            </div>
         </div>

         {/* Screen View */}
         <div className="flex flex-col md:flex-row justify-between items-center bg-white p-10 rounded-[3rem] border shadow-sm gap-6 no-print">
            <div className="flex items-center gap-6">
               <div className="p-5 bg-slate-950 text-white rounded-[1.75rem] shadow-xl"><Package size={40} /></div>
               <div><h2 className="text-3xl font-black text-slate-900">{t('inv_title')}</h2><p className="text-slate-500 font-bold">{t('inv_statement')}</p></div>
            </div>
            <div className="flex gap-4">
               <button onClick={() => window.print()} className="px-8 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs flex items-center gap-3 shadow-xl hover:scale-105 transition-all"><Printer size={20} /> {t('inv_print_btn')}</button>
               <button onClick={() => { setFormData({ ...formData, type: 'in', unitPriceEntry: 0 }); setShowModal('transaction'); }} className="px-8 py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs flex items-center gap-3 shadow-xl hover:scale-105 transition-all"><ArrowUpRight size={20} /> {t('inv_supply_btn')}</button>
               <button onClick={() => { setFormData({ ...formData, type: 'out', unitPriceEntry: 0 }); setShowModal('transaction'); }} className="px-8 py-5 bg-rose-600 text-white rounded-2xl font-black text-xs flex items-center gap-3 shadow-xl hover:scale-105 transition-all"><ArrowUpCircle size={20} /> {t('inv_dispense_btn')}</button>
               <button onClick={() => { setFormData({ name: '', quantity: 0, unitPrice: 0, minQuantity: 5, category: 'كتب', location: 'A-1', accountCode: '11301' }); setShowModal('item'); }} className="px-8 py-5 bg-slate-950 text-white rounded-2xl font-black text-xs flex items-center gap-3 shadow-xl">{t('inv_add_item_btn')}</button>
            </div>
         </div>

         <div className="flex bg-white/50 p-2 rounded-2xl border w-fit mx-auto gap-2 no-print">
            <button onClick={() => setActiveTab('stock')} className={`px-10 py-3 rounded-xl font-black text-xs transition-all ${activeTab === 'stock' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}>{t('inv_tab_stock')}</button>
            <button onClick={() => setActiveTab('history')} className={`px-10 py-3 rounded-xl font-black text-xs transition-all ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}>{t('inv_tab_history')}</button>
         </div>

         {activeTab === 'stock' ? (
            <div className="glass-panel overflow-hidden bg-white border border-slate-100 rounded-[3rem] shadow-sm">
               <div className="p-8 border-b bg-slate-50/20 flex items-center gap-4">
                  <Search className="text-slate-300" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('inv_search_ph')} className="flex-1 bg-transparent border-none outline-none font-bold text-sm text-right" />
               </div>
               <table className="w-full text-right">
                  <thead><tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 border-b"><th className="p-8">{t('inv_item_name')}</th><th className="p-8 text-center">{t('inv_qty')}</th><th className="p-8 text-center">{t('inv_total')}</th><th className="p-8 text-center">{t('inv_status')}</th><th className="p-8 text-center">{t('inv_action')}</th></tr></thead>
                  <tbody className="divide-y font-bold text-sm">
                     {inventoryItems.filter(i => i.name.includes(search)).map(item => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-all">
                           <td className="p-8"><p className="font-black text-slate-900">{item.name}</p><p className="text-[9px] text-slate-400 uppercase tracking-widest">CODE: {item.accountCode}</p></td>
                           <td className="p-8 text-center text-xl font-black tabular-nums">{item.quantity}</td>
                           <td className="p-8 text-center font-black text-indigo-700">{(item.quantity * item.unitPrice).toLocaleString()} {t('egp')}</td>
                           <td className="p-8 text-center"><span className={`px-4 py-1.5 rounded-full text-[10px] font-black ${item.quantity <= item.minQuantity ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>{item.quantity <= item.minQuantity ? t('inv_low_stock') : t('inv_available')}</span></td>
                           <td className="p-8 text-center"><button className="p-2 text-slate-300 hover:text-indigo-600"><Edit3 size={16} /></button></td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         ) : (
            <div className="glass-panel overflow-hidden bg-white border border-slate-100 rounded-[3rem] shadow-sm animate-view">
               <table className="w-full text-right">
                  <thead><tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 border-b"><th className="p-8">{t('inv_date')}</th><th className="p-8">{t('inv_type')}</th><th className="p-8">{t('inv_item_name')}</th><th className="p-8 text-center">{t('inv_unit_price')}</th><th className="p-8 text-center">{t('inv_qty')}</th><th className="p-8 text-center">{t('inv_total')}</th><th className="p-8">{t('inv_desc')}</th></tr></thead>
                  <tbody className="divide-y font-bold text-sm">
                     {inventoryTransactions.map(t => (
                        <tr key={t.id} className="hover:bg-slate-50/50 group">
                           <td className="p-8 text-slate-400 font-mono text-xs">{t.date}</td>
                           <td className="p-8"><span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase flex items-center gap-2 w-fit ${t.type === 'in' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{t.type === 'in' ? <Inbox size={12} /> : <ArrowUpRight size={12} />} {t.type === 'in' ? t('inv_supply') : t('inv_dispense')}</span></td>
                           <td className="p-8 font-black">{inventoryItems.find(i => i.id === t.itemId)?.name || t('inv_deleted_item')}</td>
                           <td className="p-8 text-center tabular-nums">{t.unitPrice || 0}</td>
                           <td className={`p-8 text-center font-black tabular-nums text-lg ${t.type === 'in' ? 'text-emerald-700' : 'text-rose-700'}`}>{t.type === 'in' ? '+' : '-'}{t.quantity}</td>
                           <td className="p-8 text-center font-black text-slate-900">{(t.quantity * (t.unitPrice || 0)).toLocaleString()}</td>
                           <td className="p-8 text-slate-500 text-xs truncate max-w-xs">{t.description}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}

         {showModal === 'transaction' && (
            <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setShowModal(null)}>
               <div className="glass-panel w-full max-w-lg p-12 bg-white animate-view relative rounded-[3.5rem] shadow-3xl space-y-8" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-center border-b pb-6"><h3 className="text-2xl font-black text-slate-900 flex items-center gap-4">{formData.type === 'in' ? <Inbox className="text-emerald-600" /> : <ArrowUpCircle className="text-rose-600" />} {formData.type === 'in' ? t('inv_modal_title_supply') : t('inv_modal_title_dispense')}</h3><button onClick={() => setShowModal(null)}><X size={32} /></button></div>
                  <div className="space-y-6">
                     <div className="space-y-1 text-right"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t('inv_item_name')}</label>
                        <select value={formData.itemId} onChange={e => setFormData({ ...formData, itemId: e.target.value })} className="w-full p-4 bg-slate-50 border-none rounded-2xl font-black outline-none focus:ring-2 focus:ring-indigo-600/20">
                           <option value="">{t('inv_select_item')}</option>
                           {inventoryItems.map(i => <option key={i.id} value={i.id}>{i.name} (رصيد: {i.quantity})</option>)}
                        </select>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1 text-right">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t('inv_qty')}</label>
                           <input type="number" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl font-black text-center" />
                        </div>
                        <div className="space-y-1 text-right">
                           <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest px-2">{formData.type === 'in' ? t('inv_buy_price') : t('inv_sell_price')}</label>
                           <input type="number" value={formData.unitPriceEntry} onChange={e => setFormData({ ...formData, unitPriceEntry: e.target.value })} className="w-full p-4 bg-indigo-50 border-2 border-indigo-200 rounded-2xl font-black text-center text-xl tabular-nums shadow-inner" />
                        </div>
                     </div>

                     <div className="p-6 bg-slate-900 rounded-3xl text-center shadow-xl space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('inv_total_permit')}</p>
                        <p className="text-4xl font-black text-white tabular-nums">{(parseFloat(formData.quantity || 0) * parseFloat(formData.unitPriceEntry || 0)).toLocaleString()} <span className="text-sm opacity-30">EGP</span></p>
                     </div>

                     {formData.type === 'in' ? (
                        <div className="grid grid-cols-2 gap-4 animate-view">
                           <div className="space-y-1 text-right"><label className="text-[10px] font-black text-slate-400 uppercase px-2">{t('inv_supplier')}</label>
                              <select value={formData.supplierId} onChange={e => setFormData({ ...formData, supplierId: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl font-bold">
                                 <option value="">{t('inv_select_supplier')}</option>
                                 {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                              </select>
                           </div>
                           <div className="space-y-1 text-right"><label className="text-[10px] font-black text-slate-400 uppercase px-2">{t('inv_fund_out')}</label>
                              <select value={formData.fundId} onChange={e => setFormData({ ...formData, fundId: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl font-bold">
                                 {funds.map(f => <option key={f.id} value={f.accountCode}>{f.name}</option>)}
                              </select>
                           </div>
                        </div>
                     ) : (
                        <div className="grid grid-cols-2 gap-4 animate-view">
                           <div className="space-y-1 text-right"><label className="text-[10px] font-black text-slate-400 uppercase px-2">{t('inv_client')}</label>
                              <select value={formData.targetId} onChange={e => setFormData({ ...formData, targetId: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl font-bold">
                                 <option value="">{t('inv_select_client')}</option>
                                 {allUsers.map(u => <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.role === UserRole.STUDENT ? t('student') : t('inv_employee')})</option>)}
                              </select>
                           </div>
                           <div className="space-y-1 text-right"><label className="text-[10px] font-black text-slate-400 uppercase px-2">{t('inv_fund_in')}</label>
                              <select value={formData.fundId} onChange={e => setFormData({ ...formData, fundId: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl font-bold">
                                 {funds.map(f => <option key={f.id} value={f.accountCode}>{f.name}</option>)}
                              </select>
                           </div>
                        </div>
                     )}

                     <div className="space-y-1 text-right"><label className="text-[10px] font-black text-slate-400 uppercase px-2">{t('inv_desc')}</label><input value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl font-bold" placeholder={t('inv_desc_ph')} /></div>

                     <button onClick={handleSaveTransaction} className="w-full py-6 bg-slate-950 text-white rounded-3xl font-black text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 hover:bg-indigo-600">
                        <CheckCircle2 size={24} /> {t('inv_submit_btn')}
                     </button>
                  </div>
               </div>
            </div>
         )}

         {showModal === 'item' && (
            <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setShowModal(null)}>
               <div className="glass-panel w-full max-w-lg p-12 bg-white animate-view relative rounded-[3.5rem] shadow-3xl space-y-8" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-center border-b pb-6"><h3 className="text-2xl font-black text-slate-900">{t('inv_add_item_title')}</h3><button onClick={() => setShowModal(null)}><X size={32} /></button></div>
                  <div className="space-y-6 text-right">
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase px-2">{t('inv_item_name')}</label><input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-black shadow-inner" /></div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase px-2">{t('inv_open_stock')}</label><input type="number" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-black text-center shadow-inner" /></div>
                        <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase px-2">{t('inv_cost_unit')}</label><input type="number" value={formData.unitPrice} onChange={e => setFormData({ ...formData, unitPrice: e.target.value })} className="w-full p-4 bg-indigo-50 rounded-xl font-black text-center shadow-inner" /></div>
                     </div>
                     <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase px-2">رابط شجرة الحسابات (Account Code)</label>
                        <select value={formData.accountCode} onChange={e => setFormData({ ...formData, accountCode: e.target.value })} className="w-full p-4 bg-slate-50 rounded-xl font-black">
                           {financialCategories.filter(c => c.type === 'asset').map(c => (
                              <option key={c.id} value={c.code}>{c.name} ({c.code})</option>
                           ))}
                        </select>
                     </div>
                     <button onClick={handleSaveItem} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-indigo-700 transition-all">{t('inv_activate_btn')}</button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

const CheckCircle2 = ({ size }: any) => (
   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
   </svg>
);

export default InventoryModule;
