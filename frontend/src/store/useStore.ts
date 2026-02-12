import { create } from 'zustand';
import type { UserProfile, Transaction, PeriodSummary, RLSuggestion, BudgetHistory } from '../services/mockData';
import {
    MOCK_USER,
    MOCK_TRANSACTIONS,
    MOCK_SUMMARY,
    MOCK_RL_SUGGESTION,
    MOCK_HISTORY,
} from '../services/mockData';

interface AppState {
    // User
    user: UserProfile | null;
    setUser: (user: UserProfile | null) => void;

    // Transactions
    transactions: Transaction[];
    setTransactions: (txns: Transaction[]) => void;
    addTransaction: (txn: Transaction) => void;
    removeTransaction: (id: string) => void;

    // Summary
    summary: PeriodSummary | null;
    setSummary: (s: PeriodSummary) => void;

    // RL Suggestion
    suggestion: RLSuggestion | null;
    setSuggestion: (s: RLSuggestion | null) => void;
    suggestionStatus: 'idle' | 'loading' | 'accepted' | 'rejected';
    setSuggestionStatus: (status: 'idle' | 'loading' | 'accepted' | 'rejected') => void;

    // History
    history: BudgetHistory[];
    setHistory: (h: BudgetHistory[]) => void;

    // UI
    sidebarOpen: boolean;
    toggleSidebar: () => void;

    // Load mock data for development
    loadMockData: () => void;
}

export const useStore = create<AppState>((set) => ({
    // User
    user: null,
    setUser: (user) => set({ user }),

    // Transactions
    transactions: [],
    setTransactions: (transactions) => set({ transactions }),
    addTransaction: (txn) => set((state) => ({ transactions: [txn, ...state.transactions] })),
    removeTransaction: (id) =>
        set((state) => ({
            transactions: state.transactions.filter((t) => t.transactionId !== id),
        })),

    // Summary
    summary: null,
    setSummary: (summary) => set({ summary }),

    // RL Suggestion
    suggestion: null,
    setSuggestion: (suggestion) => set({ suggestion }),
    suggestionStatus: 'idle',
    setSuggestionStatus: (suggestionStatus) => set({ suggestionStatus }),

    // History
    history: [],
    setHistory: (history) => set({ history }),

    // UI
    sidebarOpen: true,
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

    // Load mock data
    loadMockData: () =>
        set({
            user: MOCK_USER,
            transactions: MOCK_TRANSACTIONS,
            summary: MOCK_SUMMARY,
            suggestion: MOCK_RL_SUGGESTION,
            history: MOCK_HISTORY,
        }),
}));
