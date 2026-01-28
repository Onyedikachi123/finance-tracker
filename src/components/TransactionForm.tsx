import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Transaction, TransactionType, Category, EXPENSE_CATEGORIES, CATEGORY_CONFIG } from '@/types/finance';
import { getToday } from '@/lib/finance';
import { cn } from '@/lib/utils';

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
}

export function TransactionForm({ onSubmit }: TransactionFormProps) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(getToday());
  const [error, setError] = useState('');

  const resetForm = () => {
    setType('expense');
    setAmount('');
    setCategory('food');
    setDescription('');
    setDate(getToday());
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      const errorMsg = 'Please enter a valid amount';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    try {
      onSubmit({
        type,
        amount: parsedAmount,
        category: type === 'income' ? 'income' : category,
        description: description.trim() || (type === 'income' ? 'Income' : CATEGORY_CONFIG[category].label),
        date,
      });

      toast.success(`${type === 'income' ? 'Income' : 'Expense'} added successfully`);
      resetForm();
      setOpen(false);
    } catch (err) {
      toast.error('Failed to save transaction');
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="gap-2 shadow-card hover:shadow-card-hover transition-all duration-200 bg-primary hover:bg-primary/90"
        >
          <Plus className="h-5 w-5" />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">New Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* Type Toggle */}
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={cn(
                'flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200',
                type === 'expense'
                  ? 'bg-expense text-expense-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={cn(
                'flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200',
                type === 'income'
                  ? 'bg-income text-income-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Income
            </button>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Amount
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                ₦
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                className={cn(
                  'pl-8 text-lg font-medium h-12',
                  error && 'border-destructive animate-shake'
                )}
                autoFocus
              />
            </div>
            {error && (
              <p className="text-sm text-destructive animate-fade-in">{error}</p>
            )}
          </div>

          {/* Category - only for expenses */}
          {type === 'expense' && (
            <div className="space-y-2 animate-fade-in">
              <Label htmlFor="category" className="text-sm font-medium">
                Category
              </Label>
              <Select value={category} onValueChange={(val) => setCategory(val as Category)}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat} className="cursor-pointer">
                      {CATEGORY_CONFIG[cat].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="description"
              placeholder={type === 'income' ? 'e.g., Salary, Freelance' : 'e.g., Groceries, Uber'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-12"
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-12"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className={cn(
              'w-full h-12 text-base font-medium transition-all duration-200',
              type === 'income'
                ? 'bg-income hover:bg-income/90 text-income-foreground'
                : 'bg-primary hover:bg-primary/90'
            )}
          >
            Add {type === 'income' ? 'Income' : 'Expense'}
          </Button>
        </form>
      </DialogContent>
    </Dialog >
  );
}
