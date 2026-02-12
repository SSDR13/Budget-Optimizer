import { useAuth } from '../../contexts/AuthContext';
import { useStore } from '../../store/useStore';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { toggleSidebar } = useStore();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-surface-900/80 backdrop-blur-xl border-b border-surface-800/50">
            <div className="flex items-center justify-between h-full px-4 lg:px-6">
                {/* Left: Hamburger + Logo */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800 transition-colors lg:hidden"
                        aria-label="Toggle sidebar"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <a href="/dashboard" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center">
                            <span className="text-white font-bold text-sm">RL</span>
                        </div>
                        <span className="text-lg font-bold text-surface-100 hidden sm:block">
                            Budget<span className="gradient-text">Optimizer</span>
                        </span>
                    </a>
                </div>

                {/* Right: User */}
                {user && (
                    <div className="flex items-center gap-3">
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-medium text-surface-200">{user.displayName}</p>
                            <p className="text-xs text-surface-500">{user.email}</p>
                        </div>
                        <div className="relative group">
                            <button className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-accent-violet flex items-center justify-center text-white font-semibold text-sm">
                                {user.displayName.charAt(0)}
                            </button>
                            {/* Dropdown */}
                            <div className="absolute right-0 top-12 w-48 glass-card p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <a href="/settings" className="block px-3 py-2 text-sm text-surface-300 hover:text-surface-100 hover:bg-surface-700/50 rounded-lg transition-colors">
                                    ⚙️ Settings
                                </a>
                                <button
                                    onClick={logout}
                                    className="w-full text-left px-3 py-2 text-sm text-accent-rose hover:bg-accent-rose/10 rounded-lg transition-colors"
                                >
                                    🚪 Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
