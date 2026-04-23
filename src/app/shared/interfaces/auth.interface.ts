export interface LoginDto {
  email: string;
  password: string;
  app?: string | null;
  appType?: string | null;
  instanceId?: string | null;
}

export interface UserDto {
  accessToken: string;
  email: string;
  firstName: string;
  lastName: string;
  defaultLanguage: string;
  instances: InstanceDetailDto[];
}

export interface InstanceDetailDto {
  id: string;
  name: string;
}

export interface TwoFactorChallengeDto {
  twoFactorToken: string;
  expiresAt: string;
}

export interface LoginResultDto {
  requiresTwoFactor: boolean;
  user: UserDto | null;
  twoFactorChallenge: TwoFactorChallengeDto | null;
}

export interface VerifyTwoFactorDto {
  twoFactorToken: string;
  code: string;
}

export interface LoginWithExternalDto {
  provider: string;
  userId: string;
  accessToken: string;
  language: string;
  app?: string | null;
  appType?: string | null;
}
