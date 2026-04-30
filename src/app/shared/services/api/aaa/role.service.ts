import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import {
  CreateRoleRequest,
  PagedResult,
  PaginatedList,
  Role,
  RoleDetail,
  SearchParams,
  UpdateRoleRequest
} from '@interfaces/aaa';
import { environment } from '@env/environment';

/**
 * HTTP client for `/v1/roles`. The list endpoint returns a hybrid
 * shape (`pageIndex`/`totalItems` from PaginatedList plus
 * `hasNextPage`/`hasPreviousPage` from PagedResult). We normalise to
 * `PaginatedList<Role>` for the list page.
 */
@Injectable({ providedIn: 'root' })
export class RoleService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.authUrl}/v1/roles`;

  getAll(params?: SearchParams): Observable<PaginatedList<Role>> {
    let httpParams = new HttpParams();
    if (params?.pageNumber) httpParams = httpParams.set('pageNumber', params.pageNumber);
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
    if (params?.searchString) httpParams = httpParams.set('searchString', params.searchString);
    return this.http
      .get<PaginatedList<Role> | PagedResult<Role> | Role[]>(this.baseUrl, { params: httpParams })
      .pipe(map(response => this.toPaginatedList(response, params)));
  }

  getById(id: string): Observable<RoleDetail> {
    return this.http.get<RoleDetail>(`${this.baseUrl}/${id}`);
  }

  create(body: CreateRoleRequest): Observable<Role> {
    return this.http.post<Role>(this.baseUrl, body);
  }

  update(id: string, body: UpdateRoleRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  private toPaginatedList<T>(
    response: PaginatedList<T> | PagedResult<T> | T[],
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
    if ('totalCount' in response) {
      return {
        items: response.items,
        totalItems: response.totalCount,
        pageIndex: response.pageNumber,
        totalPages:
          response.totalPages ??
          Math.max(1, Math.ceil(response.totalCount / (response.pageSize || 1)))
      };
    }
    return response;
  }
}
