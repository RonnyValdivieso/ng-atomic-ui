export interface PaginatedList<T> {
  pageIndex: number;
  totalPages: number;
  totalItems: number;
  items: T[];
}
