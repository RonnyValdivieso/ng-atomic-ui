import { PublicClientApplication } from '@azure/msal-browser';

import { environment } from '@env/environment';

export interface ExternalAuthResult {
  userId: string;
  accessToken: string;
}

/**
 * Thin adapter around @azure/msal-browser's popup flow. Lazily constructs
 * and initializes a single `PublicClientApplication` per page — MSAL's
 * initialize is expensive.
 *
 * Returns `{userId, accessToken}` in the shape `SocialAuthService` needs
 * to feed AAA's `LoginWithExternalDto`.
 */

let pcaPromise: Promise<PublicClientApplication> | null = null;

function getPca(): Promise<PublicClientApplication> {
  if (pcaPromise) return pcaPromise;
  const pca = new PublicClientApplication({
    auth: {
      clientId: environment.microsoft.clientId,
      authority: `https://login.microsoftonline.com/${environment.microsoft.tenantId}`,
      redirectUri: typeof window !== 'undefined' ? window.location.origin : '/'
    },
    cache: {
      cacheLocation: 'sessionStorage',
      storeAuthStateInCookie: false
    }
  });
  pcaPromise = pca.initialize().then(() => pca);
  return pcaPromise;
}

export async function signInWithMicrosoft(): Promise<ExternalAuthResult> {
  const pca = await getPca();
  const result = await pca.loginPopup({
    scopes: ['openid', 'profile', 'email'],
    prompt: 'select_account'
  });
  const account = result.account;
  if (!account) {
    throw new Error('MICROSOFT_NO_ACCOUNT');
  }
  return {
    userId: account.homeAccountId || account.localAccountId,
    accessToken: result.accessToken
  };
}

/** Narrow predicate exported for the LoginComponent to enable/disable the button. */
export function isMicrosoftConfigured(): boolean {
  return (
    !!environment.microsoft.clientId &&
    !environment.microsoft.clientId.startsWith('REPLACE_WITH_') &&
    !!environment.microsoft.tenantId &&
    !environment.microsoft.tenantId.startsWith('REPLACE_WITH_')
  );
}
