import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import './globals.css';
import { Container } from '@mui/material';
import Header from './header';
import { getSession } from './lib/auth';

export const metadata: Metadata = {
  title: 'Nextjs Native Auth',
  description:
    'Auth starter app, using native NextJs, no auth library used',
  icons: [{ rel: 'icon', url: '/favicon.png' }],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedInUser = await getSession();

  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <Header loggedInUser={loggedInUser} />
            <Container
              sx={{
                marginTop: '16px',
                minHeight: '100vh',
              }}
            >
              {children}
            </Container>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
