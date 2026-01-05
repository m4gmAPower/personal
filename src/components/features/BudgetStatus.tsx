import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface BudgetStatusProps {
    currentExpense: number;
    budget: number;
    onUpdateBudget: (budget: number) => void;
}

export function BudgetStatus({ currentExpense, budget, onUpdateBudget }: BudgetStatusProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempBudget, setTempBudget] = useState(budget.toString());

    useEffect(() => {
        setTempBudget(budget.toString());
    }, [budget]);

    const handleSave = () => {
        const value = Number(tempBudget);
        if (!isNaN(value) && value >= 0) {
            onUpdateBudget(value);
            setIsEditing(false);
        }
    };

    const percentage = budget > 0 ? Math.min((currentExpense / budget) * 100, 100) : 0;
    const isOverBudget = currentExpense > budget && budget > 0;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-medium text-slate-700">
                    今月の予算管理
                </CardTitle>
                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <>
                            <Input
                                type="number"
                                value={tempBudget}
                                onChange={(e) => setTempBudget(e.target.value)}
                                className="w-32 h-8 text-right"
                                min="0"
                            />
                            <Button size="sm" onClick={handleSave} className="h-8">保存</Button>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-slate-800">
                                {formatCurrency(budget)}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsEditing(true)}
                                className="text-slate-400 hover:text-emerald-600 h-8 px-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </Button>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">支出済み: {formatCurrency(currentExpense)}</span>
                        <span className={`${isOverBudget ? 'text-red-500 font-bold' : 'text-slate-500'}`}>
                            残り: {formatCurrency(Math.max(budget - currentExpense, 0))}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ease-out ${isOverBudget ? 'bg-red-500' :
                                    percentage > 80 ? 'bg-amber-400' : 'bg-emerald-500'
                                }`}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>

                    {budget > 0 && (
                        <p className="text-xs text-right text-slate-400">
                            {percentage.toFixed(1)}% 消化
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
