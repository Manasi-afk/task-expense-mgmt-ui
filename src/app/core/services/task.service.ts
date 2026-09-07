import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-config';
import { Page } from '../models/page.model';
import { TaskRequest, TaskResponse, TaskStatus } from '../models/task.models';

export interface TaskListParams {
  status?: TaskStatus | null;
  page: number;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly base = `${API_BASE_URL}/api/tasks`;

  list(params: TaskListParams): Observable<Page<TaskResponse>> {
    let httpParams = new HttpParams().set('page', params.page).set('size', params.size);
    if (params.status) {
      httpParams = httpParams.set('status', params.status);
    }
    return this.http.get<Page<TaskResponse>>(this.base, { params: httpParams });
  }

  getOne(id: string): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(`${this.base}/${id}`);
  }

  create(request: TaskRequest): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(this.base, request);
  }

  update(id: string, request: TaskRequest): Observable<TaskResponse> {
    return this.http.put<TaskResponse>(`${this.base}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
