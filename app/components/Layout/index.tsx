import { AppBar, Stack, Toolbar } from '@mui/material';
import Image from 'next/image';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = (props: LayoutProps) => {
  const { children } = props;
  return (
    <Stack
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'grey.50',
        backgroundImage: "url('/bg1.jpg')",
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'rgba(255,255,255,0.2)',
        backgroundBlendMode: 'lighten',
      }}
    >
      <AppBar
        position='fixed'
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        elevation={0}
      >
        <Toolbar
          sx={{
            bgcolor: 'white',
            borderBottom: () => `1px solid rgba(102,102,102,.5)`,
          }}
        >
          <Image src='/logo.png' alt='Logo' width={40} height={40} />
        </Toolbar>
      </AppBar>
      <Stack
        direction='row'
        id='container'
        flex={1}
        sx={{ pt: 8, color: 'white' }}
      >
        {children}
      </Stack>
      <Stack
        component={'footer'}
        sx={{ height: 50, backgroundColor: '#323232', color: 'white' }}
      >
        footer
      </Stack>
    </Stack>
  );
};
export default Layout;
