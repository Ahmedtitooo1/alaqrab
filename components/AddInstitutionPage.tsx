
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { ClientType, PricingModel, Institution, UserRole } from '../types';
import { Globe, X, Save, Calculator, BrainCircuit, MonitorPlay, Wallet, Palette, ArrowLeft, ArrowRight } from 'lucide-react';

const AddInstitutionPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { addInstitution, addEmployeeRecord, addNotification, lang } = useAppContext();
    const isRtl = lang === 'ar';

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
        limits: { admins: 1, teachers: 5, accountants: 1, secretaries: 1, students: 200 },
        defaultCurrency: 'EGP',
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
        onBack();
    };

    return (
        <div className="animate-view p-6 bg-white min-h-screen">
            <div className="flex justify-between items-center border-b pb-8 mb-8">
                <div className="flex items-center gap-6">
                    <button onClick={onBack} className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all text-slate-500">
                        {isRtl ? <ArrowRight size={24} /> : <ArrowLeft size={24} />}
                    </button>
                    <div className="p-4 bg-indigo-600 text-white rounded-[1.5rem] shadow-xl"><Globe size={32} /></div>
                    <h3 className="text-3xl font-black tracking-tighter italic uppercase text-slate-900">Deploy New Environment</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 text-right">
                {/* الأساسيات والحدود */}
                <div className="space-y-12">
                    <div className="space-y-8">
                        <h4 className="text-sm font-black text-indigo-600 uppercase tracking-[0.3em] flex items-center gap-4 border-r-4 border-indigo-600 pr-4">1. المؤسسة والمدير</h4>
                        <div className="space-y-8">
                            <div className="space-y-2"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">اسم الجهة التعليمية</label><input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-3xl font-black text-xl outline-none transition-all shadow-inner" placeholder="مثال: أكاديمية النخبة" /></div>
                            <div className="space-y-2"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">النطاق الفرعي (SUBDOMAIN)</label><div className="relative"><input value={formData.subdomain} onChange={e => setFormData({ ...formData, subdomain: e.target.value })} className="w-full p-6 pr-8 pl-48 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-3xl font-black text-xl outline-none text-left font-mono" placeholder="elite-branch" /><span className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 font-bold font-mono text-lg">.aleaqrab.com</span></div></div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-6">
                            <div className="space-y-2"><label className="text-[11px] font-black text-slate-400">يوزر المدير</label><input onChange={e => setFormData({ ...formData, adminData: { ...formData.adminData, username: e.target.value } })} className="w-full p-5 bg-indigo-50/50 rounded-2xl font-black border-none" /></div>
                            <div className="space-y-2"><label className="text-[11px] font-black text-slate-400">كلمة المرور</label><input type="password" onChange={e => setFormData({ ...formData, adminData: { ...formData.adminData, password: e.target.value } })} className="w-full p-5 bg-indigo-50/50 rounded-2xl font-black border-none" /></div>
                        </div>

                    </div>

                    <div className="space-y-8">
                        <h4 className="text-sm font-black text-emerald-600 uppercase tracking-[0.3em] flex items-center gap-4 border-r-4 border-emerald-600 pr-4">2. تخصيص الموارد والحدود القصوى</h4>
                        <div className="grid grid-cols-2 gap-8 bg-slate-50 p-12 rounded-[4rem] shadow-inner">
                            <QuotaInput label="عدد المديرين" val={formData.limits.admins} onChange={(v: number) => setFormData({ ...formData, limits: { ...formData.limits, admins: v } })} />
                            <QuotaInput label="عدد المعلمين" val={formData.limits.teachers} onChange={(v: number) => setFormData({ ...formData, limits: { ...formData.limits, teachers: v } })} />
                            <QuotaInput label="عدد المحاسبين" val={formData.limits.accountants} onChange={(v: number) => setFormData({ ...formData, limits: { ...formData.limits, accountants: v } })} />
                            <QuotaInput label="سكرتارية واستقبال" val={formData.limits.secretaries} onChange={(v: number) => setFormData({ ...formData, limits: { ...formData.limits, secretaries: v } })} />
                            <QuotaInput label="عدد الطلاب المسموح" val={formData.limits.students} highlight onChange={(v: number) => setFormData({ ...formData, limits: { ...formData.limits, students: v } })} />
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

                    <div className="glass-panel bg-slate-900 text-white p-12 space-y-10 relative overflow-hidden rounded-[2.5rem]">
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
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-2">العملة الأساسية</label>
                                    <select value={formData.defaultCurrency} onChange={e => setFormData({ ...formData, defaultCurrency: e.target.value })} className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl font-black text-white text-xl outline-none focus:border-indigo-500 [&>option]:text-black">
                                        <option value="EGP">EGP - الجنيه المصري</option>
                                        <option value="SAR">SAR - الريال السعودي</option>
                                        <option value="USD">USD - الدولار الأمريكي</option>
                                        <option value="AED">AED - الدرهم الإماراتي</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-emerald-500 uppercase tracking-widest px-2">الدفعة المقدمة (Deposit)</label>
                                    <input type="number" value={formData.pricing.paidAmount} onChange={e => setFormData({ ...formData, pricing: { ...formData.pricing, paidAmount: Number(e.target.value) } })} className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl font-black text-white text-2xl tabular-nums outline-none focus:border-indigo-500" />
                                </div>
                            </div>

                            <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-between">
                                <div><p className="text-[10px] font-black uppercase text-slate-500 mb-1">إجمالي قيمة العقد</p><p className="text-4xl font-black text-white tabular-nums">{calculatedTotal.toLocaleString()} <span className="text-lg opacity-40">EGP</span></p></div>
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

            <div className="pt-12 border-t flex gap-6 mt-10">
                <button onClick={onBack} className="px-12 py-8 bg-slate-100 text-slate-400 rounded-[2.5rem] font-black text-xl hover:bg-slate-200 transition-all">إلغاء</button>
                <button onClick={handleSaveInstitution} className="btn-update-premium flex-1 py-8 bg-indigo-600 text-white rounded-[2.5rem] font-black text-3xl flex items-center justify-center gap-8 shadow-3xl active:scale-[0.98] transition-all hover:bg-indigo-700">
                    <Save size={40} strokeWidth={3} /> تفعيل ونشر البيئة
                </button>
            </div>

        </div>
    );
};

const QuotaInput = ({ label, val, onChange, highlight }: any) => (
    <div className="space-y-3 text-right">
        <label className="text-[11px] font-black text-slate-400 uppercase px-2 tracking-widest">{label}</label>
        <input type="number" value={val} onChange={e => onChange?.(parseInt(e.target.value) || 0)} className={`w-full p-6 rounded-[2rem] text-center font-black text-3xl border-2 shadow-inner outline-none transition-all ${highlight ? 'border-indigo-200 bg-indigo-50 text-indigo-900 focus:border-indigo-600' : 'border-slate-100 bg-white text-slate-900 focus:border-indigo-600'}`} />
    </div>
);

const PermissionItem = ({ label, active, onClick, icon }: any) => (
    <button onClick={onClick} className={`w-full p-8 rounded-[3rem] border-2 transition-all flex items-center justify-between group ${active ? 'border-indigo-200 bg-indigo-50/50 shadow-sm' : 'border-slate-100 bg-white grayscale opacity-50'}`}>
        <div className="flex items-center gap-6">
            <div className={`p-4 rounded-2xl transition-all ${active ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>{icon}</div>
            <span className={`text-lg font-black ${active ? 'text-indigo-950' : 'text-slate-400'}`}>{label}</span>
        </div>
        <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all ${active ? 'bg-indigo-600 border-indigo-100 text-white' : 'border-slate-100 text-transparent'}`}><div className="w-3 h-3 bg-current rounded-full"></div></div>
    </button>
);

export default AddInstitutionPage;
