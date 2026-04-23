import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import {
  Instance,
  Organization,
  OrganizationDetail,
  PaginatedList,
  SearchParams
} from '@interfaces/aaa';
import { environment } from '@env/environment';

/**
 * HTTP client for `/v1/organizations` + subresources.
 *
 * Swagger doesn't pin the `/v1/organizations` GET response shape, so
 * `getAll` normalises both paginated (`PaginatedList<T>`) and flat
 * (`T[]`) server responses to the same `PaginatedList<Organization>`
 * the list page expects — saves the list from having to special-case.
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
      .get<PaginatedList<Organization> | Organization[]>(this.baseUrl, { params: httpParams })
      .pipe(map(response => this.normalisePage(response, params)));
  }

  getById(id: string): Observable<OrganizationDetail> {
    return this.http.get<OrganizationDetail>(`${this.baseUrl}/${id}`);
  }

  getInstances(orgId: string): Observable<Instance[]> {
    return this.http.get<Instance[]>(`${this.baseUrl}/${orgId}/instances`);
  }

  private normalisePage(
    response: PaginatedList<Organization> | Organization[],
    params?: SearchParams
  ): PaginatedList<Organization> {
    if (Array.isArray(response)) {
      return {
        items: response,
        totalItems: response.length,
        pageIndex: params?.pageNumber ?? 1,
        totalPages: 1
      };
    }
    return response;
  }
}
