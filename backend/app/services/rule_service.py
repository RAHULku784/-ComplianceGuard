from sqlalchemy.orm import Session

from app.models.rule import Rule
from app.schemas.rule_schema import RuleCreate, RuleUpdate


def create_rule(
    db: Session,
    rule: RuleCreate,
    current_user: dict
):

    new_rule = Rule(
        rule_name=rule.rule_name,
        description=rule.description,
        category=rule.category,
        severity=rule.severity,
        status=rule.status,
        created_by=current_user["user_id"]
    )

    db.add(new_rule)
    db.commit()
    db.refresh(new_rule)

    return new_rule


def get_all_rules(db: Session):
    return db.query(Rule).all()

def update_rule(
    db: Session,
    rule_id: int,
    rule: RuleUpdate
):
    existing_rule = (
        db.query(Rule)
        .filter(Rule.rule_id == rule_id)
        .first()
    )

    if not existing_rule:
        return None

    existing_rule.rule_name = rule.rule_name
    existing_rule.description = rule.description
    existing_rule.category = rule.category
    existing_rule.severity = rule.severity
    existing_rule.status = rule.status

    db.commit()
    db.refresh(existing_rule)

    return existing_rule

def get_rule_by_id(db: Session, rule_id: int):
    return db.query(Rule).filter(Rule.rule_id == rule_id).first()

def delete_rule(
    db: Session,
    rule_id: int
):
    rule = (
        db.query(Rule)
        .filter(Rule.rule_id == rule_id)
        .first()
    )

    if not rule:
        return None

    rule.status = False

    db.commit()

    return {
        "message": "Rule deactivated successfully"
    }