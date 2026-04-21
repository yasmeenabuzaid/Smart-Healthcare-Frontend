"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Stack, IconButton, Paper, CircularProgress, InputBase, MenuItem, Select, FormControl } from '@mui/material';
import { ChevronLeft, MapPin, Building2, Stethoscope, Search, CheckCircle2, AlertCircle, ChevronDown, CalendarDays, Ticket } from 'lucide-react';
import { keyframes } from '@mui/system';
import { useTranslations, useLocale } from 'next-intl';

import { useRouter } from '@/navigation'; 
import { useSearchParams } from 'next/navigation'; 

import { useApp } from '@/context/AppContext'; 
import { BackendConnector } from '@/services/backendConnector';

// ==========================================
const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
`;

export default function TakeTurnPage() {
  const router = useRouter(); 
  const searchParams = useSearchParams(); 
  const actionType = searchParams.get('action'); 

  const t = useTranslations('HospitalSelection'); 
  const locale = useLocale(); 
  const isAr = locale === 'ar';
  const { accessibilityMode } = useApp();
  const isVis = accessibilityMode === 'visual' || accessibilityMode === 'audio_guided';

  const [locationsData, setLocationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [activeView, setActiveView] = useState('hospitals'); 
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedGov, setSelectedGov] = useState(''); 
  const [selectedHospital, setSelectedHospital] = useState(null);
  
  const [departments, setDepartments] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await BackendConnector.getHospitals();
        const apiData = response.data; 

        const formattedLocations = Object.keys(apiData).map(cityKey => {
          const hospitalsInCity = apiData[cityKey];
          const cityInfo = hospitalsInCity[0].city; 

          return {
            id: cityInfo.id,
            name: isAr ? cityInfo.name_ar : cityInfo.name_en,
            hospitals: hospitalsInCity.map(h => ({ id: h.id, name: isAr ? h.name_ar : h.name_en }))
          };
        });

        setLocationsData(formattedLocations);
        
        if (formattedLocations.length > 0) {
          setSelectedGov(formattedLocations[0].id); 
        }
      } catch (err) {
        setError('تعذر جلب البيانات. يرجى المحاولة لاحقاً.');
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, [isAr]);

  const handleHospitalSelect = async (hospital) => {
    setSelectedHospital(hospital);
    setSearchQuery(''); 
    setActiveView('clinics'); 
    setLoadingDepts(true);

    try {
      const response = await BackendConnector.getHospitalDetails(hospital.id);
      
      let fetchedDepartments = response.data.departments || [];
      
      if (actionType === 'turn') {
        fetchedDepartments = fetchedDepartments.filter(d => !d.requires_appointment);
      } else if (actionType === 'book') {
        fetchedDepartments = fetchedDepartments.filter(d => d.requires_appointment);
      }

      setDepartments(fetchedDepartments);
    } catch (err) {
      console.error("Failed to load departments:", err);
    } finally {
      setLoadingDepts(false);
    }
  };

  const handleConfirm = () => {
    if (selectedHospital && selectedDept) {
      if (actionType === 'book') {
        router.push('/booking/schedule'); 
      } else {
        router.push('/tracking'); 
      }
    }
  };

  const currentHospitals = selectedGov ? locationsData.find(g => g.id === selectedGov)?.hospitals || [] : [];
  const filteredHospitals = currentHospitals.filter(h => h.name.includes(searchQuery));
  const filteredDepartments = departments.filter(d => (isAr ? d.name_ar : d.name_en).includes(searchQuery));

  const renderSearchBar = (placeholder) => (
    <Paper elevation={0} sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', mb: 3, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
      <IconButton sx={{ p: '10px' }} aria-label="search"><Search color="#94a3b8" size={20} /></IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1, fontSize: isVis ? '1.2rem' : '1rem', fontWeight: 'bold' }}
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </Paper>
  );

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#fbfcfe', pb: 10 }}>
      
      {/* Header  */}
      <Box sx={{ bgcolor: 'white', px: { xs: 2, md: 4 }, py: 2, display: 'flex', alignItems: 'center', gap: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.03)', zIndex: 10 }}>
        <IconButton 
          onClick={() => {
            if (activeView === 'clinics') {
              setActiveView('hospitals');
              setSearchQuery('');
              setSelectedDept(null);
            } else {
              router.back(); 
            }
          }} 
          sx={{ bgcolor: '#f8fafc', p: 1.5, borderRadius: '12px' }}
        >
          <ChevronLeft size={24} color="#334155" />
        </IconButton>
        <Box>
          <Typography variant="h6" fontWeight="900" color="#0f172a" sx={{ fontSize: isVis ? '1.5rem' : '1.2rem', lineHeight: 1.2 }}>
            {actionType === 'book' ? 'حجز موعد مسبق' : 'حجز دور فوري'}
          </Typography>
          <Typography variant="caption" fontWeight="bold" color="#64748b" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
            {activeView === 'hospitals' ? 'اختيار المركز الطبي' : 'تحديد العيادة'}
          </Typography>
        </Box>
      </Box>

      <Container maxWidth="sm" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', pt: 3 }}>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}><CircularProgress size={40} sx={{ color: '#6571ff' }} /></Box>
        ) : error ? (
          <Paper sx={{ p: 3, bgcolor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '20px', display: 'flex', gap: 2 }}><AlertCircle color="#ef4444" size={28} /><Typography color="#b91c1c" fontWeight="bold">{error}</Typography></Paper>
        ) : (
          <>
            {/* ======================================================== */}
            {activeView === 'hospitals' && (
              <Box sx={{ animation: `${slideInRight} 0.4s ease-out` }}>
                
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Select
                    value={selectedGov}
                    onChange={(e) => { setSelectedGov(e.target.value); setSearchQuery(''); }}
                    displayEmpty
                    IconComponent={ChevronDown}
                    sx={{
                      borderRadius: '16px',
                      bgcolor: '#eff6ff',
                      color: '#2563eb',
                      fontWeight: 'bold',
                      fontSize: isVis ? '1.3rem' : '1.1rem',
                      '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #bfdbfe' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { border: '1px solid #60a5fa' },
                      '& .MuiSelect-select': { py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 },
                      '& .MuiSvgIcon-root': { color: '#2563eb', right: isAr ? 'auto' : 12, left: isAr ? 12 : 'auto' }
                    }}
                    MenuProps={{ PaperProps: { sx: { borderRadius: '16px', mt: 1, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' } } }}
                  >
                    {locationsData.map((gov) => (
                      <MenuItem key={gov.id} value={gov.id} sx={{ fontWeight: 'bold', fontSize: isVis ? '1.2rem' : '1rem', py: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <MapPin size={20} color="#64748b" /> {gov.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {renderSearchBar('ابحث عن اسم المستشفى...')}

                {filteredHospitals.length === 0 ? (
                  <Typography color="text.secondary" textAlign="center" mt={4}>لا يوجد مستشفيات مطابقة للبحث.</Typography>
                ) : (
                  <Stack spacing={2}>
                    {filteredHospitals.map((hospital) => (
                      <Paper
                        key={hospital.id}
                        onClick={() => handleHospitalSelect(hospital)}
                        elevation={0}
                        sx={{
                          p: 2, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
                          border: '1px solid #f1f5f9', bgcolor: 'white', transition: 'all 0.2s',
                          '&:hover': { borderColor: '#c7d2fe', bgcolor: '#fbfcfe', transform: 'translateY(-2px)' }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ width: 48, height: 48, bgcolor: '#eff6ff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Building2 size={24} color="#6571ff" />
                          </Box>
                          <Typography fontWeight="bold" color="#1e293b" sx={{ fontSize: isVis ? '1.3rem' : '1.1rem' }}>
                            {hospital.name}
                          </Typography>
                        </Box>
                        <ChevronLeft size={20} color="#cbd5e1" />
                      </Paper>
                    ))}
                  </Stack>
                )}
              </Box>
            )}

            {/* ======================================================== */}
            {activeView === 'clinics' && selectedHospital && (
              <Box sx={{ animation: `${slideInLeft} 0.4s ease-out`, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, bgcolor: '#eff2ff', p: 2, borderRadius: '16px' }}>
                  <Building2 size={20} color="#484ef0" />
                  <Typography fontWeight="bold" color="#484ef0">{selectedHospital.name}</Typography>
                </Box>

                {renderSearchBar('ابحث عن العيادة أو القسم...')}

                {loadingDepts ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}><CircularProgress size={30} sx={{ color: '#10b981' }} /></Box>
                ) : filteredDepartments.length === 0 ? (
                  <Paper sx={{ p: 4, borderRadius: '24px', bgcolor: '#f8fafc', border: '2px dashed #cbd5e1', textAlign: 'center' }}>
                    <Typography color="#64748b" fontWeight="bold">
                      {actionType === 'book' ? 'لا يوجد عيادات تقبل المواعيد المسبقة في هذا المستشفى حالياً.' : 'لا يوجد عيادات تقبل الدخول الفوري في هذا المستشفى حالياً.'}
                    </Typography>
                  </Paper>
                ) : (
                  <Box>
                    <Paper elevation={0} sx={{ 
                      p: 2, mb: 3, borderRadius: '16px', display: 'flex', alignItems: 'center', gap: 1.5, border: '1px solid',
                      bgcolor: actionType === 'book' ? '#f0fdf4' : '#eff6ff', 
                      borderColor: actionType === 'book' ? '#bbf7d0' : '#bfdbfe' 
                    }}>
                      {actionType === 'book' ? <CalendarDays size={24} color="#059669" /> : <Ticket size={24} color="#2563eb" />}
                      <Typography fontWeight="bold" color={actionType === 'book' ? '#065f46' : '#1e3a8a'} sx={{ fontSize: isVis ? '1.1rem' : '0.9rem' }}>
                        {actionType === 'book' ? 'جميع العيادات أدناه متاحة للحجز المسبق.' : 'جميع العيادات أدناه متاحة لأخذ دور فوري اليوم.'}
                      </Typography>
                    </Paper>

                    <Stack spacing={2} mb={10}>
                      {filteredDepartments.map((dept) => (
                        <Paper
                          key={dept.id}
                          onClick={() => setSelectedDept(dept.id)}
                          elevation={0}
                          sx={{
                            p: 2, borderRadius: '20px', display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer',
                            border: '2px solid', borderColor: selectedDept === dept.id ? '#10b981' : '#f1f5f9',
                            bgcolor: selectedDept === dept.id ? '#ecfdf5' : 'white', transition: 'all 0.2s',
                          }}
                        >
                          <Box sx={{ bgcolor: selectedDept === dept.id ? '#d1fae5' : '#f8fafc', p: 1.5, borderRadius: '14px' }}>
                            <Stethoscope size={24} color={selectedDept === dept.id ? '#059669' : '#64748b'} />
                          </Box>

                          <Box sx={{ flexGrow: 1 }}>
                            <Typography fontWeight="bold" color={selectedDept === dept.id ? '#065f46' : '#1e293b'} sx={{ fontSize: isVis ? '1.3rem' : '1.05rem' }}>
                              {isAr ? dept.name_ar : dept.name_en}
                            </Typography>
                          </Box>

                          {selectedDept === dept.id && <CheckCircle2 size={24} color="#10b981" />}
                        </Paper>
                      ))}
                    </Stack>
                  </Box>
                )}

                <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 3, bgcolor: 'linear-gradient(to top, white 80%, rgba(255,255,255,0.9) 60%, transparent)', zIndex: 100 }}>
                  <Container maxWidth="sm" disableGutters>
                    <Button 
                      variant="contained" 
                      disabled={!selectedDept}
                      onClick={handleConfirm}
                      sx={{ 
                        py: isVis ? 2.5 : 2, borderRadius: '24px', 
                        background: selectedDept ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#e2e8f0', 
                        color: selectedDept ? 'white' : '#94a3b8',
                        fontSize: isVis ? '1.4rem' : '1.1rem', fontWeight: 'bold', width: '100%',
                        boxShadow: selectedDept ? '0 10px 25px -5px rgba(16, 185, 129, 0.4)' : 'none',
                      }}
                    >
                      {actionType === 'book' ? 'تأكيد ومتابعة الموعد' : 'تأكيد أخذ الدور'}
                    </Button>
                  </Container>
                </Box>

              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}