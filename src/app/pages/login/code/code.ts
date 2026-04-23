import { Component, computed, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonComponent } from '@atoms/button';
import { CardComponent } from '@atoms/card';
import { FormFieldComponent } from '@molecules/form-field';
import { TwoFactorChallengeDto } from '@interfaces/auth.interface';
import { getProviderFromChallenge } from '@utils/jwt.util';

@Component({
  selector: 'app-login-code',
  standalone: true,
  imports: [ReactiveFormsModule, CardComponent, FormFieldComponent, ButtonComponent],
  templateUrl: './code.html',
  styleUrls: ['./code.css']
})
export class LoginCodeComponent {
  readonly challenge = input.required<TwoFactorChallengeDto>();
  readonly remainingSeconds = input.required<number>();
  readonly loading = input<boolean>(false);
  readonly errorMessage = input<string>('');

  readonly submitted = output<string>();
  readonly cancelled = output<void>();

  private fb = inject(FormBuilder);
  protected readonly form = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(4)]]
  });

  protected readonly provider = computed(() =>
    getProviderFromChallenge(this.challenge().twoFactorToken)
  );

  protected readonly providerHint = computed(() => {
    switch (this.provider()) {
      case 'email':
        return 'Te enviamos un código a tu correo.';
      case 'authenticator':
        return 'Introduce el código de tu aplicación autenticadora.';
      case 'sms':
        return 'Te enviamos un código por SMS.';
      default:
        return 'Introduce el código de verificación.';
    }
  });

  protected readonly countdownLabel = computed(() => {
    const s = this.remainingSeconds();
    if (s <= 0) return 'Código expirado';
    const mm = Math.floor(s / 60);
    const ss = (s % 60).toString().padStart(2, '0');
    return `Válido por ${mm}:${ss}`;
  });

  protected readonly expired = computed(() => this.remainingSeconds() <= 0);

  onSubmit(): void {
    if (this.form.invalid || this.loading() || this.expired()) return;
    const code = (this.form.value.code ?? '').trim();
    if (!code) return;
    this.submitted.emit(code);
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
