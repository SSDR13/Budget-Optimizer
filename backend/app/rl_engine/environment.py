import gymnasium as gym
import numpy as np
from gymnasium import spaces

class BudgetEnvironment(gym.Env):
    """
    Custom Environment that follows gymnasium interface.
    The goal is to optimize savings rate while respecting category constraints.
    """
    metadata = {"render_modes": ["human"]}

    def __init__(self, user_profile, historical_data=None):
        super(BudgetEnvironment, self).__init__()
        
        # State Space (10 dimensions):
        # [savings_rate, income_norm, food%, rent%, transport%, shopping%, ent%, other%, risk_pref, period_idx]
        # All values normalized between 0 and 1
        self.observation_space = spaces.Box(low=0, high=1, shape=(10,), dtype=np.float32)
        
        # Action Space (9 discrete actions):
        # 0: No change
        # 1-5: Reduce specific variable category by 5% (Food, Transport, Shop, Ent, Other)
        # 6: Aggressive Save (Reduce all variable by 5%)
        # 7: Conservative (Increase discretionary by 5% from savings)
        # 8: Balance (Reduce all variable by 2%)
        self.action_space = spaces.Discrete(9)
        
        self.user_profile = user_profile
        self.income = user_profile.get("monthlyIncome", 50000)
        
        # Map risk preference to a float value
        risk_map = {"conservative": 0.0, "moderate": 0.5, "aggressive": 1.0}
        self.risk_val = risk_map.get(user_profile.get("riskPreference", "moderate"), 0.5)
        
        self.max_steps = 12 # Simulate 12 months/periods
        self.current_step = 0
        
        # Initial allocation placeholders
        self.current_allocation = np.zeros(7) 

    def reset(self, seed=None, options=None):
        super().reset(seed=seed)
        self.current_step = 0
        
        # Initialize with a standard split if no history (Savings, Rent, Food, Trans, Shop, Ent, Other)
        # Example: 20% Savings, 30% Rent, 15% Food, 10% Trans, 10% Shop, 10% Ent, 5% Other
        self.current_allocation = np.array([0.20, 0.30, 0.15, 0.10, 0.10, 0.10, 0.05], dtype=np.float32)
        
        return self._get_obs(), {}

    def _get_obs(self):
        # Construct the state vector
        obs = np.concatenate([
            [self.current_allocation[0]], # Savings Rate
            [1.0],                        # Normalized Income (Constant for single episode)
            self.current_allocation[1:],  # Variable categories (skip Savings, include Rent)
            [self.risk_val],              # Risk Preference
            [self.current_step / self.max_steps] # Time progress
        ])
        return obs.astype(np.float32)

    def step(self, action):
        prev_savings = self.current_allocation[0]
        
        self._apply_action(action)
        
        # Re-normalize to ensure sum is 1.0 (100%)
        self.current_allocation = self.current_allocation / np.sum(self.current_allocation)
        
        new_savings = self.current_allocation[0]
        
        # Reward Calculation
        # 1. Reward for increasing savings
        reward = (new_savings - prev_savings) * 100
        
        # 2. Penalty if savings drop too low (hard constraint)
        if new_savings < 0.05:
            reward -= 50
            
        # 3. Penalty for extreme austerity (e.g., food < 5%)
        if self.current_allocation[2] < 0.05: 
            reward -= 20

        self.current_step += 1
        terminated = self.current_step >= self.max_steps
        truncated = False
        
        return self._get_obs(), reward, terminated, truncated, {}

    def _apply_action(self, action):
        # Indices: 0=Save, 1=Rent, 2=Food, 3=Trans, 4=Shop, 5=Ent, 6=Other
        alloc = self.current_allocation
        
        if action == 0: return # No change
        
        # Reduce specific category by 5% and move to savings
        if 1 <= action <= 5:
            idx = action + 1
            amount = alloc[idx] * 0.05
            alloc[idx] -= amount
            alloc[0] += amount
            
        elif action == 6: # Aggressive: Reduce all variable by 5%
            for i in range(2, 7):
                amount = alloc[i] * 0.05
                alloc[i] -= amount
                alloc[0] += amount
                
        elif action == 7: # Conservative: Increase discretionary
            # Take from savings to boost Shopping(4) and Ent(5)
            if alloc[0] > 0.05:
                amount = alloc[0] * 0.05
                alloc[0] -= amount
                alloc[4] += amount / 2
                alloc[5] += amount / 2
                
        elif action == 8: # Balance: Reduce all by 2%
            for i in range(2, 7):
                amount = alloc[i] * 0.02
                alloc[i] -= amount
                alloc[0] += amount