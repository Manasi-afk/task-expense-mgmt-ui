import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { finalize } from 'rxjs';
import { ExpenseService } from '../../../core/services/expense.service';
import {
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_LABELS,
  ExpenseCategory,
  ExpenseResponse,
} from '../../../core/models/expense.models';
import { ExpenseFormDialogComponent } from '../expense-form-dialog/expense-form-dialog.component';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [
    DatePipe,
    CurrencyPipe,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatCardModule,
  ],
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.scss',
})
export class ExpenseListComponent implements OnInit {
  private readonly expenseService = inject(ExpenseService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly displayedColumns = ['description', 'category', 'amount', 'expenseDate', 'actions'];
  readonly categories = EXPENSE_CATEGORIES;
  readonly categoryLabels = EXPENSE_CATEGORY_LABELS;

  readonly expenses = signal<ExpenseResponse[]>([]);
  readonly loading = signal(false);
  readonly totalElements = signal(0);
  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);
  readonly categoryFilter = signal<ExpenseCategory | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.expenseService
      .list({ category: this.categoryFilter(), page: this.pageIndex(), size: this.pageSize() })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((page) => {
        this.expenses.set(page.content);
        this.totalElements.set(page.totalElements);
      });
  }

  onFilterChange(category: ExpenseCategory | null): void {
    this.categoryFilter.set(category);
    this.pageIndex.set(0);
    this.load();
  }

  categoryLabel(category: ExpenseCategory): string {
    return this.categoryLabels[category];
  }

  categoryColor(category: ExpenseCategory): string {
    return `category-${category.toLowerCase()}`;
  }

  onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.load();
  }

  openCreate(): void {
    const ref = this.dialog.open(ExpenseFormDialogComponent, { width: '480px', data: { expense: null } });
    ref.afterClosed().subscribe((created) => {
      if (created) {
        this.snackBar.open('Expense added.', 'Dismiss', { duration: 3000 });
        this.load();
      }
    });
  }

  openEdit(expense: ExpenseResponse): void {
    const ref = this.dialog.open(ExpenseFormDialogComponent, { width: '480px', data: { expense } });
    ref.afterClosed().subscribe((updated) => {
      if (updated) {
        this.snackBar.open('Expense updated.', 'Dismiss', { duration: 3000 });
        this.load();
      }
    });
  }

  remove(expense: ExpenseResponse): void {
    if (!confirm(`Delete "${expense.description}"? This can't be undone.`)) {
      return;
    }
    this.expenseService.delete(expense.id).subscribe(() => {
      this.snackBar.open('Expense deleted.', 'Dismiss', { duration: 3000 });
      this.load();
    });
  }
}
