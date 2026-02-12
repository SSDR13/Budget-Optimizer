# RL Budget Optimizer 🚀

> **Adaptive Personal Finance Management powered by Deep Reinforcement Learning**

This capstone project introduces a novel approach to personal budgeting. Instead of static rules (like 50-30-20), our system uses **Deep Q-Networks (DQN)** to learn your spending patterns and automatically suggest optimal budget allocations to maximize savings.

---

## 🏗️ Tech Stack

### Frontend (Implemented)
- **Framework:** React 18 + TypeScript + Vite
- **Styling:** TailwindCSS 3.x (Dark Theme, Glassmorphism)
- **State Management:** Zustand
- **Visualization:** Recharts
- **Routing:** React Router v6

### Backend (Planned)
- **API:** FastAPI (Python 3.10+)
- **RL Engine:** PyTorch + Gymnasium
- **Database:** Google Firestore
- **Deployment:** Docker + Google Cloud Run

---

## 📂 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/          # Login, SignUp, Onboarding
│   │   ├── dashboard/     # Summary cards, charts, RL suggestion panel
│   │   ├── transactions/  # List, add form, CSV import
│   │   ├── history/       # Savings trend, model comparison
│   │   └── layout/        # Navbar, Sidebar, AppLayout
│   ├── services/          # API service layer (currently mocked)
│   ├── store/             # Zustand global store
│   └── utils/             # Formatters, constants, helpers
```

---

## ✨ Features Implemented (Frontend)

1.  **Smart Dashboard**:
    *   Real-time view of Income, Spending, and Savings Rate.
    *   **RL Suggestion Panel**: Shows AI-derived budget changes with confidence scores and reasoning.
    *   Interactive Visualizations: Spending distribution (Donut) & Budget vs Actual (Bar).

2.  **Adaptive Onboarding**:
    *   3-step wizard to capture Income, Currency, and Risk Preference (Conservative/Moderate/Aggressive).

3.  **Transaction Management**:
    *   Add/Delete transactions with category support.
    *   Filter by category (Food, Rent, Transport, etc.).
    *   Sort by Date/Amount.

4.  **Historical Analysis**:
    *   **Savings Trend**: 12-month interactive line chart.
    *   **Model Comparison**: Benchmarking RL methods against static rules.

5.  **Settings**:
    *   User profile management.
    *   RL Model configuration (Learning Rate, Gamma, etc.).

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm v9+

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/rl-budget-optimizer.git
    cd rl-budget-optimizer
    ```

2.  Navigate to frontend and install dependencies:
    ```bash
    cd frontend
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Note**: The app currently runs in **Mock Mode**, using realistic sample data for demonstration purposes until the Python backend is connected.

---

## 🔮 Next Steps

- [ ] Implement Backend (FastAPI)
- [ ] Build RL Environment (Gymnasium)
- [ ] Implement DQN Agent (PyTorch)
- [ ] Integrate Firebase Auth & Firestore
- [ ] Dockerize & Deploy
