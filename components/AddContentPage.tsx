
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Announcement, AnnouncementType, AnnouncementStatus, UserRole } from '../types';
import { ArrowRight, ArrowLeft, Save, Briefcase, Calendar, UploadCloud, FileText, Image as ImageIcon, CheckCircle } from 'lucide-react';

const AddContentPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { addAnnouncement, user, lang, addNotification } = useAppContext();
    const isRtl = lang === 'ar';

    // Default form data
    const [formData, setFormData] = useState<Partial<Announcement>>({
        title: '',
        content: '',
        type: AnnouncementType.ANNOUNCEMENT,
        status: AnnouncementStatus.PENDING,
        authorRole: user?.role || UserRole.TEACHER,
        authorId: user?.id || '',
        authorName: `${user?.firstName} ${user?.lastName}`,
        date: new Date().toISOString().split('T')[0]
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        if (!formData.title || !formData.content) return;

        setIsSubmitting(true);
        setTimeout(() => {
            addAnnouncement({
                ...formData as Announcement,
                id: Date.now().toString(),
                status: AnnouncementStatus.PENDING
            });
            addNotification({ title: 'تم رفع المحتوى', content: 'تم إرسال المحتوى للإدارة للمراجعة والاعتماد.', type: 'info', date: new Date().toISOString() });
            setIsSubmitting(false);
            onBack();
        }, 1000);
    };

    return (
        <div className="animate-view p-8 bg-white min-h-screen">
            <div className="flex justify-between items-center border-b pb-8 mb-8">
                <div className="flex items-center gap-6">
                    <button onClick={onBack} className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all text-slate-500">
                        {isRtl ? <ArrowRight size={24} /> : <ArrowLeft size={24} />}
                    </button>
                    <div className="p-4 bg-indigo-600 text-white rounded-[1.5rem] shadow-xl"><UploadCloud size={32} /></div>
                    <div>
                        <h3 className="text-3xl font-black tracking-tighter text-slate-900">{isRtl ? 'رفع محتوى جديد' : 'Upload New Content'}</h3>
                        <p className="text-slate-500 font-bold text-sm mt-1">{isRtl ? 'إضافة إعلانات، ملفات، أو مناسبات' : 'Add announcements, files, or events'}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-10">
                <div className="space-y-6">
                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">{isRtl ? 'عنوان المحتوى' : 'Content Title'}</label>
                    <input
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-[2rem] font-black text-2xl outline-none transition-all"
                        placeholder={isRtl ? "مثال: مراجعة الفصل الأول" : "e.g. Chapter 1 Review"}
                        autoFocus
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">{isRtl ? 'نوع المحتوى' : 'Content Type'}</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setFormData({ ...formData, type: AnnouncementType.ANNOUNCEMENT })}
                                className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 ${formData.type === AnnouncementType.ANNOUNCEMENT ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'bg-white border-slate-100 text-slate-400'}`}
                            >
                                <Briefcase size={32} />
                                <span className="font-black text-sm">{isRtl ? 'إعلان عام' : 'Announcement'}</span>
                                {formData.type === AnnouncementType.ANNOUNCEMENT && <CheckCircle className="text-indigo-600" size={20} />}
                            </button>
                            <button
                                onClick={() => setFormData({ ...formData, type: AnnouncementType.EVENT })}
                                className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 ${formData.type === AnnouncementType.EVENT ? 'bg-amber-50 border-amber-500 text-amber-700' : 'bg-white border-slate-100 text-slate-400'}`}
                            >
                                <Calendar size={32} />
                                <span className="font-black text-sm">{isRtl ? 'مناسبة / فعالية' : 'Event'}</span>
                                {formData.type === AnnouncementType.EVENT && <CheckCircle className="text-amber-600" size={20} />}
                            </button>
                        </div>
                    </div>

                    {formData.type === AnnouncementType.EVENT && (
                        <div className="space-y-6 animate-view">
                            <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">{isRtl ? 'تاريخ الفعالية' : 'Event Date'}</label>
                            <input
                                type="date"
                                value={formData.eventDate || ''}
                                onChange={e => setFormData({ ...formData, eventDate: e.target.value })}
                                className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-[2rem] font-black text-lg outline-none transition-all"
                            />
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">{isRtl ? 'التفاصيل والمحتوى' : 'Description & Content'}</label>
                    <textarea
                        value={formData.content}
                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                        className="w-full p-8 h-64 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-[2rem] font-bold text-lg outline-none transition-all resize-none leading-relaxed"
                        placeholder={isRtl ? "اكتب تفاصيل الإعلان هنا..." : "Write details here..."}
                    />
                </div>

                {/* Mock File Upload Area */}
                <div className="p-10 border-4 border-dashed border-slate-100 rounded-[3rem] text-center space-y-4 hover:bg-slate-50 hover:border-indigo-200 transition-all group cursor-pointer">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                        <UploadCloud size={40} />
                    </div>
                    <p className="font-black text-slate-400">{isRtl ? 'اسحب الملفات هنا أو انقر للرفع' : 'Drag files here or click to upload'}</p>
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">PDF, DOCX, JPG, PNG (Max 10MB)</p>
                </div>

                <div className="pt-10 flex gap-6">
                    <button onClick={onBack} className="px-10 py-6 bg-slate-100 text-slate-400 rounded-[2rem] font-black hover:bg-slate-200 transition-all">{isRtl ? 'إلغاء' : 'Cancel'}</button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !formData.title || !formData.content}
                        className="flex-1 py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? '...' : (isRtl ? 'نشر المحتوى' : 'Publish Content')} <Save size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddContentPage;
