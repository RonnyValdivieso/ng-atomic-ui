import { Component, inject, signal } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, LoginOutcome } from '@shared/services/auth/auth.service';
import { SocialAuthService } from '@shared/services/auth/social-auth.service';
import { ThemeService } from '@shared/services/theme.service';
import { isGoogleConfigured } from '@shared/services/auth/providers/google.provider';
import { isMicrosoftConfigured } from '@shared/services/auth/providers/msal.provider';
import { LoginDto, UserDto } from '@interfaces/auth.interface';
import { LoginCodeComponent } from './code/code';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    LoginCodeComponent
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  protected auth = inject(AuthService);
  protected theme = inject(ThemeService);
  private social = inject(SocialAuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  protected readonly isLoading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly codeError = signal<string | null>(null);
  protected readonly showPassword = signal(false);

  protected readonly googleEnabled = isGoogleConfigured();
  protected readonly microsoftEnabled = isMicrosoftConfigured();

  protected togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    if (!this.loginForm.valid) return;

    this.isLoading.set(true);
    this.error.set(null);

    const credentials = this.loginForm.value as LoginDto;
    this.handleLoginStream(this.auth.login(credentials), 'password');
  }

  onGoogleSignIn(): void {
    if (!this.googleEnabled) return;
    this.isLoading.set(true);
    this.error.set(null);
    this.handleLoginStream(this.social.signInWithGoogle(), 'google');
  }

  onMicrosoftSignIn(): void {
    if (!this.microsoftEnabled) return;
    this.isLoading.set(true);
    this.error.set(null);
    this.handleLoginStream(this.social.signInWithMicrosoft(), 'microsoft');
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
          this.error.set('Your code expired. Please sign in again.');
          return;
        }
        if (message === 'SUPER_ADMIN_REQUIRED') {
          this.auth.clearPendingChallenge();
          this.error.set('This application requires administrator permissions.');
          return;
        }
        this.codeError.set('Invalid or expired code.');
        console.error('2FA verify error:', err);
      }
    });
  }

  onCodeCancelled(): void {
    this.auth.clearPendingChallenge();
    this.codeError.set(null);
    this.error.set(null);
  }

  private handleLoginStream(stream$: ReturnType<AuthService['login']>, source: 'password' | 'google' | 'microsoft'): void {
    stream$.subscribe({
      next: (outcome: LoginOutcome) => {
        this.isLoading.set(false);
        if (outcome.kind === 'success') {
          this.navigatePostLogin(outcome.user);
        }
        // kind === 'two-factor' flips the view via auth.pendingChallenge();
        // nothing else to do here.
      },
      error: err => {
        this.isLoading.set(false);
        const message = err?.message;
        if (message === 'SUPER_ADMIN_REQUIRED') {
          this.error.set('This application requires administrator permissions.');
          return;
        }
        if (source === 'google') {
          if (message === 'GOOGLE_POPUP_CLOSED') return; // silent
          this.error.set('Could not sign in with Google.');
          console.error('Google sign-in error:', err);
          return;
        }
        if (source === 'microsoft') {
          // MSAL throws InteractionError with name 'BrowserAuthError' and various subtypes;
          // user-cancelled popups surface as 'user_cancelled'.
          const msalName = err?.errorCode || err?.name;
          if (msalName === 'user_cancelled' || message?.includes('user_cancelled')) return;
          this.error.set('Could not sign in with Microsoft.');
          console.error('Microsoft sign-in error:', err);
          return;
        }
        this.error.set('Invalid credentials. Please try again.');
        console.error('Login error:', err);
      }
    });
  }

  private navigatePostLogin(_user: UserDto): void {
    // Super-admin-only backoffice: keep the user inside /admin regardless of
    // where the guard bounced them from. Only honor redirectTo when it's
    // already an /admin/* path (deep-link support).
    const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo');
    if (redirectTo && redirectTo.startsWith('/admin')) {
      this.router.navigateByUrl(redirectTo);
      return;
    }
    this.router.navigateByUrl('/admin');
  }
}
