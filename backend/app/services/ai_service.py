from datetime import date

from sqlalchemy.orm import Session

from app.models.compliance_check import ComplianceCheck
from app.models.rule import Rule


def get_risk_analysis(db: Session):

    checks = db.query(ComplianceCheck).all()

    total_checks = len(checks)

    completed_checks = 0
    pending_checks = 0
    overdue_checks = 0
    high_risk_checks = 0

    for check in checks:

        if check.status == "Completed":
            completed_checks += 1
        else:
            pending_checks += 1

        if (
            check.status != "Completed"
            and check.due_date is not None
            and check.due_date < date.today()
        ):
            overdue_checks += 1

        rule = (
            db.query(Rule)
            .filter(Rule.rule_id == check.rule_id)
            .first()
        )

        if (
            rule
            and rule.severity in ["High", "Critical"]
            and check.status != "Completed"
        ):
            high_risk_checks += 1

    if total_checks == 0:
        compliance_score = 100.0
    else:
        compliance_score = round(
            (completed_checks / total_checks) * 100,
            2
        )

    if overdue_checks >= 3 or high_risk_checks >= 3:
        overall_risk = "Critical"
    elif overdue_checks > 0 or high_risk_checks > 0:
        overall_risk = "High"
    elif pending_checks > 0:
        overall_risk = "Medium"
    else:
        overall_risk = "Low"

    recommendations = []

    if overdue_checks > 0:
        recommendations.append(
            "Resolve overdue compliance checks immediately."
        )

    if high_risk_checks > 0:
        recommendations.append(
            "Prioritize pending High and Critical severity compliance rules."
        )

    if pending_checks > 0:
        recommendations.append(
            "Review and complete pending audits before their due dates."
        )

    if overall_risk == "Low":
        recommendations.append(
            "Compliance performance is healthy. Continue regular monitoring."
        )

    return {
        "compliance_score": compliance_score,
        "overall_risk": overall_risk,
        "total_checks": total_checks,
        "completed_checks": completed_checks,
        "pending_checks": pending_checks,
        "overdue_checks": overdue_checks,
        "high_risk_checks": high_risk_checks,
        "recommendations": recommendations
    }

def generate_ai_response(
    db: Session,
    message: str
):
    analysis = get_risk_analysis(db)

    question = message.lower().strip()


    # OVERDUE
    if "overdue" in question:
        answer = (
            f"There are currently "
            f"{analysis['overdue_checks']} overdue compliance checks. "
            f"These should be reviewed immediately."
        )


    # PENDING
    elif "pending" in question:
        answer = (
            f"There are currently "
            f"{analysis['pending_checks']} pending compliance checks."
        )


    # COMPLETED
    elif "completed" in question:
        answer = (
            f"{analysis['completed_checks']} out of "
            f"{analysis['total_checks']} compliance checks "
            f"have been completed."
        )


    # RECOMMENDATIONS
    elif (
        "recommend" in question
        or "suggest" in question
        or "what should" in question
    ):
        recommendations = analysis["recommendations"]

        answer = "My recommendations are: " + " ".join(
            f"{index + 1}. {recommendation}"
            for index, recommendation
            in enumerate(recommendations)
        )


    # COMPLIANCE SCORE
    elif (
        "score" in question
        or "compliance" in question
    ):
        answer = (
            f"Your current compliance score is "
            f"{analysis['compliance_score']}%. "
            f"{analysis['completed_checks']} out of "
            f"{analysis['total_checks']} compliance checks "
            f"have been completed."
        )


    # RISK
    elif "risk" in question:
        answer = (
            f"Your overall compliance risk is "
            f"{analysis['overall_risk']}. "
            f"You currently have "
            f"{analysis['overdue_checks']} overdue checks and "
            f"{analysis['high_risk_checks']} high-risk checks."
        )


    # TOTAL AUDITS / CHECKS
    elif (
        "total" in question
        or "how many audit" in question
        or "how many check" in question
    ):
        answer = (
            f"There are currently "
            f"{analysis['total_checks']} compliance checks "
            f"in the system."
        )


    # SUMMARY / OVERVIEW
    elif (
        "summary" in question
        or "overview" in question
    ):
        answer = (
            f"ComplianceGuard currently has "
            f"{analysis['total_checks']} compliance checks. "
            f"{analysis['completed_checks']} are completed, "
            f"{analysis['pending_checks']} are pending, and "
            f"{analysis['overdue_checks']} are overdue. "
            f"The compliance score is "
            f"{analysis['compliance_score']}% and the overall "
            f"risk level is {analysis['overall_risk']}."
        )


    # DEFAULT
    else:
        answer = (
            f"ComplianceGuard currently reports a "
            f"{analysis['compliance_score']}% compliance score "
            f"with an overall risk level of "
            f"{analysis['overall_risk']}. "
            f"You can ask me about risks, pending audits, "
            f"completed audits, overdue checks, compliance "
            f"score, totals, summaries, or recommendations."
        )


    return {
        "answer": answer
    }