import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Transaction } from '@/types';

interface TransactionListProps {
    transactions: Transaction[];
    onDelete: (id: string) => void;
    onEdit: (transaction: Transaction) => void;
}

export function TransactionList({ transactions, onDelete, onEdit }: TransactionListProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
    };

    if (transactions.length === 0) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>最近の取引</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center p-8 text-slate-400">
                    <p>取引データはまだありません。</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>最近の取引</CardTitle>
            </CardHeader>
            <div className="flex-1 overflow-y-auto px-6 pb-6">
                <ul className="space-y-3">
                    {transactions.map((transaction) => (
                        <li
                            key={transaction.id}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`flex items-center justify-center w-10 h-10 rounded-full ${transaction.type === 'income'
                                        ? 'bg-emerald-100 text-emerald-600'
                                        : 'bg-red-100 text-red-600'
                                        }`}
                                >
                                    {/* Simple icons based on type for now */}
                                    {transaction.type === 'income' ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{transaction.category}</p>
                                    <p className="text-xs text-slate-500">
                                        {formatDate(transaction.date)}
                                        {transaction.note && ` • ${transaction.note}`}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span
                                    className={`font-semibold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-slate-900'
                                        }`}
                                >
                                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-slate-400 hover:text-emerald-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => onEdit(transaction)}
                                    aria-label="Edit"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-slate-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => onDelete(transaction.id)}
                                    aria-label="Delete"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </Card>
    );
}
