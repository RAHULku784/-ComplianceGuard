from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.dependencies import get_db

from app.schemas.password_schema import (
    ChangePasswordRequest
)

from app.services.password_service import (
    change_password
)


router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)


@router.put("/change-password")
def update_password(
    request: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return change_password(
        db=db,
        user_id=current_user["user_id"],
        current_password=request.current_password,
        new_password=request.new_password
    )