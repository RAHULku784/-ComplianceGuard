from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user_schema import (
    UserCreate,
    UserUpdate,
    UserStatusUpdate,
)
from app.auth.security import hash_password


def create_user(db: Session, user: UserCreate):

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password_hash=hash_password(user.password),
        phone_number=user.phone_number,
        role_id=user.role_id,
        is_active=True
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def get_all_users(db: Session):

    return (
        db.query(User)
        .order_by(User.user_id.desc())
        .all()
    )


def get_user_by_id(db: Session, user_id: int):

    user = (
        db.query(User)
        .filter(User.user_id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


def update_user(
    db: Session,
    user_id: int,
    user_data: UserUpdate
):

    user = get_user_by_id(db, user_id)

    update_data = user_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)

    return user


def update_user_status(
    db: Session,
    user_id: int,
    status_data: UserStatusUpdate
):

    user = get_user_by_id(db, user_id)

    user.is_active = status_data.is_active

    db.commit()
    db.refresh(user)

    return user