// RegisterPage.js
"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Stack, TextField, InputAdornment, IconButton, Paper, CircularProgress } from '@mui/material';
import { ChevronLeft, User, Phone, Fingerprint, Lock } from 'lucide-react';
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

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations('Auth');
  
  const { accessibilityMode } = useApp();
  const { speak, stop } = useVoiceAssistant();

  const isVis = accessibilityMode === 'visual' || accessibilityMode === 'audio_guided';
  const [step, setStep] = useState(1); 

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '', 
    national_number: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (accessibilityMode === 'audio_guided') {
      if (step === 1) speak(t('voicePromptRegister'));
      if (step === 2) speak(t('voicePromptOtp'));
    }
    return () => stop();
  }, [step, accessibilityMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone' || name === 'national_number') {
      const numericValue = value.replace(/\D/g, ''); 
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleProceedToOtp = () => {
    const { firstName, lastName, phone, national_number, password, confirmPassword } = formData;
    
    if (!firstName || !lastName || !phone || !national_number || !password) {
      setError(t('fillAllFieldsError'));
      return;
    }

    const nationalIdRegex = /^\d+$/; 
    if (!nationalIdRegex.test(national_number) || national_number.length < 10) {
      setError(t('invalidNationalIdError') || 'يرجى إدخال رقم وطني صحيح (أرقام فقط)');
      return;
    }

    if (password.length < 6) {
      setError(t('shortPasswordError'));
      return;
    }
    
    const passwordMixRegex = /^(?=.*[a-zA-Z])(?=.*\d)/;
    if (!passwordMixRegex.test(password)) {
      setError(t('weakPasswordError') || 'كلمة المرور يجب أن تحتوي على أحرف وأرقام معاً');
      return;
    }

    if (password !== confirmPassword) {
      setError(t('passwordMismatchError'));
      return;
    }

    setError('');
    setStep(2);
  };

 const handleRegister = async (otpValue) => {
    if (otpValue.length < 4) {
      setError(t('incompleteOtpError'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`;
      const payload = {
        name: fullName, 
        phone: formData.phone, 
        national_number: formData.national_number,
        password: formData.password 
      };

      const response = await AuthAPI.register(payload);
      localStorage.setItem('auth_token', response.accessToken);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || t('registerError'));
    } finally {
      setLoading(false);
    }
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '20px', backgroundColor: '#f8fafc', fontSize: isVis ? '1.2rem' : '1rem',
      height: isVis ? '70px' : '56px',
      '& fieldset': { borderColor: '#e2e8f0', borderWidth: '2px' },
      '&.Mui-focused fieldset': { borderColor: '#2563eb' },
    }
  };

  const labelStyles = {
    fontWeight: 'bold', 
    color: '#475569', 
    mx: 1, 
    fontSize: isVis ? '1.1rem' : '0.95rem'
  };

  const maskedPhone = formData.phone 
    ? `${formData.phone.substring(0, 3)}***${formData.phone.substring(formData.phone.length - 4)}` 
    : '79***';

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
              <Button fullWidth onClick={() => router.push('/login')} sx={{ borderRadius: '16px', fontWeight: 'bold', color: '#64748b' }}>
                {t('loginTab')}
              </Button>
              <Button fullWidth sx={{ borderRadius: '16px', fontWeight: 'bold', bgcolor: 'white', color: '#2563eb' }}>
                {t('registerTab')}
              </Button>
            </Paper>

            <Box textAlign="center" mb={15}>
              <Typography variant="h4" fontWeight="900" sx={{ mb: 1, fontSize: isVis ? '2.5rem' : '2rem' }}>{t('registerTitle')}</Typography>
              <Typography variant="body1" color="#64748b">{t('registerDesc')}</Typography>
            </Box>

            <Stack spacing={isVis ? 4 : 3} style={{ marginTop: isVis ? '32px' : '24px' }}>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography component="label" htmlFor="firstName" sx={labelStyles}>{t('firstNameLabel')}</Typography>
                  <TextField id="firstName" fullWidth placeholder={t('firstNamePlaceholder')} sx={textFieldStyles} name="firstName" value={formData.firstName} onChange={handleInputChange} 
                    InputProps={{ startAdornment: <InputAdornment position="start"><User size={isVis ? 24 : 18} /></InputAdornment> }} />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography component="label" htmlFor="lastName" sx={labelStyles}>{t('lastNameLabel')}</Typography>
                  <TextField id="lastName" fullWidth placeholder={t('lastNamePlaceholder')} sx={textFieldStyles} name="lastName" value={formData.lastName} onChange={handleInputChange} />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography component="label" htmlFor="phone" sx={labelStyles}>{t('phoneLabel')}</Typography>
                <TextField id="phone" fullWidth type="tel" inputMode="numeric" placeholder={t('phonePlaceholder')} sx={textFieldStyles} name="phone" value={formData.phone} onChange={handleInputChange}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Phone size={isVis ? 24 : 18} /></InputAdornment> }} />
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography component="label" htmlFor="national_number" sx={labelStyles}>{t('nationalIdLabel')}</Typography>
                <TextField id="national_number" fullWidth type="text" inputMode="numeric" placeholder={t('nationalIdPlaceholder')} sx={textFieldStyles} name="national_number" value={formData.national_number} onChange={handleInputChange}
                  inputProps={{ style: { letterSpacing: '4px' }, maxLength: 10 }} 
                  InputProps={{ startAdornment: <InputAdornment position="start"><Fingerprint size={isVis ? 24 : 18} /></InputAdornment> }} />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography component="label" htmlFor="password" sx={labelStyles}>{t('passwordLabel')}</Typography>
                <TextField id="password" fullWidth type="password" placeholder={t('passwordPlaceholder')} sx={textFieldStyles} name="password" value={formData.password} onChange={handleInputChange}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Lock size={isVis ? 24 : 18} /></InputAdornment> }} />
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography component="label" htmlFor="confirmPassword" sx={labelStyles}>{t('confirmPasswordLabel')}</Typography>
                <TextField id="confirmPassword" fullWidth type="password" placeholder={t('confirmPasswordPlaceholder')} sx={textFieldStyles} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Lock size={isVis ? 24 : 18} /></InputAdornment> }} />
              </Box>

              {error && <Typography color="error" textAlign="center" sx={{ fontWeight: 'bold' }}>{error}</Typography>}

              <Button 
                variant="contained" 
                onClick={handleProceedToOtp} 
                disabled={loading}
                sx={{ mt: 2, py: 2, borderRadius: '20px', bgcolor: '#2563eb', fontWeight: 'bold', fontSize: '1.1rem' }}
              >
                {t('registerBtn')}
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
            onVerify={handleRegister}
            onBack={() => setStep(1)}
          />
        )}
      </Container>
    </Box>
  );
}