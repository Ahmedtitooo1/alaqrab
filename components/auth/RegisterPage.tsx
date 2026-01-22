
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Building, GraduationCap, ArrowRight, ArrowLeft, CheckSquare } from 'lucide-react';

const steps = ['User Information', 'Organization', 'Select Environment'];

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register, isLoading } = useAuth();
    const [activeStep, setActiveStep] = useState(0);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'admin',
        organizationName: '',
        tenantType: '' as 'tutor' | 'center' | 'school' | ''
    });

    const handleNext = () => {
        if (activeStep === 0) {
            if (!formData.firstName || !formData.email || !formData.password) {
                setError('Please fill in all required fields');
                return;
            }
        } else if (activeStep === 1) {
            if (!formData.organizationName) {
                setError('Please enter your organization or center name');
                return;
            }
        } else if (activeStep === 2) {
            if (!formData.tenantType) {
                setError('Please select an environment type');
                return;
            }
            handleSubmit();
            return;
        }

        setError('');
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
        setError('');
    };

    const [showSuccess, setShowSuccess] = useState(false);
    const [credentials, setCredentials] = useState({ username: '', password: '' });

    const handleSubmit = async () => {
        try {
            const response: any = await register({ ...formData, role: 'admin' });
            if (response && response.credentials) {
                setCredentials(response.credentials);
                setShowSuccess(true);
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Registration failed. Please try again.');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (showSuccess) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col py-8 items-center justify-center p-4">
                <div className="bg-white w-full max-w-lg p-12 rounded-[3.5rem] shadow-3xl text-center space-y-8 animate-view border-t-8 border-green-600">
                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <GraduationCap size={48} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-slate-900">تم إنشاء بيئتك بنجاح!</h2>
                        <p className="text-slate-500 font-bold">يرجى حفظ بيانات الدخول الخاصة بك للوصول للنظام.</p>
                    </div>

                    <div className="bg-slate-50 p-8 rounded-3xl space-y-4 border-2 border-dashed border-slate-200">
                        <div className="text-right">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">اسم المستخدم</label>
                            <div className="p-4 bg-white border rounded-2xl font-black text-slate-800 text-lg shadow-sm">{credentials.username}</div>
                        </div>
                        <div className="text-right">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">كلمة المرور</label>
                            <div className="p-4 bg-white border rounded-2xl font-black text-slate-800 text-lg shadow-sm">{credentials.password}</div>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full py-5 bg-slate-950 text-white rounded-[2rem] font-black text-xl shadow-2xl hover:bg-indigo-600 transition-all active:scale-95"
                    >
                        دخول لوحة التحكم
                    </button>
                </div>
            </div>
        );
    }

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-right" dir="rtl">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase mr-1">الاسم الأول</label>
                            <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full p-4 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-600 outline-none font-bold" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase mr-1">اسم العائلة</label>
                            <input required name="lastName" value={formData.lastName} onChange={handleChange} className="w-full p-4 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-600 outline-none font-bold" />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-xs font-bold text-slate-500 uppercase mr-1">البريد الإلكتروني</label>
                            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-4 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-600 outline-none font-bold text-left" />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-xs font-bold text-slate-500 uppercase mr-1">كلمة المرور</label>
                            <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-4 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-600 outline-none font-bold text-left" placeholder="اختر كلمة مرور قوية" />
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div className="mt-4 space-y-4 text-right" dir="rtl">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase mr-1">اسم المركز / المنظمة</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                                    <Building size={20} />
                                </div>
                                <input required name="organizationName" value={formData.organizationName} onChange={handleChange} className="w-full pr-12 p-4 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-600 outline-none font-bold" placeholder="مثال: أكاديمية النور التعليمية" />
                            </div>
                            <p className="text-xs text-slate-400 mt-1 mr-1">سيظهر هذا الاسم في كافة التقارير والفواتير.</p>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-right" dir="rtl">
                        <div
                            onClick={() => setFormData({ ...formData, tenantType: 'tutor' })}
                            className={`cursor-pointer p-6 rounded-2xl border-2 transition-all hover:shadow-lg flex flex-col items-center text-center gap-4 ${formData.tenantType === 'tutor' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 bg-white'}`}
                        >
                            <div className={`p-4 rounded-full ${formData.tenantType === 'tutor' ? 'bg-blue-600 text-white shadow-lg' : 'bg-blue-50 text-blue-600'}`}>
                                <User size={32} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-900">معلم فردي</h3>
                                <p className="text-[10px] text-slate-500 mt-1 font-bold">للمعلمين المستقلين والمحاضرين</p>
                            </div>
                        </div>

                        <div
                            onClick={() => setFormData({ ...formData, tenantType: 'center' })}
                            className={`cursor-pointer p-6 rounded-2xl border-2 transition-all hover:shadow-lg flex flex-col items-center text-center gap-4 ${formData.tenantType === 'center' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 bg-white'}`}
                        >
                            <div className={`p-4 rounded-full ${formData.tenantType === 'center' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-indigo-50 text-indigo-600'}`}>
                                <Building size={32} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-900">مركز تعليمي / سنتر</h3>
                                <p className="text-[10px] text-slate-500 mt-1 font-bold">للمراكز التعليمية والأكاديميات</p>
                            </div>
                        </div>

                        <div
                            onClick={() => setFormData({ ...formData, tenantType: 'school' })}
                            className={`cursor-pointer p-6 rounded-2xl border-2 transition-all hover:shadow-lg flex flex-col items-center text-center gap-4 ${formData.tenantType === 'school' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 bg-white'}`}
                        >
                            <div className={`p-4 rounded-full ${formData.tenantType === 'school' ? 'bg-purple-600 text-white shadow-lg' : 'bg-purple-50 text-purple-600'}`}>
                                <GraduationCap size={32} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-900">مدرسة خاصة</h3>
                                <p className="text-[10px] text-slate-500 mt-1 font-bold">للمدارس والمؤسسات الضخمة</p>
                            </div>
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col py-8 items-center justify-center p-4">

            <div className="text-center mb-8">
                <h1 className="text-4xl font-black text-slate-900 mb-2">ابدأ رحلتك مع <span className="text-blue-600 font-extrabold">العقرب</span></h1>
                <p className="text-slate-500 font-bold">تجربة مجانية لمدة 7 أيام. لا يلزم بطاقة ائتمان.</p>
            </div>

            <div className="bg-white w-full max-w-3xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden border">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/80 z-20 flex items-center justify-center backdrop-blur-sm">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Stepper */}
                <div className="flex items-center justify-between mb-10 relative px-4">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-0"></div>
                    {steps.map((label, idx) => (
                        <div key={label} className="relative z-10 flex flex-col items-center gap-2 bg-white px-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all ${idx <= activeStep ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-200 text-slate-500'}`}>
                                {idx + 1}
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-wider ${idx <= activeStep ? 'text-blue-600' : 'text-slate-400'}`}>{label}</span>
                        </div>
                    ))}
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-black text-center">
                        {error}
                    </div>
                )}

                <div>
                    {renderStepContent(activeStep)}

                    <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-50">
                        {activeStep === 0 ? (
                            <button onClick={() => navigate('/login')} className="text-slate-400 hover:text-blue-600 font-black text-sm transition-colors">
                                لديك حساب بالفعل؟ سجل دخول
                            </button>
                        ) : (
                            <button onClick={handleBack} disabled={activeStep === 0} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-black text-sm transition-colors">
                                <ArrowLeft size={16} /> العودة
                            </button>
                        )}

                        <button
                            onClick={handleNext}
                            className="px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-600/30 transition-all active:scale-95 flex items-center gap-2 text-lg"
                        >
                            {activeStep === steps.length - 1 ? 'إنشاء الحساب' : 'الخطوة التالية'}
                            {activeStep === steps.length - 1 ? <CheckSquare size={20} /> : <ArrowRight size={20} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
