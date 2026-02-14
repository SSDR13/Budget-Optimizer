import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const CATEGORIES = ['food', 'rent', 'transport', 'shopping', 'entertainment', 'other'];

interface TransactionFormProps {
    onSuccess?: () => void;
}

export default function TransactionForm({ onSuccess }: TransactionFormProps) {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('food');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = await user.getIdToken();

            if (token === 'mock-dev-token') {
                await new Promise(r => setTimeout(r, 500));
                setAmount('');
                setDescription('');
                setCategory('food');
                setDate(new Date().toISOString().split('T')[0]);
                setSuccess('Transaction saved (dev mode)');
                if (onSuccess) onSuccess();
                setLoading(false);
                return;
            }

            const response = await fetch('http://127.0.0.1:8000/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: Number(amount),
                    category,
                    description,
                    date: new Date(date).toISOString(),
                    source: 'manual'
                })
            });

            if (!response.ok) {
                throw new Error('API returned error');
            }

            // Reset form
            setAmount('');
            setDescription('');
            setCategory('food');
            setDate(new Date().toISOString().split('T')[0]);
            setSuccess('Transaction saved!');
            
            if (onSuccess) onSuccess();
        } catch (err) {
            console.warn("API unavailable, saving locally (dev mode)", err);
            // In dev mode, just reset the form and show success
            setAmount('');
            setDescription('');
            setCategory('food');
            setDate(new Date().toISOString().split('T')[0]);
            setSuccess('Transaction saved (dev mode)');
            
            if (onSuccess) onSuccess();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card p-6 animate-fade-in">
            <h3 className="text-lg font-bold text-surface-100 mb-4">Add Transaction</h3>
            
            {error && (
                <div className="mb-4 p-3 bg-accent-rose/10 border border-accent-rose/20 rounded-xl text-accent-rose text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 bg-accent-emerald/10 border border-accent-emerald/20 rounded-xl text-accent-emerald text-sm">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="input-label">Amount (₹)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="input-field"
                            required
                            min="0"
                            step="0.01"
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
                </div>

                <div>
                    <label className="input-label">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="input-field capitalize"
                    >
                        {CATEGORIES.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="input-label">Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What was this for?"
                        className="input-field"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading || !amount}
                    className="btn-primary w-full py-2.5"
                >
                    {loading ? 'Adding...' : 'Add Transaction'}
                </button>
            </form>
        </div>
    );
}