import { Component, forwardRef, input, signal, computed, viewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputComponent } from '@atoms/input';
import { LabelComponent } from '@atoms/label';

/**
 * Form field molecule component that combines label, input, and validation.
 * Uses InputComponent atom following Atomic Design principles.
 * Implements ControlValueAccessor for reactive forms integration.
 * @example
 * <app-form-field 
 *   label="Email Address" 
 *   type="email" 
 *   size="medium"
 *   placeholder="user@example.com"
 *   [required]="true"
 *   errorMessage="Invalid email format">
 * </app-form-field>
 */
@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, InputComponent, LabelComponent],
  templateUrl: './form-field.html',
  styleUrls: ['./form-field.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldComponent),
      multi: true
    }
  ]
})
export class FormFieldComponent implements ControlValueAccessor {
  // ✅ readonly inputs using signals
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly type = input<'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'>('text');
  readonly size = input<'small' | 'medium' | 'large'>('medium');
  readonly required = input<boolean>(false);
  readonly errorMessage = input<string>('');

  // ✅ ViewChild to access the InputComponent
  private readonly inputComponent = viewChild<InputComponent>('inputRef');

  // ✅ signals for internal state
  protected readonly value = signal<string>('');
  private readonly _disabled = signal<boolean>(false);
  private readonly _touched = signal<boolean>(false);

  // ✅ Callbacks for ControlValueAccessor
  private _onChange: (value: string) => void = () => {};
  private _onTouched: () => void = () => {};

  // ✅ protected computed for template usage
  protected readonly inputId = computed(() => 
    `form-field-${Math.random().toString(36).substring(2, 9)}`
  );

  protected readonly hasError = computed(() => 
    this.errorMessage() && this._touched()
  );

  protected readonly fieldClasses = computed(() => [
    'form-field',
    this.hasError() ? 'form-field--error' : '',
    this._disabled() ? 'form-field--disabled' : ''
  ].filter(Boolean).join(' '));

  get disabled(): boolean {
    return this._disabled();
  }

  protected onInputBlur(): void {
    this._touched.set(true);
    this._onTouched();
  }

  protected onValueChange(newValue: string): void {
    this.value.set(newValue);
    this._onChange(newValue);
  }

  // ✅ ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value.set(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }
}