
import * as React from 'react';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ProctoringLog, UserRole } from '../types';
import {
    ShieldAlert, User, Clock, AlertTriangle, MonitorX,
    ExternalLink, Search, Filter, Trash2, Calendar, ArrowRightLeft
} from 'lucide-react';

export const ProctoringModule: React.FC = () => {
    const { proctoringLogs, allUsers, lang, t } = useAppContext();
    const [searchQuery, setSearchQuery] = useState('');

    // Mock logs if empty
    const mockLogs: ProctoringLog[] = [
        { id: 'l1', studentId: 'u4', examId: 'ex1', timestamp: new Date().toISOString(), action: 'tab_switch', severity: 'medium' },
        { id: 'l2', studentId: 'u4', examId: 'ex1', timestamp: new Date(Date.now() - 60000).toISOString(), action: 'minimized', severity: 'low' },
    ];

    const logs = proctoringLogs.length > 0 ? proctoringLogs : mockLogs;
    const isRtl = lang === 'ar';

    return (
        <div className="space-y-10 animate-view pb-20">
            <div className="premium-dark-card p-12 text-white overflow-hidden relative border-none shadow-3xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 blur-[120px] -mr-40 -mt-40 rounded-full"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="text-right">
                        <h2 className="text-5xl font-black italic uppercase flex items-center gap-6">
                            <ShieldAlert size={48} className="text-rose-500 animate-pulse" /> {t('proctoring_center')}
                        </h2>
                        <p className="text-slate-400 font-bold mt-4 text-xl">مراقبة نزاهة الاختبارات وتحليل محاولات الغش المحتملة بشكل آلي.</p>
                    </div>
                </div>
            </div>

            <div className="glass-panel p-10 bg-white border border-slate-100 rounded-[3.5rem] shadow-sm">
                <div className="flex justify-between items-center mb-10 border-b pb-8">
                    <h3 className="text-2xl font-black flex items-center gap-4 text-slate-900 border-r-4 border-rose-500 pr-5">سجل التنبيهات الأمنية</h3>
                    <div className="flex gap-4">
                        <div className="relative">
                            <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="بحث عن طالب..."
                                className="pl-12 pr-10 py-3 bg-slate-50 rounded-xl text-xs font-bold outline-none border focus:border-rose-500 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {logs.map(log => {
                        const student = allUsers.find(u => u.id === log.studentId);
                        return (
                            <div key={log.id} className="p-6 bg-rose-50/30 border border-rose-100 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-rose-50 transition-all group">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm border border-rose-100">
                                        {log.action === 'tab_switch' ? <ArrowRightLeft size={24} /> : <MonitorX size={24} />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-xl font-black text-slate-900">{student?.firstName} {student?.lastName}</h4>
                                            <span className="text-[10px] font-black uppercase bg-slate-900 text-white px-3 py-1 rounded-lg italic">{t('suspected')}</span>
                                        </div>
                                        <p className="text-xs text-rose-600 font-bold mt-1 uppercase tracking-widest flex items-center gap-2">
                                            <AlertTriangle size={12} /> {log.action === 'tab_switch' ? 'تبديل نافذة المتصفح' : 'تصغير المتصفح'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 w-full md:w-auto justify-between border-t md:border-t-0 pt-4 md:pt-0">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">توقيت الحدث</p>
                                        <div className="flex items-center gap-2 text-slate-600 font-bold">
                                            <Clock size={14} /> <span className="tabular-nums">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                    <button className="p-4 bg-white text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
