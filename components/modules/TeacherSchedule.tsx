
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, AlertTriangle, Users } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const TeacherSchedule: React.FC = () => {
    const { lang } = useAppContext();
    const isRtl = lang === 'ar';

    const periods = [1, 2, 3, 4, 5, 6, 7];
    const days = [
        { id: 'sun', name: 'الأحد' },
        { id: 'mon', name: 'الاثنين' },
        { id: 'tue', name: 'الثلاثاء' },
        { id: 'wed', name: 'الأربعاء' },
        { id: 'thu', name: 'الخميس' }
    ];

    // Mock Schedule Data
    const schedule = [
        { day: 'sun', period: 1, subject: 'فيزياء', grade: '3Sec', room: 'Lab 1' },
        { day: 'sun', period: 3, subject: 'فيزياء', grade: '1Sec', room: 'Hall 2' },
        { day: 'mon', period: 2, subject: 'ميكانيكا', grade: '2Sec', room: 'Class 5' },
        { day: 'wed', period: 5, subject: 'فيزياء كهربائية', grade: '3Sec', room: 'Lab 2' },
    ];

    return (
        <div className="space-y-8 animate-view pb-20">
            <div className="flex justify-between items-center bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4">
                        <Calendar className="text-indigo-600" size={32} />
                        {isRtl ? 'جدول الحصص الأسبوعي' : 'Weekly Schedule'}
                    </h2>
                    <p className="text-slate-400 font-bold mt-2">استعرض جدولك الأسبوعي وقم بإدارة أوقاتك بكفاءة.</p>
                </div>
                <button className="px-6 py-3 bg-rose-50 text-rose-600 rounded-xl font-black text-xs flex items-center gap-2 hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                    <AlertTriangle size={18} /> {isRtl ? 'إبلاغ عن طوارئ / اعتذار' : 'Emergency / Leave'}
                </button>
            </div>

            <div className="glass-panel bg-white p-2 rounded-[3.5rem] shadow-sm overflow-hidden border border-slate-200">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px]">
                        <thead>
                            <tr>
                                <th className="p-6 bg-slate-900 text-white first:rounded-tr-[3rem] last:rounded-tl-[3rem] text-sm font-black w-32">
                                    {isRtl ? 'اليوم / الحصة' : 'Day / Period'}
                                </th>
                                {periods.map(p => (
                                    <th key={p} className="p-4 bg-slate-50 text-slate-500 font-black text-lg border-b border-l border-slate-200">
                                        {p}
                                        <span className="block text-[10px] font-bold opacity-50 mt-1">08:00 - 09:00</span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {days.map(day => (
                                <tr key={day.id} className="border-b last:border-0 border-slate-100/50">
                                    <td className="p-6 bg-slate-50 font-black text-slate-700 text-center border-l w-32">
                                        {day.name}
                                    </td>
                                    {periods.map(period => {
                                        const session = schedule.find(s => s.day === day.id && s.period === period);
                                        return (
                                            <td key={period} className="p-2 border-l border-slate-100 relative h-32 align-top transition-colors hover:bg-slate-50">
                                                {session ? (
                                                    <div className="h-full bg-indigo-600 text-white rounded-2xl p-4 shadow-lg hover:scale-[1.02] transition-transform cursor-pointer relative overflow-hidden group">
                                                        <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8 blur-xl"></div>
                                                        <div className="relative z-10 space-y-2">
                                                            <p className="font-black text-lg leading-none">{session.subject}</p>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded-lg">{session.grade}</span>
                                                                <span className="text-[10px] font-bold flex items-center gap-1 opacity-80"><MapPin size={10} /> {session.room}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="h-full rounded-2xl border-2 border-dashed border-slate-100 flex items-center justify-center text-slate-200 text-xs font-bold uppercase tracking-widest opacity-0 hover:opacity-100">
                                                        Free
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
            </div>
        </div>
    );
};

export default TeacherSchedule;
