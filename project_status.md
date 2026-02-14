# RL Budget Optimizer — Project Status & Run Guide

## Status vs Spec (by Phase)

| Phase                       | Spec Section | Status         | Notes                                                                                                                 |
| --------------------------- | ------------ | -------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Phase 1: Foundation**     | Week 1-2     | ✅ Done        | React frontend + FastAPI backend + Firebase Auth + Onboarding                                                         |
| **Phase 2: Core Features**  | Week 3-4     | ✅ Done        | Transaction CRUD, Dashboard with charts, CSV import, Budget storage                                                   |
| **Phase 3: RL Engine**      | Week 5-6     | ✅ Done        | `BudgetEnvironment` (Gymnasium), DQN agent (PyTorch), training script, data generator, trained model (`dqn_test.pth`) |
| **Phase 4: RL Integration** | Week 7-8     | ✅ Done        | RL suggestion endpoint, RLSuggestionPanel UI, feedback recording, model loading                                       |
| **Phase 5: Evaluation**     | Week 9-10    | ⬜ Not started | Baseline comparisons, experiment results, performance metrics                                                         |
| **Phase 6: Polish**         | Week 11-12   | ⬜ Not started | Cloud Run deployment, documentation, report, demo video                                                               |

### Component Breakdown

| Component                    | Spec Requirement                   | Implemented?                                                     |
| ---------------------------- | ---------------------------------- | ---------------------------------------------------------------- |
| **Frontend**                 |                                    |                                                                  |
| Landing page                 | `/`                                | ✅ `Landing.tsx`                                                 |
| Login / SignUp               | `/login`, `/signup`                | ✅ `Login.tsx`, `SignUp.tsx`                                     |
| Onboarding                   | `/onboarding`                      | ✅ `Onboarding.tsx` (with API call)                              |
| Dashboard                    | `/dashboard` with summary + charts | ✅ `Dashboard.tsx` (Recharts pie chart, KPI cards)               |
| Transactions                 | `/transactions` CRUD + CSV import  | ✅ `TransactionList.tsx`, `TransactionForm.tsx`, `ImportCSV.tsx` |
| History                      | `/history` with savings trend      | ✅ `HistoryView.tsx` (Recharts line chart)                       |
| Settings                     | `/settings`                        | ✅ `Settings.tsx` (with logout)                                  |
| RL Suggestion Panel          | Accept/Reject UI                   | ✅ Inline in `Dashboard.tsx`                                     |
| Sidebar / Navbar / AppLayout | Layout shell                       | ✅ `Sidebar.tsx`, `Navbar.tsx`, `AppLayout.tsx`                  |
| Auth Context (Firebase)      | Auth state management              | ✅ `AuthContext.tsx`                                             |
| **Backend**                  |                                    |                                                                  |
| FastAPI app                  | Main entry                         | ✅ `app/main.py`                                                 |
| User routes                  | `/api/users/*`                     | ✅ `routes/users.py`                                             |
| Transaction routes           | `/api/transactions/*`              | ✅ `routes/transactions.py`                                      |
| Budget routes                | `/api/budgets/*`                   | ✅ `routes/budgets.py`                                           |
| RL routes                    | `/api/rl/*`                        | ✅ `routes/rl.py`                                                |
| Firestore service            | DB operations                      | ✅ `services/firestore_service.py`                               |
| Auth dependency              | Token verification                 | ✅ `dependencies.py`                                             |
| **RL Engine**                |                                    |                                                                  |
| BudgetEnvironment            | 10-dim state, 9 actions, reward    | ✅ `rl_engine/environment.py`                                    |
| DQN Agent                    | Policy + Target net, replay buffer | ✅ `rl_engine/agents/dqn.py`                                     |
| Q-Learning Agent             | Tabular Q-Learning                 | ❌ Not found                                                     |
| Training script              | Training loop                      | ✅ `rl_engine/training.py`                                       |
| Synthetic data generator     | Test data                          | ✅ `rl_engine/data_generator.py`                                 |
| Trained model weights        | `.pth` file                        | ✅ `models/dqn_test.pth`                                         |
| **Infrastructure**           |                                    |                                                                  |
| Dockerfile                   | Backend containerization           | ⬜ Missing at backend root                                       |
| Deploy script                | Cloud Run deployment               | ✅ `deploy.sh`                                                   |
| Firebase Hosting             | Frontend deploy                    | ⬜ Not configured                                                |
| Firestore rules              | Security rules                     | ⬜ Not added                                                     |
| CI/CD (Cloud Build)          | Automated pipeline                 | ⬜ Not set up                                                    |

---

## How to Run Locally

### Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- A Firebase project with Authentication enabled (Email/Password + Google)
- A GCP project with Firestore enabled
- Firebase service account credentials JSON file

### 1. Frontend

```bash
cd frontend

# Create .env.local with your Firebase config
cat > .env.local << 'EOF'
VITE_API_BASE_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
EOF

# Install deps (already done) & run
npm run dev
# → Opens at http://localhost:5173
```

### 2. Backend

```bash
cd backend

# Create a Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env from example
cp .env.example .env
# Edit .env with your GCP project details:
#   PROJECT_ID=your-gcp-project
#   FIREBASE_CREDENTIALS_PATH=./path-to-service-account.json
#   STORAGE_BUCKET=your-bucket

# Run the API server
uvicorn app.main:app --reload --port 8000
# → API at http://localhost:8000
# → Swagger docs at http://localhost:8000/docs
```

### 3. RL Training (optional)

```bash
cd backend
source venv/bin/activate

# Run training script
python -m app.rl_engine.training
# This trains the DQN agent and saves weights to models/
```

---

## How to Test

### Frontend Build

```bash
cd frontend && npm run build
# Should complete with 0 errors (already verified ✅)
```

### Backend API

```bash
# Start backend, then test root endpoint:
curl http://localhost:8000/
# → {"message":"RL Budget Optimizer API","version":"1.0.0"}

# Interactive API docs:
open http://localhost:8000/docs
```

### End-to-End Flow

1. Start backend (`uvicorn app.main:app --reload --port 8000`)
2. Start frontend (`cd frontend && npm run dev`)
   > **Note**: If backend is unavailable or not configured, the frontend will automatically use mock data in dev mode.
3. Open `http://localhost:5173`
4. Sign up → Complete onboarding (sets income + risk preference)
5. Add transactions from the dashboard
6. View RL suggestions → Accept/Reject
7. Check History page for savings trends

> [!IMPORTANT]
> Both Firebase Auth and Firestore must be configured for the full flow. Without them, authentication and data persistence won't work.
