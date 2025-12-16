import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type LabelSize = 'small' | 'medium' | 'large';
export type LabelVariant = 'default' | 'secondary' | 'accent';

/**
 * Reusable label component for form fields and UI elements
 * Follows Angular's new best practices with signals and modern patterns
 * @example
 * <app-label 
 *   text="Email Address"
 *   [required]="true"
 *   [for]="inputId"
 *   size="medium">
 * </app-label>
 */
@Component({
  selector: 'app-label',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './label.html',
  styleUrls: ['./label.css']
})
export class LabelComponent {
  // ✅ readonly inputs using signals
  readonly text = input<string>('');
  readonly for = input<string>('');
  readonly size = input<LabelSize>('medium');
  readonly variant = input<LabelVariant>('default');
  readonly required = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  // ✅ protected computed for template usage
  protected readonly labelId = computed(() => 
    `label-${Math.random().toString(36).substring(2, 9)}`
  );

  protected readonly labelClasses = computed(() => [
    'label',
    `label--${this.size()}`,
    `label--${this.variant()}`,
    this.disabled() ? 'label--disabled' : '',
    this.required() ? 'label--required' : ''
  ].filter(Boolean).join(' '));

  protected readonly hasText = computed(() => 
    this.text().length > 0
  );

  protected readonly ariaLabel = computed(() => 
    this.required() ? `${this.text()} (required)` : this.text()
  );
}