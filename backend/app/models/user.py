from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship, Mapped

from app.database.database import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String)
    email = Column(String, unique=True)
    password_hash = Column(String)
    phone_number = Column(String)
    role_id = Column(Integer)
    is_active = Column(Boolean)
    created_at = Column(TIMESTAMP)
    updated_at = Column(TIMESTAMP)

    #role = relationship("Role")