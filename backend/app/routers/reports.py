from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.dependencies import get_db
from app.services.report_service import get_compliance_report


router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.get("/compliance")
def compliance_report(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_compliance_report(db)