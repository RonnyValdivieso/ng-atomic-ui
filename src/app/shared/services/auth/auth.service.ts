import { DestroyRef, Injectable, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, switchMap, tap, throwError } from 'rxjs';
import {
  LoginDto,
  LoginResultDto,
  TwoFactorChallengeDto,
  UserDto
} from '@interfaces/auth.interface';
import { UserModule } from '@interfaces/aaa';
import { AaaAuthApi } from '@services/api/aaa/auth.api';
import { isExpired } from '@utils/jwt.util';

const TOKEN_KEY = 'access_token';
const USER_KEY = 'current_user';
const PERMS_KEY = 'user_permissions';

/**
 * Discriminated outcome of `AuthService.login`. Forces callers to branch on
 * `kind` so a 2FA challenge can't accidentally be treated as a successful
 * login.
 */
export type LoginOutcome =
  | { kind: 'success'; user: UserDto }
  | { kind: 'two-factor'; challenge: TwoFactorChallengeDto };

/**
 * Centralised auth state for the backoffice.
 *
 * Owns the JWT, the current user, the loaded permission set, and the
 * short-lived 2FA challenge when the AAA API demands a code. Surfaces
 * reactive signals so guards, directives, and components can react to
 * authentication / authorisation changes without manual subscriptions.
 *
 * SuperAdmin detection is pragmatic for now: we infer it from the loaded
 * module list (presence of system-only modules such as Instances or
 * ServiceTeams). See plan's open items — preferred long-term path is for the
 * AAA login response to surface roles directly.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(AaaAuthApi);
  private router = inject(Router);

  private readonly _accessToken = signal<string | null>(this.readToken());
  private readonly _currentUser = signal<UserDto | null>(this.readUser());
  private readonly _permissions = signal<Set<string>>(this.readPermissions());
  private readonly _pendingChallenge = signal<TwoFactorChallengeDto | null>(null);
  private readonly _now = signal<number>(Date.now());

  readonly accessToken = this._accessToken.asReadonly();
  readonly currentUser = this._currentUser.asReadonly();
  readonly permissions = this._permissions.asReadonly();
  readonly pendingChallenge = this._pendingChallenge.asReadonly();

  readonly isAuthenticated = computed(() => {
    const token = this._accessToken();
    return !!token && !isExpired(token);
  });

  readonly isSuperAdmin = computed(() => {
    const perms = this._permissions();
    // Heuristic: SuperAdmin-only modules. Replace with explicit role flag
    // once the AAA login response surfaces it.
    return perms.has('module:Instances') || perms.has('module:ServiceTeams');
  });

  /** Seconds remaining on the 2FA challenge; 0 when no challenge is active. */
  readonly challengeRemainingSeconds = computed(() => {
    const challenge = this._pendingChallenge();
    if (!challenge) return 0;
    const expiresMs = Date.parse(challenge.expiresAt);
    if (Number.isNaN(expiresMs)) return 0;
    const remainingMs = expiresMs - this._now();
    return remainingMs > 0 ? Math.ceil(remainingMs / 1000) : 0;
  });

  constructor() {
    // Tick `_now` every second while a challenge is pending so the UI
    // countdown updates under zoneless change detection. Stops when the
    // challenge clears.
    let intervalId: ReturnType<typeof setInterval> | null = null;
    effect(() => {
      const hasChallenge = !!this._pendingChallenge();
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
      if (hasChallenge) {
        this._now.set(Date.now());
        intervalId = setInterval(() => this._now.set(Date.now()), 1000);
      }
    });
    inject(DestroyRef).onDestroy(() => {
      if (intervalId !== null) clearInterval(intervalId);
    });
  }

  login(dto: LoginDto): Observable<LoginOutcome> {
    return this.api.login(dto).pipe(
      switchMap(result => this.acceptLoginResult(result))
    );
  }

  /**
   * Complete a pending 2FA challenge with the user's code. Errors synchronously
   * (via an observable) if there's no active challenge or it has already
   * expired. On success, accepts the session and clears the challenge.
   */
  verify2fa(code: string): Observable<UserDto> {
    const challenge = this._pendingChallenge();
    if (!challenge) {
      return throwError(() => new Error('NO_CHALLENGE'));
    }
    if (this.challengeRemainingSeconds() === 0) {
      this._pendingChallenge.set(null);
      return throwError(() => new Error('CHALLENGE_EXPIRED'));
    }
    return this.api
      .verify2fa({ twoFactorToken: challenge.twoFactorToken, code })
      .pipe(
        switchMap(result => this.acceptLoginResult(result)),
        switchMap(outcome => {
          if (outcome.kind === 'success') {
            return of(outcome.user);
          }
          // Backend re-issued a challenge — shouldn't happen but guard anyway.
          return throwError(() => new Error('UNEXPECTED_CHALLENGE'));
        })
      );
  }

  clearPendingChallenge(): void {
    this._pendingChallenge.set(null);
  }

  /**
   * Reload modules from the API and project them into the permission set.
   * Safe to call on app boot or after switching instance context.
   */
  refreshPermissions(instanceId?: string): Observable<UserModule[]> {
    return this.loadPermissions(instanceId);
  }

  hasPermission(permission: string): boolean {
    return this._permissions().has(permission);
  }

  logout(redirect = true): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(PERMS_KEY);
    this._accessToken.set(null);
    this._currentUser.set(null);
    this._permissions.set(new Set());
    this._pendingChallenge.set(null);
    if (redirect) {
      this.router.navigate(['/login']);
    }
  }

  // ---------- private helpers ----------

  /**
   * Branch a raw AAA login result into our discriminated `LoginOutcome`.
   * On `requiresTwoFactor`, stores the challenge as pending state. On a
   * fully authenticated response, persists the session and loads
   * permissions. Treats malformed responses (neither branch populated) as
   * hard errors.
   */
  private acceptLoginResult(result: LoginResultDto): Observable<LoginOutcome> {
    if (result.requiresTwoFactor) {
      if (!result.twoFactorChallenge) {
        return throwError(() => new Error('MALFORMED_LOGIN_RESULT'));
      }
      this._pendingChallenge.set(result.twoFactorChallenge);
      return of<LoginOutcome>({ kind: 'two-factor', challenge: result.twoFactorChallenge });
    }
    if (!result.user) {
      return throwError(() => new Error('MALFORMED_LOGIN_RESULT'));
    }
    this._pendingChallenge.set(null);
    this.acceptSession(result.user);
    return this.loadPermissions().pipe(
      catchError(() => of(undefined)),
      map(() => ({ kind: 'success' as const, user: result.user as UserDto }))
    );
  }

  private acceptSession(user: UserDto): void {
    localStorage.setItem(TOKEN_KEY, user.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this._accessToken.set(user.accessToken);
    this._currentUser.set(user);
  }

  private loadPermissions(instanceId?: string): Observable<UserModule[]> {
    return this.api.getUserModules(instanceId).pipe(
      tap(modules => {
        const set = new Set<string>();
        for (const mod of modules ?? []) {
          if (mod?.name) set.add(`module:${mod.name}`);
          for (const perm of mod?.permissions ?? []) {
            if (perm) set.add(perm);
          }
        }
        this._permissions.set(set);
        localStorage.setItem(PERMS_KEY, JSON.stringify([...set]));
      }),
      catchError(err => {
        // Don't block login on a missing/forbidden modules endpoint.
        this._permissions.set(new Set());
        localStorage.removeItem(PERMS_KEY);
        return throwError(() => err);
      })
    );
  }

  private readToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    if (isExpired(token)) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(PERMS_KEY);
      return null;
    }
    return token;
  }

  private readUser(): UserDto | null {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserDto;
    } catch {
      return null;
    }
  }

  private readPermissions(): Set<string> {
    if (typeof localStorage === 'undefined') return new Set();
    const raw = localStorage.getItem(PERMS_KEY);
    if (!raw) return new Set();
    try {
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? new Set<string>(arr) : new Set();
    } catch {
      return new Set();
    }
  }
}
