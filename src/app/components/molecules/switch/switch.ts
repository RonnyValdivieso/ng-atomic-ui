import { Component, forwardRef, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

/**
 * Reusable Switch component based on PrimeNG ToggleSwitch
 * Implements ControlValueAccessor for form integration.
 */
@Component({
  selector: 'app-switch',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ToggleSwitchModule],
  templateUrl: './switch.html',
  styleUrls: ['./switch.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true
    }
  ]
})
export class SwitchComponent implements ControlValueAccessor {
  // Inputs
  readonly label = input<string>('');
  readonly error = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly trueValue = input<any>(true);
  readonly falseValue = input<any>(false);
  readonly styleClass = input<string>('');

  // Outputs
  readonly onChange = output<any>();

  // Internal state for ControlValueAccessor
  protected value = signal<any>(false);
  protected isDisabled = signal<boolean>(false);

  // ControlValueAccessor callbacks
  private onTouched: () => void = () => {};
  private onChanged: (value: any) => void = () => {};

  writeValue(value: any): void {
    this.value.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  // Event Handlers
  protected onValueChange(event: any): void {
    const newValue = event.checked ? this.trueValue() : this.falseValue();
    this.value.set(newValue);
    this.onChanged(newValue);
    this.onChange.emit(event);
  }

  protected onBlur(): void {
    this.onTouched();
  }

  protected onLabelClick(): void {
    if (this.disabled() || this.isDisabled()) {
      return;
    }
    const newValue = this.value() === this.trueValue() ? this.falseValue() : this.trueValue();
    this.value.set(newValue);
    this.onChanged(newValue);
    this.onChange.emit({ checked: newValue === this.trueValue(), value: newValue });
  }
}
