from datetime import date

from sqlalchemy.orm import Session

from app.models.user import User
from app.models.company import Company
from app.models.rule import Rule
from app.models.compliance_check import ComplianceCheck


def get_dashboard_summary(db: Session):

    total_users = db.query(User).count()

    total_companies = db.query(Company).count()

    total_rules = db.query(Rule).count()

    total_checks = db.query(ComplianceCheck).count()

    audits_completed = (
        db.query(ComplianceCheck)
        .filter(
            ComplianceCheck.status == "Completed"
        )
        .count()
    )

    open_risks = (
        db.query(ComplianceCheck)
        .filter(
            ComplianceCheck.status != "Completed",
            ComplianceCheck.due_date < date.today()
        )
        .count()
    )

    if total_checks == 0:
        compliance_score = 100
    else:
        compliance_score = round(
            (audits_completed / total_checks) * 100,
            2
        )

    return {
        "total_users": total_users,
        "total_companies": total_companies,
        "total_rules": total_rules,
        "total_checks": total_checks,
        "audits_completed": audits_completed,
        "open_risks": open_risks,
        "compliance_score": compliance_score
    }

def get_dashboard_charts(db: Session):

    weekly_performance = [
        {"week": "Week 1", "completed": 12},
        {"week": "Week 2", "completed": 20},
        {"week": "Week 3", "completed": 32},
        {"week": "Week 4", "completed": 45}
    ]

    completed = (
        db.query(ComplianceCheck)
        .filter(
            ComplianceCheck.status == "Completed"
        )
        .count()
    )

    pending = (
        db.query(ComplianceCheck)
        .filter(
            ComplianceCheck.status == "Pending"
        )
        .count()
    )

    overdue = (
        db.query(ComplianceCheck)
        .filter(
            ComplianceCheck.status == "Overdue"
        )
        .count()
    )

    return {
        "weekly_performance": weekly_performance,
        "compliance_status": {
            "completed": completed,
            "pending": pending,
            "overdue": overdue
        }
    }

def get_recent_activities(db: Session):

    recent_checks = (
        db.query(ComplianceCheck)
        .order_by(ComplianceCheck.check_id.desc())
        .limit(5)
        .all()
    )

    activities = []

    for check in recent_checks:

        if check.status == "Completed":
            activity_type = "success"
            message = f"{check.company_name} compliance check completed"

        elif check.status == "Overdue":
            activity_type = "danger"
            message = f"{check.company_name} compliance check is overdue"

        else:
            activity_type = "warning"
            message = f"{check.company_name} has a pending compliance check"

        activities.append({
            "check_id": check.check_id,
            "company_name": check.company_name,
            "status": check.status,
            "due_date": str(check.due_date) if check.due_date else None,
            "type": activity_type,
            "message": message
        })

    return activities