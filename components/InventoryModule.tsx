
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
      suppliers, addInventoryTransaction, inventoryTransactions
   } = useAppContext();

   const [activeTab, setActiveTab] = useState<'stock' | 'history'>('stock');
   const [showModal, setShowModal] = useState<'item' | 'transaction' | null>(null);
   const [search, setSearch] = useState('');

   const [formData, setFormData] = useState<any>({
      name: '', quantity: 0, unitPrice: 0, category: 'كتب', minQuantity: 5, location: 'A-1',
      type: 'in', itemId: '', unitPriceEntry: 0, targetId: '', fundId: '', supplierId: '', description: '', isPaid: true
   });

   // وظيفة لإدراج صنف جديد في المستودع
   const handleSaveItem = () => {
      if (!formData.name) {
         return alert("يرجى إدخال اسم الصنف");
      }

      const quantity = formData.quantity ? parseInt(formData.quantity) : 0;
      const unitPrice = formData.unitPrice ? parseFloat(formData.unitPrice) : 0;
      const minQuantity = formData.minQuantity ? parseInt(formData.minQuantity) : 5;

      if (quantity < 0 || unitPrice < 0) {
         return alert("لا يمكن أن تكون الكمية أو السعر بالسالب");
      }

      const newItem: InventoryItem = {
         id: `item-${Date.now()}`,
         code: `INV-${Date.now().toString().slice(-4)}`,
         name: formData.name,
         category: formData.category || 'كتب',
         quantity: quantity,
         unitPrice: unitPrice,
         minQuantity: minQuantity,
         location: formData.location || 'A-1',
         institutionId: useAppContext().user?.institutionId || ''
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
      const selectedFundId = formData.fundId || (funds.length > 0 ? funds[0].accountCode : '11101');
      if (!formData.itemId || !formData.quantity || !formData.unitPriceEntry) return alert("يرجى إكمال البيانات السعرية والكمية");

      const selectedItem = inventoryItems.find(i => i.id === formData.itemId);
      const totalAmount = parseFloat(formData.quantity) * parseFloat(formData.unitPriceEntry);
      const date = new Date().toISOString().split('T')[0];

      if (formData.type === 'in') {
         // --- دورة توريد مخزني (Supply Check) ---
         // FIX: Ensure positive values and correct accounting direction (Credit Fund = Subtract Cash)
         if (totalAmount < 0) return alert("لا يمكن ترحيل قيم سالبة");

         const supplierCode = formData.supplierId ? financialCategories.find(c => c.id === formData.supplierId)?.code || '21201' : '21201';

         // 1. قيد إثبات المشتريات (استحقاق)
         // Debit Inventory (Asset), Credit Supplier (Liability)
         const entryPurchase: FinancialEntry = {
            id: `PUR-${Date.now()}-1`,
            date,
            description: `شراء أصناف: ${selectedItem?.name} (سعر الوحدة: ${formData.unitPriceEntry}) - ${formData.isPaid ? 'نقدي' : 'آجل'}`,
            amount: totalAmount,
            debitAccount: selectedItem?.accountCode || '11301',
            creditAccount: supplierCode,
            refType: 'inventory',
            institutionId: useAppContext().user?.institutionId || ''
         };
         addFinancialEntry(entryPurchase);

         // 2. قيد سداد المورد (دفع نقدي)
         // Debit Supplier (Reduce Liability), Credit Fund (Reduce Asset/Cash)
         if (formData.isPaid) {
            const entryPayment: FinancialEntry = {
               id: `PUR-${Date.now()}-2`,
               date,
               description: `سداد قيمة مشتريات: ${selectedItem?.name} نقدياً من الخزينة`,
               amount: totalAmount,
               debitAccount: supplierCode, // Debit Supplier (Payment)
               creditAccount: selectedFundId, // Credit Fund (Cash Out)
               refType: 'inventory',
               institutionId: useAppContext().user?.institutionId || ''
            };
            addFinancialEntry(entryPayment);
         }
      } else if (formData.type === 'consume') {
         // --- دورة صرف استهلاك (داخلي) ---
         // Debit Expense (Masrofat), Credit Inventory (Asset)
         const entryConsume: FinancialEntry = {
            id: `CONS-${Date.now()}`,
            date,
            description: `صرف استهلاك داخلي: ${selectedItem?.name} (الكمية: ${formData.quantity}) - ${formData.description}`,
            amount: totalAmount,
            debitAccount: formData.targetId || '5201', // حساب المصروفات
            creditAccount: selectedItem?.accountCode || '11301', // حساب المخزون
            refType: 'inventory',
            institutionId: useAppContext().user?.institutionId || ''
         };
         addFinancialEntry(entryConsume);
      } else {
         // --- دورة صرف مخزني (بيع) ---
         // 1. قيد المبيعات (من الخزينة إلى الإيرادات - الصندوق يزيد)
         const entrySale: FinancialEntry = {
            id: `SALE-${Date.now()}-1`,
            date,
            description: `بيع أصناف: ${selectedItem?.name} (سعر الوحدة: ${formData.unitPriceEntry})`,
            amount: totalAmount,
            debitAccount: selectedFundId,
            creditAccount: '41101', // كود حساب المبيعات/الإيرادات
            refType: 'inventory',
            institutionId: useAppContext().user?.institutionId || ''
         };
         addFinancialEntry(entrySale);

         // 2. قيد العميل (إثبات استلام المبلغ من العميل أو مديونيته)
         // ملاحظة: تم تعديل هذا القيد ليكون الصندوق هو المدين في حال البيع النقدي
         const entryCustomer: FinancialEntry = {
            id: `SALE-${Date.now()}-2`,
            date,
            description: `إثبات بيع مخزني للعميل: ${allUsers.find(u => u.id === formData.targetId)?.firstName}`,
            amount: totalAmount,
            debitAccount: financialCategories.find(c => c.id === formData.targetId)?.code || '11201',
            creditAccount: selectedItem?.accountCode || '11301', // المخزن ينقص
            refType: 'inventory',
            institutionId: useAppContext().user?.institutionId || ''
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
         supplierId: formData.supplierId,
         institutionId: useAppContext().user?.institutionId || ''
      });

      addNotification({
         title: 'تمت العملية بنجاح',
         content: `تم ترحيل الحركات المحاسبية لـ ${formData.type === 'in' ? 'توريد' : 'صرف'} الصنف بقيمة إجمالية ${totalAmount}`,
         type: 'success',
         date
      });
      setShowModal(null);
   };

   return (
      <div className="space-y-10 animate-view pb-24 text-right">
         <div className="flex flex-col md:flex-row justify-between items-center bg-white p-10 rounded-[3rem] border shadow-sm gap-6 no-print">
            <div className="flex items-center gap-6">
               <div className="p-5 bg-slate-950 text-white rounded-[1.75rem] shadow-xl"><Package size={40} /></div>
               <div><h2 className="text-3xl font-black text-slate-900">إدارة المستودعات والربط المالي</h2><p className="text-slate-500 font-bold">متابعة الأرصدة وتوليد قيود الصرف التلقائية عند التوريد.</p></div>
            </div>
            <div className="flex gap-4">
               <button onClick={() => { setFormData({ ...formData, type: 'in', unitPriceEntry: 0 }); setShowModal('transaction'); }} className="px-8 py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs flex items-center gap-3 shadow-xl hover:scale-105 transition-all"><ArrowDownCircle size={20} /> توريد للمخزن</button>
               <button onClick={() => { setFormData({ ...formData, type: 'out', unitPriceEntry: 0 }); setShowModal('transaction'); }} className="px-8 py-5 bg-rose-600 text-white rounded-2xl font-black text-xs flex items-center gap-3 shadow-xl hover:scale-105 transition-all"><ArrowUpRight size={20} /> صرف من المخزن (بيع)</button>
               <button onClick={() => { setFormData({ ...formData, type: 'consume', unitPriceEntry: 0, targetId: '5201', description: 'صرف مستهلكات تشغيلية' }); setShowModal('transaction'); }} className="px-8 py-5 bg-amber-600 text-white rounded-2xl font-black text-xs flex items-center gap-3 shadow-xl hover:scale-105 transition-all"><Activity size={20} /> صرف استهلاك</button>
               <button onClick={() => { setFormData({ name: '', quantity: 0, unitPrice: 0, minQuantity: 5, category: 'كتب', location: 'A-1' }); setShowModal('item'); }} className="px-8 py-5 bg-slate-950 text-white rounded-2xl font-black text-xs flex items-center gap-3 shadow-xl">إضافة صنف جديد</button>
            </div>
         </div>

         <div className="flex bg-white/50 p-2 rounded-2xl border w-fit mx-auto gap-2 no-print">
            <button onClick={() => setActiveTab('stock')} className={`px-10 py-3 rounded-xl font-black text-xs transition-all ${activeTab === 'stock' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}>الرصيد الحالي</button>
            <button onClick={() => setActiveTab('history')} className={`px-10 py-3 rounded-xl font-black text-xs transition-all ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}>سجل العمليات (الحركات)</button>
         </div>

         {activeTab === 'stock' ? (
            <div className="glass-panel overflow-hidden bg-white border border-slate-100 rounded-[3rem] shadow-sm">
               <div className="p-8 border-b bg-slate-50/20 flex items-center gap-4">
                  <Search className="text-slate-300" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث في الأصناف..." className="flex-1 bg-transparent border-none outline-none font-bold text-sm text-right" />
               </div>
               <table className="w-full text-right">
                  <thead><tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 border-b"><th className="p-8">الصنف</th><th className="p-8 text-center">الكمية</th><th className="p-8 text-center">القيمة</th><th className="p-8 text-center">الحالة</th><th className="p-8 text-center">إجراء</th></tr></thead>
                  <tbody className="divide-y font-bold text-sm">
                     {inventoryItems.filter(i => i.name.includes(search)).map(item => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-all">
                           <td className="p-8"><p className="font-black text-slate-900">{item.name}</p><p className="text-[9px] text-slate-400 uppercase tracking-widest">CODE: {item.accountCode}</p></td>
                           <td className="p-8 text-center text-xl font-black tabular-nums">{item.quantity}</td>
                           <td className="p-8 text-center font-black text-indigo-700">{(item.quantity * item.unitPrice).toLocaleString()} ج.م</td>
                           <td className="p-8 text-center"><span className={`px-4 py-1.5 rounded-full text-[10px] font-black ${item.quantity <= item.minQuantity ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>{item.quantity <= item.minQuantity ? 'رصيد منخفض' : 'متوفر'}</span></td>
                           <td className="p-8 text-center"><button className="p-2 text-slate-300 hover:text-indigo-600"><Edit3 size={16} /></button></td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         ) : (
            <div className="glass-panel overflow-hidden bg-white border border-slate-100 rounded-[3rem] shadow-sm animate-view">
               <table className="w-full text-right">
                  <thead><tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 border-b"><th className="p-8">التاريخ</th><th className="p-8">النوع</th><th className="p-8">الصنف</th><th className="p-8 text-center">سعر الوحدة</th><th className="p-8 text-center">الكمية</th><th className="p-8 text-center">الإجمالي</th><th className="p-8">البيان</th></tr></thead>
                  <tbody className="divide-y font-bold text-sm">
                     {inventoryTransactions.map(t => (
                        <tr key={t.id} className="hover:bg-slate-50/50 group">
                           <td className="p-8 text-slate-400 font-mono text-xs">{t.date}</td>
                           <td className="p-8"><span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase flex items-center gap-2 w-fit ${t.type === 'in' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{t.type === 'in' ? <Inbox size={12} /> : <ArrowUpRight size={12} />} {t.type === 'in' ? 'توريد' : 'صرف'}</span></td>
                           <td className="p-8 font-black">{inventoryItems.find(i => i.id === t.itemId)?.name || 'صنف محذوف'}</td>
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
            <div onClick={() => setShowModal(null)} className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4">
               <div onClick={(e) => e.stopPropagation()} className="glass-panel w-full max-w-lg p-8 bg-white animate-view relative rounded-[3.5rem] shadow-3xl space-y-6">
                  <div className="flex justify-between items-center border-b pb-4">
                     <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">{formData.type === 'in' ? <Inbox className="text-emerald-600" size={24} /> : <ArrowUpCircle className="text-rose-600" size={24} />} تسجيل إذن {formData.type === 'in' ? 'توريد' : 'صرف'}</h3>
                     <button onClick={() => setShowModal(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-all"><X size={28} className="text-slate-400 hover:text-slate-900" /></button>
                  </div>
                  <div className="space-y-4">
                     <div className="space-y-1 text-right"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">الصنف</label>
                        <select value={formData.itemId} onChange={e => setFormData({ ...formData, itemId: e.target.value })} className="w-full p-4 bg-slate-50 border-none rounded-2xl font-black outline-none focus:ring-2 focus:ring-indigo-600/20">
                           <option value="">-- اختر الصنف من المستودع --</option>
                           {inventoryItems.map(i => <option key={i.id} value={i.id}>{i.name} (رصيد: {i.quantity})</option>)}
                        </select>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1 text-right">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">الكمية</label>
                           <input type="number" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl font-black text-center" />
                        </div>
                        <div className="space-y-1 text-right">
                           <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest px-2">{formData.type === 'in' ? 'سعر الشراء للوحدة' : 'سعر البيع للوحدة'}</label>
                           <input type="number" value={formData.unitPriceEntry} onChange={e => setFormData({ ...formData, unitPriceEntry: e.target.value })} className="w-full p-4 bg-indigo-50 border-2 border-indigo-200 rounded-2xl font-black text-center text-xl tabular-nums shadow-inner" />
                        </div>
                     </div>

                     <div className="p-6 bg-slate-900 rounded-3xl text-center shadow-xl space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">إجمالي قيمة الإذن</p>
                        <p className="text-4xl font-black text-white tabular-nums">{(parseFloat(formData.quantity || 0) * parseFloat(formData.unitPriceEntry || 0)).toLocaleString()} <span className="text-sm opacity-30">EGP</span></p>
                     </div>

                     {formData.type === 'in' ? (
                        <div className="grid grid-cols-2 gap-4 animate-view">
                           <div className="space-y-1 text-right">
                              <label className="text-[10px] font-black text-slate-400 uppercase px-2">المورد</label>
                              <select value={formData.supplierId} onChange={e => setFormData({ ...formData, supplierId: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl font-bold">
                                 <option value="">-- اختر المورد --</option>
                                 {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                              </select>
                           </div>
                           <div className="space-y-1 text-right">
                              <label className="text-[10px] font-black text-slate-400 uppercase px-2">خزينة الصرف / الدفع</label>
                              <div className="bg-slate-50 p-2 rounded-2xl">
                                 <label className="flex items-center gap-3 p-2 cursor-pointer mb-2 border-b">
                                    <input type="checkbox" checked={formData.isPaid} onChange={e => setFormData({ ...formData, isPaid: e.target.checked })} className="w-5 h-5 accent-emerald-600" />
                                    <span className="text-xs font-bold text-slate-700">دفع المبلغ (نقدي/تحويل) الآن؟</span>
                                 </label>
                                 {formData.isPaid && (
                                    <select value={formData.fundId} onChange={e => setFormData({ ...formData, fundId: e.target.value })} className="w-full p-2 bg-white border rounded-xl font-bold text-xs">
                                       {funds.map(f => <option key={f.id} value={f.accountCode}>{f.name}</option>)}
                                    </select>
                                 )}
                              </div>
                           </div>
                        </div>
                     ) : formData.type === 'consume' ? (
                        <div className="space-y-1 text-right animate-view">
                           <label className="text-[10px] font-black text-slate-400 uppercase px-2">حساب المصروف (Expense Account)</label>
                           <select value={formData.targetId} onChange={e => setFormData({ ...formData, targetId: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-amber-100 focus:border-amber-500 outline-none">
                              <option value="5201">مصروفات تشغيلية (5201)</option>
                              {financialCategories.filter(c => c.type === 'expense' || c.code.startsWith('5')).map(c => <option key={c.id} value={c.code}>{c.name} ({c.code})</option>)}
                           </select>
                           <p className="text-[10px] font-bold text-amber-600 px-2 mt-1">سيتم خصم القيمة من رصيد المخزون وإضافتها للمصروفات.</p>
                        </div>
                     ) : (
                        <div className="grid grid-cols-2 gap-4 animate-view">
                           <div className="space-y-1 text-right"><label className="text-[10px] font-black text-slate-400 uppercase px-2">العميل (طالب/موظف)</label>
                              <select value={formData.targetId} onChange={e => setFormData({ ...formData, targetId: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl font-bold">
                                 <option value="">-- اختر المستلم --</option>
                                 {allUsers.map(u => <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.role === UserRole.STUDENT ? 'طالب' : 'موظف'})</option>)}
                              </select>
                           </div>
                           <div className="space-y-1 text-right"><label className="text-[10px] font-black text-slate-400 uppercase px-2">خزينة التحصيل</label>
                              <select value={formData.fundId} onChange={e => setFormData({ ...formData, fundId: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl font-bold">
                                 {funds.map(f => <option key={f.id} value={f.accountCode}>{f.name}</option>)}
                              </select>
                           </div>
                        </div>
                     )}

                     <div className="space-y-1 text-right"><label className="text-[10px] font-black text-slate-400 uppercase px-2">البيان</label><input value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl font-bold" placeholder="مثال: توريد مذكرات الفيزياء 2024" /></div>

                     <button onClick={handleSaveTransaction} className="w-full py-6 bg-slate-950 text-white rounded-3xl font-black text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 hover:bg-indigo-600">
                        <CheckCircle2 size={24} /> ترحيل الإذن وتوليد القيود المالية
                     </button>
                  </div>
               </div>
            </div >
         )}

         {showModal === 'item' && (
            <div onClick={() => setShowModal(null)} className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4">
               <div onClick={(e) => e.stopPropagation()} className="glass-panel w-full max-w-lg p-8 bg-white animate-view relative rounded-[3.5rem] shadow-3xl space-y-6">
                  <div className="flex justify-between items-center border-b pb-4">
                     <h3 className="text-xl font-black text-slate-900 flex items-center gap-3"><Package className="text-slate-900" size={24} /> إضافة صنف جديد</h3>
                     <button onClick={() => setShowModal(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-all"><X size={28} className="text-slate-400 hover:text-slate-900" /></button>
                  </div>

                  <div className="space-y-4">
                     <div className="space-y-1 text-right">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">اسم الصنف</label>
                        <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl font-bold" placeholder="مثال: كتاب الفيزياء للصف الأول" autoFocus />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1 text-right">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">التصنيف</label>
                           <input
                              list="categories-list"
                              value={formData.category}
                              onChange={e => setFormData({ ...formData, category: e.target.value })}
                              className="w-full p-4 bg-slate-50 rounded-2xl font-bold"
                              placeholder="اختر أو اكتب تصنيفاً جديداً"
                           />
                           <datalist id="categories-list">
                              <option value="كتب" />
                              <option value="مذكرات" />
                              <option value="زي مدرسي" />
                              <option value="أدوات مكتبية" />
                              {Array.from(new Set(inventoryItems.map(i => i.category))).map((c: string) => <option key={c} value={c} />)}
                           </datalist>
                        </div>
                        <div className="space-y-1 text-right">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">الموقع (الرف)</label>
                           <input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl font-bold" />
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1 text-right">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">الكمية الافتتاحية</label>
                           <input type="number" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-center" />
                        </div>
                        <div className="space-y-1 text-right">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">الحد الأدنى</label>
                           <input type="number" value={formData.minQuantity} onChange={e => setFormData({ ...formData, minQuantity: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-center" />
                        </div>
                     </div>
                     <div className="space-y-1 text-right">
                        <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest px-2">سعر الوحدة (للبيع)</label>
                        <input type="number" value={formData.unitPrice} onChange={e => setFormData({ ...formData, unitPrice: e.target.value })} className="w-full p-4 bg-emerald-50 border-2 border-emerald-100 rounded-2xl font-black text-center text-xl" />
                     </div>

                     <button onClick={handleSaveItem} className="w-full py-6 bg-slate-950 text-white rounded-3xl font-black text-xl shadow-2xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 mt-4">
                        <Save size={24} /> حفظ الصنف الجديد
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div >
   );
};

const CheckCircle2 = ({ size }: any) => (
   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
   </svg>
);

export default InventoryModule;
