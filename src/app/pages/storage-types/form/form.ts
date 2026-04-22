import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalComponent } from '@organisms/modal';
import { ButtonComponent } from '@atoms/button';
import { FormFieldComponent } from '@molecules/form-field';
import { AIStorageType } from '@interfaces/ai-storage-type.interface';

@Component({
  selector: 'app-storage-type-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent, ButtonComponent, FormFieldComponent],
  templateUrl: './form.html',
  styleUrls: ['./form.css']
})
export class StorageTypeFormComponent {
  @Input() visible = false;
  @Input() isEditing = false;
  @Input() saving = false;
  
  // We use Reactive Forms to handle the form state and validation
  form = new FormGroup({
    code: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('')
  });

  @Input() set currentType(value: AIStorageType) {
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
  
  get currentType(): AIStorageType {
    return this.form.getRawValue() as AIStorageType;
  }

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<AIStorageType>();

  get modalTitle(): string {
    return this.isEditing ? 'Edit Storage Type' : 'New Storage Type';
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
