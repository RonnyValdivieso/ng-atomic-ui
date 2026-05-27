import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { AaaAccountApi } from '@services/api/aaa/account.api';
import { ReferenceDataService } from '@services/api/reference-data.service';
import { AuthService } from '@shared/services/auth/auth.service';
import { AccountProfile, UpdateProfileDto } from '@interfaces/account.interface';
import { Language } from '@interfaces/reference.interface';
import { TimezoneSelectComponent } from '@molecules/timezone-select';
import { AvatarComponent } from '@atoms/avatar';

type Mode = 'view' | 'edit';

@Component({
  selector: 'app-account-profile',
  standalone: true,
  imports: [ReactiveFormsModule, TimezoneSelectComponent, AvatarComponent],
  templateUrl: './profile.html',
  styleUrls: ['../account.shared.css', './profile.css']
})
export class AccountProfileComponent {
  private readonly api = inject(AaaAccountApi);
  private readonly reference = inject(ReferenceDataService);
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  protected readonly profile = signal<AccountProfile | null>(null);
  protected readonly languages = signal<Language[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly saved = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly mode = signal<Mode>('view');

  protected readonly form = this.fb.group({
    firstName: [''],
    lastName: [''],
    defaultLanguage: [''],
    defaultTimeZone: ['']
  });

  protected readonly fullName = computed(() => {
    const p = this.profile();
    if (!p) return '';
    const name = [p.firstName, p.lastName].filter(Boolean).join(' ').trim();
    return name || p.fullName || '—';
  });

  protected readonly initials = computed(() => {
    const p = this.profile();
    const a = p?.firstName?.charAt(0) ?? '';
    const b = p?.lastName?.charAt(0) ?? '';
    return (`${a}${b}`.toUpperCase()) || '?';
  });

  /** Human-readable language for view mode (maps the stored code to its description). */
  protected readonly languageLabel = computed(() => {
    const code = this.profile()?.defaultLanguage;
    if (!code) return '';
    const match = this.languages().find(l => l.code === code);
    return match?.description || match?.code || code;
  });

  constructor() {
    this.load();
    this.loadLanguages();
  }

  private loadLanguages(): void {
    this.reference.getLanguages().subscribe({
      next: languages => this.languages.set(languages),
      error: () => { /* non-fatal: the select simply stays empty */ }
    });
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.getProfile().subscribe({
      next: profile => {
        this.profile.set(profile);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('We could not load your profile. Please try again.');
        this.loading.set(false);
      }
    });
  }

  protected startEdit(): void {
    const p = this.profile();
    if (!p) return;
    this.form.reset({
      firstName: p.firstName ?? '',
      lastName: p.lastName ?? '',
      defaultLanguage: p.defaultLanguage ?? '',
      defaultTimeZone: p.defaultTimeZone ?? ''
    });
    this.saved.set(false);
    this.error.set(null);
    this.mode.set('edit');
  }

  protected cancelEdit(): void {
    this.mode.set('view');
    this.error.set(null);
  }

  protected save(): void {
    const p = this.profile();
    if (!p || this.saving()) return;

    const value = this.form.getRawValue();
    const dto: UpdateProfileDto = {
      firstName: value.firstName?.trim() || null,
      lastName: value.lastName?.trim() || null,
      defaultLanguage: value.defaultLanguage?.trim() || null,
      defaultTimeZone: value.defaultTimeZone?.trim() || null
    };

    this.saving.set(true);
    this.error.set(null);
    this.api.updateProfile(dto).subscribe({
      next: () => {
        const updated: AccountProfile = {
          ...p,
          firstName: dto.firstName,
          lastName: dto.lastName,
          defaultLanguage: dto.defaultLanguage,
          defaultTimeZone: dto.defaultTimeZone,
          fullName: [dto.firstName, dto.lastName].filter(Boolean).join(' ').trim() || p.fullName
        };
        this.profile.set(updated);
        this.auth.patchCurrentUser({
          firstName: dto.firstName ?? '',
          lastName: dto.lastName ?? '',
          defaultLanguage: dto.defaultLanguage ?? ''
        });
        this.saving.set(false);
        this.saved.set(true);
        this.mode.set('view');
        setTimeout(() => this.saved.set(false), 2500);
      },
      error: () => {
        this.saving.set(false);
        this.error.set('We could not save your changes. Please try again.');
      }
    });
  }
}
