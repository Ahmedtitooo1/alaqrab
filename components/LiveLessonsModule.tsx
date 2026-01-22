
import React, { useState, useRef, useEffect } from 'react';
import {
   MonitorPlay, Users, MessageSquare, Mic, MicOff, Video, VideoOff,
   Send, X, Radio, MonitorUp, LogOut, Loader2, PlayCircle, Eye, Share2,
   VolumeX, Volume2, Hand, CheckCircle2, MoreVertical, Presentation,
   Lock, ArrowRight, UserCheck, MonitorCheck, ShieldCheck, UserX,
   Sparkles, Wifi, Settings
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';

const LiveLessonsModule: React.FC<{ isStudentView?: boolean }> = ({ isStudentView = false }) => {
   const { lang, user, addNotification } = useAppContext();
   const isRtl = lang === 'ar';

   const [isJoined, setIsJoined] = useState(false);
   const [isMicMuted, setIsMicMuted] = useState(true);
   const [showSettings, setShowSettings] = useState(false);
   const [permissions, setPermissions] = useState({
      allowChat: true,
      allowHandRaise: true,
      allowMicRequest: true,
      allowCamera: false,
      autoRecord: false
   });

   const [studentRequests, setStudentRequests] = useState([
      { id: 'u4', name: 'ياسين محمود العزازي', avatar: 'STD1' }
   ]);

   const [openMics, setOpenMics] = useState([
      { id: 'u10', name: 'المعلم (محمود العزازي)', status: 'unmuted' }
   ]);

   const [comments] = useState([
      { id: '1', user: 'ياسين محمود', text: 'أهلاً بك يا مستر، الصورة واضحة جداً', time: '10:00 AM' },
      { id: '2', user: 'علي خالد', text: 'هل يمكن إعادة شرح النقطة الأخيرة؟', time: '10:02 AM' }
   ]);

   const handleStartSession = () => {
      setIsJoined(true);
      if (!isStudentView) {
         addNotification({ title: 'بدء البث', content: 'تم إخطار جميع طلابك ببدء الحصة المباشرة الآن.', type: 'info', date: new Date().toISOString() });
      }
   };

   if (isStudentView && !isJoined) {
      return (
         <div className="max-w-4xl mx-auto py-16 animate-view">
            <div className="glass-panel p-16 bg-white rounded-[4rem] shadow-3xl border-none text-center space-y-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 -mr-32 -mt-32 rounded-full blur-3xl opacity-50"></div>
               <div className="relative inline-block">
                  <div className="w-64 h-64 bg-slate-950 rounded-[4.5rem] flex items-center justify-center mx-auto shadow-3xl border-[15px] border-slate-50 group">
                     <Presentation size={120} className="text-white group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-rose-600 text-white rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
                     <Wifi size={40} />
                  </div>
               </div>
               <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 px-6 py-2 bg-rose-50 text-rose-600 rounded-full font-black text-xs uppercase tracking-widest border border-rose-100">
                     <div className="w-2 h-2 bg-rose-600 rounded-full animate-ping"></div> Live Session Detected
                  </div>
                  <h2 className="text-5xl font-black text-slate-900 tracking-tight">المعلم يبث الآن!</h2>
                  <p className="text-slate-500 font-bold text-2xl max-w-xl mx-auto leading-relaxed">
                     بدأت حصة "المراجعة النهائية - الفصل السابع" انضم الآن لتتمكن من التفاعل والمشاركة.
                  </p>
               </div>
               <div className="pt-10">
                  <button onClick={handleStartSession} className="px-20 py-8 bg-indigo-600 text-white rounded-[2.5rem] font-black text-3xl shadow-3xl hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-6 mx-auto group">
                     <PlayCircle size={48} className="group-hover:rotate-12 transition-transform" /> انضمام للبث المباشر
                  </button>
               </div>
            </div>
         </div>
      );
   }

   if (isJoined) {
      return (
         <div className="fixed inset-0 z-[1000] bg-slate-950 flex flex-col lg:flex-row animate-view overflow-hidden text-right">
            <div className="flex-1 relative flex flex-col bg-black">
               <div className="absolute top-8 right-8 z-20 flex gap-4">
                  <div className="px-6 py-2 bg-rose-600 text-white rounded-full text-[10px] font-black uppercase flex items-center gap-3 shadow-3xl animate-pulse">
                     <Radio size={18} /> مباشر الآن
                  </div>
                  <div className="px-6 py-2 bg-white/5 backdrop-blur-xl text-white border border-white/10 rounded-full text-[10px] font-black uppercase flex items-center gap-3">
                     <ShieldCheck size={18} className="text-blue-400" /> Scorpion Security Active
                  </div>
               </div>
               <div className="flex-1 flex items-center justify-center relative group">
                  <div className="w-full h-full bg-gradient-to-t from-slate-950 to-slate-900 flex items-center justify-center transition-all">
                     <div className="text-center space-y-4">
                        <div className="w-72 h-72 bg-white/5 rounded-full flex items-center justify-center border-4 border-white/10 overflow-hidden relative shadow-3xl mx-auto">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher`} className="w-full h-full object-cover" alt="broadcaster" />
                           <div className="absolute inset-0 bg-indigo-600/20 mix-blend-overlay"></div>
                        </div>
                        <h2 className="text-4xl font-black text-white">م/ {user?.firstName} {user?.lastName}</h2>
                        <p className="text-indigo-400 font-black uppercase tracking-[0.3em] text-sm">ENG. {user?.firstName?.toUpperCase()} IS TEACHING</p>
                     </div>
                  </div>

                  <div className="absolute bottom-10 inset-x-0 mx-auto w-fit bg-slate-900/90 backdrop-blur-3xl border border-white/10 p-5 rounded-[3rem] flex items-center gap-6 shadow-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-100">
                     <button onClick={() => setIsMicMuted(!isMicMuted)} className={`p-5 rounded-2xl transition-all ${isMicMuted ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}>
                        {isMicMuted ? <MicOff size={24} /> : <Mic size={24} />}
                     </button>
                     {isStudentView && permissions.allowHandRaise && (
                        <button className="p-5 bg-amber-500 text-slate-950 rounded-2xl hover:scale-110 transition-all shadow-lg shadow-amber-500/20">
                           <Hand size={24} />
                        </button>
                     )}
                     {!isStudentView && (
                        <button onClick={() => setShowSettings(!showSettings)} className={`p-5 rounded-2xl transition-all ${showSettings ? 'bg-indigo-600' : 'bg-slate-800'} text-white`}>
                           <Settings size={24} />
                        </button>
                     )}
                     <button onClick={() => setIsJoined(false)} className="px-10 py-5 bg-rose-600 text-white rounded-[1.75rem] font-black text-sm flex items-center gap-3 shadow-xl active:scale-95">
                        <LogOut size={22} /> {isStudentView ? 'مغادرة البث' : 'إنهاء الجلسة'}
                     </button>
                  </div>

                  {showSettings && !isStudentView && (
                     <div className="absolute bottom-36 inset-x-0 mx-auto w-80 bg-white rounded-[2.5rem] p-8 shadow-3xl animate-view border space-y-6">
                        <h4 className="font-black text-slate-900 border-b pb-4">إعدادات البث والمشاركة</h4>
                        <div className="space-y-4">
                           <PermissionToggle label="تفعيل الدردشة العامة" value={permissions.allowChat} onChange={v => setPermissions({ ...permissions, allowChat: v })} />
                           <PermissionToggle label="السماح برفع اليد" value={permissions.allowHandRaise} onChange={v => setPermissions({ ...permissions, allowHandRaise: v })} />
                           <PermissionToggle label="فتح الميكروفون للطلاب" value={permissions.allowMicRequest} onChange={v => setPermissions({ ...permissions, allowMicRequest: v })} />
                           <PermissionToggle label="فتح الكاميرا للطلاب" value={permissions.allowCamera} onChange={v => setPermissions({ ...permissions, allowCamera: v })} />
                           <PermissionToggle label="تسجيل الحصة آلياً" value={permissions.autoRecord} onChange={v => setPermissions({ ...permissions, autoRecord: v })} />
                        </div>
                     </div>
                  )}
               </div>
            </div>

            <div className="w-full lg:w-[450px] bg-slate-900 border-r border-white/5 flex flex-col shadow-2xl">
               <div className="p-8 border-b border-white/5 bg-slate-950 flex justify-between items-center text-right">
                  <h3 className="font-black text-lg flex items-center gap-4 uppercase tracking-tighter text-white">
                     <MessageSquare className="text-indigo-500" /> غرفة النقاش
                  </h3>
                  <span className="px-3 py-1 bg-white/5 text-slate-400 rounded-lg text-[10px] font-black">240 ONLINE</span>
               </div>
               <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar">
                  {permissions.allowChat ? (
                     <div className="space-y-6">
                        {comments.map(c => (
                           <div key={c.id} className="space-y-2 animate-view">
                              <div className="flex justify-between items-center text-[9px] font-black text-slate-500">
                                 <span className="text-indigo-400">@{c.user}</span>
                                 <span className="font-mono">{c.time}</span>
                              </div>
                              <p className={`text-xs font-bold p-4 bg-white/5 rounded-2xl border border-white/5 ${c.user.includes('ياسين') ? 'rounded-tl-none border-indigo-500/30' : 'rounded-tr-none'}`}>
                                 {c.text}
                              </p>
                           </div>
                        ))}
                     </div>
                  ) : (
                     <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-30">
                        <Lock size={40} className="text-white" />
                        <p className="text-white font-black text-xs">تم إيقاف الدردشة من قبل المعلم</p>
                     </div>
                  )}
               </div>
               {permissions.allowChat && (
                  <div className="p-6 bg-slate-950 border-t border-white/5 flex gap-4">
                     <input placeholder="اسأل المعلم شيئاً..." className="flex-1 bg-white/5 border-none outline-none p-4 rounded-2xl text-xs font-bold text-white shadow-inner focus:ring-1 focus:ring-indigo-600" />
                     <button className="p-4 bg-indigo-600 text-white rounded-xl shadow-xl hover:scale-105 transition-all"><Send size={20} /></button>
                  </div>
               )}
            </div>
         </div>
      );
   }

   return (
      <div className="max-w-4xl mx-auto py-20 text-center animate-view">
         <div className="space-y-12">
            <div className="relative inline-block">
               <div className="w-56 h-56 bg-white rounded-[4.5rem] flex items-center justify-center mx-auto shadow-2xl border-[15px] border-slate-50 group">
                  <MonitorPlay size={100} className="text-indigo-600 group-hover:scale-110 transition-transform" />
               </div>
               <div className="absolute -top-4 -right-4 w-16 h-16 bg-rose-600 text-white rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
                  <Radio size={32} />
               </div>
            </div>

            <div className="space-y-4">
               <h2 className="text-5xl font-black text-slate-900 tracking-tight italic">استوديو البث المباشر</h2>
               <p className="text-slate-500 font-bold text-2xl max-w-xl mx-auto">أهلاً بك يا م/ {user?.firstName}. هل أنت مستعد لبدء حصة جديدة مع طلابك؟</p>
            </div>

            <div className="glass-panel p-12 bg-white max-w-xl mx-auto rounded-[3.5rem] border shadow-2xl space-y-10">
               <div className="space-y-6 text-right">
                  <div className="space-y-1">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">عنوان الحصة / البث</label>
                     <input className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-3xl font-black text-xl outline-none transition-all" placeholder="مثال: مراجعة نهائية - الفصل الخامس" />
                  </div>
               </div>
               <button onClick={handleStartSession} className="w-full py-7 bg-slate-950 text-white rounded-[2rem] font-black text-2xl shadow-3xl hover:bg-indigo-600 transition-all active:scale-95 flex items-center justify-center gap-6 group">
                  <Radio size={32} className="group-hover:scale-110 transition-transform" /> بدء البث المباشر الآن
               </button>
            </div>
         </div>
      </div>
   );
};

const PermissionToggle = ({ label, value, onChange }: any) => (
   <div className="flex items-center justify-between">
      <span className="text-xs font-bold text-slate-700">{label}</span>
      <button onClick={() => onChange(!value)} className={`w-12 h-6 rounded-full transition-all relative ${value ? 'bg-indigo-600' : 'bg-slate-200'}`}>
         <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${value ? 'left-1' : 'left-7'}`}></div>
      </button>
   </div>
);

export default LiveLessonsModule;
