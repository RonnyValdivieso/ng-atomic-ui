import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { SharedModule } from 'primeng/api';

import { ButtonComponent } from '@atoms/button';
import { ConfirmDialogComponent } from '@molecules/confirm-dialog/confirm-dialog';
import { TableComponent } from '@organisms/table';
import { Module, PaginatedList } from '@interfaces/aaa';
import { ModuleService } from '@services/api/aaa/module.service';
import { TableColumn, TablePageEvent } from '@interfaces/table.interface';
import { ModuleFormComponent, ModuleFormValue } from '../form/form';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-admin-modules-list',
  standalone: true,
  imports: [SharedModule, TableComponent, ButtonComponent, ModuleFormComponent, ConfirmDialogComponent],
  templateUrl: './list.html'
})
export class AdminModulesListComponent {
  private service = inject(ModuleService);
  private router = inject(Router);

  protected readonly modules = signal<Module[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly saving = signal<boolean>(false);
  protected readonly totalRecords = signal<number>(0);
  protected readonly pageSize = signal<number>(PAGE_SIZE);
  protected readonly pageNumber = signal<number>(1);

  protected readonly isModalVisible = signal<boolean>(false);
  protected readonly isEditing = signal<boolean>(false);
  protected currentModule: Module | null = null;

  protected readonly isDeleteVisible = signal<boolean>(false);
  protected readonly deleting = signal<boolean>(false);
  protected pendingDelete: Module | null = null;
  protected get deleteMessage(): string {
    return this.pendingDelete ? `¿Eliminar el módulo "${this.pendingDelete.name}"?` : '';
  }

  protected readonly columns: TableColumn[] = [
    { field: 'name', header: 'Nombre', sortable: true },
    { field: 'status', header: 'Estado' },
    { field: 'actions', header: 'Acciones', type: 'template', templateRef: 'actions', styleClass: 'text-right pr-4' }
  ];

  constructor() {
    this.load(1);
  }

  protected load(pageNumber: number): void {
    this.loading.set(true);
    this.pageNumber.set(pageNumber);
    this.service.getAll({ pageNumber, pageSize: this.pageSize() }).subscribe({
      next: (page: PaginatedList<Module>) => {
        this.modules.set(page.items ?? []);
        this.totalRecords.set(page.totalItems ?? 0);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  protected onPage(event: TablePageEvent): void {
    const rows = event.rows ?? this.pageSize();
    if (rows !== this.pageSize()) {
      this.pageSize.set(rows);
    }
    const pageNumber = Math.floor((event.first ?? 0) / rows) + 1;
    this.load(pageNumber);
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

  protected viewDetails(mod: Module): void {
    this.router.navigate(['/admin/modules', mod.id]);
  }

  protected save(value: ModuleFormValue): void {
    this.saving.set(true);
    const onDone = () => {
      this.saving.set(false);
      this.isModalVisible.set(false);
      this.load(this.pageNumber());
    };
    const onError = () => this.saving.set(false);

    if (this.isEditing() && this.currentModule) {
      this.service.update(this.currentModule.id, { name: value.name }).subscribe({
        next: onDone,
        error: onError
      });
    } else {
      this.service.create({ name: value.name }).subscribe({
        next: onDone,
        error: onError
      });
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
        this.load(this.pageNumber());
      },
      error: () => this.deleting.set(false)
    });
  }
}
