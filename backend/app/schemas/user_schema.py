from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    phone_number: Optional[str] = None
    role_id: int


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    role_id: Optional[int] = None


class UserStatusUpdate(BaseModel):
    is_active: bool


class UserResponse(BaseModel):
    user_id: int
    full_name: str
    email: EmailStr
    phone_number: Optional[str]
    role_id: int
    is_active: bool

    class Config:
        from_attributes = True