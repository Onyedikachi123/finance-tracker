import { memo, useState, useCallback } from 'react';
import { Transaction } from '@/types/finance';
import { formatCurrency, formatDate } from '@/lib/finance';
import { CategoryBadge } from './CategoryBadge';
import { Trash2, ArrowUpRight, ArrowDownRight, Receipt, CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const TransactionList = memo(function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const performDelete = useCallback(() => {
    if (!confirmDeleteId) return;

    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    setDeletingId(id);

    // Allow animation to play
    setTimeout(() => {
      onDelete(id);
      setDeletingId(null);

      // Custom success toast
      toast.custom((t) => (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-lg p-5 flex flex-col items-center text-center max-w-sm w-full animate-in fade-in zoom-in-95 duration-200">
          <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
          </div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
            Deleted Successfully
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            The transaction has been removed.
          </p>
          <button
            onClick={() => toast.dismiss(t)}
            className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ), { duration: 3000 });

    }, 200);
  }, [confirmDeleteId, onDelete]);

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
        <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <Receipt className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground mb-1">
          No transactions yet
        </h3>
        <p className="text-muted-foreground text-sm max-w-xs">
          Add your first transaction to start tracking your finances
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className={cn(
              'group flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50',
              'hover:border-border hover:shadow-card transition-all duration-200',
              deletingId === transaction.id && 'animate-fade-out opacity-0 scale-95'
            )}
          >
            <CategoryBadge category={transaction.category} showLabel={false} />

            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {transaction.description}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatDate(transaction.date)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className={cn(
                'flex items-center gap-1 font-semibold tabular-nums',
                transaction.type === 'income' ? 'text-income' : 'text-expense'
              )}>
                {transaction.type === 'income' ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </div>

              <button
                onClick={() => setConfirmDeleteId(transaction.id)}
                className={cn(
                  'p-2 rounded-lg text-muted-foreground opacity-0 group-hover:opacity-100',
                  'hover:bg-destructive/10 hover:text-destructive transition-all duration-200'
                )}
                aria-label="Delete transaction"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={!!confirmDeleteId} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
        <AlertDialogContent className="max-w-[400px] p-6 rounded-2xl gap-6">
          <AlertDialogHeader className="space-y-3">
            <div className="flex items-center justify-between">
              <AlertDialogTitle className="text-xl font-bold">Delete transaction?</AlertDialogTitle>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <AlertDialogDescription className="text-base text-muted-foreground leading-relaxed">
              Are you sure you want to delete this transaction? <br />
              Once deleted, this action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="w-full sm:justify-between gap-3 sm:gap-3">
            <AlertDialogAction
              onClick={performDelete}
              className={cn(
                "w-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-none shadow-none",
                "focus:ring-red-100 focus:ring-offset-0",
                "h-12 rounded-xl text-base font-medium flex items-center justify-center gap-2",
                "dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
              )}
            >
              Yes, Delete
              <Trash2 className="h-4 w-4" />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});
