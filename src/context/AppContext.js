"use client";

import { createContext, useContext, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { BackendConnector } from '@/services/backendConnector'; 

const AppContext = createContext(); 

export function AppProvider({ children }) { 
  const locale = useLocale();
  const t = useTranslations('Navbar'); 

  const [trialStatus, setTrialStatus] = useState(null);
  const [loadingTrial, setLoadingTrial] = useState(false); 

  const startTrialSession = async () => {
    try {
        setLoadingTrial(true);
        const status = await BackendConnector.getTrialStatus();
        console.log("Trial Status from API:", status);
        setTrialStatus(status);
    } catch (error) {
        console.error("Error fetching trial status:", error);
    } finally {
        setLoadingTrial(false);
    }
  };

  const value = {
    locale,
    isRTL: locale === 'ar',
    t, 
    trialStatus,   
    loadingTrial,
    startTrialSession 
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