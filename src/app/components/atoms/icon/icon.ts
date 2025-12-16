import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type IconSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
export type IconColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'muted' | 'inherit';

/**
 * Reusable Icon component based on PrimeIcons
 * Provides consistent iconography across the application with customizable sizes and colors
 * @example
 * <app-icon 
 *   name="pi-search"
 *   size="lg"
 *   color="primary">
 * </app-icon>
 */
@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon.html',
  styleUrls: ['./icon.css']
})
export class IconComponent {
  // ✅ readonly inputs using signals
  readonly name = input.required<string>();
  readonly size = input<IconSize>('base');
  readonly color = input<IconColor>('inherit');
  readonly disabled = input<boolean>(false);
  readonly spin = input<boolean>(false);
  readonly clickable = input<boolean>(false);
  readonly ariaLabel = input<string>('');
  readonly ariaHidden = input<boolean>(true);

  // ✅ Computed properties for template
  protected readonly iconClasses = computed(() => {
    const classes = [
      'icon',
      'pi', // PrimeIcons base class
      this.name().startsWith('pi-') ? this.name() : `pi-${this.name()}`,
      `icon--size-${this.size()}`,
      `icon--color-${this.color()}`,
    ];

    if (this.disabled()) classes.push('icon--disabled');
    if (this.spin()) classes.push('icon--spin');
    if (this.clickable()) classes.push('icon--clickable');

    return classes.filter(Boolean).join(' ');
  });

  protected readonly ariaAttributes = computed(() => ({
    'aria-label': this.ariaLabel() || null,
    'aria-hidden': this.ariaHidden().toString(),
    'role': this.clickable() ? 'button' : null,
    'tabindex': this.clickable() && !this.disabled() ? '0' : null
  }));

  // ✅ Computed for semantic size mapping
  protected readonly sizeValue = computed(() => {
    const sizeMap = {
      'xs': '0.75rem',   // 12px
      'sm': '0.875rem',  // 14px
      'base': '1rem',    // 16px (default)
      'lg': '1.25rem',   // 20px
      'xl': '1.5rem',    // 24px
      '2xl': '2rem',     // 32px
      '3xl': '3rem'      // 48px
    };
    return sizeMap[this.size()];
  });

  // ✅ Helper methods for common icon types
  static readonly COMMON_ICONS = {
    // Navigation
    home: 'pi-home',
    back: 'pi-arrow-left',
    forward: 'pi-arrow-right',
    up: 'pi-arrow-up',
    down: 'pi-arrow-down',
    menu: 'pi-bars',
    close: 'pi-times',
    
    // Actions
    search: 'pi-search',
    filter: 'pi-filter',
    sort: 'pi-sort',
    edit: 'pi-pencil',
    delete: 'pi-trash',
    save: 'pi-save',
    copy: 'pi-copy',
    download: 'pi-download',
    upload: 'pi-upload',
    refresh: 'pi-refresh',
    
    // Status
    check: 'pi-check',
    error: 'pi-times-circle',
    warning: 'pi-exclamation-triangle',
    info: 'pi-info-circle',
    success: 'pi-check-circle',
    loading: 'pi-spinner',
    
    // User
    user: 'pi-user',
    users: 'pi-users',
    profile: 'pi-user-edit',
    settings: 'pi-cog',
    logout: 'pi-sign-out',
    
    // Content
    file: 'pi-file',
    folder: 'pi-folder',
    image: 'pi-image',
    calendar: 'pi-calendar',
    clock: 'pi-clock',
    
    // Communication
    mail: 'pi-envelope',
    phone: 'pi-phone',
    chat: 'pi-comments',
    bell: 'pi-bell',
    
    // Data
    chart: 'pi-chart-bar',
    table: 'pi-table',
    list: 'pi-list',
    database: 'pi-database',
    
    // UI Elements
    plus: 'pi-plus',
    minus: 'pi-minus',
    expand: 'pi-chevron-down',
    collapse: 'pi-chevron-up',
    external: 'pi-external-link'
  } as const;

  // ✅ Static helper methods for programmatic use
  static getIconName(key: keyof typeof IconComponent.COMMON_ICONS): string {
    return IconComponent.COMMON_ICONS[key];
  }

  static isValidIcon(iconName: string): boolean {
    return iconName.startsWith('pi-') || Object.values(IconComponent.COMMON_ICONS).includes(iconName as any);
  }
}