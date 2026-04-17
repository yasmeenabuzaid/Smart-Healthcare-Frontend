"use client";

import { AppBar } from '@mui/material';

export default function Navbar() {


  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', py: 0.5, zIndex: (theme) => theme.zIndex.drawer + 1 }}>

    </AppBar>
  );
}