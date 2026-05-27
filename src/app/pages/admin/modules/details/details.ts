import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SharedModule } from 'primeng/api';

import { ButtonComponent } from '@atoms/button';
import { CardComponent } from '@atoms/card';
import { ConfirmDialogComponent } from '@molecules/confirm-dialog/confirm-dialog';
import { TableComponent } from '@organisms/table';
import { ModuleService } from '@services/api/aaa/module.service';
import { PermissionService } from '@services/api/aaa/permission.service';
import { ModuleDetail, Permission } from '@interfaces/aaa';
import { TableColumn } from '@interfaces/table.interface';
import { ModuleFormComponent, ModuleFormValue } from '../form/form';
import { PermissionFormComponent, PermissionFormValue } from '../permission-form/form';

@Component({
  selector: 'app-admin-module-details',
  standalone: true,
  imports: [
    ButtonComponent,
    CardComponent,
    TableComponent,
    SharedModule,
    ModuleFormComponent,
    PermissionFormComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './details.html',
  styleUrls: ['./details.css']
})
export class AdminModuleDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(ModuleService);
  private permissionService = inject(PermissionService);

  protected readonly module = signal<ModuleDetail | undefined>(undefined);
  protected readonly loading = signal<boolean>(true);
  protected readonly error = signal<boolean>(false);

  protected readonly permissions = signal<Permission[]>([]);
  protected readonly permissionsLoading = signal<boolean>(false);
  protected readonly permissionsForbidden = signal<boolean>(false);

  protected readonly isEditModalVisible = signal<boolean>(false);
  protected readonly saving = signal<boolean>(false);

  // Permission CRUD state
  protected readonly isPermissionModalVisible = signal<boolean>(false);
  protected readonly isPermissionEditing = signal<boolean>(false);
  protected readonly permissionSaving = signal<boolean>(false);
  protected currentPermission: Permission | null = null;

  protected readonly isModuleDeleteVisible = signal<boolean>(false);
  protected readonly moduleDeleting = signal<boolean>(false);
  protected get moduleDeleteMessage(): string {
    const m = this.module();
    return m ? `¿Eliminar el módulo "${m.name}"?` : '';
  }

  protected readonly isPermissionDeleteVisible = signal<boolean>(false);
  protected readonly permissionDeleting = signal<boolean>(false);
  protected pendingPermissionDelete: Permission | null = null;
  protected get permissionDeleteMessage(): string {
    return this.pendingPermissionDelete
      ? `¿Eliminar el permiso "${this.pendingPermissionDelete.value}"?`
      : '';
  }

  protected readonly permissionColumns: TableColumn[] = [
    { field: 'description', header: 'Descripción' },
    { field: 'value', header: 'Valor' },
    { field: 'actions', header: 'Acciones', type: 'template', templateRef: 'permissionActions', styleClass: 'text-right pr-4' }
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set(true);
      this.loading.set(false);
      return;
    }
    this.load(id);
  }

  protected goBack(): void {
    this.router.navigate(['/admin/modules']);
  }

  protected openEdit(): void {
    this.isEditModalVisible.set(true);
  }

  protected save(value: ModuleFormValue): void {
    const current = this.module();
    if (!current) return;
    this.saving.set(true);
    this.service.update(current.id, { name: value.name }).subscribe({
      next: () => {
        this.saving.set(false);
        this.isEditModalVisible.set(false);
        this.load(current.id);
      },
      error: () => this.saving.set(false)
    });
  }

  protected delete(): void {
    if (!this.module()) return;
    this.isModuleDeleteVisible.set(true);
  }

  protected confirmModuleDelete(): void {
    const current = this.module();
    if (!current) return;
    this.moduleDeleting.set(true);
    this.service.delete(current.id).subscribe({
      next: () => {
        this.moduleDeleting.set(false);
        this.isModuleDeleteVisible.set(false);
        this.goBack();
      },
      error: () => this.moduleDeleting.set(false)
    });
  }

  // ---------- Permission actions ----------

  protected openCreatePermission(): void {
    this.currentPermission = null;
    this.isPermissionEditing.set(false);
    this.isPermissionModalVisible.set(true);
  }

  protected openEditPermission(permission: Permission): void {
    this.currentPermission = { ...permission };
    this.isPermissionEditing.set(true);
    this.isPermissionModalVisible.set(true);
  }

  protected savePermission(value: PermissionFormValue): void {
    const mod = this.module();
    if (!mod) return;
    this.permissionSaving.set(true);
    const onDone = () => {
      this.permissionSaving.set(false);
      this.isPermissionModalVisible.set(false);
      this.loadPermissions(mod.id);
    };
    const onError = () => this.permissionSaving.set(false);

    if (this.isPermissionEditing() && this.currentPermission) {
      this.permissionService
        .update(this.currentPermission.id, { ...value, moduleId: mod.id })
        .subscribe({ next: onDone, error: onError });
    } else {
      this.permissionService
        .create({ ...value, moduleId: mod.id })
        .subscribe({ next: onDone, error: onError });
    }
  }

  protected deletePermission(permission: Permission): void {
    this.pendingPermissionDelete = permission;
    this.isPermissionDeleteVisible.set(true);
  }

  protected confirmPermissionDelete(): void {
    const mod = this.module();
    const permission = this.pendingPermissionDelete;
    if (!mod || !permission) return;
    this.permissionDeleting.set(true);
    this.permissionService.delete(permission.id).subscribe({
      next: () => {
        this.permissionDeleting.set(false);
        this.isPermissionDeleteVisible.set(false);
        this.pendingPermissionDelete = null;
        this.loadPermissions(mod.id);
      },
      error: () => this.permissionDeleting.set(false)
    });
  }

  // ---------- Loading ----------

  private load(id: string): void {
    this.loading.set(true);
    this.error.set(false);
    this.service.getById(id).subscribe({
      next: mod => {
        this.module.set(mod);
        this.loading.set(false);
        this.loadPermissions(id);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  private loadPermissions(id: string): void {
    this.permissionsLoading.set(true);
    this.permissionsForbidden.set(false);
    this.service.getPermissions(id).subscribe({
      next: list => {
        this.permissions.set(list ?? []);
        this.permissionsLoading.set(false);
      },
      error: err => {
        if (err?.status === 403) this.permissionsForbidden.set(true);
        this.permissions.set([]);
        this.permissionsLoading.set(false);
      }
    });
  }
}
