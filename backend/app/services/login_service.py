from sqlalchemy.orm import Session

from app.models.user import User
from app.auth.security import verify_password
from app.auth.jwt_handler import create_access_token


def login_user(db: Session, email: str, password: str):

    user = db.query(User).filter(User.email == email).first()

    if not user:
        return {"message": "User not found"}

    if not verify_password(password, user.password_hash):
        return {"message": "Invalid password"}

    access_token = create_access_token(
        data={
            "user_id": user.user_id,
            "email": user.email
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }