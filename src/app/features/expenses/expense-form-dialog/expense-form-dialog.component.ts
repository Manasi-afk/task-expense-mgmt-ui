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
import { ExpenseService } from '../../../core/services/expense.service';
import { EXPENSE_CATEGORIES, EXPENSE_CATEGORY_LABELS, ExpenseResponse } from '../../../core/models/expense.models';
import { fromIsoDate, toIsoDate } from '../../../shared/date-utils';

export interface ExpenseFormDialogData {
  expense: ExpenseResponse | null;
}

@Component({
  selector: 'app-expense-form-dialog',
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
  templateUrl: './expense-form-dialog.component.html',
  styleUrl: './expense-form-dialog.component.scss',
})
export class ExpenseFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly expenseService = inject(ExpenseService);
  private readonly ref = inject(MatDialogRef<ExpenseFormDialogComponent>);
  readonly data = inject<ExpenseFormDialogData>(MAT_DIALOG_DATA);

  readonly categories = EXPENSE_CATEGORIES;
  readonly categoryLabels = EXPENSE_CATEGORY_LABELS;
  readonly saving = signal(false);
  readonly isEdit = this.data.expense !== null;

  readonly form = this.fb.group({
    description: [this.data.expense?.description ?? '', [Validators.required, Validators.maxLength(200)]],
    amount: [this.data.expense?.amount ?? null, [Validators.required, Validators.min(0.01)]],
    category: [this.data.expense?.category ?? null, this.isEdit ? [Validators.required] : []],
    expenseDate: [fromIsoDate(this.data.expense?.expenseDate ?? null)],
  });

  submit(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const request = {
      description: raw.description!.trim(),
      amount: Number(raw.amount),
      category: raw.category ?? null,
      expenseDate: raw.expenseDate ? toIsoDate(raw.expenseDate) : null,
    };

    this.saving.set(true);
    const call = this.data.expense
      ? this.expenseService.update(this.data.expense.id, request)
      : this.expenseService.create(request);

    call.pipe(finalize(() => this.saving.set(false))).subscribe((result) => this.ref.close(result));
  }

  cancel(): void {
    this.ref.close(null);
  }
}
