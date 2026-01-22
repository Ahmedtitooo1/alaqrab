import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, Lock, BellOff, Power, RotateCcw, Siren, PhoneCall } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const PanicModeModule: React.FC = () => {
    const { systemName, addNotification } = useAppContext();
    const [activeStep, setActiveStep] = useState<'idle' | 'confirm' | 'active'>('idle');
    const [panicType, setPanicType] = useState<'evacuate' | 'lockdown' | 'silent'>('evacuate');

    const handleActivate = () => {
        setActiveStep('active');
        addNotification({
            title: '🚨 حالة طوارئ قصوى',
            content: `تم تفعيل نظام الطوارئ (${panicType === 'evacuate' ? 'إخلاء' : panicType === 'lockdown' ? 'إغلاق كامل' : 'تنبيه صامت'}).`,
            type: 'error',
            date: new Date().toISOString()
        });
        // Here we would trigger backend alerts
    };

    const handleDeactivate = () => {
        setActiveStep('idle');
        addNotification({
            title: '✅ انتهاء حالة الطوارئ',
            content: 'عادت الأنظمة للعمل بشكل طبيعي.',
            type: 'success',
            date: new Date().toISOString()
        });
    };

    if (activeStep === 'active') {
        return (
            <div className="fixed inset-0 z-[2000] bg-red-950 flex flex-col items-center justify-center text-white animate-pulse">
                <Siren size={200} className="mb-10 animate-ping" />
                <h1 className="text-9xl font-black mb-4 uppercase tracking-tighter">EMERGENCY</h1>
                <p className="text-4xl font-bold mb-12 opacity-80">{panicType === 'evacuate' ? 'إخلاء المبنى فوراً' : panicType === 'lockdown' ? 'إغلاق جميع المداخل' : 'تنبيه أمني صامت'}</p>
                <div className="p-8 bg-black/30 rounded-[3rem] text-center border-4 border-red-500">
                    <p className="text-2xl font-black mb-4">لاتخاذ إجراء، يرجى التواصل مع الأمن</p>
                    <button onClick={handleDeactivate} className="px-12 py-6 bg-white text-red-600 rounded-full font-black text-2xl hover:scale-105 transition-all flex items-center gap-4 mx-auto">
                        <RotateCcw size={32} /> إلغاء حالة الطوارئ
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-view">
            <div className="p-12 rounded-[3.5rem] bg-rose-50 border-2 border-rose-100 flex items-center justify-between shadow-xl">
                <div className="space-y-4">
                    <h2 className="text-4xl font-black text-rose-700 flex items-center gap-4"><Siren size={48} className="animate-pulse" /> نقطة التحكم في الطوارئ (Panic API)</h2>
                    <p className="text-rose-400 font-bold text-lg">تفعيل بروتوكولات الأمان القصوى بضغطة زر واحدة.</p>
                </div>
                <div className="w-24 h-24 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                    <ShieldAlert size={48} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <button
                    onClick={() => { setPanicType('evacuate'); setActiveStep('confirm'); }}
                    className={`p-10 rounded-[3rem] border-4 transition-all flex flex-col items-center gap-6 group ${activeStep === 'confirm' && panicType === 'evacuate' ? 'bg-rose-600 text-white border-rose-800 scale-105 shadow-2xl' : 'bg-white border-rose-100 hover:border-rose-600'}`}
                >
                    <div className={`p-6 rounded-3xl ${activeStep === 'confirm' && panicType === 'evacuate' ? 'bg-white text-rose-600' : 'bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors'}`}>
                        <BellOff size={48} />
                    </div>
                    <div className="text-center">
                        <h3 className={`text-2xl font-black mb-2 ${activeStep === 'confirm' && panicType === 'evacuate' ? 'text-white' : 'text-slate-900'}`}>Protocol: EVACUATE</h3>
                        <p className={`text-sm font-bold ${activeStep === 'confirm' && panicType === 'evacuate' ? 'text-rose-100' : 'text-slate-400'}`}>إطلاق صافرات الإنذار وإخلاء المبنى</p>
                    </div>
                </button>

                <button
                    onClick={() => { setPanicType('lockdown'); setActiveStep('confirm'); }}
                    className={`p-10 rounded-[3rem] border-4 transition-all flex flex-col items-center gap-6 group ${activeStep === 'confirm' && panicType === 'lockdown' ? 'bg-slate-900 text-white border-black scale-105 shadow-2xl' : 'bg-white border-slate-100 hover:border-slate-900'}`}
                >
                    <div className={`p-6 rounded-3xl ${activeStep === 'confirm' && panicType === 'lockdown' ? 'bg-white text-slate-900' : 'bg-slate-50 text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors'}`}>
                        <Lock size={48} />
                    </div>
                    <div className="text-center">
                        <h3 className={`text-2xl font-black mb-2 ${activeStep === 'confirm' && panicType === 'lockdown' ? 'text-white' : 'text-slate-900'}`}>Protocol: LOCKDOWN</h3>
                        <p className={`text-sm font-bold ${activeStep === 'confirm' && panicType === 'lockdown' ? 'text-slate-400' : 'text-slate-400'}`}>إغلاق إلكتروني للأبواب وعزل القاعات</p>
                    </div>
                </button>

                <button
                    onClick={() => { setPanicType('silent'); setActiveStep('confirm'); }}
                    className={`p-10 rounded-[3rem] border-4 transition-all flex flex-col items-center gap-6 group ${activeStep === 'confirm' && panicType === 'silent' ? 'bg-amber-500 text-white border-amber-600 scale-105 shadow-2xl' : 'bg-white border-amber-100 hover:border-amber-500'}`}
                >
                    <div className={`p-6 rounded-3xl ${activeStep === 'confirm' && panicType === 'silent' ? 'bg-white text-amber-500' : 'bg-amber-50 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors'}`}>
                        <PhoneCall size={48} />
                    </div>
                    <div className="text-center">
                        <h3 className={`text-2xl font-black mb-2 ${activeStep === 'confirm' && panicType === 'silent' ? 'text-white' : 'text-slate-900'}`}>Protocol: SILENT</h3>
                        <p className={`text-sm font-bold ${activeStep === 'confirm' && panicType === 'silent' ? 'text-amber-100' : 'text-slate-400'}`}>إشعار الأمن والإدارة دون إثارة الذعر</p>
                    </div>
                </button>
            </div>

            {activeStep === 'confirm' && (
                <div className="p-12 mt-10 bg-slate-900 rounded-[3rem] text-center text-white space-y-8 animate-view border-4 border-dashed border-slate-700">
                    <AlertTriangle size={64} className="mx-auto text-yellow-400 animate-bounce" />
                    <div>
                        <h3 className="text-3xl font-black text-white">هل أنت متأكد من تفعيل البروتوكول؟</h3>
                        <p className="text-slate-400 mt-2 font-bold max-w-xl mx-auto">سيتم إرسال إشعارات فورية لجميع الأجهزة المتصلة ({panicType}). هذا الإجراء يتم تسجيله في الصندوق الأسود.</p>
                    </div>
                    <div className="flex justify-center gap-6">
                        <button onClick={() => setActiveStep('idle')} className="px-8 py-4 bg-slate-800 text-slate-300 rounded-2xl font-black hover:bg-slate-700 transition-all">تراجع</button>
                        <button onClick={handleActivate} className="px-12 py-4 bg-rose-600 text-white rounded-2xl font-black shadow-xl hover:bg-rose-500 hover:scale-105 transition-all active:scale-95 flex items-center gap-3">
                            <Power size={24} /> تأكيد التنفيذ فوراً
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PanicModeModule;
