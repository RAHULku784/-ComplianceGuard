from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.compliance_check import ComplianceCheck
from app.models.rule import Rule
from app.schemas.compliance_check_schema import ComplianceCheckCreate


def create_compliance_check(
    db: Session,
    compliance_check: ComplianceCheckCreate,
    current_user
):
    # Check if the compliance rule exists
    rule = (
        db.query(Rule)
        .filter(Rule.rule_id == compliance_check.rule_id)
        .first()
    )

    if not rule:
        raise HTTPException(
            status_code=404,
            detail="Compliance rule not found."
        )

    new_check = ComplianceCheck(
        rule_id=compliance_check.rule_id,
        company_name=compliance_check.company_name,
        assigned_to=current_user["user_id"],
        due_date=compliance_check.due_date,
        remarks=compliance_check.remarks
    )

    db.add(new_check)
    db.commit()
    db.refresh(new_check)

    return new_check


def get_all_compliance_checks(db: Session):
    return db.query(ComplianceCheck).all()