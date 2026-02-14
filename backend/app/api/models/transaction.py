from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class TransactionBase(BaseModel):
    amount: float
    category: str
    description: Optional[str] = None
    date: datetime
    source: str = "manual"

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    transactionId: str
    userId: str
    createdAt: datetime = Field(default_factory=datetime.now)