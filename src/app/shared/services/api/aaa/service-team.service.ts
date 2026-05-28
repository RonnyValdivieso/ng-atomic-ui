import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateServiceTeamRequest,
  PagedResult,
  SearchParams,
  ServiceTeam,
  ServiceTeamDetail,
  UpdateServiceTeamRequest,
  UpdateServiceTeamStatusRequest
} from '@interfaces/aaa';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class ServiceTeamService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.authUrl}/v1/service-teams`;

  search(params: SearchParams): Observable<PagedResult<ServiceTeam>> {
    let httpParams = new HttpParams()
      .set('pageNumber', params.pageNumber)
      .set('pageSize', params.pageSize);
    if (params.searchString) httpParams = httpParams.set('searchString', params.searchString);
    if (params.sortColumn) httpParams = httpParams.set('sortColumn', params.sortColumn);
    if (params.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);
    return this.http.get<PagedResult<ServiceTeam>>(this.baseUrl, { params: httpParams });
  }

  getById(id: string): Observable<ServiceTeamDetail> {
    return this.http.get<ServiceTeamDetail>(`${this.baseUrl}/${id}`);
  }

  create(body: CreateServiceTeamRequest): Observable<ServiceTeam> {
    return this.http.post<ServiceTeam>(this.baseUrl, body);
  }

  update(id: string, body: UpdateServiceTeamRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, body);
  }

  updateStatus(id: string, body: UpdateServiceTeamStatusRequest): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/status`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
