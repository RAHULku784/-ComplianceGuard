from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.dependencies import get_db

from app.schemas.user_schema import (
    UserCreate,
    UserUpdate,
    UserStatusUpdate,
    UserResponse,
)

from app.services.user_service import (
    create_user,
    get_all_users,
    get_user_by_id,
    update_user,
    update_user_status,
)


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


# Create User
@router.post("/", response_model=UserResponse)
def add_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return create_user(db, user)


# List Users
@router.get("/", response_model=list[UserResponse])
def list_users(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_all_users(db)


# Get Single User
@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_user_by_id(
        db,
        user_id
    )


# Edit User
@router.put("/{user_id}", response_model=UserResponse)
def edit_user(
    user_id: int,
    user: UserUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return update_user(
        db,
        user_id,
        user
    )


# Activate / Deactivate User
@router.patch(
    "/{user_id}/status",
    response_model=UserResponse
)
def change_user_status(
    user_id: int,
    status_data: UserStatusUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return update_user_status(
        db,
        user_id,
        status_data
    )