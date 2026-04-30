/**
 * Lightweight module shape used by AuthService for permission tracking.
 * Returned by GET /v1/Modules/get-user-modules. Do not remove — it's
 * used by the auth pipeline.
 */
export interface UserModule {
  id: string;
  name: string;
  status?: string | null;
  permissions?: string[];
}

export type ModuleStatus = 'ACTIVE' | 'INACTIVE' | 'Active' | 'Inactive';

/**
 * System-asset module shape returned by GET /v1/modules.
 */
export interface Module {
  id: string;
  name: string;
  status: ModuleStatus;
}

/** Detail shape; identical to Module today but kept distinct for forward-compat. */
export type ModuleDetail = Module;

export interface CreateModuleRequest {
  name: string;
}

export interface UpdateModuleRequest {
  name: string;
}
