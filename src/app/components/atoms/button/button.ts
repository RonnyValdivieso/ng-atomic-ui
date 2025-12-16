import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Enhanced button component powered by PrimeNG Button
 * Maintains our design system API while leveraging PrimeNG's robust functionality
 * @example
 * <app-button 
 *   variant="primary" 
 *   size="medium"
 *   icon="pi pi-save"
 *   [loading]="isLoading"
 *   (clicked)="handleSave()">
 *   Save Changes
 * </app-button>
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './button.html',
  styleUrls: ['./button.css']
})
export class ButtonComponent {
  // ✅ readonly inputs using new signal-based syntax
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('medium');
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly icon = input<string>(''); // Optional icon from PrimeIcons
  readonly label = input<string>(''); // Optional label for PrimeNG button

  // ✅ readonly output
  readonly clicked = output<MouseEvent>();

  // ✅ protected computed for PrimeNG severity mapping
  protected readonly severity = computed(() => {
    switch (this.variant()) {
      case 'primary': return 'primary';
      case 'secondary': return 'secondary'; 
      case 'danger': return 'danger';
      case 'success': return 'success';
      default: return 'primary';
    }
  });

  // ✅ protected computed for PrimeNG size mapping
  protected readonly primeSize = computed(() => {
    switch (this.size()) {
      case 'small': return 'small';
      case 'medium': return undefined; // Default size in PrimeNG
      case 'large': return 'large';
      default: return undefined;
    }
  });

  // ✅ protected computed for state
  protected readonly isInteractive = computed(() => 
    !this.disabled() && !this.loading()
  );

  // ✅ protected method with descriptive action name
  protected handleButtonClick(event: MouseEvent): void {
    if (this.isInteractive()) {
      this.clicked.emit(event);
    }
  }
}