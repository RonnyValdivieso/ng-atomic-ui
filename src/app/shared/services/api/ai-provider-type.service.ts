import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AIProviderType, CreateAIProviderTypeDto, UpdateAIProviderTypeDto } from '../../interfaces/ai-provider-type.interface';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class AIProviderTypeService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/ai-provider-types';

  getAll(): Observable<AIProviderType[]> {
    return this.http.get<AIProviderType[]>(this.apiUrl);
  }

  getByCode(code: string): Observable<AIProviderType | undefined> {
    return this.getAll().pipe(
      map(types => types.find(type => type.code === code))
    );
  }

  create(dto: CreateAIProviderTypeDto): Observable<AIProviderType> {
    return this.http.post<AIProviderType>(this.apiUrl, dto);
  }

  update(code: string, dto: UpdateAIProviderTypeDto): Observable<AIProviderType> {
    return this.http.put<AIProviderType>(`${this.apiUrl}/${code}`, dto);
  }

  delete(code: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${code}`);
  }
}
