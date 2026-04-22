import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'primeng/api';
import { TableComponent } from '@organisms/table';
import { ButtonComponent } from '@atoms/button';
import { InferenceProviderTypeFormComponent } from '../form/form';
import { AIProviderTypeService } from '@services/api/ai-provider-type.service';
import { AIProviderType, CreateAIProviderTypeDto, UpdateAIProviderTypeDto } from '@interfaces/ai-provider-type.interface';
import { TableColumn } from '@interfaces/table.interface';

@Component({
  selector: 'app-inference-provider-types',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    SharedModule,
    TableComponent, 
    ButtonComponent,
    InferenceProviderTypeFormComponent
  ],
  templateUrl: './list.html',
  styleUrls: ['./list.css']
})
export class InferenceProviderTypesComponent {
  private service = inject(AIProviderTypeService);
  private router = inject(Router);
  
  // State
  types = signal<AIProviderType[]>([]);
  loading = signal<boolean>(false);
  saving = signal<boolean>(false);
  isModalVisible = signal<boolean>(false);
  isEditing = signal<boolean>(false);

  // Form Data
  currentType: AIProviderType = { code: '', name: '', description: '' };
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

  openEditModal(type: AIProviderType) {
    this.currentType = { ...type };
    this.originalCode = type.code;
    this.isEditing.set(true);
    this.isModalVisible.set(true);
  }

  viewDetails(type: AIProviderType) {
    this.router.navigate(['/workspace/inference-provider-types', type.code]);
  }

  closeModal() {
    this.isModalVisible.set(false);
  }

  saveType(typeData: AIProviderType) {
    this.saving.set(true);
    if (this.isEditing()) {
      const dto: UpdateAIProviderTypeDto = {
        name: typeData.name,
        description: typeData.description
      };
      // Important to use originalCode because the user may have updated the code
      this.service.update(this.originalCode, dto).subscribe({
        next: () => {
          this.loadTypes();
          this.closeModal();
          this.saving.set(false);
        },
        error: () => this.saving.set(false)
      });
    } else {
      const dto: CreateAIProviderTypeDto = typeData;
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

  deleteType(type: AIProviderType) {
    if (confirm(`Are you sure you want to delete ${type.name}?`)) {
      this.loading.set(true);
      this.service.delete(type.code).subscribe({
        next: () => this.loadTypes(),
        error: () => this.loading.set(false)
      });
    }
  }
}
