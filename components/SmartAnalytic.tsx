
import React, { useState, useEffect } from 'react';
import { Sparkles, BrainCircuit, Lightbulb, Zap, CheckCircle, RefreshCw, Edit2, ArrowLeftRight, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';
import { getSmartAnalysis } from '../services/geminiService';

interface SmartAnalyticProps {
  role: UserRole;
  dataContext: string;
}

const SmartAnalytic: React.FC<SmartAnalyticProps> = ({ role, dataContext }) => {
  const { t, theme, lang } = useAppContext();
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const isRtl = lang === 'ar';

  const fetchAnalysis = async () => {
    setIsLoading(true);
    const result = await getSmartAnalysis(role, dataContext);
    setAnalysis(result || '');
    setIsLoading(false);
  };

  useEffect(() => {
    if (isExpanded && !analysis) fetchAnalysis();
  }, [isExpanded]);

  return (
    <div className={`relative rounded-[2.5rem] border-2 overflow-hidden transition-all duration-500 shadow-2xl flex flex-col backdrop-blur-xl ${
      theme === 'dark' 
        ? 'bg-slate-900/70 border-amber-500/20 shadow-amber-500/5' 
        : 'bg-white/80 border-amber-500/10 shadow-slate-200'
    } ${isExpanded ? 'p-8 md:p-10' : 'p-4 h-24'}`}>
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className={`p-3 bg-amber-500 text-slate-950 rounded-2xl shadow-lg transition-transform ${isExpanded ? 'scale-110' : 'scale-90'}`}>
            <BrainCircuit size={isExpanded ? 28 : 22} />
          </div>
          <div>
            <h3 className={`font-black text-amber-500 leading-tight transition-all ${isExpanded ? 'text-2xl' : 'text-lg'}`}>
              {isRtl ? 'المحلل الذكي AI' : 'AI Smart Analyst'}
            </h3>
            {isExpanded && (
              <p className="text-[10px] text-slate-500 dark:text-amber-600 font-bold uppercase tracking-[0.2em] mt-1">
                {isRtl ? 'تحليلات مدعومة بذكاء Gemini' : 'Powered by Gemini AI'}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isExpanded && (
            <button 
              onClick={fetchAnalysis}
              disabled={isLoading}
              className="p-3 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl hover:scale-110 transition-all border dark:border-white/10"
            >
              <RefreshCw size={18} className={`${isLoading ? 'animate-spin text-amber-500' : 'text-slate-500'}`} />
            </button>
          )}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-3 bg-amber-500/10 text-amber-500 rounded-xl hover:bg-amber-500/20 transition-all"
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className={`mt-8 flex-1 space-y-6 relative z-10 transition-all ${isLoading ? 'opacity-50 blur-[2px]' : 'opacity-100'}`}>
          {analysis ? (
            <div className={`p-6 rounded-[2rem] border-2 border-amber-500/5 shadow-inner ${theme === 'dark' ? 'bg-slate-950/40' : 'bg-slate-50/40'}`}>
              <div className="flex items-start gap-4">
                <Lightbulb className="text-amber-500 mt-1 flex-shrink-0" size={24} />
                <div className="space-y-4">
                   <p className="text-base font-bold leading-relaxed text-slate-950 dark:text-slate-100 whitespace-pre-wrap text-justify">
                     {analysis}
                   </p>
                   <div className="flex flex-wrap gap-3 pt-4">
                      <button className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-slate-950 rounded-xl text-[11px] font-black shadow-lg hover:bg-amber-400 transition-all">
                        <CheckCircle size={14} /> {isRtl ? 'اعتماد' : 'Apply'}
                      </button>
                      <button className="flex items-center gap-2 px-5 py-2.5 bg-white/20 dark:bg-slate-800/50 text-slate-900 dark:text-white rounded-xl text-[11px] font-black border border-amber-500/10">
                        <Edit2 size={14} /> {isRtl ? 'تعديل' : 'Edit'}
                      </button>
                   </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="animate-spin text-amber-500 mb-4" size={32} />
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{isRtl ? 'استخلاص البيانات...' : 'Processing...'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartAnalytic;
