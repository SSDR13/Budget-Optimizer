import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RISK_PREFERENCES } from '../../utils/constants';

const STEPS = ['Income Setup', 'Risk Profile', 'All Set!'];

export default function Onboarding() {
    const [step, setStep] = useState(0);
    const [income, setIncome] = useState('');
    const [risk, setRisk] = useState<string>('moderate');
    const navigate = useNavigate();

    const handleComplete = () => {
        // TODO: Call API onboard endpoint
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
            <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-brand-600/15 rounded-full blur-3xl" />

            <div className="relative w-full max-w-lg">
                {/* Progress bar */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {STEPS.map((s, i) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${i <= step
                                    ? 'bg-brand-500 text-white shadow-glow'
                                    : 'bg-surface-800 text-surface-500 border border-surface-700'
                                }`}>
                                {i < step ? '✓' : i + 1}
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={`w-12 h-0.5 transition-colors duration-300 ${i < step ? 'bg-brand-500' : 'bg-surface-700'
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="glass-card p-8 animate-fade-in" key={step}>
                    {step === 0 && (
                        <>
                            <h2 className="text-2xl font-bold text-surface-100 mb-2">Let's set up your profile</h2>
                            <p className="text-surface-400 mb-8">Tell us about your monthly income to get started</p>

                            <div className="space-y-4">
                                <div>
                                    <label className="input-label">Monthly Income (₹)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500 text-lg">₹</span>
                                        <input
                                            type="number"
                                            value={income}
                                            onChange={(e) => setIncome(e.target.value)}
                                            placeholder="75,000"
                                            className="input-field pl-10 text-xl font-semibold"
                                            min="1000"
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-surface-500 mt-2">This helps the RL agent understand your budget capacity</p>
                                </div>

                                <button
                                    onClick={() => setStep(1)}
                                    disabled={!income || Number(income) < 1000}
                                    className="btn-primary w-full py-3 mt-4"
                                >
                                    Continue →
                                </button>
                            </div>
                        </>
                    )}

                    {step === 1 && (
                        <>
                            <h2 className="text-2xl font-bold text-surface-100 mb-2">Choose your risk profile</h2>
                            <p className="text-surface-400 mb-6">This determines how aggressively the RL agent optimizes your budget</p>

                            <div className="space-y-3 mb-6">
                                {RISK_PREFERENCES.map((pref) => (
                                    <button
                                        key={pref.value}
                                        onClick={() => setRisk(pref.value)}
                                        className={`w-full p-4 rounded-xl border text-left transition-all duration-200 ${risk === pref.value
                                                ? 'bg-brand-600/15 border-brand-500/40 shadow-glow'
                                                : 'bg-surface-800/50 border-surface-700 hover:border-surface-600'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{pref.icon}</span>
                                            <div>
                                                <p className={`font-semibold ${risk === pref.value ? 'text-brand-400' : 'text-surface-200'}`}>
                                                    {pref.label}
                                                </p>
                                                <p className="text-sm text-surface-500">{pref.description}</p>
                                            </div>
                                            {risk === pref.value && (
                                                <div className="ml-auto w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
                                                    <span className="text-white text-xs">✓</span>
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setStep(0)} className="btn-secondary flex-1 py-3">← Back</button>
                                <button onClick={() => setStep(2)} className="btn-primary flex-1 py-3">Continue →</button>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <div className="text-center py-6">
                            <div className="w-20 h-20 rounded-full bg-accent-emerald/20 flex items-center justify-center mx-auto mb-6 animate-float">
                                <span className="text-4xl">🎉</span>
                            </div>
                            <h2 className="text-2xl font-bold text-surface-100 mb-2">You're all set!</h2>
                            <p className="text-surface-400 mb-2">
                                Monthly Income: <span className="text-accent-emerald font-semibold">₹{Number(income).toLocaleString('en-IN')}</span>
                            </p>
                            <p className="text-surface-400 mb-8">
                                Risk Profile: <span className="text-brand-400 font-semibold capitalize">{risk}</span>
                            </p>

                            <div className="glass-card p-4 mb-8 text-left">
                                <p className="text-sm text-surface-400 leading-relaxed">
                                    🧠 The RL engine will now learn your spending patterns and suggest optimized budget allocations.
                                    Start by adding your transactions and watch the AI adapt over time.
                                </p>
                            </div>

                            <button onClick={handleComplete} className="btn-primary w-full py-3.5 text-lg">
                                Go to Dashboard →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
