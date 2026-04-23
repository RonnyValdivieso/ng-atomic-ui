import { Component, inject, signal } from '@angular/core';

import { Router } from '@angular/router';
import { SharedModule } from 'primeng/api';
import { TableComponent } from '@organisms/table';
import { ButtonComponent } from '@atoms/button';
import { InstanceService } from '@services/api/aaa/instance.service';
import { Instance, PaginatedList } from '@interfaces/aaa';
import { TableColumn, TablePageEvent } from '@interfaces/table.interface';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-admin-workspaces-list',
  standalone: true,
  imports: [SharedModule, TableComponent, ButtonComponent],
  templateUrl: './list.html'
})
export class AdminWorkspacesListComponent {
  private service = inject(InstanceService);
  private router = inject(Router);

  protected readonly workspaces = signal<Instance[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly totalRecords = signal<number>(0);
  protected readonly pageSize = signal<number>(PAGE_SIZE);

  protected readonly columns: TableColumn[] = [
    { field: 'name', header: 'Name', sortable: true },
    { field: 'domain', header: 'Domain' },
    { field: 'status', header: 'Status' },
    { field: 'organizationId', header: 'Organization' },
    { field: 'actions', header: 'Actions', type: 'template', templateRef: 'actions' }
  ];

  constructor() {
    this.load(1);
  }

  protected load(pageNumber: number, searchString?: string): void {
    this.loading.set(true);
    this.service
      .getAll({ pageNumber, pageSize: this.pageSize(), searchString })
      .subscribe({
        next: (page: PaginatedList<Instance>) => {
          this.workspaces.set(page.items ?? []);
          this.totalRecords.set(page.totalItems ?? 0);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  protected onPage(event: TablePageEvent): void {
    const pageNumber = (event.page ?? 0) + 1;
    if (event.rows && event.rows !== this.pageSize()) {
      this.pageSize.set(event.rows);
    }
    this.load(pageNumber);
  }

  protected open(workspace: Instance): void {
    this.router.navigate(['/admin/workspaces', workspace.id]);
  }
}
