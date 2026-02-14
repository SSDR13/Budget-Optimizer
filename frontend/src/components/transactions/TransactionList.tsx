import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { MOCK_TRANSACTIONS } from '../../services/mockData';

interface Transaction {
    transactionId: string;
    amount: number;
    category: string;
    description: string;
    date: string;
    source: string;
}

const CATEGORIES = ['food', 'rent', 'transport', 'shopping', 'entertainment', 'other'];

export default function TransactionList() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchTransactions();
    }, [user, category]);

    const fetchTransactions = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const token = await user.getIdToken();
            
            if (token === 'mock-dev-token') {
                let mockTxns = [...MOCK_TRANSACTIONS] as any[];
                if (category) mockTxns = mockTxns.filter(t => t.category === category);
                setTransactions(mockTxns);
                setLoading(false);
                return;
            }

            const queryParams = new URLSearchParams({ limit: '50' });
            if (category) queryParams.append('category', category);

            const res = await fetch(`http://127.0.0.1:8000/api/transactions?${queryParams}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (res.ok) {
                const data = await res.json();
                setTransactions(data.transactions);
            } else {
                throw new Error('API returned error');
            }
        } catch (error) {
            console.warn("API unavailable, using mock transactions", error);
            // Fall back to mock data
            let mockTxns = [...MOCK_TRANSACTIONS] as Transaction[];
            if (category) {
                mockTxns = mockTxns.filter(t => t.category === category);
            }
            setTransactions(mockTxns);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryIcon = (cat: string) => {
        const icons: Record<string, string> = {
            food: '🍔',
            rent: '🏠',
            transport: '🚗',
            shopping: '🛍️',
            entertainment: '🎬',
            other: '💸'
        };
        return icons[cat] || '💸';
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-surface-100">Recent Transactions</h2>
                <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-surface-800 border border-surface-700 text-surface-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                >
                    <option value="">All Categories</option>
                    {CATEGORIES.map(c => (
                        <option key={c} value={c} className="capitalize">{c}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-16 bg-surface-800/50 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : transactions.length === 0 ? (
                <div className="text-center py-12 text-surface-400 bg-surface-800/30 rounded-xl border border-surface-700/50 border-dashed">
                    <p className="text-lg mb-2">No transactions found</p>
                    <p className="text-sm">Start adding your expenses to track your budget!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {transactions.map((txn) => (
                        <div key={txn.transactionId} className="group flex items-center justify-between p-4 bg-surface-800/50 border border-surface-700/50 rounded-xl hover:border-brand-500/30 hover:bg-surface-800 transition-all duration-200">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg bg-surface-700/50 group-hover:scale-110 transition-transform`}>
                                    {getCategoryIcon(txn.category)}
                                </div>
                                <div>
                                    <p className="font-medium text-surface-200">{txn.description || txn.category}</p>
                                    <p className="text-xs text-surface-500">{new Date(txn.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <span className="font-semibold text-surface-100">
                                -₹{txn.amount.toLocaleString('en-IN')}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}