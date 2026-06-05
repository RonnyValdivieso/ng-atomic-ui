import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CopyIdButtonComponent } from '@atoms/copy-id-button';
import { InstanceService } from '@services/api/aaa/instance.service';
import { InstanceDetail } from '@interfaces/aaa';

type DetailTab = 'info' | 'members' | 'settings' | 'activity';

@Component({
  selector: 'app-admin-workspace-details',
  standalone: true,
  imports: [CopyIdButtonComponent, RouterLink],
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
  protected readonly tab = signal<DetailTab>('info');

  /** Status comparison is case-insensitive (staging returns `ACTIVE`). */
  protected readonly isActive = computed(
    () => (this.workspace()?.status ?? '').trim().toLowerCase() === 'active'
  );

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

  protected setTab(tab: DetailTab): void {
    this.tab.set(tab);
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

  /** Short uppercased language code for the `lang-code` chip, or '' if absent. */
  protected languageCode(): string {
    const raw = this.workspace()?.defaultLanguage;
    if (raw === null || raw === undefined) return '';
    const s = String(raw).trim();
    if (s === '' || s.toLowerCase() === 'null') return '';
    return s.toUpperCase();
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
