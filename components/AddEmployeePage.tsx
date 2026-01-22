
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';
import { ArrowLeft, ArrowRight, Save, UserPlus, Briefcase, GraduationCap, ShieldCheck, User, Mail, Phone, Lock, Building } from 'lucide-react';

const AddEmployeePage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { addEmployeeRecord, addNotification, lang, user: currentUser } = useAppContext();
    const isRtl = lang === 'ar';

    // Default form data
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: UserRole.TEACHER,
        username: '',
        password: '',
        jobTitle: '',
        salary: 0,
        createLogin: true
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        if (!formData.firstName || !formData.lastName) return;

        setIsSubmitting(true);
        setTimeout(() => {
            addEmployeeRecord({
                id: `u-${Date.now()}`,
                code: `EMP-${Date.now().toString().slice(-4)}`,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                role: formData.role,
                username: formData.createLogin ? formData.username : undefined,
                jobTitle: formData.jobTitle,
                salary: formData.salary,
                institutionId: currentUser?.institutionId || 'inst-1',
                aiQuestionsCount: 0
            }, formData.createLogin);

            addNotification({ title: 'تمت الإضافة', content: `تم تسجيل الموظف ${formData.firstName} بنجاح.`, type: 'success', date: new Date().toISOString() });
            setIsSubmitting(false);
            onBack();
        }, 800);
    };

    return (
        <div className="animate-view p-8 bg-white min-h-screen">
            <div className="flex justify-between items-center border-b pb-8 mb-8">
                <div className="flex items-center gap-6">
                    <button onClick={onBack} className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all text-slate-500">
                        {isRtl ? <ArrowRight size={24} /> : <ArrowLeft size={24} />}
                    </button>
                    <div className="p-4 bg-blue-600 text-white rounded-[1.5rem] shadow-xl"><UserPlus size={32} /></div>
                    <div>
                        <h3 className="text-3xl font-black tracking-tighter text-slate-900">{isRtl ? 'إضافة موظف جديد' : 'Add New Employee'}</h3>
                        <p className="text-slate-500 font-bold text-sm mt-1">{isRtl ? 'تسجيل معلم، إداري، أو محاسب جديد' : 'Register a new teacher, admin, or accountant'}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="space-y-10">
                    <div className="space-y-6">
                        <h4 className="text-sm font-black text-blue-600 uppercase tracking-widest border-b pb-4">نوع الوظيفة والدور</h4>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { id: UserRole.TEACHER, label: isRtl ? 'معلم' : 'Teacher', icon: GraduationCap },
                                { id: UserRole.ACCOUNTANT, label: isRtl ? 'محاسب' : 'Accountant', icon: Briefcase },
                                { id: UserRole.ADMIN, label: isRtl ? 'مدير' : 'Manager', icon: ShieldCheck },
                                { id: UserRole.ANNOUNCER, label: isRtl ? 'مشرف' : 'Moderator', icon: User }
                            ].map(role => (
                                <button
                                    key={role.id}
                                    onClick={() => setFormData({ ...formData, role: role.id })}
                                    className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${formData.role === role.id ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                >
                                    <role.icon size={28} />
                                    <span className="font-black text-sm">{role.label}</span>
                                </button>
                            ))}
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">المسمى الوظيفي</label>
                            <input value={formData.jobTitle} onChange={e => setFormData({ ...formData, jobTitle: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl font-black outline-none focus:ring-2 focus:ring-blue-600" placeholder={isRtl ? "مثال: معلم خبير فيزياء" : "e.g. Senior Physics Teacher"} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-sm font-black text-emerald-600 uppercase tracking-widest border-b pb-4">بيانات الحساب</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase">الاسم الأول</label>
                                <input value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl font-black outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase">اسم العائلة</label>
                                <input value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl font-black outline-none" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase">الراتب الشهري (الأساسي)</label>
                            <input type="number" value={formData.salary} onChange={e => setFormData({ ...formData, salary: Number(e.target.value) })} className="w-full p-4 bg-slate-50 rounded-2xl font-black outline-none" />
                        </div>
                    </div>
                </div>

                <div className="space-y-10">
                    <div className="space-y-6">
                        <h4 className="text-sm font-black text-indigo-600 uppercase tracking-widest border-b pb-4">بيانات الدخول والتواصل</h4>
                        <div className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full p-4 pr-12 bg-slate-50 rounded-2xl font-black outline-none" placeholder={isRtl ? "البريد الإلكتروني" : "Email Address"} />
                            </div>
                            <div className="relative">
                                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full p-4 pr-12 bg-slate-50 rounded-2xl font-black outline-none" placeholder={isRtl ? "رقم الهاتف" : "Phone Number"} />
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 mt-6">
                            <div className="flex items-center justify-between mb-4">
                                <label className="text-xs font-black uppercase text-slate-500">إنشاء حساب دخول للنظام</label>
                                <div onClick={() => setFormData({ ...formData, createLogin: !formData.createLogin })} className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${formData.createLogin ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${formData.createLogin ? '-translate-x-6' : 'translate-x-0'}`}></div>
                                </div>
                            </div>

                            {formData.createLogin && (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-indigo-400 uppercase">اسم المستخدم</label>
                                        <input value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} className="w-full p-3 bg-white border border-indigo-100 rounded-xl text-sm font-bold outline-none focus:border-indigo-600" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-indigo-400 uppercase">كلمة المرور الافتراضية</label>
                                        <input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full p-3 bg-white border border-indigo-100 rounded-xl text-sm font-bold outline-none focus:border-indigo-600" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-8">
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                        >
                            {isSubmitting ? '...' : (isRtl ? 'حفظ وتعيين الموظف' : 'Save Employee')} <Save size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEmployeePage;
