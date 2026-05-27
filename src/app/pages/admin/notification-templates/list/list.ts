import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { SharedModule } from 'primeng/api';

import { ButtonComponent } from '@atoms/button';
import { ConfirmDialogComponent } from '@molecules/confirm-dialog/confirm-dialog';
import { TableComponent } from '@organisms/table';
import { NotificationTemplate, PaginatedList } from '@interfaces/aaa';
import { NotificationTemplateService } from '@services/api/aaa/notification-template.service';
import { TableColumn, TablePageEvent } from '@interfaces/table.interface';
import { NotificationTemplateFormComponent, NotificationTemplateFormValue } from '../form/form';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-admin-notification-templates-list',
  standalone: true,
  imports: [SharedModule, TableComponent, ButtonComponent, NotificationTemplateFormComponent, ConfirmDialogComponent],
  templateUrl: './list.html'
})
export class AdminNotificationTemplatesListComponent {
  private service = inject(NotificationTemplateService);
  private router = inject(Router);

  protected readonly templates = signal<NotificationTemplate[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly saving = signal<boolean>(false);
  protected readonly totalRecords = signal<number>(0);
  protected readonly pageSize = signal<number>(PAGE_SIZE);
  protected readonly pageNumber = signal<number>(1);

  protected readonly isModalVisible = signal<boolean>(false);
  protected readonly isEditing = signal<boolean>(false);
  protected currentTemplate: NotificationTemplate | null = null;

  protected readonly isDeleteVisible = signal<boolean>(false);
  protected readonly deleting = signal<boolean>(false);
  protected pendingDelete: NotificationTemplate | null = null;
  protected get deleteMessage(): string {
    return this.pendingDelete ? `¿Eliminar la plantilla "${this.pendingDelete.name}"?` : '';
  }

  protected readonly columns: TableColumn[] = [
    { field: 'name', header: 'Nombre', sortable: true },
    { field: 'asset', header: 'Asset' },
    { field: 'type', header: 'Tipo' },
    { field: 'language', header: 'Idioma' },
    { field: 'actions', header: 'Acciones', type: 'template', templateRef: 'actions', styleClass: 'text-right pr-4' }
  ];

  constructor() {
    this.load(1);
  }

  protected load(pageNumber: number): void {
    this.loading.set(true);
    this.pageNumber.set(pageNumber);
    this.service.getAll({ pageNumber, pageSize: this.pageSize() }).subscribe({
      next: (page: PaginatedList<NotificationTemplate>) => {
        this.templates.set(page.items ?? []);
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
    this.currentTemplate = null;
    this.isEditing.set(false);
    this.isModalVisible.set(true);
  }

  protected openEdit(t: NotificationTemplate): void {
    this.currentTemplate = { ...t };
    this.isEditing.set(true);
    this.isModalVisible.set(true);
  }

  protected viewDetails(t: NotificationTemplate): void {
    this.router.navigate(['/admin/notification-templates', t.id]);
  }

  protected save(value: NotificationTemplateFormValue): void {
    this.saving.set(true);
    const onDone = () => {
      this.saving.set(false);
      this.isModalVisible.set(false);
      this.load(this.pageNumber());
    };
    const onError = () => this.saving.set(false);

    if (this.isEditing() && this.currentTemplate) {
      this.service.update(this.currentTemplate.id, value).subscribe({
        next: onDone,
        error: onError
      });
    } else {
      this.service.create(value).subscribe({
        next: onDone,
        error: onError
      });
    }
  }

  protected delete(t: NotificationTemplate): void {
    this.pendingDelete = t;
    this.isDeleteVisible.set(true);
  }

  protected confirmDelete(): void {
    const t = this.pendingDelete;
    if (!t) return;
    this.deleting.set(true);
    this.service.delete(t.id).subscribe({
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
