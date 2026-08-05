from fastapi import HTTPException
from sqlalchemy.orm import Session
from datetime import date
from app.models.compliance_check import ComplianceCheck
from app.models.rule import Rule
from app.models.user import User
from app.schemas.audit_schema import AuditCreate, AuditUpdate
def get_audit_detail(db: Session, audit_id: int):

    result = (
        db.query(
            ComplianceCheck,
            Rule,
            User
        )
        .join(
            Rule,
            Rule.rule_id == ComplianceCheck.rule_id
        )
        .join(
            User,
            User.user_id == ComplianceCheck.assigned_to
        )
        .filter(
            ComplianceCheck.check_id == audit_id
        )
        .first()
    )

    if not result:
        return None

    check, rule, user = result

    return {
        "audit_id": check.check_id,
        "rule_id": check.rule_id,
        "rule_name": rule.rule_name,
        "company_name": check.company_name,

        "assigned_to": check.assigned_to,
        "auditor": user.full_name,

        "due_date": check.due_date,
        "status": check.status,
        "risk_level": rule.severity,
        "remarks": check.remarks
    }


def create_audit(
    db: Session,
    audit: AuditCreate,
    current_user
):
    rule = (
        db.query(Rule)
        .filter(Rule.rule_id == audit.rule_id)
        .first()
    )

    if not rule:
        raise HTTPException(
            status_code=404,
            detail="Compliance rule not found."
        )

    new_audit = ComplianceCheck(
        rule_id=audit.rule_id,
        company_name=audit.company_name,
        assigned_to=current_user["user_id"],
        due_date=audit.due_date,
        status="Pending",
        remarks=audit.remarks
    )

    db.add(new_audit)
    db.commit()
    db.refresh(new_audit)

    return new_audit


def get_all_audits(db: Session):
    return (
        db.query(ComplianceCheck)
        .order_by(ComplianceCheck.check_id.desc())
        .all()
    )


def get_audit_by_id(
    db: Session,
    audit_id: int
):
    audit = (
        db.query(ComplianceCheck)
        .filter(ComplianceCheck.check_id == audit_id)
        .first()
    )

    if not audit:
        raise HTTPException(
            status_code=404,
            detail="Audit not found."
        )

    return audit


def update_audit(
    db: Session,
    audit_id: int,
    audit_data: AuditUpdate
):
    audit = (
        db.query(ComplianceCheck)
        .filter(ComplianceCheck.check_id == audit_id)
        .first()
    )

    if not audit:
        raise HTTPException(
            status_code=404,
            detail="Audit not found."
        )

    audit.status = audit_data.status

    if audit_data.due_date is not None:
        audit.due_date = audit_data.due_date

    if audit_data.remarks is not None:
        audit.remarks = audit_data.remarks

    db.commit()
    db.refresh(audit)

    return audit

def get_audit_list(db: Session):

    results = (
        db.query(
            ComplianceCheck,
            Rule,
            User
        )
        .join(
            Rule,
            ComplianceCheck.rule_id == Rule.rule_id
        )
        .outerjoin(
            User,
            ComplianceCheck.assigned_to == User.user_id
        )
        .order_by(
            ComplianceCheck.check_id.desc()
        )
        .all()
    )

    audits = []

    for check, rule, user in results:

        # Determine risk level
        if check.status == "Completed":
            risk_level = "Low"

        elif (
            check.due_date is not None
            and check.due_date < date.today()
        ):
            risk_level = "Critical"

        elif rule.severity == "Critical":
            risk_level = "Critical"

        elif rule.severity == "High":
            risk_level = "High"

        elif rule.severity == "Medium":
            risk_level = "Medium"

        else:
            risk_level = "Low"

        audits.append({
            "audit_id": check.check_id,
            "rule_name": rule.rule_name,
            "company_name": check.company_name,
            "auditor": user.full_name if user else "Unassigned",
            "status": check.status,
            "due_date": check.due_date,
            "risk_level": risk_level,
            "remarks": check.remarks
        })

    return audits