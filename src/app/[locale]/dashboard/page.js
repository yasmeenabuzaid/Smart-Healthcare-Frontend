// src/app/[locale]/dashboard/page.js
"use client";

import { useState } from 'react';
import { Box, Typography, Button, Container, Grid, Paper, IconButton, Avatar, Stack, Chip, BottomNavigation, BottomNavigationAction   } from '@mui/material';
import { Bell, Clock, Users, CalendarDays, Mic, Ticket, Download, Languages, Settings, Star, Activity, LayoutGrid, Home, FileText, User, ChevronRight ,ShieldCheck } from 'lucide-react'; 
import { keyframes } from '@mui/system';
import { useRouter } from '@/navigation'; 
import { useApp } from '@/context/AppContext'; 
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { usePageVoice } from '@/hooks/usePageVoice';

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export default function DashboardPage() {
  const router = useRouter();
  const { accessibilityMode } = useApp();
  const { speak } = useVoiceAssistant();
  const [navValue, setNavValue] = useState(0);

  usePageVoice("مرحباً بك في ملفك الطبي الموحد. يمكنك متابعة أدوارك النشطة أو حجز خدمات جديدة.");

  const [activeQueues] = useState([
    { id: 1, hospital: 'مستشفى البشير', station: 'عيادة الباطنية', ticket: 'A-14', peopleAhead: 3, time: '12 دقيقة', color: '#6571ff' },
    { id: 2, hospital: 'مستشفى الأمير حمزة', station: 'المختبر', ticket: 'L-08', peopleAhead: 1, time: '4 دقائق', color: '#10b981' }
  ]);

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#fbfcfe', pb: 12, pt: { xs: 2, md: 4 } }}>
      <Container maxWidth="sm" sx={{ animation: `${slideUp} 0.5s ease-out` }}>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: '#6571ff', width: 48, height: 48, fontWeight: '900', boxShadow: '0 4px 12px rgba(101, 113, 255, 0.3)' }}>أ</Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="900" sx={{ lineHeight: 1.2 }}>أحمد محمد</Typography>
              <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <ShieldCheck size={14} color="#10b981" /> ملفك الطبي الموحد
              </Typography>
            </Box>
          </Box>
          <Stack direction="row" spacing={1}>
            <IconButton sx={{ bgcolor: 'white', border: '1px solid #f1f5f9', borderRadius: '12px' }}><Languages size={20} color="#64748b" /></IconButton>
            <IconButton sx={{ bgcolor: 'white', border: '1px solid #f1f5f9', borderRadius: '12px' }}><Settings size={20} color="#64748b" /></IconButton>
          </Stack>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 0.5 }}>
            <Typography variant="subtitle1" fontWeight="900" color="#1e293b">التتبع الحي للأدوار</Typography>
            <Chip label="مباشر" size="small" sx={{ bgcolor: '#fee2e2', color: '#ef4444', fontWeight: 'bold', fontSize: '0.65rem' }} />
          </Box>

          <Paper sx={{ 
            background: 'linear-gradient(135deg, #6571ff 0%, #484ef0 100%)', 
            borderRadius: '32px', p: 3, color: 'white', position: 'relative', overflow: 'hidden',
            boxShadow: '0 20px 40px -10px rgba(101, 113, 255, 0.4)'
          }}>
            <Box sx={{ position: 'absolute', top: -20, right: -20, width: 140, height: 140, bgcolor: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
            
            <Stack spacing={2} sx={{ position: 'relative', zIndex: 10 }}>
              {activeQueues.map((queue) => (
                <Box key={queue.id} sx={{ bgcolor: 'rgba(255,255,255,0.12)', p: 2, borderRadius: '24px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box>
                      <Typography variant="caption" sx={{ display: 'block', opacity: 0.8, fontSize: '0.7rem' }}>{queue.hospital}</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>{queue.station}</Typography>
                    </Box>
                    <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}><Download size={14} /></IconButton>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Typography variant="h4" fontWeight="900">{queue.ticket}</Typography>
                    <Stack direction="row" spacing={2}>
                      <Box textAlign="center">
                        <Typography variant="caption" sx={{ display: 'block', opacity: 0.8 }}>أمامك</Typography>
                        <Typography fontWeight="bold">{queue.peopleAhead}</Typography>
                      </Box>
                      <Box textAlign="center">
                        <Typography variant="caption" sx={{ display: 'block', opacity: 0.8 }}>الوقت</Typography>
                        <Typography fontWeight="bold">{queue.time}</Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Box>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={6}>
            <Paper component={Button} fullWidth onClick={() => router.push('/hospital-selection?action=turn')} sx={{ p: 3, borderRadius: '28px', display: 'flex', flexDirection: 'column', gap: 1, textTransform: 'none', border: '2px solid #eff2ff', bgcolor: 'white', boxShadow: 'none' }}>
              <Box sx={{ bgcolor: '#eff2ff', p: 1.5, borderRadius: '16px' }}><Ticket size={28} color="#6571ff" /></Box>
              <Typography fontWeight="900" color="text.primary">دور جديد</Typography>
              <Typography variant="caption" color="text.secondary">للعيادات اليومية</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper component={Button} fullWidth onClick={() => router.push('/hospital-selection?action=book')} sx={{ p: 3, borderRadius: '28px', display: 'flex', flexDirection: 'column', gap: 1, textTransform: 'none', border: '2px solid #f0fdf4', bgcolor: 'white', boxShadow: 'none' }}>
              <Box sx={{ bgcolor: '#f0fdf4', p: 1.5, borderRadius: '16px' }}><CalendarDays size={28} color="#10b981" /></Box>
              <Typography fontWeight="900" color="text.primary">موعد جديد</Typography>
              <Typography variant="caption" color="text.secondary">حجز مستقبلي</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Stack spacing={2}>
          <Paper component={Button} fullWidth onClick={() => speak("كيف يمكنني مساعدتك؟")} sx={{ p: 2, borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 2, textTransform: 'none', background: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)', border: '1px solid #ffedd5', boxShadow: 'none' }}>
            <Box sx={{ bgcolor: '#ffedd5', p: 1, borderRadius: '14px' }}><Mic size={24} color="#ea580c" /></Box>
            <Box textAlign="start">
              <Typography fontWeight="bold" color="#c2410c">المساعد الصوتي الذكي</Typography>
              <Typography variant="caption" color="#ea580c">دعم كبار السن والأميين</Typography>
            </Box>
          </Paper>

          <Paper component={Button} fullWidth onClick={() => router.push('/feedback')} sx={{ p: 2, borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textTransform: 'none', bgcolor: 'white', border: '1px solid #f1f5f9', boxShadow: 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ bgcolor: '#fff1f2', p: 1, borderRadius: '14px' }}><Star size={24} color="#e11d48" /></Box>
              <Box textAlign="start">
                <Typography fontWeight="bold" color="#9f1239">نظام التقييم السري</Typography>
                <Typography variant="caption" color="text.secondary">رأيك يصل للإدارة بخصوصية</Typography>
              </Box>
            </Box>
            <ChevronRight size={20} color="#cbd5e1" />
          </Paper>
        </Stack>

      </Container>

      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, borderRadius: '32px 32px 0 0', overflow: 'hidden', boxShadow: '0 -10px 40px rgba(0,0,0,0.05)', zIndex: 1000 }}>
        <BottomNavigation showLabels value={navValue} onChange={(event, newValue) => setNavValue(newValue)} sx={{ height: 80, '& .Mui-selected': { color: '#6571ff !important' } }}>
          <BottomNavigationAction label="الرئيسية" icon={<Home size={22} />} />
          <BottomNavigationAction label="مواعيدي" icon={<CalendarDays size={22} />} />
          <BottomNavigationAction label="ملفي" icon={<FileText size={22} />} />
          <BottomNavigationAction label="حسابي" icon={<User size={22} />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}