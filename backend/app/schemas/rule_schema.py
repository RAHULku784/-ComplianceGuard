from pydantic import BaseModel
from typing import Optional


class RuleCreate(BaseModel):
    rule_name: str
    description: Optional[str] = None
    category: str
    severity: str
    status: bool = True


class RuleResponse(BaseModel):
    rule_id: int
    rule_name: str
    description: Optional[str]
    category: str
    severity: str
    status: bool
    created_by: int

class Config:
    from_attributes = True

class RuleUpdate(BaseModel):
    rule_name: str
    description: Optional[str] = None
    category: str
    severity: str
    status: bool