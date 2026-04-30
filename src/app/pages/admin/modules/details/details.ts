import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SharedModule } from 'primeng/api';

import { ButtonComponent } from '@atoms/button';
import { CardComponent } from '@atoms/card';
import { TableComponent } from '@organisms/table';
import { ModuleService } from '@services/api/aaa/module.service';
import { ModuleDetail, Permission } from '@interfaces/aaa';
import { TableColumn } from '@interfaces/table.interface';
import { ModuleFormComponent, ModuleFormValue } from '../form/form';

@Component({
  selector: 'app-admin-module-details',
  standalone: true,
  imports: [
    ButtonComponent,
    CardComponent,
    TableComponent,
    SharedModule,
    ModuleFormComponent
  ],
  templateUrl: './details.html',
  styleUrls: ['./details.css']
})
export class AdminModuleDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(ModuleService);

  protected readonly module = signal<ModuleDetail | undefined>(undefined);
  protected readonly loading = signal<boolean>(true);
  protected readonly error = signal<boolean>(false);

  protected readonly permissions = signal<Permission[]>([]);
  protected readonly permissionsLoading = signal<boolean>(false);
  protected readonly permissionsForbidden = signal<boolean>(false);

  protected readonly isEditModalVisible = signal<boolean>(false);
  protected readonly saving = signal<boolean>(false);

  protected readonly permissionColumns: TableColumn[] = [
    { field: 'name', header: 'Nombre' },
    { field: 'code', header: 'Código' },
    { field: 'status', header: 'Estado' }
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
    const current = this.module();
    if (!current) return;
    if (!confirm(`¿Eliminar el módulo "${current.name}"?`)) return;
    this.service.delete(current.id).subscribe({
      next: () => this.goBack()
    });
  }

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
