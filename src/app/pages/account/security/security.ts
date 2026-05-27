import { Component, inject, signal } from '@angular/core';

import { AaaAccountApi } from '@services/api/aaa/account.api';
import { TwoFactorSetupResponseDto } from '@interfaces/account.interface';
import { OtpInputComponent } from '@molecules/otp-input';
import { QrCodeComponent } from '@atoms/qr-code';

type Phase = 'idle' | 'setup' | 'disable';

@Component({
  selector: 'app-account-security',
  standalone: true,
  imports: [OtpInputComponent, QrCodeComponent],
  templateUrl: './security.html',
  styleUrls: ['../account.shared.css', './security.css']
})
export class AccountSecurityComponent {
  private readonly api = inject(AaaAccountApi);

  protected readonly loading = signal(true);
  protected readonly enabled = signal(false);
  protected readonly phase = signal<Phase>('idle');
  protected readonly working = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly setupData = signal<TwoFactorSetupResponseDto | null>(null);
  protected readonly code = signal('');
  protected readonly secretCopied = signal(false);

  constructor() {
    this.loadStatus();
  }

  private loadStatus(): void {
    this.loading.set(true);
    this.api.getTwoFactorStatus().subscribe({
      next: status => {
        this.enabled.set(status.enabled);
        this.loading.set(false);
      },
      error: () => {
        // Assume off on read failure; the user can still attempt setup.
        this.enabled.set(false);
        this.loading.set(false);
      }
    });
  }

  // ---------- setup (enable) ----------

  protected beginSetup(): void {
    if (this.working()) return;
    this.working.set(true);
    this.error.set(null);
    this.code.set('');
    this.api.setupTwoFactor().subscribe({
      next: data => {
        this.setupData.set(data);
        this.phase.set('setup');
        this.working.set(false);
      },
      error: () => {
        this.working.set(false);
        this.error.set('We could not start setup. Please try again.');
      }
    });
  }

  protected confirmEnable(): void {
    if (this.code().length !== 6 || this.working()) return;
    this.working.set(true);
    this.error.set(null);
    this.api.enableTwoFactor({ code: this.code() }).subscribe({
      next: () => {
        this.enabled.set(true);
        this.resetToIdle();
        this.working.set(false);
      },
      error: () => {
        this.working.set(false);
        this.error.set('Incorrect code. Please try again.');
      }
    });
  }

  // ---------- disable ----------

  protected beginDisable(): void {
    this.phase.set('disable');
    this.code.set('');
    this.error.set(null);
  }

  protected confirmDisable(): void {
    if (this.code().length !== 6 || this.working()) return;
    this.working.set(true);
    this.error.set(null);
    this.api.disableTwoFactor({ code: this.code() }).subscribe({
      next: () => {
        this.enabled.set(false);
        this.resetToIdle();
        this.working.set(false);
      },
      error: () => {
        this.working.set(false);
        this.error.set('Incorrect code. Could not disable two-step verification.');
      }
    });
  }

  // ---------- shared ----------

  protected cancel(): void {
    this.resetToIdle();
  }

  protected onCode(value: string): void {
    this.code.set(value);
    if (this.error()) this.error.set(null);
  }

  protected copySecret(): void {
    const key = this.setupData()?.sharedKey;
    if (!key) return;
    navigator.clipboard?.writeText(key).then(
      () => {
        this.secretCopied.set(true);
        setTimeout(() => this.secretCopied.set(false), 1500);
      },
      () => { /* clipboard blocked; the key is visible to type manually */ }
    );
  }

  private resetToIdle(): void {
    this.phase.set('idle');
    this.code.set('');
    this.setupData.set(null);
    this.error.set(null);
  }
}
