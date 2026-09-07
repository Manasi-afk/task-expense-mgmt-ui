import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { API_BASE_URL } from '../api-config';

// Mirrors the collection-level bearer auth in the Postman collection: every
// request to our API gets the token attached automatically, register/login
// included (the backend just ignores it there since those routes are permitAll).
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token;

  if (token && req.url.startsWith(API_BASE_URL)) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(req);
};
