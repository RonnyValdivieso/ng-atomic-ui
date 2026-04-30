import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { ButtonComponent } from '@atoms/button';
import { FormFieldComponent } from '@molecules/form-field';
import { ModalComponent } from '@organisms/modal';
import { NotificationTemplate } from '@interfaces/aaa';

export interface NotificationTemplateFormValue {
  asset: string;
  type: string;
  name: string;
  code: string | null;
  language: string;
  template: string;
}

@Component({
  selector: 'app-notification-template-form',
  standalone: true,
  imports: [ReactiveFormsModule, ModalComponent, ButtonComponent, FormFieldComponent],
  templateUrl: './form.html'
})
export class NotificationTemplateFormComponent {
  @Input() visible = false;
  @Input() isEditing = false;
  @Input() saving = false;

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    asset: new FormControl('', [Validators.required]),
    type: new FormControl('EMAIL', [Validators.required]),
    language: new FormControl('en', [Validators.required, Validators.maxLength(10)]),
    code: new FormControl<string | null>(null),
    template: new FormControl('', [Validators.required])
  });

  @Input() set current(value: NotificationTemplate | null) {
    if (value) {
      this.form.patchValue({
        name: value.name ?? '',
        asset: value.asset ?? '',
        type: value.type ?? 'EMAIL',
        language: value.language ?? 'en',
        code: value.code ?? null,
        template: value.template ?? ''
      });
    } else {
      this.form.reset({
        name: '',
        asset: '',
        type: 'EMAIL',
        language: 'en',
        code: null,
        template: ''
      });
    }
  }

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<NotificationTemplateFormValue>();

  protected get modalTitle(): string {
    return this.isEditing ? 'Editar plantilla' : 'Nueva plantilla';
  }

  protected closeModal(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  protected onSave(): void {
    if (this.form.valid) {
      this.save.emit(this.form.getRawValue() as NotificationTemplateFormValue);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
