
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Scan, UserCheck, CreditCard, Search, User, CheckCircle, XCircle, FileText, Printer, Clock } from 'lucide-react';
import { UserRole } from '../../types';

interface SecretaryViewProps {
    onNavigate: (tab: string) => void;
}

const SecretaryView: React.FC<SecretaryViewProps> = ({ onNavigate }) => {
    const { allUsers, lang, addNotification } = useAppContext();
    const isRtl = lang === 'ar';
    const [mode, setMode] = useState<'scan' | 'lookup'>('scan');
    const [searchQuery, setSearchQuery] = useState('');
    const [scannedCode, setScannedCode] = useState('');
    const [lastScannedStudent, setLastScannedStudent] = useState<any>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-focus logic for scanner
    useEffect(() => {
        if (mode === 'scan') {
            inputRef.current?.focus();
            const interval = setInterval(() => {
                if (document.activeElement !== inputRef.current) {
                    inputRef.current?.focus();
                }
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [mode]);

    const handleScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const code = scannedCode.trim();
            if (code) {
                const student = allUsers.find(u => u.code === code || u.id === code || u.username === code);
                if (student) {
                    setLastScannedStudent(student);
                    addNotification({ title: 'تم التعرف', content: `تم تسجيل حضور: ${student.firstName}`, type: 'success', date: new Date().toISOString() });
                    // Here we would call an attendance API
                } else {
                    addNotification({ title: 'خطأ', content: 'لم يتم العثور على طالب بهذا الكود', type: 'error', date: new Date().toISOString() });
                    setLastScannedStudent(null);
                }
                setScannedCode('');
            }
        }
    };

    return (
        <div className="animate-view p-6 space-y-8 min-h-screen pb-24">
            {/* Header / Modes */}
            <div className="glass-panel p-4 bg-white rounded-[2rem] flex justify-center gap-4 border border-slate-100 shadow-sm sticky top-4 z-50">
                <button onClick={() => setMode('scan')} className={`px-10 py-4 rounded-2xl font-black text-sm flex items-center gap-3 transition-all ${mode === 'scan' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
                    <Scan size={20} /> {isRtl ? 'وضع المسح (Kiosk)' : 'Scan Mode'}
                </button>
                <button onClick={() => setMode('lookup')} className={`px-10 py-4 rounded-2xl font-black text-sm flex items-center gap-3 transition-all ${mode === 'lookup' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
                    <Search size={20} /> {isRtl ? 'بحث يدوي' : 'Manual Lookup'}
                </button>
            </div>

            {mode === 'scan' ? (
                <div className="max-w-4xl mx-auto space-y-8 text-center pt-10">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full"></div>
                        <div className="relative bg-white p-12 rounded-[3.5rem] shadow-2xl border-4 border-indigo-50 flex flex-col items-center gap-8">
                            <div className="w-32 h-32 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center animate-pulse border-4 border-indigo-100">
                                <Scan size={64} />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-4xl font-black text-slate-900">{isRtl ? 'بانتظار مسح البطاقة...' : 'Waiting for ID Scan...'}</h2>
                                <p className="text-slate-400 font-bold text-lg">{isRtl ? 'يرجى تمرير بطاقة الطالب أمام القارئ' : 'Please scan student ID card'}</p>
                            </div>

                            <input
                                ref={inputRef}
                                value={scannedCode}
                                onChange={e => setScannedCode(e.target.value)}
                                onKeyDown={handleScan}
                                className="w-full max-w-lg p-6 bg-slate-50 border-2 border-indigo-100 focus:border-indigo-600 rounded-2xl text-center font-mono text-2xl tracking-widest outline-none transition-all shadow-inner"
                                placeholder="Scan Code Here..."
                            />
                        </div>
                    </div>

                    {lastScannedStudent && (
                        <div className="glass-panel p-8 bg-emerald-50 border-2 border-emerald-100 rounded-[3rem] animate-view flex flex-col md:flex-row items-center gap-8 text-right">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg text-emerald-600 border-4 border-emerald-100">
                                <UserCheck size={40} />
                            </div>
                            <div className="flex-1 space-y-2">
                                <h3 className="text-2xl font-black text-emerald-900">{lastScannedStudent.firstName} {lastScannedStudent.lastName}</h3>
                                <p className="font-bold text-emerald-600/60 font-mono text-lg">{lastScannedStudent.code}</p>
                                <div className="flex gap-4 pt-2">
                                    <span className="px-4 py-1 bg-white rounded-full text-emerald-700 font-black text-xs shadow-sm border border-emerald-100 flex items-center gap-2"><CheckCircle size={14} /> تم تسجيل الحضور</span>
                                    <span className="px-4 py-1 bg-white rounded-full text-slate-500 font-black text-xs shadow-sm border border-slate-100 flex items-center gap-2"><Clock size={14} /> {new Date().toLocaleTimeString('ar-EG')}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-black text-xs hover:bg-slate-50 shadow-sm border border-slate-200">ملف الطالب</button>
                                <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs hover:bg-emerald-700 shadow-lg shadow-emerald-200">سند قبض</button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="max-w-6xl mx-auto space-y-8 text-right">
                    <div className="relative">
                        <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
                        <input
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full p-6 pr-16 bg-white rounded-[2rem] font-black text-lg border-2 border-transparent focus:border-slate-900 outline-none shadow-sm transition-all"
                            placeholder={isRtl ? "بحث عن طالب بالاسم أو الرقم..." : "Search student by name or ID..."}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allUsers.filter(u => u.role === UserRole.STUDENT && (u.firstName.includes(searchQuery) || u.code.includes(searchQuery))).slice(0, 9).map(student => (
                            <div key={student.id} className="glass-panel p-6 bg-white rounded-[2rem] border border-slate-100 hover:border-indigo-600 transition-all group shadow-sm flex flex-col gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-slate-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        {student.firstName[0]}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 text-lg">{student.firstName} {student.lastName}</h4>
                                        <p className="text-xs font-mono text-slate-400">{student.code}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="py-3 bg-slate-50 text-slate-600 rounded-xl font-black text-xs hover:bg-emerald-50 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2">
                                        <UserCheck size={16} /> حضور
                                    </button>
                                    <button className="py-3 bg-slate-50 text-slate-600 rounded-xl font-black text-xs hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2">
                                        <FileText size={16} /> التفاصيل
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SecretaryView;
