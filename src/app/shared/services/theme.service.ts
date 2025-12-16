import { Injectable, signal, effect } from '@angular/core';

/**
 * Theme Service
 * Manages global dark/light mode state for the entire application
 * Uses Angular signals for reactive theme state management
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Reactive signal for theme state
  private readonly _isDarkMode = signal<boolean>(false);
  
  // Public readonly getter for components to consume
  readonly isDarkMode = this._isDarkMode.asReadonly();
  
  // Storage key for persistence
  private readonly STORAGE_KEY = 'atomic-theme-mode';

  constructor() {
    // Initialize theme from localStorage or system preference
    this.initializeTheme();
    
    // Effect to apply theme changes to DOM and persist state
    effect(() => {
      const isDark = this._isDarkMode();
      this.applyTheme(isDark);
      this.persistTheme(isDark);
    });
  }

  /**
   * Toggle between light and dark mode
   */
  toggleDarkMode(): void {
    this._isDarkMode.update(current => !current);
  }

  /**
   * Set specific theme mode
   * @param isDark - true for dark mode, false for light mode
   */
  setTheme(isDark: boolean): void {
    this._isDarkMode.set(isDark);
  }

  /**
   * Initialize theme from stored preference or system setting
   */
  private initializeTheme(): void {
    // Try to get stored preference first
    const storedTheme = localStorage.getItem(this.STORAGE_KEY);
    
    if (storedTheme !== null) {
      // Use stored preference
      this._isDarkMode.set(storedTheme === 'dark');
    } else {
      // Fallback to system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this._isDarkMode.set(prefersDark);
    }
  }

  /**
   * Apply theme to DOM by managing the .p-dark class on html element
   * @param isDark - whether to apply dark theme
   */
  private applyTheme(isDark: boolean): void {
    const htmlElement = document.documentElement;
    
    if (isDark) {
      htmlElement.classList.add('p-dark');
    } else {
      htmlElement.classList.remove('p-dark');
    }
  }

  /**
   * Persist theme preference to localStorage
   * @param isDark - current theme state to persist
   */
  private persistTheme(isDark: boolean): void {
    localStorage.setItem(this.STORAGE_KEY, isDark ? 'dark' : 'light');
  }

  /**
   * Listen to system theme changes (optional enhancement)
   * Automatically update theme when user changes system preference
   */
  listenToSystemThemeChanges(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (event) => {
      // Only update if user hasn't manually set a preference
      const hasStoredPreference = localStorage.getItem(this.STORAGE_KEY) !== null;
      
      if (!hasStoredPreference) {
        this._isDarkMode.set(event.matches);
      }
    });
  }
}