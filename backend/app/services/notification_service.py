from datetime import date, timedelta

from sqlalchemy.orm import Session

from app.models.compliance_check import ComplianceCheck
from app.models.rule import Rule


def get_notifications(db: Session):

    today = date.today()
    upcoming_date = today + timedelta(days=7)

    checks = (
        db.query(ComplianceCheck)
        .filter(
            ComplianceCheck.status != "Completed"
        )
        .all()
    )

    notifications = []

    for check in checks:

        rule = (
            db.query(Rule)
            .filter(
                Rule.rule_id == check.rule_id
            )
            .first()
        )

        rule_name = (
            rule.rule_name
            if rule
            else "Compliance Check"
        )

        severity = (
            rule.severity
            if rule
            else "Medium"
        )


        # =====================================
        # OVERDUE
        # =====================================

        if (
            check.due_date is not None
            and check.due_date < today
        ):

            notifications.append({
                "id": f"overdue-{check.check_id}",
                "check_id": check.check_id,
                "title": "Compliance Check Overdue",
                "message": (
                    f"{rule_name} for "
                    f"{check.company_name} is overdue."
                ),
                "priority": "Critical",
                "type": "overdue",
                "due_date": str(check.due_date),
                "company_name": check.company_name,
                "rule_name": rule_name
            })

            # Don't create an additional
            # high-risk alert for same overdue audit
            continue


        # =====================================
        # HIGH / CRITICAL RISK
        # =====================================

        if severity in ["High", "Critical"]:

            notifications.append({
                "id": f"risk-{check.check_id}",
                "check_id": check.check_id,
                "title": "High Risk Compliance Alert",
                "message": (
                    f"{rule_name} for "
                    f"{check.company_name} has "
                    f"{severity.lower()} risk severity."
                ),
                "priority": severity,
                "type": "risk",
                "due_date": (
                    str(check.due_date)
                    if check.due_date
                    else None
                ),
                "company_name": check.company_name,
                "rule_name": rule_name
            })


        # =====================================
        # UPCOMING DEADLINE
        # =====================================

        if (
            check.due_date is not None
            and today <=
            check.due_date <=
            upcoming_date
        ):

            notifications.append({
                "id": f"upcoming-{check.check_id}",
                "check_id": check.check_id,
                "title": "Compliance Deadline Approaching",
                "message": (
                    f"{rule_name} for "
                    f"{check.company_name} is due soon."
                ),
                "priority": "Medium",
                "type": "upcoming",
                "due_date": str(check.due_date),
                "company_name": check.company_name,
                "rule_name": rule_name
            })


    # =====================================
    # PRIORITY SORTING
    # =====================================

    priority_order = {
        "Critical": 1,
        "High": 2,
        "Medium": 3,
        "Low": 4
    }

    notifications.sort(
        key=lambda item: priority_order.get(
            item["priority"],
            5
        )
    )

    return notifications