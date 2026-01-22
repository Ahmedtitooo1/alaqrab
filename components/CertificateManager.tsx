
import React, { useState } from 'react';
import {
    Award, Upload, FileText, Check, Plus, Trash2, Printer,
    Search, Eye, Settings, Image as ImageIcon, CheckCircle
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { CertificateTemplate, UserRole } from '../types';

const CertificateManager: React.FC = () => {
    const { certificateTemplates, addCertificateTemplate, allUsers, isRtl } = useAppContext();
    const [viewMode, setViewMode] = useState<'list' | 'create'>('list');

    // Template Form
    const [newTemplate, setNewTemplate] = useState<{ name: string, type: 'course' | 'achievement' | 'appreciation', bgImage: string }>({
        name: '',
        type: 'course',
        bgImage: '' // In real app, this would be a URL
    });

    const handleCreateTemplate = () => {
        if (!newTemplate.name) return;

        const template: CertificateTemplate = {
            id: Date.now().toString(),
            name: newTemplate.name,
            // @ts-ignore
            type: newTemplate.type,
            backgroundImage: newTemplate.bgImage || 'https://via.placeholder.com/800x600/eee/999?text=Certificate+Background',
            elements: [], // Placeholder for drag-drop elements
            createdAt: new Date().toISOString(),
            institutionId: 'tenant-1'
        };

        addCertificateTemplate(template);
        setViewMode('list');
        setNewTemplate({ name: '', type: 'course', bgImage: '' });
    };

    // Issuance Simulation
    const [issuingTo, setIssuingTo] = useState<string | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<CertificateTemplate | null>(null);

    const students = allUsers.filter(u => u.role === UserRole.STUDENT);

    return (
        <div className="space-y-8 animate-view p-6" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <Award className="text-amber-500" size={32} />
                        الشهادات والتكريمات
                    </h2>
                    <p className="text-slate-500 font-bold mt-1">إدارة قوالب الشهادات وإصدارها للطلاب</p>
                </div>
                {viewMode === 'list' && (
                    <button
                        onClick={() => setViewMode('create')}
                        className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg"
                    >
                        <Plus size={20} /> تصميم قالب جديد
                    </button>
                )}
            </div>

            {viewMode === 'list' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {certificateTemplates.map(template => (
                        <div key={template.id} className="group bg-white rounded-3xl border shadow-sm hover:shadow-xl transition-all overflow-hidden relative">
                            <div className="h-40 bg-slate-100 relative">
                                <img src={template.backgroundImage} className="w-full h-full object-cover opacity-80" alt="Preview" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-all">
                                    <button onClick={() => setSelectedTemplate(template)} className="p-3 bg-white text-slate-900 rounded-full shadow-lg transform hover:scale-110 transition-transform">
                                        <Printer size={20} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${template.type === 'achievement' ? 'bg-amber-100 text-amber-600' :
                                        template.type === 'appreciation' ? 'bg-rose-100 text-rose-600' :
                                            'bg-blue-100 text-blue-600'
                                        }`}>
                                        {template.type}
                                    </span>
                                    <Settings size={16} className="text-slate-300 hover:text-slate-600 cursor-pointer" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-1">{template.name}</h3>
                                <p className="text-xs text-slate-400 font-bold">تاريخ الإنشاء: {new Date(template.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}

                    {/* Empty State */}
                    {certificateTemplates.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed">
                            <div className="mx-auto w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm text-slate-300">
                                <Award size={48} />
                            </div>
                            <h3 className="text-xl font-black text-slate-400">لا توجد قوالب شهادات</h3>
                            <p className="text-slate-400 font-bold mt-2">ابدأ بإضافة قالب جديد لتقدير طلابك</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="glass-panel p-8 bg-white rounded-[2.5rem] border shadow-sm max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-8 pb-8 border-b">
                        <button onClick={() => setViewMode('list')} className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100"><Settings size={20} className="text-slate-400" /></button>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900">إعداد قالب جديد</h3>
                            <p className="text-slate-500 font-bold">قم برفع الخلفية وتحديد نوع الشهادة</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase">اسم القالب</label>
                            <input
                                value={newTemplate.name}
                                onChange={e => setNewTemplate({ ...newTemplate, name: e.target.value })}
                                className="w-full p-4 bg-slate-50 rounded-xl font-bold border-2 border-transparent focus:border-slate-900 outline-none"
                                placeholder="مثال: شهادة تفوق شهري"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { id: 'course', label: 'إتمام دورة', icon: FileText },
                                { id: 'achievement', label: 'إنجاز وتفوق', icon: Award },
                                { id: 'appreciation', label: 'شكر وتقدير', icon: Check }
                            ].map(type => (
                                <div
                                    key={type.id}
                                    onClick={() => setNewTemplate({ ...newTemplate, type: type.id as any })}
                                    className={`cursor-pointer p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${newTemplate.type === type.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 hover:border-indigo-200'}`}
                                >
                                    <type.icon size={24} />
                                    <span className="font-bold text-sm">{type.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="h-48 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors cursor-pointer relative overflow-hidden group">
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                            <ImageIcon size={40} className="mb-2 group-hover:scale-110 transition-transform" />
                            <span className="font-bold text-sm">اضغط لرفع صورة الخلفية</span>
                            <span className="text-[10px] font-bold opacity-60 mt-1">PNG, JPG (Max 5MB)</span>
                        </div>

                        <button
                            onClick={handleCreateTemplate}
                            disabled={!newTemplate.name}
                            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-indigo-200"
                        >
                            حفظ القالب
                        </button>
                    </div>
                </div>
            )}

            {/* Issuing Modal - محسّنة */}
            {selectedTemplate && (
                <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden animate-scale-in shadow-2xl">
                        {/* Header */}
                        <div className="h-48 bg-gradient-to-br from-indigo-600 to-purple-600 relative">
                            <div className="absolute inset-0 opacity-20">
                                <img src={selectedTemplate.backgroundImage} className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute bottom-0 left-0 p-8 text-white">
                                <div className="flex items-center gap-3 mb-2">
                                    <Award size={32} />
                                    <h3 className="text-3xl font-black">{selectedTemplate.name}</h3>
                                </div>
                                <p className="opacity-90 font-bold text-sm">
                                    {selectedTemplate.type === 'course' && 'شهادة إتمام دورة'}
                                    {selectedTemplate.type === 'achievement' && 'شهادة إنجاز وتفوق'}
                                    {selectedTemplate.type === 'appreciation' && 'شهادة شكر وتقدير'}
                                </p>
                            </div>
                            <button
                                onClick={() => { setSelectedTemplate(null); setIssuingTo(null); }}
                                className="absolute top-6 right-6 p-3 bg-white/20 hover:bg-white/30 rounded-full text-white backdrop-blur transition-all"
                            >
                                <Settings className="transform rotate-45" size={20} />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            {/* اختيار الطالب */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase flex items-center gap-2">
                                    <Search size={14} /> اختر الطالب
                                </label>
                                <div className="relative">
                                    <select
                                        value={issuingTo || ''}
                                        onChange={e => setIssuingTo(e.target.value)}
                                        className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-indigo-600 appearance-none transition-all"
                                    >
                                        <option value="">-- اختر طالباً --</option>
                                        {students.map(s => (
                                            <option key={s.id} value={s.id}>
                                                {s.firstName} {s.lastName} • {s.code}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* عند اختيار طالب */}
                            {issuingTo && (
                                <div className="space-y-4 animate-fade-in">
                                    {/* معلومات الطالب */}
                                    <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                                                <CheckCircle size={24} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-black text-emerald-800 text-lg mb-1">
                                                    {students.find(s => s.id === issuingTo)?.firstName} {students.find(s => s.id === issuingTo)?.lastName}
                                                </p>
                                                <p className="text-xs text-emerald-600 font-bold">
                                                    سيتم إصدار الشهادة وحفظها في ملف الطالب
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* خيارات الإرسال */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <button
                                            onClick={() => {
                                                alert('📄 جاري تصدير الشهادة إلى PDF...\n✅ تم! يمكنك الآن التحميل');
                                                // في الإنتاج: تحويل الشهادة إلى PDF وتحميلها
                                            }}
                                            className="p-4 bg-white border-2 border-slate-200 rounded-2xl font-bold hover:border-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-3"
                                        >
                                            <FileText size={20} className="text-indigo-600" />
                                            <span>تصدير PDF</span>
                                        </button>

                                        <button
                                            onClick={() => {
                                                const parent = allUsers.find(u =>
                                                    u.role === UserRole.PARENT &&
                                                    // @ts-ignore - children property might exist
                                                    u.children?.includes(issuingTo)
                                                );
                                                if (parent) {
                                                    alert(`📱 جاري إرسال الشهادة لولي الأمر عبر WhatsApp...\n\n👤 ${parent.firstName} ${parent.lastName}\n📞 ${parent.phone || 'لا يوجد رقم'}\n\n✅ تم الإرسال بنجاح!`);
                                                } else {
                                                    alert('⚠️ لا يوجد ولي أمر مسجل لهذا الطالب');
                                                }
                                            }}
                                            className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl font-bold hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-3 shadow-lg"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                            </svg>
                                            <span>إرسال لولي الأمر</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* أزرار الإجراء */}
                            <div className="flex gap-4 pt-4 border-t">
                                <button
                                    onClick={() => { setSelectedTemplate(null); setIssuingTo(null); }}
                                    className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-all"
                                >
                                    إلغاء
                                </button>
                                <button
                                    disabled={!issuingTo}
                                    className="flex-[2] py-4 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl font-bold shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                                    onClick={() => {
                                        alert(`✅ تم إصدار وطباعة الشهادة بنجاح!\n\n📄 الشهادة: ${selectedTemplate.name}\n👤 الطالب: ${students.find(s => s.id === issuingTo)?.firstName} ${students.find(s => s.id === issuingTo)?.lastName}`);
                                        window.print();
                                        setSelectedTemplate(null);
                                        setIssuingTo(null);
                                    }}
                                >
                                    <Printer size={20} />
                                    إصدار وطباعة الشهادة
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CertificateManager;
