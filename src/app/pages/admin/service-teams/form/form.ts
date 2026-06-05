import { Component, EventEmitter, HostListener, Input, Output, signal } from '@angular/core';

import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ServiceTeam } from '@interfaces/aaa';

/**
 * Form payload emitted by the Service Team modal. On create, every field
 * (including the two picture files) can be sent. On edit, only the textual
 * fields are populated — the parent component decides which call to make.
 */
export interface ServiceTeamFormValue {
  name: string;
  email?: string | null;
  phone?: string | null;
  code?: string | null;
  address?: string | null;
  squarePicture?: File | null;
  rectangularPicture?: File | null;
}

/**
 * Service Team create/edit modal. Implements the redesign's native modal
 * pattern (veil + card) instead of wrapping PrimeNG's `p-dialog`, so the
 * visual language matches the redesigned lists.
 */
@Component({
  selector: 'app-service-team-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrls: ['./form.css']
})
export class ServiceTeamFormComponent {
  @Input() visible = false;
  @Input() isEditing = false;
  @Input() saving = false;

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    code: new FormControl<string>('', [Validators.required, Validators.maxLength(40)]),
    email: new FormControl<string>('', [Validators.email, Validators.maxLength(254)]),
    phone: new FormControl<string>('', [Validators.maxLength(40)]),
    address: new FormControl<string>('', [Validators.maxLength(255)])
  });

  /** Once the user edits Code by hand we stop deriving it from Name. */
  private codeManuallyEdited = false;

  /** Picked files (kept outside the FormGroup since they aren't validated). */
  protected readonly squareFile = signal<File | null>(null);
  protected readonly rectFile = signal<File | null>(null);

  /** Object URLs created locally so we can release them on replace/clear. */
  protected readonly squarePreview = signal<string | null>(null);
  protected readonly rectPreview = signal<string | null>(null);

  @Input() set current(value: ServiceTeam | null) {
    if (value) {
      this.form.patchValue({
        name: value.name ?? '',
        code: value.code ?? '',
        email: value.email ?? '',
        phone: value.phone ?? '',
        address: value.address ?? ''
      });
    } else {
      this.form.reset({ name: '', code: '', email: '', phone: '', address: '' });
    }
    this.codeManuallyEdited = false;
    this.clearFiles();
  }

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<ServiceTeamFormValue>();

  protected get modalTitle(): string {
    return this.isEditing ? 'Edit service team' : 'New service team';
  }

  protected closeModal(): void {
    if (this.saving) return;
    this.visible = false;
    this.visibleChange.emit(false);
  }

  protected onVeilClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.closeModal();
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.visible) this.closeModal();
  }

  /** Slug for the Code field: lowercase, digits and single hyphens only. */
  private slug(value: string): string {
    return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  /** On create, derive Code from Name until the user edits Code by hand. */
  protected onNameInput(): void {
    if (this.isEditing || this.codeManuallyEdited) return;
    const derived = this.slug(this.form.controls.name.value ?? '');
    this.form.controls.code.setValue(derived);
  }

  /** Sanitise Code as the user types and stop auto-deriving it from Name. */
  protected onCodeInput(event: Event): void {
    this.codeManuallyEdited = true;
    const el = event.target as HTMLInputElement;
    const slugged = this.slug(el.value);
    if (slugged !== el.value) this.form.controls.code.setValue(slugged);
  }

  protected onPickSquare(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.setSquareFile(file);
  }

  protected onPickRect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.setRectFile(file);
  }

  protected clearSquare(): void {
    this.setSquareFile(null);
  }

  protected clearRect(): void {
    this.setRectFile(null);
  }

  private setSquareFile(file: File | null): void {
    const prev = this.squarePreview();
    if (prev) URL.revokeObjectURL(prev);
    this.squareFile.set(file);
    this.squarePreview.set(file ? URL.createObjectURL(file) : null);
  }

  private setRectFile(file: File | null): void {
    const prev = this.rectPreview();
    if (prev) URL.revokeObjectURL(prev);
    this.rectFile.set(file);
    this.rectPreview.set(file ? URL.createObjectURL(file) : null);
  }

  private clearFiles(): void {
    this.setSquareFile(null);
    this.setRectFile(null);
  }

  protected onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const value: ServiceTeamFormValue = {
      name: raw.name?.trim() ?? '',
      email: raw.email?.trim() || null,
      phone: raw.phone?.trim() || null,
      code: raw.code?.trim() || null,
      address: raw.address?.trim() || null,
      squarePicture: this.squareFile(),
      rectangularPicture: this.rectFile()
    };
    this.save.emit(value);
  }
}
