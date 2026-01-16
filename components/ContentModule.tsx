
import React, { useState, useRef } from 'react';
import {
   FileText, Video, ImageIcon, Plus, Search, Calendar, Edit3, Trash2, Eye, Download,
   Sparkles, FolderUp, X, FileUp, Clock, PlayCircle, FileSearch, Megaphone, Save, Camera, Archive, Globe,
   Database, PlusCircle, Paperclip
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Announcement, AnnouncementType, AnnouncementStatus } from '../types';

interface ContentModuleProps {
   mode: 'events' | 'content';
}

const ContentModule: React.FC<ContentModuleProps> = ({ mode }) => {
   const { lang, announcements, addAnnouncement, user, addNotification } = useAppContext();
   const [showAddModal, setShowAddModal] = useState(false);
   const [previewingItem, setPreviewingItem] = useState<Announcement | null>(null);

   const [formData, setFormData] = useState({
      title: '', content: '', eventDate: '', publishDate: new Date().toISOString().split('T')[0], mediaType: 'pdf' as any, mediaUrl: '', eventType: 'general', fileName: ''
   });

   const fileInputRef = useRef<HTMLInputElement>(null);

   const items = announcements.filter(a =>
      mode === 'events' ? a.type === AnnouncementType.EVENT : a.type === AnnouncementType.ANNOUNCEMENT
   );

   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         setFormData({ ...formData, fileName: file.name, mediaUrl: 'LOCAL_UPLOAD' });
         // في نظام حقيقي هنا نقوم برفع الملف للسيرفر، هنا سنفترض النجاح
      }
   };

   const handleSave = () => {
      if (!formData.title || !formData.content) return alert("يرجى ملء كافة الحقول");
      const newAnn: Announcement = {
         id: `ann-${Date.now()}`,
         title: formData.title,
         content: formData.content,
         type: mode === 'events' ? AnnouncementType.EVENT : AnnouncementType.ANNOUNCEMENT,
         status: AnnouncementStatus.PENDING,
         date: formData.publishDate,
         eventDate: formData.eventDate,
         authorId: user?.id || 'u3',
         authorName: `${user?.firstName} ${user?.lastName}`,
         authorRole: user?.role || 'teacher',
         mediaType: formData.mediaType,
         mediaUrl: formData.mediaUrl
      };
      addAnnouncement(newAnn);
      addNotification({ title: 'تم التحديث', content: 'تم حفظ المحتوى وجدولته بنجاح.', type: 'success', date: new Date().toISOString() });
      setShowAddModal(false);
      setFormData({ title: '', content: '', eventDate: '', publishDate: new Date().toISOString().split('T')[0], mediaType: 'pdf', mediaUrl: '', eventType: 'general', fileName: '' });
   };

   return (
      <div className="space-y-10 animate-view pb-20">
         <div className="flex flex-col md:flex-row justify-between items-center bg-white p-10 rounded-[2.5rem] border shadow-sm gap-6">
            <div className="flex items-center gap-6">
               <div className={`p-5 rounded-[1.75rem] shadow-xl text-white ${mode === 'events' ? 'bg-rose-600' : 'bg-slate-900'}`}>{mode === 'events' ? <Calendar size={32} /> : <Database size={32} />}</div>
               <div>
                  <h2 className="text-3xl font-black text-slate-900">{mode === 'events' ? 'المناسبات والفعاليات المجدولة' : 'إدارة المحتوى التعليمي'}</h2>
                  <p className="text-slate-500 font-bold">{mode === 'events' ? 'تنظيم مواعيد الحصص والامتحانات والفعاليات العامة.' : 'نشر المذكرات والفيديوهات وشرح الدروس لطلابك.'}</p>
               </div>
            </div>
            <button onClick={() => setShowAddModal(true)} className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black flex items-center gap-3 shadow-xl hover:bg-indigo-700 transition-all">
               <Plus size={24} /> إضافة {mode === 'events' ? 'مناسبة' : 'محتوى'} جديد
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map(item => (
               <div key={item.id} className="glass-card p-10 bg-white border border-slate-100 group hover:border-indigo-600 transition-all rounded-[2.5rem] relative overflow-hidden shadow-sm">
                  <div className="flex justify-between items-start mb-8 relative z-10">
                     <div className={`p-5 rounded-2xl shadow-inner ${item.mediaType === 'video' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'}`}>
                        {mode === 'events' ? <Calendar size={28} /> : (item.mediaType === 'video' ? <Video size={28} /> : <FileText size={28} />)}
                     </div>
                     <div className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black uppercase text-slate-400">تاريخ النشر: {item.date}</div>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-sm text-slate-400 font-bold line-clamp-3 mb-8 leading-relaxed text-right">{item.content}</p>

                  {item.eventDate && (
                     <div className="flex items-center gap-3 p-4 bg-rose-50 text-rose-600 rounded-2xl mb-8 font-black text-[10px] uppercase tracking-widest border border-rose-100">
                        <Clock size={16} /> موعد الحدث: {item.eventDate}
                     </div>
                  )}

                  <div className="pt-6 border-t border-slate-50 flex gap-3">
                     <button onClick={() => setPreviewingItem(item)} className="flex-1 py-4 bg-slate-50 text-slate-900 rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition-all"><Eye size={16} /> معاينة</button>
                  </div>
               </div>
            ))}
         </div>

         {showAddModal && (
            <div className="fixed inset-0 z-[700] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6 no-print" onClick={() => setShowAddModal(false)}>
               <div className="glass-panel w-full max-w-2xl p-12 bg-white animate-view space-y-10 max-h-[90vh] overflow-y-auto no-scrollbar rounded-[3.5rem] shadow-3xl" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-center border-b pb-6"><h3 className="text-3xl font-black text-slate-900 flex items-center gap-4"><PlusCircle className="text-indigo-600" /> إدراج {mode === 'events' ? 'فعالية' : 'محتوى'} جديد</h3><button onClick={() => setShowAddModal(false)}><X size={32} /></button></div>
                  <div className="space-y-6">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 text-right">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">تاريخ النشر</label>
                           <input type="date" value={formData.publishDate} onChange={e => setFormData({ ...formData, publishDate: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl font-black text-xs border border-slate-100" />
                        </div>
                        {mode === 'events' && (
                           <div className="space-y-2 text-right">
                              <label className="text-[10px] font-black text-rose-600 uppercase tracking-widest px-2">موعد الحدث</label>
                              <input type="date" value={formData.eventDate} onChange={e => setFormData({ ...formData, eventDate: e.target.value })} className="w-full p-4 bg-rose-50 rounded-2xl font-black text-xs border border-rose-100 text-rose-600" />
                           </div>
                        )}
                     </div>

                     <div className="space-y-2 text-right"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">العنوان</label><input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl font-black text-lg shadow-inner outline-none transition-all text-right" /></div>
                     <div className="space-y-2 text-right"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">التفاصيل</label><textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl font-bold text-base min-h-[120px] shadow-inner outline-none transition-all text-right" /></div>

                     <div className="p-8 bg-slate-50 rounded-[2.5rem] space-y-6 shadow-inner">
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest text-center">اختيار الملف من جهازك</p>
                        <div className="flex flex-col items-center gap-4">
                           <button onClick={() => fileInputRef.current?.click()} className="w-full py-10 border-4 border-dashed border-indigo-100 rounded-3xl flex flex-col items-center justify-center gap-3 text-slate-300 hover:border-indigo-600 hover:text-indigo-600 transition-all">
                              <FileUp size={40} />
                              <span className="font-black text-sm">{formData.fileName || 'اضغط هنا لرفع الملف (PDF, Video, Image)'}</span>
                           </button>
                           <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />

                           <div className="flex gap-4 w-full">
                              {['pdf', 'image', 'video'].map(t => (
                                 <button key={t} onClick={() => setFormData({ ...formData, mediaType: t as any })} className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase border-2 transition-all ${formData.mediaType === t ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-transparent text-slate-400 hover:border-indigo-100'}`}>{t}</button>
                              ))}
                           </div>
                        </div>
                     </div>
                     <button onClick={handleSave} className="w-full py-6 bg-slate-950 text-white rounded-3xl font-black text-xl flex items-center justify-center gap-4 shadow-3xl active:scale-95 hover:bg-indigo-600 transition-all"><Save size={28} /> تأكيد ونشر</button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default ContentModule;
