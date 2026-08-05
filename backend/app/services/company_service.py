from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.company import Company
from app.schemas.company_schema import CompanyCreate


def create_company(
    db: Session,
    company: CompanyCreate
):
    existing_company = (
        db.query(Company)
        .filter(
            Company.company_name == company.company_name
        )
        .first()
    )

    if existing_company:
        raise HTTPException(
            status_code=400,
            detail="Company already exists."
        )

    new_company = Company(
        company_name=company.company_name,
        gstin=company.gstin,
        email=company.email,
        phone=company.phone,
        address=company.address
    )

    db.add(new_company)
    db.commit()
    db.refresh(new_company)

    return new_company


def get_all_companies(db: Session):
    return db.query(Company).all()