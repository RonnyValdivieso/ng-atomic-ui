/**
 * Permission row as returned by GET /v1/modules/{id}/permissions —
 * sampled from staging (swagger doesn't pin the response). The endpoint
 * actually returns `{id, name, permissions: [...]}` so callers must
 * extract `.permissions`. Each item has:
 *
 * - `id`: GUID
 * - `description`: short, lowercase, snake_case (e.g. "view", "view_audit_log")
 * - `value`: technical code used in JWT claims (e.g. "AIAgentsView")
 *
 * The standalone /v1/permissions endpoint returns 403 for super-admin
 * tokens — that's why permissions are surfaced under their owning
 * module rather than as a top-level resource.
 */
export interface Permission {
  id: string;
  description: string;
  value: string;
}

/** Wrapper returned by /v1/modules/{id}/permissions. */
export interface ModulePermissions {
  id: string;
  name: string;
  permissions: Permission[];
}
