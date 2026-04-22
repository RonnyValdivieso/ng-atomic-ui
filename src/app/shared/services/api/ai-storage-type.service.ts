import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AIStorageType, CreateAIStorageTypeDto, UpdateAIStorageTypeDto } from '../../interfaces/ai-storage-type.interface';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class AIStorageTypeService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/ai-storage-types';

  getAll(): Observable<AIStorageType[]> {
    return this.http.get<AIStorageType[]>(this.apiUrl);
  }

  getByCode(code: string): Observable<AIStorageType> {
    return this.http.get<AIStorageType>(`${this.apiUrl}/${code}`);
  }

  create(dto: CreateAIStorageTypeDto): Observable<AIStorageType> {
    return this.http.post<AIStorageType>(this.apiUrl, dto);
  }

  update(code: string, dto: UpdateAIStorageTypeDto): Observable<AIStorageType> {
    return this.http.put<AIStorageType>(`${this.apiUrl}/${code}`, dto);
  }

  delete(code: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${code}`);
  }
}
