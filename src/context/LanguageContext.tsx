
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations } from './translations';

type Language = 'ar' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: React.Dispatch<React.SetStateAction<Language>>;
    t: (key: string) => string;
    isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('ar');

    const t = (key: string): string => {
        // @ts-ignore
        return translations[language][key] || key;
    };

    const isRtl = language === 'ar';

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, isRtl }}>
            <div dir={isRtl ? 'rtl' : 'ltr'} className={isRtl ? 'font-sans' : 'font-sans'}>
                {children}
            </div>
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
