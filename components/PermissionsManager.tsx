
import * as React from 'react';
import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { User, UserRole } from '../types';
import {
    Shield, Lock, Eye, Printer, Edit, Trash2, Check, X, Search, Globe, Users, Plus,
    BrainCircuit, Sparkles, Zap, Bot, BarChart3, Wallet, FileText, Camera, Volume2,
    Layers, ShieldAlert, Cpu, Settings
} from 'lucide-react';

export const PermissionsManager: React.FC = () => {
    const { allUsers, institutions, t, addNotification } = useAppContext();
    const [selectedEnv, setSelectedEnv] = useState<string>('all');
    const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<'all' | 'core' | 'ai' | 'finance'>('all');

    // Mock permissions structure 
    const [activePermissions, setActivePermissions] = useState<Record<string, Record<string, { read: boolean, write: boolean, print: boolean, hide: boolean }>>>({});

    const filteredUsers = useMemo(() => {
        return allUsers.filter(u => {
            const matchesEnv = selectedEnv === 'all' || u.institutionId === selectedEnv;
            const matchesRole = selectedRole === 'all' || u.role === selectedRole;
            const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
            const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || u.username?.includes(searchQuery.toLowerCase()) || u.code?.includes(searchQuery.toLowerCase());
            return matchesEnv && matchesRole && matchesSearch;
        });
    }, [allUsers, selectedEnv, selectedRole, searchQuery]);

    const resourceCategories = [
        { id: 'all', label: 'الكل', icon: <Layers size={14} /> },
        { id: 'core', label: 'الوظائف الأساسية', icon: <Globe size={14} /> },
        { id: 'ai', label: 'الذكاء الاصطناعي', icon: <BrainCircuit size={14} /> },
        { id: 'finance', label: 'المالية', icon: <Wallet size={14} /> },
    ];

    const resources = [
        // Core
        { id: 'dashboard', label: 'لوحة التحكم', category: 'core', icon: <BarChart3 size={16} /> },
        { id: 'users', label: 'إدارة المستخدمين', category: 'core', icon: <Users size={16} /> },
        { id: 'files', label: 'المذكرات والملفات', category: 'core', icon: <FileText size={16} /> },

        // AI Power
        { id: 'ai_builder', label: 'منشئ الاختبارات (AI)', category: 'ai', icon: <Sparkles size={16} /> },
        { id: 'ai_ocr', label: 'المصحح الذكي (OCR)', category: 'ai', icon: <Camera size={16} /> },
        { id: 'ai_analyst', label: 'المحلل الذكي للأداء', category: 'ai', icon: <ShieldAlert size={16} /> },
        { id: 'ai_tutor', label: 'المعلم الذكي (Tutor)', category: 'ai', icon: <Bot size={16} /> },
        { id: 'ai_speech', label: 'الصوت الذكي (Speech)', category: 'ai', icon: <Volume2 size={16} /> },

        // Finance
        { id: 'coa', label: 'شجرة الحسابات', category: 'finance', icon: <Layers size={16} /> },
        { id: 'payroll', label: 'الرواتب والمستحقات', category: 'finance', icon: <Wallet size={16} /> },
        { id: 'inventory', label: 'إدارة المخازن', category: 'finance', icon: <Settings size={16} /> },
    ];

    const filteredResources = resources.filter(r => activeCategory === 'all' || r.category === activeCategory);

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

    const handleSave = () => {
        addNotification({
            title: 'تحديث الصلاحيات',
            content: `تم تحديث مصفوفة الأمان لـ ${selectedUser?.firstName} ${selectedUser?.lastName} بنجاح.`,
            type: 'success',
            date: new Date().toISOString()
        });
    };

    const currentPerms = selectedUser ? (activePermissions[selectedUser.id] || {}) : {};

    return (
        <div className="space-y-8 animate-view pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center justify-between bg-white p-10 rounded-[2.5rem] border shadow-sm gap-6">
                <div className="flex items-center gap-6">
                    <div className="p-5 rounded-[1.75rem] shadow-xl text-white bg-indigo-600"><Shield size={32} /></div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 uppercase italic">Control Center</h2>
                        <p className="text-slate-500 font-bold">إدارة صلاحيات المستخدمين والوصول لميزات الذكاء الاصطناعي والمالية.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="px-6 py-4 bg-slate-50 rounded-2xl border text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">المستخدمين</p>
                        <p className="text-2xl font-black text-slate-900">{allUsers.length}</p>
                    </div>
                    <div className="px-6 py-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">البيئات</p>
                        <p className="text-2xl font-black text-emerald-600">{institutions.length}</p>
                    </div>
                </div>
            </div>

            {/* Filters & Navigation */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 glass-panel p-8 rounded-[3rem] space-y-8 h-fit sticky top-10">
                    <div className="space-y-6">
                        <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 px-2"><Search size={14} /> بحث وتصفية</h3>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase px-2">البيئة</label>
                                <select
                                    value={selectedEnv}
                                    onChange={(e) => setSelectedEnv(e.target.value)}
                                    className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-sm outline-none focus:border-indigo-600 transition-all text-right"
                                >
                                    <option value="all">كل البيئات</option>
                                    {institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase px-2">نوع الحساب</label>
                                <select
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value as any)}
                                    className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-sm outline-none focus:border-indigo-600 transition-all text-right"
                                >
                                    <option value="all">الكل</option>
                                    <option value={UserRole.ADMIN}>مدراء الفروع</option>
                                    <option value={UserRole.TEACHER}>المعلمون</option>
                                    <option value={UserRole.ACCOUNTANT}>المحاسبون</option>
                                    <option value={UserRole.STUDENT}>الطلاب</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase px-2">الاسم / المعرف</label>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="..."
                                    className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-sm outline-none focus:border-indigo-600 transition-all text-right"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t space-y-4">
                        <h3 className="text-xs font-black text-rose-600 uppercase tracking-widest flex items-center gap-2 px-2"><Cpu size={14} /> فئات الصلاحيات</h3>
                        <div className="flex flex-col gap-2">
                            {resourceCategories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id as any)}
                                    className={`flex items-center justify-between p-4 rounded-2xl font-black text-xs transition-all ${activeCategory === cat.id ? 'bg-indigo-600 text-white shadow-xl translate-x-1' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                >
                                    <span className="flex items-center gap-3">{cat.icon} {cat.label}</span>
                                    <ChevronRight size={14} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Matrix Layout */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-[700px]">
                        {/* User Selection List */}
                        <div className="md:col-span-4 glass-panel rounded-[3rem] overflow-hidden flex flex-col bg-white">
                            <div className="p-6 border-b bg-slate-50 flex justify-between items-center">
                                <h3 className="font-black text-slate-800 text-sm italic uppercase">Users</h3>
                                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase">{filteredUsers.length} Found</span>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                                {filteredUsers.map(u => (
                                    <div
                                        key={u.id}
                                        onClick={() => setSelectedUser(u)}
                                        className={`p-4 rounded-[2rem] cursor-pointer transition-all border-2 flex items-center justify-between group ${selectedUser?.id === u.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl' : 'bg-white hover:bg-slate-50 border-slate-100'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} className="w-12 h-12 rounded-2xl bg-slate-100" alt="av" />
                                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${u.role === UserRole.ADMIN ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-sm">{u.firstName} {u.lastName}</p>
                                                <p className={`text-[9px] font-black tracking-widest uppercase ${selectedUser?.id === u.id ? 'text-indigo-200' : 'text-slate-400'}`}>{t(u.role)} • {u.code}</p>
                                            </div>
                                        </div>
                                        {selectedUser?.id === u.id && <Zap size={16} className="text-indigo-200 animate-pulse" />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Permissions Grid */}
                        <div className="md:col-span-8 glass-panel rounded-[3rem] overflow-hidden flex flex-col bg-white relative">
                            {!selectedUser ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 backdrop-blur-sm z-50">
                                    <div className="p-10 bg-white rounded-full shadow-3xl mb-8 animate-bounce">
                                        <Lock size={64} className="text-indigo-600" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-2 italic">Select Internal Identity</h3>
                                    <p className="font-bold text-slate-400">اختر مستخدم لعرض مصفوفة صلاحيات AI والمالية</p>
                                </div>
                            ) : (
                                <>
                                    <div className="p-8 border-b flex items-center justify-between bg-slate-50/50">
                                        <div className="flex items-center gap-6">
                                            <div className="p-4 bg-white rounded-3xl shadow-sm border"><Users size={24} className="text-indigo-600" /></div>
                                            <div className="text-right">
                                                <h3 className="font-black text-2xl text-slate-900 tracking-tighter">{selectedUser.firstName} {selectedUser.lastName}</h3>
                                                <div className="flex items-center gap-3">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{selectedUser.code}</p>
                                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">{t(selectedUser.role)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={handleSave} className="px-10 py-4 bg-slate-950 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-all flex items-center gap-3">
                                            <Check size={18} /> Save Matrix
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-10 no-scrollbar">
                                        {/* AI Usage Limits Card */}
                                        {selectedUser.role !== UserRole.STUDENT && (
                                            <div className="mb-12 p-8 bg-indigo-50 border-2 border-indigo-100 rounded-[2.5rem] relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 -mr-16 -mt-16 rounded-full"></div>
                                                <div className="flex justify-between items-center relative z-10">
                                                    <div className="flex items-center gap-5">
                                                        <div className="p-3 bg-indigo-600 text-white rounded-2xl"><BrainCircuit size={24} /></div>
                                                        <div className="text-right">
                                                            <h4 className="font-black text-lg text-indigo-950">حصة الذكاء الاصطناعي (AI Quota)</h4>
                                                            <p className="text-[10px] font-bold text-indigo-400 uppercase mt-1">AI Tokens & Questions Management</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <div className="text-center">
                                                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">المستخدم</p>
                                                            <p className="text-xl font-black text-slate-900">12</p>
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-[9px] font-black text-indigo-600 uppercase mb-1">المتبقي</p>
                                                            <p className="text-xl font-black text-indigo-600">{selectedUser.aiQuestionsCount}</p>
                                                        </div>
                                                        <button className="p-4 bg-indigo-600 text-white rounded-2xl hover:scale-105 transition-all shadow-lg"><Plus size={20} /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <table className="w-full text-right border-separate border-spacing-y-4">
                                            <thead>
                                                <tr>
                                                    <th className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pb-4 px-6">Resource / Feature</th>
                                                    <th className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pb-4 px-6 text-center">عرض</th>
                                                    <th className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pb-4 px-6 text-center">تحرير</th>
                                                    <th className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pb-4 px-6 text-center">طباعة</th>
                                                    <th className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] pb-4 px-6 text-center">إخفاء</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredResources.map(res => {
                                                    const perms = currentPerms[res.id] || { read: true, write: true, print: true, hide: false };
                                                    return (
                                                        <tr key={res.id} className={`group transition-all ${perms.hide ? 'opacity-40 grayscale scale-95' : ''}`}>
                                                            <td className="bg-slate-50 p-6 rounded-r-[2rem] border-y border-r font-black text-slate-700 group-hover:bg-slate-100 transition-colors">
                                                                <div className="flex items-center gap-4">
                                                                    <div className={`p-3 rounded-xl ${res.category === 'ai' ? 'bg-indigo-50 text-indigo-600' : (res.category === 'finance' ? 'bg-emerald-50 text-emerald-600' : 'bg-white text-slate-400')}`}>
                                                                        {res.icon}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm">{res.label}</p>
                                                                        <p className="text-[9px] font-black uppercase text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity tracking-widest">{res.category}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            {['read', 'write', 'print', 'hide'].map((type: any) => (
                                                                <td key={type} className="bg-white p-6 border-y text-center first:rounded-r-[2rem] last:rounded-l-[2rem] group-hover:bg-slate-50 transition-colors">
                                                                    <button
                                                                        onClick={() => togglePermission(res.id, type)}
                                                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all mx-auto ${perms[type] ? (type === 'hide' ? 'bg-rose-100 text-rose-600 border-2 border-rose-200 shadow-lg shadow-rose-100' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 rotate-0') : 'bg-slate-50 text-slate-200 border-2 border-slate-100 border-dashed hover:border-indigo-200 hover:text-indigo-300'}`}
                                                                    >
                                                                        {perms[type] ? <Check size={20} strokeWidth={4} /> : <X size={20} strokeWidth={2} />}
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
            </div>
        </div>
    );
};

// Helper for the chevron icon
const ChevronRight = ({ size, className }: any) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18l6-6-6-6" />
    </svg>
);
