import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SwitchComponent } from '@molecules/switch';

@Component({
  selector: 'app-switch-guide',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, SwitchComponent],
  templateUrl: './switch-guide.html',
  styleUrls: ['./switch-guide.css']
})
export class SwitchGuideComponent {
  // Basic
  checked = signal(false);

  // Form Integration
  termsControl = new FormControl(false, Validators.requiredTrue);

  // Custom Values
  status = signal('inactive');

  // Loading/Disabled
  isDisabled = signal(true);

  toggleDisabled() {
    this.isDisabled.update(v => !v);
  }

  submitForm() {
    if (this.termsControl.valid) {
      console.log('Form Submitted', this.termsControl.value);
    } else {
      this.termsControl.markAsTouched();
    }
  }
}
