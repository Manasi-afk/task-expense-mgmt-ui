import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { TaskService } from '../../../core/services/task.service';
import { TASK_STATUSES, TASK_STATUS_LABELS, TaskResponse } from '../../../core/models/task.models';
import { fromIsoDate, toIsoDate } from '../../../shared/date-utils';

export interface TaskFormDialogData {
  task: TaskResponse | null;
}

@Component({
  selector: 'app-task-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './task-form-dialog.component.html',
  styleUrl: './task-form-dialog.component.scss',
})
export class TaskFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly taskService = inject(TaskService);
  private readonly ref = inject(MatDialogRef<TaskFormDialogComponent>);
  readonly data = inject<TaskFormDialogData>(MAT_DIALOG_DATA);

  readonly statuses = TASK_STATUSES;
  readonly statusLabels = TASK_STATUS_LABELS;
  readonly saving = signal(false);
  readonly isEdit = this.data.task !== null;

  readonly form = this.fb.group({
    title: [this.data.task?.title ?? '', [Validators.required, Validators.maxLength(200)]],
    description: [this.data.task?.description ?? '', [Validators.maxLength(1000)]],
    status: [this.data.task?.status ?? 'TODO'],
    dueDate: [fromIsoDate(this.data.task?.dueDate ?? null)],
  });

  submit(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const request = {
      title: raw.title!.trim(),
      description: raw.description?.trim() ? raw.description.trim() : null,
      status: raw.status ?? null,
      dueDate: raw.dueDate ? toIsoDate(raw.dueDate) : null,
    };

    this.saving.set(true);
    const call = this.data.task
      ? this.taskService.update(this.data.task.id, request)
      : this.taskService.create(request);

    call.pipe(finalize(() => this.saving.set(false))).subscribe((result) => this.ref.close(result));
  }

  cancel(): void {
    this.ref.close(null);
  }
}
