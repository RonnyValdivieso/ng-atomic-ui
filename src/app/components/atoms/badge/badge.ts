import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '@atoms/icon';

export type BadgeVariant = 'solid' | 'outline' | 'soft' | 'dot';
export type BadgeColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral';
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';
export type BadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

/**
 * Badge component for displaying status indicators, counts, and notifications
 * Supports multiple variants, colors, sizes, and positioning modes
 * @example
 * <app-badge 
 *   text="5"
 *   variant="solid"
 *   color="danger"
 *   size="sm">
 * </app-badge>
 */
@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './badge.html',
  styleUrls: ['./badge.css']
})
export class BadgeComponent {
  // ✅ readonly inputs using signals
  readonly text = input<string>('');
  readonly count = input<number | null>(null);
  readonly variant = input<BadgeVariant>('solid');
  readonly color = input<BadgeColor>('primary');
  readonly size = input<BadgeSize>('md');
  readonly position = input<BadgePosition | null>(null);
  readonly maxCount = input<number>(99);
  readonly showZero = input<boolean>(false);
  readonly dot = input<boolean>(false);
  readonly pulse = input<boolean>(false);
  readonly clickable = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly icon = input<string>('');
  readonly ariaLabel = input<string>('');

  // ✅ readonly outputs
  readonly clicked = output<void>();

  // ✅ Computed properties for template
  protected readonly badgeId = computed(() => 
    `badge-${Math.random().toString(36).substring(2, 9)}`
  );

  protected readonly badgeClasses = computed(() => [
    'badge',
    `badge--${this.variant()}`,
    `badge--${this.color()}`,
    `badge--${this.size()}`,
    this.position() ? `badge--positioned badge--${this.position()}` : '',
    this.dot() || this.variant() === 'dot' ? 'badge--dot' : '',
    this.pulse() ? 'badge--pulse' : '',
    this.clickable() ? 'badge--clickable' : '',
    this.disabled() ? 'badge--disabled' : '',
    this.hasIcon() ? 'badge--has-icon' : '',
    this.isEmpty() ? 'badge--empty' : '',
    this.isHidden() ? 'badge--hidden' : ''
  ].filter(Boolean).join(' '));

  protected readonly displayText = computed(() => {
    // Si hay count, usarlo con lógica de maxCount
    if (this.count() !== null) {
      const count = this.count()!;
      if (count === 0 && !this.showZero()) return '';
      return count > this.maxCount() ? `${this.maxCount()}+` : count.toString();
    }
    
    // Si no hay count, usar text
    return this.text();
  });

  readonly hasIcon = computed(() => 
    this.icon().trim().length > 0
  );

  readonly hasContent = computed(() => 
    this.displayText().length > 0 || this.hasIcon()
  );

  readonly isEmpty = computed(() => 
    !this.hasContent() && !this.dot() && this.variant() !== 'dot'
  );

  readonly isDot = computed(() => 
    this.variant() === 'dot' || this.dot()
  );

  readonly isPositioned = computed(() => 
    !!this.position()
  );

  protected readonly isHidden = computed(() => {
    if (this.dot() || this.variant() === 'dot') return false;
    if (this.count() !== null) {
      const count = this.count()!;
      return count === 0 && !this.showZero();
    }
    return this.isEmpty();
  });

  protected readonly ariaLabelText = computed(() => {
    if (this.ariaLabel()) return this.ariaLabel();
    
    const text = this.displayText();
    if (text) {
      const count = this.count();
      if (count !== null) {
        if (count === 0) return 'No notifications';
        if (count === 1) return '1 notification';
        return `${text} notifications`;
      }
      return `Badge: ${text}`;
    }
    
    if (this.dot() || this.variant() === 'dot') {
      return 'Status indicator';
    }
    
    return 'Badge';
  });

  protected readonly iconSize = computed(() => {
    const sizeMap = {
      'xs': 'xs' as const,
      'sm': 'xs' as const,
      'md': 'sm' as const,
      'lg': 'base' as const
    };
    return sizeMap[this.size()];
  });

  // ✅ Protected event handlers
  protected handleClick(): void {
    if (!this.disabled() && this.clickable()) {
      this.clicked.emit();
    }
  }

  protected handleKeyDown(event: KeyboardEvent): void {
    if (this.clickable() && !this.disabled() && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      this.handleClick();
    }
  }

  // ✅ Static utility methods and constants
  static readonly COMMON_COLORS = {
    notification: 'danger' as BadgeColor,
    success: 'success' as BadgeColor,
    warning: 'warning' as BadgeColor,
    info: 'info' as BadgeColor,
    neutral: 'neutral' as BadgeColor,
    primary: 'primary' as BadgeColor
  };

  static readonly COMMON_VARIANTS = {
    notification: 'solid' as BadgeVariant,
    subtle: 'soft' as BadgeVariant,
    bordered: 'outline' as BadgeVariant,
    indicator: 'dot' as BadgeVariant
  };

  static readonly DEFAULT_MAX_COUNT = 99;
  static readonly DEFAULT_LARGE_MAX_COUNT = 999;

  // ✅ Static utility methods
  static formatCount(count: number, maxCount: number = BadgeComponent.DEFAULT_MAX_COUNT): string {
    if (count <= maxCount) return count.toString();
    return `${maxCount}+`;
  }

  static getNotificationColor(priority: 'high' | 'medium' | 'low'): BadgeColor {
    const colorMap = {
      'high': 'danger' as BadgeColor,
      'medium': 'warning' as BadgeColor,
      'low': 'info' as BadgeColor
    };
    return colorMap[priority];
  }

  static createCountBadgeConfig(count: number, options?: {
    maxCount?: number;
    color?: BadgeColor;
    size?: BadgeSize;
  }) {
    return {
      count,
      maxCount: options?.maxCount || BadgeComponent.DEFAULT_MAX_COUNT,
      color: options?.color || 'danger',
      size: options?.size || 'md',
      variant: 'solid' as BadgeVariant
    };
  }

  static createStatusDotConfig(color: BadgeColor = 'primary', pulse: boolean = false) {
    return {
      variant: 'dot' as BadgeVariant,
      color,
      pulse,
      dot: true
    };
  }

  // ✅ Convenience static factory methods
  static primary(content: string | number, size: BadgeSize = 'sm') {
    return {
      content,
      variant: 'solid' as BadgeVariant,
      color: 'primary' as BadgeColor,
      size
    };
  }

  static success(content: string | number, size: BadgeSize = 'sm') {
    return {
      content,
      variant: 'solid' as BadgeVariant,
      color: 'success' as BadgeColor,
      size
    };
  }

  static danger(content: string | number, size: BadgeSize = 'sm') {
    return {
      content,
      variant: 'solid' as BadgeVariant,
      color: 'danger' as BadgeColor,
      size
    };
  }

  static warning(content: string | number, size: BadgeSize = 'sm') {
    return {
      content,
      variant: 'solid' as BadgeVariant,
      color: 'warning' as BadgeColor,
      size
    };
  }

  static dot(color: BadgeColor, size: BadgeSize = 'sm') {
    return {
      variant: 'dot' as BadgeVariant,
      color,
      size
    };
  }

  static count(count: number, size: BadgeSize = 'xs') {
    return {
      content: count,
      variant: 'solid' as BadgeVariant,
      color: 'danger' as BadgeColor,
      size
    };
  }

  static notification(count: number, position: BadgePosition, size: BadgeSize = 'xs') {
    return {
      content: count,
      variant: 'solid' as BadgeVariant,
      color: 'danger' as BadgeColor,
      size,
      position
    };
  }
}