
import * as React from 'react';
import { useState } from 'react';
import {
  CheckCircle, XCircle, Eye, FileText, Megaphone, Calendar, Search, Clock, AlertCircle, Trash2, X,
  Video, Sparkles, Filter, ChevronRight
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Announcement, AnnouncementStatus, AnnouncementType } from '../types';

const ApprovalsModule: React.FC = () => {
  const { announcements, approveAnnouncement, rejectAnnouncement, lang, addNotification } = useAppContext();
  const [selectedItem, setSelectedItem] = useState<Announcement | null>(null);

  const pendingItems = announcements.filter(a => a.status === AnnouncementStatus.PENDING);

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    if (action === 'approve') approveAnnouncement(id);
    else rejectAnnouncement(id);
    addNotification({ title: 'تحديث الحالة', content: 'تم تغيير حالة المنشور بنجاح.', type: 'success', date: new Date().toISOString() });
    setSelectedItem(null);
  };

  return (
    <div className="space-y-8 animate-view">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">مركز الاعتمادات والمراجعة</h2>
          <p className="text-slate-500 font-bold">لديك {pendingItems.length} طلبات جديدة من المعلمين بانتظار قرارك.</p>
        </div>
      </div>

      {pendingItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pendingItems.map((item) => (
            <div key={item.id} className="glass-card p-8 border-r-8 border-amber-500 group hover:shadow-2xl transition-all bg-white">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Megaphone size={24} /></div>
                <span className="text-[10px] font-black text-slate-400 uppercase">{item.date}</span>
              </div>
              <h4 className="font-black text-xl mb-3 text-slate-900 leading-tight">{item.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-3 font-bold mb-8 leading-relaxed">{item.content}</p>

              <div className="flex gap-2">
                <button onClick={() => setSelectedItem(item)} className="flex-1 py-4 bg-slate-950 text-white rounded-2xl font-black text-xs">معاينة</button>
                <button onClick={() => handleAction(item.id, 'approve')} className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all"><CheckCircle /></button>
                <button onClick={() => handleAction(item.id, 'reject')} className="p-4 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all"><XCircle /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-24 text-center border-4 border-dashed border-slate-100 rounded-[3rem]">
          <CheckCircle size={80} className="mx-auto text-emerald-500 opacity-20 mb-6" />
          <h3 className="text-2xl font-black text-slate-300">لا توجد اعتمادات معلقة حالياً</h3>
        </div>
      )}

      {selectedItem && (
        <div className="fixed inset-0 z-[700] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setSelectedItem(null)}>
          <div className="glass-card w-full max-w-2xl bg-white animate-view flex flex-col max-h-[85vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-8 border-b bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-2xl font-black">معاينة منشور المعلم</h3>
              <button onClick={() => setSelectedItem(null)}><X /></button>
            </div>
            <div className="flex-1 p-10 overflow-y-auto space-y-6">
              <h2 className="text-3xl font-black text-slate-900">{selectedItem.title}</h2>
              <p className="text-lg text-slate-600 leading-relaxed font-bold">{selectedItem.content}</p>
              {selectedItem.mediaUrl && <img src={selectedItem.mediaUrl} className="w-full h-80 object-contain bg-slate-50 rounded-3xl" alt="m" />}
            </div>
            <div className="p-8 border-t flex gap-4">
              <button onClick={() => handleAction(selectedItem.id, 'approve')} className="flex-1 py-5 bg-emerald-600 text-white rounded-2xl font-black">اعتماد ونشر</button>
              <button onClick={() => handleAction(selectedItem.id, 'reject')} className="flex-1 py-5 bg-rose-600 text-white rounded-2xl font-black">رفض المنشور</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalsModule;
