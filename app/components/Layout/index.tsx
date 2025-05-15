import {
  AppBar,
  Container,
  Divider,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
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
        backgroundSize: 'cover',
        // backgroundColor: 'rgba(255,255,255,0.2)',
        // backgroundBlendMode: 'lighten',
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
          <Container maxWidth='xl'>
            <Image src='/logo.png' alt='Logo' width={40} height={40} />
          </Container>
        </Toolbar>
      </AppBar>
      <Container maxWidth='lg' component={Stack} flex={1}>
        <Stack
          direction='row'
          id='container'
          flex={1}
          sx={{
            pt: 12,
            pb: 4,
          }}
        >
          {children}
        </Stack>
      </Container>
      <Stack
        component={'footer'}
        justifyContent='center'
        sx={{ height: 100, backgroundColor: '#323232', color: 'white', py: 6 }}
      >
        <Container maxWidth='xl'>
          <Stack direction='row' alignItems='center' spacing={3}>
            <Image src='/logo-w.png' alt='Logo' width={90} height={33} />
            <Stack
              direction='row'
              spacing={0.5}
              divider={
                <Divider
                  orientation='vertical'
                  flexItem
                  sx={{ borderColor: 'white' }}
                />
              }
            >
              <Typography
                variant='subtitle2'
                component='p'
                sx={{ lineHeight: 1 }}
              >
                One New Zealand Group Limited
              </Typography>
              <Typography
                variant='subtitle2'
                component='a'
                href='https://one.nz'
                sx={{ lineHeight: 1 }}
              >
                one.nz
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Stack>
    </Stack>
  );
};
export default Layout;
