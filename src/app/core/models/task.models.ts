export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export const TASK_STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: 'To do',
  IN_PROGRESS: 'In progress',
  DONE: 'Done',
};

export interface TaskRequest {
  title: string;
  description: string | null;
  status: TaskStatus | null;
  dueDate: string | null; // ISO date, e.g. 2026-08-25
}

export interface TaskResponse {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}
