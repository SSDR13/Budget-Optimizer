import { useState } from 'react';
import { CATEGORY_CONFIG, CATEGORIES, type Category } from '../../utils/constants';
import { generateId } from '../../utils/formatters';
import type { Transaction } from '../../services/mockData';

interface TransactionFormProps {
    onSubmit: (txn: Transaction) => void;
    onClose: () => void;
}

export default function TransactionForm({ onSubmit, onClose }: TransactionFormProps) {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState<Category>('food');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const txn: Transaction = {
            transactionId: generateId(),
            userId: 'demo-user-001',
            amount: Number(amount),
            category,
            description,
            date: new Date(date).toISOString(),
            createdAt: new Date().toISOString(),
            source: 'manual',
        };
        onSubmit(txn);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative glass-card p-6 w-full max-w-md animate-slide-up">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-surface-100">Add Transaction</h3>
                    <button onClick={onClose} className="p-1 text-surface-500 hover:text-surface-300 transition-colors">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="input-label">Amount (₹)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="1500"
                            className="input-field text-xl font-semibold"
                            min="1"
                            required
                        />
                    </div>

                    <div>
                        <label className="input-label">Category</label>
                        <div className="grid grid-cols-3 gap-2">
                            {CATEGORIES.filter((c) => c !== 'savings').map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setCategory(cat)}
                                    className={`p-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${category === cat
                                            ? 'bg-brand-600/20 border border-brand-500/40 text-brand-400'
                                            : 'bg-surface-800/50 border border-surface-700 text-surface-400 hover:border-surface-600'
                                        }`}
                                >
                                    <span className="text-base block mb-1">{CATEGORY_CONFIG[cat].icon}</span>
                                    {CATEGORY_CONFIG[cat].label.split(' ')[0]}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="input-label">Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What was this for?"
                            className="input-field"
                            required
                        />
                    </div>

                    <div>
                        <label className="input-label">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1 py-3">Cancel</button>
                        <button type="submit" className="btn-primary flex-1 py-3">Add Transaction</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
