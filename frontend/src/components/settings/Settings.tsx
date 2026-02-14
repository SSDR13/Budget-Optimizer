import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <div className="p-4 lg:p-8 max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-3xl font-bold text-surface-100 mb-8">Settings</h1>
            
            <div className="glass-card p-6 space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-surface-700">
                    <div className="w-16 h-16 rounded-full bg-brand-500/20 flex items-center justify-center text-2xl">
                        {user?.email?.[0].toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-surface-100">{user?.displayName || 'User'}</h2>
                        <p className="text-surface-400">{user?.email}</p>
                    </div>
                </div>

                <div className="pt-4">
                    <button 
                        onClick={handleLogout}
                        className="px-4 py-2 bg-surface-800 hover:bg-surface-700 text-accent-rose border border-surface-700 rounded-lg transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}