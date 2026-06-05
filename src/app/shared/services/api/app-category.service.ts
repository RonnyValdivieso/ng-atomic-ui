import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { PagedResult, SearchParams } from '@interfaces/aaa';
import {
  AppCategory,
  CreateAppCategoryDto,
  UpdateAppCategoryDto,
  UpdateAppCategoryStatusDto,
} from '@interfaces/app-category.interface';

@Injectable({ providedIn: 'root' })
export class AppCategoryService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/app-categories`;

  search(params: SearchParams): Observable<PagedResult<AppCategory>> {
    let p = new HttpParams()
      .set('PageNumber', params.pageNumber)
      .set('PageSize', params.pageSize);
    if (params.searchString) p = p.set('SearchString', params.searchString);
    if (params.sortColumn) p = p.set('SortColumn', params.sortColumn);
    if (params.sortOrder) p = p.set('SortOrder', params.sortOrder);
    return this.http.get<PagedResult<AppCategory>>(this.baseUrl, { params: p });
  }

  getByCode(code: string): Observable<AppCategory> {
    return this.http.get<AppCategory>(`${this.baseUrl}/${code}`);
  }

  create(dto: CreateAppCategoryDto): Observable<AppCategory> {
    return this.http.post<AppCategory>(this.baseUrl, dto);
  }

  update(code: string, dto: UpdateAppCategoryDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${code}`, dto);
  }

  updateStatus(code: string, dto: UpdateAppCategoryStatusDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${code}/status`, dto);
  }

  delete(code: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${code}`);
  }
}
