import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { SharedModule } from 'primeng/api';

import { ButtonComponent } from '@atoms/button';
import { TableComponent } from '@organisms/table';
import { Module } from '@interfaces/aaa';
import { ModuleService } from '@services/api/aaa/module.service';
import { TableColumn } from '@interfaces/table.interface';
import { ModuleFormComponent, ModuleFormValue } from '../form/form';

@Component({
  selector: 'app-admin-modules-list',
  standalone: true,
  imports: [SharedModule, TableComponent, ButtonComponent, ModuleFormComponent],
  templateUrl: './list.html'
})
export class AdminModulesListComponent {
  private service = inject(ModuleService);
  private router = inject(Router);

  protected readonly modules = signal<Module[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly saving = signal<boolean>(false);

  protected readonly isModalVisible = signal<boolean>(false);
  protected readonly isEditing = signal<boolean>(false);
  protected currentModule: Module | null = null;

  protected readonly columns: TableColumn[] = [
    { field: 'name', header: 'Nombre', sortable: true },
    { field: 'status', header: 'Estado' },
    { field: 'actions', header: 'Acciones', type: 'template', templateRef: 'actions', styleClass: 'text-right pr-4' }
  ];

  constructor() {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.service.getAll().subscribe({
      next: list => {
        this.modules.set(list ?? []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
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
      this.load();
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
    if (!confirm(`¿Eliminar el módulo "${mod.name}"?`)) return;
    this.loading.set(true);
    this.service.delete(mod.id).subscribe({
      next: () => this.load(),
      error: () => this.loading.set(false)
    });
  }
}
