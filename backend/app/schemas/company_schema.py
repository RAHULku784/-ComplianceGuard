from typing import Optional

from pydantic import BaseModel


class CompanyCreate(BaseModel):
    company_name: str
    gstin: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None


class CompanyResponse(BaseModel):
    company_id: int
    company_name: str
    gstin: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    address: Optional[str]

    class Config:
        from_attributes = True