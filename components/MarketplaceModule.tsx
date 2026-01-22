
import * as React from 'react';
import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { MarketplaceItem, UserRole } from '../types';
import {
    ShoppingBag, Search, Filter, Star, Download, Play, FileText,
    Plus, Check, DollarSign, Users, TrendingUp
} from 'lucide-react';

export const MarketplaceModule: React.FC = () => {
    const { marketplaceItems, user, purchaseMarketplaceItem, addMarketplaceItem, t } = useAppContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [showUploadModal, setShowUploadModal] = useState(false);

    const filteredItems = useMemo(() => {
        return marketplaceItems.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.teacherName?.toLowerCase() || '').includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategory === 'all' || item.type === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [marketplaceItems, searchQuery, activeCategory]);

    const categories = [
        { id: 'all', label: 'الكل' },
        { id: 'course', label: 'دورات تدريبية' },
        { id: 'exam', label: 'بنك اختبارات' },
        { id: 'summary', label: 'ملخصات' },
        { id: 'video', label: 'دروس مسجلة' },
    ];

    return (
        <div className="space-y-10 animate-view pb-20">
            {/* Header Section */}
            <div className="premium-dark-card p-14 text-white overflow-hidden relative border-none shadow-3xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-[120px] -mr-40 -mt-40 rounded-full"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="text-right">
                        <h2 className="text-5xl font-black italic uppercase flex items-center gap-6">
                            <ShoppingBag size={48} className="text-amber-500 animate-pulse" /> {t('educational_marketplace')}
                        </h2>
                        <p className="text-slate-400 font-bold mt-4 text-xl">تطوير مستقبلك التعليمي يبدأ من هنا. محتوى حصري متاح الآن.</p>
                    </div>
                    {user?.role === UserRole.TEACHER && (
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="px-10 py-6 bg-amber-500 text-slate-950 rounded-[2rem] font-black text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
                        >
                            <Plus size={28} strokeWidth={3} /> عرض محتوى للبيع
                        </button>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="relative flex-1">
                    <Search size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="ابحث عن دورة، ملخص، أو معلم..."
                        className="w-full p-6 pr-16 bg-white border-2 border-slate-100 rounded-[2.5rem] font-bold outline-none focus:border-amber-500 transition-all shadow-sm"
                    />
                </div>
                <div className="flex bg-slate-100 p-2 rounded-[2.5rem] shadow-inner overflow-x-auto no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-8 py-4 rounded-[2rem] font-black text-xs transition-all whitespace-nowrap ${activeCategory === cat.id ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredItems.map(item => (
                    <div key={item.id} className="group glass-panel bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                        <div className="relative h-64 overflow-hidden">
                            <img
                                src={item.thumbnail || `https://api.dicebear.com/7.x/shapes/svg?seed=${item.type || 'edu'}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                alt={item.title}
                            />
                            <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl font-black text-[10px] shadow-lg flex items-center gap-2">
                                {item.type === 'video' && <Play size={12} className="text-amber-600" />}
                                {item.type === 'summary' && <FileText size={12} className="text-indigo-600" />}
                                {item.type === 'exam' && <Star size={12} className="text-emerald-600" />}
                                {item.type.toUpperCase()}
                            </div>
                            <div className="absolute bottom-6 right-6">
                                <div className="p-3 bg-slate-950 text-white rounded-2xl font-black text-xl shadow-2xl">
                                    {item.price} <span className="text-[10px] opacity-60">{t('egp')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-slate-900 group-hover:text-amber-600 transition-colors">{item.title}</h3>
                                <p className="text-slate-400 font-bold text-sm">بواسطة: {item.teacherName || 'معلم معتمد'}</p>
                            </div>

                            <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{item.description}</p>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                <div className="flex items-center gap-2 text-slate-400 font-black text-[10px]">
                                    <Users size={14} /> {item.salesCount || 0} طالب مشترك
                                </div>
                                <button
                                    onClick={() => purchaseMarketplaceItem(item.id)}
                                    className="px-8 py-3 bg-slate-100 text-slate-900 rounded-xl font-black text-xs hover:bg-slate-950 hover:text-white transition-all shadow-sm"
                                >
                                    شراء الآن
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredItems.length === 0 && (
                    <div className="col-span-full py-40 text-center opacity-30 select-none">
                        <ShoppingBag size={120} className="mx-auto mb-10 text-slate-200" />
                        <p className="text-3xl font-black italic tracking-widest uppercase text-slate-300">{t('no_content_found')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
