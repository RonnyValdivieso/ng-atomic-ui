/**
 * Lightweight JWT helpers. Decodes the payload only (no signature verification);
 * the API is the source of truth for trust. Use solely for reading claims and
 * checking expiry on the client.
 */

export interface JwtPayload {
  exp?: number;
  iat?: number;
  iss?: string;
  aud?: string;
  [claim: string]: unknown;
}

function base64UrlDecode(input: string): string {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (padded.length % 4)) % 4;
  const normalized = padded + '='.repeat(padLength);
  return decodeURIComponent(
    atob(normalized)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

export function decodeJwt(token: string | null | undefined): JwtPayload | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    return JSON.parse(base64UrlDecode(parts[1])) as JwtPayload;
  } catch {
    return null;
  }
}

export function isExpired(token: string | null | undefined, skewSeconds = 30): boolean {
  const payload = decodeJwt(token);
  if (!payload?.exp) return true;
  const nowSeconds = Math.floor(Date.now() / 1000);
  return payload.exp <= nowSeconds + skewSeconds;
}

export function getClaim<T = unknown>(token: string | null | undefined, name: string): T | undefined {
  const payload = decodeJwt(token);
  if (!payload) return undefined;
  return payload[name] as T | undefined;
}
