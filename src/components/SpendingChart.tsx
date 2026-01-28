import { memo, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Category, EXPENSE_CATEGORIES, CATEGORY_CONFIG } from '@/types/finance';
import { formatCurrency } from '@/lib/finance';
import { PieChart as PieChartIcon } from 'lucide-react';

interface SpendingChartProps {
  spending: Record<Category, number>;
}

const CATEGORY_COLORS: Record<Category, string> = {
  housing: 'hsl(220, 70%, 55%)',
  food: 'hsl(25, 90%, 55%)',
  transport: 'hsl(174, 62%, 45%)',
  utilities: 'hsl(280, 60%, 55%)',
  lifestyle: 'hsl(340, 70%, 55%)',
  income: 'hsl(152, 55%, 45%)',
};

export const SpendingChart = memo(function SpendingChart({ spending }: SpendingChartProps) {
  const { data, total } = useMemo(() => {
    const chartData = EXPENSE_CATEGORIES
      .map(category => ({
        name: CATEGORY_CONFIG[category].label,
        value: spending[category] || 0,
        category,
      }))
      .filter(item => item.value > 0);
    
    return {
      data: chartData,
      total: chartData.reduce((sum, item) => sum + item.value, 0)
    };
  }, [spending]);

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
        <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <PieChartIcon className="h-7 w-7 text-muted-foreground" />
        </div>
        <h3 className="font-display text-base font-semibold text-foreground mb-1">
          No spending data
        </h3>
        <p className="text-muted-foreground text-sm">
          Add expenses to see your breakdown
        </p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const percentage = ((item.value / total) * 100).toFixed(1);
      return (
        <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg">
          <p className="font-medium text-sm">{item.name}</p>
          <p className="text-muted-foreground text-sm">
            {formatCurrency(item.value)} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-1.5">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {data.map((entry) => (
              <Cell 
                key={entry.category} 
                fill={CATEGORY_COLORS[entry.category]}
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="text-center -mt-2">
        <p className="text-2xl font-display font-bold text-foreground">
          {formatCurrency(total)}
        </p>
        <p className="text-sm text-muted-foreground">Total Spending</p>
      </div>
    </div>
  );
});
