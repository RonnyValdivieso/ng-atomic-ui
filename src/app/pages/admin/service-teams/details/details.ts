import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CopyIdButtonComponent } from '@atoms/copy-id-button';
import { ConfirmDialogComponent } from '@molecules/confirm-dialog/confirm-dialog';
import { ServiceTeamService } from '@services/api/aaa/service-team.service';
import { ServiceTeamDetail, ServiceTeamMember, ServiceTeamStatus } from '@interfaces/aaa';

type DetailTab = 'info' | 'members';

@Component({
  selector: 'app-admin-service-team-details',
  standalone: true,
  imports: [ReactiveFormsModule, CopyIdButtonComponent, ConfirmDialogComponent],
  templateUrl: './details.html',
  styleUrls: ['./details.css']
})
export class AdminServiceTeamDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(ServiceTeamService);

  protected readonly team = signal<ServiceTeamDetail | null>(null);
  protected readonly loading = signal<boolean>(true);
  protected readonly error = signal<boolean>(false);

  protected readonly tab = signal<DetailTab>('info');

  protected readonly members = signal<ServiceTeamMember[]>([]);
  protected readonly membersTotal = signal<number>(0);
  protected readonly membersLoading = signal<boolean>(false);

  /** Inline edit-in-place: the Información card swaps to a form while true. */
  protected readonly editing = signal<boolean>(false);
  protected readonly saving = signal<boolean>(false);
  /** Brief "GUARDADO" confirmation pill after a successful save. */
  protected readonly savedPulse = signal<boolean>(false);

  protected readonly isDeleteVisible = signal<boolean>(false);
  protected readonly deleting = signal<boolean>(false);

  /** Status comparison is case-insensitive (staging returns `ACTIVE`). */
  protected readonly isActive = computed(
    () => String(this.team()?.status ?? '').trim().toUpperCase() === 'ACTIVE'
  );

  protected readonly editForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    code: new FormControl<string>('', [Validators.required, Validators.maxLength(40)]),
    email: new FormControl<string>('', [Validators.email, Validators.maxLength(254)]),
    phone: new FormControl<string>('', [Validators.maxLength(40)]),
    address: new FormControl<string>('', [Validators.maxLength(255)])
  });

  protected get deleteMessage(): string {
    const t = this.team();
    return t
      ? `¿Eliminar el equipo "${t.name}"? Se rechazará si aún tiene organizaciones o workspaces asignados.`
      : '';
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.load(id);
    } else {
      this.error.set(true);
      this.loading.set(false);
    }
  }

  protected load(id: string): void {
    this.loading.set(true);
    this.error.set(false);
    this.service.getById(id).subscribe({
      next: (data) => {
        this.team.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
    this.loadMembers(id);
  }

  private loadMembers(id: string): void {
    this.membersLoading.set(true);
    this.service.getMembers(id, { pageNumber: 1, pageSize: 50 }).subscribe({
      next: (page) => {
        this.members.set(page.items ?? []);
        this.membersTotal.set(page.totalCount ?? (page.items?.length ?? 0));
        this.membersLoading.set(false);
      },
      error: () => {
        this.members.set([]);
        this.membersTotal.set(0);
        this.membersLoading.set(false);
      }
    });
  }

  protected setTab(tab: DetailTab): void {
    if (this.editing()) return; // locked while editing in-place
    this.tab.set(tab);
  }

  /** Square picture URL for the header avatar, if the API returned one. */
  protected pictureUrl(): string | null {
    const raw = this.team()?.squarePicture;
    if (raw === null || raw === undefined) return null;
    const s = String(raw).trim();
    return s === '' || s.toLowerCase() === 'null' ? null : s;
  }

  /** Monogram initials from a name (falls back to '—'). */
  protected initials(value: string | null | undefined): string {
    const parts = String(value ?? '').trim().split(/\s+|\./).filter(Boolean);
    if (!parts.length) return '—';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  /** Best-effort display name for a member across possible API shapes. */
  protected memberName(m: ServiceTeamMember): string {
    const full = m.fullName || m.name || [m.firstName, m.lastName].filter(Boolean).join(' ').trim();
    return (full && full.length ? full : m.email) || '—';
  }

  protected memberRole(m: ServiceTeamMember): string | null {
    const r = (m.role || m.roleName || '').trim();
    return r.length ? r : null;
  }

  protected goBack(): void {
    this.router.navigate(['/admin/service-teams']);
  }

  protected startEdit(): void {
    const t = this.team();
    if (!t) return;
    this.editForm.reset({
      name: t.name ?? '',
      code: t.code ?? '',
      email: t.email ?? '',
      phone: t.phone ?? '',
      address: t.address ?? ''
    });
    this.editForm.markAsPristine();
    this.tab.set('info');
    this.editing.set(true);
  }

  protected cancelEdit(): void {
    this.editing.set(false);
  }

  protected saveEdit(): void {
    const current = this.team();
    if (!current) return;
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    const raw = this.editForm.getRawValue();
    this.saving.set(true);
    this.service.update(current.id, {
      name: (raw.name ?? '').trim(),
      code: (raw.code ?? '').trim() || null,
      email: (raw.email ?? '').trim() || null,
      phone: (raw.phone ?? '').trim() || null,
      address: (raw.address ?? '').trim() || null
    }).subscribe({
      next: () => {
        this.saving.set(false);
        this.editing.set(false);
        this.savedPulse.set(true);
        setTimeout(() => this.savedPulse.set(false), 2200);
        this.load(current.id);
      },
      error: () => this.saving.set(false)
    });
  }

  /** Sanitise the Code field as the user types: lowercase, digits, hyphens. */
  protected onCodeInput(event: Event): void {
    const el = event.target as HTMLInputElement;
    const slugged = el.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    if (slugged !== el.value) this.editForm.controls.code.setValue(slugged);
  }

  protected toggleStatus(): void {
    const current = this.team();
    if (!current) return;
    const next: ServiceTeamStatus = this.isActive() ? 'Inactive' : 'Active';
    this.service.updateStatus(current.id, { status: next }).subscribe({
      next: () => this.load(current.id)
    });
  }

  protected delete(): void {
    if (!this.team()) return;
    this.isDeleteVisible.set(true);
  }

  protected confirmDelete(): void {
    const current = this.team();
    if (!current) return;
    this.deleting.set(true);
    this.service.delete(current.id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.isDeleteVisible.set(false);
        this.goBack();
      },
      error: () => this.deleting.set(false)
    });
  }

  /** '—' for empty/missing values; trims and treats the literal "null" as empty. */
  protected orDash(value: unknown): string {
    if (value === null || value === undefined) return '—';
    const s = String(value).trim();
    if (s === '' || s.toLowerCase() === 'null') return '—';
    return s;
  }
}
