import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Building2, UserCircle, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { mockAuthService } from '../../services/mockAuth';
import { useAppContext } from '../../../context/AppContext';
import { UserRole } from '../../../types';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { setUser, setSystemName, setSystemLogo, setCurrentTenant } = useAppContext();

    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Login Form
    const [email, setEmail] = useState('');

    // Register Form
    const [regData, setRegData] = useState({
        name: '',
        subDomain: '',
        adminName: '',
        adminEmail: '',
        type: 'institution' as 'institution' | 'individual'
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await mockAuthService.login(email);
            if (result) {
                setUser(result.user);
                setSystemName(result.tenant.name);
                setCurrentTenant(result.tenant);
                if (result.tenant.logo) setSystemLogo(result.tenant.logo);
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result: any = await mockAuthService.register({
                organizationName: regData.name,
                firstName: regData.adminName.split(' ')[0] || 'Admin',
                lastName: regData.adminName.split(' ').slice(1).join(' ') || 'User',
                email: regData.adminEmail,
                password: 'password123',
                tenantType: regData.type === 'individual' ? 'tutor' : 'school'
            });
            // Auto login
            setUser(result.user);
            setSystemName(result.tenant.name);
            setCurrentTenant(result.tenant);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex text-slate-800 font-sans bg-[#f8fafc]">

            {/* Left: Branding */}
            <div className="hidden lg:flex flex-col justify-between w-1/2 bg-slate-900 text-white p-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-600/20 blur-3xl"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-2xl">🦂</div>
                        <span className="text-3xl font-black tracking-tighter uppercase">Aleaqrab</span>
                    </div>
                    <h1 className="text-5xl font-black leading-tight mb-6">
                        The Ultimate <span className="text-indigo-400">ERP Blueprint</span><br />
                        for Modern Education.
                    </h1>
                    <p className="text-slate-400 text-lg max-w-md leading-relaxed">
                        Manage your institution with Military-Grade precision. Financials, LMS, and Operations in one powerhouse.
                    </p>
                </div>

                <div className="relative z-10 grid grid-cols-2 gap-8 text-sm font-bold text-slate-400 uppercase tracking-widest">
                    <div>• Enterprise SaaS</div>
                    <div>• RTL First</div>
                    <div>• Anti-Cheat Engine</div>
                    <div>• Double-Entry Accounting</div>
                </div>
            </div>

            {/* Right: Form */}
            <div className="flex-1 flex items-center justify-center p-8 relative">
                <div className="max-w-md w-full space-y-8 animate-fade-in-up">

                    {/* Header */}
                    <div>
                        <h2 className="text-3xl font-black text-slate-900">{mode === 'login' ? 'Welcome Back' : 'Start Free Trial'}</h2>
                        <p className="text-slate-400 mt-2 font-medium">
                            {mode === 'login'
                                ? 'Enter your email to access your workspace.'
                                : 'No credit card required. 7-days fully unlocked.'}
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-4 bg-rose-50 text-rose-600 rounded-xl flex items-center gap-3 text-sm font-bold animate-shake">
                            <AlertCircle size={18} /> {error}
                        </div>
                    )}

                    {mode === 'login' ? (
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-4 pl-12 pr-4 font-bold text-slate-700 outline-none focus:border-indigo-600 transition-all placeholder:text-slate-300"
                                        placeholder="admin@alhoda.com"
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-lg shadow-xl shadow-indigo-100 hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2">
                                {loading ? 'Authenticating...' : 'Sign In to Workspace'} <ArrowRight size={20} />
                            </button>

                            <div className="text-center">
                                <p className="text-slate-400 text-sm font-bold">Don't have an account?</p>
                                <button type="button" onClick={() => setMode('register')} className="text-indigo-600 font-black text-sm hover:underline mt-1">Create New Tenant</button>
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-100">
                                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest text-center mb-4">Demo Credentials</p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {['admin@alhoda.com', 'fin@alhoda.com', 'tarek@alhoda.com', 'ahmed@physics.com'].map(e => (
                                        <span key={e} onClick={() => setEmail(e)} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-500 text-[10px] font-mono cursor-pointer rounded-md transition-colors">{e}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <p className="text-xs font-bold text-amber-600 uppercase tracking-widest text-center mb-4">🚀 وضع التجربة السريع</p>
                                <p className="text-[10px] text-slate-400 text-center mb-4 font-bold">اختر دوراً للدخول مباشرة بدون تسجيل</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { role: UserRole.SUPER_ADMIN, label: 'مدير النظام', color: 'bg-purple-600 hover:bg-purple-700' },
                                        { role: UserRole.ADMIN, label: 'مدير الفرع', color: 'bg-indigo-600 hover:bg-indigo-700' },
                                        { role: UserRole.TEACHER, label: 'معلم', color: 'bg-blue-600 hover:bg-blue-700' },
                                        { role: UserRole.STUDENT, label: 'طالب', color: 'bg-emerald-600 hover:bg-emerald-700' },
                                        { role: UserRole.PARENT, label: 'ولي أمر', color: 'bg-rose-600 hover:bg-rose-700' },
                                        { role: UserRole.ACCOUNTANT, label: 'محاسب', color: 'bg-amber-600 hover:bg-amber-700' }
                                    ].map(({ role, label, color }) => (
                                        <button
                                            key={role}
                                            type="button"
                                            onClick={() => {
                                                setUser({
                                                    id: 'demo-' + role,
                                                    code: role.toUpperCase() + '-DEMO',
                                                    firstName: 'مستخدم',
                                                    lastName: label,
                                                    username: 'demo_' + role,
                                                    role: role,
                                                    aiQuestionsCount: 50,
                                                    institutionId: 'tenant-a'
                                                });
                                                navigate('/dashboard');
                                            }}
                                            className={`${color} text-white py-2 px-3 rounded-lg font-black text-[11px] transition-all active:scale-95 shadow-md`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${regData.type === 'institution' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 hover:border-slate-300'}`} onClick={() => setRegData({ ...regData, type: 'institution' })}>
                                    <Building2 className="mb-2" />
                                    <div className="text-sm font-black">Institution</div>
                                    <div className="text-[10px] opacity-60 font-bold">Full ERP</div>
                                </div>
                                <div className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${regData.type === 'individual' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 hover:border-slate-300'}`} onClick={() => setRegData({ ...regData, type: 'individual' })}>
                                    <UserCircle className="mb-2" />
                                    <div className="text-sm font-black">Tutor</div>
                                    <div className="text-[10px] opacity-60 font-bold">LMS Only</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text" value={regData.name} onChange={e => setRegData({ ...regData, name: e.target.value })}
                                    className="bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm font-bold outline-none focus:border-indigo-600"
                                    placeholder="Organization Name" required
                                />
                                <input
                                    type="text" value={regData.subDomain} onChange={e => setRegData({ ...regData, subDomain: e.target.value })}
                                    className="bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm font-bold outline-none focus:border-indigo-600"
                                    placeholder="Subdomain (slug)" required
                                />
                            </div>
                            <input
                                type="email" value={regData.adminEmail} onChange={e => setRegData({ ...regData, adminEmail: e.target.value })}
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm font-bold outline-none focus:border-indigo-600"
                                placeholder="Admin Email" required
                            />
                            <input
                                type="text" value={regData.adminName} onChange={e => setRegData({ ...regData, adminName: e.target.value })}
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm font-bold outline-none focus:border-indigo-600"
                                placeholder="Admin Full Name" required
                            />

                            <button type="submit" disabled={loading} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-lg shadow-xl shadow-emerald-100 hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2">
                                {loading ? 'Creating...' : 'Launch Tenant'} <CheckCircle2 size={20} />
                            </button>

                            <button type="button" onClick={() => setMode('login')} className="w-full text-slate-400 font-bold text-sm hover:text-slate-600">Back to Login</button>
                        </form>
                    )}

                </div>
            </div>
        </div>
    );
};
