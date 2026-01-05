import { useState, useEffect, useCallback } from 'react';
import { Transaction, MonthlyStats } from '@/types';

const STORAGE_KEY = 'household_budget_data';

// Initial Dummy Data
const DUMMY_DATA: Transaction[] = [
    { id: '1', date: '2024-12-15', amount: 5000, type: 'expense', category: '食費', note: 'スーパーで買い物' },
    { id: '2', date: '2024-12-20', amount: 3000, type: 'expense', category: '交通費', note: '電車代' },
    { id: '3', date: '2024-12-25', amount: 200000, type: 'income', category: '給与', note: '12月分給与' },
];

export interface UseTransactionsReturn {
    transactions: Transaction[];
    loading: boolean;
    addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    deleteTransaction: (id: string) => void;
    updateTransaction: (id: string, updatedTransaction: Partial<Transaction>) => void;
    getMonthlySummary: (month: string) => MonthlyStats; // month in YYYY-MM format
    exportCSV: () => void;
    budget: number;
    updateBudget: (budget: number) => void;
}

export const useTransactions = (): UseTransactionsReturn => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [budget, setBudget] = useState<number>(0);

    // Load from LocalStorage
    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        const savedBudget = localStorage.getItem('household_budget_limit');

        if (savedData) {
            try {
                setTransactions(JSON.parse(savedData));
            } catch (e) {
                console.error("Failed to parse transactions", e);
                setTransactions([]);
            }
        } else {
            // Initialize with dummy data if empty
            setTransactions(DUMMY_DATA);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DUMMY_DATA));
        }

        if (savedBudget) {
            setBudget(Number(savedBudget));
        }

        setLoading(false);
    }, []);

    // Save to LocalStorage whenever transactions change
    useEffect(() => {
        if (!loading) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
        }
    }, [transactions, loading]);

    // Save Budget
    const updateBudget = useCallback((newBudget: number) => {
        setBudget(newBudget);
        localStorage.setItem('household_budget_limit', newBudget.toString());
    }, []);

    const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
        const newTransaction: Transaction = {
            ...transaction,
            id: crypto.randomUUID(),
        };
        setTransactions((prev) => [newTransaction, ...prev]);
    }, []);

    const deleteTransaction = useCallback((id: string) => {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const updateTransaction = useCallback((id: string, updatedTransaction: Partial<Transaction>) => {
        setTransactions((prev) =>
            prev.map((t) => (t.id === id ? { ...t, ...updatedTransaction } : t))
        );
    }, []);

    const getMonthlySummary = useCallback((month: string): MonthlyStats => {
        // month format: YYYY-MM
        const filtered = transactions.filter((t) => t.date.startsWith(month));
        const totalIncome = filtered
            .filter((t) => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = filtered
            .filter((t) => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            totalIncome,
            totalExpense,
            balance: totalIncome - totalExpense,
        };
    }, [transactions]);

    const exportCSV = useCallback(() => {
        const headers = ['ID', '日付', '金額', '種類', 'カテゴリ', 'メモ'];
        const rows = transactions.map(t =>
            [t.id, t.date, t.amount, t.type === 'income' ? '収入' : '支出', t.category, `"${t.note || ''}"`].join(',')
        );
        const csvContent = [headers.join(','), ...rows].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [transactions]);

    return {
        transactions,
        loading,
        budget,
        updateBudget,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        getMonthlySummary,
        exportCSV,
    };
};
