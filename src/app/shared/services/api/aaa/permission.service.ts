import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Permission } from '@interfaces/aaa';
import { environment } from '@env/environment';

export interface CreatePermissionRequest {
  value: string;
  description: string;
  moduleId: string;
}

export interface UpdatePermissionRequest {
  value: string;
  description: string;
  moduleId: string;
}

/**
 * HTTP client for `/v1/permissions`. Read endpoints (GET list, GET
 * single) return 403 for super-admin tokens, so this service exposes
 * only the write operations. Permissions are surfaced for the user
 * via the per-module endpoint
 * (ModuleService.getPermissions(moduleId)) which embeds them under
 * the owning module.
 */
@Injectable({ providedIn: 'root' })
export class PermissionService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.authUrl}/v1/permissions`;

  create(body: CreatePermissionRequest): Observable<Permission> {
    return this.http.post<Permission>(this.baseUrl, body);
  }

  update(id: string, body: UpdatePermissionRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
