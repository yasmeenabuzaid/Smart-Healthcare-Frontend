"use client";

import { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';

export function usePageVoice(text) {
  const { accessibilityMode } = useApp();
  const { speak, stop } = useVoiceAssistant();

  useEffect(() => {
    if (text && accessibilityMode === 'audio_guided') {
      speak(text);
    }
    
    return () => {
      stop();
    };
  }, [text, accessibilityMode]); 
}