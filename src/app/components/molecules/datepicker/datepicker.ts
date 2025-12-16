import { Component, forwardRef, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';

/**
 * Reusable Datepicker component based on PrimeNG DatePicker
 * Implements ControlValueAccessor for form integration.
 */
@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DatePickerModule],
  templateUrl: './datepicker.html',
  styleUrls: ['./datepicker.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true
    }
  ]
})
export class DatepickerComponent implements ControlValueAccessor {
  // Inputs
  readonly label = input<string>('');
  readonly error = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly placeholder = input<string>('');
  readonly dateFormat = input<string>('dd/mm/yy');
  readonly showIcon = input<boolean>(true);
  readonly showTime = input<boolean>(false);
  readonly minDate = input<Date | undefined>(undefined);
  readonly maxDate = input<Date | undefined>(undefined);
  readonly selectionMode = input<'single' | 'multiple' | 'range'>('single');
  readonly styleClass = input<string>('');

  // Outputs
  readonly onSelect = output<any>();
  readonly onBlur = output<void>();

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
  protected onDateSelect(value: any): void {
    this.value.set(value);
    this.onChanged(value);
    this.onSelect.emit(value);
  }

  protected onInputBlur(): void {
    this.onTouched();
    this.onBlur.emit();
  }
}
