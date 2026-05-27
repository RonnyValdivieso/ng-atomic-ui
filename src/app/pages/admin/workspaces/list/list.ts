import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import {
  DataTableComponent,
  DataTableColumn,
  DataTableGridCardDirective
} from '@organisms/data-table';
import { CopyIdButtonComponent } from '@atoms/copy-id-button';
import { InstanceService } from '@services/api/aaa/instance.service';
import { Instance, PaginatedList, SearchParams } from '@interfaces/aaa';

@Component({
  selector: 'app-admin-workspaces-list',
  standalone: true,
  imports: [DataTableComponent, DataTableGridCardDirective, CopyIdButtonComponent],
  templateUrl: './list.html',
  styleUrls: ['./list.css']
})
export class AdminWorkspacesListComponent {
  private service = inject(InstanceService);
  private router = inject(Router);

  protected readonly workspaces = signal<Instance[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly totalRecords = signal<number>(0);

  protected readonly columns: DataTableColumn[] = [
    { field: 'name', header: 'Name', sortable: true, type: 'name' },
    { field: 'description', header: 'Description', sortable: true, type: 'text' },
    {
      field: 'organization',
      header: 'Organization',
      sortable: true,
      type: 'text',
      value: row => (row as Instance).organization?.name
    },
    { field: 'status', header: 'Status', sortable: true, type: 'status' },
    { field: 'actions', header: 'Actions', type: 'actions', align: 'right' }
  ];

  protected load(query: SearchParams): void {
    this.loading.set(true);
    this.service.getAll(query).subscribe({
      next: (page: PaginatedList<Instance>) => {
        this.workspaces.set(page.items ?? []);
        this.totalRecords.set(page.totalItems ?? 0);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  protected open(row: unknown): void {
    this.router.navigate(['/admin/workspaces', (row as Instance).id]);
  }

  protected initials(name: string | null | undefined): string {
    const parts = (name ?? '').trim().split(/\s+|\./).filter(Boolean);
    if (!parts.length) return '—';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
}
