import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import TransactionList from '../transactions/TransactionList';
import TransactionForm from '../transactions/TransactionForm';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { MOCK_SUMMARY, MOCK_RL_SUGGESTION } from '../../services/mockData';

interface CategoryData {
    spent: number;
    budget: number;
    percentage: number;
}

interface SummaryData {
    income: number;
    totalSpent: number;
    savingsRate: number;
    categoryBreakdown: Record<string, CategoryData>;
}

export default function Dashboard() {
    const { user } = useAuth();
    const [summary, setSummary] = useState<SummaryData | null>(null);
    const [suggestion, setSuggestion] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                const token = await user.getIdToken();

                // Check for mock token (Dev Mode)
                if (token === 'mock-dev-token') {
                    console.info("Using mock data (Dev Mode)");
                    setSummary(MOCK_SUMMARY);
                    setSuggestion(MOCK_RL_SUGGESTION);
                    setLoading(false);
                    return;
                }

                const headers = { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };

                // Fetch Summary
                const summaryRes = await fetch('http://127.0.0.1:8000/api/budgets/summary/current', { headers });
                if (summaryRes.ok) {
                    const data = await summaryRes.json();
                    setSummary(data);
                } else {
                    throw new Error('API returned error');
                }

                // Fetch RL Suggestion
                const suggestRes = await fetch('http://127.0.0.1:8000/api/rl/suggest', { 
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ modelType: 'dqn', period: 'next' })
                });
                if (suggestRes.ok) {
                    const data = await suggestRes.json();
                    if (data.success) {
                        setSuggestion(data.suggestion);
                    }
                }

            } catch (error) {
                console.warn("API unavailable, loading mock data for development", error);
                // Fall back to mock data
                setSummary(MOCK_SUMMARY);
                setSuggestion(MOCK_RL_SUGGESTION);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, refreshKey]);

    const handleFeedback = async (_actionId: number | undefined, feedback: 'accepted' | 'rejected') => {
        if (!user) return;
        try {
            const token = await user.getIdToken();
            await fetch('http://127.0.0.1:8000/api/rl/feedback', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ actionId: _actionId, feedback })
            });
        } catch (e) { 
            console.warn("Feedback API unavailable (dev mode)", e);
        }
        // Hide suggestion after feedback
        setSuggestion(null);
    };

    const handleTransactionSuccess = () => {
        setRefreshKey(prev => prev + 1);
    };

    const chartData = summary ? Object.entries(summary.categoryBreakdown)
        .filter(([cat, data]) => data.spent > 0 && cat !== 'savings')
        .map(([name, data]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value: data.spent
        })) : [];

    const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-900">
                <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-900 text-surface-100 p-4 lg:p-8 animate-fade-in">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-400 to-accent-cyan bg-clip-text text-transparent">
                            Financial Dashboard
                        </h1>
                        <p className="text-surface-400">Overview for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="px-4 py-2 bg-surface-800 rounded-lg border border-surface-700">
                            <span className="text-sm text-surface-400 block">Income</span>
                            <span className="font-bold text-surface-100">₹{summary?.income.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-6xl">💰</div>
                        <p className="text-surface-400 text-sm font-medium mb-1">Total Spent</p>
                        <p className="text-3xl font-bold text-surface-100">₹{summary?.totalSpent.toLocaleString()}</p>
                        <div className="mt-2 text-xs text-surface-500">
                            {summary?.income ? Math.round((summary.totalSpent / summary.income) * 100) : 0}% of income
                        </div>
                    </div>

                    <div className="glass-card p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-6xl">🐷</div>
                        <p className="text-surface-400 text-sm font-medium mb-1">Savings Rate</p>
                        <p className={`text-3xl font-bold ${summary?.savingsRate && summary.savingsRate > 20 ? 'text-accent-emerald' : 'text-accent-amber'}`}>
                            {summary?.savingsRate ? `${(summary.savingsRate * 100).toFixed(1)}%` : '0%'}
                        </p>
                        <div className="mt-2 text-xs text-surface-500">Target: 20%</div>
                    </div>

                    <div className="glass-card p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-6xl">🤖</div>
                        <p className="text-surface-400 text-sm font-medium mb-1">RL Agent Status</p>
                        <p className="text-xl font-bold text-brand-400">Active (DQN)</p>
                        <div className="mt-2 text-xs text-surface-500">Learning from your transactions</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* RL Suggestion Panel */}
                        {suggestion && (
                            <div className="glass-card p-6 border border-brand-500/30 bg-brand-500/5 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-brand-500" />
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                                        💡
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-surface-100 mb-1">AI Optimization Suggestion</h3>
                                        <p className="text-surface-300 leading-relaxed mb-3">{suggestion.reasoning}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {suggestion.expectedSavingsIncrease && (
                                                <span className="px-2 py-1 rounded-md bg-surface-800 text-xs text-surface-400 border border-surface-700">
                                                    Expected Savings: +{(suggestion.expectedSavingsIncrease * 100).toFixed(1)}%
                                                </span>
                                            )}
                                            {suggestion.confidence && (
                                                <span className="px-2 py-1 rounded-md bg-surface-800 text-xs text-surface-400 border border-surface-700">
                                                    Confidence: {(suggestion.confidence * 100).toFixed(0)}%
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex gap-3 mt-4">
                                            <button 
                                                onClick={() => handleFeedback(suggestion.actionId, 'accepted')}
                                                className="px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg transition-colors"
                                            >
                                                Accept
                                            </button>
                                            <button 
                                                onClick={() => handleFeedback(suggestion.actionId, 'rejected')}
                                                className="px-3 py-1.5 bg-surface-800 hover:bg-surface-700 text-surface-300 text-sm font-medium rounded-lg border border-surface-700 transition-colors"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Charts */}
                        <div className="glass-card p-6">
                            <h3 className="text-lg font-bold text-surface-100 mb-6">Spending Breakdown</h3>
                            <div className="h-[300px] w-full">
                                {chartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={chartData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={80}
                                                outerRadius={110}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {chartData.map((_entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: '#18181B', borderColor: '#27272A', borderRadius: '0.75rem', color: '#F4F4F5' }}
                                                itemStyle={{ color: '#F4F4F5' }}
                                                formatter={((value: number) => `₹${value.toLocaleString()}`) as any}
                                            />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-surface-500 gap-2">
                                        <span className="text-4xl">📊</span>
                                        <p>No spending data available</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Transactions List */}
                        <div className="glass-card p-6">
                            <TransactionList key={refreshKey} />
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="space-y-8">
                        <TransactionForm onSuccess={handleTransactionSuccess} />

                        {/* Budget Progress */}
                        <div className="glass-card p-6">
                            <h3 className="text-lg font-bold text-surface-100 mb-4">Budget Utilization</h3>
                            <div className="space-y-5">
                                {summary && Object.entries(summary.categoryBreakdown)
                                    .filter(([cat]) => cat !== 'savings')
                                    .map(([cat, data], idx) => (
                                    <div key={cat}>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="capitalize text-surface-300 font-medium">{cat}</span>
                                            <span className="text-surface-100">₹{data.spent.toLocaleString()}</span>
                                        </div>
                                        <div className="h-2.5 bg-surface-800 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full rounded-full transition-all duration-1000 ease-out"
                                                style={{ 
                                                    width: `${Math.min((data.spent / data.budget) * 100, 100)}%`,
                                                    backgroundColor: COLORS[idx % COLORS.length]
                                                }} 
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}