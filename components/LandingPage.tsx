
import * as React from 'react';
import { useState } from 'react';
import { UserRole } from '../types';
import { useAppContext } from '../context/AppContext';
import {
  ArrowRight,
  GraduationCap, X,
  Briefcase, Calculator,
  ShieldCheck,
  Terminal,
  Users
} from 'lucide-react';

const LandingPage: React.FC<{ onStart: (role: UserRole) => void }> = ({ onStart }) => {
  const { t, lang, setUser, systemLogo, systemContact } = useAppContext();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'select_role'>('login');
  const isRtl = lang === 'ar';

  const roles = [
    { id: UserRole.SUPER_ADMIN, label: t('super_admin'), icon: <Terminal size={28} />, desc: 'إدارة السيرفر' },
    { id: UserRole.ADMIN, label: t('admin'), icon: <ShieldCheck size={28} />, desc: 'مدير فرع' },
    { id: UserRole.ACCOUNTANT, label: t('accountant'), icon: <Calculator size={28} />, desc: 'محاسب مالي' },
    { id: UserRole.TEACHER, label: t('teacher'), icon: <Briefcase size={28} />, desc: 'معلم' },
    { id: UserRole.PARENT, label: t('parent'), icon: <Users size={28} />, desc: 'ولي أمر' },
    { id: UserRole.STUDENT, label: t('student'), icon: <GraduationCap size={28} />, desc: 'طالب' },
  ];

  return (
    <div className={`min-h-screen bg-[#f8fafc] text-slate-900 overflow-hidden relative selection:bg-indigo-500 selection:text-white`}>
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-[40%] -left-[10%] w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <nav className="fixed top-0 left-0 right-0 z-[100] h-20 glass-panel border-b-0 border-white/20">
        <div className="max-w-7xl mx-auto px-8 h-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <img src={systemLogo} className="h-10 w-10 object-contain relative z-10" alt="AleaQrab" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-slate-900 uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">ALEAQRAB</span>
          </div>
          <button onClick={() => { setAuthMode('login'); setShowAuthModal(true); }} className="premium-btn btn-secondary text-xs rounded-full">دخول النظام</button>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="relative z-10 text-center px-8 animate-fade-in max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[10px] uppercase tracking-widest mb-8 border border-indigo-100 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            Version 3.0 Stable
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] mb-8 tracking-tight uppercase">
            <span className="block text-transparent bg-clip-text bg-gradient-to-br from-indigo-700 to-slate-900">ALEAQRAB</span>
            <span className="text-4xl md:text-5xl font-extrabold text-slate-400 mt-2 block tracking-normal">Educational Intelligence</span>
          </h1>

          <p className="text-xl md:text-2xl font-medium text-slate-500 mb-12 max-w-3xl mx-auto leading-relaxed">
            منظومة العقرب التعليمية: تكويد آلي، ربط مالي متقدم، وذكاء اصطناعي شامل لإدارة المؤسسات التعليمية باحترافية.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button onClick={() => { setAuthMode('select_role'); setShowAuthModal(true); }} className="btn-primary px-10 py-5 rounded-full text-lg flex items-center gap-4 group">
              بدء التجربة <ArrowRight size={24} className={`transition-transform duration-300 group-hover:translate-x-1 ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </button>
            <button className="px-10 py-5 bg-white text-slate-600 rounded-full font-bold text-lg border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">
              معرفة المزيد
            </button>
          </div>
        </div>
      </section>

      {showAuthModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-md transition-all">
          <div className="relative w-full max-w-6xl p-8 md:p-12 rounded-[2.5rem] text-center glass-card bg-white shadow-2xl animate-fade-in overflow-hidden border border-white/50">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500"></div>
            <button onClick={() => setShowAuthModal(false)} className="absolute top-8 left-8 p-3 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={24} /></button>

            <div className="mb-12 mt-4">
              <h2 className="text-4xl font-black text-slate-900 mb-4">{authMode === 'select_role' ? 'اختر هويتك' : 'تسجيل الدخول'}</h2>
              <p className="text-slate-500 font-medium text-lg">بوابة الدخول الموحدة للنظام الذكي</p>
            </div>

            {authMode === 'select_role' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
                    className="group relative p-6 rounded-[2rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-indigo-100 hover:shadow-xl transition-all duration-300 flex flex-col items-center"
                  >
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-md group-hover:text-indigo-600 transition-all text-slate-400">
                      {r.icon}
                    </div>
                    <h4 className="font-bold text-sm text-slate-800 mb-1">{r.label}</h4>
                    <span className="text-[10px] font-semibold text-slate-400 group-hover:text-indigo-500 transition-colors">{r.desc}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4 max-w-md mx-auto">
                <div className="text-left">
                  <label className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider ml-1">Username</label>
                  <input type="text" className="input-primary text-center" placeholder="اسم المستخدم" />
                </div>
                <button onClick={() => setAuthMode('select_role')} className="btn-primary w-full py-4 text-lg rounded-2xl shadow-lg shadow-indigo-200">دخول آمن</button>
              </div>
            )}
            {/* Contact Info Footer */}
            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-center gap-8 text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest">الدعم الفني:</span>
                <a href={`tel:${systemContact.phone}`} className="text-indigo-600 font-bold hover:underline" dir="ltr">{systemContact.phone}</a>
              </div>
              <div className="hidden md:block w-px h-4 bg-slate-200"></div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest">Email:</span>
                <a href={`mailto:${systemContact.email}`} className="text-indigo-600 font-bold hover:underline">{systemContact.email}</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
