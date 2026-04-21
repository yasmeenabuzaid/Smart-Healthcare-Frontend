"use client";

import { useRef } from 'react';
import { Box, Typography, Button, Stack, TextField, CircularProgress } from '@mui/material';
import { Smartphone } from 'lucide-react';

export default function OtpVerification({ 
  isVis, 
  t, 
  maskedPhone, 
  loading, 
  error, 
  onVerify, 
  onBack 
}) {
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleOtpChange = (index, value) => {
    const val = value.replace(/\D/g, '').slice(-1); 
    
    if (val !== '') {
      otpRefs[index].current.value = val; 
      if (index < 3) {
        otpRefs[index + 1].current.focus(); 
      }
    } else {
      otpRefs[index].current.value = '';
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, 4);
    
    if (pastedData) {
      const digits = pastedData.split('');
      digits.forEach((digit, idx) => {
        if (otpRefs[idx]?.current) {
          otpRefs[idx].current.value = digit;
        }
      });
      
      const nextFocusIndex = Math.min(digits.length, 3);
      otpRefs[nextFocusIndex].current.focus();
    }
  };

  const handleSubmit = () => {
    const otpValue = otpRefs.map(ref => ref.current?.value || '').join('');
    onVerify(otpValue);
  };

  return (
    <Box 
      textAlign="center" 
      sx={{ 
        mt: { xs: 1, sm: 4 }, 
        px: { xs: 2, sm: 4 }, 
        maxWidth: '400px', 
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Box sx={{ 
        width: { xs: 64, sm: isVis ? 120 : 80 }, 
        height: { xs: 64, sm: isVis ? 120 : 80 }, 
        bgcolor: '#eff6ff', 
        borderRadius: '50%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        mx: 'auto', 
        mb: { xs: 2.5, sm: 4 },
        boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.1)' 
      }}>
        <Smartphone size={isVis ? 56 : 32} color="#2563eb" />
      </Box>

      <Typography 
        variant="h4" 
        fontWeight="900" 
        color="#1e293b" 
        sx={{ mb: 1, fontSize: { xs: '1.5rem', sm: isVis ? '2.5rem' : '2rem' } }}
      >
        {t('otpTitle')}
      </Typography>
      
      <Typography 
        variant="body1" 
        color="#64748b" 
        sx={{ mb: { xs: 3, sm: 5 }, fontSize: { xs: '0.9rem', sm: isVis ? '1.25rem' : '1rem' }, px: 1 }}
      >
        {t('otpDesc')} <strong style={{ color: '#1e293b', direction: 'ltr', display: 'inline-block' }}>{maskedPhone}</strong>
      </Typography>

      <Stack 
        direction="row" 
        spacing={{ xs: 1, sm: 2 }} 
        justifyContent="center" 
        mb={4} 
        dir="ltr"
        sx={{ width: '100%' }}
      >
        {[0, 1, 2, 3].map((index) => (
          <TextField 
            key={index} 
            inputRef={otpRefs[index]} 
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            autoFocus={index === 0} 
            type="text" 
            inputProps={{ 
              inputMode: 'numeric', 
              pattern: '[0-9]*', 
              maxLength: 1, 
              style: { 
                textAlign: 'center', 
                fontSize: isVis ? '2rem' : '1.5rem', 
                fontWeight: 'bold', 
                color: '#2563eb',
                padding: '0' 
              } 
            }} 
            sx={{ 
              width: { xs: '50px', sm: isVis ? '80px' : '64px' }, 
              '& .MuiOutlinedInput-root': { 
                height: { xs: '56px', sm: isVis ? '100px' : '80px' }, 
                borderRadius: { xs: '12px', sm: '20px' }, 
                bgcolor: '#f8fafc', 
                transition: 'all 0.2s ease',
                '& fieldset': { borderWidth: '2px', borderColor: '#e2e8f0' }, 
                '&:hover fieldset': { borderColor: '#93c5fd' }, 
                '&.Mui-focused fieldset': { borderColor: '#2563eb', borderWidth: '2px' },
                '&.Mui-focused': { bgcolor: '#fff', boxShadow: '0 4px 12px rgba(37,99,235,0.1)' }
              } 
            }} 
          />
        ))}
      </Stack>

      {error && (
        <Typography color="error" textAlign="center" mb={2} sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
          {error}
        </Typography>
      )}

      <Button 
        fullWidth 
        variant="contained" 
        onClick={handleSubmit} 
        disabled={loading}
        sx={{ 
          py: { xs: 2, sm: isVis ? 2.5 : 2 }, 
          borderRadius: { xs: '16px', sm: '20px' }, 
          bgcolor: '#2563eb', 
          fontSize: { xs: '1.1rem', sm: isVis ? '1.5rem' : '1.1rem' }, 
          fontWeight: 'bold', 
          boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.4)', 
          mb: 2, 
          textTransform: 'none',
          '&:hover': { bgcolor: '#1d4ed8' },
          '&:active': { transform: 'scale(0.98)' } 
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : t('confirmBtn')}
      </Button>
      
      <Button 
        onClick={onBack} 
        sx={{ 
          color: '#64748b', 
          fontWeight: 'bold',
          textTransform: 'none',
          fontSize: { xs: '0.95rem', sm: '1rem' },
          minHeight: '44px' 
        }}
      >
        {t('backToLogin') || 'العودة لتسجيل الدخول'}
      </Button>
    </Box>
  );
}