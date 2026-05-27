import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { ButtonComponent } from '@atoms/button';
import { FormFieldComponent } from '@molecules/form-field';
import { ModalComponent } from '@organisms/modal';
import { Permission } from '@interfaces/aaa';

export interface PermissionFormValue {
  description: string;
  value: string;
}

@Component({
  selector: 'app-permission-form',
  standalone: true,
  imports: [ReactiveFormsModule, ModalComponent, ButtonComponent, FormFieldComponent],
  templateUrl: './form.html'
})
export class PermissionFormComponent {
  @Input() visible = false;
  @Input() isEditing = false;
  @Input() saving = false;

  form = new FormGroup({
    description: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    value: new FormControl('', [Validators.required, Validators.maxLength(100)])
  });

  @Input() set current(value: Permission | null) {
    if (value) {
      this.form.patchValue({ description: value.description ?? '', value: value.value ?? '' });
    } else {
      this.form.reset({ description: '', value: '' });
    }
  }

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<PermissionFormValue>();

  protected get modalTitle(): string {
    return this.isEditing ? 'Editar permiso' : 'Nuevo permiso';
  }

  protected closeModal(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  protected onSave(): void {
    if (this.form.valid) {
      this.save.emit(this.form.getRawValue() as PermissionFormValue);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
