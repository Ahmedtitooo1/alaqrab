import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
    Scan, Search, CheckCircle2, AlertOctagon, CreditCard,
    X, UserCircle, Receipt, ArrowRight, Printer
} from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import { openProfessionalPrintWindow } from '../../utils/printUtils';

// Mock Data
const MOCK_DB: Record<string, any> = {
    '123': {
        id: '123',
        name: 'Ahmed Mohamed Ali',
        grade: 'Year 3 - Secondary',
        details: 'Scientific Section',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
        financialStatus: 'overdue', // overdue, paid
        balance: -4500, // EGP
        lastPayment: '2023-10-15'
    },
    '456': {
        id: '456',
        name: 'Sarah Ibrahim',
        grade: 'Year 2 - Secondary',
        details: 'Literary Section',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        financialStatus: 'paid',
        balance: 0,
        lastPayment: '2024-01-10'
    }
};

const WalkIn: React.FC = () => {
    const { isRtl } = useAppContext();
    const [query, setQuery] = useState('');
    const [student, setStudent] = useState<any>(null);
    const [scanStatus, setScanStatus] = useState<'idle' | 'success' | 'error' | 'warning'>('idle');
    const [flash, setFlash] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Keep focus on input for scanner
    useEffect(() => {
        const focusInterval = setInterval(() => {
            if (document.activeElement !== inputRef.current && !student) {
                inputRef.current?.focus();
            }
        }, 2000);
        return () => clearInterval(focusInterval);
    }, [student]);

    // Handle Input (Scanner simulation)
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);

        // Simulate "Enter" or fast typing from scanner
        // In real scenario, scanner sends Enter key at end.
        // We'll just check if query matches key for instant feedback
        if (MOCK_DB[val]) {
            processScan(MOCK_DB[val]);
            setQuery('');
        }
    };

    const processScan = (data: any) => {
        setStudent(data);
        if (data.financialStatus === 'overdue') {
            setScanStatus('error');
            triggerAlarm();
        } else {
            setScanStatus('success');
            playSuccessSound();
        }
    };

    const triggerAlarm = () => {
        setFlash(true);
        // Play Error Sound (Commented out actual Audio to prevent errors if file missing)
        // const audio = new Audio('/sounds/error.mp3');
        // audio.play().catch(() => {});

        // Simulate flash end
        setTimeout(() => setFlash(false), 800);
    };

    const playSuccessSound = () => {
        // const audio = new Audio('/sounds/beep.mp3');
        // audio.play().catch(() => {});
    };

    const handlePayNow = () => {
        if (student) {
            // Optimistic Update
            setStudent({ ...student, financialStatus: 'paid', balance: 0 });
            setScanStatus('success');
            playSuccessSound();
        }
    };

    const clearScan = () => {
        setStudent(null);
        setScanStatus('idle');
        setQuery('');
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    return (
        <div className={`min-h-screen transition-colors duration-200 flex flex-col items-center p-8 relative overflow-hidden ${flash ? 'bg-rose-600' : 'bg-slate-50'
            }`}>

            {/* Background Decor */}
            {!flash && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl -ml-20 -mb-20"></div>
                </div>
            )}

            {/* Header */}
            <div className="w-full max-w-4xl flex items-center justify-between mb-12 relative z-10 w-full">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white text-slate-900 rounded-2xl shadow-sm">
                        <Scan size={24} />
                    </div>
                    <div>
                        <h1 className={`text-2xl font-black tracking-tight ${flash ? 'text-white' : 'text-slate-900'}`}>Walk-In Scanner</h1>
                        <p className={`font-bold text-xs uppercase tracking-widest ${flash ? 'text-rose-200' : 'text-slate-400'}`}>Secretary Module</p>
                    </div>
                </div>
                {!student && (
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-white px-4 py-2 rounded-full shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        READY TO SCAN
                    </div>
                )}
            </div>

            {/* SCANNER INPUT AREA */}
            {!student && (
                <div className="flex-1 w-full max-w-2xl flex flex-col items-center justify-center -mt-20 relative z-10">
                    <div className="relative w-full group">
                        <div className="absolute inset-0 bg-indigo-500 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={handleSearch}
                            placeholder="Scan Student ID / Barcode..."
                            className="w-full h-24 bg-white border-4 border-slate-100 hover:border-indigo-100 focus:border-indigo-600 rounded-[2.5rem] text-center text-3xl font-black text-slate-900 placeholder:text-slate-300 shadow-2xl transition-all outline-none caret-indigo-600"
                            autoFocus
                        />
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300">
                            <Search size={32} />
                        </div>
                    </div>

                    <div className="flex gap-4 mt-8 w-full max-w-md">
                        <button
                            onClick={() => inputRef.current?.focus()}
                            className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-600 transition-all flex items-center justify-center gap-3"
                        >
                            <Scan size={20} />
                            ACTIVATE SCANNER
                        </button>
                    </div>

                    <p className="mt-4 text-slate-400 font-bold text-sm tracking-widest uppercase">
                        Scanner is active. Input will focus automatically.
                    </p>
                </div>
            )}

            {/* RESULT CARD */}
            {student && (
                <div className="w-full max-w-4xl animate-fade-in-up relative z-10">
                    <div className={`rounded-[3rem] p-10 shadow-2xl transition-all border-4 relative overflow-hidden ${scanStatus === 'error' ? 'bg-white border-rose-500 shadow-rose-200' : 'bg-white border-emerald-500 shadow-emerald-200'
                        }`}>

                        {/* Close Button */}
                        <button onClick={clearScan} className="absolute top-8 right-8 p-4 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-2xl transition-all">
                            <X size={24} />
                        </button>

                        <div className="flex flex-col md:flex-row gap-12 items-start">

                            {/* Photo Section */}
                            <div className="flex-shrink-0 relative">
                                <img src={student.photo} className="w-48 h-48 rounded-[2rem] object-cover bg-slate-100 shadow-inner border-2 border-slate-50" alt="Student" />
                                <div className={`absolute -bottom-4 -right-4 px-6 py-2 rounded-xl text-white font-black text-sm uppercase tracking-wider shadow-lg ${scanStatus === 'error' ? 'bg-rose-500' : 'bg-emerald-500'
                                    }`}>
                                    {scanStatus === 'error' ? 'Action Required' : 'Active'}
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="flex-1 space-y-8">
                                <div>
                                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">{student.name}</h2>
                                    <div className="flex items-center gap-3 mt-2 text-slate-500 font-bold">
                                        <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs uppercase tracking-widest">{student.grade}</span>
                                        <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs uppercase tracking-widest">{student.details}</span>
                                    </div>
                                </div>

                                <div className={`p-6 rounded-2xl border-2 flex items-center justify-between ${scanStatus === 'error'
                                    ? 'bg-rose-50 border-rose-100'
                                    : 'bg-emerald-50 border-emerald-100'
                                    }`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`p-4 rounded-xl ${scanStatus === 'error' ? 'bg-rose-200 text-rose-700' : 'bg-emerald-200 text-emerald-700'
                                            }`}>
                                            {scanStatus === 'error' ? <AlertOctagon size={24} /> : <CheckCircle2 size={24} />}
                                        </div>
                                        <div>
                                            <p className={`font-black uppercase tracking-widest text-xs ${scanStatus === 'error' ? 'text-rose-600' : 'text-emerald-600'
                                                }`}>
                                                Financial Status
                                            </p>
                                            <p className="text-xl font-bold text-slate-800 uppercase mt-1">
                                                {student.financialStatus}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Balance</p>
                                        <p className="text-3xl font-black text-slate-900 tabular-nums">{student.balance} <span className="text-sm text-slate-400">EGP</span></p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-4 pt-4">
                                    {scanStatus === 'error' ? (
                                        <button
                                            onClick={handlePayNow}
                                            className="flex-1 py-5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-rose-200 flex items-center justify-center gap-3 transition-all active:scale-95"
                                        >
                                            <CreditCard size={20} /> PAY NOW, UPDATE STATUS
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                const ticketHtml = `
                                                    <div style="text-align: center; margin-bottom: 10px;">
                                                        <h1 style="font-size: 1.2rem; font-weight: 900; margin: 0;">منظومة العقرب</h1>
                                                        <p style="font-size: 0.8rem; margin: 0;">ALEAQRAB SYSTEM</p>
                                                    </div>
                                                    
                                                    <div style="text-align: center; border: 2px dashed #000; padding: 10px; margin: 10px 0; border-radius: 8px;">
                                                        <h2 style="font-size: 1.5rem; font-weight: 900; margin: 0;">تذكرة دخول</h2>
                                                        <p style="font-size: 0.8rem; margin: 5px 0 0 0; font-weight: bold;">ADMISSION TICKET</p>
                                                    </div>

                                                    <div style="margin: 15px 0; font-size: 0.9rem;">
                                                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                                            <span style="font-weight: bold;">الطالب:</span>
                                                            <span>${student.name}</span>
                                                        </div>
                                                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                                            <span style="font-weight: bold;">المرحلة:</span>
                                                            <span>${student.grade}</span>
                                                        </div>
                                                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                                            <span style="font-weight: bold;">التاريخ:</span>
                                                            <span style="direction: ltr;">${new Date().toLocaleDateString('en-GB')}</span>
                                                        </div>
                                                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                                            <span style="font-weight: bold;">الوقت:</span>
                                                            <span style="direction: ltr;">${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                    </div>

                                                    <div style="text-align: center; margin: 20px 0;">
                                                        <div style="background: #000; color: #fff; padding: 5px; font-weight: bold; font-family: monospace; letter-spacing: 2px;">
                                                            ${student.id}
                                                        </div>
                                                        <p style="font-size: 0.7rem; margin-top: 5px;">يسمح بالدخول لمرة واحدة</p>
                                                    </div>
                                                    
                                                    <div style="text-align: center; font-size: 0.7rem; border-top: 1px solid #000; pt: 10px;">
                                                        شكراً لالتزامكم
                                                    </div>
                                                `;

                                                openProfessionalPrintWindow(ticketHtml, {
                                                    title: `Ticket - ${student.name}`,
                                                    pageSize: 'receipt',
                                                    margin: '5mm',
                                                    showLogo: false,
                                                    fontSize: 'small'
                                                });
                                            }}
                                            className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-3 transition-all hover:bg-slate-800"
                                        >
                                            <Printer size={20} /> PRINT ADMISSION TICKET
                                        </button>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Quick Log */}
                    <div className="mt-8 flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-widest px-8">
                        <span>Last Payment: {student.lastPayment}</span>
                        <span>ID: {student.id}</span>
                    </div>
                </div>
            )}

        </div>
    );
};

export default WalkIn;
