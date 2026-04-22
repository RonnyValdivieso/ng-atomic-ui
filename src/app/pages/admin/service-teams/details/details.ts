import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardComponent } from '@atoms/card';
import { ButtonComponent } from '@atoms/button';
import { ServiceTeamService } from '@services/api/aaa/service-team.service';
import {
  ServiceTeamDetail,
  ServiceTeamStatus
} from '@interfaces/aaa';
import { ServiceTeamFormComponent, ServiceTeamFormValue } from '../form/form';

@Component({
  selector: 'app-admin-service-team-details',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    ButtonComponent,
    ServiceTeamFormComponent
  ],
  templateUrl: './details.html'
})
export class AdminServiceTeamDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(ServiceTeamService);

  protected readonly team = signal<ServiceTeamDetail | null>(null);
  protected readonly loading = signal<boolean>(true);
  protected readonly error = signal<boolean>(false);

  protected readonly isEditModalVisible = signal<boolean>(false);
  protected readonly saving = signal<boolean>(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.load(id);
    } else {
      this.error.set(true);
      this.loading.set(false);
    }
  }

  protected load(id: string): void {
    this.loading.set(true);
    this.error.set(false);
    this.service.getById(id).subscribe({
      next: (data) => {
        this.team.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  protected goBack(): void {
    this.router.navigate(['/admin/service-teams']);
  }

  protected openEdit(): void {
    this.isEditModalVisible.set(true);
  }

  protected save(value: ServiceTeamFormValue): void {
    const current = this.team();
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

  protected toggleStatus(): void {
    const current = this.team();
    if (!current) return;
    const next: ServiceTeamStatus = current.status === 'Active' ? 'Inactive' : 'Active';
    this.service.updateStatus(current.id, { status: next }).subscribe({
      next: () => this.load(current.id)
    });
  }

  protected delete(): void {
    const current = this.team();
    if (!current) return;
    if (!confirm(`Delete service team "${current.name}"?\n\nRejected if it still has organization or instance assignments.`)) {
      return;
    }
    this.loading.set(true);
    this.service.delete(current.id).subscribe({
      next: () => this.goBack(),
      error: () => this.loading.set(false)
    });
  }
}
