import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';
import { BlackNoirPreset } from './theme/black-preset';
import { THEME_INITIALIZER } from './theme/theme-initializer';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimations(), // Required for PrimeNG animations
    providePrimeNG({
      theme: {
        preset: BlackNoirPreset,
        options: {
          prefix: 'p',
          darkModeSelector: '.p-dark',
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng'
          }
        }
      }
    }),
    THEME_INITIALIZER // Initialize theme service at app startup
  ]
};
