import { formatCurrency, formatPercent } from '../../utils/formatters';

interface SummaryCardProps {
    label: string;
    value: number;
    format: 'currency' | 'percent';
    icon: string;
    trend?: number;
    color: string;
}

export default function SummaryCard({ label, value, format, icon, trend, color }: SummaryCardProps) {
    const formattedValue = format === 'currency' ? formatCurrency(value) : formatPercent(value);

    return (
        <div className="glass-card-hover p-5 group">
            <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${color}`}>
                    {icon}
                </div>
                {trend !== undefined && (
                    <span className={`badge text-xs ${trend >= 0 ? 'badge-emerald' : 'badge-rose'}`}>
                        {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
                    </span>
                )}
            </div>
            <p className="text-2xl font-bold text-surface-100 mb-1 group-hover:gradient-text transition-all duration-300">
                {formattedValue}
            </p>
            <p className="text-sm text-surface-500">{label}</p>
        </div>
    );
}
