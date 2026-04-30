/**
 * Permission row as returned by GET /v1/modules/{id}/permissions.
 * Shape inferred from swagger; the standalone /v1/permissions endpoint
 * is super-admin-403 in staging so we surface permissions only as a
 * read-only sub-list under their owning module.
 */
export interface Permission {
  id: string;
  name: string;
  code?: string | null;
  moduleId?: string | null;
  status?: string | null;
}
