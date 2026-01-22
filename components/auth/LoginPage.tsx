
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, Eye, EyeOff, Building2, GraduationCap, Bug } from 'lucide-react';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login, isLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    const handleQuickLogin = (roleEmail: string) => {
        setEmail(roleEmail);
        setPassword('password123');
        login(roleEmail, 'password123');
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left Side - Brand & Visual */}
            <div className="hidden md:flex md:w-7/12 flex-col justify-center items-center text-white relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-900">
                <div className="relative z-10 text-center p-8">
                    <img
                        src="/logo.png"
                        className="w-32 h-32 mb-8 mx-auto drop-shadow-2xl"
                        alt="Aleaqrab Logo"
                        onError={(e: any) => e.target.style.display = 'none'}
                    />
                    <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-white">ALEAQRAB</h1>
                    <p className="text-xl font-light opacity-90 max-w-lg mx-auto">Advanced Education Management System</p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-96 h-96 rounded-full border-[40px] border-white/10" />
                <div className="absolute -bottom-10 -left-10 w-72 h-72 rounded-full bg-white/5" />
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full md:w-5/12 flex flex-col justify-center bg-white p-8 md:p-16 shadow-2xl z-10">
                <div className="max-w-md mx-auto w-full flex flex-col items-center">

                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-blue-600 mb-2">Welcome Back</h1>
                        <p className="text-slate-500 text-sm">Sign in to manage your educational institute</p>
                    </div>

                    <form onSubmit={handleLogin} className="w-full space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center border border-red-100">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-600">
                                    <Mail size={20} />
                                </div>
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all bg-slate-50 font-medium text-slate-900"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-600">
                                    <Lock size={20} />
                                </div>
                                <input
                                    required
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all bg-slate-50 font-medium text-slate-900"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-blue-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all active:scale-95 flex justify-center items-center gap-2 mt-6"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : 'Log In'}
                        </button>

                        <div className="flex justify-between items-center mt-4 text-sm font-medium">
                            <button type="button" className="text-blue-600 hover:text-blue-800">Forgot password?</button>
                            <button type="button" onClick={() => navigate('/register')} className="text-blue-600 hover:text-blue-800 font-bold">Create Account</button>
                        </div>
                    </form>

                    <div className="w-full mt-10 pt-6 border-t border-slate-100">
                        <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Quick Debug Access</p>
                        <div className="grid grid-cols-3 gap-3">
                            <button onClick={() => handleQuickLogin('admin@aleaqrab.com')} className="p-3 border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all flex flex-col items-center gap-2 text-slate-600 hover:text-blue-600">
                                <Building2 size={20} />
                                <span className="text-xs font-bold">Admin</span>
                            </button>
                            <button onClick={() => handleQuickLogin('teacher@aleaqrab.com')} className="p-3 border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all flex flex-col items-center gap-2 text-slate-600 hover:text-blue-600">
                                <GraduationCap size={20} />
                                <span className="text-xs font-bold">Teacher</span>
                            </button>
                            <button onClick={() => handleQuickLogin('student@aleaqrab.com')} className="p-3 border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all flex flex-col items-center gap-2 text-slate-600 hover:text-blue-600">
                                <Bug size={20} />
                                <span className="text-xs font-bold">Student</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LoginPage;
