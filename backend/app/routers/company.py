from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.dependencies import get_db
from app.schemas.company_schema import (
    CompanyCreate,
    CompanyResponse
)
from app.services.company_service import (
    create_company,
    get_all_companies
)

router = APIRouter(
    prefix="/companies",
    tags=["Companies"]
)


@router.post("/", response_model=CompanyResponse)
def add_company(
    company: CompanyCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return create_company(db, company)


@router.get("/", response_model=list[CompanyResponse])
def get_companies(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_all_companies(db)