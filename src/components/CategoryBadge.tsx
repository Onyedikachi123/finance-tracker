import { Category, CATEGORY_CONFIG } from '@/types/finance';
import { Home, Utensils, Car, Zap, Sparkles, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap = {
  Home,
  Utensils,
  Car,
  Zap,
  Sparkles,
  Wallet,
};

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function CategoryBadge({ category, size = 'md', showLabel = true }: CategoryBadgeProps) {
  const config = CATEGORY_CONFIG[category];
  const Icon = iconMap[config.icon as keyof typeof iconMap];

  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 18,
  };

  const categoryColorClasses: Record<Category, string> = {
    housing: 'bg-category-housing/10 text-category-housing',
    food: 'bg-category-food/10 text-category-food',
    transport: 'bg-category-transport/10 text-category-transport',
    utilities: 'bg-category-utilities/10 text-category-utilities',
    lifestyle: 'bg-category-lifestyle/10 text-category-lifestyle',
    income: 'bg-income/10 text-income',
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'flex items-center justify-center rounded-lg transition-transform hover:scale-105',
          sizeClasses[size],
          categoryColorClasses[category]
        )}
      >
        <Icon size={iconSizes[size]} />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-foreground">{config.label}</span>
      )}
    </div>
  );
}
