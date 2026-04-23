import { Injectable, inject } from '@angular/core';
import { Observable, from, map, switchMap, throwError } from 'rxjs';

import { LoginWithExternalDto, UserDto } from '@interfaces/auth.interface';
import { AuthService, LoginOutcome } from './auth.service';
import { signInWithGoogle } from './providers/google.provider';
import { signInWithMicrosoft } from './providers/msal.provider';

/**
 * Orchestrator for provider-based sign-in. Drives the browser popup for
 * Google or Microsoft, then hands the resulting provider tokens to
 * `AuthService.loginWithExternal` which funnels into the same post-login
 * pipeline as password login (permissions, super-admin gate, instance
 * refresh).
 *
 * The returned observable emits the same `LoginOutcome` union `AuthService.login`
 * emits, so callers can handle the 2FA branch identically if AAA demands
 * a code for the SSO account.
 */
@Injectable({ providedIn: 'root' })
export class SocialAuthService {
  private auth = inject(AuthService);

  signInWithGoogle(): Observable<LoginOutcome> {
    return from(signInWithGoogle()).pipe(
      switchMap(({ userId, accessToken }) =>
        this.auth.loginWithExternal(this.buildDto('Google', userId, accessToken))
      )
    );
  }

  signInWithMicrosoft(): Observable<LoginOutcome> {
    return from(signInWithMicrosoft()).pipe(
      switchMap(({ userId, accessToken }) =>
        this.auth.loginWithExternal(this.buildDto('Microsoft', userId, accessToken))
      )
    );
  }

  /**
   * Most callers only care about the fully-authenticated success path; if
   * AAA requests 2FA for an SSO account, the caller should watch
   * `AuthService.pendingChallenge` instead. This helper collapses the
   * union for that common case and errors on the unexpected challenge
   * branch.
   */
  expectSuccess(outcome$: Observable<LoginOutcome>): Observable<UserDto> {
    return outcome$.pipe(
      map(outcome => {
        if (outcome.kind === 'success') return outcome.user;
        throw new Error('SSO_TWO_FACTOR_PENDING');
      })
    );
  }

  private buildDto(provider: string, userId: string, accessToken: string): LoginWithExternalDto {
    return {
      provider,
      userId,
      accessToken,
      language: typeof navigator !== 'undefined' ? navigator.language.slice(0, 2) : 'en'
    };
  }
}

// Silence unused-import warning — keep throwError available for future callers.
void throwError;
