import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
export type InputSize = 'small' | 'medium' | 'large';
export type InputVariant = 'filled' | 'outlined';

/**
 * Primeng InputText size type
 */
export type InputComponentSize = 'small' | 'large';

/**
 * Reusable input component that implements ControlValueAccessor
 * Follows Angular's new best practices with signals
 * @example
 * <app-input 
 *   type="email"
 *   placeholder="Enter your email"
 *   [required]="true"
 *   [disabled]="false">
 * </app-input>
 */
@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, InputTextModule],
  templateUrl: './input.html',
  styleUrls: ['./input.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  // ✅ readonly inputs using signals
  readonly type = input<InputType>('text');
  readonly placeholder = input<string>('');
  readonly size = input<InputSize>('medium');
  readonly variant = input<InputVariant | undefined>(undefined);
  readonly required = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly invalid = input<boolean>(false);
  readonly success = input<boolean>(false);

  // ✅ signals for internal state
  private readonly _value = signal<string>('');
  private readonly _disabled = signal<boolean>(false);
  private readonly _focused = signal<boolean>(false);
  private readonly _touched = signal<boolean>(false);

  // ✅ Callbacks for ControlValueAccessor
  private _onChange: (value: string) => void = () => {};
  private _onTouched: () => void = () => {};

  // ✅ protected computed for template usage
	protected readonly componentSize = computed<InputComponentSize | null>(() => {
		switch (this.size()) {
			case 'small':
				return 'small';
			case 'large':
				return 'large';
			default:
				return null;
		}
	});

  protected readonly inputId = computed(() => 
    `input-${Math.random().toString(36).substring(2, 9)}`
  );

  protected readonly inputClasses = computed(() => [
    this._focused() ? 'input--focused' : '',
    this._disabled() ? 'input--disabled' : '',
    this.readonly() ? 'input--readonly' : '',
    this.success() ? 'input--success' : ''
  ].filter(Boolean).join(' '));

  protected readonly hasValue = computed(() => 
    this._value().length > 0
  );

  // ✅ Getters/Setters for ControlValueAccessor
  get value(): string {
    return this._value();
  }

  set value(newValue: string) {
    this._value.set(newValue || '');
    this._onChange(this._value());
  }

  get disabled(): boolean {
    return this._disabled();
  }

  // ✅ protected methods with descriptive names
  protected handleInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
  }

  protected handleInputFocus(): void {
    this._focused.set(true);
  }

  protected handleInputBlur(): void {
    this._focused.set(false);
    this._touched.set(true);
    this._onTouched();
  }

  protected handleInputKeyDown(event: KeyboardEvent): void {
    // Allow parent components to handle specific keys
    // This can be extended for specific input behaviors
  }

  // ✅ ControlValueAccessor implementation
  writeValue(value: string): void {
    this._value.set(value || '');
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