import { Component, inject, signal } from '@angular/core';

import { Router } from '@angular/router';
import { SharedModule } from 'primeng/api';
import { TableComponent } from '@organisms/table';
import { ButtonComponent } from '@atoms/button';
import { ConfirmDialogComponent } from '@molecules/confirm-dialog/confirm-dialog';
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
    ServiceTeamFormComponent,
    ConfirmDialogComponent
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

  protected readonly isDeleteVisible = signal<boolean>(false);
  protected readonly deleting = signal<boolean>(false);
  protected pendingDelete: ServiceTeam | null = null;
  protected get deleteMessage(): string {
    return this.pendingDelete
      ? `¿Eliminar el equipo "${this.pendingDelete.name}"? Se rechazará si aún tiene organizaciones o workspaces asignados.`
      : '';
  }

  protected readonly columns: TableColumn[] = [
    { field: 'name', header: 'Nombre', sortable: true },
    { field: 'email', header: 'Email' },
    { field: 'status', header: 'Estado', type: 'template', templateRef: 'status' },
    { field: 'actions', header: 'Acciones', type: 'template', templateRef: 'actions', styleClass: 'text-right pr-4' }
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
    const rows = event.rows ?? this.pageSize();
    if (rows !== this.pageSize()) {
      this.pageSize.set(rows);
    }
    const pageNumber = Math.floor((event.first ?? 0) / rows) + 1;
    this.load(pageNumber);
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
    this.pendingDelete = team;
    this.isDeleteVisible.set(true);
  }

  protected confirmDelete(): void {
    const team = this.pendingDelete;
    if (!team) return;
    this.deleting.set(true);
    this.service.delete(team.id).subscribe({
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
