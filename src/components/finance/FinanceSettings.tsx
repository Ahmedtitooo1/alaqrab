
import React, { useEffect, useState } from 'react';
import { FinanceConfig } from '../../types'; // Adjust path
import { getFinanceConfig, saveConfig } from '../../services/mockFinance';
import { Save, CheckCircle } from 'lucide-react';

const FinanceSettings: React.FC = () => {
    const [config, setConfig] = useState<FinanceConfig>({
        companyName: '',
        taxNumber: '',
        vatRate: 0,
        currency: 'EGP',
        isTaxIncluded: true
    });
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setSaved(false);
        const data = getFinanceConfig();
        if (data) setConfig(data);
    }, []);

    const handleSave = () => {
        saveConfig(config);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black mb-6 text-slate-800">إعدادات النظام المالي</h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-600 mb-2">اسم المؤسسة (للإيصالات)</label>
                    <input
                        value={config.companyName}
                        onChange={e => setConfig({ ...config, companyName: e.target.value })}
                        className="w-full p-3 border rounded-xl font-bold"
                        placeholder="مثال: أكاديمية العقرب"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">الرقم الضريبي</label>
                        <input
                            value={config.taxNumber}
                            onChange={e => setConfig({ ...config, taxNumber: e.target.value })}
                            className="w-full p-3 border rounded-xl font-mono font-bold"
                            placeholder="TRN-XXXX"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">نسبة الضريبة (%)</label>
                        <input
                            type="number"
                            value={config.vatRate}
                            onChange={e => setConfig({ ...config, vatRate: Number(e.target.value) })}
                            className="w-full p-3 border rounded-xl font-bold"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-600 mb-2">العملة الافتراضية</label>
                    <select
                        value={config.currency}
                        onChange={e => setConfig({ ...config, currency: e.target.value })}
                        className="w-full p-3 border rounded-xl font-bold bg-white"
                    >
                        <option value="EGP">J.M (EGP)</option>
                        <option value="USD">USD ($)</option>
                        <option value="SAR">SAR</option>
                    </select>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <input
                        type="checkbox"
                        checked={config.isTaxIncluded}
                        onChange={e => setConfig({ ...config, isTaxIncluded: e.target.checked })}
                        className="w-5 h-5 accent-indigo-600"
                    />
                    <div>
                        <p className="font-bold text-slate-800">الأسعار شاملة الضريبة</p>
                        <p className="text-xs text-slate-500">عند التفعيل، سيتم احتساب الضريبة كجزء من المبلغ المدخل.</p>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                    {saved ? <><CheckCircle size={20} /> تم الحفظ بنجاح</> : <><Save size={20} /> حفظ الإعدادات</>}
                </button>
            </div>
        </div>
    );
};

export default FinanceSettings;
