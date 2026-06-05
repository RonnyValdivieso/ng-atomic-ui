import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateServiceTeamRequest,
  PagedResult,
  SearchParams,
  ServiceTeam,
  ServiceTeamDetail,
  ServiceTeamMember,
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

  /**
   * Paginated members roster. Query params are PascalCase on this endpoint
   * (`SearchString`, `PageNumber`, `PageSize`) per swagger.
   */
  getMembers(id: string, params: SearchParams): Observable<PagedResult<ServiceTeamMember>> {
    let httpParams = new HttpParams()
      .set('PageNumber', params.pageNumber)
      .set('PageSize', params.pageSize);
    if (params.searchString) httpParams = httpParams.set('SearchString', params.searchString);
    return this.http.get<PagedResult<ServiceTeamMember>>(`${this.baseUrl}/${id}/members`, { params: httpParams });
  }

  /**
   * Create a service team. The endpoint is `multipart/form-data` so the
   * Square/Rectangular pictures can be sent in the same request as the
   * textual fields. Field name casing matches the multipart contract
   * (`Name`, `Email`, `Phone`, `Code`, `Address`, `SquarePicture`,
   * `RectangularPicture`).
   */
  create(body: CreateServiceTeamRequest): Observable<ServiceTeam> {
    const fd = new FormData();
    fd.append('Name', body.name);
    if (body.email != null && body.email !== '') fd.append('Email', body.email);
    if (body.phone != null && body.phone !== '') fd.append('Phone', body.phone);
    if (body.code != null && body.code !== '') fd.append('Code', body.code);
    if (body.address != null && body.address !== '') fd.append('Address', body.address);
    if (body.squarePicture) fd.append('SquarePicture', body.squarePicture, body.squarePicture.name);
    if (body.rectangularPicture) fd.append('RectangularPicture', body.rectangularPicture, body.rectangularPicture.name);
    // Note: don't set Content-Type manually — the browser fills in the
    // multipart boundary automatically.
    return this.http.post<ServiceTeam>(this.baseUrl, fd);
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
