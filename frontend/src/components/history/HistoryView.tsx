import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { MOCK_HISTORY } from '../../services/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface HistoryPoint {
    month: string;
    spent: number;
    income: number;
    savings: number;
    savingsRate: number;
}

export default function HistoryView() {
    const { user } = useAuth();
    const [data, setData] = useState<HistoryPoint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            try {
                const token = await user.getIdToken();

                if (token === 'mock-dev-token') {
                     const mockData: HistoryPoint[] = MOCK_HISTORY.slice(0, 6).map(h => {
                        const totalSpent = Object.values(h.actualSpent).reduce((a, b) => a + b, 0) - (h.actualSpent.savings || 0);
                        return {
                            month: new Date(h.periodStart).toLocaleString('default', { month: 'short', year: '2-digit' }),
                            income: h.income,
                            spent: Math.round(totalSpent),
                            savings: Math.round(h.income - totalSpent),
                            savingsRate: Math.round(h.savingsRate * 100),
                        };
                    });
                    setData(mockData);
                    setLoading(false);
                    return;
                }

                const res = await fetch('http://127.0.0.1:8000/api/budgets/history?months=6', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const json = await res.json();
                    setData(json.history);
                } else {
                    throw new Error('API returned error');
                }
            } catch (err) {
                console.warn("API unavailable, using mock history data", err);
                // Fall back to mock data — transform MOCK_HISTORY into HistoryPoint format
                const mockData: HistoryPoint[] = MOCK_HISTORY.slice(0, 6).map(h => {
                    const totalSpent = Object.values(h.actualSpent).reduce((a, b) => a + b, 0) - (h.actualSpent.savings || 0);
                    return {
                        month: new Date(h.periodStart).toLocaleString('default', { month: 'short', year: '2-digit' }),
                        income: h.income,
                        spent: Math.round(totalSpent),
                        savings: Math.round(h.income - totalSpent),
                        savingsRate: Math.round(h.savingsRate * 100),
                    };
                });
                setData(mockData);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    if (loading) return <div className="p-8 text-center text-surface-400">Loading history...</div>;

    return (
        <div className="space-y-6 animate-fade-in p-4 lg:p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-surface-100">Financial History</h1>
            <p className="text-surface-400">Track your savings performance over the last 6 months.</p>

            <div className="glass-card p-6 h-[400px]">
                <h3 className="text-lg font-bold text-surface-100 mb-4">Savings Trend</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#18181B', borderColor: '#27272A', color: '#F3F4F6' }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="savings" stroke="#10B981" strokeWidth={2} name="Savings (₹)" />
                        <Line type="monotone" dataKey="spent" stroke="#EF4444" strokeWidth={2} name="Spent (₹)" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold text-surface-100 mb-4">Monthly Breakdown</h3>
                    <div className="space-y-4">
                        {data.map((item) => (
                            <div key={item.month} className="flex justify-between items-center border-b border-surface-700 pb-2 last:border-0">
                                <div>
                                    <p className="font-medium text-surface-200">{item.month}</p>
                                    <p className="text-xs text-surface-500">Income: ₹{item.income.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-surface-100">₹{item.savings.toLocaleString()}</p>
                                    <p className={`text-xs ${item.savingsRate >= 20 ? 'text-accent-emerald' : 'text-accent-amber'}`}>
                                        {item.savingsRate}% Rate
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}