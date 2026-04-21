"use client";

import { createContext, useContext, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

const AppContext = createContext(); 

export function AppProvider({ children }) { 
  const locale = useLocale();
  const t = useTranslations('Navbar'); 

  const [accessibilityMode, setAccessibilityMode] = useState('standard');

  const value = {
    locale,
    isRTL: locale === 'ar',
    t, 
    accessibilityMode,
    setAccessibilityMode
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context; 
};