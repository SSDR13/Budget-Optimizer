from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth, credentials, initialize_app
from app.config import settings
import os

security = HTTPBearer()

# Initialize Firebase Admin SDK
if os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
    cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
    try:
        initialize_app(cred)
    except ValueError:
        pass # Already initialized

async def get_current_user(token: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    # Development Bypass: If no creds file, return a mock user
    if settings.ENV == "development" and not os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
        return {"uid": "dev_user_123", "email": "dev@example.com"}
    
    try:
        decoded_token = auth.verify_id_token(token.credentials)
        return {"uid": decoded_token["uid"], "email": decoded_token.get("email")}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )