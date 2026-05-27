import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  AccountProfile,
  DisableTwoFactorDto,
  EnableTwoFactorDto,
  TwoFactorSetupResponseDto,
  TwoFactorStatusDto,
  UpdateProfileDto
} from '@interfaces/account.interface';
import { environment } from '@env/environment';

/**
 * Thin HTTP client for the brandbot.aaa account-self-service endpoints:
 * the current user's profile and their two-factor (TOTP) enrollment.
 * All endpoints are bearer-secured; the `authInterceptor` attaches the token.
 */
@Injectable({ providedIn: 'root' })
export class AaaAccountApi {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.authUrl}/v1`;

  getProfile(): Observable<AccountProfile> {
    return this.http.get<AccountProfile>(`${this.baseUrl}/accounts/profile`);
  }

  /** Returns 204 No Content; re-fetch or patch local state after success. */
  updateProfile(dto: UpdateProfileDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/accounts/profile`, dto);
  }

  getTwoFactorStatus(): Observable<TwoFactorStatusDto> {
    return this.http.get<TwoFactorStatusDto>(`${this.baseUrl}/two-factor/status`);
  }

  /** Begins enrollment: returns the shared key + otpauth:// URI to render as a QR. */
  setupTwoFactor(): Observable<TwoFactorSetupResponseDto> {
    return this.http.post<TwoFactorSetupResponseDto>(`${this.baseUrl}/two-factor/setup`, {});
  }

  /** Verifies the TOTP code and enables 2FA (204 No Content). */
  enableTwoFactor(dto: EnableTwoFactorDto): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/two-factor/enable`, dto);
  }

  /** Verifies the TOTP code and disables 2FA, resetting the secret (204 No Content). */
  disableTwoFactor(dto: DisableTwoFactorDto): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/two-factor/disable`, dto);
  }
}
