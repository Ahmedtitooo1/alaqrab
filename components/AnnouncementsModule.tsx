
import React, { useState, useRef } from 'react';
import {
  Megaphone, Calendar, Plus, X, Clock, FileText, Image as ImageIcon, Download, Bell
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Announcement, AnnouncementType, UserRole, AnnouncementStatus } from '../types';

interface AnnouncementsModuleProps {
  currentUserRole: UserRole;
}

const AnnouncementsModule: React.FC<AnnouncementsModuleProps> = ({ currentUserRole }) => {
  const { t, lang, theme } = useAppContext();
  const isRtl = lang === 'ar';
  const canCreate = currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.TEACHER;

  const [previewFile, setPreviewFile] = useState<Announcement | null>(null);

  const [announcements] = useState<Announcement[]>([
    {
      id: '1',
      title: isRtl ? 'مذكرة مراجعة الفيزياء لعام 2024' : 'Physics 2024 Review Note',
      content: isRtl ? 'أقوى مذكرة مراجعة شاملة لجميع قوانين الفيزياء والمسائل المتوقعة.' : 'The most comprehensive physics laws review note.',
      type: AnnouncementType.ANNOUNCEMENT,
      status: AnnouncementStatus.APPROVED,
      date: new Date().toISOString(),
      authorRole: UserRole.TEACHER,
      authorId: 'teacher-1',
      authorName: 'م/ محمود العزازي',
      mediaUrl: 'https://example.com/physics.pdf',
      mediaType: 'pdf',
      institutionId: 'tenant-1'
    }
  ]);

  return (
    <div className="space-y-10 animate-content">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-amber-500 text-slate-950 rounded-3xl shadow-xl shadow-amber-500/20">
            <Bell size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight dark:text-white text-slate-950">{t('announcements_title')}</h2>
            <p className="text-slate-500 dark:text-slate-400 font-bold">{isRtl ? 'أحدث المستجدات والملفات التعليمية' : 'Latest updates and educational files'}</p>
          </div>
        </div>
        {canCreate && (
          <button className="px-8 py-4 bg-slate-950 dark:bg-amber-500 text-white dark:text-slate-950 rounded-[1.5rem] font-black shadow-xl hover:scale-105 transition-all flex items-center gap-3">
            <Plus size={20} /> تسجيل منشور جديد
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {announcements.map((item) => (
          <div key={item.id} className="premium-card p-8 flex flex-col transition-all hover:scale-[1.01] group">
            <div className="flex justify-between items-start mb-6">
              <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase flex items-center gap-2 ${item.type === AnnouncementType.ANNOUNCEMENT ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'}`}>
                {item.type === AnnouncementType.ANNOUNCEMENT ? <Megaphone size={14} /> : <Calendar size={14} />}
                {t(item.type === AnnouncementType.ANNOUNCEMENT ? 'announcement_val' : 'event_val')}
              </span>
            </div>

            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-black tracking-tight leading-snug dark:text-white text-slate-950">{item.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{item.content}</p>

              {item.mediaUrl && (
                <div className="mt-4 p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-white/5 flex items-center justify-between group-hover:border-amber-500 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl text-amber-500 shadow-sm border dark:border-white/5">
                      {item.mediaType === 'pdf' ? <FileText size={24} /> : <ImageIcon size={24} />}
                    </div>
                    <div>
                      <p className="text-sm font-black dark:text-white text-slate-950">{item.mediaType === 'pdf' ? 'مذكرة PDF' : 'صورة توضيحية'}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{isRtl ? 'ملحق تعليمي' : 'Attachment'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPreviewFile(item)}
                    className="px-6 py-3 bg-amber-500 text-slate-950 rounded-xl text-xs font-black shadow-lg hover:bg-amber-400 transition-all"
                  >
                    {isRtl ? 'فتح الملف' : 'Open'}
                  </button>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.authorName}`} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800" alt="avatar" />
                <div>
                  <p className="text-xs font-black dark:text-white text-slate-950">{item.authorName}</p>
                  <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1"><Clock size={10} /> {new Date(item.date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* File Preview Overlay */}
      {previewFile && (
        <div className="fixed inset-0 z-[300] bg-slate-950/95 flex flex-col p-6 animate-content">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-white flex items-center gap-4">
              <FileText className="text-amber-500" /> {previewFile.title}
            </h2>
            <div className="flex gap-4">
              <button className="p-4 bg-white/10 text-white rounded-2xl hover:bg-amber-500 hover:text-slate-950 transition-all"><Download size={22} /></button>
              <button onClick={() => setPreviewFile(null)} className="p-4 bg-rose-600 text-white rounded-2xl hover:scale-110 transition-all"><X size={22} /></button>
            </div>
          </div>
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden relative shadow-2xl flex items-center justify-center p-10 md:p-20">
            <div className="text-center space-y-6">
              <FileText size={120} className="text-slate-100 dark:text-slate-800 mx-auto" />
              <h4 className="text-2xl font-black text-slate-400 uppercase tracking-widest">{isRtl ? 'معاينة المحتوى التعليمي' : 'File Preview Mode'}</h4>
              <p className="text-slate-500 dark:text-slate-400 font-bold max-w-sm mx-auto">{isRtl ? 'جاري تحميل محتوى الـ PDF التفاعلي... استعد للمذاكرة' : 'Loading interactive content... get ready to learn'}</p>
              <div className="w-64 h-2 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-amber-500 animate-[loading_2s_infinite]"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default AnnouncementsModule;
