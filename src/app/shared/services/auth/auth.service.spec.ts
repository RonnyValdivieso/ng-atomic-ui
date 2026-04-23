import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { AuthService } from './auth.service';
import { LoginResultDto, LoginWithExternalDto, UserDto } from '@interfaces/auth.interface';
import { environment } from '@env/environment';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;
  const authBase = `${environment.authUrl}/v1`;
  const legacyBase = `${environment.authUrl}`;

  const user: UserDto = {
    accessToken: 'initial.access.token',
    email: 'admin@brandbot.ch',
    firstName: 'A',
    lastName: 'B',
    defaultLanguage: 'en',
    instances: []
  };

  const refreshedUser: UserDto = {
    ...user,
    accessToken: 'refreshed.access.token'
  };

  // Seeds the permission set so isSuperAdmin() returns true.
  const superAdminModules = [{ id: '1', name: 'Instances', permissions: [] }];

  function flushSuperAdminLogin(): void {
    http.expectOne(req => req.url === `${authBase}/Modules/get-user-modules`).flush(superAdminModules);
    http
      .expectOne(`${legacyBase}/Auth/refresh-user-token/${environment.defaultInstanceId}`)
      .flush(refreshedUser);
  }

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('attaches the configured defaultInstanceId to the login request body', done => {
    service.login({ email: 'a@b.ch', password: 'pw1234' }).subscribe(() => done());

    const loginReq = http.expectOne(`${authBase}/Auth/login`);
    expect(loginReq.request.body.instanceId).toBe(environment.defaultInstanceId);
    const body: LoginResultDto = { requiresTwoFactor: false, user, twoFactorChallenge: null };
    loginReq.flush(body);
    flushSuperAdminLogin();
  });

  it('maps a fully-authenticated login response to {kind:"success"} and accepts the refreshed token', done => {
    service.login({ email: 'a@b.ch', password: 'pw1234' }).subscribe(outcome => {
      expect(outcome.kind).toBe('success');
      if (outcome.kind === 'success') {
        expect(outcome.user.email).toBe('admin@brandbot.ch');
      }
      expect(service.pendingChallenge()).toBeNull();
      // Refresh token flowed through acceptSession.
      expect(service.accessToken()).toBe('refreshed.access.token');
      done();
    });

    http.expectOne(`${authBase}/Auth/login`).flush({
      requiresTwoFactor: false,
      user,
      twoFactorChallenge: null
    });
    flushSuperAdminLogin();
  });

  it('rejects non-super-admin users at login with SUPER_ADMIN_REQUIRED and clears session', done => {
    service.login({ email: 'a@b.ch', password: 'pw1234' }).subscribe({
      next: () => fail('should not emit success for non-super-admin'),
      error: err => {
        expect((err as Error).message).toBe('SUPER_ADMIN_REQUIRED');
        expect(service.accessToken()).toBeNull();
        expect(service.currentUser()).toBeNull();
        done();
      }
    });

    http.expectOne(`${authBase}/Auth/login`).flush({
      requiresTwoFactor: false,
      user,
      twoFactorChallenge: null
    });
    // Return a non-super-admin module list (no Instances, no ServiceTeams).
    http
      .expectOne(req => req.url === `${authBase}/Modules/get-user-modules`)
      .flush([{ id: '1', name: 'Reports', permissions: [] }]);
  });

  it('falls through when refresh-user-token fails (keeps initial session, warns)', done => {
    spyOn(console, 'warn');
    service.login({ email: 'a@b.ch', password: 'pw1234' }).subscribe(outcome => {
      expect(outcome.kind).toBe('success');
      // Initial token retained after refresh failure.
      expect(service.accessToken()).toBe('initial.access.token');
      expect(console.warn).toHaveBeenCalled();
      done();
    });

    http.expectOne(`${authBase}/Auth/login`).flush({
      requiresTwoFactor: false,
      user,
      twoFactorChallenge: null
    });
    http.expectOne(req => req.url === `${authBase}/Modules/get-user-modules`).flush(superAdminModules);
    http
      .expectOne(`${legacyBase}/Auth/refresh-user-token/${environment.defaultInstanceId}`)
      .flush({ error: 'boom' }, { status: 500, statusText: 'Server Error' });
  });

  it('loginWithExternal hits /Auth/login-with-third-party and runs the same finalize pipeline', done => {
    const dto: LoginWithExternalDto = {
      provider: 'Google',
      userId: 'google-sub-123',
      accessToken: 'google.opaque.access',
      language: 'en'
    };
    service.loginWithExternal(dto).subscribe(outcome => {
      expect(outcome.kind).toBe('success');
      expect(service.accessToken()).toBe('refreshed.access.token');
      done();
    });

    const ssoReq = http.expectOne(`${authBase}/Auth/login-with-third-party`);
    expect(ssoReq.request.body.provider).toBe('Google');
    expect(ssoReq.request.body.userId).toBe('google-sub-123');
    ssoReq.flush({ requiresTwoFactor: false, user, twoFactorChallenge: null });
    flushSuperAdminLogin();
  });

  it('maps a 2FA-required login response to {kind:"two-factor"} and stores the challenge', done => {
    const futureIso = new Date(Date.now() + 5 * 60_000).toISOString();
    service.login({ email: 'a@b.ch', password: 'pw1234' }).subscribe(outcome => {
      expect(outcome.kind).toBe('two-factor');
      if (outcome.kind === 'two-factor') {
        expect(outcome.challenge.twoFactorToken).toBe('2fa-jwt');
      }
      expect(service.pendingChallenge()).not.toBeNull();
      expect(service.pendingChallenge()?.twoFactorToken).toBe('2fa-jwt');
      expect(service.challengeRemainingSeconds()).toBeGreaterThan(0);
      done();
    });

    http.expectOne(`${authBase}/Auth/login`).flush({
      requiresTwoFactor: true,
      user: null,
      twoFactorChallenge: { twoFactorToken: '2fa-jwt', expiresAt: futureIso }
    });
  });

  it('rejects a malformed login response (2FA required but no challenge)', done => {
    service.login({ email: 'a@b.ch', password: 'pw1234' }).subscribe({
      next: () => fail('should not emit'),
      error: err => {
        expect((err as Error).message).toBe('MALFORMED_LOGIN_RESULT');
        done();
      }
    });
    http.expectOne(`${authBase}/Auth/login`).flush({
      requiresTwoFactor: true,
      user: null,
      twoFactorChallenge: null
    });
  });

  it('verify2fa errors synchronously when no challenge is pending', done => {
    service.verify2fa('123456').subscribe({
      next: () => fail('should not emit'),
      error: err => {
        expect((err as Error).message).toBe('NO_CHALLENGE');
        done();
      }
    });
  });

  it('verify2fa completes the session through finalizeSession and clears the pending challenge', done => {
    const futureIso = new Date(Date.now() + 5 * 60_000).toISOString();
    service.login({ email: 'a@b.ch', password: 'pw1234' }).subscribe();
    http.expectOne(`${authBase}/Auth/login`).flush({
      requiresTwoFactor: true,
      user: null,
      twoFactorChallenge: { twoFactorToken: '2fa-jwt', expiresAt: futureIso }
    });

    service.verify2fa('654321').subscribe(result => {
      expect(result.email).toBe('admin@brandbot.ch');
      expect(service.pendingChallenge()).toBeNull();
      expect(service.accessToken()).toBe('refreshed.access.token');
      done();
    });

    const verifyReq = http.expectOne(`${authBase}/auth/verify-2fa`);
    expect(verifyReq.request.body).toEqual({ twoFactorToken: '2fa-jwt', code: '654321' });
    verifyReq.flush({ requiresTwoFactor: false, user, twoFactorChallenge: null });
    flushSuperAdminLogin();
  });

  it('verify2fa errors with CHALLENGE_EXPIRED when the challenge has lapsed', done => {
    const pastIso = new Date(Date.now() - 1000).toISOString();
    service.login({ email: 'a@b.ch', password: 'pw1234' }).subscribe();
    http.expectOne(`${authBase}/Auth/login`).flush({
      requiresTwoFactor: true,
      user: null,
      twoFactorChallenge: { twoFactorToken: '2fa-jwt', expiresAt: pastIso }
    });

    service.verify2fa('123456').subscribe({
      next: () => fail('should not emit'),
      error: err => {
        expect((err as Error).message).toBe('CHALLENGE_EXPIRED');
        expect(service.pendingChallenge()).toBeNull();
        done();
      }
    });
  });

  it('clearPendingChallenge drops the stored challenge', () => {
    const futureIso = new Date(Date.now() + 5 * 60_000).toISOString();
    service.login({ email: 'a@b.ch', password: 'pw1234' }).subscribe();
    http.expectOne(`${authBase}/Auth/login`).flush({
      requiresTwoFactor: true,
      user: null,
      twoFactorChallenge: { twoFactorToken: '2fa-jwt', expiresAt: futureIso }
    });

    expect(service.pendingChallenge()).not.toBeNull();
    service.clearPendingChallenge();
    expect(service.pendingChallenge()).toBeNull();
  });

  it('logout clears session + permissions + pending challenge', () => {
    const futureIso = new Date(Date.now() + 5 * 60_000).toISOString();
    service.login({ email: 'a@b.ch', password: 'pw1234' }).subscribe();
    http.expectOne(`${authBase}/Auth/login`).flush({
      requiresTwoFactor: true,
      user: null,
      twoFactorChallenge: { twoFactorToken: '2fa-jwt', expiresAt: futureIso }
    });

    service.logout(false);

    expect(service.accessToken()).toBeNull();
    expect(service.currentUser()).toBeNull();
    expect(service.permissions().size).toBe(0);
    expect(service.pendingChallenge()).toBeNull();
  });
});
