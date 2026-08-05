from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.auth.security import (
    verify_password,
    hash_password,
)


def change_password(
    db: Session,
    user_id: int,
    current_password: str,
    new_password: str
):

    user = (
        db.query(User)
        .filter(User.user_id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )


    # Check current password

    if not verify_password(
        current_password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )


    # Prevent same password

    if verify_password(
        new_password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from current password"
        )


    # Hash new password

    user.password_hash = hash_password(
        new_password
    )

    db.commit()


    return {
        "message": "Password changed successfully"
    }