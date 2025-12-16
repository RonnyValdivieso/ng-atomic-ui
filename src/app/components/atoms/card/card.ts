import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from 'primeng/card';

/**
 * Card Component - Atom
 * 
 * Wrapper del componente Card de PrimeNG con configuración personalizada
 * y soporte para diferentes tamaños y variantes.
 * 
 * @example
 * <!-- Basic card -->
 * <app-card header="Card Title">
 *   Card content goes here
 * </app-card>
 * 
 * @example
 * <!-- Card with subtitle and footer -->
 * <app-card 
 *   header="User Profile"
 *   subheader="Active since 2024"
 *   footer="Last updated: Today">
 *   User information content
 * </app-card>
 * 
 * @example
 * <!-- Elevated card -->
 * <app-card header="Important Notice" [elevation]="3">
 *   This is an elevated card with shadow
 * </app-card>
 * 
 * @example
 * <!-- Outlined card -->
 * <app-card header="Settings" variant="outlined">
 *   Settings content
 * </app-card>
 */
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, Card],
  templateUrl: './card.html',
  styleUrls: ['./card.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.card-wrapper]': 'true',
  }
})
export class CardComponent {
  /**
   * Header title of the card
   */
  readonly header = input<string>('');

  /**
   * Subheader or subtitle text
   */
  readonly subheader = input<string>('');

  /**
   * Footer content text
   */
  readonly footer = input<string>('');

  /**
   * Size variant of the card
   */
  readonly size = input<'small' | 'medium' | 'large'>('medium');

  /**
   * Visual variant of the card
   */
  readonly variant = input<'default' | 'outlined' | 'elevated'>('default');

  /**
   * Elevation level for shadow (0-5)
   */
  readonly elevation = input<0 | 1 | 2 | 3 | 4 | 5>(1);

  /**
   * Whether the card is hoverable (adds hover effect)
   */
  readonly hoverable = input<boolean>(false);

  /**
   * Whether to remove padding from card content
   */
  readonly noPadding = input<boolean>(false);

  /**
   * Custom CSS class for the card
   */
  readonly styleClass = input<string>('');

  /**
   * Computed CSS classes for the card wrapper
   */
  protected readonly cardClasses = computed(() => {
    const classes = [
      'card-atom',
      `card-atom--${this.size()}`,
      `card-atom--${this.variant()}`,
      `card-atom--elevation-${this.elevation()}`,
      `bg-surface-0`,
      `text-primary-0`
    ];

    if (this.hoverable()) {
      classes.push('card-atom--hoverable');
    }

    if (this.noPadding()) {
      classes.push('card-atom--no-padding');
    }

    if (this.styleClass()) {
      classes.push(this.styleClass());
    }

    return classes.join(' ');
  });
}
