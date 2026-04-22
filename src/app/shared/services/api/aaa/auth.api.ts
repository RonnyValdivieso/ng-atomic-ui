import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginDto, UserDto } from '@interfaces/auth.interface';
import { UserModule } from '@interfaces/aaa';
import { environment } from '@env/environment';

/**
 * Thin HTTP client for the brandbot.aaa Auth & Modules endpoints.
 * Keeps stateful concerns (token storage, signals, navigation) out of the
 * transport layer — see AuthService for those.
 */
@Injectable({ providedIn: 'root' })
export class AaaAuthApi {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.authUrl}/v1`;

  login(dto: LoginDto): Observable<UserDto> {
    const body = { ...dto, app: '*', appType: 'WEB' };
    return this.http.post<UserDto>(`${this.baseUrl}/Auth/login`, body);
  }

  loginWithThirdParty(body: Record<string, unknown>): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.baseUrl}/Auth/login-with-third-party`, body);
  }

  getUserModules(instanceId?: string): Observable<UserModule[]> {
    const url = `${this.baseUrl}/Modules/get-user-modules`;
    const params = instanceId ? { instanceId } : undefined;
    return this.http.get<UserModule[]>(url, params ? { params } : {});
  }
}
