export type ExpenseCategory =
  | 'FOOD'
  | 'TRAVEL'
  | 'UTILITIES'
  | 'ENTERTAINMENT'
  | 'HEALTH'
  | 'SHOPPING'
  | 'RENT'
  | 'EDUCATION'
  | 'OTHER';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'FOOD',
  'TRAVEL',
  'UTILITIES',
  'ENTERTAINMENT',
  'HEALTH',
  'SHOPPING',
  'RENT',
  'EDUCATION',
  'OTHER',
];

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  FOOD: 'Food',
  TRAVEL: 'Travel',
  UTILITIES: 'Utilities',
  ENTERTAINMENT: 'Entertainment',
  HEALTH: 'Health',
  SHOPPING: 'Shopping',
  RENT: 'Rent',
  EDUCATION: 'Education',
  OTHER: 'Other',
};

export interface ExpenseRequest {
  description: string;
  amount: number;
  category: ExpenseCategory | null; // omit/null to let the backend auto-categorize via AI
  expenseDate: string | null; // ISO date
}

export interface ExpenseResponse {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  autoCategorized: boolean;
  expenseDate: string;
  createdAt: string;
  updatedAt: string;
}
