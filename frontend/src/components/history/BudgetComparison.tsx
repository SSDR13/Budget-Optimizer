import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MOCK_BASELINE_COMPARISON } from '../../services/mockData';

export default function BudgetComparison() {
    const data = MOCK_BASELINE_COMPARISON;

    const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof data[0] }> }) => {
        if (active && payload?.length) {
            const d = payload[0].payload;
            return (
                <div className="glass-card px-4 py-3">
                    <p className="text-sm font-semibold text-surface-200 mb-1">{d.method}</p>
                    <p className="text-sm text-surface-400">Avg Savings: <span className="text-accent-emerald font-medium">{d.avgSavings}%</span></p>
                    <p className="text-sm text-surface-400">Std Dev: ±{d.stdDev}%</p>
                    <p className="text-sm text-surface-400">Violations: {d.violations}%</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-surface-300 mb-1 uppercase tracking-wider">
                Method Comparison
            </h3>
            <p className="text-xs text-surface-500 mb-4">Average savings rate across 12-period simulation</p>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                    <XAxis dataKey="method" stroke="#475569" fontSize={11} tick={{ fill: '#94a3b8' }} />
                    <YAxis tickFormatter={(v: number) => `${v}%`} stroke="#475569" fontSize={12} domain={[0, 30]} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }} />
                    <Bar dataKey="avgSavings" radius={[8, 8, 0, 0]} barSize={48}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            {/* Legend cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
                {data.map((d) => (
                    <div
                        key={d.method}
                        className="p-3 rounded-xl border border-surface-700/50 bg-surface-800/30 text-center"
                    >
                        <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: d.color }} />
                        <p className="text-xs text-surface-400 mb-1">{d.method}</p>
                        <p className="text-lg font-bold" style={{ color: d.color }}>{d.avgSavings}%</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
