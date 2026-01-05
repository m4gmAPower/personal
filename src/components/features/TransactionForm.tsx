import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Transaction, TransactionType } from '@/types';

interface TransactionFormProps {
    onAddTransaction?: (transaction: Omit<Transaction, 'id'>) => void;
    onUpdateTransaction?: (transaction: Omit<Transaction, 'id'>) => void;
    initialData?: Transaction | null;
    onCancelEdit?: () => void;
}

const EXPENSE_CATEGORIES = [
    { value: '食費', label: '食費' },
    { value: '交通費', label: '交通費' },
    { value: '光熱費', label: '光熱費' },
    { value: '交際費・娯楽', label: '交際費・娯楽' },
    { value: '住居費', label: '住居費' },
    { value: '医療費', label: '医療費' },
    { value: '教育・教養', label: '教育・教養' },
    { value: 'その他', label: 'その他' },
];

const INCOME_CATEGORIES = [
    { value: '給与', label: '給与' },
    { value: '賞与', label: '賞与' },
    { value: '副業・投資', label: '副業・投資' },
    { value: 'その他', label: 'その他' },
];

export function TransactionForm({ onAddTransaction, onUpdateTransaction, initialData, onCancelEdit }: TransactionFormProps) {
    const [type, setType] = useState<TransactionType>('expense');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(EXPENSE_CATEGORIES[0].value);
    const [note, setNote] = useState('');
    const [error, setError] = useState('');

    React.useEffect(() => {
        if (initialData) {
            setType(initialData.type);
            setDate(initialData.date);
            setAmount(initialData.amount.toString());
            setCategory(initialData.category);
            setNote(initialData.note || '');
        } else {
            // Reset if needed when switching modes, avoiding overwrite if just unmounting
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            setError('有効な金額を入力してください。');
            return;
        }

        const transactionData = {
            date,
            amount: Number(amount),
            type,
            category,
            note,
        };

        if (initialData && onUpdateTransaction) {
            onUpdateTransaction(transactionData);
        } else if (onAddTransaction) {
            onAddTransaction(transactionData);
            setAmount('');
            setNote('');
        }
    };

    const handleTypeChange = (newType: TransactionType) => {
        setType(newType);
        if (newType === 'expense') {
            setCategory(EXPENSE_CATEGORIES[0].value);
        } else {
            setCategory(INCOME_CATEGORIES[0].value);
        }
    };

    const isEditing = !!initialData;

    return (
        <Card className={isEditing ? "border-emerald-500 border-2" : ""}>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    {isEditing ? '取引を編集' : '取引を追加'}
                    {isEditing && (
                        <Button variant="ghost" size="sm" onClick={onCancelEdit} className="text-slate-500">
                            キャンセル
                        </Button>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Type Toggle */}
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button
                            type="button"
                            onClick={() => handleTypeChange('expense')}
                            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${type === 'expense'
                                ? 'bg-white text-red-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            支出
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTypeChange('income')}
                            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${type === 'income'
                                ? 'bg-white text-emerald-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            収入
                        </button>
                    </div>

                    {/* Date & Amount */}
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="日付"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                        <Input
                            label="金額"
                            type="number"
                            min="0"
                            placeholder="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            error={error}
                        />
                    </div>

                    {/* Category */}
                    <Select
                        label="カテゴリ"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        options={type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES}
                    />

                    {/* Note */}
                    <Input
                        label="メモ (任意)"
                        placeholder="詳細を入力..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />

                    <Button type="submit" className="w-full" variant={isEditing ? "primary" : "primary"}>
                        {isEditing ? '更新' : '追加'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
