import { memo, useState, useCallback, useMemo } from 'react';
import { Category, EXPENSE_CATEGORIES, CATEGORY_CONFIG } from '@/types/finance';
import { formatCurrency, getBudgetStatus } from '@/lib/finance';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, XCircle, Edit2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface BudgetProgressProps {
  spending: Record<Category, number>;
  budgets: Record<Category, number>;
  onUpdateBudget: (category: Category, limit: number) => void;
}

const STATUS_CONFIG = {
  under: {
    icon: CheckCircle2,
    color: 'text-income',
    bgColor: 'bg-income',
    label: 'On track',
  },
  approaching: {
    icon: AlertTriangle,
    color: 'text-warning',
    bgColor: 'bg-warning',
    label: 'Almost there',
  },
  over: {
    icon: XCircle,
    color: 'text-expense',
    bgColor: 'bg-expense',
    label: 'Over budget',
  },
} as const;

export const BudgetProgress = memo(function BudgetProgress({ spending, budgets, onUpdateBudget }: BudgetProgressProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleStartEdit = useCallback((category: Category) => {
    setEditingCategory(category);
    setEditValue(String(budgets[category] || 0));
  }, [budgets]);

  const handleSaveEdit = useCallback(() => {
    if (editingCategory) {
      const value = parseFloat(editValue);
      if (!isNaN(value) && value >= 0) {
        onUpdateBudget(editingCategory, value);
      }
      setEditingCategory(null);
      setEditValue('');
    }
  }, [editingCategory, editValue, onUpdateBudget]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditingCategory(null);
      setEditValue('');
    }
  }, [handleSaveEdit]);

  return (
    <div className="space-y-4">
      {EXPENSE_CATEGORIES.map((category) => {
        const spent = spending[category] || 0;
        const limit = budgets[category] || 0;
        const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
        const status = getBudgetStatus(spent, limit);
        const config = STATUS_CONFIG[status];
        const StatusIcon = config.icon;

        return (
          <div
            key={category}
            className={cn(
              'p-4 rounded-xl bg-card border border-border/50',
              'hover:border-border transition-all duration-200'
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="font-medium text-foreground">
                  {CATEGORY_CONFIG[category].label}
                </span>
                <StatusIcon className={cn('h-4 w-4', config.color)} />
              </div>

              <div className="flex items-center gap-2">
                {editingCategory === category ? (
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground">₦</span>
                    <Input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleSaveEdit}
                      onKeyDown={handleKeyDown}
                      className="w-20 h-7 text-sm"
                      autoFocus
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => handleStartEdit(category)}
                    className="group flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span className="tabular-nums">
                      {formatCurrency(spent)} / {formatCurrency(limit)}
                    </span>
                    <Edit2 className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                )}
              </div>
            </div>

            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  'absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out',
                  config.bgColor,
                  status === 'over' && 'animate-pulse-soft'
                )}
                style={{
                  width: `${percentage}%`,
                  '--progress-width': `${percentage}%`
                } as React.CSSProperties}
              />
            </div>

            {status === 'over' && (
              <p className="mt-2 text-xs text-expense animate-fade-in">
                {formatCurrency(spent - limit)} over budget
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
});
