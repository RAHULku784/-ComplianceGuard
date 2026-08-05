from sqlalchemy import Column, Integer, String, TIMESTAMP
from sqlalchemy.sql import func

from app.database.database import Base


class Company(Base):
    __tablename__ = "companies"

    company_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    company_name = Column(
        String(150),
        nullable=False,
        unique=True
    )

    gstin = Column(
        String(20),
        unique=True,
        nullable=True
    )

    email = Column(
        String(150),
        nullable=True
    )

    phone = Column(
        String(20),
        nullable=True
    )

    address = Column(
        String(300),
        nullable=True
    )

    created_at = Column(
        TIMESTAMP,
        server_default=func.now()
    )