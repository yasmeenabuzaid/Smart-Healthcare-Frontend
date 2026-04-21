"use client";

import { useState, useEffect, forwardRef } from 'react';
import { Box, Typography, Button, Container, Stack, IconButton, Paper, CircularProgress, Grid, Dialog, DialogContent, Slide } from '@mui/material';
import { ChevronLeft, CalendarDays, Clock, CheckCircle2, AlertCircle, CalendarCheck, Ticket } from 'lucide-react';
import { keyframes } from '@mui/system';
import { useRouter } from '@/navigation'; 
import { useSearchParams } from 'next/navigation';
import { BackendConnector } from '@/services/backendConnector';

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const daysMap = {
  sat: 'السبت', sun: 'الأحد', mon: 'الإثنين', tue: 'الثلاثاء', wed: 'الأربعاء', thu: 'الخميس', fri: 'الجمعة'
};

export default function SchedulePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deptId = searchParams.get('dept');

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedDayObj, setSelectedDayObj] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [generatedSlots, setGeneratedSlots] = useState([]);
  
  const [isBooking, setIsBooking] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');

  useEffect(() => {
    if (!deptId) {
      setLoading(false);
      setError('عذراً، لم يتم تحديد العيادة بشكل صحيح. يرجى العودة للوراء.');
      return;
    }

    const fetchSchedule = async () => {
      try {
        const response = await BackendConnector.getDepartmentSchedule(deptId);
        setSchedules(response.data || []);
        
        if (response.data && response.data.length > 0) {
          handleDaySelect(response.data[0]);
        }
      } catch (err) {
        setError('تعذر جلب أوقات الدوام للعيادة.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSchedule();
  }, [deptId]);

  const handleDaySelect = (dayObj) => {
    setSelectedDayObj(dayObj);
    setSelectedTime(null);

    const startHour = parseInt(dayObj.start_time.split(':')[0]);
    const endHour = parseInt(dayObj.end_time.split(':')[0]);
    
    const slots = [];
    for (let i = startHour; i < endHour; i++) {
      slots.push(`${i}:00`);
      slots.push(`${i}:30`);
    }
    setGeneratedSlots(slots);
  };

  const handleConfirmBooking = () => {
    setIsBooking(true);
    
    setTimeout(() => {
      setIsBooking(false);
      
      const randomTicket = `B-${Math.floor(Math.random() * 90) + 10}`;
      setTicketNumber(randomTicket);
      
      setShowSuccessModal(true);
      
    }, 1500);
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#fbfcfe', pb: 6 }}>
      
      <Dialog
        open={showSuccessModal}
        TransitionComponent={Transition}
        keepMounted
        PaperProps={{
          sx: { 
            borderRadius: '32px', 
            textAlign: 'center', 
            width: 'calc(100% - 48px)', 
            maxWidth: '360px', 
            margin: 'auto', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)' 
          }
        }}
      >
        <DialogContent sx={{ px: 3, py: 3.5, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          <Box sx={{ width: 70, height: 70, bgcolor: '#d1fae5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, border: '4px solid #a7f3d0' }}>
            <CheckCircle2 size={36} color="#059669" />
          </Box>
          
          <Typography variant="h6" fontWeight="900" color="#065f46" sx={{ mb: 0.5, fontSize: '1.3rem' }}>
            تم تأكيد حجزك!
          </Typography>
          <Typography variant="caption" color="#64748b" sx={{ mb: 2.5, fontWeight: 'bold', fontSize: '0.85rem' }}>
            بانتظارك يوم {selectedDayObj && daysMap[selectedDayObj.day_of_week]} الساعة {selectedTime}.
          </Typography>

          <Paper elevation={0} sx={{ bgcolor: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '20px', p: 1.5, mb: 3 }}>
            <Typography variant="caption" color="#64748b" fontWeight="bold">رقم المراجعة الخاص بك</Typography>
            <Typography variant="h4" fontWeight="900" color="#10b981" sx={{ letterSpacing: '2px', mt: 0.5 }}>
              {ticketNumber}
            </Typography>
          </Paper>

          <Button 
            fullWidth 
            variant="contained" 
            onClick={() => router.push('/dashboard')}
            sx={{ py: 1.5, borderRadius: '16px', bgcolor: '#10b981', fontSize: '1.1rem', fontWeight: 'bold', boxShadow: 'none', '&:hover': { bgcolor: '#059669' } }}
          >
            العودة للرئيسية
          </Button>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <Box sx={{ bgcolor: 'white', px: { xs: 2, md: 4 }, py: 2, display: 'flex', alignItems: 'center', gap: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.03)', zIndex: 10 }}>
        <IconButton onClick={() => router.back()} sx={{ bgcolor: '#f8fafc', p: 1.5, borderRadius: '12px' }}>
          <ChevronLeft size={24} color="#334155" />
        </IconButton>
        <Box>
          <Typography variant="h6" fontWeight="900" color="#0f172a" sx={{ fontSize: '1.4rem', lineHeight: 1.2 }}>
            تحديد الموعد
          </Typography>
          <Typography variant="caption" fontWeight="bold" color="#64748b">
            الخطوة 2 من 2
          </Typography>
        </Box>
      </Box>

      <Container maxWidth="sm" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', pt: 4, px: 3, animation: `${slideUp} 0.5s ease-out` }}>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}><CircularProgress size={40} sx={{ color: '#10b981' }} /></Box>
        ) : error ? (
          <Paper sx={{ p: 3, bgcolor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '20px', display: 'flex', gap: 2 }}><AlertCircle color="#ef4444" size={28} /><Typography color="#b91c1c" fontWeight="bold">{error}</Typography></Paper>
        ) : schedules.length === 0 ? (
          <Box textAlign="center" my={6}>
            <CalendarCheck size={64} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
            <Typography variant="h6" color="#64748b" fontWeight="bold">لا يوجد أوقات دوام متاحة لهذه العيادة حالياً.</Typography>
          </Box>
        ) : (
          <>
            <Typography color="#334155" fontWeight="900" sx={{ mb: 2, fontSize: '1.2rem' }}>
              اختر اليوم المناسب:
            </Typography>
            <Stack direction="row" spacing={1.5} sx={{ overflowX: 'auto', pb: 2, mb: 4, '&::-webkit-scrollbar': { display: 'none' } }}>
              {schedules.map((schedule) => (
                <Paper
                  key={schedule.id}
                  onClick={() => handleDaySelect(schedule)}
                  elevation={0}
                  sx={{
                    minWidth: '100px', p: 2, borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer',
                    border: '2px solid',
                    borderColor: selectedDayObj?.id === schedule.id ? '#10b981' : '#f1f5f9',
                    bgcolor: selectedDayObj?.id === schedule.id ? '#ecfdf5' : 'white',
                    transition: 'all 0.2s', flexShrink: 0,
                  }}
                >
                  <CalendarDays size={24} color={selectedDayObj?.id === schedule.id ? '#059669' : '#94a3b8'} style={{ marginBottom: '8px' }} />
                  <Typography fontWeight="900" color={selectedDayObj?.id === schedule.id ? '#065f46' : '#334155'} sx={{ fontSize: '1.1rem' }}>
                    {daysMap[schedule.day_of_week]}
                  </Typography>
                  <Typography variant="caption" color={selectedDayObj?.id === schedule.id ? '#047857' : '#64748b'} fontWeight="bold">
                    متاح
                  </Typography>
                </Paper>
              ))}
            </Stack>

            {selectedDayObj && (
              <Box sx={{ animation: `${slideUp} 0.4s ease-out`, mb: 10 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography color="#334155" fontWeight="900" sx={{ fontSize: '1.2rem' }}>الساعات المتاحة:</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight="bold">صباحي / مسائي</Typography>
                </Box>
                
                <Grid container spacing={2}>
                  {generatedSlots.map((time, index) => (
                    <Grid item xs={4} key={index}>
                      <Paper
                        onClick={() => setSelectedTime(time)}
                        elevation={0}
                        sx={{
                          p: 1.5, borderRadius: '16px', textAlign: 'center', cursor: 'pointer',
                          border: '2px solid',
                          borderColor: selectedTime === time ? '#10b981' : '#f1f5f9',
                          bgcolor: selectedTime === time ? '#10b981' : 'white',
                          color: selectedTime === time ? 'white' : '#334155',
                          transition: 'all 0.2s',
                          '&:hover': { borderColor: '#10b981' }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          {selectedTime === time ? <CheckCircle2 size={16} color="white" /> : <Clock size={16} color="#94a3b8" />}
                          <Typography fontWeight="bold" sx={{ fontSize: '1.1rem' }}>{time}</Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            <Box sx={{ position: 'fixed', bottom: 80 , left: 0, right: 0, p: 3, bgcolor: 'linear-gradient(to top, white 80%, transparent)', zIndex: 100 }}>
              <Container maxWidth="sm" disableGutters>
                <Button 
                  variant="contained" 
                  disabled={!selectedTime || isBooking}
                  onClick={handleConfirmBooking}
                  sx={{ 
                    py: 2, borderRadius: '24px', width: '100%',
                    background: selectedTime ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#e2e8f0', 
                    color: selectedTime ? 'white' : '#94a3b8',
                    fontSize: '1.3rem', fontWeight: 'bold',
                    boxShadow: selectedTime ? '0 10px 25px -5px rgba(16, 185, 129, 0.4)' : 'none',
                  }}
                >
                  {isBooking ? <CircularProgress size={28} color="inherit" /> : 'تأكيد الحجز نهائياً'}
                </Button>
              </Container>
            </Box>

          </>
        )}
      </Container>
    </Box>
  );
}