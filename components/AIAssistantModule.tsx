
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Bot, Send, User, Sparkles, Loader2, Minimize2, Maximize2, X, BrainCircuit, Lightbulb, Trash2 } from 'lucide-react';
import { getSmartAnalysis } from '../services/geminiService';

export const AIAssistantModule: React.FC = () => {
    const { user, lang, useAiQuestion, t } = useAppContext();
    const [messages, setMessages] = useState<{ role: 'ai' | 'user'; content: string }[]>([
        { role: 'ai', content: lang === 'ar' ? 'أهلاً بك! أنا مساعد العقرب الذكي. كيف يمكنني مساعدتك اليوم؟' : 'Welcome! I am Al-Eaqrab Smart Assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const canAsk = useAiQuestion();
        if (!canAsk) {
            alert(lang === 'ar' ? "نفدت حصة الأسئلة المتاحة لك." : "You have run out of AI questions.");
            return;
        }

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            // Reusing getSmartAnalysis for general chat logic with specific context
            const result = await getSmartAnalysis(user?.role || 'guest' as any, `محادثة عامة مع مستخدم: ${userMsg}`);
            setMessages(prev => [...prev, { role: 'ai', content: result || t('sorry_error') }]);
        } catch (e) {
            setMessages(prev => [...prev, { role: 'ai', content: t('conn_error') }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-200px)] animate-view">
            <div className="premium-dark-card p-8 mb-6 rounded-[2.5rem] flex items-center justify-between border-none shadow-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-500 text-slate-950 rounded-2xl shadow-xl animate-pulse"><Bot size={28} /></div>
                    <div>
                        <h2 className="text-2xl font-black text-white italic">{t('ai_assistant_title') || 'Scorpion AI Assistant'}</h2>
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{t('ai_assistant_sub') || 'Integrated Smart Assistant'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-white/5 px-6 py-2 rounded-xl backdrop-blur-md border border-white/10">
                    <Sparkles size={16} className="text-amber-500" />
                    <span className="text-sm font-black text-white tabular-nums">{user?.aiQuestionsCount} {t('tokens_left')}</span>
                </div>
            </div>

            <div className="flex-1 glass-panel bg-white border border-slate-100 rounded-[3rem] shadow-sm flex flex-col overflow-hidden relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none overflow-hidden">
                    <BrainCircuit size={400} className="absolute -top-40 -left-40" />
                </div>

                <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar scroll-smooth">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2`}>
                            <div className={`p-6 max-w-[80%] rounded-[2rem] shadow-sm flex gap-4 ${m.role === 'ai' ? 'bg-slate-50 border border-slate-100 rounded-tr-none' : 'bg-indigo-600 text-white shadow-xl rounded-tl-none'}`}>
                                {m.role === 'ai' && <div className="p-2 bg-amber-500 text-slate-950 rounded-lg h-fit"><Bot size={16} /></div>}
                                <div className="space-y-2">
                                    <p className="text-sm font-bold leading-relaxed whitespace-pre-wrap">{m.content}</p>
                                    <p className={`text-[9px] font-black uppercase opacity-40 ${m.role === 'ai' ? 'text-slate-500' : 'text-white'}`}>
                                        {m.role === 'ai' ? 'Scorpion AI' : t('me') || 'Me'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center gap-4">
                                <Loader2 size={16} className="animate-spin text-amber-500" />
                                <span className="text-[10px] font-black text-slate-400 uppercase italic">{t('thinking')}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-8 border-t border-slate-50 bg-slate-50/50">
                    <div className="relative group">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="اسأل أي شيء... كيف يمكنني تحسين أدائي؟"
                            className="w-full p-6 pr-16 bg-white border-2 border-slate-100 rounded-[2rem] font-bold shadow-sm focus:border-amber-500 outline-none transition-all"
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-amber-500 text-slate-950 rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg"
                        >
                            <Send size={20} strokeWidth={3} />
                        </button>
                    </div>
                    <div className="mt-4 flex gap-4 justify-center">
                        <button className="text-[10px] font-black text-slate-400 flex items-center gap-2 hover:text-rose-500 transition-colors" onClick={() => setMessages([messages[0]])}>
                            <Trash2 size={12} /> مسح المحادثة
                        </button>
                        <div className="w-px h-3 bg-slate-300"></div>
                        <p className="text-[10px] font-black text-slate-400 flex items-center gap-2">
                            <Lightbulb size={12} className="text-amber-500" /> اسأل عن بنك الأسئلة أو تحليل النتائج
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
