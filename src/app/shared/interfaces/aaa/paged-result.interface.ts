/**
 * Modern AAA paginated response shape, returned by endpoints whose query DTO
 * inherits from `PagedQuery` (e.g. ServiceTeams). Distinct from the legacy
 * `PaginatedList<T>` used by older controllers like Instance.
 */
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
