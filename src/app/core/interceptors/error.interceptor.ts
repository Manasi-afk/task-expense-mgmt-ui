import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ApiError } from '../models/api-error.model';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        const wasLoggedIn = auth.isAuthenticated();
        auth.logout();
        if (wasLoggedIn) {
          snackBar.open('Your session expired. Please log in again.', 'Dismiss', { duration: 5000 });
        }
      } else {
        snackBar.open(extractMessage(err), 'Dismiss', { duration: 5000 });
      }
      return throwError(() => err);
    }),
  );
};

function extractMessage(err: HttpErrorResponse): string {
  const body = err.error as ApiError | undefined;
  if (body?.details?.length) {
    return body.details.join(' ');
  }
  if (body?.message) {
    return body.message;
  }
  return 'Something went wrong. Please try again.';
}
