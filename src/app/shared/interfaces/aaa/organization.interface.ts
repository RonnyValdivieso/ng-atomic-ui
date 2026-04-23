/**
 * Lightweight reference to an organization, matching the
 * `OrganizationSummaryDto` nested inside `InstanceDetailDto`.
 */
export interface OrganizationSummary {
  id: string;
  name: string;
}

/**
 * List-row / core organization shape. Mirrors what the
 * `/v1/organizations` endpoint returns per row. Swagger doesn't pin
 * this schema tightly, so optional fields are tolerant.
 */
export interface Organization {
  id: string;
  name: string;
  description?: string | null;
  picture?: string | null;
  serviceTeamId?: string | null;
}

/**
 * Full organization details as returned by
 * `/v1/organizations/{id}`. We don't expect the server to embed all
 * instances here — the dedicated `/instances` endpoint is the source
 * of truth for that panel.
 */
export interface OrganizationDetail extends Organization {
  // Placeholder for additional fields surfaced by the details endpoint
  // (e.g. created-on, preferences). Leaving empty for forward-compat;
  // callers should treat extra fields via index-signature casting if
  // they read anything beyond the base Organization shape.
}
