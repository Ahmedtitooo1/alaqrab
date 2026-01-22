
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Camera, X, BrainCircuit, Sparkles, Trash2 } from 'lucide-react';
import { getSmartTutorResponse } from '../services/geminiService';
import { useAppContext } from '../context/AppContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
}

const SmartTutor: React.FC = () => {
  const { lang, user, useAiQuestion } = useAppContext();
  const isRtl = lang === 'ar';

  // Load initial messages from localStorage or default
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chatHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const questionsLeft = user?.aiQuestionsCount || 0;

  // Initialize with welcome message only if empty
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: isRtl
            ? `مرحباً بك يا ${user?.firstName}. أنا معلمك الذكي المدعوم بتقنية Gemini. اسألني عن أي معضلة علمية أو ارفع صورة لمسألة وسأقوم بحلها خطوة بخطوة!`
            : `Hello ${user?.firstName}. I am your AI Smart Tutor. Ask me anything or upload a photo of a problem and I will solve it step by step!`
        }
      ]);
    }
  }, [lang, user?.firstName]);

  // Persist functionality
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [isTyping]);

  const allowedKeywords = ['exam', 'lesson', 'math', 'science', 'history', 'homework', 'explain', 'physics', 'grade', 'school', 'question', 'quiz', 'solve', 'help', 'اختبار', 'درس', 'رياضيات', 'علوم', 'تاريخ', 'واجب', 'اشرح', 'فيزياء', 'درجة', 'مدرسة', 'سؤال', 'حل', 'مساعدة'];

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isTyping || questionsLeft <= 0) return;

    const userMsg = input.trim();
    const currentImg = selectedImage;

    // 1. Guardrails Check
    const lowerInput = userMsg.toLowerCase();
    // Allow if image is present (usually needs explanation) OR regex matches keyword
    const isTopicAllowed = selectedImage || allowedKeywords.some(k => lowerInput.includes(k));

    setInput('');
    setSelectedImage(null);
    setMessages(prev => [...prev, { role: 'user', content: userMsg, image: currentImg || undefined }]);

    if (!isTopicAllowed) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: isRtl
            ? "🚫 عذراً، أنا معلم ذكي مخصص للإجابة عن الأسئلة الدراسية والأكاديمية فقط. يرجى طرح سؤال يتعلق بمناهجك الدراسية."
            : "🚫 I am your AI Educational Tutor. I can only answer questions related to your curriculum and lessons."
        }]);
      }, 500);
      return;
    }

    setIsTyping(true);

    const success = useAiQuestion();
    if (success) {
      // 2. Call Restricted Data Source
      const response = await getSmartTutorResponse(userMsg || (isRtl ? "اشرح لي هذه الصورة" : "Explain this image"), currentImg || undefined);
      setMessages(prev => [...prev, { role: 'assistant', content: response || "" }]);
    }
    setIsTyping(false);
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem('chatHistory');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] rounded-[2.5rem] border border-slate-100 overflow-hidden bg-white shadow-2xl animate-view">
      {/* Header */}
      <div className="p-8 border-b bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-amber-500 text-black rounded-2xl shadow-lg animate-pulse shadow-amber-500/20">
            <BrainCircuit size={28} />
          </div>
          <div>
            <h3 className="text-xl font-black text-black">{isRtl ? 'المعلم الذكي AI' : 'AI Smart Tutor'}</h3>
            <p className="text-[10px] text-amber-600 font-black uppercase tracking-[0.2em] mt-1">{questionsLeft} استفساراً متبقياً اليوم</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {messages.length > 1 && (
            <button onClick={clearHistory} className="p-2 text-slate-400 hover:text-rose-600 transition-colors" title="مسح المحادثة"><Trash2 size={18} /></button>
          )}
          <div className="px-6 py-2.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black border border-blue-100 uppercase tracking-widest flex items-center gap-2">
            <Sparkles size={14} /> Gemini 1.5 Pro
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar bg-[#fafafa]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'} animate-view`}>
            <div className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`p-3 rounded-2xl h-fit shadow-sm ${msg.role === 'user' ? 'bg-slate-100 text-slate-600' : 'bg-blue-600 text-white'}`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className="space-y-2">
                <div className={`p-6 rounded-3xl text-sm font-bold shadow-sm leading-relaxed ${msg.role === 'user'
                    ? 'bg-white text-black border border-slate-100 rounded-tr-none'
                    : 'bg-blue-600 text-white rounded-tl-none shadow-blue-600/20'
                  }`}>
                  {msg.image && (
                    <img src={msg.image} alt="attachment" className="rounded-2xl mb-4 max-h-72 w-full object-cover border-2 border-white/20 shadow-lg" />
                  )}
                  {msg.content}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-end gap-4">
            <div className="p-5 bg-blue-50 text-blue-700 rounded-3xl border border-blue-100 flex items-center gap-4 shadow-sm">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-xs font-black uppercase tracking-widest">{isRtl ? 'المعلم يقوم بالتحليل...' : 'Tutor is analyzing...'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-8 border-t bg-white">
        {selectedImage && (
          <div className="mb-6 relative w-28 h-28 group">
            <img src={selectedImage} className="w-full h-full object-cover rounded-2xl border-4 border-amber-500 shadow-xl" alt="Preview" />
            <button onClick={() => setSelectedImage(null)} className="absolute -top-3 -right-3 p-2 bg-rose-600 text-white rounded-full shadow-xl hover:scale-110 transition-all"><X size={14} /></button>
          </div>
        )}

        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-3xl border-2 border-transparent focus-within:border-blue-600 focus-within:bg-white transition-all shadow-inner">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setSelectedImage(reader.result as string);
                reader.readAsDataURL(file);
              }
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-4 bg-white text-slate-500 rounded-2xl hover:text-blue-600 shadow-sm transition-all border border-slate-100"
          >
            <Camera size={24} />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isRtl ? 'اسأل المعلم عن أي مسألة أو قاعدة علمية معقدة...' : 'Ask about any complex scientific problem or rule...'}
            className="flex-1 bg-transparent border-none outline-none p-3 text-sm font-bold text-black placeholder-slate-400"
          />

          <button
            onClick={handleSend}
            disabled={(!input.trim() && !selectedImage) || isTyping || questionsLeft <= 0}
            className="p-5 bg-blue-600 text-white rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-blue-600/30"
          >
            {isTyping ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} className={isRtl ? 'rotate-180' : ''} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartTutor;
