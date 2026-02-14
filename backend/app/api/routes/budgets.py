from fastapi import APIRouter, Depends
from app.dependencies import get_current_user
from app.services.firestore_service import db
from datetime import datetime, timedelta
import calendar

router = APIRouter()

@router.get("/summary/current")
async def get_current_summary(user: dict = Depends(get_current_user)):
    uid = user["uid"]
    
    # 1. Get User Profile for Income
    user_data = await db.get_user(uid)
    monthly_income = 0.0
    if user_data and "profile" in user_data:
        monthly_income = float(user_data["profile"].get("monthlyIncome", 0))
    
    # 2. Determine Date Range (Current Month)
    now = datetime.now()
    start_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    # Get last day of month
    _, last_day = calendar.monthrange(now.year, now.month)
    end_date = now.replace(day=last_day, hour=23, minute=59, second=59, microsecond=999999)
    
    # 3. Fetch Transactions
    transactions = await db.get_transactions(uid, start_date, end_date)
    
    # 4. Aggregate
    total_spent = 0.0
    category_breakdown = {}
    
    for txn in transactions:
        amount = float(txn.get("amount", 0))
        category = txn.get("category", "other")
        
        total_spent += amount
        
        if category not in category_breakdown:
            category_breakdown[category] = {"spent": 0.0, "budget": 0.0, "percentage": 0.0}
        
        category_breakdown[category]["spent"] += amount

    # Calculate percentages
    for cat, data in category_breakdown.items():
        if monthly_income > 0:
            data["percentage"] = round((data["spent"] / monthly_income) * 100, 1)
        
    savings_rate = 0.0
    if monthly_income > 0:
        savings_rate = ((monthly_income - total_spent) / monthly_income) * 100

    return {
        "period": {
            "start": start_date.strftime("%Y-%m-%d"), 
            "end": end_date.strftime("%Y-%m-%d")
        },
        "income": monthly_income,
        "totalSpent": round(total_spent, 2),
        "savingsRate": round(savings_rate, 2),
        "categoryBreakdown": category_breakdown
    }

@router.get("/history")
async def get_budget_history(months: int = 6, user: dict = Depends(get_current_user)):
    uid = user["uid"]
    
    # Calculate date range
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30 * months)
    
    # Fetch all transactions in range
    transactions = await db.get_transactions(uid, start_date, end_date)
    
    # Aggregate by month
    history = {}
    
    for txn in transactions:
        # Group by YYYY-MM
        if isinstance(txn["date"], str):
             d = datetime.strptime(txn["date"], "%Y-%m-%d")
        else:
             d = txn["date"] # Already datetime
             
        month_key = d.strftime("%Y-%m")
        
        if month_key not in history:
            history[month_key] = {"month": month_key, "spent": 0.0, "income": 0.0} # Income would ideally be historical too
            
        history[month_key]["spent"] += float(txn.get("amount", 0))

    # Get current profile income as baseline (simplification)
    user_data = await db.get_user(uid)
    base_income = float(user_data["profile"].get("monthlyIncome", 0)) if user_data else 0

    result = []
    for key in sorted(history.keys()):
        entry = history[key]
        entry["income"] = base_income
        entry["savings"] = max(0, base_income - entry["spent"])
        entry["savingsRate"] = round((entry["savings"] / base_income * 100), 1) if base_income > 0 else 0
        result.append(entry)
        
    return {"history": result}