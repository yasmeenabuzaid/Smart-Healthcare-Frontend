import { Box, Typography } from '@mui/material';
import { Clock, HeartPulse } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { blurReveal, blurHide, softSweep, softGlow, subtleFloat } from '../../utils/animations';

export default function SplashScreen({ phase }) {
  const t = useTranslations('SplashScreens');

  return (
    <Box
      sx={{
        flexGrow: 1, 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#ffffff',
        position: 'relative', 
        overflow: 'hidden', 
        px: 3
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
            {t('phase1Subtitle')}
          </Typography>
        </Box>
      )}

{phase === 2 && (
  <Box sx={{ position: 'relative', zIndex: 10, textAlign: 'center', animation: `${blurReveal} 0.8s ease-out forwards, ${blurHide} 0.6s 2.2s ease-in forwards` }}>
    <Box sx={{ width: 110, height: 110, mx: 'auto', mb: 4, borderRadius: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '2px solid #3b82f6', boxShadow: '0 15px 30px -10px rgba(37, 99, 235, 0.15)', animation: `${softGlow} 3s infinite ease-in-out` }}>
      <HeartPulse size={54} color="#1d4ed8" strokeWidth={2.5} />
    </Box>

    <Typography 
      variant="h3" 
      fontWeight="900" 
      color="#0f172a" 
      sx={{ 
        mb: 1, 
        letterSpacing: '-1.5px', 
        lineHeight: 1.3, 
        fontSize: { xs: '2.4rem', md: '3rem' },
        display: 'flex',
        justifyContent: 'center',
        gap: '10px' 
      }}
    >
      {t('phase2TitleMain')}
      
      <Box component="span" sx={{ color: '#1d4ed8' }}>
        {t('phase2TitleHighlight')}
      </Box>
    </Typography>

    <Typography variant="h6" fontWeight="700" color="#64748b" sx={{ fontSize: '1.2rem' }}>
      {t('phase2Subtitle')}
    </Typography>
  </Box>
)}
    </Box>
  );
}