import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import { AppProvider } from '@/context/AppContext';
import AppThemeProvider from '@/theme/AppThemeProvider';
import BottomNavBar from '@/components/BottomNavBar'; 

export const metadata = {
  title: 'البوابة الطبية الوطنية | منصة المرضى',  
  description: 'نظام حجز الأدوار والمواعيد في المستشفيات الحكومية',
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
              
              <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {children}
              </main>

              {/* 🟢 البار السفلي الذكي اللي بيغلف التطبيق كله */}
              <BottomNavBar />

            </AppThemeProvider>
          </AppProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}