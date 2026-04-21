import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import { AppProvider } from '@/context/AppContext';
import AppThemeProvider from '@/theme/AppThemeProvider';
export const metadata = {
  title: 'OnlineMihna | Hire Remote Talent',
};

export default async function RootLayout({ children, params }) {
  
  const { locale } = await params;

  const messages = await getMessages();
  
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <body style={{ margin: 0, display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <NextIntlClientProvider messages={messages}>
          <AppProvider>
            <AppThemeProvider>
          <Navbar locale={locale} />
          <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            {children}
          </main>
          <Footer />
          </AppThemeProvider>
          </AppProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}