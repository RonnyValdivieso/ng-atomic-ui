import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { DataTableComponent, DataTableColumn, DataTableCellDirective } from '@organisms/data-table';
import { CopyIdButtonComponent } from '@atoms/copy-id-button';
import { ConfirmDialogComponent } from '@molecules/confirm-dialog/confirm-dialog';
import { NotificationTemplate, PaginatedList, SearchParams } from '@interfaces/aaa';
import { NotificationTemplateService } from '@services/api/aaa/notification-template.service';
import { NotificationTemplateFormComponent, NotificationTemplateFormValue } from '../form/form';

@Component({
  selector: 'app-admin-notification-templates-list',
  standalone: true,
  imports: [
    DataTableComponent,
    DataTableCellDirective,
    CopyIdButtonComponent,
    NotificationTemplateFormComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './list.html',
  styleUrls: ['./list.css']
})
export class AdminNotificationTemplatesListComponent {
  private service = inject(NotificationTemplateService);
  private router = inject(Router);

  protected readonly templates = signal<NotificationTemplate[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly saving = signal<boolean>(false);
  protected readonly totalRecords = signal<number>(0);

  protected readonly isModalVisible = signal<boolean>(false);
  protected readonly isEditing = signal<boolean>(false);
  protected currentTemplate: NotificationTemplate | null = null;

  protected readonly isDeleteVisible = signal<boolean>(false);
  protected readonly deleting = signal<boolean>(false);
  protected pendingDelete: NotificationTemplate | null = null;
  protected get deleteMessage(): string {
    return this.pendingDelete ? `Delete the template "${this.pendingDelete.name}"?` : '';
  }

  private lastQuery: SearchParams = { pageNumber: 1, pageSize: 10 };

  protected readonly columns: DataTableColumn[] = [
    { field: 'name', header: 'Name', sortable: true, type: 'name' },
    { field: 'asset', header: 'Asset', type: 'text' },
    { field: 'type', header: 'Type', type: 'text' },
    { field: 'language', header: 'Language', type: 'text' },
    { field: 'actions', header: 'Actions', type: 'template', align: 'right' }
  ];

  protected load(query: SearchParams): void {
    this.lastQuery = query;
    this.loading.set(true);
    this.service.getAll(query).subscribe({
      next: (page: PaginatedList<NotificationTemplate>) => {
        this.templates.set(page.items ?? []);
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
    this.currentTemplate = null;
    this.isEditing.set(false);
    this.isModalVisible.set(true);
  }

  protected openEdit(t: NotificationTemplate): void {
    this.currentTemplate = { ...t };
    this.isEditing.set(true);
    this.isModalVisible.set(true);
  }

  protected viewDetails(t: unknown): void {
    this.router.navigate(['/admin/notification-templates', (t as NotificationTemplate).id]);
  }

  protected save(value: NotificationTemplateFormValue): void {
    this.saving.set(true);
    const onDone = () => {
      this.saving.set(false);
      this.isModalVisible.set(false);
      this.reload();
    };
    const onError = () => this.saving.set(false);

    if (this.isEditing() && this.currentTemplate) {
      this.service.update(this.currentTemplate.id, value).subscribe({ next: onDone, error: onError });
    } else {
      this.service.create(value).subscribe({ next: onDone, error: onError });
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
        this.reload();
      },
      error: () => this.deleting.set(false)
    });
  }
}
