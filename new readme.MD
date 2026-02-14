# RL Budget Optimizer - Capstone Project Specification

**Project:** Reinforcement Learning Budget Optimizer  
**Type:** Final Year Engineering Capstone Project  
**Tech Stack:** React + FastAPI + Google Cloud Platform + PyTorch  
**Last Updated:** February 12, 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Problem Statement & Objectives](#2-problem-statement--objectives)
3. [System Architecture](#3-system-architecture)
4. [RL Formulation (MDP Design)](#4-rl-formulation-mdp-design)
5. [Technology Stack](#5-technology-stack)
6. [Database Schema](#6-database-schema)
7. [API Specification](#7-api-specification)
8. [Frontend Specifications](#8-frontend-specifications)
9. [Backend Specifications](#9-backend-specifications)
10. [RL Engine Implementation](#10-rl-engine-implementation)
11. [Deployment Architecture](#11-deployment-architecture)
12. [Development Roadmap](#12-development-roadmap)
13. [Testing Strategy](#13-testing-strategy)
14. [Evaluation Metrics](#14-evaluation-metrics)
15. [Project Deliverables](#15-project-deliverables)

---


## 1. Project Overview

### 1.1 Core Concept
Traditional personal finance apps use static budget allocation rules (e.g., 50-30-20 rule). This project introduces **adaptive budget allocation** using Deep Reinforcement Learning that learns optimal category-wise budget modifications over time to maximize long-term savings while respecting user spending patterns.

### 1.2 Innovation
- First-of-its-kind personal RL-based budget optimizer for capstone demonstration
- Adaptive financial decision intelligence
- Comparison of Q-Learning vs Deep Q-Network (DQN)
- Production-ready web application with cloud deployment

### 1.3 Key Features
- User transaction import and categorization
- Real-time budget allocation suggestions powered by RL
- Interactive dashboard with accept/reject feedback loop
- Historical analysis and savings trend visualization
- Multi-baseline comparison (static rules vs RL)

---

## 2. Problem Statement & Objectives

### 2.1 Problem Statement
Static budgeting methods fail to adapt to:
- Changing income patterns
- Seasonal spending variations
- Life events (medical emergencies, festivals, travel)
- Individual user behavior and risk preferences

### 2.2 Objectives
1. Design and implement an RL environment that models personal budgeting as an MDP
2. Develop Q-Learning and DQN agents that learn optimal budget allocation policies
3. Build a full-stack web application with GCP deployment
4. Demonstrate 15-25% improvement in savings rate vs rule-based baselines
5. Create comprehensive evaluation comparing multiple approaches

### 2.3 Success Criteria
- Functional web app with authentication and transaction management
- Trained RL models (Q-Learning + DQN) with learning curves
- Experimental results showing improved savings over 12-period simulation
- Complete documentation and presentation for evaluation panel

---
## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Layer                          │
│                    (Browser / Mobile)                       │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React SPA)                    │
│  - Dashboard  - Auth  - Transaction Import  - RL Suggestions│
│              Hosted on: Firebase Hosting                    │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS / REST API
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                 Backend API (FastAPI)                       │
│  - Transaction CRUD    - RL Inference     - User Management │
│              Deployed on: Cloud Run (Container)             │
└─────────┬──────────────────────────────┬────────────────────┘
          │                              │
          ▼                              ▼
┌──────────────────────┐      ┌──────────────────────────────┐
│  Firestore Database  │      │   RL Engine (Python Module)  │
│  - users             │      │   - Environment (Gym-style)  │
│  - transactions      │      │   - Q-Learning Agent         │
│  - budgets           │      │   - DQN Agent (PyTorch)      │
│  - rl_policies       │      │   - Training Scripts         │
└──────────────────────┘      └──────────────┬───────────────┘
                                             │
                                             ▼
                              ┌──────────────────────────────┐
                              │   Cloud Storage              │
                              │   - Model Weights (.pth)     │
                              │   - Training Logs            │
                              │   - Experiment Results       │
                              └──────────────────────────────┘
```

### 3.2 Component Responsibilities

| Component | Responsibility | Technology |
|-----------|---------------|------------|
| Frontend | UI/UX, user interaction, visualization | React, Recharts, TailwindCSS |
| Backend API | Business logic, API endpoints, auth verification | FastAPI, Python 3.10+ |
| RL Engine | Environment simulation, agent training/inference | PyTorch, Gym, NumPy |
| Database | Persistent storage for users, transactions, budgets | Firestore (Native mode) |
| Auth | User authentication and session management | Firebase Auth |
| Storage | Model weights and experiment artifacts | Cloud Storage |
| Deployment | Container orchestration and HTTPS | Cloud Run |

---
## 4. RL Formulation (MDP Design)

### 4.1 State Space

**State Vector (dimension = 10):**

```python
state = [
    savings_rate,           # float [0, 1]: current savings / income
    income_normalized,      # float [0, 1]: income / max_income
    food_spent_pct,         # float [0, 1]: food_spent / income
    rent_spent_pct,         # float [0, 1]: rent_spent / income
    transport_spent_pct,    # float [0, 1]: transport_spent / income
    shopping_spent_pct,     # float [0, 1]: shopping_spent / income
    entertainment_spent_pct,# float [0, 1]: entertainment_spent / income
    other_spent_pct,        # float [0, 1]: other_spent / income
    risk_preference,        # int {0, 1, 2}: conservative=0, moderate=1, aggressive=2
    period_index            # int [0, 1]: normalized time in current period
]
```

**State Normalization:**
- All spending percentages normalized by current period income
- Risk preference one-hot encoded in implementation
- Continuous state space (suitable for DQN)

### 4.2 Action Space

**Discrete Actions (9 actions):**

| Action ID | Description | Effect |
|-----------|-------------|--------|
| 0 | No change | Keep current allocation |
| 1 | Reduce food by 5% to savings | food_budget *= 0.95 |
| 2 | Reduce transport by 5% to savings | transport_budget *= 0.95 |
| 3 | Reduce shopping by 10% to savings | shopping_budget *= 0.90 |
| 4 | Reduce entertainment by 10% to savings | entertainment_budget *= 0.90 |
| 5 | Reduce other by 5% to savings | other_budget *= 0.95 |
| 6 | Aggressive save: reduce all variable by 5% | All variable *= 0.95 |
| 7 | Conservative: increase discretionary by 5% | shopping, entertainment += 5% |
| 8 | Balance: small reduction across board | All variable *= 0.98 |

**Fixed Categories:** Rent/mortgage (not adjustable by RL)

### 4.3 Reward Function

The reward balances savings improvement with realistic behavior:

- Component 1: Savings improvement (+100 * delta)
- Component 2: Penalize deviation from historical pattern (-20 * L2_distance)
- Component 3: Hard constraint violations (-50 per violation)
- Component 4: Bonus for maintaining essentials (+10)

**Tuning Parameters:**
- α (savings weight): 100.0
- β (deviation penalty): 20.0
- γ (violation penalty): 50.0
- δ (essentials bonus): 10.0

### 4.4 Episode & Termination

- **Episode Length:** 12 periods (months) or 52 periods (weeks)
- **Termination Conditions:**
  - Max steps reached
  - Savings balance reaches target goal (early success)
  - Essential spending drops to critical level (failure)

---
## 5. Technology Stack

### 5.1 Frontend Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | React | 18.x |
| Build Tool | Vite | 5.x |
| Styling | TailwindCSS | 3.x |
| Charts | Recharts | 2.x |
| Routing | React Router | 6.x |
| State Management | React Context / Zustand | Latest |
| HTTP Client | Axios | Latest |
| Auth SDK | Firebase Auth | 10.x |
| Hosting | Firebase Hosting | - |

### 5.2 Backend Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | FastAPI | 0.110+ |
| Language | Python | 3.10+ |
| Validation | Pydantic | 2.x |
| Auth | Firebase Admin SDK | Latest |
| Database Client | google-cloud-firestore | 2.x |
| Storage Client | google-cloud-storage | 2.x |
| ML Framework | PyTorch | 2.x |
| RL Library | Gymnasium | 0.29+ |
| Container | Docker | Latest |
| Deployment | Google Cloud Run | - |

### 5.3 Google Cloud Services

| Service | Purpose | Configuration |
|---------|---------|---------------|
| Cloud Run | Backend API hosting | 2GB RAM, 1 vCPU |
| Firestore | Database (Native mode) | Multi-region (asia-south1) |
| Cloud Storage | Model weights storage | Standard storage class |
| Firebase Auth | User authentication | Google OAuth provider |
| Firebase Hosting | Frontend hosting | CDN with HTTPS |
| Cloud Build | CI/CD pipeline | Automated deployment |
| Secret Manager | API keys and secrets | Environment injection |

---

## 6. Database Schema

### 6.1 Firestore Collections

#### Collection: `users`

```javascript
{
  "uid": "string (Firebase Auth UID)",
  "email": "string",
  "displayName": "string",
  "createdAt": "timestamp",
  "profile": {
    "monthlyIncome": "number",
    "currency": "string (INR)",
    "riskPreference": "string (conservative | moderate | aggressive)",
    "onboardingComplete": "boolean"
  },
  "settings": {
    "notificationsEnabled": "boolean",
    "autoAcceptSuggestions": "boolean"
  }
}
```

#### Collection: `transactions`

```javascript
{
  "transactionId": "string (auto-generated)",
  "userId": "string (reference to users.uid)",
  "amount": "number",
  "category": "string (food | rent | transport | shopping | entertainment | other)",
  "description": "string",
  "date": "timestamp",
  "createdAt": "timestamp",
  "source": "string (manual | imported | auto)"
}
```

#### Collection: `budgets`

```javascript
{
  "budgetId": "string (auto-generated)",
  "userId": "string",
  "periodStart": "timestamp",
  "periodEnd": "timestamp",
  "periodType": "string (monthly | weekly)",
  "income": "number",
  "allocation": {
    "food": "number (percentage)",
    "rent": "number",
    "transport": "number",
    "shopping": "number",
    "entertainment": "number",
    "other": "number",
    "savings": "number"
  },
  "actualSpent": {
    "food": "number (actual amount)",
    "rent": "number"
    // ... same structure
  },
  "source": "string (manual | rl_suggested | accepted | baseline)",
  "rlModelVersion": "string (optional)",
  "accepted": "boolean",
  "createdAt": "timestamp"
}
```

#### Collection: `rl_policies`

```javascript
{
  "policyId": "string (auto-generated)",
  "userId": "string (null for global policy)",
  "modelType": "string (q_learning | dqn)",
  "version": "string (v1.0.0)",
  "trainedAt": "timestamp",
  "episodesTrained": "number",
  "finalReward": "number",
  "hyperparameters": {
    "learningRate": "number",
    "gamma": "number",
    "epsilon": "number",
    "batchSize": "number (DQN only)"
  },
  "modelPath": "string (gs://bucket/path/model.pth)",
  "performance": {
    "avgSavingsRate": "number",
    "avgDeviation": "number"
  },
  "isActive": "boolean"
}
```

### 6.2 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Transactions collection
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }

    // Budgets collection
    match /budgets/{budgetId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }

    // RL policies - read-only for users
    match /rl_policies/{policyId} {
      allow read: if request.auth != null;
      allow write: if false; // Only server can write
    }
  }
}
```

---

## 7. API Specification

### 7.1 Base Configuration

- **Development:** `http://localhost:8000`
- **Production:** `https://rl-budget-api-<hash>.run.app`
- **Authentication:** Bearer token in Authorization header

### 7.2 Core Endpoints

#### User Management

```http
POST /api/users/onboard
Headers: Authorization: Bearer <token>
Body: {
  "monthlyIncome": 50000,
  "currency": "INR",
  "riskPreference": "moderate"
}
Response: {"success": true, "userId": "uid123"}

GET /api/users/profile
Response: {"uid": "...", "email": "...", "profile": {...}}

PUT /api/users/profile
Body: {"monthlyIncome": 60000, "riskPreference": "aggressive"}
Response: {"success": true}
```

#### Transactions

```http
POST /api/transactions
Body: {
  "amount": 1500,
  "category": "food",
  "description": "Grocery shopping",
  "date": "2026-02-10T10:00:00Z"
}
Response: {"success": true, "transactionId": "txn123"}

GET /api/transactions?period=current&limit=50
Response: {"transactions": [...], "total": 50}

POST /api/transactions/import
Content-Type: multipart/form-data
Body: file=<csv_file>
Response: {"success": true, "imported": 127, "failed": 3}

DELETE /api/transactions/{transactionId}
Response: {"success": true}
```

#### Budget & Summary

```http
GET /api/summary/current
Response: {
  "period": {"start": "2026-02-01", "end": "2026-02-28"},
  "income": 50000,
  "totalSpent": 32000,
  "savingsRate": 0.36,
  "categoryBreakdown": {
    "food": {"spent": 8000, "budget": 10000, "percentage": 16.0},
    // ...
  }
}

GET /api/budgets/history?months=6
Response: {"budgets": [...]}
```

#### RL Suggestions

```http
POST /api/rl/suggest
Body: {"modelType": "dqn", "period": "next"}
Response: {
  "success": true,
  "suggestion": {
    "currentAllocation": {...},
    "suggestedAllocation": {...},
    "deltaAllocation": {...},
    "expectedSavingsIncrease": 0.07,
    "confidence": 0.85,
    "reasoning": "Based on your spending pattern..."
  }
}

POST /api/rl/feedback
Body: {"budgetId": "budget123", "action": "accepted"}
Response: {"success": true}
```

#### Training

```http
POST /api/rl/train
Body: {"modelType": "dqn", "episodes": 500, "usePersonalData": true}
Response: {"success": true, "jobId": "training_job_123", "status": "queued"}

GET /api/rl/train/{jobId}
Response: {"jobId": "...", "status": "completed", "results": {...}}

GET /api/rl/models
Response: {"models": [...]}
```

### 7.3 Error Response Format

```json
{
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Authentication token is invalid or expired",
    "details": {}
  },
  "timestamp": "2026-02-12T12:44:00Z"
}
```

Common error codes:
- `INVALID_TOKEN` (401)
- `FORBIDDEN` (403)
- `NOT_FOUND` (404)
- `VALIDATION_ERROR` (422)
- `INTERNAL_ERROR` (500)

---

## 8. Frontend Specifications

### 8.1 Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── SignUp.jsx
│   │   │   └── Onboarding.jsx
│   │   ├── dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── SummaryCard.jsx
│   │   │   ├── CategoryChart.jsx
│   │   │   └── RLSuggestionPanel.jsx
│   │   ├── transactions/
│   │   │   ├── TransactionList.jsx
│   │   │   ├── TransactionForm.jsx
│   │   │   └── ImportCSV.jsx
│   │   ├── history/
│   │   │   ├── HistoryView.jsx
│   │   │   ├── SavingsTrend.jsx
│   │   │   └── BudgetComparison.jsx
│   │   └── common/
│   │       ├── Navbar.jsx
│   │       └── LoadingSpinner.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── firebase.js
│   │   └── auth.js
│   ├── utils/
│   │   ├── formatters.js
│   │   └── constants.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env.local
```

### 8.2 Key Routes

| Route | Component | Description | Auth |
|-------|-----------|-------------|------|
| / | Landing | Marketing page | No |
| /login | Login | Firebase auth | No |
| /signup | SignUp | New user registration | No |
| /onboarding | Onboarding | Initial profile setup | Yes |
| /dashboard | Dashboard | Main budget overview | Yes |
| /transactions | TransactionList | View/add transactions | Yes |
| /history | HistoryView | Past budgets and trends | Yes |
| /settings | Settings | User profile settings | Yes |

### 8.3 Key Components

#### Dashboard Component

**Purpose:** Main view showing current period summary and RL suggestions

**State:**
```javascript
{
  summary: {income, totalSpent, savingsRate, categoryBreakdown},
  rlSuggestion: {...} | null,
  loading: boolean,
  error: string | null
}
```

**Layout:**
- Top: Period selector, income/spent/saved cards
- Middle: Category breakdown pie/bar charts
- Bottom: RL Suggestion Panel

#### RLSuggestionPanel Component

**Props:**
```javascript
{
  suggestion: {
    currentAllocation,
    suggestedAllocation,
    deltaAllocation,
    expectedSavingsIncrease,
    reasoning
  },
  onAccept, onReject, onModify
}
```

**UI:**
- Header with confidence badge
- Current vs Suggested comparison table
- Expected impact display
- Action buttons: Accept/Modify/Reject

### 8.4 Firebase Integration

**firebase.js:**
```javascript
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // ...
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
```

### 8.5 API Service Layer

**api.js:**
```javascript
import axios from 'axios';
import { auth } from './firebase';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

apiClient.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  getSummary: () => apiClient.get('/api/summary/current'),
  getTransactions: (params) => apiClient.get('/api/transactions', { params }),
  createTransaction: (data) => apiClient.post('/api/transactions', data),
  getRLSuggestion: (modelType) => apiClient.post('/api/rl/suggest', { modelType }),
  submitFeedback: (data) => apiClient.post('/api/rl/feedback', data),
  // ...
};
```

---

## 9. Backend Specifications

### 9.1 Project Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI app
│   ├── config.py               # Configuration
│   ├── dependencies.py         # Auth dependencies
│   ├── api/
│   │   ├── routes/
│   │   │   ├── users.py
│   │   │   ├── transactions.py
│   │   │   ├── budgets.py
│   │   │   └── rl.py
│   │   └── models/            # Pydantic models
│   │       ├── user.py
│   │       ├── transaction.py
│   │       └── rl.py
│   ├── services/
│   │   ├── firebase_service.py
│   │   ├── firestore_service.py
│   │   └── rl_service.py
│   ├── rl_engine/
│   │   ├── environment.py      # Gym environment
│   │   ├── agents/
│   │   │   ├── q_learning.py
│   │   │   └── dqn.py
│   │   ├── training.py
│   │   └── inference.py
│   └── utils/
│       ├── auth.py
│       └── helpers.py
├── tests/
├── scripts/
│   └── train_model.py
├── requirements.txt
├── Dockerfile
└── .env.example
```

### 9.2 FastAPI Main App

**main.py:**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import users, transactions, budgets, rl
from app.config import settings

app = FastAPI(
    title="RL Budget Optimizer API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(transactions.router, prefix="/api/transactions", tags=["transactions"])
app.include_router(budgets.router, prefix="/api/budgets", tags=["budgets"])
app.include_router(rl.router, prefix="/api/rl", tags=["rl"])

@app.get("/")
async def root():
    return {"message": "RL Budget Optimizer API", "version": "1.0.0"}
```

### 9.3 Configuration

**config.py:**
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_ID: str
    FIRESTORE_DATABASE: str = "(default)"
    STORAGE_BUCKET: str
    FIREBASE_CREDENTIALS_PATH: str
    CORS_ORIGINS: list[str] = ["http://localhost:5173"]
    DEFAULT_RL_MODEL: str = "dqn"
    ENV: str = "development"

    class Config:
        env_file = ".env"

settings = Settings()
```

### 9.4 Authentication Dependency

**dependencies.py:**
```python
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from firebase_admin import auth as firebase_auth

security = HTTPBearer()

async def get_current_user(credentials = Depends(security)) -> dict:
    try:
        token = credentials.credentials
        decoded = firebase_auth.verify_id_token(token)
        return {"uid": decoded["uid"], "email": decoded.get("email")}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")
```

### 9.5 Requirements

**requirements.txt:**
```
fastapi==0.110.0
uvicorn[standard]==0.27.0
pydantic==2.6.0
pydantic-settings==2.1.0
python-multipart==0.0.9
firebase-admin==6.4.0
google-cloud-firestore==2.14.0
google-cloud-storage==2.14.0
torch==2.2.0
numpy==1.26.3
gymnasium==0.29.1
pandas==2.2.0
```

---

## 10. RL Engine Implementation

### 10.1 Environment Core

**environment.py (key methods):**

```python
import gymnasium as gym
import numpy as np

class BudgetEnvironment(gym.Env):
    CATEGORIES = ['food', 'rent', 'transport', 'shopping', 
                  'entertainment', 'other', 'savings']

    def __init__(self, user_profile, historical_data, episode_length=12):
        self.user_profile = user_profile
        self.historical_data = historical_data
        self.episode_length = episode_length

        # State: [savings_rate, income_norm, ...category_pcts..., risk, period_idx]
        self.observation_space = gym.spaces.Box(
            low=0.0, high=1.0, shape=(10,), dtype=np.float32
        )

        # Action: 9 discrete actions
        self.action_space = gym.spaces.Discrete(9)

    def reset(self):
        self.current_step = 0
        self.savings_balance = 0.0
        self.current_allocation = self._get_historical_allocation()
        return self._build_state(), {}

    def step(self, action):
        new_allocation = self._apply_action(action)
        actual_spending = self._simulate_spending(new_allocation)

        savings_amount = self.income - sum(actual_spending.values())
        self.savings_balance += savings_amount

        reward = self._calculate_reward(...)
        self.current_step += 1
        done = self.current_step >= self.episode_length

        return self._build_state(), reward, done, False, {}

    def _apply_action(self, action):
        # Modify allocation based on action ID
        pass

    def _calculate_reward(self, ...):
        # Multi-component reward function
        pass
```

### 10.2 Q-Learning Agent

**agents/q_learning.py:**

```python
class QLearningAgent:
    def __init__(self, state_bins=10, n_actions=9, lr=0.1, gamma=0.95):
        self.q_table = np.zeros((state_bins, state_bins, n_actions))
        self.lr = lr
        self.gamma = gamma
        self.epsilon = 1.0

    def select_action(self, state, training=True):
        if training and np.random.random() < self.epsilon:
            return np.random.randint(self.n_actions)
        return np.argmax(self.q_table[...])

    def update(self, state, action, reward, next_state, done):
        # Q-learning update rule
        pass
```

### 10.3 DQN Agent

**agents/dqn.py:**

```python
import torch
import torch.nn as nn

class DQNetwork(nn.Module):
    def __init__(self, state_dim=10, action_dim=9):
        super().__init__()
        self.network = nn.Sequential(
            nn.Linear(state_dim, 128),
            nn.ReLU(),
            nn.Linear(128, 128),
            nn.ReLU(),
            nn.Linear(128, action_dim)
        )

    def forward(self, x):
        return self.network(x)

class DQNAgent:
    def __init__(self, state_dim=10, action_dim=9, lr=0.001, gamma=0.95):
        self.policy_net = DQNetwork(state_dim, action_dim)
        self.target_net = DQNetwork(state_dim, action_dim)
        self.optimizer = torch.optim.Adam(self.policy_net.parameters(), lr=lr)
        self.replay_buffer = deque(maxlen=10000)
        self.gamma = gamma

    def select_action(self, state, training=True):
        if training and random.random() < self.epsilon:
            return random.randint(0, self.action_dim - 1)
        with torch.no_grad():
            return self.policy_net(state).argmax().item()

    def update(self):
        # Sample batch, compute loss, backprop
        pass
```

### 10.4 Training Script

**training.py:**

```python
def train_agent(env, agent, num_episodes=500):
    episode_rewards = []

    for episode in range(num_episodes):
        state, _ = env.reset()
        episode_reward = 0
        done = False

        while not done:
            action = agent.select_action(state)
            next_state, reward, done, _, info = env.step(action)
            agent.update(state, action, reward, next_state, done)
            state = next_state
            episode_reward += reward

        episode_rewards.append(episode_reward)
        agent.decay_epsilon()

        if (episode + 1) % 50 == 0:
            print(f"Episode {episode+1}: Avg Reward = {np.mean(episode_rewards[-50:])}")

    return episode_rewards
```

---

## 11. Deployment Architecture

### 11.1 Dockerfile

```dockerfile
FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y build-essential

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app ./app

EXPOSE 8080

ENV PORT=8080

CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### 11.2 Cloud Run Deployment

**deploy.sh:**
```bash
#!/bin/bash

PROJECT_ID="your-project-id"
REGION="asia-south1"
SERVICE_NAME="rl-budget-api"
IMAGE="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

gcloud builds submit --tag ${IMAGE}

gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE} \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 1 \
  --set-env-vars "PROJECT_ID=${PROJECT_ID}"

echo "Deployed to Cloud Run!"
```

### 11.3 Frontend Deployment

**Firebase setup:**
```bash
npm install -g firebase-tools
firebase login
firebase init
npm run build
firebase deploy
```

**firebase.json:**
```json
{
  "hosting": {
    "public": "dist",
    "rewrites": [{"source": "**", "destination": "/index.html"}]
  },
  "firestore": {
    "rules": "firestore.rules"
  }
}
```

### 11.4 Environment Variables

**.env (Backend):**
```
PROJECT_ID=your-project-id
FIRESTORE_DATABASE=(default)
STORAGE_BUCKET=your-bucket
FIREBASE_CREDENTIALS_PATH=/secrets/firebase-creds.json
CORS_ORIGINS=["https://your-app.web.app"]
DEFAULT_RL_MODEL=dqn
ENV=production
```

**.env.local (Frontend):**
```
VITE_API_BASE_URL=https://rl-budget-api-xxx.run.app
VITE_FIREBASE_API_KEY=your-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

---

## 12. Development Roadmap

### Phase 1: Foundation (Week 1-2)

- [ ] Set up GCP project and Firebase
- [ ] Create Firestore database
- [ ] Initialize frontend React project
- [ ] Initialize backend FastAPI project
- [ ] Implement Firebase Authentication
- [ ] Create basic UI layout
- [ ] Implement user onboarding

### Phase 2: Core Features (Week 3-4)

- [ ] Implement transaction CRUD
- [ ] Build transaction UI
- [ ] Implement CSV import
- [ ] Create dashboard summary
- [ ] Build dashboard with charts
- [ ] Implement budget storage

### Phase 3: RL Engine (Week 5-6)

- [ ] Implement BudgetEnvironment
- [ ] Implement Q-Learning agent
- [ ] Implement DQN agent
- [ ] Create synthetic data generator
- [ ] Implement training scripts
- [ ] Train baseline models

### Phase 4: RL Integration (Week 7-8)

- [ ] Create RL service layer
- [ ] Implement suggestion endpoint
- [ ] Build RLSuggestionPanel UI
- [ ] Implement feedback recording
- [ ] Integrate model loading
- [ ] Test end-to-end RL workflow

### Phase 5: Evaluation (Week 9-10)

- [ ] Implement baseline algorithms
- [ ] Run comparative experiments
- [ ] Generate visualizations
- [ ] Collect performance metrics
- [ ] Document results

### Phase 6: Polish (Week 11-12)

- [ ] Deploy to Cloud Run and Firebase
- [ ] Write documentation
- [ ] Prepare presentation
- [ ] Record demo video
- [ ] Write project report
- [ ] Prepare for evaluation

---

## 13. Testing Strategy

### 13.1 Unit Tests

**Backend (pytest):**
```python
def test_environment_reset():
    env = BudgetEnvironment(profile, historical)
    state, _ = env.reset()
    assert state.shape == (10,)

def test_dqn_forward():
    agent = DQNAgent()
    state = torch.randn(1, 10)
    output = agent.policy_net(state)
    assert output.shape == (1, 9)
```

**Frontend (Vitest):**
```javascript
test('renders dashboard', async () => {
  render(<Dashboard />);
  await waitFor(() => {
    expect(screen.getByText(/Savings/i)).toBeInTheDocument();
  });
});
```

### 13.2 Integration Tests

- Full API workflows (transaction → summary)
- RL suggestion generation
- Feedback recording

### 13.3 E2E Tests

Use Playwright/Cypress:
- Sign up → onboard → add transactions → view dashboard
- Request RL suggestion → accept → verify update

---

## 14. Evaluation Metrics

### 14.1 RL Performance

| Metric | Description | Target |
|--------|-------------|--------|
| Avg Savings Rate | Mean savings over 12 periods | > 20% |
| Savings Improvement | vs 50-30-20 baseline | +15-25% |
| Allocation Deviation | L2 distance from historical | < 0.15 |
| Constraint Violations | % of episodes with violations | < 5% |
| Convergence Speed | Episodes to stable policy | < 300 |

### 14.2 Comparison Table

| Method | Avg Savings | Std Dev | Violations | Training Time |
|--------|-------------|---------|------------|---------------|
| Static 50-30-20 | 18.5% | 2.1% | 0% | N/A |
| Heuristic | 21.2% | 3.4% | 2% | N/A |
| Q-Learning | 24.8% | 2.8% | 4% | 15 min |
| DQN | 26.3% | 2.5% | 3% | 45 min |

### 14.3 Required Visualizations

1. Learning curves (episode reward vs episode)
2. Savings trend over 12 periods (all methods)
3. Action distribution histogram
4. State-value heatmap
5. Allocation comparison (radar chart)

---

## 15. Project Deliverables

### 15.1 Code Deliverables

1. **Source Code:**
   - Frontend React app
   - Backend FastAPI app
   - RL engine (environment + agents)
   - Training scripts
   - Deployment configs

2. **Documentation:**
   - README with setup
   - API docs (FastAPI auto-gen)
   - Architecture diagrams

### 15.2 Report Structure (50-70 pages)

1. Abstract
2. Introduction (problem, motivation, objectives)
3. Literature Review
4. System Design (architecture, tech stack, MDP)
5. Implementation (frontend, backend, RL)
6. Experimental Evaluation (setup, baselines, results)
7. Results and Discussion
8. Conclusion
9. References
10. Appendices

### 15.3 Presentation (15-20 slides)

- Title
- Problem statement (2)
- Literature review (1)
- System architecture (2-3)
- RL formulation (2)
- Implementation (3-4)
- Results (3-4)
- Demo (2)
- Conclusion (1)

### 15.4 Demo Video (5-7 minutes)

- System walkthrough
- Key features demo
- RL suggestion workflow
- Results visualization

### 15.5 Deployment

- Frontend: Firebase Hosting
- Backend: Cloud Run
- Database: Firestore production
- Demo credentials provided

---

## Getting Started Checklist

- [ ] Clone/create repositories
- [ ] Set up GCP project
- [ ] Create Firebase project
- [ ] Install tools (Node.js, Python, gcloud, Firebase CLI)
- [ ] Create .env files
- [ ] Initialize Firestore
- [ ] Set up dev environment
- [ ] Review this specification
- [ ] Start Phase 1

---

## Key Resources

- **FastAPI:** https://fastapi.tiangolo.com
- **React:** https://react.dev
- **PyTorch:** https://pytorch.org/docs
- **Gymnasium:** https://gymnasium.farama.org
- **Firebase:** https://firebase.google.com/docs
- **Cloud Run:** https://cloud.google.com/run/docs

---

**Document Version:** 1.0.0  
**Date:** February 12, 2026  
**Status:** Complete Specification

Good luck with your capstone project! 🚀
