import { environment } from '@env/environment';

import type { ExternalAuthResult } from './msal.provider';

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient(config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string }) => void;
            error_callback?: (err: { type?: string; message?: string }) => void;
          }): { requestAccessToken(options?: { prompt?: string }): void };
        };
      };
    };
  }
}

const GIS_SRC = 'https://accounts.google.com/gsi/client';
const GIS_MAX_WAIT_MS = 5000;

/**
 * Waits for the Google Identity Services script (loaded via a <script> tag
 * in index.html) to finish initializing. Resolves once `window.google.accounts`
 * is available, rejects if it never shows up within GIS_MAX_WAIT_MS — this
 * covers ad-block / offline cases where we want the UI to disable the
 * Google button rather than hang.
 */
function ensureGisLoaded(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('GOOGLE_NOT_IN_BROWSER'));
  }
  if (window.google?.accounts) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + GIS_MAX_WAIT_MS;
    const poll = () => {
      if (window.google?.accounts) {
        resolve();
        return;
      }
      if (Date.now() > deadline) {
        reject(new Error('GOOGLE_SCRIPT_LOAD_FAILED'));
        return;
      }
      setTimeout(poll, 100);
    };
    poll();
  });
}

async function fetchGoogleUserId(accessToken: string): Promise<string> {
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok) {
    throw new Error('GOOGLE_USERINFO_FAILED');
  }
  const data = (await res.json()) as { sub?: string };
  if (!data.sub) {
    throw new Error('GOOGLE_USERINFO_MISSING_SUB');
  }
  return data.sub;
}

/**
 * Opens the Google OAuth popup, returns `{userId, accessToken}` for the
 * AAA `LoginWithExternalDto`. Uses the OAuth 2.0 token client (not ID
 * token flow) because we need a back-end-addressable access token.
 * Fetches `userinfo.sub` once to populate userId.
 */
export async function signInWithGoogle(): Promise<ExternalAuthResult> {
  await ensureGisLoaded();
  const accessToken = await new Promise<string>((resolve, reject) => {
    const tokenClient = window.google!.accounts.oauth2.initTokenClient({
      client_id: environment.google.clientId,
      scope: 'openid email profile',
      callback: response => {
        if (response.error || !response.access_token) {
          reject(new Error(response.error || 'GOOGLE_NO_ACCESS_TOKEN'));
          return;
        }
        resolve(response.access_token);
      },
      error_callback: err => {
        // User closed the popup or denied consent. Surface as a typed error
        // so the login component can stay silent.
        reject(new Error(err?.type === 'popup_closed' ? 'GOOGLE_POPUP_CLOSED' : 'GOOGLE_LOGIN_FAILED'));
      }
    });
    tokenClient.requestAccessToken({ prompt: 'consent' });
  });

  const userId = await fetchGoogleUserId(accessToken);
  return { userId, accessToken };
}

/** Narrow predicate exported for the LoginComponent to enable/disable the button. */
export function isGoogleConfigured(): boolean {
  return (
    !!environment.google.clientId && !environment.google.clientId.startsWith('REPLACE_WITH_')
  );
}
