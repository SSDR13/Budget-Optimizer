from fastapi import APIRouter, Depends
from app.dependencies import get_current_user
from pydantic import BaseModel

router = APIRouter()

class SuggestionRequest(BaseModel):
    modelType: str = "dqn"
    period: str = "next"

@router.post("/suggest")
async def get_rl_suggestion(req: SuggestionRequest, user: dict = Depends(get_current_user)):
    # This is where the RL Inference engine will be called
    return {
        "success": True,
        "suggestion": {
            "reasoning": "RL Model not yet connected. Please train model first."
        }
    }

class FeedbackRequest(BaseModel):
    actionId: int
    feedback: str # "accepted" | "rejected"
    timestamp: str = None

@router.post("/feedback")
async def submit_feedback(req: FeedbackRequest, user: dict = Depends(get_current_user)):
    # In a real system, this would update the RL agent's replay buffer
    # For now, we just acknowledge receipt
    print(f"User {user['uid']} {req.feedback} action {req.actionId}")
    return {"success": True}