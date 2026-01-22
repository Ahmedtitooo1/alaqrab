
import React, { useState } from 'react';
import {
    Calculator, Plus, Trash2, Save, X, Percent
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { GradingFormula } from '../types';

const GradingStandards: React.FC = () => {
    const { gradingFormulas, addGradingFormula, isRtl } = useAppContext();
    const [showModal, setShowModal] = useState(false);
    const [newFormula, setNewFormula] = useState<{ name: string, components: { name: string, weight: number, maxScore: number }[] }>({
        name: '',
        components: [{ name: 'Exam', weight: 100, maxScore: 100 }]
    });

    const handleAddComponent = () => {
        setNewFormula(prev => ({
            ...prev,
            components: [...prev.components, { name: '', weight: 0, maxScore: 100 }]
        }));
    };

    const updateComponent = (index: number, field: 'name' | 'weight' | 'maxScore', value: any) => {
        const updated = [...newFormula.components];
        // @ts-ignore
        updated[index][field] = value;
        setNewFormula({ ...newFormula, components: updated });
    };

    const removeComponent = (index: number) => {
        const updated = newFormula.components.filter((_, i) => i !== index);
        setNewFormula({ ...newFormula, components: updated });
    };

    const handleSave = () => {
        const totalWeight = newFormula.components.reduce((sum, c) => sum + Number(c.weight), 0);
        if (totalWeight !== 100) return alert('Total weight must be 100%');

        const formula: GradingFormula = {
            id: Date.now().toString(),
            name: newFormula.name,
            components: newFormula.components,
            createdAt: new Date().toISOString(),
            institutionId: 'tenant-1'
        };

        addGradingFormula(formula);
        setShowModal(false);
        setNewFormula({ name: '', components: [{ name: 'Exam', weight: 100, maxScore: 100 }] });
    };

    return (
        <div className="space-y-6 animate-view p-6" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <Calculator className="text-indigo-600" size={32} />
                        معادلات الدرجات
                    </h2>
                    <p className="text-slate-500 font-bold mt-1">تخصيص أوزان التقييمات والاختبارات</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg"
                >
                    <Plus size={20} /> معادلة جديدة
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gradingFormulas.map(formula => (
                    <div key={formula.id} className="bg-white p-6 rounded-3xl border shadow-sm flex flex-col gap-4">
                        <h3 className="text-xl font-black text-slate-900">{formula.name}</h3>
                        <div className="space-y-3">
                            {formula.components.map((comp, i) => (
                                <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-700">{comp.name}</span>
                                        <span className="text-[10px] bg-slate-200 px-1 rounded font-mono text-slate-500">Max: {comp.maxScore}</span>
                                    </div>
                                    <span className="font-black text-indigo-600 flex items-center gap-1">
                                        {comp.weight} <Percent size={12} />
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden animate-scale-in">
                        <div className="p-6 border-b bg-slate-50 flex justify-between items-center">
                            <h3 className="text-xl font-black">إضافة معادلة تصحيح</h3>
                            <button onClick={() => setShowModal(false)}><X size={24} className="text-slate-400" /></button>
                        </div>
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase">اسم المعادلة</label>
                                <input
                                    value={newFormula.name}
                                    onChange={e => setNewFormula({ ...newFormula, name: e.target.value })}
                                    className="w-full p-3 bg-slate-50 rounded-xl font-bold border-2 border-transparent focus:border-indigo-500 outline-none"
                                    placeholder="مثال: الترم الأول (ثانوي)"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase">مكونات الدرجة</label>
                                {newFormula.components.map((comp, i) => (
                                    <div key={i} className="flex gap-2">
                                        <input
                                            value={comp.name}
                                            onChange={e => updateComponent(i, 'name', e.target.value)}
                                            className="flex-[2] p-3 bg-slate-50 rounded-xl font-bold text-sm"
                                            placeholder="اسم المكون"
                                        />
                                        <input
                                            type="number"
                                            value={comp.weight}
                                            onChange={e => updateComponent(i, 'weight', parseFloat(e.target.value))}
                                            className="flex-1 p-3 bg-slate-50 rounded-xl font-black text-center"
                                            placeholder="%"
                                        />
                                        <input
                                            type="number"
                                            value={comp.maxScore}
                                            onChange={e => updateComponent(i, 'maxScore', parseFloat(e.target.value))}
                                            className="flex-1 p-3 bg-slate-50 rounded-xl font-black text-center text-slate-500"
                                            placeholder="Max"
                                            title="الدرجة العظمى"
                                        />
                                        <button onClick={() => removeComponent(i)} className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl"><Trash2 size={18} /></button>
                                    </div>
                                ))}
                                <button onClick={handleAddComponent} className="w-full py-3 bg-slate-100 text-slate-600 font-bold rounded-xl border border-dashed border-slate-300 hover:text-indigo-600 hover:border-indigo-300 transition-all">+ إضافة مكون</button>

                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-xs font-bold text-slate-400">الإجمالي:</span>
                                    <span className={`font-black ${newFormula.components.reduce((s, c) => s + Number(c.weight), 0) === 100 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {newFormula.components.reduce((s, c) => s + Number(c.weight), 0)}%
                                    </span>
                                </div>
                            </div>

                            <button onClick={handleSave} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-lg">حفظ المعادلة</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GradingStandards;
