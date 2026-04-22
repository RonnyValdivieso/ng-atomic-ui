import { Component, inject, signal } from '@angular/core';

import { Router } from '@angular/router';
import { SharedModule } from 'primeng/api';
import { TableComponent } from '@organisms/table';
import { ButtonComponent } from '@atoms/button';
import { ServiceTeamService } from '@services/api/aaa/service-team.service';
import {
  PagedResult,
  ServiceTeam,
  ServiceTeamStatus
} from '@interfaces/aaa';
import { TableColumn, TablePageEvent } from '@interfaces/table.interface';
import { ServiceTeamFormComponent, ServiceTeamFormValue } from '../form/form';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-admin-service-teams-list',
  standalone: true,
  imports: [
    SharedModule,
    TableComponent,
    ButtonComponent,
    ServiceTeamFormComponent
],
  templateUrl: './list.html'
})
export class AdminServiceTeamsListComponent {
  private service = inject(ServiceTeamService);
  private router = inject(Router);

  protected readonly serviceTeams = signal<ServiceTeam[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly saving = signal<boolean>(false);
  protected readonly totalRecords = signal<number>(0);
  protected readonly pageSize = signal<number>(PAGE_SIZE);
  protected readonly pageNumber = signal<number>(1);

  protected readonly isModalVisible = signal<boolean>(false);
  protected readonly isEditing = signal<boolean>(false);
  protected currentTeam: ServiceTeam | null = null;

  protected readonly columns: TableColumn[] = [
    { field: 'name', header: 'Name', sortable: true },
    { field: 'status', header: 'Status', type: 'template', templateRef: 'status' },
    { field: 'actions', header: 'Actions', type: 'template', templateRef: 'actions' }
  ];

  constructor() {
    this.load(1);
  }

  protected load(pageNumber: number): void {
    this.loading.set(true);
    this.pageNumber.set(pageNumber);
    this.service
      .search({ pageNumber, pageSize: this.pageSize() })
      .subscribe({
        next: (page: PagedResult<ServiceTeam>) => {
          this.serviceTeams.set(page.items ?? []);
          this.totalRecords.set(page.totalCount ?? 0);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  protected onPage(event: TablePageEvent): void {
    if (event.rows && event.rows !== this.pageSize()) {
      this.pageSize.set(event.rows);
    }
    this.load((event.page ?? 0) + 1);
  }

  protected openCreate(): void {
    this.currentTeam = null;
    this.isEditing.set(false);
    this.isModalVisible.set(true);
  }

  protected openEdit(team: ServiceTeam): void {
    this.currentTeam = { ...team };
    this.isEditing.set(true);
    this.isModalVisible.set(true);
  }

  protected viewDetails(team: ServiceTeam): void {
    this.router.navigate(['/admin/service-teams', team.id]);
  }

  protected save(value: ServiceTeamFormValue): void {
    this.saving.set(true);
    const onDone = () => {
      this.saving.set(false);
      this.isModalVisible.set(false);
      this.load(this.pageNumber());
    };
    const onError = () => this.saving.set(false);

    if (this.isEditing() && this.currentTeam) {
      this.service.update(this.currentTeam.id, { name: value.name }).subscribe({
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

  protected toggleStatus(team: ServiceTeam): void {
    const next: ServiceTeamStatus = team.status === 'Active' ? 'Inactive' : 'Active';
    this.service.updateStatus(team.id, { status: next }).subscribe({
      next: () => this.load(this.pageNumber())
    });
  }

  protected delete(team: ServiceTeam): void {
    if (!confirm(`Delete service team "${team.name}"?\n\nRejected if it still has organization or instance assignments.`)) {
      return;
    }
    this.loading.set(true);
    this.service.delete(team.id).subscribe({
      next: () => this.load(this.pageNumber()),
      error: () => this.loading.set(false)
    });
  }
}
