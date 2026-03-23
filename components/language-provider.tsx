'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Language } from '@/lib/i18n';

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
}

const STORAGE_KEY = 'lifemap-language';

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es');

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Language | null;
    if (saved === 'es' || saved === 'en' || saved === 'pt') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem(STORAGE_KEY, nextLanguage);
  };

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
