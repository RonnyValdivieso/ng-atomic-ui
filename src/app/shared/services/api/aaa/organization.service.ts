import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import {
  Instance,
  Organization,
  OrganizationDetail,
  PagedResult,
  PaginatedList,
  SearchParams
} from '@interfaces/aaa';
import { environment } from '@env/environment';

/**
 * HTTP client for `/v1/organizations` + subresources.
 *
 * The list endpoint returns the modern `PagedResult<T>` shape
 * (totalCount / pageNumber / pageSize / hasNextPage), distinct from
 * the legacy `PaginatedList<T>` that Instance uses. We normalise both
 * into `PaginatedList<Organization>` so the admin lists can share a
 * single view-model.
 */
@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.authUrl}/v1/organizations`;

  getAll(params?: SearchParams): Observable<PaginatedList<Organization>> {
    let httpParams = new HttpParams();
    if (params?.pageNumber) httpParams = httpParams.set('pageNumber', params.pageNumber);
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
    if (params?.searchString) httpParams = httpParams.set('searchString', params.searchString);
    if (params?.sortColumn) httpParams = httpParams.set('sortColumn', params.sortColumn);
    if (params?.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);

    return this.http
      .get<PagedResult<Organization> | PaginatedList<Organization> | Organization[]>(this.baseUrl, {
        params: httpParams
      })
      .pipe(map(response => this.toPaginatedList(response, params)));
  }

  getById(id: string): Observable<OrganizationDetail> {
    return this.http.get<OrganizationDetail>(`${this.baseUrl}/${id}`);
  }

  getInstances(orgId: string, params?: SearchParams): Observable<PaginatedList<Instance>> {
    let httpParams = new HttpParams();
    if (params?.pageNumber) httpParams = httpParams.set('pageNumber', params.pageNumber);
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
    return this.http
      .get<PagedResult<Instance> | PaginatedList<Instance> | Instance[]>(
        `${this.baseUrl}/${orgId}/instances`,
        { params: httpParams }
      )
      .pipe(map(response => this.toPaginatedList(response, params)));
  }

  /**
   * Adapter: accepts any of `PagedResult<T>`, `PaginatedList<T>`, or flat
   * `T[]` and returns the `PaginatedList<T>` the list components expect.
   */
  private toPaginatedList<T>(
    response: PagedResult<T> | PaginatedList<T> | T[],
    params?: SearchParams
  ): PaginatedList<T> {
    if (Array.isArray(response)) {
      return {
        items: response,
        totalItems: response.length,
        pageIndex: params?.pageNumber ?? 1,
        totalPages: 1
      };
    }
    // PagedResult has `totalCount`; PaginatedList has `totalItems`.
    if ('totalCount' in response) {
      return {
        items: response.items,
        totalItems: response.totalCount,
        pageIndex: response.pageNumber,
        totalPages: response.totalPages ?? Math.max(1, Math.ceil(response.totalCount / (response.pageSize || 1)))
      };
    }
    return response;
  }
}
