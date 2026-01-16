
import React, { useState } from 'react';
import { 
  FileText, Video, Trash2, Edit3, Search, Clock, X, 
  BookOpen, FolderPlus, Upload, ShieldCheck, Download, Eye, QrCode,
  Sparkles, FileUp, Loader2, User as UserIcon, Lock
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';

const FilesModule: React.FC = () => {
  const { lang, user, systemLogo, allUsers } = useAppContext();
  const isRtl = lang === 'ar';
  const isTeacher = user?.role === UserRole.TEACHER;
  const isStudent = user?.role === UserRole.STUDENT;
  
  const [search, setSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [previewingFile, setPreviewingFile] = useState<any>(null);

  const teacher = isStudent ? allUsers.find(u => u.id === user?.teacherId) : user;

  const [files, setFiles] = useState<any[]>([
    { id: 'f1', title: 'مذكرة الحركة الموجية الشاملة', type: 'pdf', size: '2.5 MB', date: '2024-03-01', authorId: 'u3', authorName: 'م/ محمود العزازي' },
    { id: 'f2', title: 'فيديو شرح قوانين نيوتن الثالث', type: 'video', size: '145 MB', date: '2024-03-02', authorId: 'u3', authorName: 'م/ محمود العزازي' },
    { id: 'f3', title: 'ملخص الفيزياء الحديثة لليلة الامتحان', type: 'pdf', size: '1.2 MB', date: '2024-04-15', authorId: 'u3', authorName: 'م/ محمود العزازي' }
  ]);

  const visibleFiles = files.filter(f => {
    if (isStudent) return f.authorId === user?.teacherId;
    if (isTeacher) return f.authorId === user?.id;
    return true;
  }).filter(f => f.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-10 animate-view pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
        <div className="flex items-center gap-5">
           <div className="p-4 bg-indigo-600 text-white rounded-3xl shadow-xl shadow-indigo-600/20"><BookOpen size={32} /></div>
           <div>
              <h2 className="text-3xl font-black">{isStudent ? 'حقيبة ملفاتي التعليمية' : 'إدارة المحتوى والملفات'}</h2>
              <p className="text-slate-500 font-bold">{isStudent ? `المحتوى المنشور بواسطة المعلم: ${teacher?.firstName || 'محمود العزازي'}` : 'ارفع المذكرات لطلابك وتابع وصولهم لها.'}</p>
           </div>
        </div>
        <div className="flex gap-4">
           <div className="relative w-72">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input value={search} onChange={e => setSearch(e.target.value)} className="w-full p-4 pr-12 bg-white border border-slate-100 rounded-2xl outline-none font-bold text-xs shadow-sm" placeholder="بحث في الحقيبة..." />
           </div>
           {isTeacher && (
             <button onClick={() => setIsUploading(true)} className="px-8 py-4 bg-slate-950 text-white rounded-2xl font-black shadow-xl flex items-center gap-3"><FileUp size={20} /> رفع ملف جديد</button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {visibleFiles.map(file => (
           <div key={file.id} className="glass-panel p-10 bg-white border border-slate-100 group transition-all hover:border-indigo-600 rounded-[3rem] shadow-sm">
              <div className="flex justify-between items-start mb-8">
                 <div className={`p-5 rounded-2xl shadow-inner ${file.type === 'pdf' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>{file.type === 'pdf' ? <FileText size={32} /> : <Video size={32} />}</div>
                 <div className="flex gap-2">
                    {isTeacher ? (
                      <div className="opacity-0 group-hover:opacity-100 transition-all flex gap-2">
                        <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Edit3 size={18} /></button>
                        <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"><Trash2 size={18} /></button>
                      </div>
                    ) : (
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><ShieldCheck size={18}/></div>
                    )}
                 </div>
              </div>
              <h3 className="text-2xl font-black mb-2 text-slate-900 line-clamp-1">{file.title}</h3>
              <p className="text-xs text-slate-400 font-bold flex items-center gap-2 uppercase tracking-widest"><Clock size={14}/> تم الرفع: {file.date} • {file.size}</p>
              
              <div className="mt-10 pt-6 border-t border-slate-50 flex gap-4">
                 <button onClick={() => setPreviewingFile(file)} className="flex-1 py-5 bg-slate-950 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-lg active:scale-95"><Eye size={20} /> معاينة ومراجعة</button>
                 {!isStudent && <button className="p-5 bg-slate-100 text-slate-400 rounded-2xl hover:text-indigo-600 transition-all" title="تحميل"><Download size={20} /></button>}
              </div>
           </div>
         ))}
         {visibleFiles.length === 0 && (
           <div className="col-span-full py-32 text-center bg-white rounded-[4rem] border-4 border-dashed border-slate-100">
              <Lock size={80} className="mx-auto text-slate-100 mb-6" />
              <p className="text-2xl font-black text-slate-300">لا توجد مذكرات أو ملفات منشورة لك حتى الآن.</p>
           </div>
         )}
      </div>

      {previewingFile && (
        <div className="fixed inset-0 z-[900] bg-slate-950/95 flex flex-col p-6 animate-view">
           <div className="flex justify-between items-center mb-8 px-6 no-print">
              <h2 className="text-3xl font-black text-white flex items-center gap-6"><div className="p-3 bg-indigo-600 rounded-2xl"><FileText size={24}/></div> {previewingFile.title}</h2>
              <button onClick={() => setPreviewingFile(null)} className="p-5 bg-rose-600 text-white rounded-3xl hover:scale-110 transition-all shadow-xl"><X size={32} /></button>
           </div>
           <div className="flex-1 bg-white rounded-[4rem] overflow-hidden flex items-center justify-center p-20 relative shadow-inner">
              <div className="text-center space-y-8">
                 <div className="relative inline-block">
                    <FileText size={180} className="text-slate-100 mx-auto" />
                    <div className="absolute inset-0 flex items-center justify-center"><Loader2 size={60} className="text-indigo-600 animate-spin" /></div>
                 </div>
                 <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tight">نظام الحماية "العقرب"</h3>
                 <p className="text-slate-500 font-bold text-xl max-w-lg mx-auto leading-relaxed">جاري تشفير المحتوى لعرضه بطريقة آمنة تمنع النسخ غير المصرح به. استعد للمذاكرة بتركيز.</p>
                 <div className="w-96 h-3 bg-slate-100 rounded-full mx-auto overflow-hidden shadow-inner"><div className="h-full bg-indigo-600 w-3/4 animate-pulse"></div></div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default FilesModule;
