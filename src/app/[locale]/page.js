"use client";

import { useState } from 'react';
import { Box, Typography, Button, Container, IconButton } from '@mui/material'; 
import { keyframes } from '@mui/system';
import { Activity, Globe, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/navigation'; 

const softRipple = keyframes`
  0% { transform: scale(0.95); opacity: 0.8; box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.2); }
  70% { transform: scale(1.2); opacity: 0; box-shadow: 0 0 0 25px rgba(37, 99, 235, 0); }
  100% { transform: scale(0.95); opacity: 0; box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
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
    }, 400);
  };

  const toggleLanguage = () => {
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
        background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)', 
        position: 'relative',
        overflow: 'hidden',
        opacity: isFadingOut ? 0 : 1,
        transform: isFadingOut ? 'scale(1.05)' : 'scale(1)', 
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <Box sx={{ position: 'absolute', top: { xs: 24, md: 40 }, px: { xs: 3, md: 6 }, width: '100%', display: 'flex', justifyContent: 'flex-end', zIndex: 50 }}>
  <Button 
  onClick={toggleLanguage}
  startIcon={<Globe size={20} />}
  sx={{ 
    backgroundColor: 'rgba(255, 255, 255, 0.7)', 
    backdropFilter: 'blur(16px)',
    borderRadius: '16px',
    px: 3, py: 1.2,
    color: '#1e293b',
    fontSize: '1rem',
    fontWeight: 'bold',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    textTransform: 'none',
    transition: 'all 0.3s ease',
    '&:hover': { backgroundColor: '#ffffff', transform: 'translateY(-2px)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' },
    
    '& .MuiButton-startIcon': {
      margin: '0 !important', 
      marginInlineEnd: '8px !important', 
    }
  }}
>
  {locale === 'ar' ? 'English' : 'عربي'}
</Button>
      </Box>

      <Box sx={{ position: 'absolute', top: '-15%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(219,234,254,0.8) 0%, rgba(255,255,255,0) 70%)', zIndex: 0 }} />
      <Box sx={{ position: 'absolute', bottom: '-15%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(209,250,229,0.6) 0%, rgba(255,255,255,0) 70%)', zIndex: 0 }} />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 10 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          
          <Box sx={{ 
            width: 140, height: 140, bgcolor: 'white', borderRadius: '35px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 5,
            boxShadow: '0 25px 50px -12px rgba(37, 99, 235, 0.15)', border: '1px solid rgba(255,255,255,0.8)',
            position: 'relative',
            opacity: 0, animation: `${fadeInUp} 0.8s ease-out forwards`, animationDelay: '0.1s'
          }}>
            <Box sx={{ position: 'absolute', inset: -4, borderRadius: '40px', background: 'transparent', animation: `${softRipple} 3s cubic-bezier(0.4, 0, 0.6, 1) infinite` }} />
            <Activity size={72} color="#2563eb" strokeWidth={2.5} style={{ position: 'relative', zIndex: 10 }} />
          </Box>

          <Typography 
            variant="h2" component="h1" fontWeight="900" color="#0f172a" 
            sx={{ 
              mb: 2, fontSize: { xs: '2.8rem', md: '4rem' }, letterSpacing: '-1.5px', lineHeight: 1.2,
              opacity: 0, animation: `${fadeInUp} 0.8s ease-out forwards`, animationDelay: '0.3s'
            }}
          >
            {t('title')}
          </Typography>
          
          <Typography 
            variant="h6" fontWeight="600" color="#64748b" 
            sx={{ 
              mb: 7, fontSize: { xs: '1.2rem', md: '1.4rem' }, maxWidth: '80%', mx: 'auto', lineHeight: 1.6,
              opacity: 0, animation: `${fadeInUp} 0.8s ease-out forwards`, animationDelay: '0.5s'
            }}
          >
            {t('subtitle')}
          </Typography>

 <Button
  variant="contained"
  onClick={handleStart}
  endIcon={locale === 'ar' ? <ArrowLeft size={24} /> : <ArrowRight size={24} />}
  sx={{
    px: { xs: 5, md: 8 }, py: 2.5, borderRadius: '50px',
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    color: 'white',
    fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'none',
    boxShadow: '0 15px 30px -5px rgba(37, 99, 235, 0.4)',
    transition: 'all 0.3s ease',
    opacity: 0, animation: `${fadeInUp} 0.8s ease-out forwards`, animationDelay: '0.7s',
    '&:hover': {
      background: 'linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)',
      transform: 'translateY(-3px)',
      boxShadow: '0 20px 40px -5px rgba(37, 99, 235, 0.5)',
    },


    '& .MuiButton-endIcon': {
      margin: '0 !important',
      marginInlineStart: '12px !important',
    }
  }}
>
  {t('startBtn')}
</Button>
        </Box>
      </Container>
    </Box>
  );
}