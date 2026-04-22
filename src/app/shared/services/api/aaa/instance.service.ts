import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Instance, PaginatedList, SearchParams } from '@interfaces/aaa';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class InstanceService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.authUrl}/v1/Instance`;

  getAll(params: SearchParams): Observable<PaginatedList<Instance>> {
    let httpParams = new HttpParams()
      .set('pageNumber', params.pageNumber)
      .set('pageSize', params.pageSize);
    if (params.searchString) httpParams = httpParams.set('searchString', params.searchString);
    if (params.sortColumn) httpParams = httpParams.set('sortColumn', params.sortColumn);
    if (params.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);
    return this.http.get<PaginatedList<Instance>>(this.baseUrl, { params: httpParams });
  }

  getById(id: string): Observable<Instance> {
    return this.http.get<Instance>(`${this.baseUrl}/${id}`);
  }
}
