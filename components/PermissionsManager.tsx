
import * as React from 'react';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { User, UserRole } from '../types';
import { Shield, Lock, Eye, Printer, Edit, Trash2, Check, X, Search, Globe, Users } from 'lucide-react';

export const PermissionsManager: React.FC = () => {
    const { allUsers, institutions, t } = useAppContext();
    const [selectedEnv, setSelectedEnv] = useState<string>('all');
    const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Mock permissions structure (in a real app, this would be in the User object or a separate table)
    const [activePermissions, setActivePermissions] = useState<Record<string, Record<string, { read: boolean, write: boolean, print: boolean, hide: boolean }>>>({});

    const filteredUsers = allUsers.filter(u => {
        const matchesEnv = selectedEnv === 'all' || u.institutionId === selectedEnv;
        const matchesRole = selectedRole === 'all' || u.role === selectedRole;
        const matchesSearch = u.firstName.includes(searchQuery) || u.lastName.includes(searchQuery) || u.username?.includes(searchQuery);
        return matchesEnv && matchesRole && matchesSearch;
    });

    const resources = [
        { id: 'dashboard', label: 'لوحة التحكم' },
        { id: 'exams', label: 'الاختبارات' },
        { id: 'financial', label: 'المالية' },
        { id: 'users', label: 'إدارة المستخدمين' },
        { id: 'reports', label: 'التقارير' },
        { id: 'settings', label: 'الإعدادات' },
    ];

    const togglePermission = (resId: string, type: 'read' | 'write' | 'print' | 'hide') => {
        if (!selectedUser) return;

        setActivePermissions(prev => {
            const userPerms = prev[selectedUser.id] || {};
            const resPerms = userPerms[resId] || { read: true, write: true, print: true, hide: false };

            return {
                ...prev,
                [selectedUser.id]: {
                    ...userPerms,
                    [resId]: { ...resPerms, [type]: !resPerms[type] }
                }
            };
        });
    };

    const currentPerms = selectedUser ? (activePermissions[selectedUser.id] || {}) : {};

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-900">إدارة الصلاحيات المتقدمة</h2>
                    <p className="text-slate-500 font-medium mt-2">تحكم كامل في بيئة العمل وصلاحيات المستخدمين</p>
                </div>
                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <Shield size={32} />
                </div>
            </div>

            {/* Filters */}
            <div className="glass-panel p-6 rounded-[2rem] flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[200px]">
                    <label className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider">البيئة (Environment)</label>
                    <div className="relative">
                        <Globe size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                            value={selectedEnv}
                            onChange={(e) => setSelectedEnv(e.target.value)}
                            className="input-primary pr-12 appearance-none cursor-pointer"
                        >
                            <option value="all">كل البيئات</option>
                            {institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex-1 min-w-[200px]">
                    <label className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider">نوع المستخدم</label>
                    <div className="relative">
                        <Users size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value as any)}
                            className="input-primary pr-12 appearance-none cursor-pointer"
                        >
                            <option value="all">الكل</option>
                            <option value={UserRole.ADMIN}>مدراء الفروع</option>
                            <option value={UserRole.TEACHER}>المعلمون</option>
                            <option value={UserRole.ACCOUNTANT}>المحاسبون</option>
                            <option value={UserRole.STUDENT}>الطلاب</option>
                        </select>
                    </div>
                </div>
                <div className="flex-[2] min-w-[300px]">
                    <label className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider">بحث سريع</label>
                    <div className="relative">
                        <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="اسم المستخدم، الكود، المعرف..."
                            className="input-primary pr-12"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
                {/* User List */}
                <div className="glass-panel rounded-[2rem] overflow-hidden flex flex-col h-full bg-white">
                    <div className="p-6 border-b bg-slate-50">
                        <h3 className="font-black text-slate-800">قائمة المستخدمين</h3>
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded mt-1 inline-block">{filteredUsers.length} مستخدم</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {filteredUsers.map(u => (
                            <div
                                key={u.id}
                                onClick={() => setSelectedUser(u)}
                                className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedUser?.id === u.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white hover:bg-slate-50 border-slate-100'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${selectedUser?.id === u.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                        {u.firstName[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{u.firstName} {u.lastName}</p>
                                        <p className={`text-[10px] font-medium uppercase tracking-wider ${selectedUser?.id === u.id ? 'text-indigo-200' : 'text-slate-400'}`}>{t(u.role)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Permissions Matrix */}
                <div className="lg:col-span-2 glass-panel rounded-[2rem] overflow-hidden flex flex-col h-full bg-white relative">
                    {!selectedUser ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 backdrop-blur-sm z-10">
                            <Lock size={64} className="mb-4 opacity-20" />
                            <p className="font-bold text-lg">اختر مستخدم لعرض وتعديل الصلاحيات</p>
                        </div>
                    ) : (
                        <>
                            <div className="p-6 border-b flex items-center justify-between bg-slate-50">
                                <div className="flex items-center gap-4">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.username}`} className="w-12 h-12 rounded-xl bg-white shadow-sm" alt="Avatar" />
                                    <div>
                                        <h3 className="font-black text-xl text-slate-900">{selectedUser.firstName} {selectedUser.lastName}</h3>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{selectedUser.code} • {t(selectedUser.role)}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-indigo-700 transition-all">حفظ التغييرات</button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                <table className="w-full text-right border-separate border-spacing-y-3">
                                    <thead>
                                        <tr>
                                            <th className="text-xs font-black text-slate-400 uppercase tracking-wider pb-4 px-4">الصفحة / المورد</th>
                                            <th className="text-xs font-black text-slate-400 uppercase tracking-wider pb-4 px-4 text-center">عرض <Eye size={14} className="inline" /></th>
                                            <th className="text-xs font-black text-slate-400 uppercase tracking-wider pb-4 px-4 text-center">تعديل <Edit size={14} className="inline" /></th>
                                            <th className="text-xs font-black text-slate-400 uppercase tracking-wider pb-4 px-4 text-center">طباعة <Printer size={14} className="inline" /></th>
                                            <th className="text-xs font-black text-slate-400 uppercase tracking-wider pb-4 px-4 text-center">إخفاء كلي <Trash2 size={14} className="inline" /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resources.map(res => {
                                            const perms = currentPerms[res.id] || { read: true, write: true, print: true, hide: false };
                                            return (
                                                <tr key={res.id} className={`group transition-all ${perms.hide ? 'opacity-50 grayscale' : ''}`}>
                                                    <td className="bg-slate-50 p-4 rounded-r-2xl border-y border-r font-bold text-slate-700 group-hover:bg-indigo-50 transition-colors">
                                                        {res.label}
                                                    </td>
                                                    {['read', 'write', 'print', 'hide'].map((type: any) => (
                                                        <td key={type} className="bg-white p-4 border-y text-center first:rounded-r-2xl last:rounded-l-2xl group-hover:bg-slate-50 transition-colors">
                                                            <button
                                                                onClick={() => togglePermission(res.id, type)}
                                                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${perms[type] ? (type === 'hide' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600') : 'bg-slate-100 text-slate-300'}`}
                                                            >
                                                                {perms[type] ? <Check size={20} strokeWidth={3} /> : <X size={20} strokeWidth={3} />}
                                                            </button>
                                                        </td>
                                                    ))}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
