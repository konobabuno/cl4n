// config/i18n/i18nProvider.tsx
// This file provides the i18n context for the application. (CLIENT SIDE ONLY)

'use client';

import { createContext, useContext } from 'react';

type Locale = 'en' | 'es';
type Dict = Record<string, any>; 

const I18nContext = createContext<{ lang: Locale; dict: Dict } | null>(null);

export function I18nProvider({
  lang,
  dict,
  children,
}: {
  lang: Locale;
  dict: Dict;
  children: React.ReactNode;
}) {
  return <I18nContext.Provider value={{ lang, dict }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx; 
}
