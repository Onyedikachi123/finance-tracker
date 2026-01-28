import { Transaction, MonthlyData, Category, CategoryBudget, EXPENSE_CATEGORIES } from '@/types/finance';

const TRANSACTIONS_KEY = 'finance-tracker-transactions';
const BUDGETS_KEY = 'finance-tracker-budgets';

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function saveTransactions(transactions: Transaction[]): void {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
}

export function loadTransactions(): Transaction[] {
  const stored = localStorage.getItem(TRANSACTIONS_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveBudgets(budgets: CategoryBudget[]): void {
  localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
}

export function loadBudgets(): CategoryBudget[] {
  const stored = localStorage.getItem(BUDGETS_KEY);
  if (!stored) {
    // Default budgets
    return EXPENSE_CATEGORIES.map(category => ({
      category,
      limit: category === 'housing' ? 1500 : category === 'food' ? 500 : 300,
    }));
  }
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function getMonthLabel(monthString: string): string {
  const [year, month] = monthString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
}

export function getTransactionMonth(transaction: Transaction): string {
  const date = new Date(transaction.date);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function calculateMonthlyData(transactions: Transaction[], month: string): MonthlyData {
  const monthTransactions = transactions.filter(t => getTransactionMonth(t) === month);

  const byCategory: Record<Category, number> = {
    housing: 0,
    food: 0,
    transport: 0,
    utilities: 0,
    lifestyle: 0,
    income: 0,
  };

  let income = 0;
  let expenses = 0;

  monthTransactions.forEach(t => {
    if (t.type === 'income') {
      income += t.amount;
      byCategory.income += t.amount;
    } else {
      expenses += t.amount;
      byCategory[t.category] += t.amount;
    }
  });

  return {
    income,
    expenses,
    balance: income - expenses,
    byCategory,
  };
}

export function getBudgetStatus(spent: number, limit: number): 'under' | 'approaching' | 'over' {
  const ratio = spent / limit;
  if (ratio >= 1) return 'over';
  if (ratio >= 0.8) return 'approaching';
  return 'under';
}

export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}
