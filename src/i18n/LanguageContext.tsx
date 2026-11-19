import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Lang = 'fr' | 'en' | 'tr' | 'zh' | 'ru';

export const LANGUAGES: { code: Lang; label: string; name: string; locale: string }[] = [
  { code: 'fr', label: 'FR', name: 'Français', locale: 'fr-FR' },
  { code: 'en', label: 'EN', name: 'English', locale: 'en-US' },
  { code: 'tr', label: 'TR', name: 'Türkçe', locale: 'tr-TR' },
  { code: 'zh', label: '中文', name: '中文（简体）', locale: 'zh-CN' },
  { code: 'ru', label: 'RU', name: 'Русский', locale: 'ru-RU' },
];

// Un texte traduit : le français est obligatoire (langue d'origine du site et valeur de repli).
export type Tr<T = string> = { fr: T } & Partial<Record<Lang, T>>;

const STORAGE_KEY = 'portfolio-lang';
const SUPPORTED = LANGUAGES.map((l) => l.code);

const isLang = (value: unknown): value is Lang => SUPPORTED.includes(value as Lang);

// Le site s'ouvre en français tant que la personne n'a pas choisi une autre langue (le choix est mémorisé).
function detectInitialLanguage(): Lang {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isLang(saved)) return saved;
  } catch {
    /* stockage indisponible : on ignore */
  }
  return 'fr';
}

type LanguageContextValue = {
  lang: Lang;
  locale: string;
  setLang: (lang: Lang) => void;
  t: <T = string>(text: Tr<T>) => T;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectInitialLanguage);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* stockage indisponible : on ignore */
    }
  }, []);

  // La langue de la page suit le choix (lecteurs d'écran, césure, polices CJK).
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<LanguageContextValue>(() => {
    const locale = LANGUAGES.find((l) => l.code === lang)?.locale ?? 'fr-FR';
    const t = <T,>(text: Tr<T>): T => (text[lang] ?? text.fr) as T;
    return { lang, locale, setLang, t };
  }, [lang, setLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage doit être utilisé dans un <LanguageProvider>.');
  return context;
}
