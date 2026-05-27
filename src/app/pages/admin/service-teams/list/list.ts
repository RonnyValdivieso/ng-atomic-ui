import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { DataTableComponent, DataTableColumn, DataTableCellDirective } from '@organisms/data-table';
import { ConfirmDialogComponent } from '@molecules/confirm-dialog/confirm-dialog';
import { ServiceTeamService } from '@services/api/aaa/service-team.service';
import { PagedResult, ServiceTeam, ServiceTeamStatus, SearchParams } from '@interfaces/aaa';
import { ServiceTeamFormComponent, ServiceTeamFormValue } from '../form/form';

@Component({
  selector: 'app-admin-service-teams-list',
  standalone: true,
  imports: [
    DataTableComponent,
    DataTableCellDirective,
    ServiceTeamFormComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './list.html',
  styleUrls: ['./list.css']
})
export class AdminServiceTeamsListComponent {
  private service = inject(ServiceTeamService);
  private router = inject(Router);

  protected readonly serviceTeams = signal<ServiceTeam[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly saving = signal<boolean>(false);
  protected readonly totalRecords = signal<number>(0);

  protected readonly isModalVisible = signal<boolean>(false);
  protected readonly isEditing = signal<boolean>(false);
  protected currentTeam: ServiceTeam | null = null;

  protected readonly isDeleteVisible = signal<boolean>(false);
  protected readonly deleting = signal<boolean>(false);
  protected pendingDelete: ServiceTeam | null = null;
  protected get deleteMessage(): string {
    return this.pendingDelete
      ? `Delete the team "${this.pendingDelete.name}"? This is rejected if it still has organizations or workspaces assigned.`
      : '';
  }

  private lastQuery: SearchParams = { pageNumber: 1, pageSize: 10 };

  protected readonly columns: DataTableColumn[] = [
    { field: 'name', header: 'Name', sortable: true, type: 'name', sub: 'id' },
    { field: 'email', header: 'Email', type: 'text' },
    { field: 'status', header: 'Status', sortable: true, type: 'status' },
    { field: 'actions', header: 'Actions', type: 'template', align: 'right' }
  ];

  protected load(query: SearchParams): void {
    this.lastQuery = query;
    this.loading.set(true);
    this.service.search(query).subscribe({
      next: (page: PagedResult<ServiceTeam>) => {
        this.serviceTeams.set(page.items ?? []);
        this.totalRecords.set(page.totalCount ?? 0);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  private reload(): void {
    this.load(this.lastQuery);
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

  protected viewDetails(team: unknown): void {
    this.router.navigate(['/admin/service-teams', (team as ServiceTeam).id]);
  }

  protected save(value: ServiceTeamFormValue): void {
    this.saving.set(true);
    const onDone = () => {
      this.saving.set(false);
      this.isModalVisible.set(false);
      this.reload();
    };
    const onError = () => this.saving.set(false);

    if (this.isEditing() && this.currentTeam) {
      this.service.update(this.currentTeam.id, { name: value.name }).subscribe({ next: onDone, error: onError });
    } else {
      this.service.create({ name: value.name }).subscribe({ next: onDone, error: onError });
    }
  }

  protected toggleStatus(team: ServiceTeam): void {
    const next: ServiceTeamStatus = team.status === 'Active' ? 'Inactive' : 'Active';
    this.service.updateStatus(team.id, { status: next }).subscribe({ next: () => this.reload() });
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
        this.reload();
      },
      error: () => this.deleting.set(false)
    });
  }
}
