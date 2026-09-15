#!/bin/sh
set -e

echo "Waiting for PostgreSQL database to be ready..."
python << 'EOF'
import os
import time
import psycopg2

database_url = os.getenv("DATABASE_URL", "postgresql://compliance_user:compliance_pass@db:5432/complianceguard")

for attempt in range(1, 31):
    try:
        conn = psycopg2.connect(database_url)
        conn.close()
        print("PostgreSQL is ready!")
        break
    except Exception as e:
        print(f"Waiting for database (attempt {attempt}/30)... {e}")
        time.sleep(2)
else:
    print("Database connection failed after 30 attempts.")
    exit(1)
EOF

echo "Ensuring initial database tables & seed data..."
python << 'EOF'
from app.database.database import SessionLocal, Base, engine
from app.models.user import User
from app.models.role import Role
from app.auth.security import hash_password
from datetime import datetime
import subprocess

# Ensure tables are created
Base.metadata.create_all(bind=engine)

db = SessionLocal()
try:
    # Ensure default roles exist
    roles = [
        (1, "Admin"),
        (2, "Compliance Officer"),
        (3, "Auditor"),
        (4, "Customer")
    ]
    for r_id, r_name in roles:
        existing_role = db.query(Role).filter(Role.role_id == r_id).first()
        if not existing_role:
            db.add(Role(role_id=r_id, role_name=r_name))
    db.commit()

    # Check if admin user exists
    admin = db.query(User).filter(User.email == "admin@complianceguard.com").first()
    if not admin:
        print("Creating default admin account (admin@complianceguard.com)...")
        new_admin = User(
            full_name="System Admin",
            email="admin@complianceguard.com",
            password_hash=hash_password("admin123"),
            phone_number="9876543210",
            role_id=1,
            is_active=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(new_admin)
        db.commit()
        print("Default admin created successfully.")

        # Run seed data script
        print("Running seed_data.py...")
        subprocess.run(["python", "seed_data.py"], check=True)
    else:
        print("Database already initialized with admin user.")
except Exception as err:
    print(f"Error during initialization/seed: {err}")
    db.rollback()
finally:
    db.close()
EOF

echo "Starting FastAPI server..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
