import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownComponent } from '@molecules/dropdown';

@Component({
  selector: 'app-dropdown-guide',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, DropdownComponent],
  templateUrl: './dropdown-guide.html',
  styleUrls: ['./dropdown-guide.css']
})
export class DropdownGuideComponent {
  // Options
  readonly cities = signal([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
  ]);

  // Basic Usage
  selectedCity = signal<any>(null);

  // Form Integration
  cityControl = new FormControl(null, Validators.required);

  // Filter Usage
  selectedFilteredCity = signal<any>(null);

  // Loading State
  loading = signal(false);

  toggleLoading() {
    this.loading.update(v => !v);
  }

  submitForm() {
    if (this.cityControl.valid) {
      console.log('Form Submitted', this.cityControl.value);
    } else {
      this.cityControl.markAsTouched();
    }
  }
}
