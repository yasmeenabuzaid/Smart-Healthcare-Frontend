// LoginPage.js
"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Stack, TextField, InputAdornment, IconButton, Paper, CircularProgress } from '@mui/material';
import { ChevronLeft, Fingerprint, Lock } from 'lucide-react';
import { keyframes } from '@mui/system';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/navigation'; 
import { useApp } from '@/context/AppContext'; 
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant'; 
import { AuthAPI } from '@/services/backendConnector'; 
import OtpVerification from '../OTPVerification'; 

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations('Auth');
  
  const { accessibilityMode } = useApp();
  const { speak, stop } = useVoiceAssistant();

  const isVis = accessibilityMode === 'visual' || accessibilityMode === 'audio_guided';
  const [step, setStep] = useState(1);
  const [nationalId, setNationalId] = useState('');
  const [password, setPassword] = useState('');
  const [maskedPhone, setMaskedPhone] = useState('79***');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (accessibilityMode === 'audio_guided') {
      if (step === 1) speak(t('voicePromptLogin'));
      if (step === 2) speak(t('voicePromptOtp'));
    }
    return () => stop();
  }, [step, accessibilityMode]);

  const handleRequestLogin = async () => {
    if (!nationalId || nationalId.length < 10) {
      setError(t('invalidNationalIdError')); 
      return;
    }
    if (!password || password.length < 6) {
      setError(t('invalidPasswordError'));
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await AuthAPI.requestLogin(nationalId); 
      
      setMaskedPhone(response.masked_phone || '79***');
      setStep(2); 
    } catch (err) {
      setError(err.message || t('unregisteredIdError'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otpValue) => {
    if (otpValue.length < 4) {
      setError(t('incompleteOtpError'));
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await AuthAPI.verifyLogin(nationalId, password); 
      
      localStorage.setItem('auth_token', response.accessToken);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || t('wrongPasswordError'));
    } finally {
      setLoading(false);
    }
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '20px', 
      backgroundColor: '#f8fafc', 
      fontSize: isVis ? '1.5rem' : '1.1rem',
      height: isVis ? '80px' : '64px',
      '& fieldset': { borderColor: '#e2e8f0', borderWidth: '2px' },
      '&.Mui-focused fieldset': { borderColor: '#2563eb' },
    }
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'white', pb: 6 }}>
      
      <IconButton 
        onClick={() => step === 2 ? setStep(1) : router.back()}
        sx={{ position: 'absolute', top: 24, left: 24, bgcolor: '#f8fafc', zIndex: 10 }}
      >
        <ChevronLeft size={isVis ? 32 : 24} color="#475569" />
      </IconButton>

      <Container maxWidth="sm" sx={{ pt: 12, px: { xs: 3, md: 4 }, animation: `${fadeIn} 0.5s ease-out` }}>
        
        {step === 1 ? (
          <Box>
            <Paper elevation={0} sx={{ display: 'flex', bgcolor: '#f1f5f9', p: 1, borderRadius: '20px', mb: 5 }}>
              <Button fullWidth sx={{ borderRadius: '16px', fontWeight: 'bold', bgcolor: 'white', color: '#2563eb' }}>
                {t('loginTab')}
              </Button>
              <Button fullWidth onClick={() => router.push('/register')} sx={{ borderRadius: '16px', fontWeight: 'bold', color: '#64748b' }}>
                {t('registerTab')}
              </Button>
            </Paper>

            <Box textAlign="center" mb={5}>
              <Typography variant="h4" fontWeight="900" sx={{ mb: 1, fontSize: isVis ? '2.5rem' : '2rem' }}>{t('loginTitle')}</Typography>
              <Typography variant="body1" color="#64748b">{t('loginDesc')}</Typography>
            </Box>

            <Stack spacing={3} style={{ marginTop: isVis ? '32px' : '24px' }}>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography 
                  component="label" 
                  htmlFor="nationalId" 
                  sx={{ fontWeight: 'bold', color: '#475569', mx: 1, fontSize: isVis ? '1.2rem' : '0.95rem' }}
                >
                  {t('nationalIdLabel')}
                </Typography>
                <TextField 
                  id="nationalId"
                  fullWidth 
                  type="text" 
                  inputMode="numeric"
                  placeholder={t('nationalIdPlaceholder')} 
                  sx={textFieldStyles}
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  inputProps={{ style: { letterSpacing: '4px' } }}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Fingerprint size={isVis ? 28 : 20} /></InputAdornment> }}
                />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography 
                  component="label" 
                  htmlFor="password" 
                  sx={{ fontWeight: 'bold', color: '#475569', mx: 1, fontSize: isVis ? '1.2rem' : '0.95rem' }}
                >
                  {t('passwordLabel')}
                </Typography>
                <TextField 
                  id="password"
                  fullWidth 
                  type="password" 
                  placeholder={t('passwordPlaceholder')} 
                  sx={textFieldStyles}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Lock size={isVis ? 28 : 20} /></InputAdornment> }}
                />
              </Box>

              {error && <Typography color="error" textAlign="center" sx={{ fontWeight: 'bold' }}>{error}</Typography>}

              <Button 
                variant="contained" 
                onClick={handleRequestLogin} 
                disabled={loading}
                sx={{ mt: 2, py: 2, borderRadius: '20px', bgcolor: '#2563eb', fontWeight: 'bold', fontSize: '1.1rem' }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : t('loginBtn')}
              </Button>
            </Stack>
          </Box>
        ) : (
          <OtpVerification 
            isVis={isVis}
            t={t}
            maskedPhone={maskedPhone}
            loading={loading}
            error={error}
            onVerify={handleVerifyOtp}
            onBack={() => setStep(1)}
          />
        )}
      </Container>
    </Box>
  );
}