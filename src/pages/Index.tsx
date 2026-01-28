import { useMemo, memo } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { useBudgets } from '@/hooks/useBudgets';
import { calculateMonthlyData, getCurrentMonth, getMonthLabel, getTransactionMonth } from '@/lib/finance';
import { Category, EXPENSE_CATEGORIES } from '@/types/finance';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { MonthlyOverview } from '@/components/MonthlyOverview';
import { BudgetProgress } from '@/components/BudgetProgress';
import { SpendingChart } from '@/components/SpendingChart';
import { Wallet } from 'lucide-react';

const Index = memo(function Index() {
  const { transactions, addTransaction, deleteTransaction, isLoaded: transactionsLoaded } = useTransactions();
  const { budgets, updateBudget, getBudget, isLoaded: budgetsLoaded } = useBudgets();

  const currentMonth = useMemo(() => getCurrentMonth(), []);
  
  // Memoize expensive calculation
  const monthlyData = useMemo(
    () => calculateMonthlyData(transactions, currentMonth),
    [transactions, currentMonth]
  );
  
  // Memoize filtered transactions
  const recentTransactions = useMemo(
    () => transactions
      .filter(t => getTransactionMonth(t) === currentMonth)
      .slice(0, 10),
    [transactions, currentMonth]
  );

  // Memoize budget map
  const budgetMap = useMemo(() => {
    const map: Record<Category, number> = {} as Record<Category, number>;
    EXPENSE_CATEGORIES.forEach(cat => {
      map[cat] = getBudget(cat);
    });
    return map;
  }, [getBudget]);

  if (!transactionsLoaded || !budgetsLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse-soft flex items-center gap-2 text-muted-foreground">
          <Wallet className="h-5 w-5" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                <Wallet className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-foreground">
                  Finance Tracker
                </h1>
                <p className="text-sm text-muted-foreground">
                  {getMonthLabel(currentMonth)}
                </p>
              </div>
            </div>
            <TransactionForm onSubmit={addTransaction} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-8">
          {/* Monthly Overview */}
          <section>
            <MonthlyOverview data={monthlyData} />
          </section>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Transactions */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-2xl border border-border/50 p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                  Recent Transactions
                </h2>
                <TransactionList 
                  transactions={recentTransactions} 
                  onDelete={deleteTransaction} 
                />
              </div>
            </div>

            {/* Right Column - Chart & Budgets */}
            <div className="space-y-6">
              {/* Spending Chart */}
              <div className="bg-card rounded-2xl border border-border/50 p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                  Spending Breakdown
                </h2>
                <SpendingChart spending={monthlyData.byCategory} />
              </div>

              {/* Budget Progress */}
              <div className="bg-card rounded-2xl border border-border/50 p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                  Budget Status
                </h2>
                <BudgetProgress
                  spending={monthlyData.byCategory}
                  budgets={budgetMap}
                  onUpdateBudget={updateBudget}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
});

export default Index;
