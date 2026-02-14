import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_ID: str = "rl-budget-optimizer"
    FIRESTORE_DATABASE: str = "(default)"
    STORAGE_BUCKET: str = "rl-budget-models"
    FIREBASE_CREDENTIALS_PATH: str = "firebase-creds.json"
    CORS_ORIGINS: List[str] = ["http://localhost:5173"]
    DEFAULT_RL_MODEL: str = "dqn"
    ENV: str = "development"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()