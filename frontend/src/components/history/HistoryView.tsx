import { useEffect } from 'react';
import { useStore } from '../../store/useStore';
import SavingsTrend from './SavingsTrend';
import BudgetComparison from './BudgetComparison';

export default function HistoryView() {
    const { history, loadMockData } = useStore();

    useEffect(() => {
        if (history.length === 0) loadMockData();
    }, [loadMockData, history.length]);

    return (
        <div className="page-enter space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-surface-100">History & Analysis</h1>
                <p className="text-surface-500 text-sm mt-1">Track your savings progress and compare optimization methods</p>
            </div>

            {/* Savings Trend */}
            <SavingsTrend history={history} />

            {/* Method Comparison */}
            <BudgetComparison />

            {/* Historical Periods Grid */}
            <div>
                <h3 className="text-sm font-semibold text-surface-300 mb-4 uppercase tracking-wider">
                    Monthly Summary
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {history.slice(0, 6).map((h) => {
                        const d = new Date(h.periodStart);
                        const pct = (h.savingsRate * 100).toFixed(1);
                        const isRL = h.source === 'rl_suggested';
                        return (
                            <div key={h.budgetId} className="glass-card-hover p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="font-semibold text-surface-200">
                                        {d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                                    </p>
                                    {isRL ? (
                                        <span className="badge-brand text-[10px]">🧠 RL</span>
                                    ) : (
                                        <span className="badge text-[10px] bg-surface-800 text-surface-400 border border-surface-700">Manual</span>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-surface-500">Savings Rate</span>
                                        <span className={`font-semibold ${Number(pct) > 25 ? 'text-accent-emerald' : 'text-surface-200'}`}>
                                            {pct}%
                                        </span>
                                    </div>
                                    <div className="w-full h-1.5 bg-surface-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${isRL ? 'bg-brand-500' : 'bg-surface-500'}`}
                                            style={{ width: `${Math.min(Number(pct), 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
