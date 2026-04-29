/**
 * Lightweight reference to an organization, matching the
 * `OrganizationSummaryDto` nested inside list/detail responses elsewhere
 * in AAA (e.g. `InstanceDetailDto.organization`).
 */
export interface OrganizationSummary {
  id: string;
  name: string;
}

/**
 * Full organization row as returned by `/v1/organizations` (list) and
 * `/v1/organizations/{id}` (detail) — both endpoints return the same
 * shape. Derived from sampling the staging API; swagger doesn't pin
 * this response schema.
 */
export interface Organization {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  status: string;
  serviceTeamId?: string | null;
  squarePicture?: string | null;
  rectangularPicture?: string | null;
  email?: string | null;
  phone?: string | null;
}

/** Alias kept for forward-compat; no extra fields today. */
export type OrganizationDetail = Organization;
