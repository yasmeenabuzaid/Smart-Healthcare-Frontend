// this middleware is used to handle the locale in the URL and set the appropriate locale for the application
import createMiddleware from 'next-intl/middleware';

// this middleware will run on every request 
export default createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en' 
});

// this config is used to specify which paths should be handled by the middleware
export const config = {
  matcher: ['/', '/(ar|en)/:path*']
};