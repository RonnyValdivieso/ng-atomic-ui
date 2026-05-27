import { Component, ElementRef, computed, effect, input, output, signal, viewChildren } from '@angular/core';

import { TwoFactorChallengeDto } from '@interfaces/auth.interface';
import { getProviderFromChallenge } from '@utils/jwt.util';

const CODE_LENGTH = 6;

@Component({
  selector: 'app-login-code',
  standalone: true,
  imports: [],
  templateUrl: './code.html',
  styleUrls: ['./code.css']
})
export class LoginCodeComponent {
  readonly challenge = input.required<TwoFactorChallengeDto>();
  readonly remainingSeconds = input.required<number>();
  readonly loading = input<boolean>(false);
  readonly errorMessage = input<string>('');
  readonly email = input<string>('');

  readonly submitted = output<string>();
  readonly cancelled = output<void>();

  private readonly cellRefs = viewChildren<ElementRef<HTMLInputElement>>('cell');

  protected readonly cells = Array.from({ length: CODE_LENGTH }, (_, i) => i);
  protected readonly digits = signal<string[]>(Array(CODE_LENGTH).fill(''));
  protected readonly code = computed(() => this.digits().join(''));

  /** Mirrors the parent error but clears the moment the user edits the code. */
  protected readonly showError = signal(false);

  /** Guards against re-emitting while a verification round-trip is in flight. */
  private submitting = false;

  constructor() {
    effect(() => {
      if (this.errorMessage()) {
        this.showError.set(true);
        this.submitting = false;
      }
    });
  }

  protected readonly provider = computed(() =>
    getProviderFromChallenge(this.challenge().twoFactorToken)
  );

  protected readonly methodIcon = computed(() => {
    switch (this.provider()) {
      case 'sms':
        return 'smartphone';
      case 'email':
        return 'mail';
      default:
        return 'shield';
    }
  });

  protected readonly methodLabel = computed(() => {
    switch (this.provider()) {
      case 'sms':
        return 'Code sent via SMS';
      case 'email':
        return 'Code sent to';
      default:
        return 'From your authenticator app';
    }
  });

  protected readonly methodTarget = computed(() =>
    this.provider() === 'email' ? this.maskEmail(this.email()) : ''
  );

  /**
   * TOTP codes rotate in the authenticator app; there is no delivered code with
   * a fixed shelf life. The validity countdown only matters for one-shot codes.
   */
  protected readonly showCountdown = computed(() => this.provider() !== 'authenticator');

  protected readonly expired = computed(
    () => this.showCountdown() && this.remainingSeconds() <= 0
  );

  protected readonly countdownLabel = computed(() => {
    const s = this.remainingSeconds();
    if (s <= 0) return 'Code expired';
    const mm = Math.floor(s / 60);
    const ss = (s % 60).toString().padStart(2, '0');
    return `Valid for ${mm}:${ss}`;
  });

  onInput(index: number, event: Event): void {
    const el = event.target as HTMLInputElement;
    const chars = el.value.replace(/\D/g, '').split('');
    const next = [...this.digits()];

    if (chars.length === 0) {
      next[index] = '';
      this.digits.set(next);
      el.value = '';
      this.showError.set(false);
      return;
    }

    // A single keystroke yields one char; a paste into a box yields many — spread.
    let cursor = index;
    for (const c of chars) {
      if (cursor >= CODE_LENGTH) break;
      next[cursor] = c;
      cursor++;
    }
    this.digits.set(next);
    this.showError.set(false);
    this.syncCells();
    this.focusCell(Math.min(cursor, CODE_LENGTH - 1));
    this.maybeAutoSubmit();
  }

  onKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      const current = this.digits()[index];
      if (!current && index > 0) {
        event.preventDefault();
        this.setDigit(index - 1, '');
        this.focusCell(index - 1);
      } else if (current) {
        this.setDigit(index, '');
      }
      return;
    }
    if (event.key === 'ArrowLeft' && index > 0) this.focusCell(index - 1);
    if (event.key === 'ArrowRight' && index < CODE_LENGTH - 1) this.focusCell(index + 1);
  }

  onPaste(event: ClipboardEvent): void {
    const text = (event.clipboardData?.getData('text') ?? '').replace(/\D/g, '').slice(0, CODE_LENGTH);
    if (!text) return;
    event.preventDefault();
    const next = Array(CODE_LENGTH).fill('');
    text.split('').forEach((c, i) => (next[i] = c));
    this.digits.set(next);
    this.showError.set(false);
    this.syncCells();
    this.focusCell(Math.min(text.length, CODE_LENGTH - 1));
    this.maybeAutoSubmit();
  }

  onSubmit(event?: Event): void {
    event?.preventDefault();
    this.submit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  private setDigit(index: number, value: string): void {
    const next = [...this.digits()];
    next[index] = value;
    this.digits.set(next);
    this.showError.set(false);
    this.syncCells();
  }

  private maybeAutoSubmit(): void {
    if (this.code().length === CODE_LENGTH) this.submit();
  }

  private submit(): void {
    if (this.code().length !== CODE_LENGTH || this.submitting || this.loading() || this.expired()) {
      return;
    }
    this.submitting = true;
    this.submitted.emit(this.code());
  }

  private focusCell(index: number): void {
    this.cellRefs()[index]?.nativeElement.focus();
  }

  private syncCells(): void {
    const refs = this.cellRefs();
    const digits = this.digits();
    refs.forEach((ref, i) => (ref.nativeElement.value = digits[i] ?? ''));
  }

  private maskEmail(email: string): string {
    if (!email) return '';
    return email.replace(/(.{2}).+(@.+)/, '$1•••$2');
  }
}
