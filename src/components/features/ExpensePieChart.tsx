import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Transaction } from '@/types';

interface ExpensePieChartProps {
    transactions: Transaction[];
}

const COLORS = [
    '#10B981', // Emerald 500
    '#3B82F6', // Blue 500
    '#F59E0B', // Amber 500
    '#EF4444', // Red 500
    '#8B5CF6', // Violet 500
    '#EC4899', // Pink 500
    '#6366F1', // Indigo 500
    '#64748B', // Slate 500
];

export function ExpensePieChart({ transactions }: ExpensePieChartProps) {
    const data = useMemo(() => {
        const expenses = transactions.filter((t) => t.type === 'expense');

        // Aggregate by category
        const categoryTotals: Record<string, number> = {};
        expenses.forEach((t) => {
            if (!categoryTotals[t.category]) {
                categoryTotals[t.category] = 0;
            }
            categoryTotals[t.category] += t.amount;
        });

        return Object.entries(categoryTotals)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value); // Sort descending
    }, [transactions]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
    };

    if (data.length === 0) {
        return (
            <Card className="h-[400px]">
                <CardHeader>
                    <CardTitle>支出の内訳</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center text-slate-400">
                    支出データがありません。
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-[400px] flex flex-col">
            <CardHeader>
                <CardTitle>支出の内訳</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number) => formatCurrency(value)}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
