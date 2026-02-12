// Budget categories used throughout the app
export const CATEGORIES = ['food', 'rent', 'transport', 'shopping', 'entertainment', 'other', 'savings'] as const;
export type Category = typeof CATEGORIES[number];

// Category metadata
export const CATEGORY_CONFIG: Record<Category, { label: string; icon: string; color: string; tailwind: string }> = {
    food: { label: 'Food & Dining', icon: '🍽️', color: '#f59e0b', tailwind: 'cat-food' },
    rent: { label: 'Rent / Housing', icon: '🏠', color: '#6366f1', tailwind: 'cat-rent' },
    transport: { label: 'Transport', icon: '🚗', color: '#06b6d4', tailwind: 'cat-transport' },
    shopping: { label: 'Shopping', icon: '🛍️', color: '#f43f5e', tailwind: 'cat-shopping' },
    entertainment: { label: 'Entertainment', icon: '🎬', color: '#8b5cf6', tailwind: 'cat-entertainment' },
    other: { label: 'Other', icon: '📦', color: '#94a3b8', tailwind: 'cat-other' },
    savings: { label: 'Savings', icon: '💰', color: '#10b981', tailwind: 'cat-savings' },
};

// Risk preference options
export const RISK_PREFERENCES = [
    { value: 'conservative', label: 'Conservative', description: 'Prioritize safety, smaller budget changes', icon: '🛡️' },
    { value: 'moderate', label: 'Moderate', description: 'Balanced approach with moderate adjustments', icon: '⚖️' },
    { value: 'aggressive', label: 'Aggressive', description: 'Maximize savings, larger budget shifts', icon: '🚀' },
] as const;

export type RiskPreference = typeof RISK_PREFERENCES[number]['value'];

// RL model types
export const MODEL_TYPES = ['q_learning', 'dqn'] as const;
export type ModelType = typeof MODEL_TYPES[number];

// API base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Currency
export const DEFAULT_CURRENCY = 'INR';
export const CURRENCY_SYMBOL = '₹';
