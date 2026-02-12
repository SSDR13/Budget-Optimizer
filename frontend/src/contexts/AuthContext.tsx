import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { UserProfile } from '../services/mockData';
import { MOCK_USER } from '../services/mockData';

interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    signup: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate auth check — in production, this would listen to Firebase auth state
        const timer = setTimeout(() => {
            // Auto-login with mock user for development
            const stored = localStorage.getItem('rl_budget_auth');
            if (stored) {
                setUser(MOCK_USER);
            }
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const login = async (_email: string, _password: string) => {
        setLoading(true);
        // Simulate a login delay
        await new Promise((r) => setTimeout(r, 800));
        localStorage.setItem('rl_budget_auth', 'true');
        setUser(MOCK_USER);
        setLoading(false);
    };

    const loginWithGoogle = async () => {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 800));
        localStorage.setItem('rl_budget_auth', 'true');
        setUser(MOCK_USER);
        setLoading(false);
    };

    const signup = async (_email: string, _password: string, name: string) => {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 800));
        localStorage.setItem('rl_budget_auth', 'true');
        setUser({ ...MOCK_USER, displayName: name });
        setLoading(false);
    };

    const logout = async () => {
        localStorage.removeItem('rl_budget_auth');
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: !!user,
                login,
                loginWithGoogle,
                signup,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
