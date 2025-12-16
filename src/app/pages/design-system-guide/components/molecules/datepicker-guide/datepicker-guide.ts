import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatepickerComponent } from '@molecules/datepicker';

@Component({
  selector: 'app-datepicker-guide',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, DatepickerComponent],
  templateUrl: './datepicker-guide.html',
  styleUrls: ['./datepicker-guide.css']
})
export class DatepickerGuideComponent {
  // Basic
  date = signal<Date | null>(null);

  // Range
  rangeDates = signal<Date[] | null>(null);

  // Form Integration
  dateControl = new FormControl<Date | null>(null, Validators.required);

  // Min/Max
  minDate = new Date();
  maxDate = new Date();

  constructor() {
    this.maxDate.setMonth(this.maxDate.getMonth() + 1);
  }

  submitForm() {
    if (this.dateControl.valid) {
      console.log('Form Submitted', this.dateControl.value);
    } else {
      this.dateControl.markAsTouched();
    }
  }
}
