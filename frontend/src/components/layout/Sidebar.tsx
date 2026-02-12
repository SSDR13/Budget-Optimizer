import { NavLink } from 'react-router-dom';
import { useStore } from '../../store/useStore';

const NAV_ITEMS = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/transactions', label: 'Transactions', icon: '💳' },
    { path: '/history', label: 'History', icon: '📈' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar() {
    const { sidebarOpen, toggleSidebar } = useStore();

    return (
        <>
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 
          bg-surface-900/95 backdrop-blur-xl border-r border-surface-800/50
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
            >
                <div className="flex flex-col h-full p-4">
                    {/* Nav links */}
                    <nav className="flex-1 space-y-1 mt-2">
                        {NAV_ITEMS.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => { if (window.innerWidth < 1024) toggleSidebar(); }}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${isActive
                                        ? 'bg-brand-600/15 text-brand-400 border border-brand-500/20 shadow-glow'
                                        : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/50'
                                    }`
                                }
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* Bottom section */}
                    <div className="mt-auto pt-4 border-t border-surface-800/50">
                        <div className="glass-card p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
                                <span className="text-xs font-medium text-surface-400">RL Engine</span>
                            </div>
                            <p className="text-xs text-surface-500">DQN Model v1.0 active</p>
                            <p className="text-xs text-surface-500 mt-1">Last trained: 2h ago</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
