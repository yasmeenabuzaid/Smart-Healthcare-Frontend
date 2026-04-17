// This file initializes the navigation system and defines app routes.
// It sets supported locales and provides utilities for linking and redirects.

import {createNavigation} from 'next-intl/navigation';
import {defineRouting} from 'next-intl/routing';

// initialize routing configuration ( default -> en)
export const routing = defineRouting({
  locales: ['en', 'ar'],
  defaultLocale: 'en'
});

// export navigation utilities
export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);


