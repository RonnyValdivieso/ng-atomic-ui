import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ThemeService } from '@services/theme.service';
import { ButtonComponent } from '@atoms/button';
import { InputComponent } from '@atoms/input';
import { LabelComponent } from '@atoms/label';
import { AvatarComponent } from '@atoms/avatar';
import { BadgeComponent } from '@atoms/badge';

/**
 * Theme Guide Component - Comprehensive documentation for the theme system
 * 
 * Features:
 * - Noir theme palette demonstration
 * - Dark/Light mode toggle and comparison  
 * - CSS variables and PrimeNG integration
 * - Color tokens and usage examples
 * - Best practices for theme implementation
 * 
 * @example
 * <app-theme-guide></app-theme-guide>
 */
@Component({
  selector: 'app-theme-guide',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    LabelComponent,
    AvatarComponent,
    BadgeComponent
  ],
  templateUrl: './theme-guide.html',
  styleUrls: ['./theme-guide.css']
})
export class ThemeGuideComponent {
  private readonly themeService = inject(ThemeService);

  // Color palettes for demonstration
  readonly zincPalette = [
    { name: 'zinc-50', value: '#fafafa', usage: 'Backgrounds, very light text' },
    { name: 'zinc-100', value: '#f4f4f5', usage: 'Subtle backgrounds' },
    { name: 'zinc-200', value: '#e4e4e7', usage: 'Borders, dividers' },
    { name: 'zinc-300', value: '#d4d4d8', usage: 'Disabled states' },
    { name: 'zinc-400', value: '#a1a1aa', usage: 'Placeholder text' },
    { name: 'zinc-500', value: '#71717a', usage: 'Secondary text' },
    { name: 'zinc-600', value: '#52525b', usage: 'Main text (light mode)' },
    { name: 'zinc-700', value: '#3f3f46', usage: 'Headings, emphasized' },
    { name: 'zinc-800', value: '#27272a', usage: 'Dark backgrounds' },
    { name: 'zinc-900', value: '#18181b', usage: 'Very dark backgrounds' },
    { name: 'zinc-950', value: '#09090b', usage: 'Deepest black' }
  ] as const;

  readonly slatePalette = [
    { name: 'slate-50', value: '#f8fafc', usage: 'Light mode main background' },
    { name: 'slate-100', value: '#f1f5f9', usage: 'Card backgrounds' },
    { name: 'slate-200', value: '#e2e8f0', usage: 'Subtle borders' },
    { name: 'slate-300', value: '#cbd5e1', usage: 'Input borders' },
    { name: 'slate-400', value: '#94a3b8', usage: 'Muted text' },
    { name: 'slate-500', value: '#64748b', usage: 'Secondary elements' },
    { name: 'slate-600', value: '#475569', usage: 'Dark mode borders' },
    { name: 'slate-700', value: '#334155', usage: 'Dark mode text' },
    { name: 'slate-800', value: '#1e293b', usage: 'Dark mode cards' },
    { name: 'slate-900', value: '#0f172a', usage: 'Dark mode background' },
    { name: 'slate-950', value: '#020617', usage: 'Deepest dark' }
  ] as const;

  // CSS Variables mapping
  readonly cssVariables = [
    { 
      variable: '--p-surface-0', 
      lightValue: 'zinc-50 (#fafafa)', 
      darkValue: 'slate-900 (#0f172a)',
      usage: 'Main background color'
    },
    { 
      variable: '--p-surface-50', 
      lightValue: 'zinc-100 (#f4f4f5)', 
      darkValue: 'slate-800 (#1e293b)',
      usage: 'Card and panel backgrounds'
    },
    { 
      variable: '--p-surface-100', 
      lightValue: 'zinc-200 (#e4e4e7)', 
      darkValue: 'slate-700 (#334155)',
      usage: 'Subtle backgrounds, hover states'
    },
    { 
      variable: '--p-surface-300', 
      lightValue: 'zinc-300 (#d4d4d8)', 
      darkValue: 'slate-600 (#475569)',
      usage: 'Borders, dividers'
    },
    { 
      variable: '--p-text-color', 
      lightValue: 'zinc-700 (#3f3f46)', 
      darkValue: 'slate-100 (#f1f5f9)',
      usage: 'Primary text color'
    },
    { 
      variable: '--p-text-muted-color', 
      lightValue: 'zinc-500 (#71717a)', 
      darkValue: 'slate-400 (#94a3b8)',
      usage: 'Secondary text, descriptions'
    },
    { 
      variable: '--p-primary-500', 
      lightValue: 'zinc-600 (#52525b)', 
      darkValue: 'zinc-400 (#a1a1aa)',
      usage: 'Primary brand color'
    }
  ] as const;

  // Component demo data
  readonly demoText = signal('Texto de ejemplo');
  readonly searchControl = new FormControl('');

  // Computed properties
  readonly isDarkMode = computed(() => this.themeService.isDarkMode());
  readonly currentTheme = computed(() => this.isDarkMode() ? 'Oscuro' : 'Claro');

  /**
   * Toggle theme for demonstration
   */
  toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }

  /**
   * Copy color value to clipboard
   */
  copyToClipboard(value: string): void {
    navigator.clipboard.writeText(value).then(() => {
      console.log('Color copiado:', value);
      // You could add a toast notification here
    });
  }

  /**
   * Get contrast ratio for accessibility info
   */
  getContrastInfo(colorValue: string): string {
    // Simplified contrast ratio calculation
    const isDark = colorValue.includes('900') || colorValue.includes('950') || 
                   colorValue.includes('800') || colorValue.includes('700');
    return isDark ? 'Texto claro recomendado' : 'Texto oscuro recomendado';
  }

  /**
   * Handle demo interactions
   */
  onDemoAction(action: string): void {
    console.log(`Demostración: ${action}`);
  }
}