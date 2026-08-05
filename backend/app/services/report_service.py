from datetime import date

from sqlalchemy.orm import Session

from app.models.compliance_check import ComplianceCheck
from app.models.rule import Rule


def get_compliance_report(db: Session):

    checks = db.query(ComplianceCheck).all()

    total = len(checks)
    completed = 0
    pending = 0
    overdue = 0
    high_risk = 0

    # NEW: Risk distribution
    risk_distribution = {
        "Low": 0,
        "Medium": 0,
        "High": 0,
        "Critical": 0
    }

    # NEW: Company statistics
    company_stats = {}

    for check in checks:

        # -------------------------
        # AUDIT STATUS
        # -------------------------

        if check.status == "Completed":
            completed += 1
        else:
            pending += 1

        is_overdue = (
            check.status != "Completed"
            and check.due_date is not None
            and check.due_date < date.today()
        )

        if is_overdue:
            overdue += 1

        # -------------------------
        # RULE / RISK
        # -------------------------

        rule = (
            db.query(Rule)
            .filter(Rule.rule_id == check.rule_id)
            .first()
        )

        if rule:

            severity = rule.severity

            if severity in risk_distribution:
                risk_distribution[severity] += 1

            if (
                severity in ["High", "Critical"]
                and check.status != "Completed"
            ):
                high_risk += 1

        # -------------------------
        # COMPANY STATISTICS
        # -------------------------

        company_name = check.company_name

        if company_name not in company_stats:
            company_stats[company_name] = {
                "total": 0,
                "completed": 0,
                "pending": 0,
                "overdue": 0
            }

        company_stats[company_name]["total"] += 1

        if check.status == "Completed":
            company_stats[company_name]["completed"] += 1
        else:
            company_stats[company_name]["pending"] += 1

        if is_overdue:
            company_stats[company_name]["overdue"] += 1

    # -------------------------
    # OVERALL COMPLIANCE SCORE
    # -------------------------

    if total == 0:
        compliance_score = 100.0
    else:
        compliance_score = round(
            (completed / total) * 100,
            2
        )

    # -------------------------
    # COMPANY COMPLIANCE SCORE
    # -------------------------

    company_compliance = []

    for company_name, stats in company_stats.items():

        if stats["total"] == 0:
            score = 100.0
        else:
            score = round(
                (
                    stats["completed"]
                    / stats["total"]
                ) * 100,
                2
            )

        company_compliance.append({
            "company_name": company_name,
            "total_audits": stats["total"],
            "completed_audits": stats["completed"],
            "pending_audits": stats["pending"],
            "overdue_audits": stats["overdue"],
            "compliance_score": score
        })

    return {
        "total_audits": total,
        "completed_audits": completed,
        "pending_audits": pending,
        "overdue_audits": overdue,
        "high_risk_audits": high_risk,
        "compliance_score": compliance_score,

        # NEW
        "risk_distribution": risk_distribution,
        "company_compliance": company_compliance
    }