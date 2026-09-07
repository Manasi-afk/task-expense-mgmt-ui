import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../api-config';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.models';

const STORAGE_KEY = 'task-expense-auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly authState = signal<AuthResponse | null>(this.readStoredAuth());

  readonly isAuthenticated = computed(() => this.authState() !== null);
  readonly username = computed(() => this.authState()?.username ?? null);

  get token(): string | null {
    return this.authState()?.token ?? null;
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_BASE_URL}/api/auth/login`, request)
      .pipe(tap((res) => this.setAuth(res)));
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_BASE_URL}/api/auth/register`, request)
      .pipe(tap((res) => this.setAuth(res)));
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.authState.set(null);
    this.router.navigateByUrl('/login');
  }

  private setAuth(res: AuthResponse): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(res));
    this.authState.set(res);
  }

  private readStoredAuth(): AuthResponse | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthResponse;
    } catch {
      return null;
    }
  }
}
