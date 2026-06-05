import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppCategory, CreateAppCategoryDto, UpdateAppCategoryDto } from '@interfaces/app-category.interface';

@Component({
  selector: 'app-app-category-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppCategoryFormComponent {
  private fb = inject(FormBuilder);

  readonly visible = model(false);
  readonly isEditing = input(false);
  readonly current = input<AppCategory | null>(null);
  readonly saving = input(false);

  readonly save = output<CreateAppCategoryDto | UpdateAppCategoryDto>();

  private codeTouched = false;

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    code: ['', [Validators.required, Validators.maxLength(60), Validators.pattern(/^[A-Z0-9_]+$/)]],
    description: [''],
  });

  readonly title = computed(() => (this.isEditing() ? 'Edit app category' : 'New app category'));

  constructor() {
    effect(() => {
      if (!this.visible()) return;
      const c = this.current();
      this.codeTouched = this.isEditing();
      this.form.reset({ name: c?.name ?? '', code: c?.code ?? '', description: c?.description ?? '' });
      if (this.isEditing()) this.form.controls.code.disable();
      else this.form.controls.code.enable();
    });
  }

  private slug(s: string): string {
    return (s || '')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  }

  onNameInput(value: string): void {
    if (!this.isEditing() && !this.codeTouched) {
      this.form.controls.code.setValue(this.slug(value));
    }
  }

  onCodeInput(value: string): void {
    this.codeTouched = true;
    this.form.controls.code.setValue(this.slug(value), { emitEvent: false });
  }

  close(): void { this.visible.set(false); }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();
    const description = v.description.trim() || null;
    if (this.isEditing()) {
      this.save.emit({ name: v.name.trim(), description } satisfies UpdateAppCategoryDto);
    } else {
      this.save.emit({ code: v.code.trim(), name: v.name.trim(), description, status: 'active' } satisfies CreateAppCategoryDto);
    }
  }
}
