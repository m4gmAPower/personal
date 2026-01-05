import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { MonthlyStats } from '@/types';

interface SummaryCardsProps {
    stats: MonthlyStats;
}

export function SummaryCards({ stats }: SummaryCardsProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
    };

    const cards = [
        {
            label: '収入',
            amount: stats.totalIncome,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
        },
        {
            label: '支出',
            amount: stats.totalExpense,
            color: 'text-red-500',
            bgColor: 'bg-red-50',
        },
        {
            label: '残高',
            amount: stats.balance,
            color: stats.balance >= 0 ? 'text-slate-800' : 'text-red-600',
            bgColor: 'bg-white',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cards.map((card) => (
                <Card key={card.label} className={`${card.bgColor} border-none shadow-sm`}>
                    <CardContent className="p-6">
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                            {card.label}
                        </p>
                        <p className={`text-2xl font-bold mt-2 ${card.color}`}>
                            {formatCurrency(card.amount)}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
