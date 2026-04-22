import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalComponent } from '@organisms/modal';
import { ButtonComponent } from '@atoms/button';
import { FormFieldComponent } from '@molecules/form-field';
import { AIProviderType } from '@interfaces/ai-provider-type.interface';

@Component({
  selector: 'app-inference-provider-type-form',
  standalone: true,
  imports: [ReactiveFormsModule, ModalComponent, ButtonComponent, FormFieldComponent],
  templateUrl: './form.html',
  styleUrls: ['./form.css']
})
export class InferenceProviderTypeFormComponent {
  @Input() visible = false;
  @Input() isEditing = false;
  @Input() saving = false;
  
  // We use Reactive Forms to handle the form state and validation
  form = new FormGroup({
    code: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('')
  });

  @Input() set currentType(value: AIProviderType) {
    if (value) {
      this.form.patchValue({
        code: value.code || '',
        name: value.name || '',
        description: value.description || ''
      });
    } else {
      this.form.reset();
    }
  }
  
  get currentType(): AIProviderType {
    return this.form.getRawValue() as AIProviderType;
  }

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<AIProviderType>();

  get modalTitle(): string {
    return this.isEditing ? 'Edit Inference Provider Type' : 'New Inference Provider Type';
  }

  closeModal(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  onSave(): void {
    if (this.form.valid) {
      this.save.emit(this.currentType);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
