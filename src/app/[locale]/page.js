"use client";

import { useState } from 'react';
import { Box, Typography, Button, Container, IconButton } from '@mui/material'; 
import { keyframes } from '@mui/system';
import { Activity, Globe, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/navigation'; 

const pulseRing = keyframes`
  0% { transform: scale(0.8); opacity: 0.5; }
  100% { transform: scale(1.3); opacity: 0; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export default function SplashPage() {
  const router = useRouter(); 
  const pathname = usePathname();
  const locale = useLocale(); 
  const t = useTranslations('Splash'); 
  
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleStart = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      router.push('/onboarding'); 
    }, 600);
  };

=  const toggleLanguage = () => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc', 
        position: 'relative',
        overflow: 'hidden',
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 0.6s ease-in-out',
      }}
    >
      <Box sx={{ position: 'absolute', top: 32, px: 4, width: '100%', display: 'flex', justifyContent: 'space-between', zIndex: 50 }}>
        <Button 
          onClick={toggleLanguage}
          startIcon={<Globe size={18} color="#2563eb" />}
          sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.8)', 
            backdropFilter: 'blur(10px)',
            borderRadius: '50px',
            px: 3,
            py: 1,
            color: 'text.primary',
            fontWeight: 'bold',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textTransform: 'none',
            '&:hover': { backgroundColor: 'white' }
          }}
        >
          {locale === 'ar' ? 'English' : 'عربي'}
        </Button>
      </Box>

      <Box sx={{ position: 'absolute', top: '-10%', left: '-10%', width: '400px', height: '400px', bgcolor: '#dbeafe', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.6 }} />
      <Box sx={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '400px', height: '400px', bgcolor: '#d1fae5', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.6 }} />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 10 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', animation: `${fadeIn} 0.8s ease-out` }}>
          
          <Box sx={{ 
            width: 130, height: 130, bgcolor: 'white', borderRadius: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4,
            boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.1)', border: '1px solid #f1f5f9',
            position: 'relative'
          }}>
            <Box sx={{ position: 'absolute', inset: 0, bgcolor: '#eff6ff', borderRadius: '32px', animation: `${pulseRing} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite` }} />
            <Activity size={64} color="#2563eb" style={{ position: 'relative', zIndex: 10 }} />
          </Box>

          <Typography variant="h2" component="h1" fontWeight="900" color="#1e293b" sx={{ mb: 1, fontSize: { xs: '2.5rem', md: '3.5rem' }, letterSpacing: '-0.02em' }}>
            {t('title')}
          </Typography>
          
          <Typography variant="h6" fontWeight="600" color="#2563eb" sx={{ mb: 8, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
            {t('subtitle')}
          </Typography>

          <Button
            variant="contained"
            onClick={handleStart}
            endIcon={locale === 'ar' ? <ArrowLeft size={20} /> : <ArrowRight size={20} />} 
            sx={{
              px: 6, py: 2, borderRadius: '20px', 
              backgroundColor: '#2563eb', color: 'white',
              fontSize: '1.1rem', fontWeight: 'bold', textTransform: 'none',
              boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)',
              transition: 'transform 0.2s',
              '&:hover': { backgroundColor: '#1d4ed8', transform: 'scale(1.05)' }
            }}
          >
            {t('startBtn')}
          </Button>

        </Box>
      </Container>
    </Box>
  );
}