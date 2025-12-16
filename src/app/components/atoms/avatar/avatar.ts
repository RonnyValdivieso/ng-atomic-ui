import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '@atoms/icon';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarVariant = 'circular' | 'rounded' | 'square';
export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy' | 'none';

/**
 * Avatar component for displaying user profile pictures, initials, or fallback content
 * Supports multiple sizes, variants, status indicators, and click interactions
 * @example
 * <app-avatar 
 *   src="/assets/user.jpg"
 *   alt="John Doe"
 *   size="lg"
 *   variant="circular"
 *   status="online"
 *   (clicked)="handleAvatarClick()">
 * </app-avatar>
 */
@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './avatar.html',
  styleUrls: ['./avatar.css']
})
export class AvatarComponent {
  // ✅ readonly inputs using signals
  readonly src = input<string>('');
  readonly alt = input<string>('');
  readonly initials = input<string>('');
  readonly size = input<AvatarSize>('md');
  readonly variant = input<AvatarVariant>('circular');
  readonly status = input<AvatarStatus>('none');
  readonly clickable = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly placeholder = input<string>('');

  // ✅ readonly outputs
  readonly clicked = output<void>();
  readonly imageError = output<void>();
  readonly imageLoaded = output<void>();

  // ✅ Computed properties for template
  protected readonly avatarId = computed(() => 
    `avatar-${Math.random().toString(36).substring(2, 9)}`
  );

  protected readonly avatarClasses = computed(() => [
    'avatar',
    `avatar--${this.size()}`,
    `avatar--${this.variant()}`,
    this.status() !== 'none' ? `avatar--has-status` : '',
    this.clickable() ? 'avatar--clickable' : '',
    this.disabled() ? 'avatar--disabled' : '',
    this.loading() ? 'avatar--loading' : '',
    this.hasImage() ? 'avatar--has-image' : '',
    this.hasInitials() ? 'avatar--has-initials' : '',
    !this.hasImage() && !this.hasInitials() ? 'avatar--placeholder' : ''
  ].filter(Boolean).join(' '));

  protected readonly statusClasses = computed(() => [
    'avatar__status',
    `avatar__status--${this.status()}`
  ].filter(Boolean).join(' '));

  protected readonly hasImage = computed(() => 
    this.src().trim().length > 0 && !this.loading()
  );

  protected readonly hasInitials = computed(() => 
    this.initials().trim().length > 0
  );

  protected readonly displayInitials = computed(() => {
    const initials = this.initials().trim();
    if (initials.length === 0) return '';
    
    // Si hay espacios, tomar las primeras letras de cada palabra (máximo 2)
    const words = initials.split(/\s+/);
    if (words.length > 1) {
      return words.slice(0, 2).map(word => word[0]?.toUpperCase()).join('');
    }
    
    // Si es una sola palabra, tomar las primeras 2 letras
    return initials.substring(0, 2).toUpperCase();
  });

  protected readonly ariaLabel = computed(() => {
    if (this.alt()) return this.alt();
    if (this.hasInitials()) return `Avatar for ${this.initials()}`;
    return 'User avatar';
  });

  protected readonly sizeValue = computed(() => {
    const sizeMap = {
      'xs': '1.5rem',   // 24px
      'sm': '2rem',     // 32px
      'md': '2.5rem',   // 40px (default)
      'lg': '3rem',     // 48px
      'xl': '4rem',     // 64px
      '2xl': '5rem'     // 80px
    };
    return sizeMap[this.size()];
  });

  protected readonly shouldShowStatus = computed(() => 
    this.status() !== 'none' && this.status() !== undefined
  );

  // ✅ Protected event handlers
  protected handleClick(): void {
    if (!this.disabled() && this.clickable()) {
      this.clicked.emit();
    }
  }

  protected handleImageError(): void {
    this.imageError.emit();
  }

  protected handleImageLoad(): void {
    this.imageLoaded.emit();
  }

  protected handleKeyDown(event: KeyboardEvent): void {
    if (this.clickable() && !this.disabled() && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      this.handleClick();
    }
  }

  // ✅ Static helper methods for common use cases
  static readonly COMMON_SIZES = {
    extraSmall: 'xs' as AvatarSize,
    small: 'sm' as AvatarSize,
    medium: 'md' as AvatarSize,
    large: 'lg' as AvatarSize,
    extraLarge: 'xl' as AvatarSize,
    doubleExtraLarge: '2xl' as AvatarSize
  };

  static readonly STATUS_COLORS = {
    online: '#10b981',    // green-500
    offline: '#6b7280',   // gray-500  
    away: '#f59e0b',      // amber-500
    busy: '#ef4444',      // red-500
    none: 'transparent'
  };

  // ✅ Static utility methods
  static generateInitials(fullName: string): string {
    if (!fullName?.trim()) return '';
    
    const words = fullName.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    
    return words.slice(0, 2)
      .map(word => word[0]?.toUpperCase())
      .join('');
  }

  static getStatusColor(status: AvatarStatus): string {
    return AvatarComponent.STATUS_COLORS[status] || AvatarComponent.STATUS_COLORS.none;
  }

  static isValidImageUrl(url: string): boolean {
    try {
      new URL(url);
      return /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(url);
    } catch {
      return false;
    }
  }
}