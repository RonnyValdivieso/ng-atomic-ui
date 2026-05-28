import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { DataTableComponent, DataTableColumn, DataTableCellDirective } from '@organisms/data-table';
import { CopyIdButtonComponent } from '@atoms/copy-id-button';
import { ConfirmDialogComponent } from '@molecules/confirm-dialog/confirm-dialog';
import { Module, PaginatedList, SearchParams } from '@interfaces/aaa';
import { ModuleService } from '@services/api/aaa/module.service';
import { ModuleFormComponent, ModuleFormValue } from '../form/form';

@Component({
  selector: 'app-admin-modules-list',
  standalone: true,
  imports: [
    DataTableComponent,
    DataTableCellDirective,
    CopyIdButtonComponent,
    ModuleFormComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './list.html',
  styleUrls: ['./list.css']
})
export class AdminModulesListComponent {
  private service = inject(ModuleService);
  private router = inject(Router);

  protected readonly modules = signal<Module[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly saving = signal<boolean>(false);
  protected readonly totalRecords = signal<number>(0);

  protected readonly isModalVisible = signal<boolean>(false);
  protected readonly isEditing = signal<boolean>(false);
  protected currentModule: Module | null = null;

  protected readonly isDeleteVisible = signal<boolean>(false);
  protected readonly deleting = signal<boolean>(false);
  protected pendingDelete: Module | null = null;
  protected get deleteMessage(): string {
    return this.pendingDelete ? `Delete the module "${this.pendingDelete.name}"?` : '';
  }

  private lastQuery: SearchParams = { pageNumber: 1, pageSize: 10 };

  protected readonly columns: DataTableColumn[] = [
    { field: 'name', header: 'Name', sortable: true, type: 'name' },
    { field: 'status', header: 'Status', sortable: true, type: 'status' },
    { field: 'actions', header: 'Actions', type: 'template', align: 'right' }
  ];

  protected load(query: SearchParams): void {
    this.lastQuery = query;
    this.loading.set(true);
    this.service.getAll(query).subscribe({
      next: (page: PaginatedList<Module>) => {
        this.modules.set(page.items ?? []);
        this.totalRecords.set(page.totalItems ?? 0);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  private reload(): void {
    this.load(this.lastQuery);
  }

  protected openCreate(): void {
    this.currentModule = null;
    this.isEditing.set(false);
    this.isModalVisible.set(true);
  }

  protected openEdit(mod: Module): void {
    this.currentModule = { ...mod };
    this.isEditing.set(true);
    this.isModalVisible.set(true);
  }

  protected viewDetails(mod: unknown): void {
    this.router.navigate(['/admin/modules', (mod as Module).id]);
  }

  protected save(value: ModuleFormValue): void {
    this.saving.set(true);
    const onDone = () => {
      this.saving.set(false);
      this.isModalVisible.set(false);
      this.reload();
    };
    const onError = () => this.saving.set(false);

    if (this.isEditing() && this.currentModule) {
      this.service.update(this.currentModule.id, { name: value.name }).subscribe({ next: onDone, error: onError });
    } else {
      this.service.create({ name: value.name }).subscribe({ next: onDone, error: onError });
    }
  }

  protected delete(mod: Module): void {
    this.pendingDelete = mod;
    this.isDeleteVisible.set(true);
  }

  protected confirmDelete(): void {
    const mod = this.pendingDelete;
    if (!mod) return;
    this.deleting.set(true);
    this.service.delete(mod.id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.isDeleteVisible.set(false);
        this.pendingDelete = null;
        this.reload();
      },
      error: () => this.deleting.set(false)
    });
  }
}
