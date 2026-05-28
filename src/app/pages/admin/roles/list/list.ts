import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { DataTableComponent, DataTableColumn, DataTableCellDirective } from '@organisms/data-table';
import { CopyIdButtonComponent } from '@atoms/copy-id-button';
import { ConfirmDialogComponent } from '@molecules/confirm-dialog/confirm-dialog';
import { PaginatedList, Role, SearchParams } from '@interfaces/aaa';
import { RoleService } from '@services/api/aaa/role.service';
import { RoleFormComponent, RoleFormValue } from '../form/form';
import { environment } from '@env/environment';

const GLOBAL_SCOPE = '00000000-0000-0000-0000-000000000000';

@Component({
  selector: 'app-admin-roles-list',
  standalone: true,
  imports: [
    DataTableComponent,
    DataTableCellDirective,
    CopyIdButtonComponent,
    RoleFormComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './list.html',
  styleUrls: ['./list.css']
})
export class AdminRolesListComponent {
  private service = inject(RoleService);
  private router = inject(Router);

  protected readonly roles = signal<Role[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly saving = signal<boolean>(false);
  protected readonly totalRecords = signal<number>(0);

  protected readonly isModalVisible = signal<boolean>(false);
  protected readonly isEditing = signal<boolean>(false);
  protected currentRole: Role | null = null;

  protected readonly isDeleteVisible = signal<boolean>(false);
  protected readonly deleting = signal<boolean>(false);
  protected pendingDelete: Role | null = null;
  protected get deleteMessage(): string {
    return this.pendingDelete ? `Delete the role "${this.pendingDelete.name}"?` : '';
  }

  private lastQuery: SearchParams = { pageNumber: 1, pageSize: 10 };

  protected readonly columns: DataTableColumn[] = [
    { field: 'name', header: 'Name', sortable: true, type: 'name' },
    {
      field: 'scope',
      header: 'Scope',
      type: 'text',
      value: row => (this.isGlobal(row as Role) ? 'Global' : 'Instance')
    },
    { field: 'permissionCount', header: 'Permissions', type: 'text' },
    { field: 'moduleCount', header: 'Modules', type: 'text' },
    { field: 'status', header: 'Status', sortable: true, type: 'status' },
    { field: 'actions', header: 'Actions', type: 'template', align: 'right' }
  ];

  private isGlobal(role: Role): boolean {
    return (
      !role.instanceId ||
      role.instanceId === GLOBAL_SCOPE ||
      role.instanceId === environment.defaultInstanceId
    );
  }

  protected load(query: SearchParams): void {
    this.lastQuery = query;
    this.loading.set(true);
    this.service.getAll(query).subscribe({
      next: (page: PaginatedList<Role>) => {
        this.roles.set(page.items ?? []);
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
    this.currentRole = null;
    this.isEditing.set(false);
    this.isModalVisible.set(true);
  }

  protected openEdit(role: Role): void {
    this.currentRole = { ...role };
    this.isEditing.set(true);
    this.isModalVisible.set(true);
  }

  protected viewDetails(role: unknown): void {
    this.router.navigate(['/admin/roles', (role as Role).id]);
  }

  protected save(value: RoleFormValue): void {
    this.saving.set(true);
    const onDone = () => {
      this.saving.set(false);
      this.isModalVisible.set(false);
      this.reload();
    };
    const onError = () => this.saving.set(false);

    if (this.isEditing() && this.currentRole) {
      this.service.update(this.currentRole.id, { name: value.name }).subscribe({ next: onDone, error: onError });
    } else {
      this.service.create({ name: value.name }).subscribe({ next: onDone, error: onError });
    }
  }

  protected delete(role: Role): void {
    this.pendingDelete = role;
    this.isDeleteVisible.set(true);
  }

  protected confirmDelete(): void {
    const role = this.pendingDelete;
    if (!role) return;
    this.deleting.set(true);
    this.service.delete(role.id).subscribe({
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
