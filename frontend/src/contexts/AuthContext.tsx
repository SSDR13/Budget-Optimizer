import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';

// Check if Firebase is configured with real credentials
const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY || '';
const IS_FIREBASE_CONFIGURED = FIREBASE_API_KEY !== '' && FIREBASE_API_KEY !== 'your-api-key';

// ----- Mock user for dev mode -----
interface MockUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    getIdToken: () => Promise<string>;
}

const MOCK_USER: MockUser = {
    uid: 'dev-user-001',
    email: 'dev@budgetoptimizer.com',
    displayName: 'Dev User',
    getIdToken: async () => 'mock-dev-token',
};

// ----- Auth context type (works for both real and mock) -----
interface AuthContextType {
    user: (User | MockUser) | null;
    loading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    signup: (email: string, pass: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}

// ========================================================================
// Mock Auth Provider — used when Firebase is not configured
// ========================================================================
function MockAuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<MockUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check localStorage for persisted mock session
        const stored = localStorage.getItem('rl_budget_auth');
        if (stored) {
            setUser(MOCK_USER);
        }
        setLoading(false);
    }, []);

    const login = async (_email: string, _pass: string) => {
        await new Promise((r) => setTimeout(r, 500)); // simulate delay
        localStorage.setItem('rl_budget_auth', 'true');
        setUser(MOCK_USER);
    };

    const signup = async (_email: string, _pass: string, name: string) => {
        await new Promise((r) => setTimeout(r, 500));
        localStorage.setItem('rl_budget_auth', 'true');
        setUser({ ...MOCK_USER, displayName: name });
    };

    const logout = async () => {
        localStorage.removeItem('rl_budget_auth');
        setUser(null);
    };

    const loginWithGoogle = async () => {
        await new Promise((r) => setTimeout(r, 500));
        localStorage.setItem('rl_budget_auth', 'true');
        setUser(MOCK_USER);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, loginWithGoogle }}>
            {children}
        </AuthContext.Provider>
    );
}

// ========================================================================
// Real Firebase Auth Provider — used when Firebase is configured
// ========================================================================
function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribe: () => void = () => {};
        (async () => {
            const { auth } = await import('../services/firebase');
            const { onAuthStateChanged } = await import('firebase/auth');
            unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                setUser(currentUser);
                setLoading(false);
            });
        })();
        return () => unsubscribe();
    }, []);

    const login = async (email: string, pass: string) => {
        const { auth } = await import('../services/firebase');
        const { signInWithEmailAndPassword } = await import('firebase/auth');
        await signInWithEmailAndPassword(auth, email, pass);
    };

    const signup = async (email: string, pass: string, name: string) => {
        const { auth } = await import('../services/firebase');
        const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
        const res = await createUserWithEmailAndPassword(auth, email, pass);
        if (res.user) {
            await updateProfile(res.user, { displayName: name });
            setUser({ ...res.user, displayName: name });
        }
    };

    const logout = async () => {
        const { auth } = await import('../services/firebase');
        const { signOut } = await import('firebase/auth');
        await signOut(auth);
    };

    const loginWithGoogle = async () => {
        const { auth, googleProvider } = await import('../services/firebase');
        const { signInWithPopup } = await import('firebase/auth');
        await signInWithPopup(auth, googleProvider);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, loginWithGoogle }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

// ========================================================================
// Exported AuthProvider — auto-selects mock vs real Firebase
// ========================================================================
export function AuthProvider({ children }: { children: React.ReactNode }) {
    if (!IS_FIREBASE_CONFIGURED) {
        console.info('%c🔧 Dev Mode: Using mock auth (Firebase not configured)', 'color: #f59e0b; font-weight: bold');
        return <MockAuthProvider>{children}</MockAuthProvider>;
    }
    return <FirebaseAuthProvider>{children}</FirebaseAuthProvider>;
}