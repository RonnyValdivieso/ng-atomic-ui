import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { AuthService } from './auth.service';
import { LoginResultDto, UserDto } from '@interfaces/auth.interface';
import { environment } from '@env/environment';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;
  const authBase = `${environment.authUrl}/v1`;

  const user: UserDto = {
    accessToken: 'not.a.real.jwt',
    email: 'admin@brandbot.ch',
    firstName: 'A',
    lastName: 'B',
    defaultLanguage: 'en',
    instances: []
  };

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

  it('maps a fully-authenticated login response to {kind:"success"}', done => {
    service.login({ email: 'a@b.ch', password: 'pw1234' }).subscribe(outcome => {
      expect(outcome.kind).toBe('success');
      if (outcome.kind === 'success') {
        expect(outcome.user.email).toBe('admin@brandbot.ch');
      }
      expect(service.pendingChallenge()).toBeNull();
      done();
    });

    const loginReq = http.expectOne(`${authBase}/Auth/login`);
    const body: LoginResultDto = { requiresTwoFactor: false, user, twoFactorChallenge: null };
    loginReq.flush(body);

    // Permissions request fires after login succeeds; tolerate it.
    const modulesReq = http.expectOne(req => req.url === `${authBase}/Modules/get-user-modules`);
    modulesReq.flush([]);
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

    const loginReq = http.expectOne(`${authBase}/Auth/login`);
    const body: LoginResultDto = {
      requiresTwoFactor: true,
      user: null,
      twoFactorChallenge: { twoFactorToken: '2fa-jwt', expiresAt: futureIso }
    };
    loginReq.flush(body);
  });

  it('rejects a malformed login response (2FA required but no challenge)', done => {
    service.login({ email: 'a@b.ch', password: 'pw1234' }).subscribe({
      next: () => fail('should not emit'),
      error: err => {
        expect((err as Error).message).toBe('MALFORMED_LOGIN_RESULT');
        done();
      }
    });
    const loginReq = http.expectOne(`${authBase}/Auth/login`);
    loginReq.flush({ requiresTwoFactor: true, user: null, twoFactorChallenge: null });
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

  it('verify2fa completes the session and clears the pending challenge on success', done => {
    // Seed a pending challenge by running a login first.
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
      expect(service.accessToken()).toBe('not.a.real.jwt');
      done();
    });

    const verifyReq = http.expectOne(`${authBase}/auth/verify-2fa`);
    expect(verifyReq.request.body).toEqual({ twoFactorToken: '2fa-jwt', code: '654321' });
    verifyReq.flush({ requiresTwoFactor: false, user, twoFactorChallenge: null });

    http.expectOne(req => req.url === `${authBase}/Modules/get-user-modules`).flush([]);
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
