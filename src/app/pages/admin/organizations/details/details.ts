import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SharedModule } from 'primeng/api';

import { ButtonComponent } from '@atoms/button';
import { CardComponent } from '@atoms/card';
import { TableComponent } from '@organisms/table';
import { OrganizationService } from '@services/api/aaa/organization.service';
import { Instance, OrganizationDetail } from '@interfaces/aaa';
import { TableColumn } from '@interfaces/table.interface';

@Component({
  selector: 'app-admin-organization-details',
  standalone: true,
  imports: [ButtonComponent, CardComponent, TableComponent, SharedModule],
  templateUrl: './details.html',
  styleUrls: ['./details.css']
})
export class AdminOrganizationDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(OrganizationService);

  protected readonly organization = signal<OrganizationDetail | undefined>(undefined);
  protected readonly loading = signal<boolean>(true);
  protected readonly error = signal<boolean>(false);

  protected readonly instances = signal<Instance[]>([]);
  protected readonly instancesLoading = signal<boolean>(false);

  protected readonly instanceColumns: TableColumn[] = [
    { field: 'name', header: 'Nombre' },
    { field: 'domain', header: 'Dominio' },
    { field: 'status', header: 'Estado' },
    { field: 'actions', header: 'Acciones', type: 'template', templateRef: 'instanceActions', styleClass: 'text-right pr-4' }
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set(true);
      this.loading.set(false);
      return;
    }
    this.load(id);
  }

  protected goBack(): void {
    this.router.navigate(['/admin/organizations']);
  }

  protected openWorkspace(instance: Instance): void {
    this.router.navigate(['/admin/workspaces', instance.id]);
  }

  /**
   * Returns '—' for missing values. Also catches the literal string
   * "null" that the staging API occasionally returns instead of a
   * proper JSON null.
   */
  protected orDash(value: unknown): string {
    if (value === null || value === undefined) return '—';
    const s = String(value).trim();
    if (s === '' || s.toLowerCase() === 'null') return '—';
    return s;
  }

  private load(id: string): void {
    this.loading.set(true);
    this.error.set(false);
    this.service.getById(id).subscribe({
      next: org => {
        this.organization.set(org);
        this.loading.set(false);
        this.loadInstances(id);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  private loadInstances(orgId: string): void {
    this.instancesLoading.set(true);
    this.service.getInstances(orgId, { pageNumber: 1, pageSize: 50 }).subscribe({
      next: page => {
        this.instances.set(page.items ?? []);
        this.instancesLoading.set(false);
      },
      error: () => {
        this.instances.set([]);
        this.instancesLoading.set(false);
      }
    });
  }
}
