from datetime import date
from typing import Optional

from pydantic import BaseModel


class AuditCreate(BaseModel):
    rule_id: int
    company_name: str
    due_date: date
    remarks: Optional[str] = None


class AuditUpdate(BaseModel):
    status: str
    due_date: Optional[date] = None
    remarks: Optional[str] = None


class AuditResponse(BaseModel):
    check_id: int
    rule_id: int
    company_name: str
    assigned_to: int
    due_date: Optional[date]
    status: str
    remarks: Optional[str]

    class Config:
        from_attributes = True

class AuditListResponse(BaseModel):
    audit_id: int
    rule_name: str
    company_name: str
    auditor: str
    status: str
    due_date: Optional[date]
    risk_level: str
    remarks: Optional[str]
    
class AuditDetailResponse(BaseModel):
    audit_id: int
    rule_id: int
    rule_name: str
    company_name: str

    assigned_to: int
    auditor: str

    due_date: Optional[date]
    status: str
    risk_level: str
    remarks: Optional[str]