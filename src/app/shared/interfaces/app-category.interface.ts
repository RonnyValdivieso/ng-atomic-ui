// src/app/shared/interfaces/app-category.interface.ts

/** Read-model for an app category. `description`/timestamps are optional —
 *  drop any field the API does not return. */
export interface AppCategory {
  code: string;
  name: string;
  description?: string | null;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

/** POST /app-categories body. */
export interface CreateAppCategoryDto {
  code: string;
  name: string;
  description?: string | null;
  status?: string;
}

/** PUT /app-categories/{code} body — note: no `code` (immutable). */
export interface UpdateAppCategoryDto {
  name?: string;
  description?: string | null;
  status?: string;
}

export interface UpdateAppCategoryStatusDto {
  status: string;
}
