from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.dependencies import get_db
from app.services.dashboard_service import (
    get_dashboard_summary,
    get_dashboard_charts,
    get_recent_activities
)

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/summary")
def dashboard_summary(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_dashboard_summary(db)

@router.get("/charts")
def dashboard_charts(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_dashboard_charts(db)

@router.get("/recent-activities")
def recent_activities(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_recent_activities(db)