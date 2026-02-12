import { useEffect } from 'react';
import { useStore } from '../../store/useStore';
import SummaryCard from './SummaryCard';
import CategoryChart from './CategoryChart';
import RLSuggestionPanel from './RLSuggestionPanel';

export default function Dashboard() {
    const { summary, suggestion, loadMockData, setSuggestionStatus } = useStore();

    useEffect(() => {
        // Load mock data on mount (replace with API calls when backend is ready)
        loadMockData();
    }, [loadMockData]);

    if (!summary) return null;

    const saved = summary.income - summary.totalSpent;

    return (
        <div className="page-enter space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-surface-100">Dashboard</h1>
                    <p className="text-surface-500 text-sm mt-1">
                        {summary.period.start} — {summary.period.end}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="badge-brand">February 2026</span>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard
                    label="Monthly Income"
                    value={summary.income}
                    format="currency"
                    icon="💰"
                    color="bg-brand-500/10"
                />
                <SummaryCard
                    label="Total Spent"
                    value={summary.totalSpent}
                    format="currency"
                    icon="💳"
                    trend={-3.2}
                    color="bg-accent-rose/10"
                />
                <SummaryCard
                    label="Savings"
                    value={saved}
                    format="currency"
                    icon="🏦"
                    trend={8.5}
                    color="bg-accent-emerald/10"
                />
                <SummaryCard
                    label="Savings Rate"
                    value={summary.savingsRate}
                    format="percent"
                    icon="📈"
                    trend={5.1}
                    color="bg-accent-cyan/10"
                />
            </div>

            {/* Category Charts */}
            <CategoryChart summary={summary} />

            {/* RL Suggestion Panel */}
            {suggestion && (
                <RLSuggestionPanel
                    suggestion={suggestion}
                    onAccept={() => setSuggestionStatus('accepted')}
                    onReject={() => setSuggestionStatus('rejected')}
                />
            )}

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-4">
                <div className="glass-card p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">🎯</span>
                        <h3 className="font-semibold text-surface-200">Budget Adherence</h3>
                    </div>
                    <div className="space-y-3">
                        {(['food', 'transport', 'shopping'] as const).map((cat) => {
                            const data = summary.categoryBreakdown[cat];
                            const pct = Math.min((data.spent / data.budget) * 100, 100);
                            const isOver = data.spent > data.budget;
                            return (
                                <div key={cat}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-surface-400">{cat}</span>
                                        <span className={isOver ? 'text-accent-rose' : 'text-surface-400'}>{pct.toFixed(0)}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-surface-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-accent-rose' : 'bg-brand-500'}`}
                                            style={{ width: `${Math.min(pct, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="glass-card p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">🧠</span>
                        <h3 className="font-semibold text-surface-200">RL Model Status</h3>
                    </div>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-surface-500">Active Model</span>
                            <span className="text-surface-200 font-medium">DQN v1.0</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-surface-500">Episodes Trained</span>
                            <span className="text-surface-200 font-medium">500</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-surface-500">Avg Reward</span>
                            <span className="text-accent-emerald font-medium">+42.3</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-surface-500">Last Updated</span>
                            <span className="text-surface-200 font-medium">2h ago</span>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">📊</span>
                        <h3 className="font-semibold text-surface-200">This Month</h3>
                    </div>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-surface-500">Transactions</span>
                            <span className="text-surface-200 font-medium">47</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-surface-500">Suggestions</span>
                            <span className="text-surface-200 font-medium">3</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-surface-500">Accepted</span>
                            <span className="text-accent-emerald font-medium">2</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-surface-500">Days Left</span>
                            <span className="text-brand-400 font-medium">16</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
