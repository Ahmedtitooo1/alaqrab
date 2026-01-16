
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
    BrainCircuit, Sparkles, MessageSquare, Send, Bot, User as UserIcon,
    BarChart3, TrendingUp, Lightbulb, AlertTriangle, CheckCircle2, XCircle
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';

// --- AI Tutor Component ---
export const AITutor: React.FC = () => {
    const { user, t, useAiQuestion, lang } = useAppContext();
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
        { role: 'ai', content: `مرحباً ${user?.firstName}! أنا معلمك الذكي. اسألني أي سؤال في منهجك وسأساعدك في فهمه.` }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        if (user?.aiQuestionsCount === 0) {
            setMessages(prev => [...prev, { role: 'ai', content: "عذراً، لقد استهلكت رصيدك من الأسئلة هذا الشهر." }]);
            return;
        }

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsTyping(true);

        // Simulate AI Delay & Response
        setTimeout(() => {
            useAiQuestion();
            const responses = [
                "سؤال ممتاز! الإجابة تعتمد على فهمك للمبدأ الأساسي...",
                "لتبسيط الأمر، تخيل أنك تقوم بحساب الكتلة في بيئة منعدمة الجاذبية.",
                "تم ذكر هذا في الباب الثالث، وتحديداً في قانون حفظ الطاقة.",
                "نعم صحيح، ولكن يجب الانتباه للوحدات المستخدمة.",
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)] + ` (محاكاة لإجابة على: "${userMsg}")`;

            setMessages(prev => [...prev, { role: 'ai', content: randomResponse }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-[600px] glass-panel rounded-[2rem] overflow-hidden bg-white/60 relative">
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between bg-white/50 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg animate-pulse">
                        <BrainCircuit size={24} />
                    </div>
                    <div>
                        <h3 className="font-black text-lg text-slate-800">المعلم الذكي</h3>
                        <p className="text-xs font-bold text-indigo-600">Smart AI Tutor • {user?.aiQuestionsCount} محاولات متبقية</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((m, idx) => (
                    <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-4 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-slate-900 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                                {m.role === 'user' ? <UserIcon size={20} /> : <Bot size={20} />}
                            </div>
                            <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border'}`}>
                                {m.content}
                            </div>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="flex gap-4 max-w-[80%]">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                                <Bot size={20} />
                            </div>
                            <div className="p-4 bg-white rounded-2xl rounded-tl-none border shadow-sm">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t">
                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="اطرح سؤالك هنا..."
                        className="flex-1 input-primary pr-12"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Sparkles size={18} />
                    </div>
                    <button type="submit" disabled={!input.trim()} className="p-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200">
                        <Send size={20} className={lang === 'ar' ? 'rotate-180' : ''} />
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- AI Analyst Component ---
export const AIAnalyst: React.FC<{ role: UserRole }> = ({ role }) => {
    // Mock analysis data
    const analysis = {
        performance: 85,
        trend: 'up',
        strengths: ['الفيزياء', 'الرياضيات', 'الحضور'],
        weaknesses: ['التعبير الكتابي', 'التأخر الصباحي'],
        suggestions: [
            'زيادة التركيز على الأسئلة المقالية.',
            'مراجعة الوحدة الثانية في الكيمياء.',
            'الاستفادة من بنك الأسئلة للمراجعة.'
        ]
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {/* Performance Card */}
            <div className="glass-card p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-[4rem] transition-all group-hover:bg-emerald-500/20"></div>
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                        <TrendingUp size={24} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800">تحليل الأداء العام</h3>
                </div>
                <div className="flex items-end gap-4 mb-4">
                    <span className="text-6xl font-black text-slate-900">{analysis.performance}%</span>
                    <span className="text-sm font-bold text-emerald-500 mb-2 bg-emerald-50 px-2 py-1 rounded-lg">+4.2% تحسن</span>
                </div>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                    مستواك في تحسن مستمر مقارنة بالشهر السابق. الأداء في المواد العلمية ممتاز جداً، وهناك استقرار في معدلات الحضور.
                </p>
            </div>

            {/* Insights Card */}
            <div className="glass-card p-8 group">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                        <Lightbulb size={24} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800">توصيات الذكاء الاصطناعي</h3>
                </div>
                <div className="space-y-4">
                    {analysis.suggestions.map((s, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border hover:border-indigo-200 transition-colors">
                            <Sparkles size={16} className="text-amber-500 mt-1 shrink-0" />
                            <p className="text-sm font-bold text-slate-700">{s}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="glass-card p-8 md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="flex items-center gap-2 font-black text-emerald-600 mb-4">
                            <CheckCircle2 size={20} /> نقاط القوة
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {analysis.strengths.map(s => (
                                <span key={s} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold border border-emerald-100">{s}</span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="flex items-center gap-2 font-black text-rose-600 mb-4">
                            <AlertTriangle size={20} /> نقاط تحتاج لتحسين
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {analysis.weaknesses.map(w => (
                                <span key={w} className="px-4 py-2 bg-rose-50 text-rose-700 rounded-lg text-sm font-bold border border-rose-100">{w}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
