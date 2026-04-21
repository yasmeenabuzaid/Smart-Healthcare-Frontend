"use client";

import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Home, CalendarDays, FileText, User } from 'lucide-react';
import { useRouter, usePathname } from '@/navigation';

export default function BottomNavBar() {
  const router = useRouter();
  const pathname = usePathname(); 

  const getValue = () => {
    if (pathname.includes('/booking') || pathname.includes('/schedule')) return 1;
    if (pathname.includes('/records')) return 2;
    if (pathname.includes('/profile')) return 3;
    return 0; 
  };

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, borderRadius: '32px 32px 0 0', overflow: 'hidden', boxShadow: '0 -10px 40px rgba(0,0,0,0.05)', zIndex: 1000 }}>
      <BottomNavigation 
        showLabels 
        value={getValue()} 
        onChange={(event, newValue) => {
          if (newValue === 0) router.push('/dashboard');
        }} 
        sx={{ height: 80, '& .Mui-selected': { color: '#2563eb !important' } }}
      >
        <BottomNavigationAction label="الرئيسية" icon={<Home size={24} />} />
        <BottomNavigationAction label="مواعيدي" icon={<CalendarDays size={24} />} />
        <BottomNavigationAction label="ملفي" icon={<FileText size={24} />} />
        <BottomNavigationAction label="حسابي" icon={<User size={24} />} />
      </BottomNavigation>
    </Paper>
  );
}