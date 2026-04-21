"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Stack, IconButton, TextField, Paper, Snackbar, Alert, CircularProgress } from '@mui/material';
import { ChevronLeft, MessageSquareWarning, Lightbulb, UserRound, Building2, Smartphone, Send, Paperclip } from 'lucide-react';
import { keyframes } from '@mui/system';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/navigation'; 
import { useApp } from '@/context/AppContext'; 
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { BackendConnector } from '@/services/backendConnector'; 

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

export default function FeedbackPage() {
  const router = useRouter();
  const t = useTranslations('Feedback');
  
  const { accessibilityMode } = useApp();
  const { speak, stop } = useVoiceAssistant();
  const isVis = accessibilityMode === 'visual' || accessibilityMode === 'audio_guided';

  const [type, setType] = useState('complaint'); 
  const [target, setTarget] = useState(null);
  const [details, setDetails] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (accessibilityMode === 'audio_guided') {
      speak(t('voicePromptIntro') || "صفحة الشكاوى والاقتراحات. يرجى التحديد.");
    }
    return () => stop();
  }, [accessibilityMode]);

  const handleSubmit = async () => {
    setLoading(true);

    let scope = 'hospital';
    if (target === 'app') scope = 'system';
    if (target === 'dept') scope = 'department';

    const targetLabel = targets.find(t => t.id === target)?.label || '';
    const finalMessage = `بخصوص: ${targetLabel}\n\n${details}`;

    const payload = {
      type: type,
      scope: scope, 
      message: finalMessage
    };

    try {
      await BackendConnector.submitFeedback(payload);
      
      if (accessibilityMode === 'audio_guided') speak(t('successMessage') || "تم الإرسال بنجاح");
      
      setToast({ open: true, message: 'تم إرسال طلبك بنجاح، شكراً لتواصلك معنا!', severity: 'success' });
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (err) {
      setToast({ open: true, message: 'حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقاً.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') return;
    setToast({ ...toast, open: false });
  };

  const targets = [
    { id: 'doctor', label: t('targetDoctor') || 'طبيب', icon: UserRound },
    { id: 'employee', label: t('targetEmployee') || 'موظف', icon: UserRound },
    { id: 'dept', label: t('targetDept') || 'قسم/عيادة', icon: Building2 },
    { id: 'app', label: t('targetApp') || 'التطبيق/النظام', icon: Smartphone },
  ];

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc', position: 'relative', pb: 12 }}>
      
      <Snackbar 
        open={toast.open} 
        autoHideDuration={3000} 
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity} variant="filled" sx={{ width: '100%', borderRadius: '16px', fontSize: '1.1rem', fontWeight: 'bold' }}>
          {toast.message}
        </Alert>
      </Snackbar>

      <Box sx={{ bgcolor: 'white', px: { xs: 2, md: 4 }, py: 2, display: 'flex', alignItems: 'center', gap: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.03)', zIndex: 10 }}>
        <IconButton onClick={() => router.back()} sx={{ bgcolor: '#f1f5f9', p: isVis ? 2 : 1.5 }}>
          <ChevronLeft size={isVis ? 32 : 24} color="#475569" />
        </IconButton>
        <Typography variant="h6" fontWeight="900" color="#1e293b" sx={{ fontSize: isVis ? '2rem' : '1.25rem' }}>
          {t('title') || "الشكاوى والاقتراحات"}
        </Typography>
      </Box>

      <Container maxWidth="sm" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', pt: 4, px: { xs: 3, md: 0 }, animation: `${fadeIn} 0.5s ease-out` }}>
        
        <Typography color="#64748b" fontWeight="bold" sx={{ mb: 2, fontSize: isVis ? '1.2rem' : '0.9rem' }}>{t('typeLabel') || "نوع الطلب"}</Typography>
        <Stack direction="row" spacing={2} mb={4}>
          <Paper
            component={Button}
            onClick={() => { setType('complaint'); stop(); }}
            sx={{
              flex: 1, p: isVis ? 3 : 2, borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
              textTransform: 'none', border: '2px solid',
              borderColor: type === 'complaint' ? '#ef4444' : '#e2e8f0',
              bgcolor: type === 'complaint' ? '#fef2f2' : 'white',
              color: type === 'complaint' ? '#b91c1c' : '#64748b',
              transition: 'all 0.2s', '&:hover': { borderColor: '#ef4444' }
            }}
          >
            <MessageSquareWarning size={isVis ? 40 : 28} color={type === 'complaint' ? '#ef4444' : '#94a3b8'} />
            <Typography fontWeight="bold" sx={{ fontSize: isVis ? '1.5rem' : '1rem' }}>{t('complaint') || "شكوى"}</Typography>
          </Paper>

          <Paper
            component={Button}
            onClick={() => { setType('suggestion'); stop(); }}
            sx={{
              flex: 1, p: isVis ? 3 : 2, borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
              textTransform: 'none', border: '2px solid',
              borderColor: type === 'suggestion' ? '#10b981' : '#e2e8f0',
              bgcolor: type === 'suggestion' ? '#ecfdf5' : 'white',
              color: type === 'suggestion' ? '#047857' : '#64748b',
              transition: 'all 0.2s', '&:hover': { borderColor: '#10b981' }
            }}
          >
            <Lightbulb size={isVis ? 40 : 28} color={type === 'suggestion' ? '#10b981' : '#94a3b8'} />
            <Typography fontWeight="bold" sx={{ fontSize: isVis ? '1.5rem' : '1rem' }}>{t('suggestion') || "اقتراح"}</Typography>
          </Paper>
        </Stack>

        <Typography color="#64748b" fontWeight="bold" sx={{ mb: 2, fontSize: isVis ? '1.2rem' : '0.9rem' }}>{t('targetLabel') || "بخصوص ماذا؟"}</Typography>
        <Stack direction="row" flexWrap="wrap" gap={isVis ? 3 : 1.5} mb={4}>
          {targets.map((item) => {
            const Icon = item.icon;
            const isSelected = target === item.id;
            return (
              <Button
                key={item.id}
                variant={isSelected ? "contained" : "outlined"}
                onClick={() => { setTarget(item.id); stop(); }}
                startIcon={<Icon size={isVis ? 24 : 18} />}
                sx={{
                  flex: '1 1 calc(50% - 12px)', py: isVis ? 2 : 1.5, borderRadius: '16px', fontWeight: 'bold',
                  fontSize: isVis ? '1.2rem' : '0.9rem',
                  borderColor: isSelected ? '#2563eb' : '#cbd5e1',
                  bgcolor: isSelected ? '#2563eb' : 'transparent',
                  color: isSelected ? 'white' : '#475569',
                  borderWidth: '2px', '&:hover': { borderWidth: '2px', borderColor: '#2563eb', bgcolor: isSelected ? '#1d4ed8' : '#eff6ff' }
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Stack>

        <Typography color="#64748b" fontWeight="bold" sx={{ mb: 2, fontSize: isVis ? '1.2rem' : '0.9rem' }}>{t('detailsLabel') || "التفاصيل"}</Typography>
        <TextField
          fullWidth
          multiline
          rows={isVis ? 6 : 4}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder={t('detailsPlaceholder') || "اكتب هنا..."}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px', bgcolor: 'white', fontSize: isVis ? '1.5rem' : '1.1rem',
              '& fieldset': { borderColor: '#e2e8f0', borderWidth: '2px' },
              '&:hover fieldset': { borderColor: '#cbd5e1' },
              '&.Mui-focused fieldset': { borderColor: '#2563eb' },
            }
          }}
        />

        <Button 
          variant="text" 
          startIcon={<Paperclip size={isVis ? 24 : 20} />}
          sx={{ 
            alignSelf: 'flex-start', mb: 6, color: '#64748b', fontWeight: 'bold', fontSize: isVis ? '1.2rem' : '1rem',
            bgcolor: '#f1f5f9', borderRadius: '16px', px: 3, py: 1.5, '&:hover': { bgcolor: '#e2e8f0' }
          }}
        >
          {t('attachBtn') || "إرفاق صورة"}
        </Button>

        <Button 
          variant="contained" 
          disabled={!target || details.trim().length === 0 || loading}
          onClick={handleSubmit}
          endIcon={!loading && <Send size={isVis ? 28 : 20} style={{ transform: 'rotate(180deg)' }} />} 
          sx={{ 
            py: isVis ? 2.5 : 2, borderRadius: '20px', bgcolor: type === 'complaint' ? '#ef4444' : '#10b981', 
            fontSize: isVis ? '1.5rem' : '1.1rem', fontWeight: 'bold', width: '100%', mt: 'auto',
            boxShadow: (!target || details.trim().length === 0 || loading) ? 'none' : `0 10px 15px -3px ${type === 'complaint' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
            '&:hover': { bgcolor: type === 'complaint' ? '#dc2626' : '#059669' },
            '&.Mui-disabled': { bgcolor: '#e2e8f0', color: '#94a3b8' }
          }}
        >
          {loading ? <CircularProgress size={28} color="inherit" /> : (t('submitBtn') || "إرسال الطلب")}
        </Button>

      </Container>
    </Box>
  );
}