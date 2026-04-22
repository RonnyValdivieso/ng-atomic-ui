import { Component, OnInit, inject, signal, computed } from '@angular/core';

import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CardComponent } from '@atoms/card';
import { ButtonComponent } from '@atoms/button';
import { ModalComponent } from '@organisms/modal';
import { FormFieldComponent } from '@molecules/form-field';
import { StorageTypeFormComponent } from '../form/form';
import { AIStorageTypeService } from '@services/api/ai-storage-type.service';
import { AIStorageType, AIStorageTypeParameter } from '@interfaces/ai-storage-type.interface';

@Component({
  selector: 'app-storage-type-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardComponent,
    ButtonComponent,
    ModalComponent,
    FormFieldComponent,
    StorageTypeFormComponent
],
  templateUrl: './details.html',
  styleUrls: ['./details.css']
})
export class StorageTypeDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(AIStorageTypeService);

  type = signal<AIStorageType | undefined>(undefined);
  loading = signal<boolean>(true);
  error = signal<boolean>(false);

  parameters = computed<AIStorageTypeParameter[]>(() => {
    const raw = this.type()?.parameters;
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  });

  // Edit type modal
  isEditModalVisible = signal<boolean>(false);
  saving = signal<boolean>(false);

  // Edit parameter modal
  isEditParamModalVisible = signal<boolean>(false);
  savingParam = signal<boolean>(false);
  editingParamKey = signal<string | null>(null);

  paramForm = new FormGroup({
    key: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    label: new FormControl('', [Validators.required]),
    value: new FormControl(''),
    description: new FormControl('')
  });

  ngOnInit(): void {
    const code = this.route.snapshot.paramMap.get('code');
    if (code) {
      this.loadType(code);
    } else {
      this.error.set(true);
      this.loading.set(false);
    }
  }

  loadType(code: string): void {
    this.loading.set(true);
    this.error.set(false);
    this.service.getByCode(code).subscribe({
      next: (data) => {
        this.type.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/workspace/storage-types']);
  }

  openEditModal(): void {
    this.isEditModalVisible.set(true);
  }

  saveType(updatedData: AIStorageType): void {
    this.saving.set(true);
    const dto = {
      name: updatedData.name,
      description: updatedData.description
    };
    
    // Use the fixed current code
    const originalCode = this.type()?.code;
    if (originalCode) {
      this.service.update(originalCode, dto).subscribe({
        next: () => {
          this.loadType(updatedData.code);
          this.isEditModalVisible.set(false);
          this.saving.set(false);
        },
        error: () => this.saving.set(false)
      });
    } else {
      this.saving.set(false);
    }
  }

  openEditParamModal(param: AIStorageTypeParameter): void {
    this.editingParamKey.set(param.key);
    this.paramForm.setValue({
      key: param.key,
      type: param.type,
      label: param.label,
      value: param.value,
      description: param.description
    });
    this.isEditParamModalVisible.set(true);
  }

  saveParam(): void {
    if (!this.paramForm.valid) {
      this.paramForm.markAllAsTouched();
      return;
    }
    const key = this.editingParamKey();
    if (!key) return;

    this.savingParam.set(true);
    const updated = this.parameters().map(p =>
      p.key === key ? (this.paramForm.value as AIStorageTypeParameter) : p
    );
    this.persistParameters(updated, () => {
      this.isEditParamModalVisible.set(false);
      this.savingParam.set(false);
    }, () => this.savingParam.set(false));
  }

  deleteParam(param: AIStorageTypeParameter): void {
    if (!confirm(`Are you sure you want to delete parameter "${param.label}"?`)) return;
    const updated = this.parameters().filter(p => p.key !== param.key);
    this.persistParameters(updated);
  }

  private persistParameters(params: AIStorageTypeParameter[], onSuccess?: () => void, onError?: () => void): void {
    const code = this.type()?.code;
    if (!code) return;
    this.service.update(code, { parameters: JSON.stringify(params) }).subscribe({
      next: (data) => {
        this.type.set(data);
        onSuccess?.();
      },
      error: () => onError?.()
    });
  }

  deleteType(): void {
    const current = this.type();
    if (current && confirm(`Are you sure you want to delete ${current.name}?`)) {
      this.loading.set(true);
      this.service.delete(current.code).subscribe({
        next: () => this.goBack(),
        error: () => this.loading.set(false)
      });
    }
  }
}
