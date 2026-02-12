import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CATEGORY_CONFIG, type Category } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import type { PeriodSummary } from '../../services/mockData';

interface CategoryChartProps {
    summary: PeriodSummary;
}

export default function CategoryChart({ summary }: CategoryChartProps) {
    const categories = Object.entries(summary.categoryBreakdown)
        .filter(([key]) => key !== 'savings')
        .map(([key, val]) => ({
            name: CATEGORY_CONFIG[key as Category].label,
            icon: CATEGORY_CONFIG[key as Category].icon,
            spent: val.spent,
            budget: val.budget,
            color: CATEGORY_CONFIG[key as Category].color,
            key,
        }))
        .sort((a, b) => b.spent - a.spent);

    const pieData = categories.map((c) => ({ name: c.name, value: c.spent, color: c.color }));

    const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { color: string } }> }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-card px-4 py-2.5">
                    <p className="text-sm font-medium text-surface-200">{payload[0].name}</p>
                    <p className="text-sm text-surface-400">{formatCurrency(payload[0].value)}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid md:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-surface-300 mb-4 uppercase tracking-wider">Spending Distribution</h3>
                <div className="flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={4}
                                dataKey="value"
                                stroke="none"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity cursor-pointer" />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                {/* Legend */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                    {categories.map((c) => (
                        <div key={c.key} className="flex items-center gap-2 text-xs">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                            <span className="text-surface-400 truncate">{c.icon} {c.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bar Chart - Budget vs Spent */}
            <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-surface-300 mb-4 uppercase tracking-wider">Budget vs Actual</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categories} layout="vertical" margin={{ left: 10 }}>
                        <XAxis type="number" tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`} stroke="#475569" fontSize={11} />
                        <YAxis type="category" dataKey="icon" width={30} stroke="none" fontSize={16} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }} />
                        <Bar dataKey="budget" fill="#334155" radius={[0, 4, 4, 0]} barSize={14} name="Budget" />
                        <Bar dataKey="spent" radius={[0, 4, 4, 0]} barSize={14} name="Spent">
                            {categories.map((entry, index) => (
                                <Cell key={`bar-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
