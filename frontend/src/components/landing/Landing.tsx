import { Link } from 'react-router-dom';

const FEATURES = [
    {
        icon: '🧠',
        title: 'AI-Powered Budgeting',
        description: 'Deep Reinforcement Learning adapts your budget allocation over time, learning from your spending patterns.',
        gradient: 'from-brand-500 to-accent-violet',
    },
    {
        icon: '📊',
        title: 'Smart Analytics',
        description: 'Interactive dashboards with real-time spending breakdowns, savings trends, and predictive insights.',
        gradient: 'from-accent-cyan to-accent-emerald',
    },
    {
        icon: '🎯',
        title: 'Adaptive Optimization',
        description: 'Unlike static rules, our DQN agent continuously improves — targeting 15-25% better savings than traditional methods.',
        gradient: 'from-accent-amber to-accent-rose',
    },
];

const STATS = [
    { value: '26.3%', label: 'Avg Savings Rate' },
    { value: '15-25%', label: 'Improvement over Baselines' },
    { value: '87%', label: 'Suggestion Confidence' },
    { value: '< 300', label: 'Episodes to Converge' },
];

export default function Landing() {
    return (
        <div className="min-h-screen gradient-bg">
            {/* Navigation */}
            <header className="fixed top-0 w-full z-50 bg-surface-950/30 backdrop-blur-xl border-b border-surface-800/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center">
                            <span className="text-white font-bold text-sm">RL</span>
                        </div>
                        <span className="text-lg font-bold text-surface-100">
                            Budget<span className="gradient-text">Optimizer</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
                        <Link to="/signup" className="btn-primary text-sm">Get Started</Link>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                {/* Background orbs */}
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-accent-cyan/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

                <div className="relative max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 badge-brand mb-6 text-sm">
                        <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
                        Powered by Deep Reinforcement Learning
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-surface-50 leading-tight mb-6 text-balance">
                        Your Budget,{' '}
                        <span className="gradient-text">Intelligently</span>{' '}
                        Optimized
                    </h1>

                    <p className="text-lg sm:text-xl text-surface-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Stop guessing with static 50-30-20 rules. Our AI learns your spending patterns
                        and continuously adapts budget allocations to maximize your savings growth.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/signup" className="btn-primary text-base px-8 py-3.5 text-lg">
                            Start Optimizing →
                        </Link>
                        <Link to="/login" className="btn-secondary text-base px-8 py-3.5">
                            Sign In to Dashboard
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats bar */}
            <section className="relative py-8 border-y border-surface-800/30">
                <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
                    {STATS.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <p className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</p>
                            <p className="text-sm text-surface-500 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl sm:text-4xl font-bold text-surface-100 mb-4">
                            Why RL Budget Optimizer?
                        </h2>
                        <p className="text-surface-400 max-w-xl mx-auto">
                            Traditional personal finance apps fail to adapt. Ours learns and evolves with you.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {FEATURES.map((feature) => (
                            <div key={feature.title} className="glass-card-hover p-8 group">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-surface-100 mb-3">{feature.title}</h3>
                                <p className="text-surface-400 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-20 px-4 border-t border-surface-800/30">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-bold text-surface-100 mb-14 text-center">
                        How It Works
                    </h2>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { step: '01', title: 'Import', desc: 'Add your transactions manually or import via CSV' },
                            { step: '02', title: 'Analyze', desc: 'RL agent processes your spending patterns and state' },
                            { step: '03', title: 'Suggest', desc: 'DQN model generates optimal budget modifications' },
                            { step: '04', title: 'Adapt', desc: 'Accept/reject feedback trains the model further' },
                        ].map((item) => (
                            <div key={item.step} className="text-center group">
                                <div className="w-16 h-16 rounded-2xl bg-surface-800 border border-surface-700 flex items-center justify-center mx-auto mb-4 group-hover:border-brand-500/50 group-hover:shadow-glow transition-all duration-300">
                                    <span className="text-xl font-bold gradient-text">{item.step}</span>
                                </div>
                                <h3 className="font-bold text-surface-200 mb-2">{item.title}</h3>
                                <p className="text-sm text-surface-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4">
                <div className="max-w-3xl mx-auto text-center glass-card p-12 gradient-border">
                    <h2 className="text-3xl font-bold text-surface-100 mb-4">
                        Ready to Optimize Your Finances?
                    </h2>
                    <p className="text-surface-400 mb-8">
                        Join the future of adaptive personal finance management.
                    </p>
                    <Link to="/signup" className="btn-primary text-lg px-10 py-4">
                        Get Started Free →
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-surface-800/30 py-8 px-4">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-surface-500">
                        © 2026 RL Budget Optimizer — Final Year Capstone Project
                    </p>
                    <p className="text-sm text-surface-600">
                        Built with React, FastAPI, PyTorch & ❤️
                    </p>
                </div>
            </footer>
        </div>
    );
}
