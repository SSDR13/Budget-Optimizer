from fastapi import APIRouter, Depends, HTTPException
from app.dependencies import get_current_user
from app.api.models.user import User, OnboardRequest, UserProfile
from app.services.firestore_service import db

router = APIRouter()

@router.post("/onboard")
async def onboard_user(data: OnboardRequest, user: dict = Depends(get_current_user)):
    uid = user["uid"]
    profile_data = {
        "profile": data.model_dump(),
        "uid": uid,
        "email": user.get("email"),
        "settings": {"notificationsEnabled": True, "autoAcceptSuggestions": False}
    }
    await db.create_user(uid, profile_data)
    return {"success": True, "userId": uid}

@router.get("/profile")
async def get_profile(user: dict = Depends(get_current_user)):
    db_user = await db.get_user(user["uid"])
    if db_user:
        return db_user
    return {"uid": user["uid"], "email": user.get("email"), "profile": {}}