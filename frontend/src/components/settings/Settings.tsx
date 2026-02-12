import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { RISK_PREFERENCES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

export default function Settings() {
    const { user } = useAuth();
    const [income, setIncome] = useState(user?.monthlyIncome?.toString() || '75000');
    const [risk, setRisk] = useState(user?.riskPreference || 'moderate');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        // TODO: Call API to update profile
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="page-enter space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold text-surface-100">Settings</h1>
                <p className="text-surface-500 text-sm mt-1">Manage your profile and preferences</p>
            </div>

            {/* Profile */}
            <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-surface-200 mb-4">Profile</h2>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-violet flex items-center justify-center text-white text-2xl font-bold">
                            {user?.displayName?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <p className="font-semibold text-surface-200">{user?.displayName || 'User'}</p>
                            <p className="text-sm text-surface-500">{user?.email || 'user@example.com'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Income */}
            <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-surface-200 mb-4">Monthly Income</h2>
                <div>
                    <label className="input-label">Income (₹)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500">₹</span>
                        <input
                            type="number"
                            value={income}
                            onChange={(e) => setIncome(e.target.value)}
                            className="input-field pl-10 text-lg font-semibold"
                            min="1000"
                        />
                    </div>
                    <p className="text-xs text-surface-500 mt-2">
                        Current: {formatCurrency(Number(income))} / month
                    </p>
                </div>
            </div>

            {/* Risk Preference */}
            <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-surface-200 mb-4">Risk Preference</h2>
                <p className="text-sm text-surface-500 mb-4">Controls how aggressively the RL agent optimizes your budget</p>
                <div className="space-y-2">
                    {RISK_PREFERENCES.map((pref) => (
                        <button
                            key={pref.value}
                            onClick={() => setRisk(pref.value)}
                            className={`w-full p-4 rounded-xl border text-left transition-all duration-200 ${risk === pref.value
                                    ? 'bg-brand-600/15 border-brand-500/40'
                                    : 'bg-surface-800/30 border-surface-700 hover:border-surface-600'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl">{pref.icon}</span>
                                <div className="flex-1">
                                    <p className={`font-semibold text-sm ${risk === pref.value ? 'text-brand-400' : 'text-surface-200'}`}>{pref.label}</p>
                                    <p className="text-xs text-surface-500">{pref.description}</p>
                                </div>
                                {risk === pref.value && (
                                    <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
                                        <span className="text-white text-xs">✓</span>
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* RL Model */}
            <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-surface-200 mb-4">RL Model Configuration</h2>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-surface-800">
                        <span className="text-surface-500">Active Model</span>
                        <span className="text-surface-200 font-medium">DQN v1.0</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-surface-800">
                        <span className="text-surface-500">Episodes Trained</span>
                        <span className="text-surface-200 font-medium">500</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-surface-800">
                        <span className="text-surface-500">Learning Rate</span>
                        <span className="text-surface-200 font-mono">0.001</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-surface-500">Discount Factor (γ)</span>
                        <span className="text-surface-200 font-mono">0.95</span>
                    </div>
                </div>
                <button className="btn-secondary w-full mt-4 text-sm">
                    🧠 Retrain Model
                </button>
            </div>

            {/* Save Button */}
            <button
                onClick={handleSave}
                className={`btn-primary w-full py-3.5 transition-all ${saved ? 'bg-accent-emerald hover:bg-accent-emerald' : ''}`}
            >
                {saved ? '✓ Settings Saved!' : 'Save Changes'}
            </button>
        </div>
    );
}
