export type TransactionType = 'income' | 'expense';

export type Category =
  | 'housing'
  | 'food'
  | 'transport'
  | 'utilities'
  | 'lifestyle'
  | 'income';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: Category;
  description: string;
  date: string;
}

export interface CategoryBudget {
  category: Category;
  limit: number;
}

export interface MonthlyData {
  income: number;
  expenses: number;
  balance: number;
  byCategory: Record<Category, number>;
}

export const EXPENSE_CATEGORIES: Category[] = ['housing', 'food', 'transport', 'utilities', 'lifestyle'];
export const ALL_CATEGORIES: Category[] = [...EXPENSE_CATEGORIES, 'income'];

export const CATEGORY_CONFIG: Record<Category, { label: string; icon: string; color: string }> = {
  housing: { label: 'Housing (Rent, NEPA)', icon: 'Home', color: 'hsl(var(--category-housing))' },
  food: { label: 'Food & Groceries', icon: 'Utensils', color: 'hsl(var(--category-food))' },
  transport: { label: 'Transport (Fuel, Public)', icon: 'Car', color: 'hsl(var(--category-transport))' },
  utilities: { label: 'Utilities & Internet', icon: 'Zap', color: 'hsl(var(--category-utilities))' },
  lifestyle: { label: 'Personal / Misc', icon: 'Sparkles', color: 'hsl(var(--category-lifestyle))' },
  income: { label: 'Income', icon: 'Wallet', color: 'hsl(var(--income))' },
};
