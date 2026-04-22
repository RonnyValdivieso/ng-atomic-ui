import { Component, OnInit, inject, signal } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { CardComponent } from '@atoms/card';
import { ButtonComponent } from '@atoms/button';
import { InferenceProviderTypeFormComponent } from '../form/form';
import { AIProviderTypeService } from '@services/api/ai-provider-type.service';
import { AIProviderType } from '@interfaces/ai-provider-type.interface';

@Component({
  selector: 'app-inference-provider-type-details',
  standalone: true,
  imports: [
    CardComponent,
    ButtonComponent,
    InferenceProviderTypeFormComponent
],
  templateUrl: './details.html',
  styleUrls: ['./details.css']
})
export class InferenceProviderTypeDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(AIProviderTypeService);

  type = signal<AIProviderType | undefined>(undefined);
  loading = signal<boolean>(true);
  error = signal<boolean>(false);

  // Edit Modal State
  isEditModalVisible = signal<boolean>(false);
  saving = signal<boolean>(false);

  ngOnInit(): void {
    const code = this.route.snapshot.paramMap.get('code');
    if (code) {
      this.loadType(code);
    } else {
      this.error.set(true);
      this.loading.set(false);
    }
  }

  loadType(code: string): void {
    this.loading.set(true);
    this.error.set(false);
    this.service.getByCode(code).subscribe({
      next: (data) => {
        if (data) {
          this.type.set(data);
        } else {
          this.error.set(true);
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/workspace/inference-provider-types']);
  }

  openEditModal(): void {
    this.isEditModalVisible.set(true);
  }

  saveType(updatedData: AIProviderType): void {
    this.saving.set(true);
    const dto = {
      name: updatedData.name,
      description: updatedData.description
    };
    
    // Use the fixed current code
    const originalCode = this.type()?.code;
    if (originalCode) {
      this.service.update(originalCode, dto).subscribe({
        next: () => {
          this.loadType(updatedData.code);
          this.isEditModalVisible.set(false);
          this.saving.set(false);
        },
        error: () => this.saving.set(false)
      });
    } else {
      this.saving.set(false);
    }
  }

  deleteType(): void {
    const current = this.type();
    if (current && confirm(`Are you sure you want to delete ${current.name}?`)) {
      this.loading.set(true);
      this.service.delete(current.code).subscribe({
        next: () => this.goBack(),
        error: () => this.loading.set(false)
      });
    }
  }
}
