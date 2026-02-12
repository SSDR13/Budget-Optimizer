import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { CATEGORY_CONFIG, CATEGORIES, type Category } from '../../utils/constants';
import { formatCurrency, formatDate, relativeTime } from '../../utils/formatters';
import TransactionForm from './TransactionForm';
import ImportCSV from './ImportCSV';

export default function TransactionList() {
    const { transactions, loadMockData, addTransaction, removeTransaction } = useStore();
    const [showForm, setShowForm] = useState(false);
    const [filter, setFilter] = useState<Category | 'all'>('all');
    const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

    useEffect(() => {
        if (transactions.length === 0) loadMockData();
    }, [loadMockData, transactions.length]);

    const filtered = transactions
        .filter((t) => filter === 'all' || t.category === filter)
        .sort((a, b) => {
            if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
            return b.amount - a.amount;
        });

    const totalFiltered = filtered.reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="page-enter space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-surface-100">Transactions</h1>
                    <p className="text-surface-500 text-sm mt-1">{filtered.length} transactions • {formatCurrency(totalFiltered)} total</p>
                </div>
                <div className="flex items-center gap-2">
                    <ImportCSV onImport={(file) => console.log('Importing:', file.name)} />
                    <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm">
                        <span className="text-lg">+</span> Add Transaction
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'all' ? 'bg-brand-600/15 text-brand-400 border border-brand-500/20' : 'text-surface-400 hover:text-surface-200 bg-surface-800/50 border border-surface-700'
                        }`}
                >
                    All
                </button>
                {CATEGORIES.filter((c) => c !== 'savings').map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${filter === cat ? 'bg-brand-600/15 text-brand-400 border border-brand-500/20' : 'text-surface-400 hover:text-surface-200 bg-surface-800/50 border border-surface-700'
                            }`}
                    >
                        {CATEGORY_CONFIG[cat].icon} {CATEGORY_CONFIG[cat].label.split(' ')[0]}
                    </button>
                ))}
                <div className="ml-auto">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
                        className="input-field py-1.5 px-3 text-xs w-auto"
                    >
                        <option value="date">Sort by Date</option>
                        <option value="amount">Sort by Amount</option>
                    </select>
                </div>
            </div>

            {/* Transaction List */}
            <div className="space-y-2">
                {filtered.map((txn) => (
                    <div key={txn.transactionId} className="glass-card-hover p-4 flex items-center gap-4 group">
                        {/* Category icon */}
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                            style={{ backgroundColor: `${CATEGORY_CONFIG[txn.category].color}15` }}
                        >
                            {CATEGORY_CONFIG[txn.category].icon}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-surface-200 truncate">{txn.description}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-surface-500">{formatDate(txn.date)}</span>
                                <span className="text-xs text-surface-600">•</span>
                                <span className="text-xs text-surface-500">{relativeTime(txn.date)}</span>
                                {txn.source !== 'manual' && (
                                    <span className="badge text-[10px] bg-surface-800 text-surface-400 border border-surface-700">{txn.source}</span>
                                )}
                            </div>
                        </div>

                        {/* Amount */}
                        <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-surface-100">{formatCurrency(txn.amount)}</p>
                            <p className={`text-xs ${CATEGORY_CONFIG[txn.category].tailwind}`}>
                                {CATEGORY_CONFIG[txn.category].label.split(' ')[0]}
                            </p>
                        </div>

                        {/* Delete */}
                        <button
                            onClick={() => removeTransaction(txn.transactionId)}
                            className="p-1.5 text-surface-600 hover:text-accent-rose opacity-0 group-hover:opacity-100 transition-all"
                            title="Delete"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="text-center py-16 glass-card">
                        <span className="text-4xl mb-4 block">💸</span>
                        <p className="text-surface-400">No transactions found</p>
                        <button onClick={() => setShowForm(true)} className="btn-primary mt-4 text-sm">
                            Add Your First Transaction
                        </button>
                    </div>
                )}
            </div>

            {/* Form Modal */}
            {showForm && (
                <TransactionForm
                    onSubmit={addTransaction}
                    onClose={() => setShowForm(false)}
                />
            )}
        </div>
    );
}
