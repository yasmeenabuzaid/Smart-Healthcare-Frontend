"use client";

import { Box, Typography, ButtonBase, Paper } from '@mui/material';
import { ChevronLeft } from 'lucide-react'; 
import { blurReveal } from '../../utils/animations';

export default function ModeCard({ mode, onSelect }) {
  const IconComponent = mode.icon;

  return (
    <Paper 
      component={ButtonBase} 
      onClick={() => onSelect(mode.id)}
      sx={{ 
        width: '100%', 
        p: 3, 
        borderRadius: '24px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        textAlign: 'start', 
        backgroundColor: 'white', 
        border: '1px solid #f1f5f9',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        opacity: 0, 
        animation: `${blurReveal} 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${mode.delay} forwards`,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        
        '&::before': {
          content: '""',
          position: 'absolute',
          right: 0, 
          top: '15%',
          bottom: '15%',
          width: '6px',
          backgroundColor: mode.color,
          borderRadius: '8px 0 0 8px',
          transform: 'scaleY(0)',
          opacity: 0,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transformOrigin: 'center',
        },

        '&:hover': { 
          borderColor: `${mode.color}40`,
          backgroundColor: '#ffffff',
          boxShadow: `0 20px 40px -10px ${mode.color}25`, 
          transform: 'translateY(-4px)',
          '&::before': { 
            transform: 'scaleY(1)', 
            opacity: 1 
          },
          '& .action-arrow': { 
            transform: 'translateX(-6px)', 
            color: mode.color,
            opacity: 1
          }
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        
        <Box sx={{ 
          width: 68, height: 68, 
          borderRadius: '20px', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          flexShrink: 0, 
          backgroundColor: mode.bg,
          border: '1px solid',
          borderColor: `${mode.color}20`, 
          transition: 'transform 0.3s ease',
          '.MuiButtonBase-root:hover &': {
            transform: 'scale(1.05)' 
          }
        }}>
          <IconComponent size={34} color={mode.color} strokeWidth={2.5} />
        </Box>

        {/* النصوص */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="h6" fontWeight="900" color="#0f172a" sx={{ fontSize: '1.3rem' }}>
            {mode.title}
          </Typography>
          <Typography variant="body2" fontWeight="700" color="#64748b" sx={{ fontSize: '1.05rem', lineHeight: 1.5 }}>
            {mode.desc}
          </Typography>
        </Box>

      </Box>

      <ChevronLeft 
        className="action-arrow"
        size={24} 
        color="#cbd5e1" 
        style={{ 
          transition: 'all 0.3s ease',
          opacity: 0.5
        }} 
      />
      
    </Paper>
  );
}