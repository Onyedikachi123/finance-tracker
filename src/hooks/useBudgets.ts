import { useState, useEffect, useCallback } from 'react';
import { CategoryBudget, Category } from '@/types/finance';
import { saveBudgets, loadBudgets } from '@/lib/finance';

export function useBudgets() {
  const [budgets, setBudgets] = useState<CategoryBudget[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = loadBudgets();
    setBudgets(stored);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveBudgets(budgets);
    }
  }, [budgets, isLoaded]);

  const updateBudget = useCallback((category: Category, limit: number) => {
    setBudgets(prev => {
      const existing = prev.find(b => b.category === category);
      if (existing) {
        return prev.map(b => (b.category === category ? { ...b, limit } : b));
      }
      return [...prev, { category, limit }];
    });
  }, []);

  const getBudget = useCallback(
    (category: Category): number => {
      return budgets.find(b => b.category === category)?.limit ?? 0;
    },
    [budgets]
  );

  return {
    budgets,
    isLoaded,
    updateBudget,
    getBudget,
  };
}
