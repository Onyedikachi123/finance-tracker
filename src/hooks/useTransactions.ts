import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Transaction } from '@/types/finance';
import { saveTransactions, loadTransactions, generateId } from '@/lib/finance';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = loadTransactions();
    setTransactions(stored);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        saveTransactions(transactions);
      } catch (error) {
        console.error('Failed to save transactions:', error);
        toast.error('Failed to save changes to local storage');
      }
    }
  }, [transactions, isLoaded]);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
    return newTransaction;
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateTransaction = useCallback((id: string, updates: Partial<Omit<Transaction, 'id'>>) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  return {
    transactions,
    isLoaded,
    addTransaction,
    deleteTransaction,
    updateTransaction,
  };
}
