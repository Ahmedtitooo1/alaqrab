
import React, { useState } from 'react';
import {
    Calendar, Clock, MapPin, User, BookOpen, Plus, X, AlertTriangle, CheckCircle
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { TimetableEntry, UserRole } from '../../types';

// Mock Constants
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const PERIODS = 6; // 6 periods a day

const WeeklyTimetable: React.FC = () => {
    const { lang, allUsers } = useAppContext();
    const isRtl = lang === 'ar';

    // Mock Data
    const [entries, setEntries] = useState<TimetableEntry[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{ day: string, period: number } | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        gradeLevelId: 'gl-1',
        subjectId: '',
        teacherId: '',
        roomId: ''
    });

    // Mock Subjects/Grades
    const subjects = [
        { id: 'sub-1', name: 'الفيزياء (Physics)', gradeLevelId: 'gl-1', assignedTeacherIds: ['t-1'] },
        { id: 'sub-2', name: 'الرياضيات (Math)', gradeLevelId: 'gl-1', assignedTeacherIds: ['t-2'] }
    ];

    const teachers = allUsers?.filter(u => u.role === UserRole.TEACHER) || [
        { id: 't-1', firstName: 'أحمد', lastName: 'محمد' },
        { id: 't-2', firstName: 'سارة', lastName: 'علي' }
    ];

    const handleCellClick = (day: string, periodIndex: number) => {
        setSelectedSlot({ day, period: periodIndex });
        setFormData({ gradeLevelId: 'gl-1', subjectId: '', teacherId: '', roomId: '' }); // Reset
        setShowModal(true);
    };

    const handleSave = () => {
        if (!selectedSlot || !formData.subjectId || !formData.teacherId) return alert("Please fill all fields");

        // Conflict Check: Is this teacher busy at this time?
        const conflict = entries.find(e =>
            e.day === selectedSlot.day &&
            e.periodIndex === selectedSlot.period &&
            e.teacherId === formData.teacherId
        );

        if (conflict) {
            return alert(isRtl ? "تنبيه: هذا المعلم مشغول في حصة أخرى في نفس التوقيت!" : "Conflict: Teacher is busy!");
        }

        setEntries([...entries, {
            id: Math.random().toString(),
            institutionId: 'inst-1',
            day: selectedSlot.day as any,
            periodIndex: selectedSlot.period,
            ...formData
        }]);
        setShowModal(false);
    };

    const getCellData = (day: string, period: number) => {
        return entries.filter(e => e.day === day && e.periodIndex === period);
    };

    return (
        <div className="space-y-8 animate-view pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <Calendar className="text-indigo-600" /> {isRtl ? 'الجدول الدراسي الأسبوعي' : 'Weekly Timetable'}
                    </h2>
                    <p className="text-slate-500 font-bold mt-1">
                        {isRtl ? 'إدارة الجدول وتوزيع الحصص على القاعات والمعلمين.' : 'Manage weekly schedule and allocate classes.'}
                    </p>
                </div>
            </div>

            <div className="overflow-x-auto rounded-[2.5rem] bg-white border border-slate-200 shadow-xl">
                <table className="w-full min-w-[1000px]">
                    <thead className="bg-slate-900 text-white">
                        <tr>
                            <th className="p-6 text-center w-40 font-black uppercase tracking-widest">{isRtl ? 'اليوم' : 'Day'}</th>
                            {Array.from({ length: PERIODS }).map((_, i) => (
                                <th key={i} className="p-6 text-center border-l border-white/10">
                                    <div className="flex flex-col items-center">
                                        <span className="font-black text-lg">{i + 1}</span>
                                        <span className="text-[10px] opacity-60 font-medium uppercase tracking-widest">Period</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {DAYS.map(day => (
                            <tr key={day} className="group hover:bg-slate-50 transition-colors">
                                <td className="p-6 text-center font-black text-slate-700 bg-slate-50/50">
                                    {day}
                                </td>
                                {Array.from({ length: PERIODS }).map((_, i) => {
                                    const cellEntries = getCellData(day, i);
                                    return (
                                        <td
                                            key={i}
                                            onClick={() => handleCellClick(day, i)}
                                            className="p-4 border-l border-slate-100 cursor-pointer hover:bg-indigo-50/30 transition-all h-32 align-top relative"
                                        >
                                            {cellEntries.length > 0 ? (
                                                <div className="space-y-2">
                                                    {cellEntries.map(entry => {
                                                        const sub = subjects.find(s => s.id === entry.subjectId);
                                                        const tea = teachers.find(t => t.id === entry.teacherId);
                                                        return (
                                                            <div key={entry.id} className="p-2 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold shadow-sm border border-indigo-200">
                                                                <div className="flex items-center gap-1 mb-1 text-indigo-900 font-black"><BookOpen size={10} /> {sub?.name}</div>
                                                                <div className="flex items-center gap-1 opacity-80"><User size={10} /> {tea?.firstName}</div>
                                                                <div className="flex items-center gap-1 opacity-80 mt-1 pt-1 border-t border-indigo-200"><MapPin size={10} /> Room: {entry.roomId || 'N/A'}</div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Plus className="text-slate-300" />
                                                </div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Booking Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-view border-[8px] border-slate-100 relative">
                        <button onClick={() => setShowModal(false)} className="absolute top-6 left-6 p-2 bg-slate-100 rounded-full hover:bg-rose-100 hover:text-rose-600 transition-all"><X size={20} /></button>

                        <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                            <Clock className="text-indigo-600" /> {isRtl ? 'حجز حصة دراسية' : 'Schedule Class'}
                        </h3>

                        <div className="space-y-4">
                            <div className="p-4 bg-indigo-50 rounded-2xl flex items-center gap-4 text-indigo-900 font-bold text-sm mb-6">
                                <CheckCircle />
                                <span>{selectedSlot?.day} - Period {(selectedSlot?.period || 0) + 1}</span>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">{isRtl ? 'الصف الدراسي' : 'Grade Level'}</label>
                                <select
                                    className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border-2 border-transparent focus:border-indigo-500 transition-all"
                                    value={formData.gradeLevelId}
                                    onChange={e => setFormData({ ...formData, gradeLevelId: e.target.value })}
                                >
                                    <option value="gl-1">Grade 10</option>
                                    <option value="gl-2">Grade 11</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">{isRtl ? 'المادة' : 'Subject'}</label>
                                <select
                                    className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border-2 border-transparent focus:border-indigo-500 transition-all"
                                    value={formData.subjectId}
                                    onChange={e => setFormData({ ...formData, subjectId: e.target.value })}
                                >
                                    <option value="">Select Subject...</option>
                                    {subjects.filter(s => s.gradeLevelId === formData.gradeLevelId).map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">{isRtl ? 'المعلم' : 'Teacher'}</label>
                                <select
                                    className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border-2 border-transparent focus:border-indigo-500 transition-all"
                                    value={formData.teacherId}
                                    onChange={e => setFormData({ ...formData, teacherId: e.target.value })}
                                >
                                    <option value="">Select Teacher...</option>
                                    {/* In real app, filter teachers by subject assignment */}
                                    {teachers.map(t => (
                                        <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">{isRtl ? 'القاعة / الفصل' : 'Room'}</label>
                                <input
                                    className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border-2 border-transparent focus:border-indigo-500 transition-all"
                                    placeholder="e.g. Lab 1, Room 101"
                                    value={formData.roomId}
                                    onChange={e => setFormData({ ...formData, roomId: e.target.value })}
                                />
                            </div>

                            <button onClick={handleSave} className="w-full py-4 mt-4 bg-slate-900 text-white rounded-xl font-black shadow-xl hover:bg-emerald-600 transition-all">
                                {isRtl ? 'تأكيد الحجز' : 'Confirm Scheduling'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeeklyTimetable;
