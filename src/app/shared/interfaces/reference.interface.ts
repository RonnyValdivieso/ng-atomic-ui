/**
 * Reference-data DTOs from the main API (`environment.apiUrl`):
 * languages and (searchable, paginated) time zones. Used to populate the
 * account profile selects.
 */

/** GET /api/languages */
export interface Language {
  id: number;
  code: string | null;
  description: string | null;
}

/** Item of GET /api/time-zones */
export interface SimpleTimeZone {
  name: string | null;
  timezoneName: string | null;
  gmtHours: number;
  gmtMinutes: number;
  gmtToQuarters: number;
}

/** GET /api/time-zones */
export interface SimpleTimeZonePaginatedList {
  items: SimpleTimeZone[] | null;
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface TimeZoneQuery {
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortOrder?: string;
}
