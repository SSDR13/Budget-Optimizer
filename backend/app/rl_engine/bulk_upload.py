import asyncio
import os
import sys
from datetime import datetime

# Add backend directory to path so we can import app modules
# Assuming this script is run from backend/app/rl_engine/
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

from app.services.firestore_service import db
from app.rl_engine.data_generator import generate_synthetic_data

async def bulk_upload():
    print("Generating synthetic data...")
    # Generate data for 5 users, 6 months each
    df, users = generate_synthetic_data(num_users=5, months_per_user=6, return_users=True)
    
    print(f"Generated {len(users)} users and {len(df)} transactions.")
    
    # 1. Upload Users
    print("Uploading Users...")
    for user in users:
        uid = user["uid"]
        user_doc = {
            "uid": uid,
            "email": f"{uid}@example.com",
            "displayName": f"Test User {uid[-4:]}",
            "createdAt": datetime.now(),
            "profile": {
                "monthlyIncome": user["monthlyIncome"],
                "currency": "INR",
                "riskPreference": user["riskPreference"],
                "onboardingComplete": True
            },
            "settings": {"notificationsEnabled": True, "autoAcceptSuggestions": False}
        }
        await db.create_user(uid, user_doc)
        print(f"  Created user: {uid}")

    # 2. Upload Transactions
    print("Uploading Transactions...")
    transactions = df.to_dict('records')
    
    count = 0
    for txn in transactions:
        # Convert string date to datetime object for Firestore
        date_str = txn["date"]
        txn["date"] = datetime.strptime(date_str, "%Y-%m-%d")
        txn["createdAt"] = datetime.now()
        txn["source"] = "synthetic"
        
        # Use the service to add (it generates a new ID, but links to userId correctly)
        await db.add_transaction(txn)
        count += 1
        if count % 50 == 0:
            print(f"  Uploaded {count}/{len(transactions)} transactions...")

    print("Bulk upload complete! 🚀")

if __name__ == "__main__":
    if not db.db:
        print("Error: Firestore not initialized. Check credentials.")
    else:
        asyncio.run(bulk_upload())