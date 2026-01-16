
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Camera, X, BrainCircuit, Sparkles, Mic, MicOff, Volume2 } from 'lucide-react';
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const questionsLeft = user?.aiQuestionsCount || 0;

  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: isRtl
          ? `مرحباً بك يا ${user?.firstName}. أنا معلمك الذكي المدعوم بتقنية Gemini. اسألني عن أي معضلة علمية أو ارفع صورة لمسألة وسأقوم بحلها خطوة بخطوة!`
          : `Hello ${user?.firstName}. I am your AI Smart Tutor. Ask me anything or upload a photo of a problem and I will solve it step by step!`
      }
    ]);
  }, [lang, user?.firstName]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isTyping || questionsLeft <= 0) return;

    const userMsg = input.trim();
    const currentImg = selectedImage;

    setInput('');
    setSelectedImage(null);
    setMessages(prev => [...prev, { role: 'user', content: userMsg, image: currentImg || undefined }]);
    setIsTyping(true);

    const success = useAiQuestion();
    if (success) {
      const response = await getSmartTutorResponse(userMsg || (isRtl ? "اشرح لي هذه الصورة" : "Explain this image"), currentImg || undefined);
      setMessages(prev => [...prev, { role: 'assistant', content: response || "" }]);
    }
    setIsTyping(false);
  };

  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'assistant' && !isTyping) {
        // Auto-speak if voice mode was active logic could go here, for now manual or simple check
        // But user asked for "answers spoken".
        // Let's add a small speak button to each message instead of auto-speak to avoid annoyance, or auto-speak if input was voice.
        if (isListening) { // This state is current listening, not "was voice input". We might need a "wasVoice" tracker.
          // Simplified: Speak button on UI is better.
        }
      }
    }
  }, [messages, isTyping]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = isRtl ? 'ar-SA' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };


  return (
    <div className="flex flex-col h-[calc(100vh-140px)] rounded-[2.5rem] border border-slate-100 overflow-hidden bg-white shadow-2xl animate-view">
      {/* Header */}
      <div className="p-8 border-b bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg animate-pulse shadow-indigo-600/20">
            <BrainCircuit size={28} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">{isRtl ? 'المعلم الذكي AI' : 'AI Smart Tutor'}</h3>
            <p className="text-[10px] text-indigo-600 font-black uppercase tracking-[0.2em] mt-1">{questionsLeft} استفساراً متبقياً اليوم</p>
          </div>
        </div>
        <div className="px-6 py-2.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black border border-indigo-100 uppercase tracking-widest flex items-center gap-2">
          <Sparkles size={14} /> Gemini 1.5 Pro Model
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar bg-[#fafafa]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'} animate-view`}>
            <div className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`p-3 rounded-2xl h-fit shadow-sm ${msg.role === 'user' ? 'bg-slate-100 text-slate-600' : 'bg-indigo-600 text-white'}`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className="space-y-2">
                <div className={`p-6 rounded-3xl text-sm font-bold shadow-sm leading-relaxed ${msg.role === 'user'
                  ? 'bg-white text-slate-900 border border-slate-100 rounded-tr-none'
                  : 'bg-indigo-600 text-white rounded-tl-none shadow-indigo-600/20'
                  }`}>
                  {msg.image && (
                    <img src={msg.image} alt="attachment" className="rounded-2xl mb-4 max-h-72 w-full object-cover border-2 border-white/20 shadow-lg" />
                  )}
                  {msg.content}
                </div>
                {msg.role === 'assistant' && (
                  <button onClick={() => speak(msg.content)} className="p-2 text-indigo-400 hover:text-indigo-600 transition-all opacity-50 hover:opacity-100">
                    <Volume2 size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-end gap-4">
            <div className="p-5 bg-indigo-50 text-indigo-700 rounded-3xl border border-indigo-100 flex items-center gap-4 shadow-sm">
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
            <img src={selectedImage} className="w-full h-full object-cover rounded-2xl border-4 border-indigo-500 shadow-xl" alt="Preview" />
            <button onClick={() => setSelectedImage(null)} className="absolute -top-3 -right-3 p-2 bg-rose-600 text-white rounded-full shadow-xl hover:scale-110 transition-all"><X size={14} /></button>
          </div>
        )}

        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-3xl border-2 border-transparent focus-within:border-indigo-600 focus-within:bg-white transition-all shadow-inner">
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
            className="p-4 bg-white text-slate-500 rounded-2xl hover:text-indigo-600 shadow-sm transition-all border border-slate-100"
            title={isRtl ? "رفع صورة" : "Upload Image"}
          >
            <Camera size={24} />
          </button>

          <button
            onClick={() => {
              if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                const recognition = new SpeechRecognition();
                recognition.lang = isRtl ? 'ar-SA' : 'en-US';
                recognition.onstart = () => setIsListening(true);
                recognition.onend = () => setIsListening(false);
                recognition.onresult = (event: any) => {
                  const transcript = event.results[0][0].transcript;
                  setInput(transcript);
                };
                recognition.start();
              } else {
                alert("المتصفح لا يدعم الأوامر الصوتية");
              }
            }}
            className={`p-4 rounded-2xl shadow-sm transition-all border border-slate-100 ${isListening ? 'bg-rose-600 text-white animate-pulse' : 'bg-white text-slate-500 hover:text-indigo-600'}`}
            title={isRtl ? "تحدث صوتياً" : "Voice Input"}
          >
            {isListening ? <MicOff size={24} /> : <Mic size={24} />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? (isRtl ? 'جاري الاستماع...' : 'Listening...') : (isRtl ? 'اسأل المعلم عن أي مسألة أو قاعدة علمية معقدة...' : 'Ask about any complex scientific problem or rule...')}
            className="flex-1 bg-transparent border-none outline-none p-3 text-sm font-bold text-slate-900 placeholder-slate-400"
          />

          <button
            onClick={handleSend}
            disabled={(!input.trim() && !selectedImage) || isTyping || questionsLeft <= 0}
            className="p-5 bg-indigo-600 text-white rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-indigo-600/30"
          >
            {isTyping ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} className={isRtl ? 'rotate-180' : ''} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartTutor;
