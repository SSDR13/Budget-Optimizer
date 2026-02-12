import type { Category } from '../utils/constants';

// ─── Type Definitions ────────────────────────────────────────

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    monthlyIncome: number;
    currency: string;
    riskPreference: 'conservative' | 'moderate' | 'aggressive';
    onboardingComplete: boolean;
}

export interface Transaction {
    transactionId: string;
    userId: string;
    amount: number;
    category: Category;
    description: string;
    date: string;
    createdAt: string;
    source: 'manual' | 'imported' | 'auto';
}

export interface BudgetAllocation {
    food: number;
    rent: number;
    transport: number;
    shopping: number;
    entertainment: number;
    other: number;
    savings: number;
}

export interface PeriodSummary {
    period: { start: string; end: string };
    income: number;
    totalSpent: number;
    savingsRate: number;
    categoryBreakdown: Record<Category, { spent: number; budget: number; percentage: number }>;
}

export interface RLSuggestion {
    currentAllocation: BudgetAllocation;
    suggestedAllocation: BudgetAllocation;
    deltaAllocation: BudgetAllocation;
    expectedSavingsIncrease: number;
    confidence: number;
    reasoning: string;
    modelType: 'q_learning' | 'dqn';
}

export interface BudgetHistory {
    budgetId: string;
    periodStart: string;
    periodEnd: string;
    income: number;
    allocation: BudgetAllocation;
    actualSpent: BudgetAllocation;
    source: string;
    savingsRate: number;
}

// ─── Mock Data ──────────────────────────────────────────────

export const MOCK_USER: UserProfile = {
    uid: 'demo-user-001',
    email: 'demo@rlbudget.com',
    displayName: 'Arjun Sharma',
    monthlyIncome: 75000,
    currency: 'INR',
    riskPreference: 'moderate',
    onboardingComplete: true,
};

export const MOCK_TRANSACTIONS: Transaction[] = [
    { transactionId: 'txn001', userId: 'demo-user-001', amount: 850, category: 'food', description: 'Swiggy dinner order', date: '2026-02-11T19:30:00Z', createdAt: '2026-02-11T19:30:00Z', source: 'manual' },
    { transactionId: 'txn002', userId: 'demo-user-001', amount: 2400, category: 'food', description: 'BigBasket groceries', date: '2026-02-10T10:00:00Z', createdAt: '2026-02-10T10:00:00Z', source: 'manual' },
    { transactionId: 'txn003', userId: 'demo-user-001', amount: 20000, category: 'rent', description: 'February rent', date: '2026-02-01T09:00:00Z', createdAt: '2026-02-01T09:00:00Z', source: 'manual' },
    { transactionId: 'txn004', userId: 'demo-user-001', amount: 1200, category: 'transport', description: 'Uber rides this week', date: '2026-02-09T18:00:00Z', createdAt: '2026-02-09T18:00:00Z', source: 'manual' },
    { transactionId: 'txn005', userId: 'demo-user-001', amount: 3500, category: 'shopping', description: 'Amazon electronics', date: '2026-02-08T14:00:00Z', createdAt: '2026-02-08T14:00:00Z', source: 'imported' },
    { transactionId: 'txn006', userId: 'demo-user-001', amount: 500, category: 'entertainment', description: 'Netflix subscription', date: '2026-02-05T00:00:00Z', createdAt: '2026-02-05T00:00:00Z', source: 'auto' },
    { transactionId: 'txn007', userId: 'demo-user-001', amount: 1800, category: 'entertainment', description: 'PVR movie + dinner', date: '2026-02-07T20:00:00Z', createdAt: '2026-02-07T20:00:00Z', source: 'manual' },
    { transactionId: 'txn008', userId: 'demo-user-001', amount: 750, category: 'food', description: 'Zomato lunch', date: '2026-02-12T12:30:00Z', createdAt: '2026-02-12T12:30:00Z', source: 'manual' },
    { transactionId: 'txn009', userId: 'demo-user-001', amount: 600, category: 'transport', description: 'Metro recharge', date: '2026-02-06T08:00:00Z', createdAt: '2026-02-06T08:00:00Z', source: 'manual' },
    { transactionId: 'txn010', userId: 'demo-user-001', amount: 2000, category: 'other', description: 'Gym membership renewal', date: '2026-02-03T10:00:00Z', createdAt: '2026-02-03T10:00:00Z', source: 'manual' },
    { transactionId: 'txn011', userId: 'demo-user-001', amount: 1500, category: 'food', description: 'Weekly groceries', date: '2026-02-04T11:00:00Z', createdAt: '2026-02-04T11:00:00Z', source: 'manual' },
    { transactionId: 'txn012', userId: 'demo-user-001', amount: 4500, category: 'shopping', description: 'Myntra clothing', date: '2026-02-02T16:00:00Z', createdAt: '2026-02-02T16:00:00Z', source: 'imported' },
];

export const MOCK_SUMMARY: PeriodSummary = {
    period: { start: '2026-02-01', end: '2026-02-28' },
    income: 75000,
    totalSpent: 39600,
    savingsRate: 0.472,
    categoryBreakdown: {
        food: { spent: 5500, budget: 11250, percentage: 7.3 },
        rent: { spent: 20000, budget: 20000, percentage: 26.7 },
        transport: { spent: 1800, budget: 5250, percentage: 2.4 },
        shopping: { spent: 8000, budget: 7500, percentage: 10.7 },
        entertainment: { spent: 2300, budget: 3750, percentage: 3.1 },
        other: { spent: 2000, budget: 3750, percentage: 2.7 },
        savings: { spent: 0, budget: 23500, percentage: 0 },
    },
};

export const MOCK_RL_SUGGESTION: RLSuggestion = {
    currentAllocation: { food: 15, rent: 26.7, transport: 7, shopping: 10, entertainment: 5, other: 5, savings: 31.3 },
    suggestedAllocation: { food: 13, rent: 26.7, transport: 6, shopping: 8, entertainment: 4, other: 4.3, savings: 38 },
    deltaAllocation: { food: -2, rent: 0, transport: -1, shopping: -2, entertainment: -1, other: -0.7, savings: 6.7 },
    expectedSavingsIncrease: 0.067,
    confidence: 0.87,
    reasoning: 'Based on your Feb spending, food and shopping have room for 2% reduction each. Your transport costs are trending down — we can reallocate to savings. This could increase monthly savings by ₹5,025.',
    modelType: 'dqn',
};

// 12-month savings trend
export const MOCK_HISTORY: BudgetHistory[] = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const date = new Date(2025, month, 1);
    const baseSavings = 18 + Math.random() * 12;
    return {
        budgetId: `budget-${month}`,
        periodStart: date.toISOString(),
        periodEnd: new Date(2025, month + 1, 0).toISOString(),
        income: 75000,
        allocation: { food: 15, rent: 26.7, transport: 7, shopping: 10, entertainment: 5, other: 5, savings: 31.3 },
        actualSpent: {
            food: 9000 + Math.random() * 3000,
            rent: 20000,
            transport: 3000 + Math.random() * 2000,
            shopping: 5000 + Math.random() * 5000,
            entertainment: 2000 + Math.random() * 3000,
            other: 2000 + Math.random() * 2000,
            savings: baseSavings * 750,
        },
        source: i > 6 ? 'rl_suggested' : 'manual',
        savingsRate: baseSavings / 100,
    };
});

// Comparison data for baselines
export const MOCK_BASELINE_COMPARISON = [
    { method: 'Static 50-30-20', avgSavings: 18.5, stdDev: 2.1, violations: 0, color: '#94a3b8' },
    { method: 'Heuristic Rules', avgSavings: 21.2, stdDev: 3.4, violations: 2, color: '#f59e0b' },
    { method: 'Q-Learning', avgSavings: 24.8, stdDev: 2.8, violations: 4, color: '#06b6d4' },
    { method: 'DQN (Ours)', avgSavings: 26.3, stdDev: 2.5, violations: 3, color: '#6366f1' },
];
