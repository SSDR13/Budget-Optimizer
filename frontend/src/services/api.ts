import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import type { Transaction, PeriodSummary, RLSuggestion, BudgetHistory } from './mockData';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Auth interceptor — attaches Bearer token when Firebase Auth is configured
apiClient.interceptors.request.use(async (config) => {
    // TODO: Integrate Firebase Auth token
    // const user = auth.currentUser;
    // if (user) {
    //   const token = await user.getIdToken();
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
});

// Response error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.error?.message || error.message;
        console.error('[API Error]', message);
        return Promise.reject(error);
    }
);

// ─── API Functions ──────────────────────────────────────────

export const api = {
    // User
    onboard: (data: { monthlyIncome: number; currency: string; riskPreference: string }) =>
        apiClient.post('/api/users/onboard', data),

    getProfile: () =>
        apiClient.get('/api/users/profile'),

    updateProfile: (data: Partial<{ monthlyIncome: number; riskPreference: string }>) =>
        apiClient.put('/api/users/profile', data),

    // Transactions
    getTransactions: (params?: { period?: string; limit?: number }) =>
        apiClient.get<{ transactions: Transaction[]; total: number }>('/api/transactions', { params }),

    createTransaction: (data: Omit<Transaction, 'transactionId' | 'userId' | 'createdAt' | 'source'>) =>
        apiClient.post<{ success: boolean; transactionId: string }>('/api/transactions', data),

    deleteTransaction: (id: string) =>
        apiClient.delete(`/api/transactions/${id}`),

    importCSV: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return apiClient.post('/api/transactions/import', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    // Summary
    getSummary: () =>
        apiClient.get<PeriodSummary>('/api/summary/current'),

    // Budgets
    getBudgetHistory: (months = 6) =>
        apiClient.get<{ budgets: BudgetHistory[] }>('/api/budgets/history', { params: { months } }),

    // RL
    getRLSuggestion: (modelType = 'dqn') =>
        apiClient.post<{ success: boolean; suggestion: RLSuggestion }>('/api/rl/suggest', { modelType, period: 'next' }),

    submitFeedback: (budgetId: string, action: 'accepted' | 'rejected' | 'modified') =>
        apiClient.post('/api/rl/feedback', { budgetId, action }),

    trainModel: (modelType: string, episodes = 500) =>
        apiClient.post('/api/rl/train', { modelType, episodes, usePersonalData: true }),

    getTrainingStatus: (jobId: string) =>
        apiClient.get(`/api/rl/train/${jobId}`),

    getModels: () =>
        apiClient.get('/api/rl/models'),
};

export default api;
