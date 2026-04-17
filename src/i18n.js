// to handle if the page dosn't exist or the locale is not supported
import { notFound } from 'next/navigation';

// This file configures the internationalization (i18n) settings 
import {getRequestConfig} from 'next-intl/server';

// supported locales
const locales = ['en', 'ar'];


export default getRequestConfig(async ({requestLocale}) => {
  const locale = await requestLocale;

  if (!locales.includes(locale)) notFound(); 

  return {
    locale, 
    messages: (await import(`../messages/${locale}.json`)).default
  };
});