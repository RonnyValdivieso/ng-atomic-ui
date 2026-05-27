import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import {
  CreateModuleRequest,
  Module,
  ModuleDetail,
  ModulePermissions,
  PagedResult,
  PaginatedList,
  Permission,
  SearchParams,
  UpdateModuleRequest
} from '@interfaces/aaa';
import { environment } from '@env/environment';

/**
 * HTTP client for `/v1/modules`. The list endpoint returns the modern
 * `PagedResult<T>` shape (totalCount/pageNumber/pageSize/hasNextPage),
 * normalised to `PaginatedList<Module>` for the list page.
 */
@Injectable({ providedIn: 'root' })
export class ModuleService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.authUrl}/v1/modules`;

  getAll(params?: SearchParams): Observable<PaginatedList<Module>> {
    let httpParams = new HttpParams();
    if (params?.pageNumber) httpParams = httpParams.set('pageNumber', params.pageNumber);
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
    if (params?.searchString) httpParams = httpParams.set('searchString', params.searchString);
    return this.http
      .get<PagedResult<Module> | PaginatedList<Module> | Module[]>(this.baseUrl, {
        params: httpParams
      })
      .pipe(map(response => this.toPaginatedList(response, params)));
  }

  getById(id: string): Observable<ModuleDetail> {
    return this.http.get<ModuleDetail>(`${this.baseUrl}/${id}`);
  }

  getPermissions(id: string): Observable<Permission[]> {
    return this.http
      .get<ModulePermissions>(`${this.baseUrl}/${id}/permissions`)
      .pipe(map(response => response.permissions ?? []));
  }

  create(body: CreateModuleRequest): Observable<Module> {
    return this.http.post<Module>(this.baseUrl, body);
  }

  update(id: string, body: UpdateModuleRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

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
