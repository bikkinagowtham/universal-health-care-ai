import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations, TranslationDictionary } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'English',
  setLanguage: () => {},
  t: (key: string, fallback?: string) => (translations.English as Record<string, string>)[key] || fallback || key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('uhc_language') as Language;
      if (saved && (saved === 'English' || saved === 'Telugu' || saved === 'Hindi')) {
        return saved;
      }
    }
    return 'English';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('uhc_language', lang);
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language === 'Telugu' ? 'te' : language === 'Hindi' ? 'hi' : 'en';
    }
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    const langDict = (translations[language] || translations.English) as Record<string, string>;
    const englishDict = translations.English as Record<string, string>;
    return langDict[key] || englishDict[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);
