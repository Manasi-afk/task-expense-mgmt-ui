import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-config';
import { Page } from '../models/page.model';
import { ExpenseCategory, ExpenseRequest, ExpenseResponse } from '../models/expense.models';

export interface ExpenseListParams {
  category?: ExpenseCategory | null;
  page: number;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private readonly http = inject(HttpClient);
  private readonly base = `${API_BASE_URL}/api/expenses`;

  list(params: ExpenseListParams): Observable<Page<ExpenseResponse>> {
    let httpParams = new HttpParams().set('page', params.page).set('size', params.size);
    if (params.category) {
      httpParams = httpParams.set('category', params.category);
    }
    return this.http.get<Page<ExpenseResponse>>(this.base, { params: httpParams });
  }

  getOne(id: string): Observable<ExpenseResponse> {
    return this.http.get<ExpenseResponse>(`${this.base}/${id}`);
  }

  create(request: ExpenseRequest): Observable<ExpenseResponse> {
    return this.http.post<ExpenseResponse>(this.base, request);
  }

  update(id: string, request: ExpenseRequest): Observable<ExpenseResponse> {
    return this.http.put<ExpenseResponse>(`${this.base}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
