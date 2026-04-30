import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { ButtonComponent } from '@atoms/button';
import { FormFieldComponent } from '@molecules/form-field';
import { ModalComponent } from '@organisms/modal';
import { Module } from '@interfaces/aaa';

export interface ModuleFormValue {
  name: string;
}

@Component({
  selector: 'app-module-form',
  standalone: true,
  imports: [ReactiveFormsModule, ModalComponent, ButtonComponent, FormFieldComponent],
  templateUrl: './form.html'
})
export class ModuleFormComponent {
  @Input() visible = false;
  @Input() isEditing = false;
  @Input() saving = false;

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(100)])
  });

  @Input() set current(value: Module | null) {
    if (value) {
      this.form.patchValue({ name: value.name ?? '' });
    } else {
      this.form.reset({ name: '' });
    }
  }

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<ModuleFormValue>();

  protected get modalTitle(): string {
    return this.isEditing ? 'Editar módulo' : 'Nuevo módulo';
  }

  protected closeModal(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  protected onSave(): void {
    if (this.form.valid) {
      this.save.emit(this.form.getRawValue() as ModuleFormValue);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
