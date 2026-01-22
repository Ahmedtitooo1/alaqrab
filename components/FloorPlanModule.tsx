import React, { useState } from 'react';
import { LayoutGrid, Users, Clock, Info, CheckCircle, XCircle, Plus, Calendar } from 'lucide-react';

const FloorPlanModule: React.FC = () => {
    const [selectedRoom, setSelectedRoom] = useState<number | null>(null);

    // Mock Data for Rooms
    const [rooms, setRooms] = useState([
        { id: 1, name: 'قاعة المتفوقين (A)', capacity: 60, status: 'busy', currentClass: 'فيزياء الحث الكهرومغناطيسي', teacher: 'أ. محمد عبدالمعبود', timeRemaining: '15 دقيقة', nextClass: 'فراغ' },
        { id: 2, name: 'قاعة العباقرة (B)', capacity: 45, status: 'empty', currentClass: null, teacher: null, timeRemaining: null, nextClass: 'كيمياء عضوية - 4:00 PM' },
        { id: 3, name: 'معمل الحاسب', capacity: 30, status: 'maintenance', currentClass: 'صيانة دورية', teacher: 'IT Team', timeRemaining: '2 ساعة', nextClass: null },
        { id: 4, name: 'قاعة (C)', capacity: 80, status: 'busy', currentClass: 'لغة عربية (نحو)', teacher: 'أ. رضا الفاروق', timeRemaining: '45 دقيقة', nextClass: 'لغة إنجليزية' },
        { id: 5, name: 'قاعة (D)', capacity: 55, status: 'empty', currentClass: null, teacher: null, timeRemaining: null, nextClass: 'رياضيات بحتة - 5:30 PM' },
        { id: 6, name: 'مسرح السنتر', capacity: 150, status: 'busy', currentClass: 'مراجعة نهائية فيزياء', teacher: 'أ. محمود مجدي', timeRemaining: '1 ساعة', nextClass: 'حفل تكريم' },
    ]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'busy': return 'bg-rose-50 border-rose-200 text-rose-600';
            case 'empty': return 'bg-emerald-50 border-emerald-200 text-emerald-600';
            case 'maintenance': return 'bg-slate-100 border-slate-200 text-slate-500';
            default: return 'bg-white border-slate-100';
        }
    };

    return (
        <div className="space-y-12 animate-view">
            <div className="flex justify-between items-center bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm">
                <div className="space-y-2">
                    <h2 className="text-4xl font-black text-slate-900 flex items-center gap-4"><LayoutGrid size={40} className="text-indigo-600" /> LIVE FLOOR PLAN</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">مراقبة حية لحالة القاعات، الحصص الجارية، وجداول الإشغال.</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 rounded-full text-rose-600 text-xs font-black uppercase"><span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span> Busy (3)</div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-600 text-xs font-black uppercase"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Available (2)</div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-slate-500 text-xs font-black uppercase"><span className="w-2 h-2 rounded-full bg-slate-400"></span> Maintenance (1)</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rooms.map(room => (
                    <div
                        key={room.id}
                        onClick={() => setSelectedRoom(room.id)}
                        className={`relative p-8 rounded-[3rem] border-2 transition-all cursor-pointer group hover:scale-[1.02] hover:shadow-2xl ${getStatusColor(room.status)} ${selectedRoom === room.id ? 'ring-4 ring-indigo-500 ring-offset-4' : ''}`}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm">
                                <h3 className="text-xl font-black text-slate-900">{room.name}</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2 mt-1"><Users size={12} /> السعة: {room.capacity}</p>
                            </div>
                            <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white/80 shadow-sm backdrop-blur-sm`}>
                                {room.status === 'busy' ? 'مشغولة' : room.status === 'empty' ? 'متاحة' : 'صيانة'}
                            </div>
                        </div>

                        {room.status === 'busy' ? (
                            <div className="space-y-4">
                                <div className="p-5 bg-white/60 rounded-2xl backdrop-blur-sm space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-50">الحصة الحالية</p>
                                    <p className="text-lg font-black text-slate-900 leading-tight">{room.currentClass}</p>
                                    <p className="text-xs font-bold text-slate-600 flex items-center gap-2"><Users size={14} /> {room.teacher}</p>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-black">
                                    <Clock size={16} className="animate-spin-slow" /> متبقي: <span className="text-slate-900 bg-white/50 px-2 rounded-lg">{room.timeRemaining}</span>
                                </div>
                            </div>
                        ) : room.status === 'empty' ? (
                            <div className="space-y-4 py-4">
                                <div className="text-center opacity-40">
                                    <CheckCircle size={48} className="mx-auto mb-2" />
                                    <p className="font-black text-sm">القاعة جاهزة للاستخدام</p>
                                </div>
                                {room.nextClass && (
                                    <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                                        <p className="text-[10px] font-black uppercase text-indigo-400 mb-1">الحجز القادم</p>
                                        <p className="text-xs font-black text-indigo-900">{room.nextClass}</p>
                                    </div>
                                )}
                                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-emerald-600 transition-all shadow-lg flex items-center justify-center gap-2">
                                    <Plus size={16} /> حجز حصة فورية
                                </button>
                            </div>
                        ) : (
                            <div className="py-8 text-center opacity-50">
                                <Info size={48} className="mx-auto mb-4" />
                                <p className="font-black">خارج الخدمة لأعمال الصيانة</p>
                            </div>
                        )}

                        {selectedRoom === room.id && (
                            <div className="absolute inset-x-0 -bottom-4 flex justify-center">
                                <div className="bg-slate-900 text-white text-[10px] uppercase font-black px-4 py-1 rounded-full shadow-xl">Selected</div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Footer / Legend */}
            <div className="flex justify-center gap-8 mt-12 opacity-50">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400"><div className="w-3 h-3 bg-rose-500 rounded-md"></div> مشغول</div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400"><div className="w-3 h-3 bg-emerald-500 rounded-md"></div> متاح</div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400"><div className="w-3 h-3 bg-slate-400 rounded-md"></div> صيانة</div>
            </div>
        </div>
    );
};

export default FloorPlanModule;
