/**
 * Role row as returned by GET /v1/roles. Status casing is mixed in
 * staging ("ACTIVE" / "Active") so the type stays loose.
 */
export interface Role {
  id: string;
  name: string;
  instanceId: string;
  status: string;
  permissionCount?: number;
  moduleCount?: number;
}

export type RoleDetail = Role;

export interface CreateRoleRequest {
  name: string;
  permissions?: string[] | null;
}

export interface UpdateRoleRequest {
  name: string;
  permissions?: string[] | null;
}
