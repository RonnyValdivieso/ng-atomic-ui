import { Component, forwardRef, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

/**
 * Reusable Dropdown component based on PrimeNG Select
 * Implements ControlValueAccessor for form integration.
 */
@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SelectModule],
  templateUrl: './dropdown.html',
  styleUrls: ['./dropdown.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true
    }
  ]
})
export class DropdownComponent implements ControlValueAccessor {
  // Inputs
  readonly options = input<any[]>([]);
  readonly optionLabel = input<string | undefined>(undefined);
  readonly optionValue = input<string | undefined>(undefined);
  readonly placeholder = input<string>('');
  readonly filter = input<boolean>(false);
  readonly showClear = input<boolean>(false);
  readonly label = input<string>('');
  readonly error = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly styleClass = input<string>('');

  // Outputs
  readonly onChange = output<any>();

  // Internal state for ControlValueAccessor
  protected value = signal<any>(null);
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
    const newValue = event.value;
    this.value.set(newValue);
    this.onChanged(newValue);
    this.onChange.emit(event);
  }

  protected onBlur(): void {
    this.onTouched();
  }
}
