import { Component, computed, inject, signal } from '@angular/core';

import {
  DataTableComponent,
  DataTableColumn,
  DataTableCellDirective,
  DataTableGridCardDirective
} from '@organisms/data-table';
import { ConfirmDialogComponent } from '@molecules/confirm-dialog/confirm-dialog';
import { InferenceProviderTypeFormComponent } from '../form/form';
import { AIProviderTypeService } from '@services/api/ai-provider-type.service';
import {
  AIProviderType,
  CreateAIProviderTypeDto,
  UpdateAIProviderTypeDto
} from '@interfaces/ai-provider-type.interface';
import { SearchParams } from '@interfaces/aaa';

@Component({
  selector: 'app-inference-provider-types',
  standalone: true,
  imports: [
    DataTableComponent,
    DataTableCellDirective,
    DataTableGridCardDirective,
    InferenceProviderTypeFormComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './list.html',
  styleUrls: ['./list.css']
})
export class InferenceProviderTypesComponent {
  private service = inject(AIProviderTypeService);

  protected readonly allTypes = signal<AIProviderType[]>([]);
  protected readonly pagedTypes = signal<AIProviderType[]>([]);
  protected readonly totalRecords = signal<number>(0);
  protected readonly loading = signal<boolean>(false);
  protected readonly saving = signal<boolean>(false);
  protected readonly totalCount = computed(() => this.allTypes().length);

  protected readonly isModalVisible = signal<boolean>(false);
  protected readonly isEditing = signal<boolean>(false);
  protected currentType: AIProviderType = { code: '', name: '', description: '' };
  private originalCode = '';

  protected readonly isDeleteVisible = signal<boolean>(false);
  protected readonly deleting = signal<boolean>(false);
  private pendingDelete: AIProviderType | null = null;
  protected get deleteMessage(): string {
    return this.pendingDelete
      ? `Delete the provider type "${this.pendingDelete.name}"?`
      : '';
  }

  private lastQuery: SearchParams = { pageNumber: 1, pageSize: 10 };

  protected readonly columns: DataTableColumn[] = [
    { field: 'name', header: 'Name', sortable: true, type: 'name' },
    { field: 'code', header: 'Code', sortable: true, type: 'template', width: '180px' },
    { field: 'description', header: 'Description', type: 'text' },
    { field: 'actions', header: 'Actions', type: 'template', align: 'right' }
  ];

  constructor() {
    this.loadAll();
  }

  private loadAll(): void {
    this.loading.set(true);
    this.service.getAll().subscribe({
      next: types => {
        this.allTypes.set(types);
        this.applyQuery();
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  protected load(query: SearchParams): void {
    this.lastQuery = query;
    this.applyQuery();
  }

  private applyQuery(): void {
    const q = (this.lastQuery.searchString ?? '').trim().toLowerCase();
    const filtered = q
      ? this.allTypes().filter(t =>
          t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q)
        )
      : this.allTypes();
    const column = this.lastQuery.sortColumn as keyof AIProviderType | undefined;
    const order = this.lastQuery.sortOrder ?? 'asc';
    const sorted = column
      ? [...filtered].sort((a, b) => {
          const av = String(a[column] ?? '').toLowerCase();
          const bv = String(b[column] ?? '').toLowerCase();
          if (av < bv) return order === 'asc' ? -1 : 1;
          if (av > bv) return order === 'asc' ? 1 : -1;
          return 0;
        })
      : filtered;
    const start = (this.lastQuery.pageNumber - 1) * this.lastQuery.pageSize;
    this.pagedTypes.set(sorted.slice(start, start + this.lastQuery.pageSize));
    this.totalRecords.set(sorted.length);
  }

  protected openCreate(): void {
    this.currentType = { code: '', name: '', description: '' };
    this.originalCode = '';
    this.isEditing.set(false);
    this.isModalVisible.set(true);
  }

  protected openEdit(type: AIProviderType): void {
    this.currentType = { ...type };
    this.originalCode = type.code;
    this.isEditing.set(true);
    this.isModalVisible.set(true);
  }

  protected onRowClick(row: unknown): void {
    this.openEdit(row as AIProviderType);
  }

  protected saveType(data: AIProviderType): void {
    this.saving.set(true);
    const onDone = () => {
      this.saving.set(false);
      this.isModalVisible.set(false);
      this.loadAll();
    };
    const onError = () => this.saving.set(false);
    if (this.isEditing()) {
      const dto: UpdateAIProviderTypeDto = { name: data.name, description: data.description };
      this.service.update(this.originalCode, dto).subscribe({ next: onDone, error: onError });
    } else {
      const dto: CreateAIProviderTypeDto = data;
      this.service.create(dto).subscribe({ next: onDone, error: onError });
    }
  }

  protected delete(type: AIProviderType): void {
    this.pendingDelete = type;
    this.isDeleteVisible.set(true);
  }

  protected glyphFor(name: string | null | undefined): string {
    const parts = (name ?? '').trim().split(/\s+|\./).filter(Boolean);
    if (!parts.length) return '—';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  protected confirmDelete(): void {
    const type = this.pendingDelete;
    if (!type) return;
    this.deleting.set(true);
    this.service.delete(type.code).subscribe({
      next: () => {
        this.deleting.set(false);
        this.isDeleteVisible.set(false);
        this.pendingDelete = null;
        this.loadAll();
      },
      error: () => this.deleting.set(false)
    });
  }
}
