import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  CreateModuleRequest,
  Module,
  ModuleDetail,
  Permission,
  UpdateModuleRequest
} from '@interfaces/aaa';
import { environment } from '@env/environment';

/**
 * HTTP client for `/v1/modules`. The list endpoint returns a flat
 * array (no server pagination); list pages can use a non-paginated
 * table or wrap it for consistency.
 */
@Injectable({ providedIn: 'root' })
export class ModuleService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.authUrl}/v1/modules`;

  getAll(): Observable<Module[]> {
    return this.http.get<Module[]>(this.baseUrl);
  }

  getById(id: string): Observable<ModuleDetail> {
    return this.http.get<ModuleDetail>(`${this.baseUrl}/${id}`);
  }

  getPermissions(id: string): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.baseUrl}/${id}/permissions`);
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
}
