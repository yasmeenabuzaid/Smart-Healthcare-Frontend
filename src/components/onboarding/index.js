"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, Container, Stack, IconButton } from '@mui/material'; 
import { Eye, Mic, User, Volume2, Clock, HeartPulse } from 'lucide-react';
import { keyframes } from '@mui/system';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/navigation'; 
import { useApp } from '@/context/AppContext'; 
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant'; 
import ModeCard from './ModeCard'; 


const blurReveal = keyframes`
  0% { opacity: 0; filter: blur(15px); transform: translateY(20px); }
  100% { opacity: 1; filter: blur(0); transform: translateY(0); }
`;

const blurHide = keyframes`
  0% { opacity: 1; filter: blur(0); transform: translateY(0); }
  100% { opacity: 0; filter: blur(15px); transform: translateY(-20px); }
`;

const softSweep = keyframes`
  0% { transform: translateY(-100vh); opacity: 0; }
  50% { opacity: 0.3; }
  100% { transform: translateY(100vh); opacity: 0; }
`;

const softGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(29, 78, 216, 0.1); }
  50% { box-shadow: 0 0 25px 10px rgba(29, 78, 216, 0.05); }
  100% { box-shadow: 0 0 0 0 rgba(29, 78, 216, 0); }
`;

const subtleFloat = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
  100% { transform: translateY(0); }
`;

export default function OnboardingPage() {
  const router = useRouter(); 
  const t = useTranslations('Onboarding'); 
  const { setAccessibilityMode } = useApp(); 
  const { speak, stop, isSpeaking } = useVoiceAssistant();

  const [phase, setPhase] = useState(1); 

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase(2), 2500); 
    const timer2 = setTimeout(() => setPhase(3), 5000); 
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  const handleSpeak = () => speak(t('voicePrompt'));
  const handleSelectMode = (mode) => {
    stop(); 
    if (typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50); 
    }
    setAccessibilityMode(mode); 
    router.push('/login'); 
  };

  const modesData = [
    { id: 'visual', icon: Eye, color: '#1d4ed8', bg: '#eff6ff', title: t('visualTitle'), desc: t('visualDesc'), delay: '0.1s' },
    { id: 'audio_guided', icon: Mic, color: '#0369a1', bg: '#f0f9ff', title: t('audioTitle'), desc: t('audioDesc'), delay: '0.2s' },
    { id: 'standard', icon: User, color: '#334155', bg: '#f8fafc', title: t('standardTitle'), desc: t('standardDesc'), delay: '0.3s' }
  ];

  // ====================================================
  if (phase === 1 || phase === 2) {
    return (
      <Box
        sx={{
          flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff',
          position: 'relative', overflow: 'hidden', px: 3
        }}
      >
        <Box sx={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.5), transparent)',
          animation: `${softSweep} 4s infinite linear`, zIndex: 0
        }} />

        <Box sx={{ position: 'absolute', top: '-20%', left: '-20%', width: '140%', height: '140%', background: 'radial-gradient(circle, rgba(239,246,255,0.8) 0%, rgba(255,255,255,0) 50%)', zIndex: 0 }} />

        {phase === 1 && (
          <Box sx={{ position: 'relative', zIndex: 10, textAlign: 'center', animation: `${blurReveal} 0.8s ease-out forwards, ${blurHide} 0.6s 1.9s ease-in forwards` }}>
            <Box sx={{ width: 110, height: 110, mx: 'auto', mb: 4, borderRadius: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eff6ff', border: '1px solid #bfdbfe', animation: `${subtleFloat} 3s ease-in-out infinite` }}>
              <Clock size={50} color="#2563eb" strokeWidth={2} />
            </Box>
            <Typography variant="h3" fontWeight="900" color="#0f172a" sx={{ mb: 1, letterSpacing: '-1.5px', lineHeight: 1.3, fontSize: { xs: '2.4rem', md: '3rem' } }}>
              {t('phase1Title')}
            </Typography>
            <Typography variant="h6" fontWeight="700" color="#64748b" sx={{ fontSize: '1.2rem' }}>
              {t('phase1Desc')}
            </Typography>
          </Box>
        )}

        {phase === 2 && (
          <Box sx={{ position: 'relative', zIndex: 10, textAlign: 'center', animation: `${blurReveal} 0.8s ease-out forwards, ${blurHide} 0.6s 2.2s ease-in forwards` }}>
            <Box sx={{ width: 110, height: 110, mx: 'auto', mb: 4, borderRadius: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '2px solid #3b82f6', boxShadow: '0 15px 30px -10px rgba(37, 99, 235, 0.15)', animation: `${softGlow} 3s infinite ease-in-out` }}>
              <HeartPulse size={54} color="#1d4ed8" strokeWidth={2.5} />
            </Box>
            <Typography variant="h3" fontWeight="900" color="#0f172a" sx={{ mb: 1, letterSpacing: '-1.5px', lineHeight: 1.3, fontSize: { xs: '2.4rem', md: '3rem' } }}>
              {t('phase2Title')}
            </Typography>
            <Typography variant="h6" fontWeight="700" color="#64748b" sx={{ fontSize: '1.2rem' }}>
              {t('phase2Desc')}
            </Typography>
          </Box>
        )}
      </Box>
    );
  }

  // ====================================================
  return (
    <Box
      sx={{
        flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column',
        backgroundColor: '#ffffff', position: 'relative', overflow: 'hidden',
        py: { xs: 5, md: 8 }, px: { xs: 3, md: 0 }
      }}
    >
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '30vh', background: 'linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)', zIndex: 0 }} />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        <Box sx={{ textAlign: 'center', mb: 6, animation: `${blurReveal} 0.8s ease-out forwards` }}>
          <Typography variant="h3" component="h1" fontWeight="900" color="#0f172a" sx={{ mb: 2, letterSpacing: '-1.5px', fontSize: { xs: '2.6rem', md: '3.2rem' } }}>
            {t('title')}
          </Typography>
          <Typography variant="body1" fontWeight="700" color="#475569" sx={{ mb: 5, fontSize: '1.2rem' }}>
            {t('subtitle')}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <IconButton 
              onClick={handleSpeak}
              aria-label={t('clickToListen')}
              sx={{ 
                width: 72, height: 72,
                backgroundColor: isSpeaking ? '#1d4ed8' : '#ffffff',
                color: isSpeaking ? 'white' : '#1d4ed8',
                border: isSpeaking ? 'none' : '2px solid #dbeafe',
                boxShadow: isSpeaking ? '0 15px 30px rgba(29, 78, 216, 0.4)' : '0 10px 25px rgba(0,0,0,0.03)',
                transition: 'all 0.4s ease',
                animation: isSpeaking ? `${softGlow} 2s infinite` : 'none',
                '&:hover': { transform: 'translateY(-2px)', backgroundColor: isSpeaking ? '#1e40af' : '#eff6ff' }
              }}
            >
              <Volume2 size={32} strokeWidth={2.5} /> 
            </IconButton>
            <Typography variant="subtitle2" fontWeight="800" sx={{ mt: 2, color: '#3b82f6', letterSpacing: '1px' }}>
              {isSpeaking ? t('speaking') : t('clickToListen')}
            </Typography>
          </Box>
        </Box>

        <Stack spacing={2.5} sx={{ mt: 'auto' }}>
          {modesData.map((mode) => (
            <ModeCard 
              key={mode.id} 
              mode={mode} 
              onSelect={handleSelectMode} 
            />
          ))}
        </Stack>
      </Container>
    </Box>
  );
}