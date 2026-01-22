
import React, { useState } from 'react';
import {
    Plus, Search, Filter, AlertCircle, CheckCircle, Clock,
    MessageSquare, MoreHorizontal, User, Tag
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { InternalTicket } from '../types';

const InternalTicketSystem: React.FC = () => {
    const { internalTickets, addInternalTicket, updateInternalTicket, user, allUsers, isRtl } = useAppContext();
    const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Form State
    const [newTicket, setNewTicket] = useState({
        title: '',
        description: '',
        category: 'it',
        priority: 'medium'
    });

    const getPriorityColor = (p: string) => {
        switch (p) {
            case 'urgent': return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'low': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getStatusColor = (s: string) => {
        switch (s) {
            case 'open': return 'bg-blue-50 text-blue-600';
            case 'in_progress': return 'bg-purple-50 text-purple-600';
            case 'resolved': return 'bg-emerald-50 text-emerald-600';
            case 'closed': return 'bg-slate-100 text-slate-500';
            default: return 'bg-slate-50 text-slate-500';
        }
    };

    const handleCreate = () => {
        if (!newTicket.title) return;

        const ticket: InternalTicket = {
            id: Date.now().toString(),
            title: newTicket.title,
            description: newTicket.description,
            // @ts-ignore
            priority: newTicket.priority,
            // @ts-ignore
            category: newTicket.category,
            status: 'open',
            createdBy: user?.id || 'unknown',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            comments: []
        };

        addInternalTicket(ticket);
        setIsCreateOpen(false);
        setNewTicket({ title: '', description: '', category: 'it', priority: 'medium' });
    };

    const filteredTickets = internalTickets.filter(t => filterStatus === 'all' || t.status === filterStatus);

    return (
        <div className="space-y-6 animate-fade-in p-6" dir={isRtl ? 'rtl' : 'ltr'}>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                        <Tag className="text-indigo-600" />
                        نظام التذاكر والدعم الداخلي
                    </h2>
                    <p className="text-slate-500 font-medium mt-1">إبلاغ عن أعطال، طلبات صيانة، أو احتياجات إدارية</p>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all"
                >
                    <Plus size={20} /> تذكرة جديدة
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'تذاكر مفتوحة', count: internalTickets.filter(t => t.status === 'open').length, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'قصوى الأهمية', count: internalTickets.filter(t => t.priority === 'urgent' && t.status !== 'closed').length, color: 'text-rose-600', bg: 'bg-rose-50' },
                    { label: 'قيد المعالجة', count: internalTickets.filter(t => t.status === 'in_progress').length, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'تم الحل هذا الشهر', count: internalTickets.filter(t => t.status === 'resolved').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                            <p className={`text-3xl font-black mt-1 ${stat.color}`}>{stat.count}</p>
                        </div>
                        <div className={`p-3 rounded-xl ${stat.bg}`}>
                            <Tag className={stat.color} size={24} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {['all', 'open', 'in_progress', 'resolved', 'closed'].map(s => (
                    <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${filterStatus === s ? 'bg-slate-900 text-white' : 'bg-white border hover:bg-slate-50 text-slate-600'}`}
                    >
                        {s === 'all' ? 'الكل' : s === 'open' ? 'مفتوحة' : s === 'in_progress' ? 'قيد العمل' : s === 'resolved' ? 'تم الحل' : 'مغلقة'}
                    </button>
                ))}
            </div>

            {/* List View */}
            <div className="space-y-3">
                {filteredTickets.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed">
                        <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Tag className="text-slate-300" size={32} />
                        </div>
                        <p className="text-slate-500 font-bold">لا يوجد تذاكر مطابقة للبحث</p>
                    </div>
                ) : (
                    filteredTickets.map(ticket => {
                        const creator = allUsers.find(u => u.id === ticket.createdBy);
                        return (
                            <div key={ticket.id} className="bg-white p-5 rounded-2xl border hover:border-indigo-300 transition-all shadow-sm hover:shadow-md group">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase border ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority}
                                            </span>
                                            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${getStatusColor(ticket.status)}`}>
                                                {ticket.status.replace('_', ' ')}
                                            </span>
                                            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                                <Clock size={12} /> {new Date(ticket.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-1">{ticket.title}</h3>
                                        <p className="text-sm text-slate-500 line-clamp-2">{ticket.description}</p>

                                        <div className="flex items-center gap-4 mt-4 text-xs font-bold text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <UserCircle size={14} />
                                                <span>من: {creator ? `${creator.firstName} ${creator.lastName}` : 'مجهول'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Tag size={14} />
                                                <span>القسم: {ticket.category}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {/* Only Admins or Creator can close/edit - simplified for now */}
                                        <select
                                            value={ticket.status}
                                            onChange={(e) => updateInternalTicket({ ...ticket, status: e.target.value as any })}
                                            className="bg-slate-50 border rounded-lg text-xs font-bold p-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="open">مفتوحة</option>
                                            <option value="in_progress">قيد العمل</option>
                                            <option value="resolved">تم الحل</option>
                                            <option value="closed">مغلقة</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Create Modal */}
            {isCreateOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden animate-scale-in">
                        <div className="p-6 border-b bg-slate-50 flex justify-between items-center">
                            <h3 className="text-xl font-black">فتح تذكرة جديدة</h3>
                            <button onClick={() => setIsCreateOpen(false)} className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-full transition-colors">
                                <AlertCircle size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500">عنوان الموضوع</label>
                                <input
                                    value={newTicket.title}
                                    onChange={e => setNewTicket({ ...newTicket, title: e.target.value })}
                                    className="w-full p-3 bg-slate-50 rounded-xl border focus:border-indigo-500 outline-none font-bold"
                                    placeholder="مثال: تعطل الطابعة في غرفة المعلمين"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500">القسم المعني</label>
                                    <select
                                        value={newTicket.category}
                                        onChange={e => setNewTicket({ ...newTicket, category: e.target.value })}
                                        className="w-full p-3 bg-slate-50 rounded-xl border focus:border-indigo-500 outline-none font-bold text-sm"
                                    >
                                        <option value="it">الدعم الفني (IT)</option>
                                        <option value="maintenance">الصيانة والمرافق</option>
                                        <option value="supplies">التوريدات والأدوات</option>
                                        <option value="other">أخرى</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500">الأولوية</label>
                                    <select
                                        value={newTicket.priority}
                                        onChange={e => setNewTicket({ ...newTicket, priority: e.target.value })}
                                        className="w-full p-3 bg-slate-50 rounded-xl border focus:border-indigo-500 outline-none font-bold text-sm"
                                    >
                                        <option value="low">عادية</option>
                                        <option value="medium">متوسطة</option>
                                        <option value="high">هام</option>
                                        <option value="urgent">عاجل جداً (يوقف العمل)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500">التفاصيل</label>
                                <textarea
                                    rows={4}
                                    value={newTicket.description}
                                    onChange={e => setNewTicket({ ...newTicket, description: e.target.value })}
                                    className="w-full p-3 bg-slate-50 rounded-xl border focus:border-indigo-500 outline-none font-bold"
                                    placeholder="اشرح المشكلة بالتفصيل..."
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t bg-slate-50 flex gap-3">
                            <button
                                onClick={() => setIsCreateOpen(false)}
                                className="flex-1 py-3 bg-white border hover:bg-slate-50 text-slate-600 rounded-xl font-bold"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={handleCreate}
                                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200"
                            >
                                إرسال التذكرة
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const UserCircle = ({ size }: { size: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="10" r="3" />
        <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
    </svg>
);

export default InternalTicketSystem;
