from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.dependencies import get_db

from app.schemas.audit_schema import (
    AuditCreate,
    AuditUpdate,
    AuditResponse,
    AuditListResponse,
    AuditDetailResponse
)

from app.services.audit_service import (
    create_audit,
    get_all_audits,
    get_audit_by_id,
    update_audit,
    get_audit_list,
    get_audit_detail
)


router = APIRouter(
    prefix="/audits",
    tags=["Audits"]
)


@router.post("/", response_model=AuditResponse)
def add_audit(
    audit: AuditCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return create_audit(
        db,
        audit,
        current_user
    )


@router.get("/", response_model=list[AuditResponse])
def list_audits(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_all_audits(db)

@router.get(
    "/frontend/list",
    response_model=list[AuditListResponse]
)
def frontend_audit_list(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_audit_list(db)


@router.get(
    "/{audit_id}",
    response_model=AuditDetailResponse
)
def get_audit(
    audit_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    audit = get_audit_detail(
        db,
        audit_id
    )

    if not audit:
        raise HTTPException(
            status_code=404,
            detail="Audit not found"
        )

    return audit

@router.put("/{audit_id}", response_model=AuditResponse)
def edit_audit(
    audit_id: int,
    audit: AuditUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return update_audit(
        db,
        audit_id,
        audit
    )

