import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: '',
    loadComponent: () => import('./features/shell/shell.component').then((m) => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'tasks', pathMatch: 'full' },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./features/tasks/task-list/task-list.component').then((m) => m.TaskListComponent),
      },
      {
        path: 'expenses',
        loadComponent: () =>
          import('./features/expenses/expense-list/expense-list.component').then(
            (m) => m.ExpenseListComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
