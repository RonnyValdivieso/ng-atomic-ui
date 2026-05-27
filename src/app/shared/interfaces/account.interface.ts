/**
 * Account & self-service two-factor (TOTP) DTOs.
 * Backed by the AAA auth host endpoints under `/api/v1/accounts/*` and
 * `/api/v1/two-factor/*`. Distinct from the login-time `UserDto` /
 * `TwoFactorChallengeDto` in `auth.interface.ts`.
 */

/** GET /api/v1/accounts/profile */
export interface AccountProfile {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  defaultLanguage: string | null;
  defaultTimeZone: string | null;
}

/** PUT /api/v1/accounts/profile (204 No Content) */
export interface UpdateProfileDto {
  firstName: string | null;
  lastName: string | null;
  defaultLanguage: string | null;
  defaultTimeZone: string | null;
}

/** GET /api/v1/two-factor/status */
export interface TwoFactorStatusDto {
  enabled: boolean;
}

/** POST /api/v1/two-factor/setup */
export interface TwoFactorSetupResponseDto {
  /** Manual-entry secret for authenticator apps. */
  sharedKey: string;
  /** otpauth:// URI to render as a QR code. */
  authenticatorUri: string;
}

/** POST /api/v1/two-factor/enable (204 No Content) */
export interface EnableTwoFactorDto {
  code: string;
}

/** POST /api/v1/two-factor/disable (204 No Content) */
export interface DisableTwoFactorDto {
  code: string;
}
