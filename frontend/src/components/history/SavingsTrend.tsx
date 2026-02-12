import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { BudgetHistory } from '../../services/mockData';
import { formatPercent } from '../../utils/formatters';

interface SavingsTrendProps {
    history: BudgetHistory[];
}

export default function SavingsTrend({ history }: SavingsTrendProps) {
    const data = history.map((h) => {
        const d = new Date(h.periodStart);
        return {
            month: d.toLocaleDateString('en-IN', { month: 'short' }),
            savings: Number((h.savingsRate * 100).toFixed(1)),
            source: h.source,
        };
    });

    const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string }) => {
        if (active && payload?.length) {
            return (
                <div className="glass-card px-4 py-2.5">
                    <p className="text-sm font-medium text-surface-200">{label}</p>
                    <p className="text-sm text-accent-emerald">{formatPercent(payload[0].value / 100)}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-surface-300 mb-4 uppercase tracking-wider">
                Savings Rate — 12 Month Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(51, 65, 85, 0.3)" />
                    <XAxis dataKey="month" stroke="#475569" fontSize={12} />
                    <YAxis tickFormatter={(v: number) => `${v}%`} stroke="#475569" fontSize={12} domain={[0, 'auto']} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                        type="monotone"
                        dataKey="savings"
                        stroke="#6366f1"
                        strokeWidth={3}
                        dot={{ fill: '#6366f1', r: 4, strokeWidth: 2, stroke: '#1e1b4b' }}
                        activeDot={{ r: 6, fill: '#818cf8' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
