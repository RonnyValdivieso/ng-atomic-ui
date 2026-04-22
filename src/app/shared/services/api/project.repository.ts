import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Workspace } from '../../interfaces/project.interface';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectRepository {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl + '/projects';

  getByUser(): Observable<Workspace[]> {
    return this.http.get<Workspace[]>(`${this.API_URL}/get-by-user`);
  }
}
