import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { SharedModule } from 'primeng/api';

import { ButtonComponent } from '@atoms/button';
import { ConfirmDialogComponent } from '@molecules/confirm-dialog/confirm-dialog';
import { TableComponent } from '@organisms/table';
import { PaginatedList, Role } from '@interfaces/aaa';
import { RoleService } from '@services/api/aaa/role.service';
import { TableColumn, TablePageEvent } from '@interfaces/table.interface';
import { RoleFormComponent, RoleFormValue } from '../form/form';
import { environment } from '@env/environment';

const PAGE_SIZE = 10;
const GLOBAL_SCOPE = '00000000-0000-0000-0000-000000000000';

@Component({
  selector: 'app-admin-roles-list',
  standalone: true,
  imports: [SharedModule, TableComponent, ButtonComponent, RoleFormComponent, ConfirmDialogComponent],
  templateUrl: './list.html'
})
export class AdminRolesListComponent {
  private service = inject(RoleService);
  private router = inject(Router);

  protected readonly roles = signal<Role[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly saving = signal<boolean>(false);
  protected readonly totalRecords = signal<number>(0);
  protected readonly pageSize = signal<number>(PAGE_SIZE);
  protected readonly pageNumber = signal<number>(1);

  protected readonly isModalVisible = signal<boolean>(false);
  protected readonly isEditing = signal<boolean>(false);
  protected currentRole: Role | null = null;

  protected readonly isDeleteVisible = signal<boolean>(false);
  protected readonly deleting = signal<boolean>(false);
  protected pendingDelete: Role | null = null;
  protected get deleteMessage(): string {
    return this.pendingDelete ? `¿Eliminar el rol "${this.pendingDelete.name}"?` : '';
  }

  protected readonly columns: TableColumn[] = [
    { field: 'name', header: 'Nombre', sortable: true },
    { field: 'scope', header: 'Ámbito', type: 'template', templateRef: 'scope' },
    { field: 'permissionCount', header: 'Permisos' },
    { field: 'moduleCount', header: 'Módulos' },
    { field: 'status', header: 'Estado' },
    { field: 'actions', header: 'Acciones', type: 'template', templateRef: 'actions', styleClass: 'text-right pr-4' }
  ];

  constructor() {
    this.load(1);
  }

  protected isGlobal(role: Role): boolean {
    return !role.instanceId || role.instanceId === GLOBAL_SCOPE || role.instanceId === environment.defaultInstanceId;
  }

  protected load(pageNumber: number): void {
    this.loading.set(true);
    this.pageNumber.set(pageNumber);
    this.service.getAll({ pageNumber, pageSize: this.pageSize() }).subscribe({
      next: (page: PaginatedList<Role>) => {
        this.roles.set(page.items ?? []);
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
    this.currentRole = null;
    this.isEditing.set(false);
    this.isModalVisible.set(true);
  }

  protected openEdit(role: Role): void {
    this.currentRole = { ...role };
    this.isEditing.set(true);
    this.isModalVisible.set(true);
  }

  protected viewDetails(role: Role): void {
    this.router.navigate(['/admin/roles', role.id]);
  }

  protected save(value: RoleFormValue): void {
    this.saving.set(true);
    const onDone = () => {
      this.saving.set(false);
      this.isModalVisible.set(false);
      this.load(this.pageNumber());
    };
    const onError = () => this.saving.set(false);

    if (this.isEditing() && this.currentRole) {
      this.service.update(this.currentRole.id, { name: value.name }).subscribe({
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
        this.load(this.pageNumber());
      },
      error: () => this.deleting.set(false)
    });
  }
}
