import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { AuthService } from '@shared/services/auth/auth.service';
import { isExpired } from '@utils/jwt.util';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.accessToken();

  if (!token) {
    return next(req);
  }

  if (isExpired(token)) {
    auth.logout();
    return throwError(() => new Error('Session expired'));
  }

  const cloned = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });
  return next(cloned);
};
