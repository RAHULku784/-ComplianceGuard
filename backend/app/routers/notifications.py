from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.dependencies import get_db
from app.services.notification_service import get_notifications


router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


@router.get("/")
def list_notifications(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_notifications(db)