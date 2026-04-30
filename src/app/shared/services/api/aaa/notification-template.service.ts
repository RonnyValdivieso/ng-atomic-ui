import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  CreateNotificationTemplateRequest,
  NotificationTemplate,
  NotificationTemplateDetail,
  PaginatedList,
  SearchParams,
  UpdateNotificationTemplateRequest
} from '@interfaces/aaa';
import { environment } from '@env/environment';

/**
 * HTTP client for `/v1/NotificationTemplates`. List returns the
 * legacy `PaginatedList<T>` shape (pageIndex/totalItems).
 */
@Injectable({ providedIn: 'root' })
export class NotificationTemplateService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.authUrl}/v1/NotificationTemplates`;

  getAll(params?: SearchParams): Observable<PaginatedList<NotificationTemplate>> {
    let httpParams = new HttpParams();
    if (params?.pageNumber) httpParams = httpParams.set('pageNumber', params.pageNumber);
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
    return this.http.get<PaginatedList<NotificationTemplate>>(this.baseUrl, { params: httpParams });
  }

  getById(id: string): Observable<NotificationTemplateDetail> {
    return this.http.get<NotificationTemplateDetail>(`${this.baseUrl}/${id}`);
  }

  create(body: CreateNotificationTemplateRequest): Observable<NotificationTemplate> {
    return this.http.post<NotificationTemplate>(this.baseUrl, body);
  }

  update(id: string, body: UpdateNotificationTemplateRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
