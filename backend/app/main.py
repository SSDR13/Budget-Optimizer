from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import users, transactions, budgets, rl
from app.config import settings

app = FastAPI(
    title="RL Budget Optimizer API",
    version="1.0.0"
)

# Configure CORS for frontend communication
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