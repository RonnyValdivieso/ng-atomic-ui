import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalComponent } from '@organisms/modal';
import { ButtonComponent } from '@atoms/button';
import { FormFieldComponent } from '@molecules/form-field';
import { ServiceTeam } from '@interfaces/aaa';

export interface ServiceTeamFormValue {
  name: string;
}

@Component({
  selector: 'app-service-team-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent, ButtonComponent, FormFieldComponent],
  templateUrl: './form.html'
})
export class ServiceTeamFormComponent {
  @Input() visible = false;
  @Input() isEditing = false;
  @Input() saving = false;

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(100)])
  });

  @Input() set current(value: ServiceTeam | null) {
    if (value) {
      this.form.patchValue({ name: value.name ?? '' });
    } else {
      this.form.reset({ name: '' });
    }
  }

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<ServiceTeamFormValue>();

  protected get modalTitle(): string {
    return this.isEditing ? 'Edit Service Team' : 'New Service Team';
  }

  protected closeModal(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  protected onSave(): void {
    if (this.form.valid) {
      this.save.emit(this.form.getRawValue() as ServiceTeamFormValue);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
