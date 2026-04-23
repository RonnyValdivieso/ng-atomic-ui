import { OrganizationSummary } from './organization.interface';

/**
 * List-row shape. The GET /v1/instance list endpoint returns these.
 */
export interface Instance {
  id: string;
  name: string;
  domain?: string | null;
  description?: string | null;
  defaultLanguage?: string | null;
  defaultCurrency?: string | null;
  status?: string | null;
  timeZoneReference?: string | null;
  picture?: string | null;
  organizationId?: string | null;
  serviceTeamId?: string | null;
}

/**
 * Detail shape for GET /v1/instance/{id}. Mirrors `InstanceDetailDto`
 * in the AAA swagger: the parent organization is inlined as a
 * summary, not just an id.
 */
export interface InstanceDetail extends Omit<Instance, 'organizationId'> {
  organization?: OrganizationSummary | null;
  preference?: string | null;
}
