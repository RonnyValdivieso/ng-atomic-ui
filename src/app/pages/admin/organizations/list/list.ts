import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { SharedModule } from 'primeng/api';

import { ButtonComponent } from '@atoms/button';
import { TableComponent } from '@organisms/table';
import { Organization, PaginatedList } from '@interfaces/aaa';
import { OrganizationService } from '@services/api/aaa/organization.service';
import { TableColumn, TablePageEvent } from '@interfaces/table.interface';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-admin-organizations-list',
  standalone: true,
  imports: [SharedModule, TableComponent, ButtonComponent],
  templateUrl: './list.html'
})
export class AdminOrganizationsListComponent {
  private service = inject(OrganizationService);
  private router = inject(Router);

  protected readonly organizations = signal<Organization[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly totalRecords = signal<number>(0);
  protected readonly pageSize = signal<number>(PAGE_SIZE);

  protected readonly columns: TableColumn[] = [
    { field: 'name', header: 'Nombre', sortable: true },
    { field: 'description', header: 'Descripción' },
    { field: 'actions', header: 'Acciones', type: 'template', templateRef: 'actions', styleClass: 'text-right' }
  ];

  constructor() {
    this.load(1);
  }

  protected load(pageNumber: number, searchString?: string): void {
    this.loading.set(true);
    this.service
      .getAll({ pageNumber, pageSize: this.pageSize(), searchString })
      .subscribe({
        next: (page: PaginatedList<Organization>) => {
          this.organizations.set(page.items ?? []);
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

  protected open(org: Organization): void {
    this.router.navigate(['/admin/organizations', org.id]);
  }
}
