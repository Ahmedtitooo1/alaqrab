
import React, { useState, useRef } from 'react';
import { 
  User, Mail, Phone, Lock, Camera, Save, RefreshCw, 
  ShieldCheck, Package, DownloadCloud, ChevronRight, CheckCircle, Info,
  Layout, Type, Image as ImageIcon, Settings, UserCircle
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';

const SettingsView: React.FC = () => {
  const { t, lang, user, setUser, addNotification, systemName, systemLogo, setSystemName, setSystemLogo } = useAppContext();
  const isRtl = lang === 'ar';
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    username: user?.username || '',
    password: '' // Default empty for security
  });

  const [sysData, setSysData] = useState({
    name: systemName,
    logo: systemLogo
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleUpdateProfile = () => {
    if (!user) return;
    setIsUpdating(true);
    setTimeout(() => {
      // Update local user state
      setUser({ ...user, ...formData });
      setIsUpdating(false);
      addNotification({
        title: isRtl ? 'تحديث الحساب الشخصي' : 'Account Updated',
        content: isRtl ? 'تم حفظ تعديلات البيانات وكلمة المرور بنجاح.' : 'Data and password saved successfully.',
        type: 'success',
        date: new Date().toISOString()
      });
    }, 1000);
  };

  const handleUpdateSystem = () => {
    setSystemName(sysData.name);
    setSystemLogo(sysData.logo);
    addNotification({
      title: 'تحديث هوية المنظومة',
      content: 'تم تغيير اسم المنظومة والشعار بنجاح.',
      type: 'success',
      date: new Date().toISOString()
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSysData({...sysData, logo: reader.result as string});
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-12 animate-content pb-20">
      <div className="flex items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
         <div className="p-5 bg-slate-900 text-white rounded-[1.75rem] shadow-xl">
            <Settings size={36} />
         </div>
         <div>
            <h2 className="text-3xl font-black">{t('settings')}</h2>
            <p className="text-slate-500 font-bold">{isRtl ? 'تخصيص كامل للمنظومة والملف الشخصي' : 'Full customization of system and profile'}</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-10">
            
            {(user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN) && (
              <div className="glass-card p-10 bg-white border border-slate-200 space-y-10">
                <div className="flex items-center gap-4 border-b pb-6">
                   <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Layout size={24} /></div>
                   <h3 className="text-2xl font-black">إعدادات هوية المنظومة</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">اسم المنظومة (App Name)</label>
                         <div className="relative">
                            <Type className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input 
                               value={sysData.name}
                               onChange={e => setSysData({...sysData, name: e.target.value})}
                               className="w-full p-5 pr-12 bg-slate-50 border rounded-2xl font-black text-lg outline-none focus:border-blue-600" 
                            />
                         </div>
                      </div>
                      <button 
                        onClick={handleUpdateSystem}
                        className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-blue-700 transition-all"
                      >
                         تحديث الهوية البصرية
                      </button>
                   </div>

                   <div className="flex flex-col items-center gap-6 p-8 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">شعار المنظومة الحالي</p>
                      <div className="relative w-32 h-32 bg-white rounded-3xl border shadow-lg p-4 flex items-center justify-center group overflow-hidden">
                         <img src={sysData.logo} className="w-full h-full object-contain" alt="Logo Preview" />
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                            <button onClick={() => logoInputRef.current?.click()} className="p-3 bg-white text-black rounded-full shadow-xl"><ImageIcon size={20} /></button>
                         </div>
                      </div>
                      <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                      <p className="text-[10px] text-slate-400 font-bold">يفضل استخدام شعار بخلفية شفافة</p>
                   </div>
                </div>
              </div>
            )}

            <div className="glass-card p-10 bg-white border border-slate-200 space-y-10">
               <div className="flex flex-col md:flex-row items-center gap-10 border-b pb-10">
                  <div className="relative group">
                     <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} 
                        className="w-32 h-32 rounded-[2.5rem] bg-slate-100 border-4 border-white shadow-2xl p-1" 
                        alt="Profile" 
                     />
                     <button className="absolute -bottom-2 -right-2 p-3 bg-slate-900 text-white rounded-2xl shadow-xl hover:scale-110 transition-all">
                        <Camera size={20} />
                     </button>
                  </div>
                  <div className="text-center md:text-right">
                     <h3 className="text-3xl font-black">{user?.firstName} {user?.lastName}</h3>
                     <p className="text-blue-600 font-black uppercase tracking-widest text-xs mt-2">{t(user?.role || '')}</p>
                     <div className="flex items-center gap-3 mt-4 px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-full w-fit mx-auto md:mx-0 border border-emerald-100">
                        <ShieldCheck size={16} />
                        <span className="text-[10px] font-black uppercase">حساب موثق إدارياً</span>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                     <h4 className="font-black text-lg border-b pb-4 flex items-center gap-2"><UserCircle className="text-blue-600" size={20} /> البيانات الشخصية</h4>
                     <div className="space-y-4">
                        <div className="space-y-1">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">الاسم الأول</label>
                           <input value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-xl font-bold" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">الاسم الأخير</label>
                           <input value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-xl font-bold" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">البريد الإلكتروني</label>
                           <input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-xl font-bold" />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-8">
                     <h4 className="font-black text-lg border-b pb-4 flex items-center gap-2"><Lock className="text-rose-600" size={20} /> أمان الحساب والوصول</h4>
                     <div className="space-y-4">
                        <div className="space-y-1">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">اسم المستخدم (Username)</label>
                           <input value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-xl font-mono text-blue-700 font-bold" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">كلمة المرور الجديدة</label>
                           <input type="password" value={formData.password} placeholder="••••••••" onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-xl font-bold" />
                        </div>
                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3">
                           <Info size={16} className="text-amber-500 mt-1 flex-shrink-0" />
                           <p className="text-[10px] text-amber-800 font-bold leading-relaxed">عند تغيير اسم المستخدم، سيتم استخدامه في عمليات تسجيل الدخول القادمة. اترك كلمة المرور فارغة إذا كنت لا تريد تغييرها.</p>
                        </div>
                     </div>
                  </div>
               </div>

               <button 
                  onClick={handleUpdateProfile}
                  disabled={isUpdating}
                  className="w-full py-6 bg-slate-950 text-white rounded-3xl font-black text-xl flex items-center justify-center gap-4 hover:scale-[1.01] shadow-2xl transition-all"
               >
                  {isUpdating ? <RefreshCw className="animate-spin" size={24} /> : <Save size={24} />}
                  حفظ كافة التغييرات
               </button>
            </div>
         </div>

         <div className="space-y-10">
            <div className="glass-card p-10 bg-slate-950 text-white shadow-2xl">
               <h3 className="text-xl font-black flex items-center gap-3 mb-10">
                  <Package className="text-blue-500" /> {isRtl ? 'إصدار المنظومة' : 'System Version'}
               </h3>
               <div className="space-y-6">
                  <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10">
                     <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black uppercase text-slate-400">Current Stable</span>
                        <span className="px-4 py-1 bg-blue-600 text-white rounded-full text-[10px] font-black tracking-widest">v2.5.0</span>
                     </div>
                     <p className="text-xs font-bold leading-relaxed text-slate-300">أنت تستخدم النسخة الاحترافية من نظام العقرب لإدارة المؤسسات التعليمية.</p>
                  </div>
               </div>
            </div>
         </div>

      </div>
    </div>
  );
};

export default SettingsView;
