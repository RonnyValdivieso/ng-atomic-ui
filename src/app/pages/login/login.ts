import { Component, inject, signal } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@shared/services/auth/auth.service';
import { LoginDto, UserDto } from '@interfaces/auth.interface';
import { ButtonComponent } from '@atoms/button';
import { FormFieldComponent } from '@molecules/form-field';
import { CardComponent } from '@atoms/card';
import { LoginCodeComponent } from './code/code';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    FormFieldComponent,
    CardComponent,
    LoginCodeComponent
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  protected auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  protected readonly isLoading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly codeError = signal<string | null>(null);

  onSubmit(): void {
    if (!this.loginForm.valid) return;

    this.isLoading.set(true);
    this.error.set(null);

    const credentials = this.loginForm.value as LoginDto;

    this.auth.login(credentials).subscribe({
      next: outcome => {
        this.isLoading.set(false);
        if (outcome.kind === 'success') {
          this.navigatePostLogin(outcome.user);
        }
        // kind === 'two-factor' flips the view via auth.pendingChallenge();
        // nothing else to do here.
      },
      error: err => {
        this.isLoading.set(false);
        this.error.set('Credenciales inválidas. Inténtalo de nuevo.');
        console.error('Login error:', err);
      }
    });
  }

  onCodeSubmitted(code: string): void {
    this.isLoading.set(true);
    this.codeError.set(null);

    this.auth.verify2fa(code).subscribe({
      next: user => {
        this.isLoading.set(false);
        this.navigatePostLogin(user);
      },
      error: err => {
        this.isLoading.set(false);
        const message = err?.message;
        if (message === 'CHALLENGE_EXPIRED' || message === 'NO_CHALLENGE') {
          this.auth.clearPendingChallenge();
          this.error.set('El código expiró. Inicia sesión de nuevo.');
          return;
        }
        this.codeError.set('Código inválido o expirado.');
        console.error('2FA verify error:', err);
      }
    });
  }

  onCodeCancelled(): void {
    this.auth.clearPendingChallenge();
    this.codeError.set(null);
    this.error.set(null);
  }

  private navigatePostLogin(_user: UserDto): void {
    const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo');
    if (redirectTo) {
      this.router.navigateByUrl(redirectTo);
      return;
    }
    const target = this.auth.isSuperAdmin() ? '/admin' : '/workspace-selector';
    this.router.navigateByUrl(target);
  }
}
