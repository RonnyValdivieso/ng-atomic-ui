import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ButtonComponent } from '@atoms/button';
import { CardComponent } from '@atoms/card';
import { InstanceService } from '@services/api/aaa/instance.service';
import { InstanceDetail } from '@interfaces/aaa';

@Component({
  selector: 'app-admin-workspace-details',
  standalone: true,
  imports: [ButtonComponent, CardComponent, RouterLink],
  templateUrl: './details.html',
  styleUrls: ['./details.css']
})
export class AdminWorkspaceDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(InstanceService);

  protected readonly workspace = signal<InstanceDetail | undefined>(undefined);
  protected readonly loading = signal<boolean>(true);
  protected readonly error = signal<boolean>(false);

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
    this.router.navigate(['/admin/workspaces']);
  }

  /**
   * Returns '—' for missing values. Also catches the literal string
   * "null" which the staging API returns for some workspace fields
   * (e.g. `domain: "null"`) instead of a proper JSON null.
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
      next: detail => {
        this.workspace.set(detail);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }
}
