import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Language,
  SimpleTimeZonePaginatedList,
  TimeZoneQuery
} from '@interfaces/reference.interface';
import { environment } from '@env/environment';

/**
 * Read-only reference data from the main API: the language list and the
 * searchable, paginated time-zone list used by the account profile selects.
 */
@Injectable({ providedIn: 'root' })
export class ReferenceDataService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(`${this.baseUrl}/languages`);
  }

  getTimeZones(query: TimeZoneQuery = {}): Observable<SimpleTimeZonePaginatedList> {
    let params = new HttpParams();
    if (query.searchString) params = params.set('searchString', query.searchString);
    if (query.pageNumber != null) params = params.set('pageNumber', query.pageNumber);
    if (query.pageSize != null) params = params.set('pageSize', query.pageSize);
    if (query.sortOrder) params = params.set('sortOrder', query.sortOrder);
    return this.http.get<SimpleTimeZonePaginatedList>(`${this.baseUrl}/time-zones`, { params });
  }
}
