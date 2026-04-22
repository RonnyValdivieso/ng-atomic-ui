export interface SearchParams {
  pageNumber: number;
  pageSize: number;
  searchString?: string;
  sortColumn?: string;
  sortOrder?: 'asc' | 'desc';
}
