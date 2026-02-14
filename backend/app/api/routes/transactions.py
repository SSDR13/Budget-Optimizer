from fastapi import APIRouter, Depends
from typing import List, Optional
from app.dependencies import get_current_user
from app.api.models.transaction import TransactionCreate, Transaction
from app.services.firestore_service import db
from datetime import datetime, timedelta
import calendar

router = APIRouter()

@router.post("/", response_model=dict)
async def create_transaction(txn: TransactionCreate, user: dict = Depends(get_current_user)):
    txn_data = txn.model_dump()
    txn_data["userId"] = user["uid"]
    txn_data["createdAt"] = datetime.now()
    
    txn_id = await db.add_transaction(txn_data)
    return {"success": True, "transactionId": txn_id}

@router.get("/", response_model=dict)
async def get_transactions(
    period: str = "current", 
    limit: int = 50, 
    category: Optional[str] = None,
    user: dict = Depends(get_current_user)
):
    uid = user["uid"]
    
    # Calculate date range
    now = datetime.now()
    start_date = None
    end_date = None
    
    if period == "current":
        start_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        _, last_day = calendar.monthrange(now.year, now.month)
        end_date = now.replace(day=last_day, hour=23, minute=59, second=59, microsecond=999999)
    elif period == "last_30":
        end_date = now
        start_date = now - timedelta(days=30)
        
    # Fetch transactions from Firestore
    raw_txns = await db.get_transactions(uid, start_date, end_date)
    
    # Filter by category if provided
    if category:
        raw_txns = [t for t in raw_txns if t.get("category") == category]
        
    # Sort by date descending
    raw_txns.sort(key=lambda x: x.get("date", datetime.min), reverse=True)
    
    return {"transactions": raw_txns[:limit], "total": len(raw_txns)}