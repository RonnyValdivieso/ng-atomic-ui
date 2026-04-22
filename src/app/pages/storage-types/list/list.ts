import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { SharedModule } from 'primeng/api';
import { TableComponent } from '@organisms/table';
import { ButtonComponent } from '@atoms/button';
import { StorageTypeFormComponent } from '../form/form';
import { AIStorageTypeService } from '@services/api/ai-storage-type.service';
import { AIStorageType, CreateAIStorageTypeDto, UpdateAIStorageTypeDto } from '@interfaces/ai-storage-type.interface';
import { TableColumn } from '@interfaces/table.interface';

@Component({
  selector: 'app-storage-types',
  standalone: true,
  imports: [
    FormsModule,
    SharedModule,
    TableComponent,
    ButtonComponent,
    StorageTypeFormComponent
],
  templateUrl: './list.html',
  styleUrls: ['./list.css']
})
export class StorageTypesComponent {
  private service = inject(AIStorageTypeService);
  private router = inject(Router);
  
  // State
  types = signal<AIStorageType[]>([]);
  loading = signal<boolean>(false);
  saving = signal<boolean>(false);
  isModalVisible = signal<boolean>(false);
  isEditing = signal<boolean>(false);

  // Form Data
  currentType: AIStorageType = { code: '', name: '', description: '' };
  originalCode: string = '';

  // Table Config
  columns: TableColumn[] = [
    { field: 'code', header: 'Code' },
    { field: 'name', header: 'Name' },
    { field: 'description', header: 'Description' },
    { field: 'actions', header: 'Actions', type: 'template', templateRef: 'actions' }
  ];

  constructor() {
    this.loadTypes();
  }

  loadTypes() {
    this.loading.set(true);
    this.service.getAll().subscribe({
      next: (data) => {
        this.types.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  openCreateModal() {
    this.currentType = { code: '', name: '', description: '' };
    this.isEditing.set(false);
    this.isModalVisible.set(true);
  }

  openEditModal(type: AIStorageType) {
    this.currentType = { ...type };
    this.originalCode = type.code;
    this.isEditing.set(true);
    this.isModalVisible.set(true);
  }

  viewDetails(type: AIStorageType) {
    this.router.navigate(['/workspace/storage-types', type.code]);
  }

  closeModal() {
    this.isModalVisible.set(false);
  }

  saveType(typeData: AIStorageType) {
    this.saving.set(true);
    if (this.isEditing()) {
      const dto: UpdateAIStorageTypeDto = {
        name: typeData.name,
        description: typeData.description
      };
      
      this.service.update(this.originalCode, dto).subscribe({
        next: () => {
          this.loadTypes();
          this.closeModal();
          this.saving.set(false);
        },
        error: () => this.saving.set(false)
      });
    } else {
      const dto: CreateAIStorageTypeDto = typeData;
      this.service.create(dto).subscribe({
        next: () => {
          this.loadTypes();
          this.closeModal();
          this.saving.set(false);
        },
        error: () => this.saving.set(false)
      });
    }
  }

  deleteType(type: AIStorageType) {
    if (confirm(`Are you sure you want to delete ${type.name}?`)) {
      this.loading.set(true);
      this.service.delete(type.code).subscribe({
        next: () => this.loadTypes(),
        error: () => this.loading.set(false)
      });
    }
  }
}
