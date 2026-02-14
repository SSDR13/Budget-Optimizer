from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class UserProfile(BaseModel):
    monthlyIncome: float
    currency: str = "INR"
    riskPreference: str  # conservative | moderate | aggressive
    onboardingComplete: bool = False

class UserSettings(BaseModel):
    notificationsEnabled: bool = True
    autoAcceptSuggestions: bool = False

class User(BaseModel):
    uid: str
    email: Optional[str] = None
    displayName: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.now)
    profile: Optional[UserProfile] = None
    settings: UserSettings = Field(default_factory=UserSettings)

class OnboardRequest(BaseModel):
    monthlyIncome: float
    currency: str = "INR"
    riskPreference: str