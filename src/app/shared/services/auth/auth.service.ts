import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, of, switchMap, tap, throwError } from 'rxjs';
import { LoginDto, UserDto } from '@interfaces/auth.interface';
import { UserModule } from '@interfaces/aaa';
import { AaaAuthApi } from '@services/api/aaa/auth.api';
import { isExpired } from '@utils/jwt.util';

const TOKEN_KEY = 'access_token';
const USER_KEY = 'current_user';
const PERMS_KEY = 'user_permissions';

/**
 * Centralised auth state for the backoffice.
 *
 * Owns the JWT, the current user, and the loaded permission set. Surfaces
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

  readonly accessToken = this._accessToken.asReadonly();
  readonly currentUser = this._currentUser.asReadonly();
  readonly permissions = this._permissions.asReadonly();

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

  login(dto: LoginDto): Observable<UserDto> {
    return this.api.login(dto).pipe(
      tap(user => this.acceptSession(user)),
      switchMap(user =>
        this.loadPermissions().pipe(
          catchError(() => of(undefined)),
          // Always emit the user, regardless of permission load outcome.
          tap(() => undefined),
          switchMap(() => of(user))
        )
      )
    );
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
    if (redirect) {
      this.router.navigate(['/login']);
    }
  }

  // ---------- private helpers ----------

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
