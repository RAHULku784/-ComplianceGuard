from datetime import date
from typing import Optional

from pydantic import BaseModel


class ComplianceCheckCreate(BaseModel):
    rule_id: int
    company_name: str
    due_date: date
    remarks: Optional[str] = None


class ComplianceCheckUpdate(BaseModel):
    company_name: str
    due_date: date
    status: str
    remarks: Optional[str] = None


class ComplianceCheckResponse(BaseModel):
    check_id: int
    rule_id: int
    company_name: str
    assigned_to: int
    due_date: date
    status: str
    remarks: Optional[str]

    class Config:
        from_attributes = True