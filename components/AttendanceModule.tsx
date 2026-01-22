
import React, { useState } from 'react';
import { 
  Calendar, Clock, Search, Printer, Check, X, 
  Users, Plus, ArrowRight, Loader2, Filter, ChevronLeft,
  CalendarCheck, Trash2, CheckCircle, UserCheck, AlertCircle, Save,
  CheckSquare, UserPlus
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const AttendanceModule: React.FC = () => {
  const { lang, allUsers, systemName, systemLogo } = useAppContext();
  const isRtl = lang === 'ar';
  
  const [view, setView] = useState<'list' | 'session'>('list');
  const [activeSession, setActiveSession] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [showAddSession, setShowAddSession] = useState(false);
  
  // اختيار الطلاب للجلسة
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());
  const allStudents = allUsers.filter(u => u.role === 'student');

  const sessions = [
    { id: '1', title: 'مجموعة السبت - فيزياء', date: '2024-03-23', time: '04:00 PM', count: 45, status: 'completed' },
    { id: '2', title: 'مجموعة الأحد - فيزياء', date: '2024-03-24', time: '02:00 PM', count: 32, status: 'pending' }
  ];

  const toggleStudentSelection = (id: string) => {
     const newSet = new Set(selectedStudentIds);
     if (newSet.has(id)) newSet.delete(id);
     else newSet.add(id);
     setSelectedStudentIds(newSet);
  };

  const renderList = () => (
    <div className="space-y-10 animate-view">
       <div className="flex flex-col md:flex-row justify-between items-center gap-6 no-print">
          <div className="flex items-center gap-6">
             <div className="p-5 bg-rose-600 text-white rounded-[2.5rem] shadow-xl">
                <CalendarCheck size={40} />
             </div>
             <div>
                <h2 className="text-3xl font-black">إدارة جلسات الحضور والغياب</h2>
                <p className="text-slate-500 font-bold">إنشاء جلسات الدروس وتسجيل حضور الطلاب والمجموعات</p>
             </div>
          </div>
          <button 
            onClick={() => { setSelectedStudentIds(new Set()); setShowAddSession(true); }}
            className="px-8 py-4 bg-slate-950 text-white rounded-2xl font-black flex items-center gap-3 shadow-xl hover:scale-105 transition-all"
          >
             <Plus size={20} /> إنشاء جلسة جديدة
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 no-print">
          {sessions.map(s => (
            <div key={s.id} className="glass-panel p-10 flex flex-col md:flex-row justify-between items-center group hover:border-rose-600 transition-all border-r-8 border-r-rose-600">
               <div className="flex items-center gap-8">
                  <div className="p-6 bg-rose-50 text-rose-600 rounded-3xl shadow-inner"><Calendar size={32} /></div>
                  <div>
                     <h4 className="text-2xl font-black text-slate-900">{s.title}</h4>
                     <p className="text-xs text-slate-400 font-bold flex items-center gap-2 mt-2 uppercase tracking-widest"><Clock size={14}/> {s.date} • {s.time}</p>
                  </div>
               </div>
               <div className="flex items-center gap-10 mt-8 md:mt-0">
                  <div className="text-center">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">الطلاب المسجلين</p>
                     <p className="text-2xl font-black text-slate-900 tabular-nums">{s.count}</p>
                  </div>
                  <button 
                    onClick={() => { setActiveSession(s); setView('session'); }}
                    className="px-8 py-4 bg-slate-950 text-white rounded-2xl font-black text-xs shadow-lg hover:bg-rose-600 transition-all"
                  >
                     دخول وتعديل الجلسة
                  </button>
               </div>
            </div>
          ))}
       </div>

       {showAddSession && (
         <div className="fixed inset-0 z-[700] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6 no-print">
            <div className="glass-panel w-full max-w-4xl p-10 bg-white animate-view flex flex-col max-h-[90vh] rounded-[4rem] shadow-3xl">
               <div className="flex justify-between items-center border-b pb-6">
                  <h3 className="text-3xl font-black">إعداد جلسة حضور جديدة</h3>
                  <button onClick={() => setShowAddSession(false)} className="p-3 bg-slate-50 rounded-2xl"><X /></button>
               </div>
               
               <div className="flex-1 overflow-y-auto py-8 space-y-10 no-scrollbar">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 text-right">
                     <div className="space-y-6">
                        <h4 className="text-rose-600 font-black text-xs uppercase tracking-widest flex items-center gap-3"><Calendar size={18}/> بيانات الجلسة</h4>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 tracking-widest px-2">اسم الجلسة / المجموعة</label>
                           <input className="w-full p-5 bg-slate-50 border-none rounded-2xl font-bold outline-none focus:ring-2 focus:ring-rose-500/20" placeholder="مثال: مجموعة الفيزياء السبت 4 عصراً" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 tracking-widest px-2">تاريخ اليوم</label>
                              <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 tracking-widest px-2">توقيت البداية</label>
                              <input type="time" className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold" />
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <h4 className="text-indigo-600 font-black text-xs uppercase tracking-widest flex items-center gap-3"><UserPlus size={18}/> اختيار الطلاب المستهدفين</h4>
                        <div className="relative">
                           <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18}/>
                           <input placeholder="بحث في قائمة الطلاب..." className="w-full p-4 pr-12 bg-slate-100 rounded-2xl text-xs font-bold outline-none" />
                        </div>
                        <div className="bg-slate-50 rounded-[2rem] p-6 max-h-[300px] overflow-y-auto no-scrollbar space-y-2 border shadow-inner">
                           {allStudents.map(student => (
                              <button 
                                 key={student.id} 
                                 onClick={() => toggleStudentSelection(student.id)}
                                 className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${selectedStudentIds.has(student.id) ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white hover:bg-indigo-50 text-slate-600'}`}
                              >
                                 <div className="flex items-center gap-3">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.username}`} className="w-8 h-8 rounded-lg bg-slate-100" />
                                    <span className="font-bold text-sm">{student.firstName} {student.lastName}</span>
                                 </div>
                                 {selectedStudentIds.has(student.id) ? <Check size={18} strokeWidth={4}/> : <div className="w-5 h-5 rounded-full border-2 border-slate-200"></div>}
                              </button>
                           ))}
                        </div>
                        <div className="flex justify-between items-center px-4">
                           <button onClick={() => setSelectedStudentIds(new Set(allStudents.map(s=>s.id)))} className="text-[10px] font-black text-indigo-600 uppercase hover:underline">اختيار الكل</button>
                           <p className="text-[10px] font-black text-slate-400 uppercase">تم اختيار: {selectedStudentIds.size} طالب</p>
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="pt-8 border-t">
                  <button onClick={() => setShowAddSession(false)} className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black text-2xl shadow-3xl hover:bg-rose-600 active:scale-95 transition-all">تفعيل الجلسة واستدعاء الطلاب</button>
               </div>
            </div>
         </div>
       )}
    </div>
  );

  const renderSession = () => (
    <div className="space-y-10 animate-view pb-20 text-right">
       <div className="flex flex-col lg:flex-row-reverse items-center gap-8 no-print">
          <button onClick={() => setView('list')} className="p-5 bg-white border border-slate-100 rounded-3xl hover:bg-rose-600 hover:text-white transition-all shadow-sm">
             <ChevronLeft className={isRtl ? 'rotate-180' : ''} size={24} />
          </button>
          <div className="flex-1 text-center lg:text-right">
             <h2 className="text-4xl font-black text-slate-900">{activeSession.title}</h2>
             <p className="text-slate-400 font-bold mt-2 flex items-center justify-center lg:justify-end gap-2 uppercase tracking-widest text-xs">
                {activeSession.date} • {activeSession.time} <Calendar size={14} />
             </p>
          </div>
          <div className="flex gap-4">
             <button onClick={() => window.print()} className="p-5 bg-white border border-slate-200 rounded-3xl text-slate-400 hover:text-rose-600 transition-all shadow-sm">
                <Printer size={28} />
             </button>
             <button onClick={() => setView('list')} className="px-10 py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-sm shadow-xl shadow-emerald-600/20 flex items-center gap-3">
                <Save size={22} /> حفظ سجل الحضور
             </button>
          </div>
       </div>

       <div className="glass-card overflow-hidden bg-white rounded-[3rem] shadow-sm">
          <div className="p-8 border-b flex flex-col md:flex-row-reverse items-center gap-6 bg-slate-50/30 no-print">
             <div className="flex-1 relative w-full">
                <Search size={22} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  type="text" 
                  placeholder="ابحث عن طالب بالاسم أو الكود..." 
                  className="w-full p-5 pr-14 bg-white border border-white rounded-2xl outline-none font-bold text-sm shadow-sm text-right" 
                />
             </div>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-right min-w-[800px] border-collapse">
               <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b text-right">
                  <tr>
                     <th className="p-8">كود الطالب</th>
                     <th className="p-8">اسم الطالب</th>
                     <th className="p-8 text-center">الحالة الحالية</th>
                     <th className="p-8 no-print text-center">تغيير الحالة</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 font-bold text-sm text-right">
                  {allUsers.filter(u => u.role === 'student' && (u.firstName + ' ' + u.lastName).toLowerCase().includes(search.toLowerCase())).map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                       <td className="p-8"><code className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-black text-blue-600 font-mono">{u.code}</code></td>
                       <td className="p-8">
                          <div className="flex items-center gap-4 justify-end">
                             <span>{u.firstName} {u.lastName}</span>
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} className="w-11 h-11 rounded-xl bg-slate-100 p-1 border shadow-sm" alt="avatar" />
                          </div>
                       </td>
                       <td className="p-8 text-center">
                          <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black flex items-center justify-center gap-2 border border-emerald-100 mx-auto w-fit">
                             <UserCheck size={14} /> حاضر
                          </span>
                       </td>
                       <td className="p-8 no-print">
                          <div className="flex justify-center gap-4">
                             <button className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-all"><Check size={24} /></button>
                             <button className="w-12 h-12 bg-white border-2 border-slate-100 text-slate-300 rounded-2xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all"><X size={24} /></button>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
          </div>
       </div>

       <div className="p-10 bg-slate-900 rounded-[2.5rem] text-white flex flex-col md:flex-row-reverse justify-between items-center gap-8 no-print text-right">
          <div className="flex items-center gap-6">
             <p className="font-bold text-slate-300">يتم إرسال إشعارات لولي الأمر تلقائياً عند تسجيل "غياب" الطالب في هذه الجلسة.</p>
             <div className="p-4 bg-white/10 rounded-2xl"><AlertCircle className="text-amber-500" /></div>
          </div>
          <button className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-xs whitespace-nowrap">إرسال تقرير غياب جماعي</button>
       </div>
    </div>
  );

  return (
    <div>
       {view === 'list' ? renderList() : renderSession()}
    </div>
  );
};

export default AttendanceModule;
