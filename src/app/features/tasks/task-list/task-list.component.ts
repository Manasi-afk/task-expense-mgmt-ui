import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { finalize } from 'rxjs';
import { TaskService } from '../../../core/services/task.service';
import { TASK_STATUSES, TASK_STATUS_LABELS, TaskResponse, TaskStatus } from '../../../core/models/task.models';
import { TaskFormDialogComponent } from '../task-form-dialog/task-form-dialog.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    DatePipe,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatCardModule,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly displayedColumns = ['title', 'status', 'dueDate', 'actions'];
  readonly statuses = TASK_STATUSES;
  readonly statusLabels = TASK_STATUS_LABELS;

  readonly tasks = signal<TaskResponse[]>([]);
  readonly loading = signal(false);
  readonly totalElements = signal(0);
  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);
  readonly statusFilter = signal<TaskStatus | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.taskService
      .list({ status: this.statusFilter(), page: this.pageIndex(), size: this.pageSize() })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((page) => {
        this.tasks.set(page.content);
        this.totalElements.set(page.totalElements);
      });
  }

  onFilterChange(status: TaskStatus | null): void {
    this.statusFilter.set(status);
    this.pageIndex.set(0);
    this.load();
  }

  statusLabel(status: TaskStatus): string {
    return this.statusLabels[status];
  }

  onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.load();
  }

  openCreate(): void {
    const ref = this.dialog.open(TaskFormDialogComponent, { width: '480px', data: { task: null } });
    ref.afterClosed().subscribe((created) => {
      if (created) {
        this.snackBar.open('Task created.', 'Dismiss', { duration: 3000 });
        this.load();
      }
    });
  }

  openEdit(task: TaskResponse): void {
    const ref = this.dialog.open(TaskFormDialogComponent, { width: '480px', data: { task } });
    ref.afterClosed().subscribe((updated) => {
      if (updated) {
        this.snackBar.open('Task updated.', 'Dismiss', { duration: 3000 });
        this.load();
      }
    });
  }

  remove(task: TaskResponse): void {
    if (!confirm(`Delete "${task.title}"? This can't be undone.`)) {
      return;
    }
    this.taskService.delete(task.id).subscribe(() => {
      this.snackBar.open('Task deleted.', 'Dismiss', { duration: 3000 });
      this.load();
    });
  }

  statusColor(status: TaskStatus): string {
    switch (status) {
      case 'DONE':
        return 'status-done';
      case 'IN_PROGRESS':
        return 'status-progress';
      default:
        return 'status-todo';
    }
  }
}
