import { useState } from 'react';
import { CATEGORY_CONFIG, type Category } from '../../utils/constants';
import type { RLSuggestion } from '../../services/mockData';

interface RLSuggestionPanelProps {
    suggestion: RLSuggestion;
    onAccept: () => void;
    onReject: () => void;
}

export default function RLSuggestionPanel({ suggestion, onAccept, onReject }: RLSuggestionPanelProps) {
    const [status, setStatus] = useState<'pending' | 'accepted' | 'rejected'>('pending');

    const handleAccept = () => {
        setStatus('accepted');
        onAccept();
    };

    const handleReject = () => {
        setStatus('rejected');
        onReject();
    };

    const confidenceColor = suggestion.confidence >= 0.8 ? 'badge-emerald' : suggestion.confidence >= 0.6 ? 'badge-amber' : 'badge-rose';
    const modelLabel = suggestion.modelType === 'dqn' ? 'Deep Q-Network' : 'Q-Learning';

    // Categories to show (exclude rent since it's fixed)
    const categories = (['food', 'transport', 'shopping', 'entertainment', 'other', 'savings'] as Category[]);

    return (
        <div className="glass-card overflow-hidden gradient-border">
            {/* Header */}
            <div className="p-6 border-b border-surface-700/50">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-violet flex items-center justify-center">
                            <span className="text-lg">🧠</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-surface-100">RL Budget Suggestion</h3>
                            <p className="text-xs text-surface-500">Powered by {modelLabel}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={confidenceColor}>
                            {(suggestion.confidence * 100).toFixed(0)}% confidence
                        </span>
                        <span className="badge-emerald">
                            +{(suggestion.expectedSavingsIncrease * 100).toFixed(1)}% savings
                        </span>
                    </div>
                </div>
            </div>

            {/* Comparison Table */}
            <div className="p-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-surface-500 border-b border-surface-800">
                                <th className="text-left py-3 font-medium">Category</th>
                                <th className="text-right py-3 font-medium">Current %</th>
                                <th className="text-right py-3 font-medium">Suggested %</th>
                                <th className="text-right py-3 font-medium">Change</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((cat) => {
                                const delta = suggestion.deltaAllocation[cat];
                                const isPositive = delta > 0;
                                const isNegative = delta < 0;
                                return (
                                    <tr key={cat} className="border-b border-surface-800/50 hover:bg-surface-800/30 transition-colors">
                                        <td className="py-3">
                                            <div className="flex items-center gap-2">
                                                <span>{CATEGORY_CONFIG[cat].icon}</span>
                                                <span className="text-surface-200">{CATEGORY_CONFIG[cat].label}</span>
                                            </div>
                                        </td>
                                        <td className="text-right text-surface-400 py-3 font-mono">
                                            {suggestion.currentAllocation[cat].toFixed(1)}%
                                        </td>
                                        <td className="text-right text-surface-200 py-3 font-mono font-semibold">
                                            {suggestion.suggestedAllocation[cat].toFixed(1)}%
                                        </td>
                                        <td className={`text-right py-3 font-mono font-semibold ${isPositive ? 'text-accent-emerald' : isNegative ? 'text-accent-rose' : 'text-surface-500'}`}>
                                            {isPositive && '+'}{delta.toFixed(1)}%
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Reasoning */}
                <div className="mt-5 p-4 bg-surface-800/40 rounded-xl border border-surface-700/30">
                    <p className="text-sm text-surface-400 leading-relaxed">
                        <span className="text-surface-300 font-medium">💡 Reasoning: </span>
                        {suggestion.reasoning}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex gap-3">
                    {status === 'pending' ? (
                        <>
                            <button onClick={handleAccept} className="btn-success flex-1 flex items-center justify-center gap-2">
                                <span>✓</span> Accept Suggestion
                            </button>
                            <button onClick={handleReject} className="btn-danger flex-1 flex items-center justify-center gap-2">
                                <span>✕</span> Reject
                            </button>
                        </>
                    ) : (
                        <div className={`w-full p-4 rounded-xl text-center font-semibold ${status === 'accepted'
                                ? 'bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20'
                                : 'bg-accent-rose/10 text-accent-rose border border-accent-rose/20'
                            }`}>
                            {status === 'accepted' ? '✓ Suggestion accepted! Budget updated.' : '✕ Suggestion rejected. Feedback recorded.'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
