
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { UserRole, User } from '../types';
import { ArrowLeft, ArrowRight, Save, UserPlus, Briefcase, GraduationCap, ShieldCheck, User as UserIcon, Mail, Phone, Lock, Building, Users, Smartphone, Key } from 'lucide-react';

interface AddUserPageProps {
    onBack: () => void;
    initialRole?: UserRole;
}

const AddUserPage: React.FC<AddUserPageProps> = ({ onBack, initialRole = UserRole.TEACHER }) => {
    const { addEmployeeRecord, addStudentWithAccount, addNotification, lang, user: currentUser, allUsers } = useAppContext();
    const isRtl = lang === 'ar';
    const isAdmin = currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.SUPER_ADMIN;

    // Determine initial form state based on role
    const [selectedRole, setSelectedRole] = useState(initialRole);

    // Unified form data
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        username: '', password: '',
        jobTitle: '', salary: 0,
        createLogin: true,
        // Student specific
        teacherId: '',
        parentName: '', parentPhone: '', parentEmail: '', parentUsername: '',
        createParentLogin: false
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const teachers = allUsers.filter(u => u.role === UserRole.TEACHER);

    // Update role when prop changes (if needed)
    useEffect(() => {
        if (initialRole) setSelectedRole(initialRole);
    }, [initialRole]);

    const handleSubmit = () => {
        if (!formData.firstName || !formData.lastName) return alert(isRtl ? "الاسم مطلوب" : "Name is required");

        setIsSubmitting(true);
        setTimeout(() => {
            try {
                if (selectedRole === UserRole.STUDENT) {
                    const studentData: User = {
                        id: `u-${Date.now()}`,
                        code: '',
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        username: formData.username || `std_${Date.now()}`,
                        role: UserRole.STUDENT,
                        institutionId: currentUser?.institutionId || 'inst-1',
                        teacherId: formData.teacherId || (currentUser?.role === UserRole.TEACHER ? currentUser.id : ''),
                        phone: formData.phone,
                        email: formData.email,
                        aiQuestionsCount: 10
                    };
                    const parentData: Partial<User> = {
                        firstName: formData.parentName,
                        phone: formData.parentPhone,
                        email: formData.parentEmail,
                        username: formData.parentUsername || `par_${Date.now()}`,
                    };
                    addStudentWithAccount(studentData, parentData, formData.createLogin, formData.createParentLogin);
                    addNotification({ title: 'تمت الإضافة', content: `تم تسجيل الطالب ${formData.firstName} وملف ولي الأمر بنجاح.`, type: 'success', date: new Date().toISOString() });

                } else {
                    // Employee / Teacher / Admin
                    addEmployeeRecord({
                        id: `emp-${Date.now()}`,
                        code: `EMP-${Date.now().toString().slice(-4)}`,
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        email: formData.email,
                        phone: formData.phone,
                        role: selectedRole,
                        username: formData.createLogin ? formData.username : undefined,
                        jobTitle: formData.jobTitle || (selectedRole === UserRole.TEACHER ? 'معلم' : 'موظف'),
                        salary: formData.salary,
                        institutionId: currentUser?.institutionId || 'inst-1',
                        aiQuestionsCount: 50
                    }, formData.createLogin);

                    addNotification({ title: 'تمت الإضافة', content: `تم تسجيل الموظف ${formData.firstName} بنجاح.`, type: 'success', date: new Date().toISOString() });
                }

                setIsSubmitting(false);
                onBack();
            } catch (error) {
                console.error(error);
                setIsSubmitting(false);
                alert("حدث خطأ أثناء الحفظ");
            }
        }, 800);
    };

    return (
        <div className="animate-view p-8 bg-white min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-center border-b pb-8 mb-8 gap-4">
                <div className="flex items-center gap-6">
                    <button onClick={onBack} className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all text-slate-500">
                        {isRtl ? <ArrowRight size={24} /> : <ArrowLeft size={24} />}
                    </button>
                    <div className="p-4 bg-slate-900 text-white rounded-[1.5rem] shadow-xl"><UserPlus size={32} /></div>
                    <div>
                        <h3 className="text-3xl font-black tracking-tighter text-slate-900">{isRtl ? 'تسجيل مستخدم جديد' : 'Register New User'}</h3>
                        <p className="text-slate-500 font-bold text-sm mt-1">{isRtl ? 'إضافة طالب، معلم، أو موظف إداري للنظام' : 'Add student, teacher, or staff member'}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Sidebar Role Selection */}
                <div className="lg:col-span-3 space-y-4">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest px-2 mb-2">{isRtl ? 'حدد الصلاحية' : 'Select Role'}</p>
                    {[
                        { id: UserRole.STUDENT, label: isRtl ? 'طالب' : 'Student', icon: Users, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
                        { id: UserRole.TEACHER, label: isRtl ? 'معلم / هيئة تدريس' : 'Teacher', icon: GraduationCap, color: 'bg-blue-50 text-blue-600 border-blue-200' },
                        { id: UserRole.ACCOUNTANT, label: isRtl ? 'محاسب مالي' : 'Accountant', icon: Briefcase, color: 'bg-amber-50 text-amber-600 border-amber-200' },
                        { id: UserRole.ADMIN, label: isRtl ? 'مدير / إداري' : 'Admin', icon: ShieldCheck, color: 'bg-rose-50 text-rose-600 border-rose-200' },
                        { id: UserRole.SECRETARY, label: isRtl ? 'سكرتارية / استقبال' : 'Secretary', icon: Users, color: 'bg-indigo-50 text-indigo-600 border-indigo-200' }
                    ].map(role => (
                        <button
                            key={role.id}
                            onClick={() => setSelectedRole(role.id)}
                            className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 text-right ${selectedRole === role.id ? role.color : 'bg-white border-transparent hover:bg-slate-50 text-slate-400'}`}
                        >
                            <role.icon size={20} />
                            <span className="font-black text-sm">{role.label}</span>
                        </button>
                    ))}
                </div>

                {/* Form Area */}
                <div className="lg:col-span-9 space-y-10">

                    {/* Personal Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b pb-4">البيانات الأساسية</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="الاسم الأول" value={formData.firstName} onChange={v => setFormData({ ...formData, firstName: v })} />
                                <Field label="اسم العائلة" value={formData.lastName} onChange={v => setFormData({ ...formData, lastName: v })} />
                            </div>
                            <Field label="رقم الهاتف" value={formData.phone} onChange={v => setFormData({ ...formData, phone: v })} icon={<Smartphone size={16} />} />
                            <Field label="البريد الإلكتروني" value={formData.email} onChange={v => setFormData({ ...formData, email: v })} icon={<Mail size={16} />} />

                            {selectedRole !== UserRole.STUDENT && (
                                <div className="space-y-2 pt-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">المسمى الوظيفي</label>
                                    <input value={formData.jobTitle} onChange={e => setFormData({ ...formData, jobTitle: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl font-black outline-none focus:ring-2 focus:ring-indigo-600 transition-all" placeholder={isRtl ? "مثال: معلم أول فيزياء" : "e.g. Senior Teacher"} />
                                </div>
                            )}
                            {selectedRole !== UserRole.STUDENT && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">الراتب الشهري</label>
                                    <input type="number" value={formData.salary} onChange={e => setFormData({ ...formData, salary: Number(e.target.value) })} className="w-full p-4 bg-slate-50 rounded-2xl font-black outline-none" />
                                </div>
                            )}
                        </div>

                        {/* Context Specific (Student Parents / Login) */}
                        <div className="space-y-6">
                            {selectedRole === UserRole.STUDENT ? (
                                <>
                                    <h4 className="text-sm font-black text-blue-600 uppercase tracking-widest border-b pb-4 flex items-center gap-2"><Users size={18} /> بيانات ولي الأمر</h4>
                                    <Field label="اسم ولي الأمر" value={formData.parentName} onChange={v => setFormData({ ...formData, parentName: v })} />
                                    <Field label="هاتف ولي الأمر" value={formData.parentPhone} onChange={v => setFormData({ ...formData, parentPhone: v })} />

                                    {isAdmin && (
                                        <div className="space-y-2 pt-4">
                                            <label className="text-[10px] font-black text-slate-400 tracking-widest px-2">تخصيص لمعلم معين</label>
                                            <select value={formData.teacherId} onChange={e => setFormData({ ...formData, teacherId: e.target.value })} className="w-full p-4 rounded-2xl font-bold border bg-white border-slate-200 outline-none focus:border-indigo-600">
                                                <option value="">-- عام (لا يوجد معلم محدد) --</option>
                                                {teachers.map(t => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}
                                            </select>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <h4 className="text-sm font-black text-indigo-600 uppercase tracking-widest border-b pb-4 flex items-center gap-2"><Key size={18} /> بيانات الدخول</h4>
                                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                        <div className="flex items-center justify-between mb-6">
                                            <label className="text-xs font-black uppercase text-slate-500">تمكين الدخول للنظام</label>
                                            <input type="checkbox" checked={formData.createLogin} onChange={e => setFormData({ ...formData, createLogin: e.target.checked })} className="w-5 h-5 accent-indigo-600" />
                                        </div>
                                        {formData.createLogin && (
                                            <div className="space-y-4 animate-fade-in">
                                                <Field label="اسم المستخدم" value={formData.username} onChange={v => setFormData({ ...formData, username: v })} />
                                                <Field label="كلمة المرور" type="password" value={formData.password} onChange={v => setFormData({ ...formData, password: v })} />
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Student Special Login Section (Optional) */}
                    {selectedRole === UserRole.STUDENT && (
                        <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h5 className="font-black text-slate-900 flex items-center gap-2"><UserIcon size={16} /> حساب الطالب</h5>
                                    <input type="checkbox" checked={formData.createLogin} onChange={e => setFormData({ ...formData, createLogin: e.target.checked })} className="w-5 h-5 accent-indigo-600" />
                                </div>
                                {formData.createLogin && (
                                    <div className="space-y-3">
                                        <Field label="يوزر الطالب" value={formData.username} onChange={v => setFormData({ ...formData, username: v })} />
                                        <Field label="كلمة المرور" value={formData.password} onChange={v => setFormData({ ...formData, password: v })} type="password" />
                                    </div>
                                )}
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h5 className="font-black text-slate-900 flex items-center gap-2"><Users size={16} /> حساب ولي الأمر</h5>
                                    <input type="checkbox" checked={formData.createParentLogin} onChange={e => setFormData({ ...formData, createParentLogin: e.target.checked })} className="w-5 h-5 accent-indigo-600" />
                                </div>
                                {formData.createParentLogin && (
                                    <div className="space-y-3">
                                        <Field label="يوزر ولي الأمر" value={formData.parentUsername} onChange={v => setFormData({ ...formData, parentUsername: v })} />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="pt-4 flex gap-6">
                        <button onClick={onBack} className="px-10 py-6 bg-slate-100 text-slate-400 rounded-[2rem] font-black hover:bg-slate-200 transition-all">{isRtl ? 'إلغاء' : 'Cancel'}</button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-1 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl shadow-2xl hover:bg-indigo-600 active:scale-95 transition-all flex items-center justify-center gap-4"
                        >
                            {isSubmitting ? '...' : (isRtl ? 'حفظ البيانات' : 'Save Data')} <Save size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Field = ({ label, value, onChange, type = 'text', icon }: any) => (
    <div className="space-y-2 relative">
        <label className="text-[10px] font-black uppercase text-slate-400 px-2 tracking-widest">{label}</label>
        <div className="relative">
            {icon && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
            <input type={type} value={value} onChange={e => onChange(e.target.value)} className={`w-full p-4 ${icon ? 'pr-12' : ''} bg-white rounded-2xl font-bold border border-slate-200 outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all shadow-sm`} />
        </div>
    </div>
);

export default AddUserPage;
