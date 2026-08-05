from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.auth.dependencies import get_current_user

from app.database.dependencies import get_db
from app.schemas.rule_schema import RuleCreate, RuleResponse, RuleUpdate
from app.services.rule_service import create_rule

from app.services.rule_service import (
    create_rule,
    get_all_rules,
    get_rule_by_id,
    update_rule
)
router = APIRouter(
    prefix="/rules",
    tags=["Compliance Rules"]
)


@router.post("/", response_model=RuleResponse)
def add_rule(
    rule: RuleCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return create_rule(
        db,
        rule,
        current_user
    )

@router.get("/", response_model=list[RuleResponse])
def get_rules(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_all_rules(db)

@router.get("/{rule_id}", response_model=RuleResponse)
def get_rule(
    rule_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_rule_by_id(db, rule_id)

@router.put("/{rule_id}", response_model=RuleResponse)
def edit_rule(
    rule_id: int,
    rule: RuleUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return update_rule(
        db,
        rule_id,
        rule
    )
@router.delete("/{rule_id}")
def remove_rule(
    rule_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return delete_rule(
        db,
        rule_id
    )