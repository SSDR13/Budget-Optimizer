from google.cloud import firestore
from app.config import settings
import os

class FirestoreService:
    def __init__(self):
        # Initialize Firestore client
        # Checks for credentials file to allow local dev without crashing
        try:
            if os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
                 self.db = firestore.Client.from_service_account_json(
                    settings.FIREBASE_CREDENTIALS_PATH,
                    database=settings.FIRESTORE_DATABASE
                )
            else:
                print(f"Warning: Credentials not found at {settings.FIREBASE_CREDENTIALS_PATH}. Firestore disabled.")
                self.db = None
        except Exception as e:
            print(f"Error initializing Firestore: {e}")
            self.db = None

    async def get_user(self, uid: str):
        if not self.db: return None
        doc = self.db.collection("users").document(uid).get()
        return doc.to_dict() if doc.exists else None

    async def create_user(self, uid: str, data: dict):
        if not self.db: return
        self.db.collection("users").document(uid).set(data, merge=True)

    async def add_transaction(self, transaction_data: dict):
        if not self.db: return "mock-txn-id"
        doc_ref = self.db.collection("transactions").document()
        transaction_data["transactionId"] = doc_ref.id
        doc_ref.set(transaction_data)
        return doc_ref.id

    async def get_transactions(self, uid: str, start_date=None, end_date=None):
        if not self.db: return []
        
        try:
            ref = self.db.collection("transactions")
            query = ref.where("userId", "==", uid)
            
            if start_date:
                query = query.where("date", ">=", start_date)
            if end_date:
                query = query.where("date", "<=", end_date)
                
            docs = query.stream()
            return [doc.to_dict() for doc in docs]
        except Exception as e:
            print(f"Firestore query error: {e}")
            return []

db = FirestoreService()