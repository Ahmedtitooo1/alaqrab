
import React from 'react';
import { Menu, Globe } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import { useLanguage } from '../../../src/context/LanguageContext';

interface TopbarProps {
    onMobileMenuClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMobileMenuClick }) => {
    const { user } = useAppContext();
    const { language, setLanguage, t } = useLanguage();

    const handleLanguageToggle = () => {
        setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
    };

    return (
        <header className="h-20 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b z-40 sticky top-0 no-print">
            <button className="lg:hidden p-3 bg-slate-900 text-white rounded-xl" onClick={onMobileMenuClick}>
                <Menu size={20} />
            </button>
            <div className="flex items-center gap-6 ms-auto">
                {/* Language Switcher */}
                <button
                    onClick={handleLanguageToggle}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-black text-xs flex items-center gap-2 transition-all border border-slate-200"
                    title={language === 'ar' ? 'English' : 'عربي'}
                >
                    <Globe size={16} />
                    <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
                </button>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-black text-slate-900">{user?.firstName} {user?.lastName}</p>
                        <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">{t(user?.role || '') || user?.role}</p>
                    </div>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} className="w-10 h-10 rounded-xl bg-slate-50 border shadow-sm p-0.5" alt="Avatar" />
                </div>
            </div>
        </header>
    );
};

export default Topbar;
