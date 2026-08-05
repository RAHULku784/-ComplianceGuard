from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.database.database import Base, engine
from app.routers.home import router as home_router
from app.routers.users import router as user_router
from app.routers.login import router as login_router
from fastapi import Depends
from app.auth.dependencies import get_current_user
from app.routers.rules import router as rules_router
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.user import User
from app.routers import password
from app.database.dependencies import get_db
from app.routers import (
    home,
    users,
    login,
    rules,
    compliance_checks,
    company,
    dashboard,
    audits,
    ai,
    reports,
    notifications

)

app = FastAPI(
    title="ComplianceGuard API",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)



@app.get("/db-test")
def test_database():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT NOW();"))
        return {
            "status": "Database Connected Successfully",
            "database_time": str(result.scalar())
        }


@app.get("/roles")
def get_roles():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT * FROM roles"))
        return [dict(row._mapping) for row in result]


@app.get("/all-users")
def get_all_users():
    with engine.connect() as connection:
        result = connection.execute(text("""
            SELECT user_id, full_name, email, role_id
            FROM users
        """))
        return [dict(row._mapping) for row in result]

@app.get("/user-passwords")
def get_user_passwords():
    with engine.connect() as connection:
        result = connection.execute(text("""
            SELECT user_id, email, password_hash
            FROM users
            ORDER BY user_id;
        """))
        return [dict(row._mapping) for row in result]

@app.get("/profile")
def profile(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.user_id == current_user["user_id"]
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "user_id": user.user_id,
        "full_name": user.full_name,
        "email": user.email,
        "phone_number": user.phone_number,
        "role_id": user.role_id,
        "is_active": user.is_active
    }

app.include_router(home.router)
app.include_router(users.router)
app.include_router(login.router)
app.include_router(rules.router)
app.include_router(compliance_checks.router)
app.include_router(company.router)
app.include_router(dashboard.router)
app.include_router(audits.router)
app.include_router(ai.router)
app.include_router(reports.router)
app.include_router(notifications.router)
app.include_router(password.router)