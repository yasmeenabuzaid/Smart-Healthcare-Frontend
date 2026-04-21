"use client";

import { useMemo } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { useApp } from '@/context/AppContext';

export default function AppThemeProvider({ children }) {
  const { accessibilityMode } = useApp();

  const isAdaptive = accessibilityMode === 'visual' || accessibilityMode === 'audio_guided';

  const theme = useMemo(() => {
    return createTheme({
      direction: 'rtl', 
      palette: {
        primary: {
          main: '#2563eb',
          dark: '#1d4ed8',
        },
        background: {
          default: '#f8fafc',
        },
        text: {
          primary: isAdaptive ? '#000000' : '#1e293b',
          secondary: isAdaptive ? '#1e293b' : '#64748b',
        },
      },
      spacing: isAdaptive ? 10 : 8, 
      typography: {
        fontFamily: 'var(--font-geist-sans), sans-serif', 
        h1: { fontSize: isAdaptive ? '4rem' : '3rem', fontWeight: 900 },
        h2: { fontSize: isAdaptive ? '3.5rem' : '2.5rem', fontWeight: 900 },
        h3: { fontSize: isAdaptive ? '3rem' : '2rem', fontWeight: 800 },
        h4: { fontSize: isAdaptive ? '2.5rem' : '1.75rem', fontWeight: 800 },
        h6: { fontSize: isAdaptive ? '1.8rem' : '1.25rem', fontWeight: 700 },
        body1: { fontSize: isAdaptive ? '1.4rem' : '1rem', lineHeight: 1.6 },
        body2: { fontSize: isAdaptive ? '1.2rem' : '0.875rem' },
        button: { fontWeight: 'bold' },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: isAdaptive ? '24px' : '16px',
              padding: isAdaptive ? '16px 32px' : '10px 20px',
              fontSize: isAdaptive ? '1.3rem' : '1rem',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              borderRadius: isAdaptive ? '32px' : '24px',
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                borderRadius: isAdaptive ? '24px' : '16px',
                fontSize: isAdaptive ? '1.4rem' : '1rem',
              },
            },
          },
        },
      },
    });
  }, [accessibilityMode, isAdaptive]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}