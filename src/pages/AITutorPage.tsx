import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, BookOpen, Lightbulb, Brain } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { getSmartTutorResponse } from '../../services/geminiService';

export const AITutorPage: React.FC = () => {
    const { user, lang } = useAppContext();
    const isRtl = lang === 'ar';
    const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
        {
            role: 'ai',
            content: isRtl
                ? 'مرحباً! أنا المعلم الذكي 🎓 كيف يمكنني مساعدتك اليوم في دراستك؟'
                : 'Hello! I\'m your AI Tutor 🎓 How can I help you with your studies today?'
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const response = await getSmartTutorResponse(userMessage);
            setMessages(prev => [...prev, { role: 'ai', content: response }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'ai',
                content: isRtl
                    ? 'عذراً، حدث خطأ. حاول مرة أخرى.'
                    : 'Sorry, an error occurred. Please try again.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const quickQuestions = isRtl ? [
        'شرح قوانين نيوتن للحركة',
        'ما هي عملية البناء الضوئي؟',
        'كيف أحل معادلات الدرجة الثانية؟',
        'أعطني ملخص للحرب العالمية الأولى'
    ] : [
        'Explain Newton\'s Laws of Motion',
        'What is photosynthesis?',
        'How do I solve quadratic equations?',
        'Summarize World War I'
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 animate-view">
                    <div className="inline-flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
                            <Brain size={32} className="text-white" />
                        </div>
                        <div className="text-start">
                            <h1 className="text-4xl font-black text-slate-900">
                                {isRtl ? 'المعلم الذكي' : 'AI Tutor'}
                            </h1>
                            <p className="text-slate-500 font-bold">
                                {isRtl ? 'اسأل واحصل على إجابات فورية ومفصلة' : 'Ask and get instant detailed answers'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Chat Container */}
                <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border-2 border-slate-100">
                    {/* Messages */}
                    <div className="h-[500px] overflow-y-auto p-8 space-y-6">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-view`}
                            >
                                {msg.role === 'ai' && (
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <Sparkles size={24} className="text-white" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[70%] px-6 py-4 rounded-3xl ${msg.role === 'user'
                                        ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-xl'
                                        : 'bg-slate-50 text-slate-900 border-2 border-slate-100'
                                        }`}
                                >
                                    <p className="text-sm font-bold leading-relaxed whitespace-pre-wrap">
                                        {msg.content}
                                    </p>
                                </div>
                                {msg.role === 'user' && (
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <span className="text-white font-black text-lg">
                                            {user?.firstName.charAt(0)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && (
                            <div className="flex gap-4 justify-start animate-view">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                                    <Sparkles size={24} className="text-white animate-pulse" />
                                </div>
                                <div className="bg-slate-50 px-6 py-4 rounded-3xl border-2 border-slate-100">
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Quick Questions */}
                    <div className="px-8 py-4 bg-slate-50 border-t-2 border-slate-100">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
                            {isRtl ? '🎯 أسئلة سريعة' : '🎯 Quick Questions'}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {quickQuestions.map((q, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setInput(q)}
                                    className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-xs font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input */}
                    <div className="p-6 bg-white border-t-2 border-slate-100">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder={isRtl ? 'اكتب سؤالك هنا...' : 'Type your question here...'}
                                className="flex-1 px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-900 outline-none focus:border-indigo-600 transition-all"
                                disabled={loading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={loading || !input.trim()}
                                className="px-8 py-4 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl font-black flex items-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
                            >
                                <Send size={20} />
                                {isRtl ? 'إرسال' : 'Send'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tips */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-6 bg-white rounded-2xl border-2 border-blue-100">
                        <BookOpen className="text-blue-600 mb-3" size={28} />
                        <h3 className="font-black text-slate-900 mb-2">
                            {isRtl ? 'اشرح لي' : 'Explain to me'}
                        </h3>
                        <p className="text-sm text-slate-500 font-bold">
                            {isRtl ? 'احصل على شرح مفصل لأي موضوع دراسي' : 'Get detailed explanations for any topic'}
                        </p>
                    </div>
                    <div className="p-6 bg-white rounded-2xl border-2 border-purple-100">
                        <Lightbulb className="text-purple-600 mb-3" size={28} />
                        <h3 className="font-black text-slate-900 mb-2">
                            {isRtl ? 'ساعدني في الحل' : 'Help me solve'}
                        </h3>
                        <p className="text-sm text-slate-500 font-bold">
                            {isRtl ? 'احصل على خطوات الحل للمسائل الرياضية' : 'Get step-by-step solutions'}
                        </p>
                    </div>
                    <div className="p-6 bg-white rounded-2xl border-2 border-emerald-100">
                        <Brain className="text-emerald-600 mb-3" size={28} />
                        <h3 className="font-black text-slate-900 mb-2">
                            {isRtl ? 'لخص لي' : 'Summarize'}
                        </h3>
                        <p className="text-sm text-slate-500 font-bold">
                            {isRtl ? 'احصل على ملخصات سريعة للمواضيع الطويلة' : 'Get quick summaries of long topics'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AITutorPage;
