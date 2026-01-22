
import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle, Store, Coins, Percent, FileText } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { FinancialSettings } from '../../types';

const FinanceSettings: React.FC = () => {
    const { financialSettings, saveFinancialSettings, addNotification, lang } = useAppContext();
    const isRtl = lang === 'ar';

    const [formData, setFormData] = useState<FinancialSettings>(financialSettings);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setFormData(financialSettings);
    }, [financialSettings]);

    const handleSave = () => {
        setIsSaving(true);

        // Validation
        if (formData.taxRate < 0) {
            addNotification({ title: 'Error', content: 'Tax Rate cannot be negative.', type: 'error' });
            setIsSaving(false);
            return;
        }

        try {
            // Simulate API delay
            setTimeout(() => {
                saveFinancialSettings(formData);
                addNotification({ title: 'Success', content: 'Settings Saved Successfully', type: 'success' });
                setIsSaving(false);
            }, 800);
        } catch (e) {
            addNotification({ title: 'Error', content: 'Failed to save settings to storage.', type: 'error' });
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-10 animate-view pb-20">
            <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border shadow-sm">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <Store className="text-indigo-600" /> {isRtl ? 'إعدادات النظام المالي' : 'Finance Configuration'}
                    </h2>
                    <p className="text-slate-500 font-bold mt-1 max-w-2xl">
                        {isRtl ? 'تكوين بيانات الشركة، الضرائب، والسياسات المالية.' : 'Configure company details, tax rules, and financial policies.'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Company & Tax Info */}
                <div className="glass-panel bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
                    <h3 className="text-xl font-black flex items-center gap-2"><FileText className="text-indigo-600" /> الأساسيات الضريبية</h3>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-black text-slate-400 uppercase px-2">اسم الشركة / المؤسسة (للفواتير)</label>
                            <input
                                value={formData.companyName}
                                onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                                className="w-full p-4 bg-slate-50 rounded-2xl font-black border-2 border-transparent focus:border-indigo-500 outline-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-black text-slate-400 uppercase px-2">الرقم الضريبي (TRN / VAT ID)</label>
                            <input
                                value={formData.taxId}
                                onChange={e => setFormData({ ...formData, taxId: e.target.value })}
                                className="w-full p-4 bg-slate-50 rounded-2xl font-mono font-black border-2 border-transparent focus:border-indigo-500 outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-black text-slate-400 uppercase px-2">العملة الأساسية</label>
                                <div className="p-4 bg-slate-50 rounded-2xl font-black text-slate-500 flex items-center gap-2">
                                    <Coins size={16} /> {formData.currency}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-black text-slate-400 uppercase px-2">نسبة الضريبة (%)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.taxRate}
                                        onChange={e => setFormData({ ...formData, taxRate: parseFloat(e.target.value) })}
                                        className="w-full p-4 bg-slate-50 rounded-2xl font-black text-center border-2 border-transparent focus:border-indigo-500 outline-none"
                                    />
                                    <Percent size={14} className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Policies */}
                <div className="glass-panel bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-8 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-black flex items-center gap-2"><CheckCircle className="text-emerald-600" /> سياسات الاحتساب</h3>

                        <div className="mt-8 space-y-4">
                            <label className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl cursor-pointer border-2 border-transparent hover:border-indigo-200 transition-all">
                                <input
                                    type="checkbox"
                                    checked={formData.isTaxInclusive}
                                    onChange={e => setFormData({ ...formData, isTaxInclusive: e.target.checked })}
                                    className="w-6 h-6 rounded-lg text-indigo-600 accent-indigo-600"
                                />
                                <div>
                                    <p className="font-black text-slate-900">الأسعار شاملة الضريبة (Tax Inclusive)</p>
                                    <p className="text-xs font-bold text-slate-400 mt-1">عند تفعيله، سيقوم النظام بخصم الضريبة من المبلغ المدخل تلقائياً.</p>
                                </div>
                            </label>

                            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="text-amber-600 shrink-0" size={20} />
                                    <div>
                                        <p className="font-black text-amber-800 text-sm">تنبيه هام</p>
                                        <p className="text-xs font-bold text-amber-600 mt-1 leading-relaxed">
                                            تغيير نسبة الضريبة لن يؤثر على السندات المرحلة سابقاً، ولكن سيتم تطبيقه على أي عمليات جديدة بدءاً من الآن.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSaving ? 'Running Checks...' : (
                            <>
                                <Save size={24} /> حفظ الإعدادات
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FinanceSettings;
