import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { UserRole } from '../../../types';
import {
    Maximize, AlertTriangle, CheckCircle2, XCircle, Timer,
    ChevronRight, AlertOctagon, Lock, Eye, EyeOff
} from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import { mockDb } from '../../services/mockDb';

const ExamRoom: React.FC = () => {
    const { lang } = useAppContext();
    const isRtl = lang === 'ar';
    const [examState, setExamState] = useState<'idle' | 'active' | 'finished' | 'locked'>('idle');
    const [warnings, setWarnings] = useState(0);
    const [showWarningModal, setShowWarningModal] = useState(false);

    // Wire up to mockDb: Get the first exam
    const EXAM = mockDb.exams[0] || null;
    const [timeLeft, setTimeLeft] = useState(EXAM ? EXAM.duration * 60 : 0);

    // Fullscreen
    const enterFullscreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch((err) => {
                console.error("Error attempting to enable fullscreen:", err);
            });
        }
    };

    // Start Exam Handler
    const handleStartExam = () => {
        enterFullscreen();
        setExamState('active');
        setWarnings(0);
    };

    // Anti-Cheat: Visibility & Context Menu
    useEffect(() => {
        if (examState !== 'active') return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                triggerWarning();
            }
        };

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('contextmenu', handleContextMenu);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [examState]);

    // Warning Logic
    const triggerWarning = () => {
        const newCount = warnings + 1;
        setWarnings(newCount);
        setShowWarningModal(true);

        if (newCount >= 3) {
            // Auto fail/submit
            setExamState('locked');
        }
    };

    // Timer
    useEffect(() => {
        if (examState !== 'active') return;
        const timer = setInterval(() => {
            setTimeLeft((prev: number) => {
                if (prev <= 0) {
                    clearInterval(timer);
                    setExamState('finished');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [examState]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (!EXAM) return <div className="p-10 text-center">Exam Not Found</div>;

    return (
        <div className={`min-h-screen bg-slate-50 flex flex-col font-sans ${examState === 'locked' ? 'grayscale blur-sm pointer-events-none' : ''}`}>

            {/* HEADER */}
            <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                        <Lock size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-black text-slate-800 uppercase tracking-tight">{EXAM.title}</h1>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Student ID: 2026-X88</p>
                    </div>
                </div>

                {examState === 'active' && (
                    <div className={`px-6 py-2 rounded-full font-mono text-xl font-bold flex items-center gap-3 border transition-all ${timeLeft < 300 ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse' : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                        <Timer size={18} className={timeLeft < 300 ? 'animate-bounce' : ''} />
                        {formatTime(timeLeft)}
                    </div>
                )}
            </header>

            {/* CONTENT */}
            <main className="flex-1 max-w-5xl mx-auto w-full p-8">

                {examState === 'idle' && (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-8 animate-fade-in">
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
                            <div className="w-48 h-48 bg-white border-4 border-indigo-50 rounded-[3rem] flex items-center justify-center shadow-2xl relative z-10">
                                <AlertOctagon size={80} className="text-indigo-600" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-4xl font-black text-slate-900">Ready to Start?</h2>
                            <p className="text-slate-500 font-medium text-lg max-w-md mx-auto">
                                Please ensure you are in a quiet environment. Fullscreen mode will be enforced.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-left max-w-lg w-full bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <SecurityItem icon={Eye} label="Eye Tracking" allowed={false} />
                            <SecurityItem icon={Maximize} label="Fullscreen" allowed={true} />
                            <SecurityItem icon={AlertTriangle} label="No Tabs" allowed={false} />
                        </div>

                        <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                            {EXAM.questions.length} Questions • {EXAM.duration} Minutes • {EXAM.totalPoints} Points
                        </div>

                        <button
                            onClick={handleStartExam}
                            className="px-12 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group"
                        >
                            Start Exam Now <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}

                {examState === 'active' && (
                    <div className="space-y-8 animate-fade-in-up">
                        {EXAM.questions.map((q: any, idx: number) => (
                            <div key={q.id} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-indigo-100 transition-colors">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">{idx + 1}</span>
                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider rounded-lg">{q.points} Points</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-6">{q.text}</h3>

                                {q.type === 'short_essay' && (
                                    <textarea
                                        className="w-full h-32 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-500 rounded-2xl p-4 text-slate-700 font-medium resize-none outline-none transition-all placeholder:text-slate-400"
                                        placeholder="Type your answer here..."
                                    />
                                )}

                                {q.type === 'true_false' && (
                                    <div className="flex gap-4">
                                        <button className="flex-1 py-4 rounded-xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 font-bold text-slate-500 transition-all">True</button>
                                        <button className="flex-1 py-4 rounded-xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 font-bold text-slate-500 transition-all">False</button>
                                    </div>
                                )}

                                {q.type === 'single_choice' && (
                                    <div className="space-y-3">
                                        {q.options?.map((opt: any) => (
                                            <div key={opt.id} className="flex items-center p-4 rounded-xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 cursor-pointer transition-all">
                                                <div className="w-5 h-5 rounded-full border-2 border-slate-300 mr-4"></div>
                                                <span className="font-bold text-slate-700">{opt.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        <button className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-xl hover:bg-slate-800 transition-all shadow-2xl">
                            Submit Answers
                        </button>
                    </div>
                )}

                {examState === 'locked' && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-rose-500/20 backdrop-blur-md">
                        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md border-4 border-rose-500 animate-shake">
                            <div className="w-24 h-24 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <XCircle size={48} />
                            </div>
                            <h2 className="text-3xl font-black text-rose-600 mb-2">Exam Locked!</h2>
                            <p className="text-slate-600 font-bold">You violated the security rules 3 times. Your exam has been terminated.</p>
                            <button onClick={() => window.location.reload()} className="mt-8 px-8 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700">Return to Dashboard</button>
                        </div>
                    </div>
                )}

            </main>

            {/* WARNING MODAL */}
            {showWarningModal && examState !== 'locked' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full mx-4 border-b-4 border-amber-500 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-amber-500"></div>
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-2 animate-bounce">
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800">FOCUS!</h3>
                            <p className="text-slate-500 font-bold text-sm">
                                Tab switching is strictly prohibited.
                            </p>
                            <div className="py-2 px-4 bg-amber-50 text-amber-700 rounded-lg font-mono font-bold text-xs uppercase tracking-widest border border-amber-100">
                                Attempt {warnings}/3
                            </div>
                            <button
                                onClick={() => setShowWarningModal(false)}
                                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold mt-4 hover:bg-slate-800 transition-all"
                            >
                                I Understand
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

const SecurityItem = ({ icon: Icon, label, allowed }: { icon: any, label: string, allowed: boolean }) => (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
        <div className={`p-2 rounded-lg ${allowed ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
            <Icon size={16} />
        </div>
        <span className="text-xs font-bold text-slate-700">{label}</span>
        <div className={`ml-auto w-2 h-2 rounded-full ${allowed ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
    </div>
);

export default ExamRoom;
