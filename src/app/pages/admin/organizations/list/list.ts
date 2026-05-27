import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { DataTableComponent, DataTableColumn } from '@organisms/data-table';
import { OrganizationService } from '@services/api/aaa/organization.service';
import { Organization, PaginatedList, SearchParams } from '@interfaces/aaa';

@Component({
  selector: 'app-admin-organizations-list',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './list.html',
  styleUrls: ['./list.css']
})
export class AdminOrganizationsListComponent {
  private service = inject(OrganizationService);
  private router = inject(Router);

  protected readonly organizations = signal<Organization[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly totalRecords = signal<number>(0);

  protected readonly columns: DataTableColumn[] = [
    { field: 'name', header: 'Name', sortable: true, type: 'name' },
    { field: 'ownerName', header: 'Owner', sortable: true, type: 'text' },
    { field: 'email', header: 'Email', type: 'text' },
    { field: 'status', header: 'Status', sortable: true, type: 'status' },
    { field: 'actions', header: 'Actions', type: 'actions', align: 'right' }
  ];

  protected load(query: SearchParams): void {
    this.loading.set(true);
    this.service.getAll(query).subscribe({
      next: (page: PaginatedList<Organization>) => {
        this.organizations.set(page.items ?? []);
        this.totalRecords.set(page.totalItems ?? 0);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  protected open(row: unknown): void {
    this.router.navigate(['/admin/organizations', (row as Organization).id]);
  }
}
