from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.dependencies import get_db
from app.schemas.compliance_check_schema import (
    ComplianceCheckCreate,
    ComplianceCheckResponse
)
from app.services.compliance_check_service import (
    create_compliance_check,
    get_all_compliance_checks
)

router = APIRouter(
    prefix="/compliance-checks",
    tags=["Compliance Checks"]
)


@router.post("/", response_model=ComplianceCheckResponse)
def create_check(
    compliance_check: ComplianceCheckCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return create_compliance_check(
        db,
        compliance_check,
        current_user
    )


@router.get("/", response_model=list[ComplianceCheckResponse])
def get_checks(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_all_compliance_checks(db)