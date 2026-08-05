from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.schemas.login_schema import LoginRequest
from app.services.login_service import login_user


router = APIRouter(
    prefix="/login",
    tags=["Authentication"]
)


# Normal JSON login - React frontend will use this
@router.post("/")
def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):
    return login_user(
        db,
        request.email,
        request.password
    )


# OAuth2 login - Swagger Authorize button will use this
@router.post("/token")
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    return login_user(
        db,
        form_data.username,
        form_data.password
    )