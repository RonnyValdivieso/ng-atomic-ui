import { OrganizationSummary } from './organization.interface';

/**
 * Instance row as returned by `/v1/instance` (list) — derived from
 * sampling the staging API. Note: the list endpoint inlines the parent
 * `organization: OrganizationSummary` rather than a flat
 * `organizationId`, same as the detail endpoint.
 */
export interface Instance {
  id: string;
  name: string;
  domain?: string | null;
  description?: string | null;
  defaultLanguage?: string | null;
  status?: string | null;
  timeZoneReference?: string | null;
  picture?: string | null;
  serviceTeamId?: string | null;
  organization?: OrganizationSummary | null;
}

/**
 * Detail shape for `/v1/instance/{id}`. Swagger pins this as
 * `InstanceDetailDto` with one extra field (`preference`) on top of
 * the list shape.
 */
export interface InstanceDetail extends Instance {
  preference?: string | null;
}
