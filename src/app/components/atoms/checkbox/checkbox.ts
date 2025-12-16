import { Component, ChangeDetectionStrategy, computed, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Checkbox } from 'primeng/checkbox';

/**
 * Checkbox Component - Atom
 * 
 * Wrapper del componente Checkbox de PrimeNG con configuración personalizada
 * y soporte para diferentes tamaños, variantes y estados.
 * 
 * @example
 * <!-- Basic checkbox -->
 * <app-checkbox label="Accept terms" (checkedChange)="onCheck($event)"></app-checkbox>
 * 
 * @example
 * <!-- Controlled checkbox -->
 * <app-checkbox 
 *   label="Subscribe to newsletter"
 *   [checked]="isSubscribed"
 *   (checkedChange)="onSubscriptionChange($event)">
 * </app-checkbox>
 * 
 * @example
 * <!-- Indeterminate state -->
 * <app-checkbox 
 *   label="Select all"
 *   [indeterminate]="true"
 *   (checkedChange)="onSelectAll($event)">
 * </app-checkbox>
 * 
 * @example
 * <!-- Disabled checkbox -->
 * <app-checkbox 
 *   label="Read-only option"
 *   [checked]="true"
 *   [disabled]="true">
 * </app-checkbox>
 */
@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule, FormsModule, Checkbox],
  templateUrl: './checkbox.html',
  styleUrls: ['./checkbox.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.checkbox-wrapper]': 'true',
    '[class.checkbox-wrapper--disabled]': 'disabled()',
  }
})
export class CheckboxComponent {
  /**
   * Label text for the checkbox
   */
  readonly label = input<string>('');

  /**
   * Whether the checkbox is checked
   */
  readonly checked = input<boolean>(false);

  /**
   * Whether the checkbox is in an indeterminate state (partial selection)
   */
  readonly indeterminate = input<boolean>(false);

  /**
   * Whether the checkbox is disabled
   */
  readonly disabled = input<boolean>(false);

  /**
   * Whether the checkbox is required
   */
  readonly required = input<boolean>(false);

  /**
   * Size variant of the checkbox
   */
  readonly size = input<'small' | 'medium' | 'large'>('medium');

  /**
   * Visual variant of the checkbox (for custom styling)
   */
  readonly variant = input<'default' | 'outlined'>('default');

  /**
   * Color scheme (for custom styling)
   */
  readonly color = input<'primary' | 'success' | 'danger'>('primary');

  /**
   * ID for the checkbox input (auto-generated if not provided)
   */
  readonly checkboxId = input<string>(`checkbox-${Math.random().toString(36).substr(2, 9)}`);

  /**
   * Name attribute for the checkbox input
   */
  readonly name = input<string>('');

  /**
   * Value attribute for the checkbox input
   */
  readonly value = input<string>('');

  /**
   * ARIA label for accessibility (defaults to label if not provided)
   */
  readonly ariaLabel = input<string>('');

  /**
   * Event emitted when the checked state changes
   */
  readonly checkedChange = output<boolean>();

  /**
   * Internal state for checked (synced with PrimeNG)
   */
  protected readonly internalChecked = signal<boolean>(false);

  /**
   * Computed CSS classes for custom styling
   */
  protected readonly containerClasses = computed(() => {
    const classes = [
      'checkbox-container',
      `checkbox-container--${this.size()}`,
      `checkbox-container--${this.variant()}`,
      `checkbox-container--${this.color()}`,
    ];

    if (this.disabled()) {
      classes.push('checkbox-container--disabled');
    }

    return classes.join(' ');
  });

  /**
   * Computed ARIA label
   */
  protected readonly computedAriaLabel = computed(() => {
    return this.ariaLabel() || this.label() || 'Checkbox';
  });

  /**
   * Effect to sync internal state with external checked prop
   */
  constructor() {
    effect(() => {
      this.internalChecked.set(this.checked());
    }, { allowSignalWrites: true });
  }

  /**
   * Handle checkbox change from PrimeNG
   */
  protected onChange(event: any): void {
    if (this.disabled()) {
      return;
    }

    const newValue = event.checked;
    this.internalChecked.set(newValue);
    this.checkedChange.emit(newValue);
  }

  /**
   * Public method to programmatically set checked state
   */
  public setChecked(value: boolean): void {
    if (!this.disabled()) {
      this.internalChecked.set(value);
      this.checkedChange.emit(value);
    }
  }

  /**
   * Public method to toggle checked state
   */
  public toggle(): void {
    if (!this.disabled()) {
      const newValue = !this.internalChecked();
      this.internalChecked.set(newValue);
      this.checkedChange.emit(newValue);
    }
  }

  /**
   * Public method to get current checked state
   */
  public isChecked(): boolean {
    return this.internalChecked();
  }
}
