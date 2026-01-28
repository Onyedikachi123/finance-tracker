import { memo, useMemo } from 'react';
import { MonthlyData } from '@/types/finance';
import { formatCurrency } from '@/lib/finance';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MonthlyOverviewProps {
  data: MonthlyData;
}

export const MonthlyOverview = memo(function MonthlyOverview({ data }: MonthlyOverviewProps) {
  const cards = useMemo(() => [
    {
      title: 'Income',
      value: data.income,
      icon: TrendingUp,
      colorClass: 'text-income',
      bgClass: 'bg-income-muted',
      iconBgClass: 'bg-income/10',
      prefix: '+',
    },
    {
      title: 'Expenses',
      value: data.expenses,
      icon: TrendingDown,
      colorClass: 'text-expense',
      bgClass: 'bg-expense-muted',
      iconBgClass: 'bg-expense/10',
      prefix: '-',
    },
    {
      title: 'Balance',
      value: data.balance,
      icon: Wallet,
      colorClass: data.balance >= 0 ? 'text-income' : 'text-expense',
      bgClass: data.balance >= 0 ? 'bg-income-muted' : 'bg-expense-muted',
      iconBgClass: data.balance >= 0 ? 'bg-income/10' : 'bg-expense/10',
      prefix: data.balance >= 0 ? '+' : '',
    },
  ], [data.income, data.expenses, data.balance]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <div
          key={card.title}
          className={cn(
            'relative overflow-hidden rounded-2xl p-5 transition-all duration-300',
            'bg-card border border-border/50 hover:border-border hover:shadow-card',
            'animate-slide-up'
          )}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className={cn(
              'h-10 w-10 rounded-xl flex items-center justify-center',
              card.iconBgClass
            )}>
              <card.icon className={cn('h-5 w-5', card.colorClass)} />
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground font-medium mb-1">
            {card.title}
          </p>
          
          <p className={cn(
            'text-2xl font-display font-bold tabular-nums tracking-tight',
            card.colorClass
          )}>
            {card.title !== 'Balance' && card.prefix}
            {card.title === 'Balance' && data.balance < 0 ? '-' : card.title === 'Balance' ? '+' : ''}
            {formatCurrency(Math.abs(card.value))}
          </p>
        </div>
      ))}
    </div>
  );
});
