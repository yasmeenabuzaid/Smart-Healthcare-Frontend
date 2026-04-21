"use client";

import { useState, useEffect } from 'react';

export function useVoiceAssistant() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = (text, lang = 'ar-SA', rate = 0.9) => {
    if (!('speechSynthesis' in window)) {
      console.warn("المتصفح لا يدعم المساعد الصوتي");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate; 

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  return { speak, stop, isSpeaking };
}