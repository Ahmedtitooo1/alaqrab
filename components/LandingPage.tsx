
import * as React from 'react';
import { useState, useEffect } from 'react';
import { UserRole } from '../types';
import { useAppContext } from '../context/AppContext';
import {
  ArrowRight, Globe,
  GraduationCap, X,
  Briefcase, Calculator,
  ShieldCheck,
  Terminal,
  Users
} from 'lucide-react';

import Hero3D from './Hero3D';

const LandingPage: React.FC<{ onStart: (role: UserRole) => void }> = ({ onStart }) => {
  const { t, lang, setLang, setUser, systemLogo } = useAppContext();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'select_role'>('login');
  const isRtl = lang === 'ar';

  const roles = [
    { id: UserRole.SUPER_ADMIN, label: t('super_admin'), icon: <Terminal size={32} />, desc: 'إدارة السيرفر' },
    { id: UserRole.ADMIN, label: t('admin'), icon: <ShieldCheck size={32} />, desc: 'مدير فرع' },
    { id: UserRole.ACCOUNTANT, label: t('accountant'), icon: <Calculator size={32} />, desc: 'محاسب مالي' },
    { id: UserRole.TEACHER, label: t('teacher'), icon: <Briefcase size={32} />, desc: 'معلم' },
    { id: UserRole.PARENT, label: t('parent'), icon: <Users size={32} />, desc: 'ولي أمر' },
    { id: UserRole.STUDENT, label: t('student'), icon: <GraduationCap size={32} />, desc: 'طالب' },
  ];

  return (
    <div className={`min-h-screen bg-[#f8fafc] text-slate-900`}>
      {/* ... navbar ... */}
      <nav className="fixed top-0 left-0 right-0 z-[100] h-20 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-8 h-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src={systemLogo} className="h-10 w-10 object-contain" alt="AleaQrab" />
            <span className="font-black text-2xl tracking-tighter text-slate-900 uppercase">ALEAQRAB</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="p-3 bg-white hover:bg-slate-50 text-slate-900 rounded-full font-black text-xs border transition-all flex items-center gap-2">
              <Globe size={18} /> {lang === 'ar' ? 'English' : 'عربي'}
            </button>
            <button onClick={() => { setAuthMode('login'); setShowAuthModal(true); }} className="px-8 py-3 bg-slate-900 text-white rounded-full font-black text-xs shadow-lg hover:bg-indigo-900 transition-all">
              {t('login')}
            </button>
          </div>
        </div>
      </nav>

      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <Hero3D />
        <div className="relative z-10 text-center px-8 animate-view">
          <h1 className="text-7xl font-black text-slate-900 leading-none mb-8 tracking-tighter uppercase pointer-events-none">ALEAQRAB</h1>
          <p className="text-xl font-bold text-slate-600 mb-12 pointer-events-none">نظام العقرب التعليمي: تكويد آلي، ربط مالي، وذكاء اصطناعي.</p>
          <button onClick={() => { setAuthMode('select_role'); setShowAuthModal(true); }} className="pointer-events-auto px-12 py-5 bg-blue-700 text-white rounded-[2rem] font-black text-lg shadow-2xl flex items-center gap-5 mx-auto hover:bg-blue-800 transition-all">
            تجربة المنظومة <ArrowRight size={24} className={isRtl ? 'rotate-180' : ''} />
          </button>
        </div>
      </section>

      {showAuthModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-100/40 backdrop-blur-xl">
          <div className="relative w-full max-w-6xl p-16 rounded-[4rem] text-center bg-white shadow-3xl animate-view border overflow-y-auto max-h-[90vh]">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-10 left-10 p-4 hover:bg-slate-100 rounded-full text-slate-400"><X size={32} /></button>

            <div className="mb-16">
              <h2 className="text-5xl font-black text-slate-900 mb-4">{authMode === 'select_role' ? 'اختر الدور للتجربة' : 'تسجيل الدخول'}</h2>
              <p className="text-slate-500 font-bold">يمكنك الدخول بأي دور لمعاينة صلاحيات النظام</p>
            </div>

            {authMode === 'select_role' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setUser({
                        id: 'u-demo-' + r.id,
                        code: r.id === UserRole.SUPER_ADMIN ? 'SYS-001' : (r.id === UserRole.ACCOUNTANT ? 'ACC-101' : 'TEA-1001'),
                        firstName: 'مستخدم',
                        lastName: r.label,
                        username: `demo_${r.id}`,
                        role: r.id,
                        aiQuestionsCount: 10,
                        institutionId: 'inst-1'
                      });
                      onStart(r.id);
                    }}
                    className="p-8 border rounded-[2.5rem] hover:border-blue-600 hover:bg-blue-50 transition-all group flex flex-col items-center"
                  >
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">{r.icon}</div>
                    <h4 className="font-black text-sm mb-1">{r.label}</h4>
                    <span className="text-[9px] font-black text-blue-600 opacity-60">{r.desc}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-6 max-w-md mx-auto">
                <input type="text" className="w-full p-6 bg-slate-100 rounded-[1.5rem] outline-none text-lg font-bold text-center" placeholder="اسم المستخدم" />
                <button onClick={() => setAuthMode('select_role')} className="w-full py-6 bg-slate-900 text-white rounded-[1.5rem] font-black text-xl">دخول</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
