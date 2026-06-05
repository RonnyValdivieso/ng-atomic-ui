import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableComponent, DataTableCellDirective, DataTableGridCardDirective, DataTableColumn } from '@organisms/data-table';
import { ConfirmDialogComponent } from '@molecules/confirm-dialog/confirm-dialog';
import { RowActionsMenuComponent, RowActionsMenuItem } from '@molecules/row-actions-menu/row-actions-menu';
import { SearchParams } from '@interfaces/aaa';
import { AppCategory, CreateAppCategoryDto, UpdateAppCategoryDto } from '@interfaces/app-category.interface';
import { AppCategoryService } from '@services/api/app-category.service';
import { AppCategoryFormComponent } from '../form/form';

@Component({
  selector: 'app-app-categories-list',
  standalone: true,
  imports: [
    DataTableComponent, DataTableCellDirective, DataTableGridCardDirective,
    ConfirmDialogComponent, RowActionsMenuComponent, AppCategoryFormComponent,
  ],
  templateUrl: './list.html',
  styleUrl: './list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppCategoriesListComponent {
  private service = inject(AppCategoryService);
  private router = inject(Router);

  protected readonly columns: DataTableColumn[] = [
    { field: 'code', header: 'Code', sortable: true, type: 'template', width: '200px' },
    { field: 'name', header: 'Name', sortable: true, type: 'name' },
    { field: 'description', header: 'Description', type: 'text' },
    { field: 'status', header: 'Status', sortable: true, type: 'status', width: '140px' },
    { field: 'actions', header: 'Actions', type: 'template', align: 'right', width: '120px' },
  ];

  protected readonly rows = signal<AppCategory[]>([]);
  protected readonly totalRecords = signal(0);
  protected readonly loading = signal(false);

  protected readonly isModalVisible = signal(false);
  protected readonly isEditing = signal(false);
  protected readonly current = signal<AppCategory | null>(null);
  protected readonly saving = signal(false);

  protected readonly isDeleteVisible = signal(false);
  protected readonly deleting = signal(false);
  protected readonly pendingDelete = signal<AppCategory | null>(null);

  private lastQuery: SearchParams = { pageNumber: 1, pageSize: 10 };

  protected get deleteMessage(): string {
    const c = this.pendingDelete();
    return c ? `Delete "${c.name}"? This can't be undone. Apps assigned to it become uncategorized.` : '';
  }

  load(query: SearchParams): void {
    this.lastQuery = query;
    this.loading.set(true);
    this.service.search(query).subscribe({
      next: r => { this.rows.set(r.items); this.totalRecords.set(r.totalCount); this.loading.set(false); },
      error: () => { this.rows.set([]); this.totalRecords.set(0); this.loading.set(false); },
    });
  }

  private reload(): void { this.load(this.lastQuery); }

  onRowClick(row: unknown): void { this.openDetail(row as AppCategory); }
  openDetail(c: AppCategory): void { this.router.navigate(['/admin/app-categories', c.code]); }

  openCreate(): void { this.isEditing.set(false); this.current.set(null); this.isModalVisible.set(true); }
  openEdit(c: AppCategory): void { this.isEditing.set(true); this.current.set(c); this.isModalVisible.set(true); }

  save(dto: CreateAppCategoryDto | UpdateAppCategoryDto): void {
    this.saving.set(true);
    const done = () => { this.saving.set(false); this.isModalVisible.set(false); this.reload(); };
    if (this.isEditing()) {
      this.service.update(this.current()!.code, dto as UpdateAppCategoryDto).subscribe({ next: done, error: () => this.saving.set(false) });
    } else {
      this.service.create(dto as CreateAppCategoryDto).subscribe({ next: done, error: () => this.saving.set(false) });
    }
  }

  toggleStatus(c: AppCategory): void {
    const status = String(c.status).toUpperCase() === 'ACTIVE' ? 'inactive' : 'active';
    this.service.updateStatus(c.code, { status }).subscribe({ next: () => this.reload() });
  }

  askDelete(c: AppCategory): void { this.pendingDelete.set(c); this.isDeleteVisible.set(true); }
  confirmDelete(): void {
    const c = this.pendingDelete(); if (!c) return;
    this.deleting.set(true);
    this.service.delete(c.code).subscribe({
      next: () => { this.deleting.set(false); this.isDeleteVisible.set(false); this.reload(); },
      error: () => { this.deleting.set(false); this.isDeleteVisible.set(false); },
    });
  }

  menuItems(c: AppCategory): RowActionsMenuItem[] {
    const active = String(c.status).toUpperCase() === 'ACTIVE';
    return [
      { label: 'View detail', icon: 'pi-eye', action: () => this.openDetail(c) },
      { divider: true },
      { label: active ? 'Deactivate' : 'Activate', icon: 'pi-power-off', action: () => this.toggleStatus(c) },
      { label: 'Edit', icon: 'pi-pencil', action: () => this.openEdit(c) },
      { divider: true },
      { label: 'Delete', icon: 'pi-trash', danger: true, action: () => this.askDelete(c) },
    ];
  }
}
