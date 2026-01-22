import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, UserPlus, Save } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import { UserRole } from '../../../types';

export const AddStudentPage: React.FC = () => {
    const navigate = useNavigate();
    const { addStudentWithAccount, lang, user } = useAppContext();
    const isRtl = lang === 'ar';

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        parentFirstName: '',
        parentEmail: '',
        parentPhone: '',
        subscriptionAmount: 0,
        createStudentLogin: false,
        createParentLogin: false
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        addStudentWithAccount(
            {
                id: '',
                code: '',
                firstName: formData.firstName,
                lastName: formData.lastName,
                role: UserRole.STUDENT,
                institutionId: user?.institutionId || 'tenant-a',
                email: formData.email,
                phone: formData.phone,
                username: formData.createStudentLogin ? formData.email : undefined,
                aiQuestionsCount: 10,
                subscriptionAmount: formData.subscriptionAmount
            },
            {
                firstName: formData.parentFirstName,
                email: formData.parentEmail,
                phone: formData.parentPhone,
                username: formData.createParentLogin ? formData.parentEmail : undefined
            },
            formData.createStudentLogin,
            formData.createParentLogin
        );

        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-[2rem] shadow-xl p-12">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8 border-b pb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                                <UserPlus size={28} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-slate-900">
                                    {isRtl ? 'إضافة طالب جديد' : 'Add New Student'}
                                </h1>
                                <p className="text-slate-500 font-bold text-sm">
                                    {isRtl ? 'إدخال بيانات الطالب وولي الأمر' : 'Enter student and parent information'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate(-1)}
                            className="p-3 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Student Information */}
                        <div>
                            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                {isRtl ? 'بيانات الطالب' : 'Student Information'}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        {isRtl ? 'الاسم الأول' : 'First Name'}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold focus:border-blue-600 outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        {isRtl ? 'اسم العائلة' : 'Last Name'}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold focus:border-blue-600 outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        {isRtl ? 'البريد الإلكتروني' : 'Email'}
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold focus:border-blue-600 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        {isRtl ? 'رقم الهاتف' : 'Phone'}
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold focus:border-blue-600 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        {isRtl ? 'قيمة الاشتراك الشهري' : 'Monthly Subscription'}
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.subscriptionAmount}
                                        onChange={(e) => setFormData({ ...formData, subscriptionAmount: parseFloat(e.target.value) })}
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold focus:border-blue-600 outline-none transition-all"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.createStudentLogin}
                                            onChange={(e) => setFormData({ ...formData, createStudentLogin: e.target.checked })}
                                            className="w-5 h-5"
                                        />
                                        <span className="text-sm font-bold text-slate-700">
                                            {isRtl ? 'إنشاء حساب دخول للطالب' : 'Create student login'}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Parent Information */}
                        <div>
                            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                                {isRtl ? 'بيانات ولي الأمر' : 'Parent Information'}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        {isRtl ? 'اسم ولي الأمر' : 'Parent Name'}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.parentFirstName}
                                        onChange={(e) => setFormData({ ...formData, parentFirstName: e.target.value })}
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold focus:border-blue-600 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        {isRtl ? 'البريد الإلكتروني' : 'Email'}
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.parentEmail}
                                        onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold focus:border-blue-600 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        {isRtl ? 'رقم الهاتف' : 'Phone'}
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.parentPhone}
                                        onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold focus:border-blue-600 outline-none transition-all"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.createParentLogin}
                                            onChange={(e) => setFormData({ ...formData, createParentLogin: e.target.checked })}
                                            className="w-5 h-5"
                                        />
                                        <span className="text-sm font-bold text-slate-700">
                                            {isRtl ? 'إنشاء حساب دخول لولي الأمر' : 'Create parent login'}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-6 border-t">
                            <button
                                type="submit"
                                className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-black flex items-center justify-center gap-3 hover:bg-blue-700 transition-all"
                            >
                                <Save size={20} />
                                {isRtl ? 'حفظ البيانات' : 'Save'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-8 py-4 bg-slate-100 text-slate-700 rounded-xl font-black hover:bg-slate-200 transition-all"
                            >
                                {isRtl ? 'إلغاء' : 'Cancel'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
