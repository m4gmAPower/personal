"use client";

import React, { useState, useMemo } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { SummaryCards } from '@/components/features/SummaryCards';
import { ExpensePieChart } from '@/components/features/ExpensePieChart';
import { TransactionForm } from '@/components/features/TransactionForm';
import { TransactionList } from '@/components/features/TransactionList';
import { Button } from '@/components/ui/Button';

import { Transaction } from '@/types';
import { BudgetStatus } from '@/components/features/BudgetStatus';

export default function Home() {
    const {
        transactions,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        getMonthlySummary,
        exportCSV,
        loading,
        budget,
        updateBudget
    } = useTransactions();

    // State for the selected month (default to current month)
    const [currentMonth, setCurrentMonth] = useState(() => new Date().toISOString().slice(0, 7));

    // State for editing
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    // Tab state
    const [activeTab, setActiveTab] = useState<'home' | 'input' | 'details'>('home');

    // Derived state
    const monthlyStats = useMemo(() => getMonthlySummary(currentMonth), [getMonthlySummary, currentMonth]);

    const currentMonthTransactions = useMemo(() => {
        return transactions
            .filter(t => t.date.startsWith(currentMonth))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions, currentMonth]);

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setActiveTab('input');
        // No need to scroll as we switch views
    };

    const handleUpdateTransaction = (data: Omit<Transaction, 'id'>) => {
        if (editingTransaction) {
            updateTransaction(editingTransaction.id, data);
            setEditingTransaction(null);
            // Optional: Switch back to details or stay on input
            setActiveTab('details');
        }
    };

    const handleAddTransaction = (data: Omit<Transaction, 'id'>) => {
        addTransaction(data);
        // Optional: Switch to details to see it added, or stay to add more
    };

    const handleCancelEdit = () => {
        setEditingTransaction(null);
        setActiveTab('details');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="w-[90%] max-w-2xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between mb-3">
                        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <span className="text-emerald-600">💰</span> 家計簿アプリ
                        </h1>
                        <Button variant="secondary" size="sm" onClick={exportCSV}>
                            CSV
                        </Button>
                    </div>

                    {/* Navigation Tabs - Mobile Optimized */}
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('home')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'home'
                                ? 'bg-white text-emerald-600 shadow-sm'
                                : 'text-slate-500'
                                }`}
                        >
                            ホーム
                        </button>
                        <button
                            onClick={() => setActiveTab('input')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'input'
                                ? 'bg-white text-emerald-600 shadow-sm'
                                : 'text-slate-500'
                                }`}
                        >
                            {editingTransaction ? '編集' : '入力'}
                        </button>
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'details'
                                ? 'bg-white text-emerald-600 shadow-sm'
                                : 'text-slate-500'
                                }`}
                        >
                            一覧
                        </button>
                    </div>
                </div>
            </header>

            <div className="w-[90%] max-w-2xl mx-auto px-4 py-6 space-y-6">

                {/* Month Selector is common or specific to Home/List? keeping it common for simplicity */}
                <div className="flex justify-center mb-4">
                    <input
                        type="month"
                        value={currentMonth}
                        onChange={(e) => setCurrentMonth(e.target.value)}
                        className="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-sm"
                    />
                </div>

                {/* Tab Content */}
                {activeTab === 'home' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <SummaryCards stats={monthlyStats} />
                        <BudgetStatus
                            currentExpense={monthlyStats.totalExpense}
                            budget={budget}
                            onUpdateBudget={updateBudget}
                        />
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                            <h2 className="text-lg font-bold text-slate-800 mb-4">支出分析</h2>
                            <ExpensePieChart transactions={currentMonthTransactions} />
                        </div>
                    </div>
                )}

                {activeTab === 'input' && (
                    <div className="animate-in fade-in duration-300">
                        <TransactionForm
                            onAddTransaction={handleAddTransaction}
                            onUpdateTransaction={handleUpdateTransaction}
                            initialData={editingTransaction}
                            onCancelEdit={handleCancelEdit}
                        />
                    </div>
                )}

                {activeTab === 'details' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-800">
                                取引履歴
                            </h2>
                            <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                全{currentMonthTransactions.length}件
                            </span>
                        </div>
                        <TransactionList
                            transactions={currentMonthTransactions}
                            onDelete={deleteTransaction}
                            onEdit={handleEdit}
                        />
                    </div>
                )}
            </div>
        </main>
    );
}
