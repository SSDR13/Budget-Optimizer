import pandas as pd
import numpy as np
import random
import uuid
import os
from datetime import datetime, timedelta

CATEGORIES = ['food', 'rent', 'transport', 'shopping', 'entertainment', 'other']
VARIABLE_CATEGORIES = ['food', 'transport', 'shopping', 'entertainment', 'other']

def generate_synthetic_data(
    num_users=10, 
    months_per_user=12, 
    output_path="data/synthetic_transactions.csv",
    return_users=False
):
    """
    Generates synthetic transaction data for pre-training the RL model.
    
    Args:
        num_users (int): Number of unique users to simulate.
        months_per_user (int): Duration of history to generate per user.
        output_path (str): File path to save the CSV.
        return_users (bool): If True, returns a tuple (DataFrame, users_list).
    """
    print(f"Generating synthetic data for {num_users} users over {months_per_user} months...")
    
    all_transactions = []
    users_data = []
    
    for i in range(num_users):
        user_id = f"user_{uuid.uuid4().hex[:8]}"
        
        # Randomize User Profile
        # Income levels: Low, Medium, High, Very High
        monthly_income = random.choice([30000, 50000, 80000, 120000, 200000])
        
        # Spending Personality (0.0 = Frugal, 1.0 = Lavish)
        spending_personality = random.random()
        
        if return_users:
            risk = "moderate"
            if spending_personality > 0.7: risk = "aggressive"
            elif spending_personality < 0.3: risk = "conservative"
            
            users_data.append({
                "uid": user_id,
                "monthlyIncome": monthly_income,
                "riskPreference": risk,
                "spendingPersonality": spending_personality
            })

        # Date range: ending today, going back months_per_user
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30 * months_per_user)
        
        for m in range(months_per_user):
            # Approximate month date
            curr_month_date = start_date + timedelta(days=30 * m)
            month_str = curr_month_date.strftime("%Y-%m")
            
            # 1. Fixed Expense: Rent (20-40% of income)
            # Frugal people spend less on rent relative to income usually, or fixed.
            # Let's just randomize slightly.
            rent_ratio = 0.25 + (random.uniform(-0.05, 0.10))
            rent_amt = monthly_income * rent_ratio
            
            all_transactions.append({
                "transactionId": uuid.uuid4().hex,
                "userId": user_id,
                "date": f"{month_str}-01",
                "amount": round(rent_amt, 2),
                "category": "rent",
                "description": "Monthly Rent"
            })
            
            # 2. Variable Expenses
            # Calculate disposable income
            disposable = monthly_income - rent_amt
            
            # Target Savings Rate: Frugal (0.0) -> 40%, Lavish (1.0) -> 0%
            target_savings_rate = 0.40 * (1.0 - spending_personality)
            target_spending = disposable * (1.0 - target_savings_rate)
            
            # Distribute spending across variable categories
            # Base weights: Food, Trans, Shop, Ent, Other
            weights = np.array([0.35, 0.15, 0.20, 0.20, 0.10])
            
            # Adjust weights based on personality
            # Lavish people spend more on Shopping/Ent
            if spending_personality > 0.6:
                weights[2] += 0.15 # Shopping
                weights[3] += 0.15 # Ent
            
            # Normalize weights
            weights = weights / weights.sum()
            
            # Generate random number of transactions
            num_txns = random.randint(20, 50)
            
            for _ in range(num_txns):
                cat = np.random.choice(VARIABLE_CATEGORIES, p=weights)
                
                # Amount logic: Log-normal distribution to simulate real spending
                # Mean amount depends on category weight * total spending / num_txns
                avg_amt = (target_spending / num_txns)
                amt = np.random.lognormal(mean=np.log(avg_amt), sigma=0.6)
                
                day = random.randint(1, 28)
                
                all_transactions.append({
                    "transactionId": uuid.uuid4().hex,
                    "userId": user_id,
                    "date": f"{month_str}-{day:02d}",
                    "amount": round(amt, 2),
                    "category": cat,
                    "description": f"{cat.capitalize()} expense"
                })
                
    # Convert to DataFrame
    df = pd.DataFrame(all_transactions)
    
    # Save
    if os.path.dirname(output_path):
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
    df.to_csv(output_path, index=False)
    print(f"Generated {len(df)} transactions. Saved to {output_path}")
    if return_users:
        return df, users_data
    return df

if __name__ == "__main__":
    generate_synthetic_data()