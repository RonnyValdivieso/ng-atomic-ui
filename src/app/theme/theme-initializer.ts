import { APP_INITIALIZER } from '@angular/core';
import { ThemeService } from '../shared/services/theme.service';

/**
 * Theme Initializer Factory
 * Ensures theme service is initialized at application startup
 * @param themeService - The global theme service instance
 */
export function themeInitializerFactory(themeService: ThemeService) {
  return () => {
    // Initialize theme and optionally listen to system changes
    themeService.listenToSystemThemeChanges();
    return Promise.resolve();
  };
}

/**
 * Provider for theme initialization
 * Use this in app.config.ts providers array
 */
export const THEME_INITIALIZER = {
  provide: APP_INITIALIZER,
  useFactory: themeInitializerFactory,
  deps: [ThemeService],
  multi: true
};